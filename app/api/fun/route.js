import { NextResponse } from "next/server";
import { getJson } from "../../../lib/http";

export const dynamic = "force-dynamic";

const pick = (list) => list[Math.floor(Math.random() * list.length)];
const OPTIONS = { cache: "no-store" };

// Quotable has had several long outages, so it gets a short timeout and two fallbacks.
async function quote() {
  const q = await getJson("https://api.quotable.io/quotes/random?tags=technology%7Cinspirational&maxLength=140", { ...OPTIONS, timeout: 2000 });
  const item = Array.isArray(q) ? q[0] : q;
  if (item?.content && item?.author) return { text: item.content, author: item.author, provider: "Quotable" };

  const d = await getJson("https://dummyjson.com/quotes/random", { ...OPTIONS, timeout: 3000 });
  if (d?.quote && d?.author) return { text: d.quote, author: d.author, provider: "DummyJSON" };
  return null;
}

async function joke() {
  const data = await getJson(
    "https://v2.jokeapi.dev/joke/Programming?safe-mode&type=twopart&blacklistFlags=nsfw,religious,political,racist,sexist,explicit",
    { ...OPTIONS, timeout: 3500 }
  );
  if (data && !data.error && data.setup && data.delivery) return { setup: data.setup, punchline: data.delivery, provider: "JokeAPI" };
  return null;
}

async function cat() {
  const data = await getJson("https://catfact.ninja/fact", { ...OPTIONS, timeout: 3500 });
  return data?.fact ? { text: data.fact, provider: "catfact.ninja" } : null;
}

// Shown when an upstream API is down or rate-limited, so the widgets never look broken.
const FALLBACK = {
  quote: [
    { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
    { text: "Simplicity is prerequisite for reliability.", author: "Edsger W. Dijkstra" },
    { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
    { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" }
  ],
  joke: [
    { setup: "Why do programmers prefer dark mode?", punchline: "Because light attracts bugs." },
    { setup: "Why did the developer go broke?", punchline: "Because he used up all his cache." },
    { setup: "How many programmers does it take to change a light bulb?", punchline: "None. That's a hardware problem." },
    { setup: "What's a programmer's favorite hangout place?", punchline: "Foo Bar." }
  ],
  cat: [
    { text: "Adult cats have 30 teeth, while kittens have 26 baby teeth." },
    { text: "A group of kittens is called a kindle." },
    { text: "Cats spend around two-thirds of their lives asleep." },
    { text: "A cat's nose has a ridge pattern that is unique to each cat, much like a human fingerprint." }
  ]
};

const handlers = { quote, joke, cat };

export async function GET(request) {
  const type = new URL(request.url).searchParams.get("type") ?? "";
  if (!Object.hasOwn(handlers, type)) return NextResponse.json({ error: "Unknown type" }, { status: 400 });

  const live = await handlers[type]();
  const body = live
    ? { ...live, source: "live" }
    : { ...pick(FALLBACK[type]), provider: "built-in", source: "fallback" };
  return NextResponse.json(body, { headers: { "Cache-Control": "no-store" } });
}
