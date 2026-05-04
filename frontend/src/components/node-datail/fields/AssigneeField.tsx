'use client';

import { useEffect, useRef, useState } from 'react';
import { Avatar, Typography } from '@wanteddev/wds';
import { IconClose, IconPlus } from '@wanteddev/wds-icon';
import { AssigneeItem, ProjectMemberInfo } from '@/api/Api';
import { privateApi } from '@/api';

interface AssigneeFieldProps {
  projectId: number;
  nodeId: number;
  assignees: AssigneeItem[];
  onAdd: (assignee: AssigneeItem) => void;
  onRemove: (userId: number) => void;
}

export function AssigneeField({
  projectId,
  nodeId,
  assignees,
  onAdd,
  onRemove,
}: AssigneeFieldProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [members, setMembers] = useState<ProjectMemberInfo[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPickerOpen) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setIsPickerOpen(false);
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isPickerOpen]);

  const openPicker = async () => {
    if (members.length === 0) {
      try {
        const res = await privateApi.projectMember.getAllMembers(projectId);
        setMembers(res.data.data?.members ?? []);
      } catch {
        // TODO: 멤버 목록 로딩 실패 처리
      }
    }
    setIsPickerOpen(true);
  };

  const handleAdd = async (member: ProjectMemberInfo) => {
    if (!member.userId) return;
    setIsPickerOpen(false);
    const newAssignee: AssigneeItem = {
      userId: member.userId,
      nickname: member.nickname,
      email: member.email,
      profileImageUrl: member.profileImageUrl,
    };
    onAdd(newAssignee);
    try {
      await privateApi.node.createAssignee(projectId, nodeId, { userId: member.userId });
    } catch {
      // TODO: 에러 토스트 알림 추가 필요
      onRemove(member.userId);
    }
  };

  const handleRemove = async (userId: number) => {
    const removedAssignee = assignees.find((a) => a.userId === userId);
    onRemove(userId);
    try {
      // TODO: API의 deleteAssignee 파라미터가 assigneeId인데 AssigneeItem에는 userId만 존재함
      // assigneeId가 userId와 동일한지, 별도 ID인지 백엔드 확인 필요
      await privateApi.node.deleteAssignee(projectId, nodeId, userId);
    } catch {
      // TODO: 에러 토스트 알림 추가 필요
      if (removedAssignee) onAdd(removedAssignee);
    }
  };

  const assignedUserIds = new Set(assignees.map((a) => a.userId));
  const availableMembers = members.filter((m) => !assignedUserIds.has(m.userId));

  return (
    <div ref={containerRef} className="relative flex flex-wrap items-center gap-3">
      {assignees.map((assignee) => (
        <div key={assignee.userId} className="group flex items-center gap-1">
          <div className="scale-75">
            <Avatar variant="person" size="xsmall" src={assignee.profileImageUrl || undefined} />
          </div>
          <Typography variant="label1">{assignee.nickname}</Typography>
          <button
            type="button"
            onClick={() => assignee.userId && handleRemove(assignee.userId)}
            className="hidden rounded-full p-0.5 hover:bg-gray-100 group-hover:block"
            aria-label={`${assignee.nickname} 담당자 제거`}
          >
            <IconClose width={10} height={10} className="text-gray-500" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={openPicker}
        className="flex items-center justify-center rounded border border-dashed border-gray-300 p-0.5 hover:bg-gray-50"
        aria-label="담당자 추가"
      >
        <IconPlus width={12} height={12} className="text-gray-400" />
      </button>

      {isPickerOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 min-w-48 rounded-md border border-gray-200 bg-white py-1 shadow-md">
          {availableMembers.length === 0 ? (
            <p className="px-3 py-2 text-xs text-gray-400">
              {members.length === 0 ? '멤버가 없어요' : '모든 멤버가 추가됐어요'}
            </p>
          ) : (
            availableMembers.map((member) => (
              <button
                key={member.userId}
                type="button"
                onClick={() => handleAdd(member)}
                className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-50"
              >
                <Avatar
                  variant="person"
                  size="xsmall"
                  src={member.profileImageUrl || undefined}
                />
                <div className="flex flex-col text-left">
                  <Typography variant="label1">{member.nickname}</Typography>
                  <span className="text-xs text-gray-400">{member.email}</span>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}