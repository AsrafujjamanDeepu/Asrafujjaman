"use client";

import { useEffect, useRef, useState } from "react";

const STAR_LAYERS = [
  { count: 60, size: [1, 1.6], opacity: [0.35, 0.7], depth: 14, className: "star-layer star-layer-far" },
  { count: 40, size: [1.4, 2.1], opacity: [0.45, 0.85], depth: 30, className: "star-layer star-layer-mid" },
  { count: 22, size: [1.8, 2.8], opacity: [0.6, 1], depth: 52, className: "star-layer star-layer-near" }
];

function makeStars(count, sizeRange, opacityRange) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
    opacity: opacityRange[0] + Math.random() * (opacityRange[1] - opacityRange[0]),
    delay: Math.random() * 6,
    duration: 2.6 + Math.random() * 3
  }));
}

/**
 * Purely motion-based scroll effects (no page recoloring):
 *  - a thin reading-progress bar pinned to the very top of the viewport
 *  - a gentle parallax drift on any element marked data-parallax="<factor>"
 *  - a twinkling, parallaxing starfield that only shows itself in dark mode
 * Stars are generated client-side only (after mount) so the server-rendered
 * markup has none and there's nothing for hydration to mismatch on.
 */
export default function ScrollScenery() {
  const progressRef = useRef(null);
  const starTrackRefs = useRef([]);
  const ticking = useRef(false);
  const [starLayers, setStarLayers] = useState(null);

  useEffect(() => {
    setStarLayers(STAR_LAYERS.map((layer) => ({ ...layer, stars: makeStars(layer.count, layer.size, layer.opacity) })));
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function update() {
      ticking.current = false;

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (progressRef.current) progressRef.current.style.width = `${(progress * 100).toFixed(2)}%`;

      if (prefersReduced) return;

      starTrackRefs.current.forEach((el, i) => {
        if (!el) return;
        const depth = STAR_LAYERS[i].depth;
        el.style.transform = `translate3d(0, ${(progress * depth * -1).toFixed(1)}px, 0)`;
      });

      document.querySelectorAll("[data-parallax]").forEach((el) => {
        const factor = parseFloat(el.dataset.parallax) || 0;
        const offset = el.getBoundingClientRect().top * factor;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
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
  }, [starLayers]);

  return (
    <>
      <div className="scroll-progress-track" aria-hidden="true">
        <div className="scroll-progress" ref={progressRef} />
      </div>
      <div className="starfield" aria-hidden="true">
        {starLayers?.map((layer, i) => (
          <div className={layer.className} key={layer.className} ref={(el) => (starTrackRefs.current[i] = el)}>
            {layer.stars.map((star) => (
              <span
                key={star.id}
                className="star"
                style={{
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  "--o": star.opacity,
                  animationDelay: `${star.delay}s`,
                  animationDuration: `${star.duration}s`
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
