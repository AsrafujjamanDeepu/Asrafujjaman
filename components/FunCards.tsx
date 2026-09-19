"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FaCat, FaLaughBeam, FaQuoteLeft, FaRedoAlt } from "react-icons/fa";

type FunType = "quote" | "joke" | "cat";

interface FunItem {
  text?: string;
  author?: string;
  setup?: string;
  punchline?: string;
  provider: string;
}

const keyOf = (item: FunItem | null) => item?.text ?? item?.setup;

/** Loads one item from /api/fun and lets the card ask for another. */
function useFun(type: FunType) {
  const [item, setItem] = useState<FunItem | null>(null);
  const [loading, setLoading] = useState(true);
  const latest = useRef(0);
  const shown = useRef<FunItem | null>(null);

  const load = useCallback(async () => {
    const id = ++latest.current;
    setLoading(true);
    let next: FunItem | null = null;
    // Ask twice at most if the API hands back the item that's already on screen.
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetch(`/api/fun?type=${type}`, { cache: "no-store" });
        if (!response.ok) break;
        next = (await response.json()) as FunItem;
      } catch {
        break;
      }
      if (keyOf(next) !== keyOf(shown.current)) break;
    }
    if (id !== latest.current) return; // a newer request superseded this one
    if (next) {
      shown.current = next;
      setItem(next);
    }
    setLoading(false);
  }, [type]);

  useEffect(() => {
    load();
  }, [load]);

  return { item, loading, load };
}

function Refresh({ label, onClick, disabled }: { label: string; onClick: () => void; disabled: boolean }) {
  return <button type="button" className="text-link" onClick={onClick} disabled={disabled}>{label} <FaRedoAlt aria-hidden="true" /></button>;
}

function Foot({ provider, children }: { provider?: string; children: React.ReactNode }) {
  return <div className="fun-foot">{children}{provider && <small>via {provider}</small>}</div>;
}

function QuoteCard() {
  const { item, loading, load } = useFun("quote");
  return (
    <article className={`fun-card fun-quote reveal ${loading ? "is-loading" : ""}`}>
      <p className="fun-label"><FaQuoteLeft aria-hidden="true" /> Random quote</p>
      <figure className="fun-body" aria-live="polite">
        {item ? <><blockquote>“{item.text}”</blockquote><figcaption>— {item.author}</figcaption></> : <blockquote>{loading ? "Finding a good one…" : "Couldn’t load a quote right now."}</blockquote>}
      </figure>
      <Foot provider={item?.provider}><Refresh label="New quote" onClick={load} disabled={loading} /></Foot>
    </article>
  );
}

function JokeCard() {
  const { item, loading, load } = useFun("joke");
  const [revealed, setRevealed] = useState(false);
  const another = () => {
    setRevealed(false);
    load();
  };
  return (
    <article className={`fun-card fun-joke reveal ${loading ? "is-loading" : ""}`}>
      <p className="fun-label"><FaLaughBeam aria-hidden="true" /> Programming joke</p>
      <div className="fun-body" aria-live="polite">
        {item ? (
          <>
            <p className="joke-setup">{item.setup}</p>
            {revealed && <p className="joke-punch">{item.punchline}</p>}
          </>
        ) : <p className="joke-setup">{loading ? "Warming up the comedy engine…" : "Couldn’t load a joke right now."}</p>}
      </div>
      <Foot provider={item?.provider}>
        {item && !revealed
          ? <button type="button" className="text-link" onClick={() => setRevealed(true)} disabled={loading}>Reveal punchline</button>
          : <Refresh label="Another joke" onClick={another} disabled={loading} />}
      </Foot>
    </article>
  );
}

function CatCard() {
  const { item, loading, load } = useFun("cat");
  return (
    <article className={`fun-card fun-cat reveal ${loading ? "is-loading" : ""}`}>
      <p className="fun-label"><FaCat aria-hidden="true" /> Cat fact</p>
      <div className="fun-body" aria-live="polite">
        <p className="fun-fact">{item ? item.text : loading ? "Petting the API…" : "Couldn’t load a fact right now."}</p>
      </div>
      <Foot provider={item?.provider}><Refresh label="Another fact" onClick={load} disabled={loading} /></Foot>
    </article>
  );
}

/** Three self-contained cards; render inside a grid. */
export default function FunCards() {
  return (
    <>
      <QuoteCard />
      <JokeCard />
      <CatCard />
    </>
  );
}
