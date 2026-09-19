"use client";

import { useEffect, useState } from "react";

interface Apod {
  title: string;
  date: string;
  explanation: string;
  image: string | null;
  isVideo: boolean;
  link: string;
  copyright: string | null;
}

type State = { status: "loading" } | { status: "error" } | { status: "ready"; apod: Apod };

/** NASA Astronomy Picture of the Day, fetched through /api/apod (key stays server-side). */
export default function ApodCard() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/apod")
      .then((response) => response.json())
      .then((data: { apod: Apod | null }) => {
        if (!cancelled) setState(data.apod ? { status: "ready", apod: data.apod } : { status: "error" });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const apod = state.status === "ready" ? state.apod : null;
  const date = apod ? new Date(`${apod.date}T00:00:00Z`).toLocaleDateString("en-US", { dateStyle: "long", timeZone: "UTC" }) : "";

  return (
    <article className="apod-card reveal">
      <div className="apod-media">
        {apod?.image && <img src={apod.image} alt={apod.title} loading="lazy" />}
        {apod?.isVideo && <span className="apod-badge">Video</span>}
        {state.status === "loading" && <div className="apod-empty"><span className="pulse-dot" /> Contacting NASA...</div>}
        {state.status === "error" && <div className="apod-empty">Today&apos;s picture is out of orbit right now.</div>}
      </div>
      <div className="apod-body">
        <p className="eyebrow"><i /> NASA · Astronomy Picture of the Day</p>
        {apod ? (
          <>
            <h3>{apod.title}</h3>
            <p className="apod-meta">{date}{apod.copyright && ` · © ${apod.copyright}`}</p>
            <p className={`apod-text ${open ? "open" : ""}`}>{apod.explanation}</p>
            <div className="apod-actions">
              <button type="button" className="text-link" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? "Show less" : "Read more"}</button>
              <a className="text-link" href={apod.link} target="_blank" rel="noreferrer">View on NASA <span aria-hidden="true" className="arrow">↗</span></a>
            </div>
          </>
        ) : (
          <>
            <h3>{state.status === "loading" ? "Looking up…" : "The universe is still there."}</h3>
            <div className="apod-actions">
              <a className="text-link" href="https://apod.nasa.gov/apod/astropix.html" target="_blank" rel="noreferrer">Open NASA APOD <span aria-hidden="true" className="arrow">↗</span></a>
            </div>
          </>
        )}
      </div>
    </article>
  );
}
