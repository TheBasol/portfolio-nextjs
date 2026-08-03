import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { getNoteBySlug, getNotes } from '@/lib/mdx';
import { mdxComponents } from '@/components/portfolio/mdxComponents';
import { Metadata } from 'next';

export async function generateStaticParams() {
  const notes = getNotes();
  return notes.map((note) => ({
    slug: note.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const note = getNoteBySlug(resolvedParams.slug);
  
  if (!note) {
    return {
      title: 'Not Found',
    };
  }

  const noteUrl = `https://enriquevazquez.me/notes/${note.slug.join('/')}`;
  const ogImageUrl = `https://enriquevazquez.me/api/og?slug=${encodeURIComponent(note.slug.join('/'))}`;

  return {
    title: note.frontmatter.title,
    description: note.frontmatter.description,
    keywords: note.frontmatter.tags ?? [],
    authors: [{ name: 'Enrique Vazquez', url: 'https://enriquevazquez.me' }],
    openGraph: {
      type: 'article',
      title: note.frontmatter.title,
      description: note.frontmatter.description,
      url: noteUrl,
      siteName: 'Enrique Vazquez — Portfolio',
      publishedTime: note.frontmatter.date,
      authors: ['Enrique Vazquez'],
      tags: note.frontmatter.tags ?? [],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: note.frontmatter.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: note.frontmatter.title,
      description: note.frontmatter.description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: noteUrl,
    },
  };
}

export default async function NotePage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const note = getNoteBySlug(resolvedParams.slug);

  if (!note) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: note.frontmatter.title,
    description: note.frontmatter.description,
    datePublished: note.frontmatter.date,
    author: {
      '@type': 'Person',
      name: 'Enrique Vazquez',
      url: 'https://enriquevazquez.me',
    },
    publisher: {
      '@type': 'Person',
      name: 'Enrique Vazquez',
      url: 'https://enriquevazquez.me',
    },
    url: `https://enriquevazquez.me/notes/${note.slug.join('/')}`,
    keywords: note.frontmatter.tags?.join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[#060606] text-white p-6 sm:p-12 font-sans selection:bg-purple-500/30 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="mb-12">
          <Link 
            href="/notes" 
            className="group inline-flex items-center gap-2 cube-ui-mono text-[10px] sm:text-xs text-slate-500 hover:text-cyan-400 transition-colors uppercase tracking-[0.2em]"
          >
            <span aria-hidden="true" className="group-hover:-translate-x-1 transition-transform">←</span> 
            Memory Card
          </Link>
        </div>

        <header className="mb-16">
          <div className="flex flex-wrap items-center gap-4 cube-ui-mono text-[10px] sm:text-xs text-purple-400 tracking-[0.15em] uppercase mb-6">
            <time className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-purple-400" />
              {note.frontmatter.date}
            </time>
            {note.frontmatter.tags && (
              <>
                <span className="text-slate-700">•</span>
                <div className="flex gap-3 text-slate-400">
                  {note.frontmatter.tags.join(' / ')}
                </div>
              </>
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-6 leading-[1.1]">
            {note.frontmatter.title}
          </h1>
          {note.frontmatter.description && (
            <p className="text-lg sm:text-xl text-slate-400 font-light leading-relaxed max-w-2xl">
              {note.frontmatter.description}
            </p>
          )}
          <div className="w-20 h-px bg-gradient-to-r from-purple-500 to-transparent mt-10" />
        </header>

        <article className="prose prose-invert sm:prose-lg max-w-none 
          prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-100 
          prose-p:text-slate-300 prose-p:leading-relaxed prose-p:font-light 
          prose-a:text-cyan-400 hover:prose-a:text-cyan-300 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-white prose-strong:font-semibold
          prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-white/[0.05] prose-pre:rounded-xl prose-pre:shadow-2xl prose-pre:overflow-x-auto
          prose-code:text-purple-300 prose-code:bg-purple-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
          prose-blockquote:border-l-purple-500 prose-blockquote:bg-purple-500/5 prose-blockquote:py-1 prose-blockquote:px-4 sm:prose-blockquote:px-6 prose-blockquote:text-slate-400 prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:rounded-r-lg
          prose-li:text-slate-300
          prose-table:border-collapse prose-table:w-full prose-table:overflow-hidden prose-table:rounded-lg
          prose-thead:bg-purple-500/10 prose-thead:border-b prose-thead:border-purple-500/20
          prose-th:text-left prose-th:text-slate-200 prose-th:font-semibold prose-th:px-4 prose-th:py-3 prose-th:text-sm
          prose-td:px-4 prose-td:py-3 prose-td:text-slate-300 prose-td:border-b prose-td:border-white/[0.05] prose-td:text-sm
          prose-tr:transition-colors hover:prose-tr:bg-purple-500/5">
          <MDXRemote
            source={note.content}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            components={mdxComponents}
          />
        </article>
      </div>
      </div>
    </>
  );
}
