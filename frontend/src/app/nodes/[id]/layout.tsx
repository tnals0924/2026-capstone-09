'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { use } from 'react';

interface NodeDetailLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default function NodeDetailLayout({ children, params }: NodeDetailLayoutProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const pathname = usePathname();
  const activeTab = pathname.endsWith('/meeting') ? 'meeting' : 'note';

  return (
    <div className="flex h-full flex-col bg-white">
      {/* ── 상단 메타 영역 ── */}
      <NodeDetailHeader nodeId={id} />

      {/* ── 탭 네비게이션 ── */}
      <div className="flex border-b border-gray-200 px-6">
        <TabLink href={`/nodes/${id}/note`} active={activeTab === 'note'}>
          노트
        </TabLink>
        <TabLink href={`/nodes/${id}/meeting`} active={activeTab === 'meeting'}>
          회의
        </TabLink>
      </div>

      {/* ── 탭 컨텐츠 영역 ── */}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}

// ────────────────────────────────────────────────
// 상단 메타 헤더 (공통 컴포넌트들을 조합하는 레이아웃 구조)
// 실제 프로젝트에서는 TagChip, AssigneeAvatar 등 공통 컴포넌트로 교체
// ────────────────────────────────────────────────
function NodeDetailHeader({ nodeId }: { nodeId: string }) {
  return (
    <div className="space-y-4 px-6 pt-5 pb-4">
      {/* 노드 번호 + 액션 버튼 */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-gray-400">#1-1</span>
        <div className="flex items-center gap-2">
          {/* 토글 버튼 (공통 컴포넌트 슬롯) */}
          <ToggleButton />
          {/* 더보기 버튼 (공통 컴포넌트 슬롯) */}
          <MoreButton />
        </div>
      </div>

      {/* 노드 제목 (공통 컴포넌트 슬롯) */}
      <h1 className="text-[22px] leading-tight font-bold text-gray-900">노드 제목</h1>

      {/* 메타 필드 목록 */}
      <div className="space-y-2.5">
        <MetaRow icon="🏷️" label="태그">
          {/* TagChip 공통 컴포넌트 슬롯 */}
          <div className="flex flex-wrap gap-1.5">
            {['텍스트', '텍스트', '텍스트', '텍스트', '텍스트'].map((t, i) => (
              <span
                key={i}
                className="rounded-full border border-teal-100 bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700"
              >
                {t}
              </span>
            ))}
          </div>
        </MetaRow>

        <MetaRow icon="👥" label="노드 담당자">
          {/* AssigneeAvatar 공통 컴포넌트 슬롯 */}
          <div className="flex items-center gap-2">
            <Avatar name="박건민" />
            <Avatar name="박건민" />
          </div>
        </MetaRow>

        <MetaRow icon="📄" label="노드 설명">
          <span className="text-sm text-gray-600">
            노드 설명입니다. 노드 설명입니다. 노드 설명입니다.
          </span>
        </MetaRow>

        <MetaRow icon="⏳" label="진행 상태">
          {/* StatusBadge 공통 컴포넌트 슬롯 */}
          <span className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700">
            <span className="text-teal-500">✓</span> 완료
          </span>
        </MetaRow>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// 탭 링크 (Next.js Link 기반, 소프트 네비게이션)
// ────────────────────────────────────────────────
function TabLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`relative mr-6 px-1 pt-1 pb-3 text-sm font-medium transition-colors ${active ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'} `}
    >
      {children}
      {active && (
        <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-gray-900" />
      )}
    </Link>
  );
}

// ────────────────────────────────────────────────
// 로컬 더미 공통 컴포넌트 (실제 프로젝트에서는 import로 교체)
// ────────────────────────────────────────────────
function MetaRow({
  icon,
  label,
  children,
}: {
  icon: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex w-28 shrink-0 items-center gap-1.5 pt-0.5 text-xs text-gray-400">
        <span>{icon}</span>
        {label}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-[10px] font-bold text-white">
        {name[0]}
      </div>
      <span className="text-sm text-gray-700">{name}</span>
    </div>
  );
}

function ToggleButton() {
  return (
    <button className="relative h-5 w-10 rounded-full bg-gray-200 transition-colors hover:bg-gray-300">
      <span className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform" />
    </button>
  );
}

function MoreButton() {
  return (
    <button className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="8" cy="3" r="1.2" />
        <circle cx="8" cy="8" r="1.2" />
        <circle cx="8" cy="13" r="1.2" />
      </svg>
    </button>
  );
}
