"use client";

import { useEffect, useRef, useState } from "react";
import { FaRegMoon, FaSun } from "react-icons/fa";

function Arrow() {
  return (
    <span aria-hidden="true" className="arrow">
      ↗
    </span>
  );
}

const HIDE_DELAY = 2400;

/**
 * Fixed, auto-hiding nav. Visible on load, then fades out after a few
 * seconds of no mouse / touch / scroll / keyboard activity, and comes
 * back the moment the person touches the mouse or the screen again.
 * Hovering or focusing anything inside it, or opening the mobile menu,
 * keeps it pinned open.
 */
export default function NavBar({ t, lang, onToggleLang, theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const hideTimer = useRef(null);
  const hovering = useRef(false);

  useEffect(() => {
    function scheduleHide() {
      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => {
        if (!hovering.current && !menuOpen) setVisible(false);
      }, HIDE_DELAY);
    }
    function reveal() {
      setVisible(true);
      scheduleHide();
    }

    reveal();
    const opts = { passive: true };
    window.addEventListener("mousemove", reveal, opts);
    window.addEventListener("touchstart", reveal, opts);
    window.addEventListener("touchmove", reveal, opts);
    window.addEventListener("scroll", reveal, opts);
    window.addEventListener("keydown", reveal);

    return () => {
      clearTimeout(hideTimer.current);
      window.removeEventListener("mousemove", reveal, opts);
      window.removeEventListener("touchstart", reveal, opts);
      window.removeEventListener("touchmove", reveal, opts);
      window.removeEventListener("scroll", reveal, opts);
      window.removeEventListener("keydown", reveal);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      clearTimeout(hideTimer.current);
      setVisible(true);
    }
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div
      className={`nav-bar ${visible ? "nav-visible" : "nav-hidden"}`}
      onMouseEnter={() => {
        hovering.current = true;
        setVisible(true);
      }}
      onMouseLeave={() => {
        hovering.current = false;
      }}
    >
      <nav className="nav shell" aria-label="Main navigation">
        <a className="logo" href="#top" aria-label="Asrafujjaman home">
          Asrafujjaman<span>.</span>
        </a>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <a href="#work" onClick={closeMenu}>
            {t.navWork}
          </a>
          <a href="#about" onClick={closeMenu}>
            {t.navAbout}
          </a>
          <a href="#footer" onClick={closeMenu}>
            {t.navContact}
          </a>
          <a className="nav-cta nav-cta-mobile" href="#contact" onClick={closeMenu}>
            {t.navTalk} <Arrow />
          </a>
        </div>

        <div className="nav-right">
          <div className="nav-utility">
            <button type="button" className="switch-btn lang-switch" onClick={onToggleLang} aria-label={t.ariaLang}>
              <span className={lang === "en" ? "on" : ""}>EN</span>
              <span className={lang === "bn" ? "on" : ""}>বাং</span>
            </button>
            <button
              type="button"
              className="switch-btn theme-switch"
              onClick={onToggleTheme}
              aria-label={t.ariaTheme}
              aria-pressed={theme === "dark"}
            >
              {theme === "dark" ? <FaSun /> : <FaRegMoon />}
            </button>
            <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen}>
              {t.navMenu} <span>+</span>
            </button>
          </div>
          <a className="nav-cta nav-cta-desktop" href="#contact">
            {t.navTalk} <Arrow />
          </a>
        </div>
      </nav>
    </div>
  );
}
