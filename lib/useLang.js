"use client";

import { useCallback, useEffect, useState } from "react";
import { defaultLang, translations } from "./i18n";

export function useLang() {
  const [lang, setLang] = useState(defaultLang);

  useEffect(() => {
    const stored = window.localStorage.getItem("lang");
    if (stored === "en" || stored === "bn") setLang(stored);
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === "en" ? "bn" : "en";
      window.localStorage.setItem("lang", next);
      return next;
    });
  }, []);

  return [lang, toggleLang, translations[lang]];
}
