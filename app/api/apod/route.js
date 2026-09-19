import { NextResponse } from "next/server";
import { getJson } from "../../../lib/http";

export const dynamic = "force-dynamic";

// NASA "Astronomy Picture of the Day". Set NASA_API_KEY (free, 1,000 requests/hour);
// without it NASA's shared DEMO_KEY is used, which is heavily rate-limited.
export async function GET() {
  const key = process.env.NASA_API_KEY || "DEMO_KEY";
  const data = await getJson(
    `https://api.nasa.gov/planetary/apod?api_key=${encodeURIComponent(key)}&thumbs=true`,
    { timeout: 6000, next: { revalidate: 3600 } }
  );

  let apod = null;
  if (data?.title && data?.date) {
    const isVideo = data.media_type === "video";
    const image = isVideo ? data.thumbnail_url : data.url;
    apod = {
      title: data.title,
      date: data.date,
      explanation: data.explanation || "",
      image: image ? image.replace(/^http:/, "https:") : null,
      isVideo,
      link: `https://apod.nasa.gov/apod/ap${data.date.slice(2).replaceAll("-", "")}.html`,
      copyright: data.copyright ? data.copyright.replace(/\s+/g, " ").trim() : null
    };
  }

  const cache = apod ? "public, s-maxage=3600, stale-while-revalidate=86400" : "public, s-maxage=60";
  return NextResponse.json({ apod }, { headers: { "Cache-Control": cache } });
}
