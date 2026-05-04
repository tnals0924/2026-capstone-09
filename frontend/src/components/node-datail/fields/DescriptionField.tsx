'use client';

import { useEffect, useRef, useState } from 'react';
import { privateApi } from '@/api';

interface DescriptionFieldProps {
  projectId: number;
  nodeId: number;
  description: string | undefined;
  onUpdate: (description: string) => void;
}

export function DescriptionField({
  projectId,
  nodeId,
  description,
  onUpdate,
}: DescriptionFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(description ?? '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isEditing) setDraft(description ?? '');
  }, [description, isEditing]);

  useEffect(() => {
    if (isEditing) textareaRef.current?.focus();
  }, [isEditing]);

  const handleSave = async () => {
    setIsEditing(false);
    if (draft === (description ?? '')) return;
    const previous = description ?? '';
    onUpdate(draft);
    try {
      await privateApi.node.updateNode(projectId, nodeId, { description: draft });
    } catch {
      // TODO: 에러 토스트 알림 추가 필요
      onUpdate(previous);
    }
  };

  if (isEditing) {
    return (
      <textarea
        ref={textareaRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setDraft(description ?? '');
            setIsEditing(false);
          }
        }}
        className="w-full resize-none rounded border border-blue-300 px-2 py-1 text-sm outline-none"
        rows={2}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className="cursor-text rounded px-1 text-left text-sm hover:bg-gray-50"
    >
      {description ? (
        <span>{description}</span>
      ) : (
        <span className="text-gray-400">설명 추가...</span>
      )}
    </button>
  );
}