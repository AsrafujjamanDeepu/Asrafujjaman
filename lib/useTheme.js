"use client";

import { useCallback, useEffect, useState } from "react";

// Light is always the default for a fresh visitor - see the blocking
// script in app/layout.js for how a *returning* visitor's stored choice
// is applied before first paint (avoids a light -> dark flash).
export function useTheme() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    setTheme(stored === "dark" ? "dark" : "light");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      window.localStorage.setItem("theme", next);
      return next;
    });
  }, []);

  return [theme, toggleTheme];
}
