"use client";

import { useEffect, useRef } from "react";

// Each blob drifts a different distance as the page scrolls (parallax),
// on top of its own slow, independent ambient float so the scene still
// feels alive even before anyone scrolls.
const BLOBS = [
  { className: "blob blob-a", depth: 160 },
  { className: "blob blob-b", depth: -200 },
  { className: "blob blob-c", depth: 110 },
  { className: "blob blob-d", depth: -130 }
];

export default function ScrollScenery() {
  const rootRef = useRef(null);
  const trackRefs = useRef([]);
  const ticking = useRef(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function update() {
      ticking.current = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (rootRef.current) rootRef.current.style.setProperty("--p", progress.toFixed(4));
      if (!prefersReduced) {
        trackRefs.current.forEach((el, i) => {
          if (!el) return;
          const offset = (progress * BLOBS[i].depth).toFixed(1);
          el.style.transform = `translate3d(0, ${offset}px, 0)`;
        });
      }
    }

    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="scenery" aria-hidden="true" ref={rootRef}>
      {BLOBS.map((blob, i) => (
        <div className="blob-track" key={blob.className} ref={(el) => (trackRefs.current[i] = el)}>
          <span className={blob.className} />
        </div>
      ))}
    </div>
  );
}
