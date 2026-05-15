'use client';

import { useEffect, useId, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  code: string;
}

export function MermaidDiagram({ code }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rawId = useId();
  const diagramId = `mermaid-${rawId.replace(/:/g, '')}`;

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      try {
        mermaid.initialize({ startOnLoad: false });

        const getToken = (name: string): string =>
          getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#000000';

        const primaryColor = getToken('--color-primary-40');
        const secondaryColor = getToken('--color-secondary-40');
        const bgColor = getToken('--color-bg-primary');
        const textColor = getToken('--color-text-primary');
        const fontFamily = getToken('--font-family-body');

        if (document.fonts?.ready) {
          await document.fonts.ready;
        }

        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });

        if (cancelled || !containerRef.current) return;

        const { svg, bindFunctions } = await mermaid.render(diagramId, code);

        if (cancelled || !containerRef.current) return;

        containerRef.current.innerHTML = svg;
        bindFunctions?.(containerRef.current);

        const svgEl = containerRef.current.querySelector('svg');
        if (!svgEl) return;

        svgEl.classList.add('mermaidDiagram');

        const styleEl = document.createElement('style');
        styleEl.textContent = `
          .mermaidDiagram .edgeLabel { fill: ${primaryColor} !important; }
          .mermaidDiagram .nodeLabel { color: ${textColor}; font-family: ${fontFamily}; }
          .mermaidDiagram .node rect { fill: ${bgColor}; stroke: ${secondaryColor}; }
        `;
        svgEl.appendChild(styleEl);

        svgEl.querySelectorAll('g[id^="node"] rect').forEach((rect) => {
          rect.setAttribute('rx', '12');
          rect.setAttribute('ry', '12');
        });

        svgEl.querySelectorAll('.edgeLabel').forEach((label) => {
          const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          bg.setAttribute('x', '-10');
          bg.setAttribute('y', '-10');
          bg.setAttribute('width', '20');
          bg.setAttribute('height', '20');
          bg.setAttribute('rx', '4');
          bg.setAttribute('fill', bgColor);
          bg.setAttribute('stroke', secondaryColor);
          label.insertBefore(bg, label.firstChild);
        });

        svgEl.style.maxHeight = '400px';
        svgEl.style.overflow = 'auto';
      } catch {
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = '<p>Error rendering diagram</p>';
        }
      }
    };

    render();

    return () => {
      cancelled = true;
    };
  }, [code, diagramId]);

  return <div ref={containerRef} />;
}
