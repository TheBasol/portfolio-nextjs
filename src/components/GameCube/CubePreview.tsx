'use client';

import React from "react";
import Image from "next/image";
import { aboutContent, experience, projects } from "@/data/portfolioContent";
import { TechIcon, getTechColor } from "@/components/portfolio/Icons";

export type CubeSection = "PROJECTS" | "ABOUT" | "EXPERIENCE" | "CONTACT";

interface CubePreviewProps {
  section: CubeSection;
  onOpen: () => void;
  anchor?: { x: number; y: number; visible: boolean } | null;
  isEmbedded?: boolean;
}

const sectionTitle: Record<CubeSection, string> = {
  PROJECTS: "Projects",
  ABOUT: "About",
  EXPERIENCE: "Experience",
  CONTACT: "Contact",
};

const menuTabs: Array<{ id: CubeSection; label: string }> = [
  { id: "PROJECTS", label: "Projects" },
  { id: "ABOUT", label: "About" },
  { id: "EXPERIENCE", label: "Experience" },
  { id: "CONTACT", label: "Contact" },
];

export const SECTION_ACCENTS: Record<
  CubeSection,
  { hex: string; rgb: string; index: string; slotCode: string }
> = {
  PROJECTS: { hex: "#22d3ee", rgb: "34, 211, 238", index: "01", slotCode: "SLOT_A // ARCHIVES" },
  ABOUT: { hex: "#fb923c", rgb: "251, 146, 60", index: "02", slotCode: "SLOT_B // PROFILE" },
  EXPERIENCE: { hex: "#34d399", rgb: "52, 211, 153", index: "03", slotCode: "SLOT_C // RECORDS" },
  CONTACT: { hex: "#c084fc", rgb: "192, 132, 252", index: "04", slotCode: "SLOT_D // COMMS" },
};

const faceDescription: Record<CubeSection, string> = {
  PROJECTS: "Accessing stored development archives and deployed AI applications.",
  ABOUT: "Operator profile, technical architecture focus, and background.",
  EXPERIENCE: "Career trajectory, engineering leadership, and core competencies.",
  CONTACT: "Direct communication channel ready for project & role inquiries.",
};

const FaceHighlight = ({ section }: { section: CubeSection }) => {
  if (section === "PROJECTS") {
    const project = projects[0];
    return (
      <div className="cube-face-highlight">
        <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl border border-white/20 shadow-md">
          <Image src={project.imageUrl} alt={project.title} fill sizes="128px" className="object-cover object-top" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="cube-face-highlight-label">LATEST BUILD // 01</p>
          <p className="truncate text-xl font-bold text-white tracking-tight">{project.title}</p>
          <div className="mt-2 flex items-center gap-2">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className={`flex items-center justify-center h-7 w-7 rounded-lg bg-white/[0.06] border border-white/10 ${getTechColor(tag)}`}
                title={tag}
              >
                <TechIcon name={tag} className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (section === "ABOUT") {
    return (
      <div className="cube-face-highlight">
        {aboutContent.imageUrl && (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/20 shadow-md">
            <Image src={aboutContent.imageUrl} alt="Enrique Vázquez" fill sizes="80px" className="object-cover" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="cube-face-highlight-label">OPERATOR // ID_01</p>
          <p className="truncate text-xl font-bold text-white tracking-tight">Enrique Vázquez</p>
          <p className="truncate text-sm font-semibold text-slate-200 mt-0.5">Full-Stack Engineer & Founder</p>
          <p className="truncate text-xs text-slate-400 mt-1">Architecture · Scalable Cloud & AI Platforms</p>
        </div>
      </div>
    );
  }

  if (section === "EXPERIENCE") {
    const current = experience[0];
    return (
      <div className="cube-face-highlight">
        <div className="relative h-20 w-20 shrink-0 rounded-2xl bg-white/[0.05] border border-white/15 flex flex-col items-center justify-center text-[color:var(--face-accent)] shadow-inner gap-1">
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">2026</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="cube-face-highlight-label">ACTIVE LOG // 2026</p>
          <p className="truncate text-lg font-bold text-white tracking-tight leading-snug">{current.subtitle}</p>
          <p className="truncate text-sm text-slate-300 mt-0.5">{current.title}</p>
          <p className="truncate text-xs text-emerald-400/90 font-mono mt-1">● Present · Full-Stack Lead</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cube-face-highlight">
      <div className="relative h-20 w-20 shrink-0 rounded-2xl bg-white/[0.05] border border-white/15 flex flex-col items-center justify-center text-[color:var(--face-accent)] shadow-inner gap-1">
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 6h16v12H4z" strokeLinejoin="round" />
          <path d="m4 7 8 6 8-6" strokeLinejoin="round" />
        </svg>
        <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-purple-300 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="cube-face-highlight-label">SIGNAL LINK // ONLINE</p>
        <p className="truncate text-xl font-bold text-white tracking-tight">Direct Transmission Ready</p>
        <p className="truncate text-sm text-slate-300 mt-0.5">Open for project & role inquiries</p>
        <p className="truncate text-xs text-purple-300/80 font-mono mt-1">Response time &lt; 24h · Remote & Global</p>
      </div>
    </div>
  );
};

export const CubePreview = ({ section, onOpen, anchor, isEmbedded }: CubePreviewProps) => {
  if (isEmbedded) {
    const accent = SECTION_ACCENTS[section];

    return (
      <div
        className="cube-face-card cube-ui relative flex h-full w-full select-none flex-col overflow-hidden p-7 text-white pointer-events-auto"
        style={
          {
            "--face-accent": accent.hex,
            "--face-accent-rgb": accent.rgb,
          } as React.CSSProperties
        }
      >
        <div className="cube-face-scan-overlay" />
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.12)_50%)] bg-[length:100%_4px] opacity-10 rounded-[inherit]" />

        <div className="relative z-10 flex flex-1 flex-col justify-between h-full">
          <div className="space-y-2.5">
            <h3
              className="cube-face-embedded-title font-black italic tracking-tight uppercase text-[color:var(--face-accent)]"
              style={{ textShadow: `0 0 24px rgba(${accent.rgb}, 0.35)` }}
            >
              {sectionTitle[section]}
            </h3>
            <p className="text-[15px] leading-relaxed text-slate-200/90 font-medium">
              {faceDescription[section]}
            </p>
          </div>

          <FaceHighlight section={section} />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            className="cube-face-cta group/btn"
          >
            <span className="text-[14px] font-bold tracking-[0.18em] uppercase">
              OPEN {sectionTitle[section]}
            </span>
            <span className="flex items-center gap-2.5">
              <kbd className="cube-face-kbd cube-ui-mono">A / ENTER</kbd>
              <span className="transition-transform duration-300 group-hover/btn:translate-x-1.5" aria-hidden="true">
                →
              </span>
            </span>
          </button>
        </div>
      </div>
    );
  }

  const style = anchor?.visible
    ? { left: anchor.x, top: anchor.y }
    : { left: "50%", top: "70%" };

  return (
    <div
      className="absolute z-20 pointer-events-none"
      style={{
        ...style,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="relative">
        <div className="cube-preview-panel cube-preview-panel-attached cube-ui pointer-events-auto touch-auto w-[min(78vw,34rem)] rounded-3xl border border-white/10 px-5 py-5 md:px-8 md:py-6 shadow-2xl">
          <div className="cube-menu-header">
            <div className="cube-menu-title">
              <span className="cube-ui-mono text-[10px] uppercase tracking-[0.45em] text-slate-300">
                Cube Menu
              </span>
              <span className="text-xs uppercase tracking-[0.4em] text-slate-400">
                Portfolio OS
              </span>
            </div>
            <div className="cube-menu-status">
              <span className="cube-menu-dot" />
              <span className="cube-ui-mono text-[10px] uppercase tracking-[0.3em] text-slate-300">
                Ready
              </span>
            </div>
          </div>

          <div className="cube-menu-bar">
            {menuTabs.map((tab) => (
              <div
                key={tab.id}
                className={`cube-menu-tab ${section === tab.id ? "cube-menu-tab-active" : ""}`}
              >
                {tab.label}
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="cube-ui-mono text-[10px] uppercase tracking-[0.35em] text-slate-300/80">
                  Face Preview
                </p>
                <h3 className="text-2xl md:text-3xl font-semibold text-white">
                  {sectionTitle[section]}
                </h3>
                <p className="text-sm text-slate-300 max-w-xl">
                  {section === "PROJECTS" &&
                    "Tap a project to open the full case study and links."}
                  {section === "ABOUT" &&
                    "A quick snapshot before you open the full bio."}
                  {section === "EXPERIENCE" &&
                    "Highlights of the focus areas behind the work."}
                  {section === "CONTACT" &&
                    "Ready to connect? Open the full form to reach out."}
                </p>
              </div>
              <button
                type="button"
                onClick={onOpen}
                className="cube-preview-cta inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-200 hover:bg-cyan-500/20 transition"
              >
                Open
                <span className="cube-ui-mono text-[10px] text-cyan-100/70">A / Enter</span>
              </button>
            </div>

            {section === "PROJECTS" && (
              <div className="grid gap-3 sm:grid-cols-2">
                {projects.slice(0, 3).map((project) => (
                  <button
                    key={project.title}
                    type="button"
                    onClick={onOpen}
                    className="cube-menu-slot group rounded-2xl border border-white/10 p-3 text-left transition hover:border-cyan-300/60"
                  >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10">
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-top transition duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-white">
                      {project.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      {project.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className={`flex items-center ${getTechColor(tag)}`}>
                          <TechIcon name={tag} className="w-4 h-4" />
                        </span>
                      ))}
                    </div>
                  </div>
                  </button>
                ))}
              </div>
            )}

            {section === "ABOUT" && (
              <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                <div className="cube-menu-slot rounded-2xl border border-white/10 p-4 flex gap-4 items-start">
                  {aboutContent.imageUrl && (
                    <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                      <Image
                        src={aboutContent.imageUrl}
                        alt="Enrique Vázquez"
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Snapshot</p>
                    <p className="mt-2.5 text-sm text-slate-200 leading-relaxed">
                      {aboutContent.summary}
                    </p>
                  </div>
                </div>
                <div className="cube-menu-slot rounded-2xl border border-white/10 p-4 flex flex-col justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Focus</p>
                  <p className="mt-2 text-sm text-slate-200">
                    Full-stack, backend systems, and 3D visualization for the web.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpen}
                  className="inline-flex items-center justify-between rounded-xl border border-cyan-300/50 bg-cyan-500/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-200"
                >
                  View Bio
                  <span className="cube-ui-mono text-[10px] text-cyan-100/70">Enter</span>
                </button>
              </div>
              </div>
            )}

            {section === "EXPERIENCE" && (
              <div className="grid gap-3 md:grid-cols-3">
                {experience.slice(0, 3).map((item) => (
                  <div
                    key={item.title}
                    className="cube-menu-slot rounded-2xl border border-white/10 p-4"
                  >
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    {item.subtitle}
                  </p>
                  <h4 className="mt-2 text-sm font-semibold text-white">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-sm text-slate-200 leading-relaxed whitespace-pre-line line-clamp-5">
                    {item.summary}
                  </p>
                  </div>
                ))}
              </div>
            )}

            {section === "CONTACT" && (
              <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                <div className="cube-menu-slot rounded-2xl border border-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Next Step</p>
                <p className="mt-3 text-sm text-slate-200 leading-relaxed">
                  Share a quick brief and we can plan the right build path.
                </p>
              </div>
                <div className="cube-menu-slot rounded-2xl border border-white/10 p-4 flex flex-col justify-between gap-3">
                <p className="text-sm text-slate-200">
                  Click to open the full form and start the conversation.
                </p>
                <button
                  type="button"
                  onClick={onOpen}
                  className="inline-flex items-center justify-between rounded-xl border border-cyan-300/50 bg-cyan-500/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-200"
                >
                  Open Form
                  <span className="cube-ui-mono text-[10px] text-cyan-100/70">Enter</span>
                </button>
              </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="cube-ui-mono uppercase tracking-[0.3em]">A / Enter: Open</span>
              <span className="cube-ui-mono uppercase tracking-[0.3em]">B / Esc: Back</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
