'use client';

import { useCallback, useEffect, useState } from 'react';

import { privateApi } from '@/api';

/** 백엔드 envelope 형태에서 에러 코드를 안전하게 꺼낸다. */
const extractErrorCode = (caught: unknown): string | undefined => {
  if (typeof caught !== 'object' || caught === null) return undefined;
  const obj = caught as { error?: { code?: string }; code?: string };
  return obj.error?.code ?? obj.code;
};

interface NotificationSettings {
  meetingEnabled: boolean;
  nodeEnabled: boolean;
  desktopEnabled: boolean;
  emailEnabled: boolean;
}

interface UseProjectNotificationsFormParams {
  projectId: number;
  /** 토글 저장 성공 시 호출. */
  onSaveSuccess?: () => void;
  /** 토글 저장 실패 시 사용자에게 보여줄 메시지를 받는다. */
  onSaveError?: (message: string) => void;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  meetingEnabled: false,
  nodeEnabled: false,
  desktopEnabled: false,
  emailEnabled: false,
};

/**
 * 프로젝트 알림 설정 폼 훅.
 *
 * - 마운트 시 `privateApi.notificationSetting.getNotificationSetting(projectId)` 으로 초기값 로드.
 * - 각 토글 변경(`setField`) 시 즉시 `updateNotificationSetting` 호출(다이얼로그 닫힘 등 디바운스 없이 즉시 반영).
 *   요청 실패 시 `onSaveError` 로 사용자 메시지를 위임하고, 클라이언트 상태도 이전 값으로 롤백한다.
 * - 응답 `data` 가 들어오면 그 값으로 동기화 — 서버가 정규화한 최종 상태를 반영.
 */
export const useProjectNotificationsForm = ({
  projectId,
  onSaveSuccess,
  onSaveError,
}: UseProjectNotificationsFormParams) => {
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchSettings = async () => {
      try {
        const response = await privateApi.notificationSetting.getNotificationSetting(projectId);
        if (cancelled) return;
        const data = response.data.data;
        setSettings({
          meetingEnabled: data?.meetingEnabled ?? false,
          nodeEnabled: data?.nodeEnabled ?? false,
          desktopEnabled: data?.desktopEnabled ?? false,
          emailEnabled: data?.emailEnabled ?? false,
        });
        setIsLoaded(true);
      } catch (caught) {
        if (cancelled) return;
        // 신규 프로젝트는 알림 설정 row 가 아직 없어 404 가 정상 케이스다.
        // 기본값으로 토글이 활성화되어, 첫 토글 시 PATCH 가 upsert 로 동작하길 기대.
        if (extractErrorCode(caught) === 'NOTIFICATION_SETTING_NOT_FOUND') {
          setIsLoaded(true);
          return;
        }
        console.error('알림 설정 조회에 실패했어요.', caught);
      }
    };
    void fetchSettings();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const setField = useCallback(
    async <K extends keyof NotificationSettings>(field: K, value: NotificationSettings[K]) => {
      // 낙관적 업데이트 — 즉시 토글 반영, 실패 시 롤백.
      const prevValue = settings[field];
      setSettings((prev) => ({ ...prev, [field]: value }));
      try {
        const response = await privateApi.notificationSetting.updateNotificationSetting(projectId, {
          [field]: value,
        });
        const data = response.data.data;
        if (data) {
          setSettings({
            meetingEnabled: data.meetingEnabled ?? false,
            nodeEnabled: data.nodeEnabled ?? false,
            desktopEnabled: data.desktopEnabled ?? false,
            emailEnabled: data.emailEnabled ?? false,
          });
        }
        onSaveSuccess?.();
      } catch (caught) {
        // 롤백
        setSettings((prev) => ({ ...prev, [field]: prevValue }));
        const code = extractErrorCode(caught);
        if (code === 'NOTIFICATION_SETTING_NOT_FOUND') {
          // 백엔드가 PATCH 로 자동 생성(upsert) 하지 않는다면 신규 프로젝트에선 토글 자체가 거부된다.
          // 사용자에게는 일반화된 메시지로 안내하고, 콘솔 로그로 백엔드 후속 조치 신호를 남긴다.
          onSaveError?.('알림 설정이 아직 준비되지 않았어요. 잠시 후 다시 시도해 주세요');
        } else {
          onSaveError?.('알림 설정 저장에 실패했어요');
        }
        console.error('알림 설정 저장에 실패했어요.', caught);
      }
    },
    [projectId, settings, onSaveSuccess, onSaveError],
  );

  return {
    settings,
    isLoaded,
    setField,
  };
};
