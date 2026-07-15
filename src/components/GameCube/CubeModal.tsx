'use client';

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { aboutContent, experience, projects } from "@/data/portfolioContent";
import { TechIcon, getTechColor } from "@/components/portfolio/Icons";
import { ContactForm } from "@/components/portfolio/ContactForm";
import type { CubeSection } from "@/components/GameCube/CubePreview";

interface CubeModalProps {
  isOpen: boolean;
  section: CubeSection | null;
  onClose: () => void;
}

type SectionConfig = {
  module: string;
  code: string;
  title: string;
  tagline: string;
  accent: string;
  accentRgb: string;
  footer: string;
};

const SECTION_CONFIG: Record<CubeSection, SectionConfig> = {
  PROJECTS: {
    module: "01",
    code: "ARCHIVE_01",
    title: "Projects",
    tagline: "Development archives and deployed builds.",
    accent: "#06b6d4",
    accentRgb: "6, 182, 212",
    footer: `${projects.length} archives indexed · ESC to close`,
  },
  ABOUT: {
    module: "02",
    code: "PROFILE_02",
    title: "About",
    tagline: "Operator profile and technical background.",
    accent: "#f97316",
    accentRgb: "249, 115, 22",
    footer: "Profile module loaded · ESC to close",
  },
  EXPERIENCE: {
    module: "03",
    code: "CAREER_03",
    title: "Experience",
    tagline: "Career trajectory and core competencies.",
    accent: "#10b981",
    accentRgb: "16, 185, 129",
    footer: `${experience.length} career records · ESC to close`,
  },
  CONTACT: {
    module: "04",
    code: "COMMS_04",
    title: "Contact",
    tagline: "Direct communication channel for inquiries.",
    accent: "#94a3b8",
    accentRgb: "148, 163, 184",
    footer: "Channel ready · ESC to close",
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

  const config = SECTION_CONFIG[section];

  const modalContent = (
    <div
      className="cube-modal-backdrop fixed inset-0 z-[100] flex items-center justify-center px-3 py-4 sm:px-4 sm:py-6 pointer-events-auto"
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
        <div className="cube-modal-notch" aria-hidden="true" />

        <header className="cube-modal-sysbar">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="cube-ui-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-400 shrink-0">
              PORTFOLIO_OS
            </span>
            <span className="hidden sm:inline text-slate-600">/</span>
            <span className="cube-ui-mono text-[10px] sm:text-xs uppercase tracking-[0.15em] text-[color:var(--section-accent)] truncate">
              {config.code}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2">
              <span className="cube-status-dot" aria-hidden="true" />
              <span className="cube-ui-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300/80">
                ONLINE
              </span>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="min-h-11 min-w-11 px-3 cube-ui-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-slate-300 hover:text-white border border-white/10 rounded-lg hover:border-[color:var(--section-accent)] transition-colors"
            >
              Close
            </button>
          </div>
        </header>

        <div className="cube-modal-hero">
          <div className="cube-modal-module-num cube-ui-mono" aria-hidden="true">
            {config.module}
          </div>
          <div className="min-w-0">
            <p className="cube-ui-mono text-[10px] uppercase tracking-[0.25em] text-slate-400">
              Module {config.module}
            </p>
            <h2 id="cube-modal-title" className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
              {config.title}
            </h2>
            <p id="cube-modal-desc" className="mt-1.5 text-sm sm:text-base text-slate-300 max-w-2xl">
              {config.tagline}
            </p>
            <div className="cube-modal-accent-line" aria-hidden="true" />
          </div>
        </div>

        <div className="cube-modal-content">
          {section === "PROJECTS" && (
            <div className="grid gap-4 sm:gap-5">
              {projects.map((project, index) => (
                <article
                  key={project.title}
                  data-index={`ARCHIVE ${String(index + 1).padStart(2, "0")}`}
                  className="cube-modal-card cube-modal-archive p-4 sm:p-5 md:p-6"
                >
                  <div
                    className={`grid gap-4 sm:gap-5 items-start ${
                      index % 2 === 0 ? "md:grid-cols-[1.1fr_1.3fr]" : "md:grid-cols-[1.3fr_1.1fr]"
                    }`}
                  >
                    <div
                      className={`relative aspect-video overflow-hidden rounded-xl border border-white/10 ${
                        index % 2 === 1 ? "md:order-2" : ""
                      }`}
                    >
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover object-top"
                      />
                    </div>
                    <div className={`flex flex-col gap-3 ${index % 2 === 1 ? "md:order-1" : ""}`}>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="cube-ui-mono text-xs uppercase tracking-[0.16em] px-2 py-1 rounded-full border"
                          style={{
                            color: config.accent,
                            borderColor: `rgba(${config.accentRgb}, 0.35)`,
                            background: `rgba(${config.accentRgb}, 0.1)`,
                          }}
                        >
                          DEPLOYED
                        </span>
                        <span className="cube-ui-mono text-xs uppercase tracking-[0.16em] text-slate-500">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-semibold text-white">{project.title}</h3>
                      <p className="text-sm text-slate-200 leading-relaxed">{project.description}</p>
                      <div className="flex flex-wrap items-center gap-3">
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border px-3 sm:px-4 py-1.5 sm:py-2 text-xs uppercase tracking-[0.16em] transition-colors"
                          style={{
                            color: config.accent,
                            borderColor: `rgba(${config.accentRgb}, 0.45)`,
                            background: `rgba(${config.accentRgb}, 0.1)`,
                          }}
                        >
                          View Live
                        </a>
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-slate-200 hover:text-purple-300"
                            aria-label={`${project.title} GitHub repository`}
                          >
                            <TechIcon name="github" className="w-5 h-5" />
                            GitHub
                          </a>
                        )}
                        <div className="flex flex-wrap items-center gap-2">
                          {project.tags.map((tag) => (
                            <span key={tag} className={`flex items-center ${getTechColor(tag)}`}>
                              <TechIcon name={tag} className="w-4 h-4 sm:w-5 sm:h-5" />
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {section === "ABOUT" && (
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="cube-modal-card p-4 sm:p-5 md:p-6">
                <p className="cube-ui-mono text-xs uppercase tracking-[0.2em] text-slate-400">
                  Operator Summary
                </p>
                <p className="mt-3 text-base sm:text-lg text-white leading-relaxed">{aboutContent.summary}</p>
                <p className="mt-4 text-sm text-slate-200 leading-relaxed">{aboutContent.body}</p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="cube-modal-id-frame">
                  {aboutContent.imageUrl && (
                    <div className="relative aspect-square w-full max-w-[180px] mx-auto overflow-hidden rounded-xl border border-white/10">
                      <Image
                        src={aboutContent.imageUrl}
                        alt="Enrique Vázquez"
                        fill
                        sizes="180px"
                        className="object-cover object-center"
                      />
                    </div>
                  )}
                </div>

                <div className="cube-modal-card p-4 sm:p-5 flex flex-col gap-4">
                  <div>
                    <p className="cube-ui-mono text-xs uppercase tracking-[0.2em] text-slate-400">
                      Current Focus
                    </p>
                    <p className="mt-2 text-sm text-slate-200 leading-relaxed">
                      Building modern web products, crafting APIs, and shaping 3D visual narratives.
                    </p>
                  </div>
                  <a
                    href={aboutContent.cvUrl}
                    download="CV-Enrique-Vazquez.pdf"
                    className="cube-form-submit text-center"
                  >
                    {aboutContent.cvLabel}
                  </a>
                </div>
              </div>
            </div>
          )}

          {section === "EXPERIENCE" && (
            <div className="cube-modal-timeline max-w-3xl">
              {experience.map((item) => (
                <article key={item.title} className="cube-modal-timeline-item cube-modal-card p-4 sm:p-5">
                  <p className="cube-ui-mono text-xs uppercase tracking-[0.2em] text-slate-400">
                    {item.subtitle}
                  </p>
                  <h3 className="mt-2 text-lg sm:text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                    {item.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs uppercase tracking-[0.12em] text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}

          {section === "CONTACT" && (
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="cube-modal-card p-4 sm:p-5 md:p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="cube-status-dot" aria-hidden="true" />
                  <span className="cube-ui-mono text-xs uppercase tracking-[0.16em] text-emerald-300/85">
                    CHANNEL READY
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white">Let us build the next release</h3>
                <p className="text-sm text-slate-200 leading-relaxed">
                  Share a brief, timeline, and goals. I will follow up with a plan and next steps, typically within
                  1–2 business days.
                </p>
              </div>
              <div className="cube-modal-card p-4 sm:p-5 md:p-6">
                <ContactForm compact className="w-full" />
              </div>
            </div>
          )}
        </div>

        <footer className="cube-modal-footer cube-ui-mono uppercase tracking-[0.15em]">
          <span>{config.footer}</span>
          <span className="hidden sm:inline">ENTER: ACTION · TAB: NAVIGATE</span>
        </footer>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
