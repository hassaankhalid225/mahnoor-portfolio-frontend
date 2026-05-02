'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_VITE_API_URL || "http://localhost:8000";

/* ---------------- EDITABLE DATA ---------------- */

const editorData = {
  name: "Mahnoor Fatima",
  title: "Video Editor & Motion Designer",
  tagline: "I don't edit videos. I craft stories.",
  bio: "Detail-obsessed video editor crafting cinematic Reels, Shorts, podcast cuts and long-form YouTube edits. I blend motion graphics, typography and rhythm to turn raw footage into stories that hold attention.",
  email: "mahnoorfatim09@gmail.com",
  whatsapp: "923297765694",
  whatsappDisplay: "+92 329 7765694",
  instagram: "mahnoorfatima.edits",
  linkedin: "mahnoorfatimavideoeditor",
  behance:
    "https://www.behance.net/gallery/243524121/Short-Form-Video-Editing-for-Reels-Shorts-Podcasts",
  stats: [
    { value: "50+", label: "Edits Delivered" },
    { value: "4+", label: "Years Practising" },
    { value: "15+", label: "Reels & Shorts" },
    { value: "100%", label: "Hand-Crafted" },
  ],
  tools: [
    "Adobe Premiere Pro",
    "After Effects",
    "DaVinci Resolve",
    "CapCut",
    "Canva",
    "Photoshop",
    "Illustrator",
  ],
};

const services = [
  {
    icon: "▶",
    title: "Short-form Reels & Shorts",
    desc: "Snappy 9:16 edits engineered for retention, trends and the algorithm.",
  },
  {
    icon: "◉",
    title: "Long-form YouTube Edits",
    desc: "Story-led pacing, B-roll, sound design and chapters that keep viewers watching.",
  },
  {
    icon: "✦",
    title: "Motion Graphics & Typography",
    desc: "Kinetic type, animated logos, lower-thirds and frame-perfect transitions.",
  },
  {
    icon: "◐",
    title: "Color Grading & Polish",
    desc: "Cinematic LUTs, mood-driven grades and clean audio for a premium finish.",
  },
];

const testimonials = [
  {
    quote:
      "Mahnoor turned hours of raw footage into a reel that actually felt like a film. Pacing, sound, color — all on point.",
    author: "Creator Client",
    role: "Podcast Host",
  },
  {
    quote:
      "Reliable, fast and creative. Every cut had intention. My retention graph speaks for itself.",
    author: "YouTube Creator",
    role: "Lifestyle Channel",
  },
  {
    quote:
      "The typography and motion work elevated our brand reels to a whole new level.",
    author: "Brand Manager",
    role: "DTC Startup",
  },
];

/* ---------------- MODAL ---------------- */

type ModalState = { id: string; vertical: boolean } | null;

function VideoModal({ state, onClose }: { state: ModalState; onClose: () => void }) {
  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [state, onClose]);

  if (!state) return null;
  const src = `https://www.youtube.com/embed/${state.id}?autoplay=1&rel=0`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        aria-label="Close video"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-cinema-text transition hover:border-cinema-accent hover:text-cinema-accent"
      >
        ✕
      </button>
      <div
        className={
          state.vertical
            ? "relative w-full max-w-[400px] overflow-hidden rounded-xl bg-black shadow-2xl"
            : "relative w-full max-w-5xl overflow-hidden rounded-xl bg-black shadow-2xl"
        }
        style={{ aspectRatio: state.vertical ? "9 / 16" : "16 / 9" }}
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={src}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}

/* ---------------- HELPERS ---------------- */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function thumbUrl(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}
function fallbackThumb(id: string) {
  return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
}

/* ---------------- COMPONENTS ---------------- */

function Nav({ onContact }: { onContact: () => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <a href="#top" className="font-display text-2xl tracking-widest text-cinema-text">
          MF<span className="text-cinema-accent">.</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm uppercase tracking-[0.18em] text-cinema-muted md:flex">
          {[
            { href: "#work", label: "Work" },
            { href: "#shorts", label: "Shorts" },
            { href: "#posters", label: "Posters" },
            { href: "#about", label: "About" },
            { href: "#services", label: "Services" },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition hover:text-cinema-accent"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <button
          onClick={onContact}
          className="rounded-full border border-cinema-accent/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-cinema-accent transition hover:bg-cinema-accent hover:text-cinema-bg"
        >
          Contact
        </button>
      </div>
    </header>
  );
}

function Hero() {
  const words = "I DON'T EDIT VIDEOS. I CRAFT STORIES.".split(" ");
  return (
    <section
      id="top"
      className="grain relative flex min-h-screen items-center overflow-hidden bg-cinema-bg pt-24"
    >
      <div
        className="mesh-anim absolute -left-1/4 -top-1/4 h-[80vh] w-[80vh] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(236,72,153,0.25), transparent 60%)",
        }}
      />
      <div
        className="mesh-anim absolute -bottom-1/3 -right-1/4 h-[70vh] w-[70vh] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 70% 70%, rgba(37,99,235,0.25), transparent 60%)",
          animationDelay: "-9s",
        }}
      />
      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-10">
        <p className="mb-6 inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-cinema-accent">
          <span className="h-px w-10 bg-cinema-accent" />
          {editorData.name} — {editorData.title}
        </p>
        <h1 className="font-display text-[14vw] leading-[0.9] tracking-tight text-cinema-text md:text-[8.5vw]">
          {words.map((w: string, index: number) => (
            <span
              key={index}
              className="word-rise mr-3 inline-block"
              style={{ animationDelay: `${index * 0.08 + 0.1}s` }}
            >
              {w === "STORIES." ? (
                <span className="italic text-cinema-accent">{w}</span>
              ) : (
                w
              )}
            </span>
          ))}
        </h1>
        <p className="mt-8 max-w-xl text-base text-cinema-muted md:text-lg">
          A cinematic editor turning raw footage into stories worth watching —
          Reels, Shorts, podcasts and long-form for creators &amp; brands.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#work"
            className="group inline-flex items-center gap-3 rounded-full bg-cinema-accent px-7 py-3.5 text-sm font-medium uppercase tracking-[0.2em] text-cinema-bg transition hover:bg-cinema-accent/90 accent-glow"
          >
            Watch My Work
            <span className="transition group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-3 rounded-full border border-white/20 px-7 py-3.5 text-sm font-medium uppercase tracking-[0.2em] text-cinema-text transition hover:border-cinema-accent hover:text-cinema-accent"
          >
            Contact Me
          </a>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-cinema-muted">
        scroll ↓
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="relative bg-cinema-bg px-6 py-28 md:px-10">
      <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-12">
        <div className="reveal md:col-span-5">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-cinema-accent">
            01 — About
          </p>
          <p className="font-display text-5xl italic leading-[0.95] text-cinema-text md:text-7xl">
            Every cut is a <span className="text-cinema-accent">decision.</span>
          </p>
        </div>
        <div className="reveal md:col-span-7">
          <p className="text-lg leading-relaxed text-cinema-text/90 md:text-xl">
            {editorData.bio}
          </p>
          <div className="mt-10">
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-cinema-muted">
              Toolkit
            </p>
            <div className="flex flex-wrap gap-2">
              {editorData.tools.map((t: string) => (
                <span
                  key={t}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-cinema-text/90 backdrop-blur-sm"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="reveal mx-auto mt-24 grid max-w-7xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:grid-cols-4">
        {editorData.stats.map((s: any) => (
          <div key={s.label} className="bg-cinema-bg px-6 py-10 text-center">
            <div className="font-display text-5xl text-cinema-accent md:text-6xl">
              {s.value}
            </div>
            <div className="mt-2 text-xs uppercase tracking-[0.25em] text-cinema-muted">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="relative bg-cinema-bg px-6 py-28 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="reveal mb-16 flex items-end justify-between gap-6">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-cinema-accent">
              02 — Services
            </p>
            <h2 className="font-display text-5xl leading-none text-cinema-text md:text-7xl">
              What I <span className="italic text-cinema-accent">Cut.</span>
            </h2>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((s: any, i: number) => (
            <div
              key={s.title}
              className="reveal group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-md transition hover:-translate-y-1 hover:border-cinema-accent/50"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="mb-8 text-3xl text-cinema-accent">{s.icon}</div>
              <h3 className="font-display text-2xl tracking-wide text-cinema-text">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-cinema-muted">
                {s.desc}
              </p>
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cinema-accent/60 to-transparent opacity-0 transition group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Carousel({
  children,
  scrollerRef,
}: {
  children: React.ReactNode;
  scrollerRef: React.RefObject<HTMLDivElement | null>;
}) {
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let animationFrameId: number;
    let isHovered = false;

    const scrollStep = () => {
      if (!isHovered && scroller) {
        scroller.scrollLeft += 1;
        if (Math.ceil(scroller.scrollLeft) + scroller.clientWidth >= scroller.scrollWidth) {
          scroller.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    const pause = () => (isHovered = true);
    const resume = () => (isHovered = false);

    scroller.addEventListener("mouseenter", pause);
    scroller.addEventListener("mouseleave", resume);
    scroller.addEventListener("touchstart", pause, { passive: true });
    scroller.addEventListener("touchend", resume);

    animationFrameId = requestAnimationFrame(scrollStep);

    return () => {
      cancelAnimationFrame(animationFrameId);
      scroller.removeEventListener("mouseenter", pause);
      scroller.removeEventListener("mouseleave", resume);
      scroller.removeEventListener("touchstart", pause);
      scroller.removeEventListener("touchend", resume);
    };
  }, [scrollerRef]);

  const scrollByAmount = (dx: number) => scrollerRef.current?.scrollBy({ left: dx, behavior: "smooth" });

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="no-scrollbar -mx-6 flex gap-5 overflow-x-auto px-6 pb-4 md:-mx-10 md:px-10"
      >
        {children}
      </div>
      <div className="mt-6 hidden justify-end gap-2 md:flex">
        <button
          aria-label="Scroll left"
          onClick={() => scrollByAmount(-500)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-cinema-text transition hover:border-cinema-accent hover:text-cinema-accent"
        >
          ←
        </button>
        <button
          aria-label="Scroll right"
          onClick={() => scrollByAmount(500)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-cinema-text transition hover:border-cinema-accent hover:text-cinema-accent"
        >
          →
        </button>
      </div>
    </div>
  );
}

function VideosSection({ onOpen }: { onOpen: (s: ModalState) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { data: videos = [] } = useQuery({
    queryKey: ["/videos"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/videos`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  return (
    <section id="work" className="relative bg-cinema-bg px-6 py-28 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="reveal mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-cinema-accent">
              03 — Featured Videos
            </p>
            <h2 className="font-display text-5xl leading-none text-cinema-text md:text-7xl">
              Long-form, <span className="italic text-cinema-accent">cinematic.</span>
            </h2>
          </div>
        </div>
        <Carousel scrollerRef={ref}>
          {videos.length > 0 ? videos.map((v: any) => (
            <button
              key={v.id}
              onClick={() => onOpen({ id: v.youtube_id, vertical: false })}
              className="group relative w-[88vw] flex-shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-cinema-surface text-left transition hover:border-cinema-accent/60 md:w-[640px]"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={thumbUrl(v.youtube_id)}
                  alt={v.title}
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = fallbackThumb(v.youtube_id);
                  }}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cinema-accent/95 text-cinema-bg shadow-2xl transition group-hover:scale-110">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 p-5">
                <h3 className="font-display text-xl tracking-wide text-cinema-text">
                  {v.title}
                </h3>
                <span className="text-cinema-accent">↗</span>
              </div>
            </button>
          )) : (
            <div className="text-cinema-muted py-10">No featured videos found.</div>
          )}
        </Carousel>
      </div>
    </section>
  );
}

function ShortsSection({ onOpen }: { onOpen: (s: ModalState) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  const { data: shorts = [] } = useQuery({
    queryKey: ["/shorts"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/shorts`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  return (
    <section id="shorts" className="relative bg-cinema-surface-2 px-6 py-28 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="reveal mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-cinema-accent">
              04 — Shorts &amp; Reels
            </p>
            <h2 className="font-display text-5xl leading-none text-cinema-text md:text-7xl">
              Vertical, <span className="italic text-cinema-accent">addictive.</span>
            </h2>
          </div>
        </div>
        <Carousel scrollerRef={ref}>
          {shorts.length > 0 ? shorts.map((s: any) => (
            <button
              key={s.id}
              onClick={() => onOpen({ id: s.youtube_id, vertical: true })}
              className="group relative w-[60vw] flex-shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-black text-left transition hover:border-cinema-accent/60 sm:w-[44vw] md:w-[240px]"
              style={{ aspectRatio: "9 / 16" }}
            >
              <img
                src={thumbUrl(s.youtube_id)}
                alt={s.title}
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = fallbackThumb(s.youtube_id);
                }}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cinema-accent/95 text-cinema-bg shadow-2xl transition group-hover:scale-110">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cinema-text/90">
                  {s.title}
                </p>
              </div>
            </button>
          )) : (
            <div className="text-cinema-muted py-10">No shorts found.</div>
          )}
        </Carousel>
      </div>
    </section>
  );
}

function PostersSection() {
  const { data: posters = [], isLoading } = useQuery({
    queryKey: ["/posters"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/posters/`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  const ref = useRef<HTMLDivElement>(null);

  return (
    <section id="posters" className="relative bg-cinema-bg px-6 py-28 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="reveal mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-cinema-accent">
              05 — Posters &amp; Thumbnails
            </p>
            <h2 className="font-display text-5xl leading-none text-cinema-text md:text-7xl">
              Static, <span className="italic text-cinema-accent">impactful.</span>
            </h2>
          </div>
        </div>

        {isLoading ? (
          <Carousel scrollerRef={ref}>
            {[1, 2, 3].map((i: number) => (
              <div
                key={i}
                className="group relative w-[80vw] flex-shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:w-[400px] animate-pulse"
                style={{ aspectRatio: "4 / 5" }}
              />
            ))}
          </Carousel>
        ) : posters.length > 0 ? (
          <Carousel scrollerRef={ref}>
            {posters.map((p: any) => {
              const optimizedSrc = p.secure_url.replace("/upload/", "/upload/c_scale,w_800,q_auto,f_auto/");
              return (
                <div
                  key={p.id}
                  className="group relative w-[80vw] flex-shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-black text-left transition hover:border-cinema-accent/60 md:w-[400px]"
                  style={{ aspectRatio: "4 / 5" }}
                >
                  <img
                    src={optimizedSrc}
                    alt="Poster"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                </div>
              );
            })}
          </Carousel>
        ) : (
          <div className="text-cinema-muted rounded-xl border border-white/10 bg-white/5 p-8 text-center">
            <p>No posters found.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="relative bg-cinema-surface-2 px-6 py-28 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="reveal mb-14">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-cinema-accent">
            06 — Words from clients
          </p>
          <h2 className="font-display text-5xl leading-none text-cinema-text md:text-7xl">
            Kind <span className="italic text-cinema-accent">words.</span>
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t: any, index: number) => (
            <figure
              key={index}
              className="reveal flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="font-display text-5xl leading-none text-cinema-accent">
                “
              </div>
              <blockquote className="mt-4 flex-1 text-base italic leading-relaxed text-cinema-text/90">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 border-t border-white/10 pt-4 text-sm">
                <div className="text-cinema-text">{t.author}</div>
                <div className="text-cinema-muted">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section
      id="contact"
      className="grain relative overflow-hidden bg-cinema-surface px-6 py-32 md:px-10"
    >
      <div
        className="absolute inset-0 opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(236,72,153,0.25), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-5xl text-center">
        <p className="reveal mb-6 text-xs uppercase tracking-[0.3em] text-cinema-accent">
          07 — Let's talk
        </p>
        <h2 className="reveal font-display text-6xl leading-[0.95] text-cinema-text md:text-8xl">
          Let's create something{" "}
          <span className="italic text-cinema-accent">cinematic.</span>
        </h2>
        <div className="reveal mt-12 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`mailto:${editorData.email}`}
            className="inline-flex items-center gap-3 rounded-full bg-cinema-accent px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-cinema-bg transition hover:opacity-90 accent-glow"
          >
            ✉ Email
          </a>
          <a
            href={`https://wa.me/${editorData.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 rounded-full border border-white/20 px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-cinema-text transition hover:border-cinema-accent hover:text-cinema-accent"
          >
            ⌘ WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-cinema-bg px-6 py-12 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <div className="font-display text-3xl tracking-widest text-cinema-text">
            {editorData.name}
            <span className="text-cinema-accent">.</span>
          </div>
          <p className="mt-1 text-sm text-cinema-muted">{editorData.tagline}</p>
        </div>
        <div className="flex flex-wrap gap-6 text-xs uppercase tracking-[0.25em] text-cinema-muted">
          <a href={`mailto:${editorData.email}`} className="hover:text-cinema-accent">
            Email
          </a>
          <a
            href={`https://instagram.com/${editorData.instagram}`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-cinema-accent"
          >
            Instagram
          </a>
        </div>
        <div className="text-xs uppercase tracking-[0.25em] text-cinema-muted">
          © {new Date().getFullYear()} {editorData.name}
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const [modal, setModal] = useState<ModalState>(null);
  useReveal();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  const goContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-cinema-bg text-cinema-text">
      <Nav onContact={goContact} />
      <Hero />
      <About />
      <Services />
      <VideosSection onOpen={setModal} />
      <ShortsSection onOpen={setModal} />
      <PostersSection />
      <Testimonials />
      <Contact />
      <Footer />
      <VideoModal state={modal} onClose={() => setModal(null)} />
    </main>
  );
}
