'use client';

import { IconButton } from '@wanteddev/wds';
import { IconFull } from '@wanteddev/wds-icon';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';

const SESSION_KEY = 'node_sidebar_open';

interface NodeSidebarProps {
  nodeId: string | null; // null이면 사이드바 닫힘
  onClose: () => void;
}

export function NodeSidebar({ nodeId, onClose }: NodeSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  // 마운트 시 sessionStorage에서 복원
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      setActiveNodeId(saved);
      setIsOpen(true);
    }
  }, []);

  // 외부에서 nodeId prop이 변경될 때 (노드 카드 클릭)
  useEffect(() => {
    if (nodeId) {
      setActiveNodeId(nodeId);
      setIsOpen(true);
      sessionStorage.setItem(SESSION_KEY, nodeId);
    }
  }, [nodeId]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    sessionStorage.removeItem(SESSION_KEY);
    onClose();
  }, [onClose]);

  if (!isOpen || !activeNodeId) return null;

  return (
    <>
      {/* 오버레이 (선택적 - 지금은 투명) */}
      <div className="fixed inset-0 z-30" onClick={handleClose} aria-hidden="true" />

      {/* 사이드바 패널 */}
      {/* TODO : 지금 열릴 때만 애니메이션 적용됨 - 추후 닫힐 때 애니메이션 구현 */}
      <aside
        className="animate-slide-in fixed top-0 right-0 z-40 flex h-full w-130 flex-col border-l border-gray-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 사이드바 상단 툴바 */}
        <div className="flex items-center justify-between px-3 py-2">
          {/* 전체 페이지로 확장하는 아이콘 */}
          {/* TODO : 전체 페이지의 경우 페이지 닫는 아이콘으로 변경 필요 */}
          <IconButton
            color="semantic.label.alternative"
            href={`/nodes/${activeNodeId}/note`}
            size={16}
            aria-label="전체화면 보기"
            as={Link}
          >
            <IconFull />
          </IconButton>
        </div>

        <div className="flex-1 overflow-hidden">
          <NodeDetailInSidebar nodeId={activeNodeId} />
        </div>
      </aside>
    </>
  );
}

// ────────────────────────────────────────────────
// 사이드바 내부에서 NodeDetail 컨텐츠를 직접 렌더링
// 전체 페이지(/nodes/[id]/notes)와 동일한 구조
// ────────────────────────────────────────────────
function NodeDetailInSidebar({ nodeId }: { nodeId: string }) {
  const [activeTab, setActiveTab] = useState<'note' | 'meeting'>('note');

  return (
    <div className="flex h-full flex-col">
      {/* 상단 헤더 - layout.tsx의 NodeDetailHeader와 동일 구조 */}
      <div className="space-y-4 px-6 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium tracking-wide text-gray-400">#1-1</span>
          <div className="flex items-center gap-2">
            <ToggleButton />
            <MoreButton />
          </div>
        </div>

        <h1 className="text-[22px] leading-tight font-bold text-gray-900">노드 제목</h1>

        <div className="space-y-2.5">
          <MetaRow icon="🏷️" label="태그">
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
            <span className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700">
              <span className="text-teal-500">✓</span> 완료
            </span>
          </MetaRow>
        </div>
      </div>

      {/* 탭 네비게이션 - layout.tsx의 탭과 동일 */}
      <div className="flex border-b border-gray-200 px-6">
        {(['note', 'meeting'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative mr-6 px-1 pt-1 pb-3 text-sm font-medium transition-colors ${activeTab === tab ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'} `}
          >
            {tab === 'note' ? '노트' : '회의'}
            {activeTab === tab && (
              <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-gray-900" />
            )}
          </button>
        ))}
      </div>

      {/* 탭 컨텐츠 */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'note' ? (
          <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50">
            <span className="text-sm text-gray-400">노트 에디터 컴포넌트 영역</span>
          </div>
        ) : (
          <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50">
            <span className="text-sm text-gray-400">회의 컨텐츠 컴포넌트 영역</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// 로컬 더미 공통 컴포넌트
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
