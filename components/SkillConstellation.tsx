"use client";

import { useMemo, type CSSProperties } from "react";

export type SkillTier = "core" | "proficient";

export interface ConstellationSkill {
  name: string;
  tier: SkillTier;
}

interface NodeStyle extends CSSProperties {
  "--x": string;
  "--y": string;
  "--delay": string;
}

/**
 * Orbiting skill badges for the hero portrait.
 *
 * The previous markup hard-coded two CSS classes (.orbit-one / .orbit-two)
 * for seven badges, so five of them stacked invisibly on top of each other.
 * This component instead computes an even position for every skill around
 * an ellipse, so any number of skills can be added without touching CSS.
 * "core" skills (the ones called out as a specialization) get a larger,
 * pulsing badge; everything else gets a quieter secondary style.
 */
export default function SkillConstellation({ skills }: { skills: ConstellationSkill[] }) {
  const nodes = useMemo(() => {
    const total = skills.length;
    const radiusX = 58;
    const radiusY = 50;
    const startAngle = -110; // degrees, keeps the first node near the top-right like the original layout

    return skills.map((skill, index) => {
      const angle = (startAngle + (360 / total) * index) * (Math.PI / 180);
      const x = 50 + radiusX * Math.cos(angle);
      const y = 50 + radiusY * Math.sin(angle);
      return { ...skill, x, y, delay: index * 0.28 };
    });
  }, [skills]);

  return (
    <div className="constellation" aria-hidden="true">
      {nodes.map((node) => {
        const style: NodeStyle = {
          "--x": `${node.x}%`,
          "--y": `${node.y}%`,
          "--delay": `${node.delay}s`
        };
        return (
          <span key={node.name} className={`node node-${node.tier}`} style={style}>
            {node.tier === "core" && <i className="node-halo" />}
            {node.name}
          </span>
        );
      })}

      <style jsx>{`
        .constellation {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
        }
        .node {
          position: absolute;
          left: var(--x);
          top: var(--y);
          transform: translate(-50%, -50%);
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          border-radius: 999px;
          font-family: "DM Mono", monospace;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          pointer-events: auto;
          animation: node-float 6s ease-in-out infinite;
          animation-delay: var(--delay);
        }
        .node-core {
          padding: 11px 18px;
          font-size: 12px;
          font-weight: 600;
          color: #fff;
          background: var(--orange);
          box-shadow: 0 10px 24px -10px rgba(224, 90, 47, 0.65);
        }
        .node-proficient {
          padding: 8px 14px;
          font-size: 10.5px;
          font-weight: 500;
          color: var(--ink);
          background: rgba(250, 249, 245, 0.92);
          border: 1px solid rgba(19, 26, 21, 0.14);
          backdrop-filter: blur(6px);
        }
        .node-halo {
          position: absolute;
          inset: -7px;
          border-radius: 999px;
          border: 1px solid rgba(224, 90, 47, 0.55);
          animation: node-pulse 2.8s ease-out infinite;
          animation-delay: var(--delay);
        }
        @keyframes node-float {
          0%,
          100% {
            transform: translate(-50%, -50%) translateY(0);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-7px);
          }
        }
        @keyframes node-pulse {
          0% {
            transform: scale(0.86);
            opacity: 0.85;
          }
          100% {
            transform: scale(1.55);
            opacity: 0;
          }
        }
        @media (max-width: 860px) {
          .constellation {
            position: static;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            padding: 18px 2px 0;
            pointer-events: auto;
          }
          .node {
            position: static;
            transform: none;
            animation: none;
          }
          .node-halo {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
