import { NextResponse } from "next/server";

const USERNAME = "AsrafujjamanDeepu";
const WEATHER_LOCATION = "Dhaka";

export const revalidate = 300;

export async function GET() {
  try {
    const githubHeaders = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
    if (process.env.GITHUB_TOKEN) githubHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

    const [reposResponse, weatherResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=6`, { headers: githubHeaders, next: { revalidate: 300 } }),
      process.env.WEATHERAPI_KEY
        ? fetch(`https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHERAPI_KEY}&q=${WEATHER_LOCATION}&aqi=no`, { next: { revalidate: 600 } })
        : Promise.resolve(null)
    ]);

    const repos = reposResponse.ok ? (await reposResponse.json()).filter((repo) => !repo.fork).slice(0, 4).map((repo) => ({
      name: repo.name,
      description: repo.description || "A work-in-progress project.",
      url: repo.html_url,
      language: repo.language || "Code",
      stars: repo.stargazers_count,
      updatedAt: repo.updated_at
    })) : [];

    let weather = null;
    if (weatherResponse?.ok) {
      const data = await weatherResponse.json();
      weather = { city: data.location.name, temperature: Math.round(data.current.temp_c), condition: data.current.condition.text, icon: `https:${data.current.condition.icon}`, localTime: data.location.localtime };
    }

    return NextResponse.json({ repos, weather, updatedAt: new Date().toISOString() });
  } catch {
    return NextResponse.json({ repos: [], weather: null, updatedAt: new Date().toISOString() }, { status: 200 });
  }
}
