import { NextResponse } from "next/server";
import { getJson } from "../../../lib/http";

export const dynamic = "force-dynamic";

const USERNAME = "AsrafujjamanDeepu";

// Powers the contribution heatmap. The community API below scrapes the public
// contribution calendar (GitHub's own REST API doesn't expose it) and returns
// { total: { lastYear }, contributions: [{ date, count, level }] }.
export async function GET() {
  const data = await getJson(
    `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`,
    { timeout: 8000, next: { revalidate: 21600 } }
  );

  const days = Array.isArray(data?.contributions)
    ? data.contributions.map(({ date, count, level }) => ({ date, count, level }))
    : [];
  const total = data?.total?.lastYear ?? days.reduce((sum, day) => sum + day.count, 0);

  // Don't let a temporary upstream failure get cached for hours.
  const cache = days.length ? "public, s-maxage=21600, stale-while-revalidate=86400" : "public, s-maxage=60";
  return NextResponse.json({ total, days }, { headers: { "Cache-Control": cache } });
}
