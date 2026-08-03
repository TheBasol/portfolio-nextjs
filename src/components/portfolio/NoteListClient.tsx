"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Note } from '@/lib/mdx';

interface NoteListClientProps {
  notes: Omit<Note, 'content'>[];
}

export function NoteListClient({ notes }: NoteListClientProps) {
  const [activeSubject, setActiveSubject] = useState<string>('All');

  const subjects = useMemo(() => {
    const subs = new Set(notes.map((n) => n.subject));
    return ['All', ...Array.from(subs)];
  }, [notes]);

  const filteredNotes = useMemo(() => {
    if (activeSubject === 'All') return notes;
    return notes.filter((n) => n.subject === activeSubject);
  }, [notes, activeSubject]);

  return (
    <>
      {/* Subject Filter Tabs */}
      {subjects.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => setActiveSubject(subject)}
              className={`px-4 py-1.5 rounded-full text-xs cube-ui-mono tracking-widest uppercase transition-all duration-300 ${
                activeSubject === subject
                  ? 'bg-purple-500/20 border-purple-500/50 text-cyan-300 shadow-[0_0_10px_rgba(168,85,247,0.2)] border'
                  : 'bg-white/[0.02] border-white/[0.05] text-slate-400 hover:bg-white/[0.05] hover:text-slate-200 border'
              }`}
            >
              {subject.replace(/-/g, ' ')}
            </button>
          ))}
        </div>
      )}

      {/* Notes Grid */}
      <div className="space-y-4">
        {filteredNotes.map((note) => {
          const href = `/notes/${note.slug.join('/')}`;
          
          return (
            <Link 
              href={href}
              key={href}
              className="group block p-6 sm:p-8 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] hover:border-purple-500/30 transition-all duration-300 rounded-2xl backdrop-blur-sm relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-purple-500/0 group-hover:from-purple-500/[0.02] group-hover:via-cyan-500/[0.02] group-hover:to-transparent transition-all duration-500" />
              
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-100 group-hover:text-white transition-colors tracking-tight">
                      {note.frontmatter.title}
                    </h2>
                    {activeSubject === 'All' && (
                      <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.05] text-[9px] uppercase tracking-widest text-purple-300">
                        {note.subject.replace(/-/g, ' ')}
                      </span>
                    )}
                  </div>
                  <time className="cube-ui-mono text-[10px] sm:text-xs text-slate-500 shrink-0 uppercase tracking-wider">
                    {note.frontmatter.date}
                  </time>
                </div>
                <p className="text-slate-400 text-sm sm:text-base mb-6 leading-relaxed font-light max-w-2xl">
                  {note.frontmatter.description}
                </p>
                
                {note.frontmatter.tags && (
                  <div className="flex flex-wrap gap-2">
                    {note.frontmatter.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-white/[0.03] group-hover:bg-purple-500/10 border border-white/[0.05] group-hover:border-purple-500/20 rounded-full text-[10px] text-slate-400 group-hover:text-purple-300 tracking-[0.1em] uppercase transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
        {filteredNotes.length === 0 && (
          <div className="p-16 text-center bg-white/[0.02] border border-white/[0.05] rounded-2xl">
            <p className="text-slate-500 cube-ui-mono text-xs uppercase tracking-[0.2em]">
              No data blocks found in {activeSubject.replace(/-/g, ' ')}.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
