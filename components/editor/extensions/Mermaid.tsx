import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
});

const MermaidComponent = ({ node }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      const content = node.textContent.trim();
      if (!content) {
        setSvg('');
        return;
      }

      try {
        const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
        const { svg } = await mermaid.render(id, content);
        setSvg(svg);
        setError(null);
      } catch (err: any) {
        console.error('Mermaid render error:', err);
        setError('Invalid Mermaid syntax');
        // Clear SVG on error to show error message
        setSvg('');
      }
    };

    const timeoutId = setTimeout(renderDiagram, 300);
    return () => clearTimeout(timeoutId);
  }, [node.textContent]);

  return (
    <NodeViewWrapper className="mermaid-wrapper">
      <div className="mermaid-preview" style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', border: '1px solid #dee2e6', marginBottom: '0.5rem' }}>
        {error ? (
          <div style={{ color: '#dc3545', fontSize: '0.8rem', fontFamily: 'monospace' }}>{error}</div>
        ) : (
          <div 
            ref={containerRef} 
            className="mermaid-svg"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        )}
      </div>
      <div className="mermaid-editor" style={{ position: 'relative' }}>
        <pre style={{ margin: 0, padding: '0.5rem', background: '#272822', color: '#f8f8f2', borderRadius: '4px', fontSize: '0.85rem' }}>
          <code>{node.textContent}</code>
        </pre>
        <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', fontSize: '0.65rem', color: '#75715e', fontWeight: 'bold' }}>
          MERMAID
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default Node.create({
  name: 'mermaid',
  group: 'block',
  content: 'text*',
  marks: '',
  code: true,
  defining: true,

  parseHTML() {
    return [
      {
        tag: 'pre',
        getAttrs: node => (node as HTMLElement).classList.contains('mermaid') && null,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['pre', mergeAttributes(HTMLAttributes, { class: 'mermaid' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MermaidComponent);
  },

  addCommands() {
    return {
      setMermaid: () => ({ commands }) => {
        return commands.setNode(this.name);
      },
      toggleMermaid: () => ({ commands }) => {
        return commands.toggleNode(this.name, 'paragraph');
      },
    };
  },
});
