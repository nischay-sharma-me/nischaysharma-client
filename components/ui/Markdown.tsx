'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

interface MarkdownProps {
  content: string;
  className?: string;
}

export default function Markdown({ content, className = '' }: MarkdownProps) {
  // Effect to apply syntax highlighting after rendering
  React.useEffect(() => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }, [content]);

  return (
    <div className={`markdown-body ${className}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const lang = match ? match[1] : '';
            
            if (lang === 'mermaid') {
              return <pre className="mermaid">{children}</pre>;
            }
            
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // Customize other elements if needed
          a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>

      <style jsx global>{`
        .markdown-body {
          color: inherit;
          line-height: 1.6;
        }
        .markdown-body h1, .markdown-body h2, .markdown-body h3 {
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }
        .markdown-body p {
          margin-bottom: 1rem;
        }
        .markdown-body ul, .markdown-body ol {
          margin-bottom: 1rem;
          padding-left: 2rem;
        }
        .markdown-body code {
          font-family: monospace;
          background: rgba(255,255,255,0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
        }
        .markdown-body pre {
          background: #0d1117;
          padding: 1rem;
          border-radius: 6px;
          overflow: auto;
          margin-bottom: 1rem;
        }
        .markdown-body pre code {
          background: transparent;
          padding: 0;
        }
        .markdown-body blockquote {
          border-left: 4px solid #30363d;
          color: #8b949e;
          padding-left: 1rem;
          margin-bottom: 1rem;
        }
        .markdown-body table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1rem;
        }
        .markdown-body th, .markdown-body td {
          border: 1px solid #30363d;
          padding: 0.5rem;
        }
      `}</style>
    </div>
  );
}
