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

export const CubePreview = ({ section, onOpen, anchor, isEmbedded }: CubePreviewProps) => {
  if (isEmbedded) {
    const themeColor = {
      PROJECTS: "from-cyan-500/20 to-purple-500/20",
      ABOUT: "from-orange-500/20 to-amber-500/20",
      EXPERIENCE: "from-emerald-500/20 to-teal-500/20",
      CONTACT: "from-slate-400/20 to-slate-500/20",
    }[section];

    const accentBorder = {
      PROJECTS: "border-cyan-500/40",
      ABOUT: "border-orange-500/40",
      EXPERIENCE: "border-emerald-500/40",
      CONTACT: "border-slate-400/40",
    }[section];

    const accentText = {
      PROJECTS: "text-cyan-300",
      ABOUT: "text-orange-300",
      EXPERIENCE: "text-emerald-300",
      CONTACT: "text-slate-200",
    }[section];

    return (
      <div className={`flex h-full w-full flex-col bg-black/60 backdrop-blur-md border-[6px] ${accentBorder} rounded-[40px] p-8 text-white select-none pointer-events-auto overflow-hidden relative group`}>
        {/* Retro Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] opacity-20" />
        
        {/* Section Gradient Glow */}
        <div className={`absolute -inset-1 bg-gradient-to-br ${themeColor} opacity-50 blur-xl`} />

        <div className="relative z-10 flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${accentText.replace('text', 'bg')} animate-pulse`} />
                <p className="cube-ui-mono text-[12px] uppercase tracking-[0.5em] opacity-60">
                  Memory Slot 01
                </p>
              </div>
              <h3 className={`text-6xl font-black tracking-tighter italic ${accentText}`}>
                {sectionTitle[section].toUpperCase()}
              </h3>
            </div>
            <div className="cube-ui-mono text-[10px] opacity-40 text-right uppercase tracking-widest">
              Block: {section === 'PROJECTS' ? '04' : section === 'ABOUT' ? '01' : section === 'EXPERIENCE' ? '08' : '12'}<br/>
              Status: OK
            </div>
          </div>

          <div className="flex flex-col gap-6 my-4">
            <p className="text-xl text-slate-200 leading-relaxed font-medium">
              {section === "PROJECTS" && "Accessing stored development archives and project data."}
              {section === "ABOUT" && "Initializing biographical summary and technical background."}
              {section === "EXPERIENCE" && "Retreiving career trajectory and core competencies."}
              {section === "CONTACT" && "Establishing direct communication channel for inquiries."}
            </p>

            {/* Section Specific Visual Details */}
            <div className="grid grid-cols-2 gap-3 opacity-90">
              {section === "PROJECTS" && projects.slice(0, 2).map((p) => (
                <div key={p.title} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <p className="text-xs cube-ui-mono opacity-50 uppercase mb-1">Archive</p>
                  <p className="text-lg font-bold truncate leading-none">{p.title}</p>
                </div>
              ))}
              {section === "EXPERIENCE" && experience.slice(0, 2).map((exp) => (
                <div key={exp.title} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <p className="text-xs cube-ui-mono opacity-50 uppercase mb-1">Entry</p>
                  <p className="text-lg font-bold truncate leading-none">{exp.title}</p>
                </div>
              ))}
              {section === "ABOUT" && (
                <div className="col-span-2 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs cube-ui-mono opacity-50 uppercase">Developer Bio</p>
                    <p className="text-xs cube-ui-mono opacity-50 uppercase">v1.0.4</p>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 w-[85%] animate-pulse" />
                  </div>
                </div>
              )}
              {section === "CONTACT" && (
                <div className="col-span-2 flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-xl bg-slate-500/20 border border-white/10 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-slate-300 rounded-full border-t-transparent animate-spin" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Signal Connection Ready</p>
                    <p className="text-xs cube-ui-mono opacity-50 uppercase">Awaiting Input</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            className={`group/btn relative w-full py-6 rounded-[24px] bg-white/5 border-2 ${accentBorder} overflow-hidden transition-all hover:bg-white/10 active:scale-[0.98]`}
          >
            <div className="relative z-10 flex items-center justify-center gap-4">
              <span className={`text-3xl font-black italic tracking-[0.2em] uppercase ${accentText}`}>
                Open
              </span>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10">
                <span className="cube-ui-mono text-[10px] text-white/70 uppercase">Press Start</span>
              </div>
            </div>
            {/* Hover Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
          </button>
        </div>

        {/* Decorative corner details */}
        <div className="absolute top-4 right-4 w-12 h-12 opacity-20">
          <div className={`absolute top-0 right-0 w-full h-[2px] ${accentText.replace('text', 'bg')}`} />
          <div className={`absolute top-0 right-0 h-full w-[2px] ${accentText.replace('text', 'bg')}`} />
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
                <div className="cube-menu-slot rounded-2xl border border-white/10 p-4">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Snapshot</p>
                <p className="mt-3 text-slate-200 leading-relaxed">
                  {aboutContent.summary}
                </p>
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
