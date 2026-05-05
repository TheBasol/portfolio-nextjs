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

const sectionTitle: Record<CubeSection, string> = {
  PROJECTS: "Projects",
  ABOUT: "About",
  EXPERIENCE: "Experience",
  CONTACT: "Contact",
};

export const CubeModal = ({ isOpen, section, onClose }: CubeModalProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !section || !mounted) return null;

  const modalContent = (
    <div
      className="cube-modal-backdrop fixed inset-0 z-[100] flex items-center justify-center px-4 py-8 pointer-events-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cube-modal-title"
        tabIndex={-1}
        className="cube-modal-panel cube-ui touch-auto w-[min(94vw,72rem)] max-h-[86vh] overflow-hidden rounded-3xl border border-white/10 p-6 md:p-10 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="cube-ui-mono text-[10px] uppercase tracking-[0.35em] text-slate-400">
              Cube Face
            </p>
            <h2 id="cube-modal-title" className="text-3xl md:text-4xl font-semibold text-white">
              {sectionTitle[section]}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="cube-ui-mono text-[11px] uppercase tracking-[0.3em] text-slate-300 hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="mt-6 max-h-[70vh] overflow-y-auto pr-2">
          {section === "PROJECTS" && (
            <div className="grid gap-6">
              {projects.map((project) => (
                <div
                  key={project.title}
                  className="cube-modal-card rounded-2xl border border-white/10 p-4 md:p-6"
                >
                  <div className="grid gap-6 md:grid-cols-[1.1fr_1.4fr] md:items-center">
                    <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10">
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover object-top"
                      />
                    </div>
                    <div className="flex flex-col gap-4">
                      <div>
                        <h3 className="text-2xl font-semibold text-white">
                          {project.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-200 leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-4">
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative z-10 inline-flex items-center gap-2 rounded-full border border-cyan-300/50 bg-cyan-500/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-200 hover:bg-cyan-500/20 cursor-pointer pointer-events-auto"
                        >
                          View Live
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative z-10 inline-flex items-center gap-2 text-sm text-slate-200 hover:text-purple-300 cursor-pointer pointer-events-auto"
                            aria-label={`${project.title} GitHub repository`}
                          >
                            <TechIcon name="github" className="w-6 h-6" />
                            GitHub
                          </a>
                        )}
                        <div className="flex flex-wrap items-center gap-3">
                          {project.tags.map((tag) => (
                            <span key={tag} className={`flex items-center ${getTechColor(tag)}`}>
                              <TechIcon name={tag} className="w-5 h-5" />
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {section === "ABOUT" && (
            <div className="grid gap-6 md:grid-cols-[1.3fr_0.7fr]">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="cube-ui-mono text-[10px] uppercase tracking-[0.35em] text-slate-400">
                  Summary
                </p>
                <p className="mt-4 text-lg text-white">
                  {aboutContent.summary}
                </p>
                <p className="mt-4 text-sm text-slate-200 leading-relaxed">
                  {aboutContent.body}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col justify-between gap-4">
                <div>
                  <p className="cube-ui-mono text-[10px] uppercase tracking-[0.35em] text-slate-400">
                    Current Focus
                  </p>
                  <p className="mt-3 text-sm text-slate-200 leading-relaxed">
                    Building modern web products, crafting APIs, and shaping 3D visual narratives.
                  </p>
                </div>
                <a
                  href={aboutContent.cvUrl}
                  download="CV-Enrique-Vazquez.pdf"
                  className="inline-flex items-center justify-center rounded-full border border-cyan-300/50 bg-cyan-500/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-200"
                >
                  {aboutContent.cvLabel}
                </a>
              </div>
            </div>
          )}

          {section === "EXPERIENCE" && (
            <div className="grid gap-4 md:grid-cols-2">
              {experience.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <p className="cube-ui-mono text-[10px] uppercase tracking-[0.35em] text-slate-400">
                    {item.subtitle}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                    {item.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {section === "CONTACT" && (
            <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="cube-ui-mono text-[10px] uppercase tracking-[0.35em] text-slate-400">
                  Contact
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-white">Let us build the next release</h3>
                <p className="mt-3 text-sm text-slate-200 leading-relaxed">
                  Share a brief, timeline, and goals. I will follow up with a plan and next steps.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
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
