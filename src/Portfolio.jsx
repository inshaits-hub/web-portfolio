import React, { useEffect, useRef, useState } from "react";
import { Cpu, Code2, Wrench, Palette, ArrowUpRight, Menu, X, ArrowUp } from "lucide-react";

const THEME = {
  bg: "#F1E4CC",
  bgPanel: "#E8D7B4",
  bgOverlay: "#1B120C",
  card: "#2B1B10",
  cardAlt: "#42301D",
  cardBorder: "#4A3524",
  cardText: "#F3E8D6",
  cardTextMuted: "#D9C6AC",
  text: "#2B1B10",
  textSoft: "#4A3524",
  textMuted: "#7C6448",
  textFaint: "#A38F6E",
  border: "#DDC9A4",
  borderMid: "#D0B98D",
  borderStrong: "#B99968",
  gold600: "#8C5A22",
  gold500: "#A9702E",
  gold300: "#D9A15C",
  rust600: "#7A4023",
  rust500: "#93502B",
  rust300: "#C97B52",
  sage600: "#4F6142",
  sage500: "#63734F",
  sage300: "#9CB088",
  mocha600: "#5A3B22",
  mocha500: "#71492A",
  mocha300: "#B08A5E",
};

const SECTIONS = [
  { id: "about", label: "About", index: "01", color: THEME.gold600, colorOnDark: THEME.gold300 },
  { id: "education", label: "Education", index: "02", color: THEME.sage600, colorOnDark: THEME.sage300 },
  { id: "experience", label: "Experience", index: "03", color: THEME.rust600, colorOnDark: THEME.rust300 },
  { id: "projects", label: "Projects", index: "04", color: THEME.gold600, colorOnDark: THEME.gold300 },
  { id: "skills", label: "Skills", index: "05", color: THEME.mocha600, colorOnDark: THEME.mocha300 },
  { id: "contact", label: "Contact", index: "06", color: THEME.rust600, colorOnDark: THEME.rust300 },
];

const useReveal = (threshold = 0.18) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

const Scene = ({ children, delay = 0, className = "", distance = 20 }) => {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : `translateY(${distance}px) scale(1.03)`,
        transition: `opacity 0.9s cubic-bezier(.16,.84,.28,1) ${delay}ms, transform 0.95s cubic-bezier(.16,.84,.28,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const MaskLines = ({ lines, delay = 0, className = "", style = {} }) => {
  const [ref, visible] = useReveal(0.3);
  return (
    <div ref={ref} className={className} style={style}>
      {lines.map((line, i) => (
        <div key={i} style={{ overflow: "hidden" }}>
          <div
            style={{
              transform: visible ? "translateY(0)" : "translateY(115%)",
              transition: `transform 1s cubic-bezier(.16,.84,.28,1) ${delay + i * 110}ms`,
            }}
          >
            {line}
          </div>
        </div>
      ))}
    </div>
  );
};

const SkillLine = ({ text, delay, accent }) => {
  const [ref, visible] = useReveal(0.4);
  return (
    <div ref={ref} className="py-2.5 border-b" style={{ borderColor: THEME.cardBorder }}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm" style={{ color: THEME.cardTextMuted }}>{text}</span>
      </div>
      <div className="h-[2px] w-full rounded-full overflow-hidden" style={{ background: THEME.cardBorder }}>
        <div
          className="h-full rounded-full"
          style={{
            width: visible ? "100%" : "0%",
            background: accent,
            transition: `width 0.9s cubic-bezier(.16,.84,.28,1) ${delay}ms`,
          }}
        />
      </div>
    </div>
  );
};

const PaperTag = ({ children }) => (
  <span
    className="inline-block text-[11px] tracking-wide uppercase font-semibold px-2.5 py-1 rounded-full mr-2 mb-2"
    style={{ fontFamily: "'IBM Plex Mono', monospace", background: THEME.cardAlt, color: THEME.gold300 }}
  >
    {children}
  </span>
);

const Tilt = ({ children, max = 7, className = "" }) => {
  const ref = useRef(null);
  const [style, setStyle] = useState({ transform: "perspective(800px) rotateX(0) rotateY(0) translateY(0)" });
  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * max;
    const ry = (px - 0.5) * max;
    setStyle({
      transform: `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`,
      transition: "transform 0.1s ease-out",
    });
  };
  const reset = () =>
    setStyle({
      transform: "perspective(800px) rotateX(0) rotateY(0) translateY(0)",
      transition: "transform 0.6s cubic-bezier(.16,.84,.28,1)",
    });
  return (
    <div
      ref={ref}
      className={`group ${className}`}
      style={{ ...style, willChange: "transform" }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
    </div>
  );
};

const Magnetic = ({ children, strength = 16, className = "" }) => {
  const ref = useRef(null);
  const [style, setStyle] = useState({ transform: "translate(0,0)" });
  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width / 2);
    const my = e.clientY - (r.top + r.height / 2);
    setStyle({
      transform: `translate(${(mx / r.width) * strength}px, ${(my / r.height) * strength}px)`,
      transition: "transform 0.15s ease-out",
    });
  };
  const reset = () => setStyle({ transform: "translate(0,0)", transition: "transform 0.5s cubic-bezier(.16,.84,.28,1)" });
  return (
    <div ref={ref} className={`inline-block ${className}`} style={style} onMouseMove={handleMove} onMouseLeave={reset}>
      {children}
    </div>
  );
};

const CountUp = ({ to, suffix = "", duration = 1100 }) => {
  const [ref, visible] = useReveal(0.6);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start;
    let raf;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [visible, to, duration]);
  return (
    <span ref={ref} style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
      {val}
      {suffix}
    </span>
  );
};

const RingDial = ({ progress, activeColor, size = 56, trackColor = THEME.borderMid }) => {
  const r = size === 56 ? 22 : 15;
  const c = 2 * Math.PI * r;
  const cx = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={cx} cy={cx} r={r} fill="none" stroke={trackColor} strokeWidth="2.5" />
      <circle
        cx={cx}
        cy={cx}
        r={r}
        fill="none"
        stroke={activeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - progress * c}
        transform={`rotate(-90 ${cx} ${cx})`}
        style={{ transition: "stroke-dashoffset 0.5s cubic-bezier(.16,.84,.28,1), stroke 0.5s ease" }}
      />
    </svg>
  );
};

const SectionHead = ({ index, label, ghost, color }) => {
  const [ref, visible] = useReveal(0.2);
  return (
    <div ref={ref} className="relative mb-8">
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute -top-8 md:-top-12 left-0 whitespace-nowrap"
        style={{
          fontFamily: "'Fraunces', serif",
          fontWeight: 600,
          fontStyle: "italic",
          fontSize: "clamp(2.6rem, 8vw, 5.5rem)",
          color,
          opacity: visible ? 0.12 : 0,
          transition: "opacity 1.2s ease",
        }}
      >
        {ghost}
      </span>
      <div className="relative z-10 flex items-center gap-3">
        <span
          className="text-[13px] font-semibold px-2 py-1 rounded-md"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            color,
            background: `${color}22`,
            opacity: visible ? 1 : 0,
            transition: "opacity 0.7s ease",
          }}
        >
          {index}
        </span>
        <h2
          className="text-3xl md:text-4xl"
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 600,
            color: THEME.text,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.7s ease 100ms, transform 0.7s cubic-bezier(.16,.84,.28,1) 100ms",
          }}
        >
          {label}
        </h2>
      </div>
    </div>
  );
};

/* PageCurtain — the slide transition between sections. A solid coffee
   panel rises to cover the viewport ("cover"), the page jumps to the
   target section while hidden, then the panel continues rising off
   the top ("reveal"), uncovering the new section already in place. */
const PageCurtain = ({ phase, label }) => {
  const translate = phase === "cover" ? "0%" : phase === "reveal" ? "-100%" : "100%";
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[200] pointer-events-none flex flex-col items-center justify-center"
      style={{
        background: `linear-gradient(160deg, ${THEME.bgOverlay} 0%, #2A1B10 100%)`,
        transform: `translateY(${translate})`,
        transition: phase ? "transform 0.5s cubic-bezier(.76,0,.24,1)" : "none",
      }}
    >
      <div
        className="flex items-center gap-3"
        style={{
          opacity: phase === "cover" ? 1 : 0,
          transition: "opacity 0.3s ease 0.15s",
        }}
      >
        <RingDial progress={1} activeColor={THEME.gold300} trackColor={THEME.cardBorder} size={30} />
        <span
          className="text-sm uppercase tracking-[0.2em]"
          style={{ fontFamily: "'IBM Plex Mono', monospace", color: THEME.cardTextMuted }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

export default function Portfolio() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [active, setActive] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [curtain, setCurtain] = useState({ phase: null, target: null });
  const sectionRefs = useRef({});
  const pendingTarget = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const observers = [];
    SECTIONS.forEach((s, i) => {
      const el = sectionRefs.current[s.id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(i);
        },
        { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setScrollPct(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Drives the two-phase slide: cover the viewport, jump the scroll
  // position while hidden, then continue the slide off-screen.
  useEffect(() => {
    if (curtain.phase === "cover") {
      const t = setTimeout(() => {
        const el = document.getElementById(pendingTarget.current);
        if (el) {
          const isMobile = window.innerWidth < 768;
          const offset = isMobile ? 76 : 16;
          const top = el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: "auto" });
        }
        setCurtain((c) => ({ ...c, phase: "reveal" }));
      }, 480);
      return () => clearTimeout(t);
    }
    if (curtain.phase === "reveal") {
      const t = setTimeout(() => setCurtain({ phase: null, target: null }), 480);
      return () => clearTimeout(t);
    }
  }, [curtain.phase]);

  const navigateTo = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    pendingTarget.current = id;
    setCurtain({ phase: "cover", target: id });
  };

  const email = "inshaits@gmail.com";
  const github = "https://github.com/inshaits-hub";
  const activeSection = SECTIONS[active];
  const progress = (active + 1) / SECTIONS.length;

  const projects = [
    {
      title: "Connexa",
      tag: "Founder & full-stack developer",
      accent: THEME.gold300,
      period: "Ongoing",
      desc: "A peer-to-peer jewelry marketplace connecting Lahore's independent artisans directly with customers. Built the full platform — real-time chat with Socket.IO, JWT authentication, and a gold-and-cream brand identity — then carried it into a pitch deck and a full entrepreneurship report.",
      stack: ["React", "Node.js", "Socket.IO", "JWT", "MongoDB"],
    },
    {
      title: "Apna College — homepage",
      tag: "Front-end design",
      accent: THEME.sage300,
      period: "2026",
      desc: "A homepage for an educational platform, styled entirely in a soft mint-and-pastel palette. Focused on typography rhythm and a calm, approachable visual voice for a learning product.",
      stack: ["HTML", "CSS", "Responsive layout"],
    },
    {
      title: "8086 & 8255A interfacing",
      tag: "Microprocessor systems",
      accent: THEME.rust300,
      period: "Coursework",
      desc: "Simulated 8086 assembly programs and 8255A PPI interfacing circuits in Proteus ISIS — debugging control-word mismatches and wiring faults down to the signal level — then documented every run in formal lab reports.",
      stack: ["Assembly (8086)", "Proteus ISIS", "8255A PPI"],
    },
    {
      title: "Algorithms & database systems",
      tag: "Coursework, applied",
      accent: THEME.mocha300,
      period: "Coursework",
      desc: "Implemented Floyd–Warshall and graph traversal (DFS, TSP) for algorithmic problem sets, alongside a full DBMS track — SQL, normalization, ER modeling, and transactions.",
      stack: ["SQL", "ER modeling", "Graph algorithms"],
    },
  ];

  const skillGroups = [
    { label: "Engineering", icon: Cpu, accent: THEME.sage300, iconBg: THEME.sage500, items: ["C / C++", "Assembly (8086)", "Data structures & algorithms", "SQL & DBMS design"] },
    { label: "Web development", icon: Code2, accent: THEME.rust300, iconBg: THEME.rust500, items: ["React", "Node.js", "Socket.IO", "REST APIs"] },
    { label: "Tools", icon: Wrench, accent: THEME.gold300, iconBg: THEME.gold500, items: ["Proteus ISIS", "Git", "Figma", "Word / docx tooling"] },
    { label: "Brand & content", icon: Palette, accent: THEME.mocha300, iconBg: THEME.mocha500, items: ["Pitch decks", "Visual identity", "Copywriting", "Social content strategy"] },
  ];

  const experience = [
    { role: "Founder — Connexa", meta: "Ongoing", accent: THEME.rust300, dotColor: THEME.rust500, desc: "Designing and building a peer-to-peer marketplace connecting Lahore-based jewelry artisans with customers — product, engineering, brand, and pitch, end to end." },
    { role: "Content strategy — Real Funnels Media", meta: "Add dates", accent: THEME.sage300, dotColor: THEME.sage500, desc: "Wrote video scripts and content strategy targeting the physiotherapy clinic niche. (Edit this line with your exact role and outcomes.)" },
  ];

  return (
    <div
      className="min-h-screen w-full relative"
      style={{ background: THEME.bg, color: THEME.text, fontFamily: "'Work Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,600&family=Work+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        html { scroll-behavior: auto; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes heroGlow { 0%,100% { opacity: .45; } 50% { opacity: .8; } }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      {/* PAGE CURTAIN — slide transition between sections */}
      {curtain.phase && <PageCurtain phase={curtain.phase} label={SECTIONS.find((s) => s.id === curtain.target)?.label || ""} />}

      {/* TOP SCROLL PROGRESS RULE */}
      <div className="fixed top-0 left-0 right-0 z-[150] h-[3px]" style={{ background: THEME.border }}>
        <div
          className="h-full"
          style={{
            width: `${scrollPct * 100}%`,
            background: `linear-gradient(90deg, ${THEME.gold500}, ${THEME.rust500})`,
            transition: "width 0.15s linear",
          }}
        />
      </div>

      {/* MOBILE HEADER */}
      <nav className="md:hidden sticky top-[3px] z-40 backdrop-blur-md border-b" style={{ background: `${THEME.bgPanel}f2`, borderColor: THEME.borderStrong }}>
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span
              className="w-8 h-8 rounded-full border flex items-center justify-center text-sm font-semibold"
              style={{ borderColor: THEME.gold600, color: THEME.gold600, fontFamily: "'Fraunces', serif" }}
            >
              I
            </span>
            <div className="leading-tight">
              <span className="block text-base" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, color: THEME.text }}>Insha</span>
              <span className="block text-[9px] uppercase tracking-[0.16em]" style={{ fontFamily: "'IBM Plex Mono', monospace", color: THEME.textMuted }}>
                Engineer &amp; founder
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <RingDial progress={progress} activeColor={activeSection.color} />
            <button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((o) => !o)}
              className="w-9 h-9 rounded-full border flex items-center justify-center"
              style={{ borderColor: THEME.borderStrong, color: THEME.text }}
            >
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>
        <div
          className="overflow-hidden"
          style={{
            maxHeight: mobileOpen ? "360px" : "0px",
            transition: "max-height 0.45s cubic-bezier(.16,.84,.28,1)",
          }}
        >
          <div className="px-5 pb-5 flex flex-col gap-1 border-t" style={{ borderColor: THEME.border }}>
            {SECTIONS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => navigateTo(s.id)}
                className="flex items-center gap-3 py-3 text-left"
                style={{ color: active === i ? THEME.text : THEME.textMuted }}
              >
                <span className="text-[11px]" style={{ fontFamily: "'IBM Plex Mono', monospace", color: active === i ? s.color : THEME.textFaint }}>
                  {s.index}
                </span>
                <span className="text-sm font-medium">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="md:flex">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:flex md:flex-col md:justify-between md:fixed md:top-0 md:left-0 md:h-screen md:w-64 md:px-8 md:py-10 border-r" style={{ borderColor: THEME.borderStrong, background: THEME.bgPanel }}>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span
                className="w-11 h-11 rounded-full border-2 flex items-center justify-center text-lg"
                style={{ borderColor: THEME.gold600, color: THEME.gold600, fontFamily: "'Fraunces', serif", fontWeight: 600 }}
              >
                I
              </span>
              <span className="text-xl" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, color: THEME.text }}>
                Insha<span style={{ color: THEME.gold600 }}>.</span>
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.18em] mb-12 pl-[3.5rem]" style={{ fontFamily: "'IBM Plex Mono', monospace", color: THEME.textMuted }}>
              Software engineer
            </p>
            <div className="flex flex-col gap-1">
              {SECTIONS.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => navigateTo(s.id)}
                  className="group flex items-center gap-3 py-2 text-sm transition-colors text-left"
                  style={{ color: active === i ? THEME.text : THEME.textMuted }}
                >
                  <span
                    className="text-[11px]"
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: active === i ? s.color : THEME.textFaint,
                      transition: "color 0.4s ease",
                    }}
                  >
                    {s.index}
                  </span>
                  <span className="relative">
                    {s.label}
                    <span
                      className="absolute left-0 -bottom-1 h-[1.5px]"
                      style={{
                        width: active === i ? "100%" : "0%",
                        background: s.color,
                        transition: "width 0.5s cubic-bezier(.16,.84,.28,1)",
                      }}
                    />
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <RingDial progress={progress} activeColor={activeSection.color} />
              <div>
                <p className="text-[11px] uppercase tracking-wide" style={{ fontFamily: "'IBM Plex Mono', monospace", color: THEME.textMuted }}>Now viewing</p>
                <p className="text-sm font-semibold" style={{ color: activeSection.color }}>{activeSection.label}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-xs" style={{ color: THEME.textMuted }}>
              <a href={`mailto:${email}`} className="hover:text-[#2B1B10] transition-colors w-fit">{email}</a>
              <a href={github} target="_blank" rel="noreferrer" className="hover:text-[#2B1B10] transition-colors w-fit flex items-center gap-1">
                GitHub <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
        </aside>

        {/* SCROLLING CONTENT COLUMN */}
        <div className="md:ml-64 w-full">
          {/* HERO */}
          <header className="relative max-w-4xl mx-auto px-6 md:px-12 pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-5 gap-10 items-center">
            <div className="md:col-span-3">
              <p
                className="inline-block text-[13px] tracking-widest uppercase font-semibold mb-6 px-3 py-1 rounded-full border"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: THEME.gold600,
                  borderColor: THEME.borderStrong,
                  background: THEME.bgPanel,
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? "translateY(0)" : "translateY(14px)",
                  transition: "opacity 0.9s ease 100ms, transform 0.9s cubic-bezier(.16,.84,.28,1) 100ms",
                }}
              >
                Software engineer — building &amp; founding
              </p>
              <MaskLines
                lines={["I engineer", <>circuits, and I build <span style={{ fontStyle: "italic", color: THEME.gold600 }}>rings</span>.</>]}
                delay={220}
                className="text-4xl md:text-6xl leading-[1.08] mb-7"
                style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, color: THEME.text }}
              />
              <p
                className="text-lg leading-relaxed mb-9 max-w-md"
                style={{
                  color: THEME.textSoft,
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? "translateY(0)" : "translateY(16px)",
                  transition: "opacity 1s ease 600ms, transform 1s cubic-bezier(.16,.84,.28,1) 600ms",
                }}
              >
                BS Software Engineering student who moves easily between microprocessor
                circuits and market pitches ,currently building{" "}
                <span style={{ color: THEME.sage600, fontWeight: 600 }}>Connexa</span>, a marketplace
                for Lahore's jewelry artisans.
              </p>
              <div
                className="flex flex-wrap gap-4"
                style={{
                  opacity: heroVisible ? 1 : 0,
                  transform: heroVisible ? "translateY(0)" : "translateY(16px)",
                  transition: "opacity 1s ease 760ms, transform 1s cubic-bezier(.16,.84,.28,1) 760ms",
                }}
              >
                <Magnetic>
                  <button onClick={() => navigateTo("projects")} className="px-6 py-3 rounded-full text-sm font-semibold hover:brightness-110 active:scale-95 transition-all block" style={{ background: THEME.gold500, color: THEME.cardText }}>
                    See my work
                  </button>
                </Magnetic>
                <Magnetic>
                  <button onClick={() => navigateTo("contact")} className="px-6 py-3 rounded-full border text-sm font-semibold active:scale-95 transition-all block" style={{ borderColor: THEME.sage600, color: THEME.sage600 }}>
                    Get in touch
                  </button>
                </Magnetic>
              </div>
            </div>

            <div className="md:col-span-2 flex justify-center md:justify-end">
              <svg width="220" height="220" viewBox="0 0 220 220" style={{ opacity: heroVisible ? 1 : 0, transition: "opacity 1s ease 300ms" }}>
                <circle cx="110" cy="110" r="88" fill="none" stroke={THEME.border} strokeWidth="1.5" />
                <circle
                  cx="110" cy="110" r="88" fill="none"
                  stroke="url(#ringGrad)" strokeWidth="3" strokeLinecap="round"
                  strokeDasharray="553"
                  style={{
                    strokeDashoffset: heroVisible ? 90 : 553,
                    transition: "stroke-dashoffset 1.8s cubic-bezier(.16,.84,.28,1) 400ms",
                  }}
                />
                <circle cx="110" cy="22" r="5" fill={THEME.gold500} style={{ opacity: heroVisible ? 1 : 0, transition: "opacity 0.6s ease 2.1s" }} />
                <circle cx="110" cy="110" r="46" fill="none" stroke={THEME.sage500} strokeWidth="1" strokeDasharray="4 6" style={{ opacity: heroVisible ? 0.5 : 0, transition: "opacity 1s ease 1.8s", animation: "heroGlow 6s ease-in-out infinite" }} />
                <defs>
                  <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={THEME.gold500} />
                    <stop offset="100%" stopColor={THEME.rust500} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </header>

          <main className="max-w-4xl mx-auto px-6 md:px-12">
            {/* ABOUT */}
            <section id="about" ref={(el) => (sectionRefs.current.about = el)} className="relative py-16 md:py-20">
              <SectionHead index="01" label="About" ghost="About" color={THEME.gold600} />
              <div className="grid md:grid-cols-5 gap-10 items-start">
                <Scene delay={60} className="md:col-span-3">
                  <p className="text-lg leading-relaxed" style={{ color: THEME.textSoft }}>
                    I'm a motivated Software Engineering student, currently in my
                    4th semester, with a genuine love for building things — whether
                    that's a working circuit, a clean line of code, or a brand that
                    feels put-together. I'm the kind of person who gets pulled into
                    a project and doesn't want to stop until it looks and works the
                    way it should.
                  </p>
                  <p className="mt-5 text-lg leading-relaxed" style={{ color: THEME.textSoft }}>
                    I'm genuinely curious about how things are built, and I care just
                    as much about how they look — debugging a circuit in Proteus with
                    the same patience I bring to choosing a color palette. Design is
                    never an afterthought; it's part of how I build.
                  </p>
                </Scene>
                <Scene delay={180} className="md:col-span-2">
                  <div className="flex flex-col gap-3">
                    {["Systematic", "Entrepreneurial", "Detail-driven"].map((t) => (
                      <div key={t} className="flex items-center gap-3 py-2 border-b" style={{ borderColor: THEME.borderMid }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: THEME.gold500 }} />
                        <span className="text-sm" style={{ color: THEME.textSoft }}>{t}</span>
                      </div>
                    ))}
                  </div>
                </Scene>
              </div>
              <Scene delay={300} className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t max-w-md" style={{ borderColor: THEME.border }}>
                <div>
                  <p className="text-3xl" style={{ color: THEME.gold600 }}><CountUp to={4} suffix="+" /></p>
                  <p className="text-xs mt-1" style={{ color: THEME.textMuted }}>projects shipped</p>
                </div>
                <div>
                  <p className="text-3xl" style={{ color: THEME.sage600 }}><CountUp to={4} /></p>
                  <p className="text-xs mt-1" style={{ color: THEME.textMuted }}>skill areas</p>
                </div>
                <div>
                  <p className="text-3xl" style={{ color: THEME.rust600 }}><CountUp to={1} /></p>
                  <p className="text-xs mt-1" style={{ color: THEME.textMuted }}>startup founded</p>
                </div>
              </Scene>
            </section>

            {/* EDUCATION */}
            <section id="education" ref={(el) => (sectionRefs.current.education = el)} className="relative py-16 md:py-20 border-t" style={{ borderColor: THEME.border }}>
              <SectionHead index="02" label="Education" ghost="Study" color={THEME.sage600} />
              <Scene delay={60}>
                <div className="rounded-2xl p-6 md:p-8" style={{ background: THEME.card }}>
                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-4">
                    <h3 className="text-xl font-semibold" style={{ color: THEME.cardText }}>BS Software Engineering</h3>
                    <span className="text-sm font-semibold" style={{ fontFamily: "'IBM Plex Mono', monospace", color: THEME.rust300 }}>4th semester · in progress</span>
                  </div>
                  <p className="leading-relaxed max-w-2xl mb-4" style={{ color: THEME.cardTextMuted }}>
                    Coursework spanning microprocessor interfacing, algorithms, database
                    systems, and web development — with a habit of turning every
                    assignment into something a little more polished than it needed to be.
                  </p>
                  <div className="flex flex-wrap">
                    <PaperTag>8086 &amp; 8255A interfacing</PaperTag>
                    <PaperTag>Algorithms (Floyd–Warshall, graph traversal)</PaperTag>
                    <PaperTag>Database systems (SQL, ER modeling)</PaperTag>
                    <PaperTag>Web development</PaperTag>
                  </div>
                </div>
              </Scene>
            </section>

            {/* EXPERIENCE */}
            <section id="experience" ref={(el) => (sectionRefs.current.experience = el)} className="relative py-16 md:py-20 border-t" style={{ borderColor: THEME.border }}>
              <SectionHead index="03" label="Experience" ghost="Work" color={THEME.rust600} />
              <div className="grid md:grid-cols-2 gap-8 relative">
                <div className="hidden md:block absolute top-[7px] left-0 right-0 h-px" style={{ background: THEME.borderMid }} />
                {experience.map((e, i) => (
                  <Scene key={e.role} delay={i * 130} className="relative">
                    <div className="hidden md:flex items-center gap-2 mb-4">
                      <span className="w-3.5 h-3.5 rounded-full relative z-10" style={{ background: e.dotColor, boxShadow: `0 0 0 4px ${e.dotColor}33` }} />
                    </div>
                    <Tilt max={4}>
                      <div className="rounded-2xl p-6" style={{ background: THEME.card }}>
                        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1">
                          <h3 className="text-lg font-semibold" style={{ color: THEME.cardText }}>{e.role}</h3>
                          <span className="text-xs font-semibold whitespace-nowrap" style={{ fontFamily: "'IBM Plex Mono', monospace", color: e.accent }}>{e.meta}</span>
                        </div>
                        <p className="leading-relaxed mt-2" style={{ color: THEME.cardTextMuted }}>{e.desc}</p>
                      </div>
                    </Tilt>
                  </Scene>
                ))}
              </div>
            </section>

            {/* PROJECTS */}
            <section id="projects" ref={(el) => (sectionRefs.current.projects = el)} className="relative py-16 md:py-20 border-t" style={{ borderColor: THEME.border }}>
              <SectionHead index="04" label="Projects" ghost="Made" color={THEME.gold600} />
              <Scene>
                <div className="flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4 -mx-6 px-6 md:mx-0 md:px-0">
                  {projects.map((p) => (
                    <Tilt key={p.title} max={6} className="shrink-0 w-[82vw] sm:w-[380px] snap-start">
                      <div
                        className="h-full rounded-2xl border-2 p-6 transition-colors duration-500"
                        style={{ background: THEME.card, borderColor: "transparent" }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = p.accent)}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, color: THEME.cardText }}>{p.title}</h3>
                          <span className="text-xs whitespace-nowrap ml-3 mt-1" style={{ fontFamily: "'IBM Plex Mono', monospace", color: THEME.cardTextMuted }}>{p.period}</span>
                        </div>
                        <p className="text-[13px] mb-3 font-semibold" style={{ color: p.accent }}>{p.tag}</p>
                        <p className="leading-relaxed mb-4 text-[15px]" style={{ color: THEME.cardTextMuted }}>{p.desc}</p>
                        <div className="flex flex-wrap">
                          {p.stack.map((s) => <PaperTag key={s}>{s}</PaperTag>)}
                        </div>
                      </div>
                    </Tilt>
                  ))}
                </div>
                <p className="mt-3 text-xs" style={{ fontFamily: "'IBM Plex Mono', monospace", color: THEME.textFaint }}>
                  ← scroll →
                </p>
              </Scene>
            </section>

            {/* SKILLS */}
            <section id="skills" ref={(el) => (sectionRefs.current.skills = el)} className="relative py-16 md:py-20 border-t" style={{ borderColor: THEME.border }}>
              <SectionHead index="05" label="Skills" ghost="Skills" color={THEME.mocha600} />
              <div className="grid sm:grid-cols-2 gap-5">
                {skillGroups.map((g, gi) => {
                  const Icon = g.icon;
                  return (
                    <Scene key={g.label} delay={gi * 90}>
                      <Tilt max={4}>
                        <div className="rounded-2xl p-5 h-full" style={{ background: THEME.card }}>
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
                              style={{ background: g.iconBg }}
                            >
                              <Icon size={18} color={THEME.cardText} strokeWidth={2} />
                            </div>
                            <h3 className="text-base font-semibold" style={{ color: g.accent }}>{g.label}</h3>
                          </div>
                          <div>
                            {g.items.map((it, ii) => (
                              <SkillLine key={it} text={it} delay={ii * 90} accent={g.accent} />
                            ))}
                          </div>
                        </div>
                      </Tilt>
                    </Scene>
                  );
                })}
              </div>
            </section>

            {/* CONTACT */}
            <section id="contact" ref={(el) => (sectionRefs.current.contact = el)} className="relative py-16 md:py-24 border-t" style={{ borderColor: THEME.border }}>
              <SectionHead index="06" label="Contact" ghost="Talk" color={THEME.rust600} />
              <Scene delay={80}>
                <h3 className="text-3xl md:text-4xl mb-6 max-w-lg leading-tight" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, color: THEME.text }}>
                  Building something? I'd like to hear about it.
                </h3>
                <div className="flex flex-wrap gap-4">
                  <Magnetic>
                    <a href={`mailto:${email}`} className="px-6 py-3 rounded-full text-sm font-semibold hover:brightness-110 active:scale-95 transition-all block" style={{ background: THEME.gold500, color: THEME.cardText }}>
                      {email}
                    </a>
                  </Magnetic>
                  <Magnetic>
                    <a href={github} target="_blank" rel="noreferrer" className="px-6 py-3 rounded-full border text-sm font-semibold active:scale-95 transition-all block" style={{ borderColor: THEME.sage600, color: THEME.sage600 }}>
                      GitHub ↗
                    </a>
                  </Magnetic>
                </div>
              </Scene>
            </section>
          </main>

          {/* FOOTER */}
          <footer className="relative border-t overflow-hidden" style={{ borderColor: THEME.borderStrong, background: THEME.bgPanel }}>
            <div className="max-w-4xl mx-auto px-6 md:px-12 pt-14 pb-10 relative z-10">
              <div className="grid sm:grid-cols-3 gap-10 mb-12">
                <div>
                  <span className="text-lg block mb-3" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, color: THEME.text }}>
                    Insha<span style={{ color: THEME.gold600 }}>.</span>
                  </span>
                  <p className="text-sm leading-relaxed max-w-[220px]" style={{ color: THEME.textMuted }}>
                    Software engineer and founder building at the intersection of
                    circuits and craft.
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] mb-4" style={{ fontFamily: "'IBM Plex Mono', monospace", color: THEME.textFaint }}>
                    Navigate
                  </p>
                  <div className="flex flex-col gap-2.5">
                    {SECTIONS.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => navigateTo(s.id)}
                        className="text-sm text-left w-fit hover:text-[#2B1B10] transition-colors"
                        style={{ color: THEME.textMuted }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] mb-4" style={{ fontFamily: "'IBM Plex Mono', monospace", color: THEME.textFaint }}>
                    Connect
                  </p>
                  <div className="flex flex-col gap-2.5 text-sm mb-6" style={{ color: THEME.textMuted }}>
                    <a href={`mailto:${email}`} className="hover:text-[#2B1B10] transition-colors w-fit">{email}</a>
                    <a href={github} target="_blank" rel="noreferrer" className="hover:text-[#2B1B10] transition-colors w-fit flex items-center gap-1">
                      GitHub <ArrowUpRight size={12} />
                    </a>
                  </div>
                  <Magnetic strength={10}>
                    <button
                      onClick={() => navigateTo("about")}
                      className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border"
                      style={{ borderColor: THEME.borderStrong, color: THEME.text }}
                    >
                      <ArrowUp size={13} /> Back to top
                    </button>
                  </Magnetic>
                </div>
              </div>
              <div className="pt-6 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3" style={{ borderColor: THEME.border }}>
                <span className="text-xs" style={{ color: THEME.textFaint }}>Designed &amp; built by Insha</span>
                <span className="text-xs" style={{ fontFamily: "'IBM Plex Mono', monospace", color: THEME.textFaint }}>© {new Date().getFullYear()}</span>
              </div>
            </div>
            <span
              aria-hidden="true"
              className="pointer-events-none select-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 700,
                fontSize: "clamp(4rem, 16vw, 11rem)",
                color: THEME.gold600,
                opacity: 0.08,
                lineHeight: 1,
              }}
            >
              INSHA
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
}