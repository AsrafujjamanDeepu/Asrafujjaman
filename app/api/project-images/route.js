import { NextResponse } from "next/server";
import { getJson } from "../../../lib/http";

export const dynamic = "force-dynamic";

// Search themes live on the server (not in the request) so visitors can't burn
// the API quota with arbitrary queries. Keys must match `slug` in app/page.js.
const THEMES = {
  "ticket-portal": "bus travel city",
  "assignment-submission": "student writing notes",
  "virtual-mart": "online shopping",
  "clinic-management": "medical clinic",
  "student-management": "university campus",
  "study-tracker": "study desk planner"
};

const UTM = "utm_source=asrafujjaman_portfolio&utm_medium=referral";

async function fromUnsplash(query, key) {
  const data = await getJson(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&content_filter=high`,
    { headers: { Authorization: `Client-ID ${key}`, "Accept-Version": "v1" }, next: { revalidate: 86400 } }
  );
  const photo = data?.results?.[0];
  if (!photo) return null;
  return {
    url: photo.urls.regular,
    credit: { name: photo.user.name, url: `${photo.user.links.html}?${UTM}`, provider: "Unsplash", providerUrl: `https://unsplash.com/?${UTM}` }
  };
}

async function fromPexels(query, key) {
  const data = await getJson(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
    { headers: { Authorization: key }, next: { revalidate: 86400 } }
  );
  const photo = data?.photos?.[0];
  if (!photo) return null;
  return {
    url: photo.src.large,
    credit: { name: photo.photographer, url: photo.photographer_url, provider: "Pexels", providerUrl: "https://www.pexels.com" }
  };
}

// Set UNSPLASH_ACCESS_KEY or PEXELS_API_KEY (Unsplash wins if both exist).
// With neither, this returns no images and the cards keep their pastel style.
export async function GET() {
  const unsplash = process.env.UNSPLASH_ACCESS_KEY;
  const pexels = process.env.PEXELS_API_KEY;
  const search = unsplash ? (query) => fromUnsplash(query, unsplash) : pexels ? (query) => fromPexels(query, pexels) : null;

  const images = {};
  if (search) {
    const results = await Promise.all(Object.entries(THEMES).map(async ([slug, query]) => [slug, await search(query)]));
    for (const [slug, photo] of results) if (photo) images[slug] = photo;
  }

  const cache = Object.keys(images).length ? "public, s-maxage=86400, stale-while-revalidate=604800" : "public, s-maxage=60";
  return NextResponse.json({ images }, { headers: { "Cache-Control": cache } });
}
