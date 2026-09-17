"use client";

import { useEffect, useState } from "react";
import { FaGithub, FaLinkedinIn, FaFacebookF, FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import SkillConstellation from "../components/SkillConstellation";

const projects = [
  { title: "Ticket Portal", type: "Full-stack booking platform", description: "A bus-ticket booking experience combining RESTful APIs with a responsive, user-focused interface.", tags: ["C#", "ASP.NET Core API", "EF Core", "Angular", "React"], mark: "01" },
  { title: "Assignment Submission System", type: "Academic workflow platform", description: "A role-based application for managing assignments and submissions across academic teams.", tags: ["Next.js", "TypeScript", "React", "MongoDB", "ASP.NET Core"], mark: "02" },
  { title: "Virtual Mart", type: "E-commerce platform", description: "A full-stack online marketplace with secure authentication and real-time capabilities.", tags: ["Node.js", "MongoDB", "WebSocket", "JavaScript"], mark: "03" },
  { title: "Clinic Management System", type: "Operations dashboard", description: "A database-driven system for streamlining patient appointments and clinic workflows.", tags: ["ASP.NET Core", "SQL Server", "Razor", "EF Core"], mark: "04" },
  { title: "Student Management System", type: "Data management app", description: "A clean, practical student information system powered by a focused Razor interface.", tags: ["ASP.NET MVC", "Entity Framework", "SQL Server"], mark: "05" },
  { title: "Study Tracker", type: "Desktop learning tool", description: "A focused Python tool for organizing study sessions and tracking momentum.", tags: ["Python", "Tkinter", "Canvas"], mark: "06" }
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
    { name: "ASP.NET MVC", tier: "core" }, { name: "ADO.NET", tier: "core" }, { name: "Node.js", tier: "core" }
  ] },
  { category: "Frontend", items: [
    { name: "React", tier: "core" }, { name: "Angular", tier: "core" }, { name: "Next.js", tier: "core" },
    { name: "Razor Pages", tier: "core" }, { name: "Tailwind CSS", tier: "proficient" }, { name: "Bootstrap", tier: "core" },
    { name: ".NET MAUI", tier: "proficient" }, { name: "HTML & CSS", tier: "core" }
  ] },
  { category: "Data", items: [
    { name: "SQL Server", tier: "core" }, { name: "MySQL", tier: "proficient" }, { name: "MongoDB", tier: "core" }
  ] },
  { category: "Tools & APIs", items: [
    { name: "Git & GitHub", tier: "core" }, { name: "REST APIs", tier: "core" }, { name: "Swagger", tier: "core" },
    { name: "Postman", tier: "core" }, { name: "Visual Studio", tier: "core" }, { name: "SAP Crystal Reports", tier: "core" }
  ] }
];

const socialLinks = [
  { name: "GitHub", href: "https://github.com/AsrafujjamanDeepu", Icon: FaGithub },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/asrafujjaman", Icon: FaLinkedinIn },
  { name: "Facebook", href: "https://www.facebook.com/ZamanDeepu/", Icon: FaFacebookF },
  { name: "WhatsApp", href: "https://wa.me/8801521200643", Icon: FaWhatsapp },
  { name: "Telegram", href: "https://t.me/+8801521200643", Icon: FaTelegramPlane }
];

function Arrow() { return <span aria-hidden="true" className="arrow">↗</span>; }

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [live, setLive] = useState({ repos: [], weather: null });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("in-view")), { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch("/api/live").then((response) => response.json()).then(setLive).catch(() => undefined);
  }, []);

  async function submitForm(event) {
    event.preventDefault();
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) { setStatus("The contact form is not configured yet."); return; }
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
      if (response.ok && result.success) { setStatus("Message sent - thanks for reaching out."); form.reset(); }
      else setStatus(result.message || "Web3Forms could not send the message. Please try again.");
    } catch (error) {
      console.error("Web3Forms submission failed:", error);
      setStatus("The connection failed before the message could be sent. Please try again.");
    }
    finally { setSending(false); }
  }

  return <main className="min-h-screen overflow-x-hidden">
    <div className="grain" />
    <nav className="nav shell" aria-label="Main navigation">
      <a className="logo" href="#top" aria-label="Asrafujjaman home">Asrafujjaman<span>.</span></a>
      <button className="menu-button" onClick={() => setMenu(!menu)} aria-expanded={menu}>Menu <span>+</span></button>
      <div className={`nav-links ${menu ? "open" : ""}`}>
        <a href="#work" onClick={() => setMenu(false)}>Work</a><a href="#about" onClick={() => setMenu(false)}>About</a><a href="#contact" onClick={() => setMenu(false)}>Contact</a>
      </div>
      <a className="nav-cta" href="#contact">Let&apos;s talk <Arrow /></a>
    </nav>

    <section id="top" className="hero shell">
      <div className="hero-copy reveal">
        <p className="eyebrow"><i /> Available for opportunities</p>
        <h1>Building digital<br /><em>experiences</em> with<br />purpose.</h1>
        <p className="hero-intro">I&apos;m Asrafujjaman, a software developer crafting reliable full-stack applications with .NET, React, and thoughtful engineering.</p>
        <div className="hero-actions"><a className="button primary" href="#work">Explore my work <Arrow /></a><a className="text-link" href="https://github.com/AsrafujjamanDeepu" target="_blank" rel="noreferrer">GitHub <Arrow /></a></div>
      </div>
      <div className="portrait-wrap reveal"><div className="portrait-ring" /><div className="portrait-card"><img src="/asrafujjaman-portrait.jpg" alt="Asrafujjaman" /><div className="portrait-caption"><span>Software developer</span><b>Dhaka, Bangladesh</b></div></div><SkillConstellation skills={heroSkills} /></div>
      <div className="hero-footer"><span>Scroll to discover</span><div className="scroll-line" /><span>01 / 05</span></div>
    </section>

    <section className="live-strip" aria-label="Live developer status"><div className="shell live-grid">
      <div className="live-copy reveal"><p className="eyebrow"><i /> Live signal</p><h2>Currently building<br />from <em>Dhaka.</em></h2><p>Small details make a portfolio feel human. This panel updates from real developer activity and local weather.</p></div>
      <div className="weather-card reveal">
        <div><p>Local atmosphere</p><strong>{live.weather ? `${live.weather.temperature}°` : "--°"}</strong><span>{live.weather?.condition || "Connect WeatherAPI to go live"}</span></div>
        {live.weather?.icon ? <img src={live.weather.icon} alt="Current weather" /> : <div className="weather-sun" aria-hidden="true" />}
        <small>{live.weather ? `${live.weather.city} · ${live.weather.localTime}` : "Dhaka, Bangladesh"}</small>
      </div>
    </div></section>

    <section id="work" className="work section shell">
      <div className="section-heading reveal"><p className="eyebrow">Selected work</p><h2>Ideas, turned into<br /><em>working products.</em></h2><p>From server-side architecture to responsive front ends, I enjoy delivering complete, useful software.</p></div>
      <div className="project-grid">{projects.map((project) => <article className="project-card reveal" key={project.title}><div className="project-visual"><span>{project.mark}</span><div className="project-shape" /></div><div className="project-info"><p>{project.type}</p><h3>{project.title}</h3><div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><p className="project-description">{project.description}</p></div></article>)}</div>
    </section>

    <section className="repos section shell"><div className="section-heading reveal"><p className="eyebrow">From GitHub</p><h2>Latest things I&apos;ve<br /><em>been making.</em></h2><p>These are live public repositories from my GitHub profile, refreshed automatically.</p></div><div className="repo-grid">
      {live.repos.length ? live.repos.map((repo) => <a className="repo-card" href={repo.url} target="_blank" rel="noreferrer" key={repo.url}><div><span className="repo-dot" /><p>{repo.language}</p></div><h3>{repo.name}</h3><p className="repo-description">{repo.description}</p><footer><span>★ {repo.stars}</span><span>View repo <Arrow /></span></footer></a>) : <div className="repo-placeholder reveal"><span className="pulse-dot" /> Loading live GitHub projects...</div>}
    </div></section>

    <section id="about" className="about section"><div className="shell about-grid"><div className="about-copy reveal"><p className="eyebrow">A little about me</p><h2>I build with <em>curiosity</em> and care.</h2><p>I&apos;m a .NET and full-stack developer who enjoys the full journey: designing APIs, shaping data, and making interfaces feel effortless to use.</p><p>My background in intensive cross-platform development training, paired with practical work across MEAN, MERN, and .NET stacks, keeps me adaptable and grounded in real delivery.</p><a className="text-link" href="https://www.linkedin.com/in/asrafujjaman" target="_blank" rel="noreferrer">More on LinkedIn <Arrow /></a></div><div className="stats reveal"><div><strong>788<span>h</span></strong><p>intensive development training</p></div><div><strong>3<span>×</span></strong><p>full-stack technology ecosystems</p></div><div><strong>10<span>+</span></strong><p>projects brought from idea to build</p></div></div></div></section>

    <section className="stack section shell">
      <div className="section-heading compact reveal">
        <p className="eyebrow">Toolbox</p>
        <h2>The stack behind<br />the <em>craft.</em></h2>
        <div className="stack-legend"><span><i className="legend-dot core" />Specializing in</span><span><i className="legend-dot proficient" />Also building with</span></div>
      </div>
      <div className="skill-groups reveal">
        {skillGroups.map((group) => <div className="skill-group" key={group.category}>
          <h3>{group.category}</h3>
          <div className="skill-pills">{group.items.map((item) => <span className={`pill pill-${item.tier}`} key={item.name}>{item.name}</span>)}</div>
        </div>)}
      </div>
    </section>

    <section id="contact" className="contact"><div className="shell contact-grid"><div className="contact-intro reveal"><p className="eyebrow">Have a project in mind?</p><h2>Let&apos;s make something<br /><em>great together.</em></h2><p>Whether it&apos;s a product idea, a collaboration, or an opportunity, my inbox is open.</p><a className="email" href="mailto:asrafujjamandeepu@gmail.com">asrafujjamandeepu@gmail.com <Arrow /></a></div><form className="contact-form reveal" onSubmit={submitForm}><label>Name<input name="name" required placeholder="Your name" /></label><label>Email<input name="email" type="email" required placeholder="you@company.com" /></label><label>Message<textarea name="message" required placeholder="Tell me a little about your project..." rows="5" /></label><input type="checkbox" className="botcheck" name="botcheck" tabIndex="-1" autoComplete="off" /><button className="button primary" disabled={sending}>{sending ? "Sending..." : "Send message"} <Arrow /></button>{status && <p className="form-status" role="status">{status}</p>}</form></div></section>

    <footer className="footer shell"><a className="logo" href="#top">Asrafujjaman<span>.</span></a><p>Designed & built by Asrafujjaman</p><div className="social-links">{socialLinks.map(({ name, href, Icon }) => <a href={href} target="_blank" rel="noreferrer" key={name} aria-label={name} title={name}><Icon /></a>)}</div></footer>
  </main>;
}
