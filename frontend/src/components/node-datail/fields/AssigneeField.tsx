'use client';

import { useEffect, useRef, useState } from 'react';
import { Avatar, Typography } from '@wanteddev/wds';
import { IconClose } from '@wanteddev/wds-icon';
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
    const newAssignee: AssigneeItem = {
      userId: member.userId,
      nickname: member.nickname,
      email: member.email,
      profileImageUrl: member.profileImageUrl,
    };
    onAdd(newAssignee);
    try {
      await privateApi.nodeAssignee.createAssignee(projectId, nodeId, { userId: member.userId });
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
      await privateApi.nodeAssignee.deleteAssignee(projectId, nodeId, userId);
    } catch {
      // TODO: 에러 토스트 알림 추가 필요
      if (removedAssignee) onAdd(removedAssignee);
    }
  };

  const assignedUserIds = new Set(assignees.map((a) => a.userId));
  const availableMembers = members.filter((m) => !assignedUserIds.has(m.userId));

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        onClick={() => { if (!isPickerOpen) void openPicker(); }}
        className={`flex w-full cursor-text flex-wrap items-center gap-2.5 rounded-t-sm ${isPickerOpen ? 'bg-line-normal-alternative border-line-solid-normal border border-b-0 p-2.5' : ''}`}
      >
        {assignees.length === 0 && (
          <div className="text-label-alternative items-center">
            <Typography variant="caption1">선택된 담당자가 없어요</Typography>
          </div>
        )}
        {assignees.map((assignee) => (
          <div key={assignee.userId} className="group flex items-center gap-1">
            <div className="scale-75">
              <Avatar variant="person" size="xsmall" src={assignee.profileImageUrl || undefined} />
            </div>
            <Typography variant="label1">{assignee.nickname}</Typography>
            <IconClose
              width={10}
              height={10}
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                if (assignee.userId) handleRemove(assignee.userId);
              }}
              aria-label={`${assignee.nickname} 담당자 제거`}
            />
          </div>
        ))}
        {isPickerOpen && <span className="h-4 w-px self-center" />}
      </div>

      {isPickerOpen && (
        <div className="border-line-solid-normal absolute top-full left-0 z-50 w-full rounded-b-sm border bg-white py-2 shadow-md">
          {availableMembers.length === 0 ? (
            <p className="text-label-alternative px-3 py-2">
              <Typography variant="caption1">
                {members.length === 0 ? '멤버가 없어요' : '모든 멤버가 추가되었어요'}
              </Typography>
            </p>
          ) : (
            availableMembers.map((member) => (
              <button
                key={member.userId}
                type="button"
                onClick={() => handleAdd(member)}
                className="flex w-full items-center gap-2 bg-white px-3 py-2 hover:bg-gray-50"
              >
                <Avatar variant="person" size="xsmall" src={member.profileImageUrl || undefined} />
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