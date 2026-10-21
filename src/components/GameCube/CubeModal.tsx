'use client';

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { aboutContent, experience, projects } from "@/data/portfolioContent";
import { TechIcon, getTechColor } from "@/components/portfolio/Icons";
import { ContactForm } from "@/components/portfolio/ContactForm";
import { SECTION_ACCENTS, type CubeSection } from "@/components/GameCube/CubePreview";

interface CubeModalProps {
  isOpen: boolean;
  section: CubeSection | null;
  onClose: () => void;
  onSelectSection?: (section: CubeSection) => void;
}

type SectionConfig = {
  id: CubeSection;
  title: string;
  tagline: string;
  accent: string;
  accentRgb: string;
};

const SECTIONS_CONFIG: Record<CubeSection, SectionConfig> = {
  PROJECTS: {
    id: "PROJECTS",
    title: "Projects",
    tagline: "Production builds, applications, and technical archives.",
    accent: SECTION_ACCENTS.PROJECTS.hex,
    accentRgb: SECTION_ACCENTS.PROJECTS.rgb,
  },
  ABOUT: {
    id: "ABOUT",
    title: "About Me",
    tagline: "Engineering profile, background, and architectural focus.",
    accent: SECTION_ACCENTS.ABOUT.hex,
    accentRgb: SECTION_ACCENTS.ABOUT.rgb,
  },
  EXPERIENCE: {
    id: "EXPERIENCE",
    title: "Experience",
    tagline: "Career trajectory, engineering leadership, and core competencies.",
    accent: SECTION_ACCENTS.EXPERIENCE.hex,
    accentRgb: SECTION_ACCENTS.EXPERIENCE.rgb,
  },
  CONTACT: {
    id: "CONTACT",
    title: "Contact",
    tagline: "Direct communication channel for project inquiries and collaboration.",
    accent: SECTION_ACCENTS.CONTACT.hex,
    accentRgb: SECTION_ACCENTS.CONTACT.rgb,
  },
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const CubeModal = ({ isOpen, section, onClose }: CubeModalProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen || !section || !mounted) return null;

  const config = SECTIONS_CONFIG[section];

  const modalContent = (
    <div
      className="cube-modal-backdrop fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 pointer-events-auto"
      style={
        {
          "--section-accent": config.accent,
          "--section-accent-rgb": config.accentRgb,
          "--section-muted": `rgba(${config.accentRgb}, 0.12)`,
        } as React.CSSProperties
      }
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cube-modal-title"
        aria-describedby="cube-modal-desc"
        tabIndex={-1}
        className="cube-modal-shell cube-ui touch-auto"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Clean, Focused Header */}
        <header className="cube-modal-header flex items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5 border-b border-white/[0.08] bg-black/25">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{
                backgroundColor: config.accent,
                boxShadow: `0 0 10px ${config.accent}`,
              }}
            />
            <div className="min-w-0">
              <h2 id="cube-modal-title" className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
                {config.title}
              </h2>
              <p id="cube-modal-desc" className="text-xs sm:text-sm text-slate-400 truncate">
                {config.tagline}
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close modal (Esc)"
            className="inline-flex items-center gap-2 px-3 py-1.5 cube-ui-mono text-[11px] uppercase tracking-wider text-slate-300 hover:text-white border border-white/10 hover:border-white/30 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors shrink-0"
          >
            <span>Close</span>
            <span className="hidden sm:inline text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-slate-400 font-mono">
              ESC
            </span>
          </button>
        </header>

        {/* Scrollable Content Container */}
        <div className="cube-modal-content">
          {/* ── PROJECTS SECTION ── */}
          {section === "PROJECTS" && (
            <div className="grid gap-5">
              {projects.map((project) => (
                <article
                  key={project.title}
                  className="cube-modal-card p-4 sm:p-5 md:p-6"
                >
                  <div className="grid gap-5 md:grid-cols-[1.1fr_1.3fr] items-start">
                    {/* Project Image */}
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-slate-900/50 group">
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                    </div>

                    {/* Project Info */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="cube-ui-mono text-[10px] uppercase tracking-[0.18em] px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1.5 font-medium"
                          style={{
                            color: config.accent,
                            borderColor: `rgba(${config.accentRgb}, 0.4)`,
                            background: `rgba(${config.accentRgb}, 0.1)`,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full animate-pulse"
                            style={{ backgroundColor: config.accent }}
                          />
                          DEPLOYED
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {project.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Tech stack */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 ${getTechColor(tag)}`}
                          >
                            <TechIcon name={tag} className="w-3.5 h-3.5" />
                            <span className="capitalize">{tag}</span>
                          </span>
                        ))}
                      </div>

                      {/* Action Links */}
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs uppercase tracking-[0.16em] font-medium text-white transition-all shadow-sm"
                          style={{
                            backgroundColor: config.accent,
                            boxShadow: `0 0 16px rgba(${config.accentRgb}, 0.35)`,
                          }}
                        >
                          <span>View Live</span>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>

                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.16em] text-slate-200 hover:text-white transition-colors"
                          >
                            <TechIcon name="github" className="w-4 h-4" />
                            <span>GitHub</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* ── ABOUT SECTION ── */}
          {section === "ABOUT" && (
            <div className="grid gap-5 lg:grid-cols-[280px_1fr] items-start">
              {/* Profile Card */}
              <div className="cube-modal-card p-5 flex flex-col items-center text-center gap-4">
                {aboutContent.imageUrl && (
                  <div
                    className="relative aspect-square w-36 sm:w-44 overflow-hidden rounded-2xl border p-1"
                    style={{
                      borderColor: `rgba(${config.accentRgb}, 0.35)`,
                      boxShadow: `0 0 24px rgba(${config.accentRgb}, 0.15)`,
                    }}
                  >
                    <div className="relative w-full h-full rounded-xl overflow-hidden">
                      <Image
                        src={aboutContent.imageUrl}
                        alt="Enrique Vázquez"
                        fill
                        sizes="176px"
                        className="object-cover object-center"
                        priority
                      />
                    </div>
                  </div>
                )}

                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] cube-ui-mono uppercase tracking-wider mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Available for roles
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Enrique Vázquez
                  </h3>
                  <p className="text-xs cube-ui-mono uppercase tracking-wider text-orange-400/90 mt-1">
                    Full-Stack Engineer & Founder
                  </p>
                </div>

                <a
                  href={aboutContent.cvUrl}
                  download="CV_Enrique_Vazquez.pdf"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs uppercase tracking-[0.16em] font-medium text-white transition-all"
                  style={{
                    backgroundColor: config.accent,
                    boxShadow: `0 0 16px rgba(${config.accentRgb}, 0.35)`,
                  }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>{aboutContent.cvLabel}</span>
                </a>
              </div>

              {/* Bio & Details */}
              <div className="flex flex-col gap-4">
                <div className="cube-modal-card p-5 sm:p-6 flex flex-col gap-4">
                  <span className="cube-ui-mono text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: config.accent }}>
                    About Me
                  </span>

                  <p className="text-base sm:text-lg text-white font-medium leading-relaxed">
                    {aboutContent.summary}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {aboutContent.body}
                  </p>
                </div>

                <div className="cube-modal-card p-5 sm:p-6 flex flex-col gap-3">
                  <p className="cube-ui-mono text-xs uppercase tracking-[0.2em] text-slate-400">
                    Current Architecture Focus
                  </p>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    Building modern web products, crafting scalable .NET APIs, and shaping AI/3D visual narratives.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2">
                    {[
                      "Startup México Selected",
                      "EdTech Founder",
                      ".NET Ecosystem",
                      "Google Cloud Platform",
                      "AI & RAG Architecture",
                    ].map((chip) => (
                      <span
                        key={chip}
                        className="cube-ui-mono text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-slate-300"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── EXPERIENCE SECTION ── */}
          {section === "EXPERIENCE" && (
            <div className="cube-modal-timeline max-w-4xl">
              {experience.map((item, index) => {
                const roleTitle = item.role || item.subtitle;
                const companyName = item.company || item.title.split(",")[0].trim();
                const locationName = item.location || (item.title.includes(",") ? item.title.substring(item.title.indexOf(",") + 1).trim() : "");
                const periodBadge = item.period || (item.subtitle.match(/\((.*?)\)/)?.[1] ?? "");

                const bullets = item.bullets ?? (
                  item.summary.includes("•")
                    ? item.summary
                        .split("\n\n")
                        .filter((s) => s.trim().startsWith("•"))
                        .map((b) => {
                          const raw = b.replace(/^•\s*/, "").trim();
                          const colonIdx = raw.indexOf(":");
                          if (colonIdx !== -1 && colonIdx < 50) {
                            return {
                              highlight: raw.slice(0, colonIdx).trim(),
                              text: raw.slice(colonIdx + 1).trim(),
                            };
                          }
                          return { text: raw };
                        })
                    : []
                );

                const overview = item.overview ?? (
                  item.summary.includes("•")
                    ? item.summary.split("\n\n")[0]
                    : item.summary
                );

                return (
                  <article
                    key={item.title + index}
                    className="cube-modal-timeline-item cube-modal-card p-5 sm:p-6"
                  >
                    {/* Header: Role & Period */}
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                        {roleTitle}
                      </h3>
                      {periodBadge && (
                        <span className="cube-ui-mono text-xs px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-emerald-300 font-mono">
                          {periodBadge}
                        </span>
                      )}
                    </div>

                    {/* Company & Location */}
                    <div className="flex items-center gap-2 mb-4 text-xs sm:text-sm">
                      <span className="font-semibold text-emerald-400">
                        {companyName}
                      </span>
                      {locationName && (
                        <>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-400">{locationName}</span>
                        </>
                      )}
                    </div>

                    {/* Overview Callout */}
                    {overview && (
                      <div
                        className="mb-4 rounded-lg border-l-2 p-3 sm:p-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed"
                        style={{
                          borderColor: config.accent,
                          background: `rgba(${config.accentRgb}, 0.06)`,
                        }}
                      >
                        {overview}
                      </div>
                    )}

                    {/* Structured Key Achievements Bullets */}
                    {bullets.length > 0 && (
                      <ul className="space-y-3 sm:space-y-3.5 mb-5">
                        {bullets.map((bullet, bIdx) => (
                          <li
                            key={bIdx}
                            className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-slate-300 leading-relaxed"
                          >
                            <span
                              className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0"
                              style={{
                                backgroundColor: config.accent,
                                boxShadow: `0 0 8px ${config.accent}`,
                              }}
                            />
                            <div className="flex-1">
                              {bullet.highlight && (
                                <span className="font-semibold text-white mr-1.5">
                                  {bullet.highlight}:
                                </span>
                              )}
                              <span>{bullet.text}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Technologies Pills */}
                    {item.tags.length > 0 && (
                      <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-1.5">
                        <span className="cube-ui-mono text-[10px] uppercase tracking-wider text-slate-400 mr-1">
                          Stack:
                        </span>
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="cube-ui-mono text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-slate-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}

          {/* ── CONTACT SECTION ── */}
          {section === "CONTACT" && (
            <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] items-start">
              {/* Channel Overview */}
              <div className="cube-modal-card p-5 sm:p-6 flex flex-col gap-4">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Let us build the next release
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Share a brief, timeline, and goals. I will follow up with a plan and next steps, typically within
                  1–2 business days.
                </p>

                <div className="mt-2 pt-4 border-t border-white/10 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs text-slate-300">
                    <span className="cube-ui-mono text-[10px] uppercase tracking-wider text-slate-400">Response:</span>
                    <span className="text-white font-medium">&lt; 24–48 business hours</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-300">
                    <span className="cube-ui-mono text-[10px] uppercase tracking-wider text-slate-400">Location:</span>
                    <span className="text-white font-medium">Monterrey, Mexico · Global Remote</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-300">
                    <span className="cube-ui-mono text-[10px] uppercase tracking-wider text-slate-400">Timezone:</span>
                    <span className="text-white font-medium">CST (UTC-6)</span>
                  </div>
                </div>
              </div>

              {/* Interactive Form */}
              <div className="cube-modal-card p-5 sm:p-6">
                <ContactForm compact className="w-full" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
