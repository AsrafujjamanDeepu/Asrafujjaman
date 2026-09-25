"use client";

import { useEffect, useState } from "react";
import { FaGithub, FaLinkedinIn, FaFacebookF, FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import SkillConstellation from "../components/SkillConstellation";
import ContributionHeatmap from "../components/ContributionHeatmap";
import ApodCard from "../components/ApodCard";
import FunCards from "../components/FunCards";
import NavBar from "../components/NavBar";
import ScrollScenery from "../components/ScrollScenery";
import { useLang } from "../lib/useLang";
import { useTheme } from "../lib/useTheme";

const projects = [
  { slug: "ticket-portal", href: "https://github.com/AsrafujjamanDeepu/TicketPortal", title: "Ticket Portal", type: "Full-stack booking platform", description: "A bus-ticket booking experience combining RESTful APIs with a responsive, user-focused interface.", tags: ["C#", "ASP.NET Core API", "EF Core", "Angular", "React"], mark: "01" },
  { slug: "assignment-submission", href: "https://github.com/AsrafujjamanDeepu/AssignmentSubmissionSystem", title: "Assignment Submission System", type: "Academic workflow platform", description: "A role-based application for managing assignments and submissions across academic teams.", tags: ["Next.js", "TypeScript", "React", "MongoDB", "ASP.NET Core"], mark: "02" },
  { slug: "virtual-mart", href: "https://github.com/AsrafujjamanDeepu/VirtualMart", title: "Virtual Mart", type: "E-commerce platform", description: "A full-stack online marketplace with secure authentication and real-time capabilities.", tags: ["Node.js", "MongoDB", "WebSocket", "JavaScript"], mark: "03" },
  { slug: "clinic-management", href: "https://github.com/AsrafujjamanDeepu/ClinicManagementSystem", title: "Clinic Management System", type: "Operations dashboard", description: "A database-driven system for streamlining patient appointments and clinic workflows.", tags: ["ASP.NET Core", "SQL Server", "Razor", "EF Core"], mark: "04" },
  { slug: "student-management", href: "https://github.com/AsrafujjamanDeepu/StudentManagementSystem", title: "Student Management System", type: "Data management app", description: "A clean, practical student information system powered by a focused Razor interface.", tags: ["ASP.NET MVC", "Entity Framework", "SQL Server"], mark: "05" },
  { slug: "study-tracker", href: "https://github.com/AsrafujjamanDeepu/Study_Tracker_Python", title: "Study Tracker", type: "Desktop learning tool", description: "A focused Python tool for organizing study sessions and tracking momentum.", tags: ["Python", "Tkinter", "Canvas"], mark: "06" }
];

// Skills called out as a specialization get the "core" tier; everything
// else that's still hands-on experience gets "proficient". Used by both
// the hero constellation and the Toolbox section below so the two stay
// in sync.
const heroSkills = [
  { name: "React", tier: "core" },
  { name: "TypeScript", tier: "core" },
  { name: "ASP.NET Core", tier: "core" },
  { name: "Next.js", tier: "core" },
  { name: "C#", tier: "core" },
  { name: "MongoDB", tier: "core" },
  { name: "Angular", tier: "core" },
  { name: "SQL Server", tier: "core" },
  { name: "Web API", tier: "core" },
  { name: "EF Core", tier: "core" }
];

const skillGroups = [
  { category: "Languages", items: [
    { name: "C#", tier: "core" }, { name: "SQL", tier: "core" }, { name: "TypeScript", tier: "core" },
    { name: "JavaScript", tier: "proficient" }, { name: "Python", tier: "proficient" }, { name: "C", tier: "core" }
  ] },
  { category: "Backend", items: [
    { name: "ASP.NET Core", tier: "core" }, { name: "Web API", tier: "core" }, { name: "Entity Framework Core", tier: "core" },
    { name: "ASP.NET MVC", tier: "core" }, { name: "ADO.NET", tier: "core" }, { name: "Node.js", tier: "core" },
    { name: "Express.js", tier: "proficient" }
  ] },
  { category: "Frontend", items: [
    { name: "React", tier: "core" }, { name: "Angular", tier: "core" }, { name: "Next.js", tier: "core" },
    { name: "Razor Pages", tier: "core" }, { name: "Tailwind CSS", tier: "proficient" }, { name: "Bootstrap", tier: "core" },
    { name: ".NET MAUI", tier: "proficient" }, { name: "HTML & CSS", tier: "core" }, { name: "Blazor", tier: "proficient" }
  ] },
  { category: "Data", items: [
    { name: "SQL Server", tier: "core" }, { name: "MySQL", tier: "proficient" }, { name: "MongoDB", tier: "core" }
  ] },
  { category: "Web Technologies", items: [
    { name: "Ajax", tier: "proficient" }, { name: "jQuery", tier: "proficient" },
    { name: "WebSockets", tier: "proficient" }, { name: "SignalR", tier: "proficient" }
  ] },
  { category: "Tools & APIs", items: [
    { name: "Git & GitHub", tier: "core" }, { name: "REST APIs", tier: "core" }, { name: "Swagger", tier: "core" },
    { name: "Postman", tier: "core" }, { name: "Visual Studio", tier: "core" }, { name: "SAP Crystal Reports", tier: "core" },
    { name: "Docker", tier: "proficient" }
  ] }
];

const socialLinks = [
  { name: "GitHub", href: "https://github.com/AsrafujjamanDeepu", Icon: FaGithub },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/asrafujjaman", Icon: FaLinkedinIn },
  { name: "Facebook", href: "https://www.facebook.com/ZamanDeepu/", Icon: FaFacebookF },
  { name: "WhatsApp", href: "https://wa.me/8801521200643", Icon: FaWhatsapp },
  { name: "Telegram", href: "https://t.me/ZamanDeepu", Icon: FaTelegramPlane },
  { name: "Gmail", href: "https://mail.google.com/mail/?view=cm&fs=1&to=asrafujjamandeepu@gmail.com", Icon: SiGmail }
];

function Arrow() { return <span aria-hidden="true" className="arrow">↗</span>; }

export default function Home() {
  const [lang, toggleLang, t] = useLang();
  const [theme, toggleTheme] = useTheme();
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [live, setLive] = useState({ repos: [], weather: null });
  const [photos, setPhotos] = useState({});

  useEffect(() => {
    document.documentElement.lang = lang === "bn" ? "bn" : "en";
  }, [lang]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("in-view")), { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch("/api/live").then((response) => response.json()).then(setLive).catch(() => undefined);
  }, []);

  // Themed stock photos for the project cards (needs UNSPLASH_ACCESS_KEY or PEXELS_API_KEY;
  // without a key this returns nothing and the cards keep their pastel look).
  useEffect(() => {
    fetch("/api/project-images").then((response) => response.json()).then((data) => setPhotos(data.images || {})).catch(() => undefined);
  }, []);

  async function submitForm(event) {
    event.preventDefault();
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) { setStatus(t.formNotConfigured); return; }
    setSending(true); setStatus("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", accessKey);
    formData.append("subject", "New portfolio message for Asrafujjaman");
    formData.append("from_name", "Asrafujjaman Portfolio");
    try {
      // Sending FormData directly (no manual Content-Type) keeps this a CORS-safelisted
      // "simple request" - JSON.stringify + Content-Type: application/json forces a
      // preflight, and Web3Forms can then process the submission server-side (which is
      // why the email still arrives) while the browser blocks the client from reading
      // the response, so the UI shows this exact "connection failed" message.
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData
      });
      const result = await response.json();
      if (response.ok && result.success) { setStatus(t.formSuccess); form.reset(); }
      else setStatus(result.message || t.formFailDefault);
    } catch (error) {
      console.error("Web3Forms submission failed:", error);
      setStatus(t.formConnFail);
    }
    finally { setSending(false); }
  }

  return <main className="min-h-screen overflow-x-hidden">
    <ScrollScenery />
    <div className="grain" />
    <NavBar t={t} lang={lang} onToggleLang={toggleLang} theme={theme} onToggleTheme={toggleTheme} />

    <section id="top" className="hero shell">
      <div className="hero-copy reveal">
        <p className="eyebrow"><i /> {t.heroEyebrow}</p>
        <h1>{t.heroTitlePre}<br /><em>{t.heroTitleEm}</em><br />{t.heroTitlePost}</h1>
        <p className="hero-intro">{t.heroIntro}</p>
        <div className="hero-actions"><a className="button primary" href="#work">{t.heroCtaWork} <Arrow /></a><a className="text-link" href="https://github.com/AsrafujjamanDeepu" target="_blank" rel="noreferrer">{t.heroGithub} <Arrow /></a></div>
      </div>
      <div className="portrait-wrap reveal"><div className="portrait-ring" /><div className="portrait-card"><img src="/asrafujjaman-portrait.jpg" alt="Asrafujjaman" /><div className="portrait-caption"><span>{t.portraitRole}</span><b>{t.portraitLocation}</b></div></div><SkillConstellation skills={heroSkills} /></div>
      <div className="hero-footer"><span>{t.heroScroll}</span><div className="scroll-line" /><span>{t.heroCounter}</span></div>
    </section>

    <section className="live-strip" aria-label="Live developer status"><div className="shell live-grid">
      <div className="live-copy reveal"><p className="eyebrow"><i /> {t.liveEyebrow}</p><h2>{t.liveTitlePre}<br />{t.liveTitleMid ? `${t.liveTitleMid} ` : ""}<em>{t.liveTitleEm}</em></h2><p>{t.livePara}</p></div>
      <div className="weather-card reveal">
        <div><p>{t.weatherLabel}</p><strong>{live.weather ? `${live.weather.temperature}°` : "--°"}</strong><span>{live.weather?.condition || t.weatherFallback}</span></div>
        {live.weather?.icon ? <img src={live.weather.icon} alt="Current weather" /> : <div className="weather-sun" aria-hidden="true" />}
        <small>{live.weather ? `${live.weather.city} · ${live.weather.localTime}` : t.weatherLocationFallback}</small>
      </div>
    </div></section>

    <section id="work" className="work section shell">
      <div className="section-heading reveal"><p className="eyebrow">{t.workEyebrow}</p><h2>{t.workTitlePre}<br /><em>{t.workTitleEm}</em></h2><p>{t.workPara}</p></div>
      <div className="project-grid">{projects.map((project) => { const tr = t.projects[project.slug] || project; return <article className="project-card reveal" key={project.title}><div className="project-visual">{photos[project.slug] && <img className="project-photo" src={photos[project.slug].url} alt="" loading="lazy" />}<span>{project.mark}</span><div className="project-shape" />{photos[project.slug] && <div className="photo-credit">Photo by <a href={photos[project.slug].credit.url} target="_blank" rel="noreferrer">{photos[project.slug].credit.name}</a> on <a href={photos[project.slug].credit.providerUrl} target="_blank" rel="noreferrer">{photos[project.slug].credit.provider}</a></div>}</div><div className="project-info"><p>{tr.type}</p><h3><a className="project-link" href={project.href} target="_blank" rel="noreferrer">{project.title}<Arrow /></a></h3><div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><p className="project-description">{tr.description}</p></div></article>; })}</div>
    </section>

    <section className="repos section shell"><div className="section-heading reveal"><p className="eyebrow">{t.reposEyebrow}</p><h2>{t.reposTitlePre}<br /><em>{t.reposTitleEm}</em></h2><p>{t.reposPara}</p></div><div className="repo-grid">
      {live.repos.length ? live.repos.map((repo) => <a className="repo-card" href={repo.url} target="_blank" rel="noreferrer" key={repo.url}><div><span className="repo-dot" /><p>{repo.language}</p></div><h3>{repo.name}</h3><p className="repo-description">{repo.description}</p><footer><span>★ {repo.stars}</span><span>{t.reposView} <Arrow /></span></footer></a>) : <div className="repo-placeholder reveal"><span className="pulse-dot" /> {t.reposLoading}</div>}
    </div><ContributionHeatmap /></section>

    <section id="playground" className="extras section shell">
      <div className="section-heading reveal"><p className="eyebrow">{t.playEyebrow}</p><h2>{t.playTitlePre}<br /><em>{t.playTitleEm}</em></h2><p>{t.playPara}</p></div>
      <div className="extras-grid"><ApodCard /><FunCards /></div>
    </section>

    <section id="about" className="about section"><div className="shell about-grid"><div className="about-copy reveal"><p className="eyebrow">{t.aboutEyebrow}</p><h2>{t.aboutTitlePre} <em>{t.aboutTitleEm}</em> {t.aboutTitlePost}</h2><p>{t.aboutPara1}</p><p>{t.aboutPara2}</p><a className="text-link" href="https://www.linkedin.com/in/asrafujjaman" target="_blank" rel="noreferrer">{t.aboutLinkedin} <Arrow /></a></div><div className="stats reveal"><div><strong>788<span>h</span></strong><p>{t.statLabel1}</p></div><div><strong>3<span>×</span></strong><p>{t.statLabel2}</p></div><div><strong>10<span>+</span></strong><p>{t.statLabel3}</p></div></div></div></section>

    <section className="stack section shell">
      <div className="section-heading compact reveal">
        <p className="eyebrow">{t.stackEyebrow}</p>
        <h2>{t.stackTitlePre}<br /><em>{t.stackTitleEm}</em></h2>
        <div className="stack-legend"><span><i className="legend-dot core" />{t.legendCore}</span><span><i className="legend-dot proficient" />{t.legendProficient}</span></div>
      </div>
      <div className="skill-groups reveal">
        {skillGroups.map((group) => <div className="skill-group" key={group.category}>
          <h3>{t.categories[group.category] || group.category}</h3>
          <div className="skill-pills">{group.items.map((item) => <span className={`pill pill-${item.tier}`} key={item.name}>{item.name}</span>)}</div>
        </div>)}
      </div>
    </section>

    <section id="contact" className="contact"><div className="shell contact-grid"><div className="contact-intro reveal"><p className="eyebrow">{t.contactEyebrow}</p><h2>{t.contactTitlePre}<br /><em>{t.contactTitleEm}</em></h2><p>{t.contactPara}</p><a className="email" href="mailto:asrafujjamandeepu@gmail.com">asrafujjamandeepu@gmail.com <Arrow /></a></div><form className="contact-form reveal" onSubmit={submitForm}><label>{t.formName}<input name="name" required placeholder={t.placeholderName} /></label><label>{t.formEmail}<input name="email" type="email" required placeholder={t.placeholderEmail} /></label><label>{t.formMessage}<textarea name="message" required placeholder={t.placeholderMessage} rows="5" /></label><input type="checkbox" className="botcheck" name="botcheck" tabIndex="-1" autoComplete="off" /><button className="button primary" disabled={sending}>{sending ? t.formSending : t.formSend} <Arrow /></button>{status && <p className="form-status" role="status">{status}</p>}</form></div></section>

    <footer className="footer shell" id="footer"><a className="logo" href="#top">Asrafujjaman<span>.</span></a><p>{t.footerTagline}</p><div className="social-links">{socialLinks.map(({ name, href, Icon }) => <a href={href} target="_blank" rel="noreferrer" key={name} aria-label={name} title={name}><Icon /></a>)}</div></footer>
  </main>;
}

