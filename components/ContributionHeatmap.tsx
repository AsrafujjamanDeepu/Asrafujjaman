"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface Day {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

type Status = "loading" | "ready" | "error";

const PROFILE_URL = "https://github.com/AsrafujjamanDeepu";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const parse = (date: string) => new Date(`${date}T00:00:00Z`);
const pretty = (date: string) => parse(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

function streaks(days: Day[]) {
  let longest = 0;
  let run = 0;
  for (const day of days) {
    run = day.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  // Current streak: today may still be empty, so start from yesterday in that case.
  let current = 0;
  let i = days.length - 1;
  if (i >= 0 && days[i].count === 0) i--;
  for (; i >= 0 && days[i].count > 0; i--) current++;
  return { longest, current };
}

/**
 * GitHub-style contribution heatmap, drawn natively (no iframe / image) so it
 * matches the site palette. Data comes from /api/contributions.
 */
export default function ContributionHeatmap() {
  const [status, setStatus] = useState<Status>("loading");
  const [days, setDays] = useState<Day[]>([]);
  const [total, setTotal] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/contributions")
      .then((response) => response.json())
      .then((data: { total: number; days: Day[] }) => {
        if (cancelled) return;
        if (data.days?.length) {
          setDays(data.days);
          setTotal(data.total);
          setStatus("ready");
        } else setStatus("error");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Pad the first column so day 1 lands on its weekday row (Sunday-first, like GitHub).
  const cells = useMemo(() => {
    if (!days.length) return [];
    const lead = parse(days[0].date).getUTCDay();
    return [...Array.from({ length: lead }, () => null), ...days] as (Day | null)[];
  }, [days]);
  const weekCount = Math.ceil(cells.length / 7);

  // One label per month, skipping any that would collide with the previous one.
  const monthLabels = useMemo(() => {
    const labels: { week: number; text: string }[] = [];
    let lastMonth = -1;
    let lastWeek = -10;
    for (let week = 0; week < weekCount; week++) {
      const first = cells.slice(week * 7, week * 7 + 7).find(Boolean);
      if (!first) continue;
      const month = parse(first.date).getUTCMonth();
      if (month !== lastMonth && week - lastWeek >= 3) {
        labels.push({ week, text: MONTHS[month] });
        lastWeek = week;
      }
      lastMonth = month;
    }
    return labels;
  }, [cells, weekCount]);

  const stats = useMemo(() => ({ ...streaks(days), active: days.filter((day) => day.count > 0).length }), [days]);

  useEffect(() => {
    // Show the most recent weeks first on narrow screens.
    if (status === "ready") scroller.current?.scrollTo({ left: scroller.current.scrollWidth });
  }, [status]);

  return (
    <div className="heatmap-card reveal">
      <div className="heatmap-head">
        <div>
          <p className="eyebrow"><i /> Contribution graph</p>
          <h3>
            {status === "ready" ? <><strong>{total.toLocaleString("en-US")}</strong> contributions in the last year</> : "Contributions in the last year"}
          </h3>
        </div>
        <a className="text-link" href={PROFILE_URL} target="_blank" rel="noreferrer">View on GitHub <span aria-hidden="true" className="arrow">↗</span></a>
      </div>

      {status === "loading" && <div className="repo-placeholder"><span className="pulse-dot" /> Loading contribution graph...</div>}
      {status === "error" && <div className="repo-placeholder">The contribution graph is unavailable right now. You can see it on my <a className="inline-link" href={PROFILE_URL} target="_blank" rel="noreferrer">GitHub profile</a>.</div>}

      {status === "ready" && (
        <>
          <div className="heatmap-scroll" ref={scroller}>
            <div className="heatmap-inner" role="img" aria-label={`GitHub contribution heatmap: ${total} contributions in the last year`}>
              <div className="hm-days" aria-hidden="true"><span /><span>Mon</span><span /><span>Wed</span><span /><span>Fri</span><span /></div>
              <div className="hm-main">
                <div className="hm-months" style={{ gridTemplateColumns: `repeat(${weekCount}, 1fr)` }} aria-hidden="true">
                  {monthLabels.map(({ week, text }) => <span key={week} style={{ gridColumn: week + 1 }}>{text}</span>)}
                </div>
                <div className="hm-grid" aria-hidden="true">
                  {cells.map((cell, index) => cell
                    ? <span key={cell.date} className={`hm-cell hm-${cell.level}`} title={`${cell.count ? `${cell.count} contribution${cell.count === 1 ? "" : "s"}` : "No contributions"} on ${pretty(cell.date)}`} />
                    : <span key={`pad-${index}`} className="hm-cell hm-none" />)}
                </div>
              </div>
            </div>
          </div>

          <div className="heatmap-foot">
            <div className="heatmap-stats">
              <div><strong>{stats.active}</strong><span>active days</span></div>
              <div><strong>{stats.longest}</strong><span>longest streak</span></div>
              <div><strong>{stats.current}</strong><span>current streak</span></div>
            </div>
            <div className="heatmap-legend" aria-hidden="true">
              <span>Less</span>{[0, 1, 2, 3, 4].map((level) => <i key={level} className={`hm-cell hm-${level}`} />)}<span>More</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
