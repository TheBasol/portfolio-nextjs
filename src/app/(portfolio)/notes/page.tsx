import Link from 'next/link';
import { getNotes } from '@/lib/mdx';
import { NoteListClient } from '@/components/portfolio/NoteListClient';

export const metadata = {
  title: 'Notes on Software Engineering & Architecture',
  description:
    'Technical notes and guides on software architecture, engineering patterns, and full-stack development by Enrique Vazquez.',
  openGraph: {
    title: 'Notes on Software Engineering & Architecture',
    description:
      'Technical notes and guides on software architecture, engineering patterns, and full-stack development by Enrique Vazquez.',
    url: 'https://enriquevazquez.me/notes',
    siteName: 'Enrique Vazquez — Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: 'Notes on Software Engineering & Architecture',
    description:
      'Technical notes by Enrique Vazquez on architecture, design patterns, and full-stack development.',
  },
  alternates: {
    canonical: 'https://enriquevazquez.me/notes',
  },
};

export default function NotesPage() {
  const notes = getNotes();

  return (
    <div className="min-h-screen bg-[#060606] text-white p-6 sm:p-12 font-sans selection:bg-purple-500/30 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-12 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/[0.05]">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black italic tracking-tighter text-white/90 drop-shadow-sm">
              MEMORY CARD
            </h1>
            <p className="cube-ui-mono text-[10px] sm:text-xs tracking-[0.25em] text-cyan-400 mt-2 uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Slot A / System Logs
            </p>
            <p className="text-slate-400 text-sm sm:text-base mt-4 max-w-xl font-light leading-relaxed">
              My engineering journal &amp; memory card. Here I document key concepts, optimization breakthroughs, and technical notes from my day-to-day software development.
            </p>
          </div>
          <Link href="/" className="group flex items-center gap-2 cube-ui-mono text-[10px] sm:text-xs px-5 py-2.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] hover:border-white/[0.1] rounded-full transition-all uppercase tracking-widest self-start sm:self-auto backdrop-blur-md text-slate-300 hover:text-white">
            <span aria-hidden="true" className="group-hover:-translate-x-1 transition-transform">←</span>
            Return Home
          </Link>
        </header>

        <NoteListClient notes={notes} />
      </div>
    </div>
  );
}
