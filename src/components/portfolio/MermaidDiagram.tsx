'use client';

import { useEffect, useRef, useState } from 'react';

interface MermaidDiagramProps {
  chart: string;
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let cancelled = false;

    async function renderChart() {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            darkMode: true,
            background: '#0a0a0a',
            primaryColor: '#7c3aed',
            primaryTextColor: '#e2e8f0',
            primaryBorderColor: '#7c3aed',
            lineColor: '#7c3aed',
            secondaryColor: '#1e1b4b',
            tertiaryColor: '#0f172a',
            fontFamily: 'ui-monospace, SFMono-Regular, monospace',
            fontSize: '13px',
            stateBkg: '#1a1a2e',
            stateLabelColor: '#e2e8f0',
          },
        });

        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg: renderedSvg } = await mermaid.render(id, chart.trim());
        if (!cancelled) {
          setSvg(renderedSvg);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to render diagram');
        }
      }
    }

    renderChart();
    return () => { cancelled = true; };
  }, [chart]);

  if (error) {
    return (
      <div className="my-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
        <p className="text-sm text-red-400 font-mono">Diagram error: {error}</p>
        <pre className="mt-2 text-xs text-slate-500 overflow-x-auto">{chart}</pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="my-6 flex items-center justify-center rounded-xl border border-purple-500/10 bg-[#0a0a0a] p-8">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span className="inline-block w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          Loading diagram…
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mermaid-diagram my-6 flex justify-center overflow-x-auto rounded-xl border border-purple-500/10 bg-[#0a0a0a] p-6"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
