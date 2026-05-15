'use client';

import { motion } from 'framer-motion';

/**
 * Architecture diagram — displays the source PNG inside the shared dark themed
 * container so it visually matches the MCP / CRDT diagrams on the page.
 */
export function ArchitectureDiagram() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--color-primary-50)]/15 bg-[#070b09]">
      <div className="bg-grid-fine pointer-events-none absolute inset-0 opacity-[0.16]" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--color-primary-50)]/[0.07] blur-[110px]" />

      <div className="relative flex items-center justify-between border-b border-white/[0.05] px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-2 w-2 rounded-full bg-[var(--color-primary-50)] shadow-[0_0_12px_rgba(4,230,162,0.8)]" />
          <p className="text-[12px] uppercase tracking-[0.22em] text-[var(--color-primary-50)]">
            Architecture · System Structure
          </p>
        </div>
        <span className="rounded-full border border-[var(--color-primary-50)]/25 bg-[var(--color-primary-50)]/[0.06] px-2.5 py-1 text-[10.5px] tracking-[0.18em] text-[var(--color-primary-50)]">
          구조도
        </span>
      </div>

      <motion.img
        src="/docs/architecture.png"
        alt="flowMeet system architecture"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55 }}
        className="relative block h-auto w-full"
      />
    </div>
  );
}
