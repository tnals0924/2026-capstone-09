'use client';

import { useEffect, useRef, useState } from 'react';
import { ContentBadge, ThemeColorsToken } from '@wanteddev/wds';
import { NodeStatusType, NODE_STATUS_INFO } from '@/constants/nodeStatus';
import { getNodeStatusColor, getNodeStatusIcon, getNodeStatusLabel } from '@/utils/getNodeStatus';
import { privateApi } from '@/api';

interface StatusFieldProps {
  projectId: number;
  nodeId: number;
  status: NodeStatusType | undefined;
  onUpdate: (status: NodeStatusType) => void;
}

export function StatusField({ projectId, nodeId, status, onUpdate }: StatusFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isOpen]);

  const handleSelect = async (newStatus: NodeStatusType) => {
    setIsOpen(false);
    const previous = status;
    onUpdate(newStatus);
    try {
      await privateApi.node.updateNode(projectId, nodeId, { status: newStatus });
    } catch {
      // TODO: 에러 토스트 알림 추가 필요
      if (previous) onUpdate(previous);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="cursor-pointer rounded hover:opacity-70"
      >
        <ContentBadge
          size="xsmall"
          color="accent"
          accentColor={getNodeStatusColor(status as NodeStatusType) as ThemeColorsToken}
          leadingContent={getNodeStatusIcon(status as NodeStatusType)}
        >
          {getNodeStatusLabel(status as NodeStatusType)}
        </ContentBadge>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 min-w-32 rounded-md border border-gray-200 bg-white py-1 shadow-md">
          {(Object.keys(NODE_STATUS_INFO) as NodeStatusType[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSelect(s)}
              className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 hover:bg-gray-50"
            >
              <ContentBadge
                size="xsmall"
                color="accent"
                accentColor={getNodeStatusColor(s) as ThemeColorsToken}
                leadingContent={getNodeStatusIcon(s)}
              >
                {getNodeStatusLabel(s)}
              </ContentBadge>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}