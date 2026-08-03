import type { MDXRemoteProps } from 'next-mdx-remote/rsc';
import MermaidDiagram from '@/components/portfolio/MermaidDiagram';
import { type ReactNode, isValidElement, type ReactElement } from 'react';

type MDXComponents = MDXRemoteProps['components'];

/**
 * Check if a `pre > code` block is a Mermaid diagram.
 * MDX renders fenced code blocks as:
 *   <pre><code className="language-mermaid">…</code></pre>
 */
function PreBlock({ children, ...props }: { children?: ReactNode; [key: string]: unknown }) {
  if (isValidElement(children)) {
    const codeElement = children as ReactElement<{
      className?: string;
      children?: string;
    }>;
    if (
      typeof codeElement.props?.className === 'string' &&
      codeElement.props.className.includes('language-mermaid')
    ) {
      const chart = typeof codeElement.props.children === 'string'
        ? codeElement.props.children
        : '';
      return <MermaidDiagram chart={chart} />;
    }
  }
  return <pre {...props}>{children}</pre>;
}

function TableBlock({ children, ...props }: { children?: ReactNode; [key: string]: unknown }) {
  return (
    <div className="overflow-x-auto my-6 rounded-xl border border-white/[0.05] bg-white/[0.01]">
      <table className="w-full text-left border-collapse" {...props}>
        {children}
      </table>
    </div>
  );
}

export const mdxComponents: MDXComponents = {
  pre: PreBlock,
  table: TableBlock,
};
