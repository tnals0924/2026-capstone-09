'use client';

import { motion } from 'framer-motion';

/**
 * MCP architecture diagram.
 * - `MCP Host` is an outer translucent container that wraps `MCP Client`.
 * - All flow arrows originate from / terminate at the `MCP Client`.
 * - Satellites: `User` (left), `MCP Server` (right), `LLM` (bottom).
 */

const W = 960;
const VIEWBOX_Y = 55;
const H = 430;

// Node geometry (cx, cy, width, height)
const HOST = { cx: 480, cy: 160, w: 260, h: 180 };
const CLIENT = { cx: 480, cy: 180, w: 200, h: 64 };
const USER = { cx: 110, cy: 180, w: 160, h: 64 };
const SERVER = { cx: 850, cy: 180, w: 160, h: 64 };
const LLM = { cx: 480, cy: 430, w: 160, h: 64 };

interface Box {
  cx: number;
  cy: number;
  w: number;
  h: number;
}

function edgePoint(b: Box, side: 'top' | 'bottom' | 'left' | 'right', along = 0): { x: number; y: number } {
  const x =
    side === 'left' ? b.cx - b.w / 2 : side === 'right' ? b.cx + b.w / 2 : b.cx + along;
  const y =
    side === 'top' ? b.cy - b.h / 2 : side === 'bottom' ? b.cy + b.h / 2 : b.cy + along;
  return { x, y };
}

interface ArrowSpec {
  step: number;
  label: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  /** Label anchor relative to midpoint */
  labelDx: number;
  labelDy: number;
  labelWidth: number;
}

const STROKE = 'rgba(4,230,162,0.7)';
const STROKE_SOFT = 'rgba(4,230,162,0.45)';

export function MCPDiagram() {
  // Compute endpoints at node faces; offset perpendicular slightly to separate paired arrows
  const arrows: ArrowSpec[] = [
    // 1. User → Client (bottom horizontal) — label sits below arrow
    {
      step: 1,
      label: '자연어 요청',
      from: { x: USER.cx + USER.w / 2, y: USER.cy + 14 },
      to: { x: CLIENT.cx - CLIENT.w / 2, y: CLIENT.cy + 14 },
      labelDx: 0,
      labelDy: 26,
      labelWidth: 84,
    },
    // 6. Client → User (top horizontal) — label sits above arrow
    {
      step: 6,
      label: '최종 응답',
      from: { x: CLIENT.cx - CLIENT.w / 2, y: CLIENT.cy - 14 },
      to: { x: USER.cx + USER.w / 2, y: USER.cy - 14 },
      labelDx: 0,
      labelDy: -26,
      labelWidth: 74,
    },
    // 4. Client → Server (bottom horizontal)
    {
      step: 4,
      label: 'Tool 사용',
      from: { x: CLIENT.cx + CLIENT.w / 2, y: CLIENT.cy + 14 },
      to: { x: SERVER.cx - SERVER.w / 2, y: SERVER.cy + 14 },
      labelDx: 0,
      labelDy: 26,
      labelWidth: 72,
    },
    // 5. Server → Client (top horizontal)
    {
      step: 5,
      label: 'Tool 결과 반환',
      from: { x: SERVER.cx - SERVER.w / 2, y: SERVER.cy - 14 },
      to: { x: CLIENT.cx + CLIENT.w / 2, y: CLIENT.cy - 14 },
      labelDx: 0,
      labelDy: -26,
      labelWidth: 98,
    },
    // 3. LLM → Client (vertical, right rail) — label to RIGHT of arrow, inline
    {
      step: 3,
      label: 'Tool 선택',
      from: { x: LLM.cx + 36, y: LLM.cy - LLM.h / 2 },
      to: { x: CLIENT.cx + 36, y: HOST.cy + HOST.h / 2 },
      labelDx: 77,
      labelDy: 0,
      labelWidth: 74,
    },
    // 2. Client → LLM (vertical, left rail) — label to LEFT of arrow, inline
    {
      step: 2,
      label: 'Tool 리스트 전달',
      from: { x: CLIENT.cx - 36, y: HOST.cy + HOST.h / 2 },
      to: { x: LLM.cx - 36, y: LLM.cy - LLM.h / 2 },
      labelDx: -96,
      labelDy: 0,
      labelWidth: 112,
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--color-primary-50)]/15 bg-[#070b09]">
      <div className="bg-grid-fine pointer-events-none absolute inset-0 opacity-[0.16]" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--color-primary-50)]/[0.07] blur-[110px]" />

      <div className="relative flex items-center justify-between border-b border-white/[0.05] px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-2 w-2 rounded-full bg-[var(--color-primary-50)] shadow-[0_0_12px_rgba(4,230,162,0.8)]" />
          <p className="text-[12px] uppercase tracking-[0.22em] text-[var(--color-primary-50)]">
            <span className="sm:hidden">MCP</span>
            <span className="hidden sm:inline">MCP · Model Context Protocol</span>
          </p>
        </div>
        <span className="rounded-full border border-[var(--color-primary-50)]/25 bg-[var(--color-primary-50)]/[0.06] px-2.5 py-1 text-[10.5px] tracking-[0.18em] text-[var(--color-primary-50)]">
          작동 방식
        </span>
      </div>

      <div className="relative px-4 pt-6 pb-2 sm:px-8">
        <svg
          viewBox={`0 ${VIEWBOX_Y} ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          className="block h-auto w-full"
        >
          <defs>
            <marker
              id="mcp-arrowhead"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path d="M0 0 L10 5 L0 10 z" fill="rgba(4,230,162,0.9)" />
            </marker>
            <linearGradient id="host-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(4,230,162,0.10)" />
              <stop offset="100%" stopColor="rgba(4,230,162,0.04)" />
            </linearGradient>
          </defs>

          {/* MCP Host outer container */}
          <motion.g
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <rect
              x={HOST.cx - HOST.w / 2}
              y={HOST.cy - HOST.h / 2}
              width={HOST.w}
              height={HOST.h}
              rx={18}
              fill="url(#host-fill)"
              stroke="rgba(4,230,162,0.45)"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />
            <text
              x={HOST.cx}
              y={HOST.cy - HOST.h / 2 + 28}
              textAnchor="middle"
              fontSize="14"
              fontWeight="600"
              fill="#f3fff9"
              fontFamily="Pretendard Variable, Pretendard, sans-serif"
            >
              MCP Host
            </text>
            <text
              x={HOST.cx}
              y={HOST.cy - HOST.h / 2 + 46}
              textAnchor="middle"
              fontSize="11.5"
              fill="rgba(4,230,162,0.85)"
              fontFamily="Pretendard Variable, Pretendard, sans-serif"
            >
              AI Agent
            </text>
          </motion.g>

          {/* Arrows */}
          {arrows.map((a, i) => {
            const midX = (a.from.x + a.to.x) / 2;
            const midY = (a.from.y + a.to.y) / 2;
            return (
              <motion.g
                key={a.step}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.45, delay: 0.2 + i * 0.07 }}
              >
                <motion.line
                  x1={a.from.x}
                  y1={a.from.y}
                  x2={a.to.x}
                  y2={a.to.y}
                  stroke={STROKE}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  markerEnd="url(#mcp-arrowhead)"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.55, delay: 0.25 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* Inline label with backing plate so arrows never cut through the text */}
                <g transform={`translate(${midX + a.labelDx}, ${midY + a.labelDy})`}>
                  <rect
                    x={-a.labelWidth / 2}
                    y={-12}
                    width={a.labelWidth}
                    height={24}
                    rx={12}
                    fill="rgba(2,18,14,0.92)"
                  />
                  <circle cx={-a.labelWidth / 2 + 13} cy={0} r={9} fill="#04e6a2" />
                  <text
                    x={-a.labelWidth / 2 + 13}
                    y={3.4}
                    textAnchor="middle"
                    fontSize="10.5"
                    fontWeight="700"
                    fill="#03241b"
                    fontFamily="Pretendard Variable, Pretendard, sans-serif"
                  >
                    {a.step}
                  </text>
                  <text
                    x={-a.labelWidth / 2 + 28}
                    y={4}
                    textAnchor="start"
                    fontSize="11.5"
                    fontWeight="500"
                    fill="#eafff4"
                    fontFamily="Pretendard Variable, Pretendard, sans-serif"
                  >
                    {a.label}
                  </text>
                </g>
              </motion.g>
            );
          })}

          {/* MCP Client (inside Host) */}
          <Pill box={CLIENT} label="MCP Client" hub delay={0.15} />

          {/* Satellites */}
          <Pill box={USER} label="User" sub="사용자" delay={0.1} />
          <Pill box={SERVER} label="MCP Server" sub="Tool 제공" delay={0.1} />
          <Pill box={LLM} label="LLM" sub="추론 모델" delay={0.1} />
        </svg>
      </div>

      <div className="relative grid gap-3 px-4 pb-6 pt-2 sm:px-8 sm:pb-8">
        {CARDS.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.6 + i * 0.08 }}
            className="rounded-xl border border-[var(--color-primary-50)]/15 bg-[var(--color-primary-50)]/[0.04] px-5 py-4"
          >
            <div className="flex items-baseline gap-3">
              <span className="text-[13px] font-semibold tracking-tight text-[var(--color-primary-50)]">
                {c.title}
              </span>
              <span className="block h-px flex-1 bg-[var(--color-primary-50)]/15" />
            </div>
            <p className="mt-2 text-[12.5px] leading-[1.7] text-[var(--color-text-muted)]">
              {c.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Pill({
  box,
  label,
  sub,
  hub,
  delay = 0,
}: {
  box: Box;
  label: string;
  sub?: string;
  hub?: boolean;
  delay?: number;
}) {
  const r = box.h / 2;
  const x = box.cx - box.w / 2;
  const y = box.cy - box.h / 2;
  return (
    <motion.g
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay }}
    >
      <rect
        x={x}
        y={y}
        width={box.w}
        height={box.h}
        rx={r}
        fill={hub ? 'rgba(4,230,162,0.20)' : 'rgba(4,230,162,0.08)'}
        stroke={hub ? 'rgba(4,230,162,0.85)' : STROKE_SOFT}
        strokeWidth={hub ? 1.4 : 1}
      />
      <text
        x={box.cx}
        y={sub ? box.cy - 4 : box.cy + 4}
        textAnchor="middle"
        fontSize="14"
        fontWeight="600"
        fill="#f3fff9"
        fontFamily="Pretendard Variable, Pretendard, sans-serif"
      >
        {label}
      </text>
      {sub && (
        <text
          x={box.cx}
          y={box.cy + 14}
          textAnchor="middle"
          fontSize="11"
          fill="rgba(4,230,162,0.85)"
          fontFamily="Pretendard Variable, Pretendard, sans-serif"
        >
          {sub}
        </text>
      )}
    </motion.g>
  );
}

const CARDS = [
  {
    title: 'MCP Host',
    desc: 'LLM을 사용해 외부 데이터·도구가 필요한 요청을 처리해요. 사용자와 상호작용하는 지점으로, AI 기반 IDE나 대화형 AI 같은 환경 자체를 의미해요.',
  },
  {
    title: 'MCP Client',
    desc: 'Host 안에서 LLM과 MCP Server 사이의 통신을 중개해요. LLM의 요청을 MCP 형식으로 변환하고, 응답을 LLM이 이해할 수 있게 되돌려줘요.',
  },
  {
    title: 'MCP Server',
    desc: 'LLM에 컨텍스트·데이터·기능을 제공하는 외부 시스템(DB, API, 파일 등)에 연결돼요. 표준화된 형식으로 다양한 도구를 LLM에 노출해줘요.',
  },
];
