'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const PRIMARY = 'rgba(4,230,162,0.75)';
const AWARENESS = 'rgba(123,211,255,0.85)';
const PERSIST = 'rgba(255,183,138,0.9)';

const CLIENT_A_BLOCKS = [
  { title: 'Y.XmlFragment', sub: 'title · desc · note' },
  { title: 'Y.Map', sub: 'status' },
  { title: 'Y.Array', sub: 'tags · assignees' },
  { title: 'TipTap editor', sub: 'isChangeOrigin()' },
];

const SERVER_BLOCKS = [
  { title: 'Client A MSG_SYNC (0)', sub: 'binary update broadcast' },
  { title: 'MSG_AWARENESS (1)', sub: 'presence broadcast' },
  { title: 'synced event', sub: '초기화 트리거' },
  { title: 'room lifecycle', sub: '마지막 연결 해제 시 삭제' },
];

const CLIENT_B_BLOCKS = [
  { title: 'Y.XmlFragment', sub: 'merge from A' },
  { title: 'Y.Map', sub: 'merge from A' },
  { title: 'Y.Array', sub: 'merge from A' },
  { title: 'TipTap editor', sub: '원격 변경 렌더링' },
];

interface Block {
  title: string;
  sub: string;
}

function InnerBlock({ block, delay = 0 }: { block: Block; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay }}
      className="rounded-lg border border-[var(--color-primary-50)]/25 bg-[var(--color-primary-50)]/[0.08] px-3 py-2.5 text-center"
    >
      <p className="text-[12.5px] font-semibold tracking-tight text-white">{block.title}</p>
      <p className="mt-0.5 text-[11px] text-[var(--color-primary-50)]/85">{block.sub}</p>
    </motion.div>
  );
}

function Column({
  title,
  subtitle,
  blocks,
  delay = 0,
}: {
  title: string;
  subtitle?: ReactNode;
  blocks: Block[];
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col gap-2 rounded-xl border border-[var(--color-primary-50)]/20 bg-[var(--color-primary-50)]/[0.04] p-3"
    >
      <div className="px-1 pt-1 pb-1 text-center">
        <p className="text-[13px] font-semibold tracking-tight text-white">{title}</p>
        {subtitle && (
          <p className="mt-0.5 text-[10.5px] tracking-wide text-[var(--color-text-dim)]">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {blocks.map((b, i) => (
          <InnerBlock key={b.title + i} block={b} delay={delay + 0.05 + i * 0.05} />
        ))}
      </div>
    </motion.div>
  );
}

interface Cell {
  label: string;
  sub?: string;
}

function LaneCell({
  cell,
  variant,
}: {
  cell: Cell;
  variant: 'primary' | 'awareness' | 'persist';
}) {
  const palette = {
    primary: {
      border: 'border-[var(--color-primary-50)]/30',
      bg: 'bg-[var(--color-primary-50)]/[0.06]',
      sub: 'text-[var(--color-primary-50)]/85',
    },
    awareness: {
      border: 'border-[#7BD3FF]/35',
      bg: 'bg-[#7BD3FF]/[0.06]',
      sub: 'text-[#7BD3FF]/85',
    },
    persist: {
      border: 'border-[#FFB78A]/35',
      bg: 'bg-[#FFB78A]/[0.06]',
      sub: 'text-[#FFB78A]/85',
    },
  }[variant];
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4 }}
      className={['rounded-lg border px-3 py-2.5 text-center', palette.border, palette.bg].join(' ')}
    >
      <p className="text-[12.5px] font-semibold tracking-tight text-white">{cell.label}</p>
      {cell.sub && (
        <p className={['mt-0.5 text-[11px] leading-tight', palette.sub].join(' ')}>{cell.sub}</p>
      )}
    </motion.div>
  );
}

function SingleArrow({
  variant,
  dashed = false,
}: {
  variant: 'primary' | 'awareness' | 'persist';
  dashed?: boolean;
}) {
  const color =
    variant === 'primary' ? PRIMARY : variant === 'awareness' ? AWARENESS : PERSIST;
  return (
    <svg width="100%" height="12" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden>
      <motion.line
        x1="0"
        y1="6"
        x2="100"
        y2="6"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeDasharray={dashed ? '5 4' : undefined}
        markerEnd={`url(#crdt-arr-${variant})`}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

/** Vertical orange rail segment for a row gap. Renders in col 1 (left) and col 5 (right). */
function GapRow({
  grid,
  heightClass,
  rightArrowUp = false,
}: {
  grid: string;
  heightClass: string;
  rightArrowUp?: boolean;
}) {
  return (
    <div className={`grid ${heightClass} ${grid}`} aria-hidden>
      <div className="relative">
        <svg
          width="14"
          height="100%"
          viewBox="0 0 14 100"
          preserveAspectRatio="none"
          className="absolute left-1/2 top-0 h-full -translate-x-1/2"
        >
          <motion.line
            x1="7"
            y1="0"
            x2="7"
            y2="100"
            stroke={PERSIST}
            strokeWidth="1.4"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          />
        </svg>
      </div>
      <div />
      <div />
      <div />
      <div className="relative">
        <svg
          width="14"
          height="100%"
          viewBox="0 0 14 100"
          preserveAspectRatio="none"
          className="absolute left-1/2 top-0 h-full -translate-x-1/2"
        >
          <motion.line
            x1="7"
            y1="100"
            x2="7"
            y2="0"
            stroke={PERSIST}
            strokeWidth="1.4"
            markerEnd={rightArrowUp ? 'url(#crdt-arr-persist)' : undefined}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          />
        </svg>
      </div>
    </div>
  );
}

/** Two parallel dashed arrows pointing opposite directions. */
function BidirArrows() {
  return (
    <div className="flex flex-col items-stretch justify-center gap-1.5">
      <svg width="100%" height="10" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden>
        <motion.line
          x1="0"
          y1="5"
          x2="100"
          y2="5"
          stroke={AWARENESS}
          strokeWidth="1.3"
          strokeDasharray="5 4"
          markerEnd="url(#crdt-arr-awareness)"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        />
      </svg>
      <svg width="100%" height="10" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden>
        <motion.line
          x1="100"
          y1="5"
          x2="0"
          y2="5"
          stroke={AWARENESS}
          strokeWidth="1.3"
          strokeDasharray="5 4"
          markerEnd="url(#crdt-arr-awareness)"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />
      </svg>
    </div>
  );
}

function MobileConnector({
  variant,
  label,
  reverse = false,
  bidirectional = false,
}: {
  variant: 'primary' | 'awareness' | 'persist';
  label?: string;
  reverse?: boolean;
  bidirectional?: boolean;
}) {
  const color =
    variant === 'primary' ? PRIMARY : variant === 'awareness' ? AWARENESS : PERSIST;

  if (bidirectional) {
    return (
      <div className="flex items-center gap-3 py-3">
        <span className="h-px flex-1" style={{ backgroundColor: color }} />
        {label && (
          <span className="shrink-0 rounded-full border border-white/10 bg-[#06100c] px-2.5 py-1 text-[10.5px] font-medium tracking-tight text-[var(--color-text-muted)]">
            {label}
          </span>
        )}
        <span className="h-px flex-1" style={{ backgroundColor: color }} />
      </div>
    );
  }

  return (
    <div className="relative flex h-16 items-center justify-center" aria-hidden>
      {label && (
        <span className="absolute left-1/2 top-2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[#06100c] px-2.5 py-1 text-[10.5px] font-medium tracking-tight text-[var(--color-text-muted)]">
          {label}
        </span>
      )}
      <svg width="16" height="64" viewBox="0 0 16 64" aria-hidden>
        <motion.line
          x1="8"
          y1={reverse ? '54' : '10'}
          x2="8"
          y2={reverse ? '10' : '54'}
          stroke={color}
          strokeWidth="1.4"
          strokeLinecap="round"
          markerEnd={`url(#crdt-arr-${variant})`}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.45 }}
        />
      </svg>
    </div>
  );
}

function MobileCRDTFlow() {
  return (
    <div className="relative px-4 pt-5 pb-6 sm:hidden">
      <div className="flex flex-col">
        <Column title="Client A" subtitle="Browser" blocks={CLIENT_A_BLOCKS} delay={0.05} />

        <MobileConnector variant="primary" label="binary update" />

        <Column
          title="YJS WebSocket server"
          subtitle="y-protocols · lib0 · ws"
          blocks={SERVER_BLOCKS}
          delay={0.15}
        />

        <MobileConnector variant="primary" label="broadcast" />

        <Column
          title="Client B"
          subtitle="Browser · Y.Doc 자동 병합"
          blocks={CLIENT_B_BLOCKS}
          delay={0.25}
        />

        <MobileConnector variant="awareness" label="Awareness" bidirectional />

        <LaneCell
          variant="awareness"
          cell={{ label: 'userId · nickname', sub: 'color · awareness · 아바타 표시' }}
        />

        <MobileConnector variant="persist" label="REST 저장" />

        <LaneCell
          variant="persist"
          cell={{ label: 'REST API / DB', sub: 'DB 영속화 · 초기화' }}
        />
      </div>
    </div>
  );
}

export function CRDTDiagram() {
  /** Shared 5-column grid template so top columns and lanes align perfectly. */
  const GRID = '[grid-template-columns:1fr_72px_1fr_72px_1fr]';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--color-primary-50)]/15 bg-[#070b09]">
      <div className="bg-grid-fine pointer-events-none absolute inset-0 opacity-[0.16]" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--color-primary-50)]/[0.07] blur-[110px]" />

      <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.05] px-4 py-5 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex h-2 w-2 rounded-full bg-[var(--color-primary-50)] shadow-[0_0_12px_rgba(4,230,162,0.8)]" />
          <p className="min-w-0 text-[12px] uppercase tracking-[0.22em] text-[var(--color-primary-50)]">
            <span className="sm:hidden">CRDT</span>
            <span className="hidden sm:inline">CRDT · Conflict-Free Replicated Data Type</span>
          </p>
        </div>
        <span className="rounded-full border border-[var(--color-primary-50)]/25 bg-[var(--color-primary-50)]/[0.06] px-2.5 py-1 text-[10.5px] tracking-[0.18em] text-[var(--color-primary-50)]">
          데이터 흐름
        </span>
      </div>

      {/* Reusable arrow markers */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <marker id="crdt-arr-primary" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill={PRIMARY} />
          </marker>
          <marker id="crdt-arr-awareness" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill={AWARENESS} />
          </marker>
          <marker id="crdt-arr-persist" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill={PERSIST} />
          </marker>
        </defs>
      </svg>

      <MobileCRDTFlow />

      <div className="relative hidden px-4 pt-6 pb-6 sm:block sm:px-6">
        <div>
          {/* Top columns row — same 5-col template, columns in slots 1/3/5, slots 2/4 empty (no connectors) */}
          <div className={`grid items-stretch ${GRID}`}>
            <Column title="Client A" subtitle="Browser" blocks={CLIENT_A_BLOCKS} delay={0.05} />
            <div />
            <Column
              title="YJS WebSocket server"
              subtitle="y-protocols · lib0 · ws"
              blocks={SERVER_BLOCKS}
              delay={0.15}
            />
            <div />
            <Column
              title="Client B"
              subtitle="Browser · Y.Doc 자동 병합"
              blocks={CLIENT_B_BLOCKS}
              delay={0.25}
            />
          </div>

          {/* Gap row: orange segments (Client A → 타이핑) (REST → Y.Doc) */}
          <GapRow grid={GRID} heightClass="h-10" rightArrowUp />

          {/* Lane 1: green flow with "binary update" / "broadcast" badges floating above arrows */}
          <div className={`relative grid items-center ${GRID}`}>
            <LaneCell variant="primary" cell={{ label: '타이핑 → Item 생성 → 인코딩' }} />
            <div className="relative flex items-center justify-center">
              <span className="absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-[var(--color-primary-50)]/35 bg-[#06100c] px-2.5 py-1 text-[10.5px] font-medium tracking-tight text-[var(--color-primary-50)]">
                binary update
              </span>
              <SingleArrow variant="primary" />
            </div>
            <LaneCell variant="primary" cell={{ label: 'room 내 전체 클라이언트 전파' }} />
            <div className="relative flex items-center justify-center">
              <span className="absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-[var(--color-primary-50)]/35 bg-[#06100c] px-2.5 py-1 text-[10.5px] font-medium tracking-tight text-[var(--color-primary-50)]">
                broadcast
              </span>
              <SingleArrow variant="primary" />
            </div>
            <LaneCell variant="primary" cell={{ label: 'Y.Doc 자동 병합 → 렌더링' }} />
          </div>

          {/* Gap: orange (타이핑 → userId) (타 유저 → Y.Doc) */}
          <GapRow grid={GRID} heightClass="h-4" />

          {/* Lane 2: Awareness — 2 parallel dashed arrows */}
          <div className={`grid items-center ${GRID}`}>
            <LaneCell
              variant="awareness"
              cell={{ label: 'userId · nickname', sub: 'color · awareness' }}
            />
            <BidirArrows />
            <LaneCell
              variant="awareness"
              cell={{ label: 'MSG_AWARENESS 채널', sub: '문서 채널과 독립적' }}
            />
            <BidirArrows />
            <LaneCell
              variant="awareness"
              cell={{ label: '타 유저 아바타 표시', sub: '8색 랜덤 배정' }}
            />
          </div>

          {/* Gap: orange (userId → 변경 감지) (타 유저 → 타 유저) */}
          <GapRow grid={GRID} heightClass="h-4" />

          {/* Lane 3: Persist — single long arrow */}
          <div className={`grid items-center ${GRID}`}>
            <LaneCell
              variant="persist"
              cell={{ label: '변경 감지', sub: '로컬만 · 1s debounce' }}
            />
            <div className="col-span-3 flex items-center">
              <span
                className="block flex-1 border-t"
                style={{ borderColor: PERSIST }}
              />
              <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden className="flex-none">
                <path d="M0 1 L10 6 L0 11 z" fill={PERSIST} />
              </svg>
            </div>
            <LaneCell
              variant="persist"
              cell={{ label: 'REST API / DB', sub: 'DB 영속화 · Next.js App Router' }}
            />
          </div>
        </div>

      </div>

      {/* Legend — SVG lines for visible strokes */}
      <div className="relative flex flex-wrap items-center justify-center gap-x-7 gap-y-2 border-t border-white/[0.05] px-6 py-4 text-[11.5px] text-[var(--color-text-muted)]">
        <span className="inline-flex items-center gap-2">
          <svg width="36" height="6" aria-hidden>
            <line x1="0" y1="3" x2="36" y2="3" stroke={PRIMARY} strokeWidth="1.8" />
          </svg>
          CRDT binary update
        </span>
        <span className="inline-flex items-center gap-2">
          <svg width="36" height="6" aria-hidden>
            <line x1="0" y1="3" x2="36" y2="3" stroke={AWARENESS} strokeWidth="1.8" />
          </svg>
          Awareness
        </span>
        <span className="inline-flex items-center gap-2">
          <svg width="36" height="6" aria-hidden>
            <line x1="0" y1="3" x2="36" y2="3" stroke={PERSIST} strokeWidth="1.8" />
          </svg>
          REST 저장 / 초기화
        </span>
      </div>
    </div>
  );
}
