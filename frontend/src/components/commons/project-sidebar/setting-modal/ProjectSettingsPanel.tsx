'use client';

import { Avatar, TextField, TextFieldContent } from '@wanteddev/wds';
import { IconLogout, IconTrash } from '@wanteddev/wds-icon';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { privateApi } from '@/api';
import { useDialog } from '@/components/commons/custom-dialog/DialogContext';
import { usePositionedToast } from '@/components/commons/custom-toast/usePositionedToast';

import { ProjectDeleteConfirmContent } from './ProjectDeleteConfirmContent';
import { ProjectLeaveConfirmContent } from './ProjectLeaveConfirmContent';
import type { ProjectMemberRole } from './SettingsModalContent';
import { useProjectInfoForm } from './useProjectInfoForm';

interface ProjectSettingsPanelProps {
  projectId: number;
  /** 부모(`SettingsModalContent`)에서 한 번 받아 내려주는 현재 사용자의 권한. */
  myRole: ProjectMemberRole | null;
  /** 모달을 닫는 함수. 프로젝트 삭제·나가기 등 모달 자체를 닫을 때 사용한다. */
  onSettingsClose: () => void;
}

interface ProjectInfo {
  name: string;
  memberCount: number;
  createdAt: string;
  profileImageUrl?: string;
}

const formatCreatedAt = (raw?: string): string => {
  if (!raw) return '-';
  try {
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) return raw;
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  } catch {
    return raw;
  }
};

const AUTO_SAVE_DEBOUNCE_MS = 1000;

const PROJECT_IMAGE_MAX_BYTES = 5 * 1024 * 1024; // 5MB
const PROJECT_IMAGE_ACCEPT = ['image/png', 'image/jpeg', 'image/webp'] as const;

/** 백엔드 envelope 형태에서 에러 코드를 안전하게 꺼낸다. */
const extractErrorCode = (caught: unknown): string | undefined => {
  if (typeof caught !== 'object' || caught === null) return undefined;
  const obj = caught as { error?: { code?: string }; code?: string };
  return obj.error?.code ?? obj.code;
};

/** 디버깅용 — Response 로 throw 된 객체에서 status·body 까지 평탄화해 console 에 찍는다. */
const formatErrorForLog = (caught: unknown): Record<string, unknown> => {
  if (typeof caught !== 'object' || caught === null) return { caught };
  const obj = caught as {
    status?: number;
    statusText?: string;
    url?: string;
    error?: unknown;
    data?: unknown;
    code?: string;
    message?: string;
  };
  return {
    status: obj.status,
    statusText: obj.statusText,
    url: obj.url,
    error: obj.error,
    data: obj.data,
    code: obj.code,
    message: caught instanceof Error ? caught.message : obj.message,
    name: caught instanceof Error ? caught.name : undefined,
  };
};

/**
 * 설정 모달 - 프로젝트 탭.
 *
 * 권한 분기:
 * - 소유자(OWNER)만 이름 변경, 프로필 이미지 업로드, 프로젝트 삭제 가능.
 * - 소유자 외(MEMBER/VIEWER)는 이름·이미지 입력 비활성, 하단 액션은 "프로젝트 나가기"로 노출.
 *
 * 그 외:
 * - 마운트 시 `privateApi.project.getProject` 로 이름·구성원 수·생성일·프로필 이미지 표시.
 * - 이름은 별도 저장 버튼 없이 1초 debounce 후 자동 저장(`updateProject`).
 * - 프로필 이미지: 클라이언트 사전 검증(5MB / png·jpeg·webp) → `updateProfileImage1` (multipart) 호출.
 *   응답 `data: null` 이라 `getProject` 재로드로 화면 갱신.
 * - 프로젝트 삭제는 컨펌 다이얼로그 → `deleteProject` → `/projects` 이동.
 * - 프로젝트 나가기는 컨펌 다이얼로그 → `leaveProject` → `/projects` 이동.
 */
export const ProjectSettingsPanel = ({
  projectId,
  myRole,
  onSettingsClose,
}: ProjectSettingsPanelProps) => {
  const router = useRouter();
  const { openDialog, closeDialog } = useDialog();
  const toast = usePositionedToast();

  const [info, setInfo] = useState<ProjectInfo | null>(null);
  const [reloadCounter, setReloadCounter] = useState(0);
  const triggerReload = () => setReloadCounter((c) => c + 1);

  const isOwner = myRole === 'OWNER';
  const canEditName = isOwner;
  const canUploadImage = isOwner;

  // Avatar 가 WDS 컴포넌트라 `<label htmlFor>` 의 click 위임이 일관되지 않을 수 있어
  // 명시적 ref 로 보유하고 Avatar wrapper 클릭 시 직접 `input.click()` 을 호출한다.
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (!canUploadImage) return;
    fileInputRef.current?.click();
  };

  const { name, setName, canSave, maxLength } = useProjectInfoForm({
    initialName: info?.name ?? '',
  });

  useEffect(() => {
    let cancelled = false;
    const fetchInfo = async () => {
      try {
        const response = await privateApi.project.getProject(projectId);
        if (cancelled) return;
        const data = response.data.data;
        // generated `GetProjectResponse` 에는 `profileImageUrl` 필드가 누락돼 있다.
        // 실제 응답에 들어올 수 있어 안전하게 1회 우회 cast — 백엔드 스펙에 명시되면 cast 제거.
        const profileImageUrl = (data as { profileImageUrl?: string } | undefined)?.profileImageUrl;
        setInfo({
          name: data?.name ?? '',
          memberCount: data?.memberCount ?? 0,
          createdAt: formatCreatedAt(data?.createdAt),
          profileImageUrl,
        });
      } catch (caught) {
        if (cancelled) return;
        console.error('프로젝트 상세 조회에 실패했어요.', caught);
      }
    };
    void fetchInfo();
    return () => {
      cancelled = true;
    };
  }, [projectId, reloadCounter]);

  // 이름 자동 저장: OWNER 권한 + 마지막 입력 후 1초가 지나면 updateProject 호출.
  useEffect(() => {
    if (!canEditName || !canSave) return;

    let cancelled = false;
    const timer = setTimeout(() => {
      const saveName = async () => {
        try {
          await privateApi.project.updateProject(projectId, { name: name.trim() });
          if (cancelled) return;
          triggerReload();
          toast({
            content: '프로젝트 이름을 수정했어요',
            variant: 'normal',
            placement: 'bottom-left',
            duration: 'short',
          });
        } catch (caught) {
          if (cancelled) return;
          console.error('프로젝트 이름 수정에 실패했어요.', caught);
        }
      };
      void saveName();
    }, AUTO_SAVE_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [name, canSave, canEditName, projectId, toast]);

  const handleProjectImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // 같은 파일을 다시 선택해도 onChange 가 발화되도록 input value 를 리셋한다.
    event.target.value = '';
    if (!file || !canUploadImage) return;

    // 클라이언트 사전 검증 (백엔드: png/jpeg/webp, 최대 5MB)
    const isAllowedType = PROJECT_IMAGE_ACCEPT.includes(
      file.type as (typeof PROJECT_IMAGE_ACCEPT)[number],
    );
    if (!isAllowedType) {
      toast({
        content: 'PNG·JPEG·WEBP 파일만 업로드할 수 있어요',
        variant: 'negative',
        placement: 'bottom-left',
        duration: 'short',
      });
      return;
    }
    if (file.size > PROJECT_IMAGE_MAX_BYTES) {
      toast({
        content: '파일 크기는 5MB 이하여야 해요',
        variant: 'negative',
        placement: 'bottom-left',
        duration: 'short',
      });
      return;
    }

    const formData = new FormData();
    // 명세 기준 multipart part name 은 `file`.
    // 사용자 프로필 업로드는 명세상 `file` 이지만 실구현이 `profileImage` 였으므로,
    // 만약 이 호출에서 `MissingServletRequestPartException 'profileImage'` 가 뜨면 키를 맞춰 정정.
    formData.append('file', file);

    try {
      // generated 시그니처가 `data: number` 로 잘못 추출돼 있어 1회 cast.
      // Swagger 가 multipart file 정의를 잡아주면 cast 제거 가능.
      await privateApi.project.updateProfileImage1(projectId, formData as unknown as number);
      triggerReload();
      toast({
        content: '프로젝트 이미지를 변경했어요',
        variant: 'normal',
        placement: 'bottom-left',
        duration: 'short',
      });
    } catch (caught) {
      const code = extractErrorCode(caught);
      const status = (caught as { status?: number } | null | undefined)?.status;
      if (code === 'FILE_SIZE_EXCEEDED') {
        toast({
          content: '파일 크기가 제한을 초과했어요',
          variant: 'negative',
          placement: 'bottom-left',
          duration: 'short',
        });
      } else if (code === 'FILE_INVALID_TYPE') {
        toast({
          content: '지원하지 않는 파일 형식이에요',
          variant: 'negative',
          placement: 'bottom-left',
          duration: 'short',
        });
      } else if (status === 500) {
        toast({
          content: '서버에서 처리하지 못했어요. 잠시 후 다시 시도해 주세요',
          variant: 'negative',
          placement: 'bottom-left',
          duration: 'short',
        });
        console.error('프로젝트 이미지 업로드 - 서버 500', formatErrorForLog(caught));
      } else {
        toast({
          content: '프로젝트 이미지 업로드에 실패했어요',
          variant: 'negative',
          placement: 'bottom-left',
          duration: 'short',
        });
        console.error('프로젝트 이미지 업로드 실패', formatErrorForLog(caught));
      }
    }
  };

  const handleDeleteProjectClick = () => {
    if (!info) return;
    openDialog({
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <ProjectDeleteConfirmContent
          projectName={info.name}
          onConfirm={async () => {
            try {
              await privateApi.project.deleteProject(projectId);
              closeDialog();
              onSettingsClose();
              router.push('/projects');
              toast({
                content: '프로젝트를 삭제했어요',
                variant: 'normal',
                placement: 'bottom-left',
                duration: 'short',
              });
            } catch (caught) {
              console.error('프로젝트 삭제에 실패했어요.', caught);
            }
          }}
          onClose={closeDialog}
        />
      ),
    });
  };

  const handleLeaveProjectClick = () => {
    openDialog({
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <ProjectLeaveConfirmContent
          onConfirm={async () => {
            try {
              await privateApi.projectMember.leaveProject(projectId);
              closeDialog();
              onSettingsClose();
              router.push('/projects');
              toast({
                content: '프로젝트에서 나갔어요',
                variant: 'normal',
                placement: 'bottom-left',
                duration: 'short',
              });
            } catch (caught) {
              console.error('프로젝트 나가기에 실패했어요.', caught);
            }
          }}
          onClose={closeDialog}
        />
      ),
    });
  };

  return (
    <div className="flex h-full flex-col justify-between gap-8">
      <div className="flex flex-col gap-6">
        {/* 프로필 + 이름 (가로 배치) */}
        <div className="flex items-center gap-8">
          {/*
            WDS Avatar 가 data-interaction="true" 일 때 자체 wrapper(button) + absolute overlay 를
            만들어서 외부 div role=button 의 onClick/hover 가 이벤트 hit 우선순위에서 밀린다.
            해결: Avatar 는 그대로 표시만 하고, Avatar 위에 absolute z-10 투명 button 을 별도로
            올려서 클릭 영역을 명확하게 가져간다. button 은 inline 형제이므로 중첩 문제도 없음.
          */}
          <div className="relative inline-flex shrink-0 overflow-hidden rounded-3xl">
            <Avatar
              variant="company"
              size={84}
              src={info?.profileImageUrl}
              alt={info?.name ?? '프로젝트'}
            />
            {canUploadImage && (
              <>
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  aria-label="프로젝트 이미지 변경"
                  className="hover:bg-label-normal/20 focus-visible:ring-primary-40 absolute inset-0 z-10 cursor-pointer rounded-3xl border-none bg-transparent outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-offset-2"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={PROJECT_IMAGE_ACCEPT.join(',')}
                  className="sr-only"
                  onChange={handleProjectImageChange}
                />
              </>
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <label
              htmlFor="project-settings-name"
              className="text-label-1 text-label-neutral font-semibold"
            >
              이름
            </label>
            <TextField
              id="project-settings-name"
              value={name}
              maxLength={maxLength}
              onChange={(event) => setName(event.target.value)}
              width="100%"
              disabled={!canEditName}
              trailingContent={
                <TextFieldContent variant="text">
                  <span className="text-caption-1 text-label-alternative font-medium">
                    {name.length}/{maxLength}
                  </span>
                </TextFieldContent>
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-label-1 text-label-alternative font-medium">
            구성원 수: {info?.memberCount ?? 0}명
          </p>
          <p className="text-label-1 text-label-alternative font-medium">
            프로젝트 생성일: {info?.createdAt ?? '-'}
          </p>
        </div>
      </div>

      <div>
        {isOwner ? (
          <button
            type="button"
            onClick={handleDeleteProjectClick}
            disabled={!info}
            className="text-body-1 text-status-negative hover:bg-fill-normal active:bg-fill-strong focus-visible:ring-primary-40 inline-flex items-center gap-2 rounded-md bg-transparent px-2 py-1 font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <IconTrash className="text-status-negative h-4 w-4" aria-hidden="true" />
            프로젝트 삭제
          </button>
        ) : (
          <button
            type="button"
            onClick={handleLeaveProjectClick}
            disabled={myRole === null}
            className="text-body-1 text-status-negative hover:bg-fill-normal active:bg-fill-strong focus-visible:ring-primary-40 inline-flex items-center gap-2 rounded-md bg-transparent px-2 py-1 font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <IconLogout className="text-status-negative h-4 w-4" aria-hidden="true" />
            프로젝트 나가기
          </button>
        )}
      </div>
    </div>
  );
};

ProjectSettingsPanel.displayName = 'ProjectSettingsPanel';
