'use client';

import { useMemo, isValidElement, Children } from 'react';
import { Link } from '@/i18n/navigation';
import { compile, run } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import remarkGfm from 'remark-gfm';
import { Mermaid } from './Mermaid';

const components = {
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mt-8 scroll-m-20 text-4xl font-bold tracking-tight" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-8 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-6 scroll-m-20 text-xl font-semibold tracking-tight" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="mt-4 scroll-m-20 text-lg font-semibold tracking-tight" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="leading-7 [&:not(:first-child)]:mt-4" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-4 ml-6 list-disc [&>li]:mt-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-4 ml-6 list-decimal [&>li]:mt-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li {...props}>{children}</li>
  ),
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="mt-4 border-l-4 border-primary pl-4 italic" {...props}>
      {children}
    </blockquote>
  ),
  code: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    if (!className) {
      return (
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm" {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    // Check if this is a mermaid code block
    const childArray = Children.toArray(children);
    const child = childArray[0];
    if (
      isValidElement<{ className?: string; children?: React.ReactNode }>(child) &&
      child.props.className === 'language-mermaid'
    ) {
      const chart = String(child.props.children || '').trim();
      return <Mermaid chart={chart} />;
    }
    return (
      <pre className="mt-4 overflow-x-auto rounded-lg border bg-code p-4 text-sm text-code-foreground" {...props}>
        {children}
      </pre>
    );
  },
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (href?.startsWith('/')) {
      return (
        <Link href={href} className="text-primary underline underline-offset-4 hover:no-underline" {...props}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4 hover:no-underline" {...props}>
        {children}
      </a>
    );
  },
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-4 w-full overflow-x-auto">
      <table className="w-full" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="border px-4 py-2 text-left font-semibold" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border px-4 py-2" {...props}>
      {children}
    </td>
  ),
  hr: () => <hr className="my-8 border-t" />,
};

interface MDXContentProps {
  content: string;
}

// Type for MDX compiled components
type MDXComponentType = React.ComponentType<{
  components?: Record<string, React.ComponentType<React.HTMLAttributes<HTMLElement>>>;
}>;

export function MDXContent({ content }: MDXContentProps) {
  const [Content, setContent] = useState<MDXComponentType | null>(null);

  useEffect(() => {
    async function compileMDX() {
      try {
        const compiled = await compile(content, {
          outputFormat: 'function-body',
          development: false,
          remarkPlugins: [remarkGfm],
        });
        const { default: MDXComponent } = await run(String(compiled), {
          ...runtime,
          baseUrl: import.meta.url,
        });
        setContent(() => MDXComponent);
      } catch (error) {
        console.error('MDX compilation error:', error);
      }
    }
    compileMDX();
  }, [content]);

  if (!Content) {
    return <div className="animate-pulse h-96 bg-muted rounded-lg" />;
  }

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <Content components={components} />
    </div>
  );
}
