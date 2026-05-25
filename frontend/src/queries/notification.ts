'use client';

import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';

import { privateApi } from '@/api';

import { notificationKeys } from './keys/notificationKeys';

const extractErrorCode = (caught: unknown): string | undefined => {
  if (typeof caught !== 'object' || caught === null) return undefined;
  const obj = caught as { error?: { code?: string }; code?: string };
  return obj.error?.code ?? obj.code;
};

const fetchNotificationSetting = async (projectId: number) => {
  try {
    const res = await privateApi.notificationSetting.getNotificationSetting(projectId);
    return res.data.data ?? null;
  } catch (caught) {
    if (extractErrorCode(caught) === 'NOTIFICATION_SETTING_NOT_FOUND') return null;
    throw caught;
  }
};

export function useUnreadCountQuery() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () =>
      privateApi.notification.getUnreadCount().then((res) => res.data.data?.unreadCount ?? 0),
  });
}

export function useNotificationSettingQuery(projectId: number) {
  return useQuery({
    queryKey: notificationKeys.setting(projectId),
    queryFn: () => fetchNotificationSetting(projectId),
    enabled: !!projectId,
  });
}

/**
 * 알림 설정을 미리 가져와 캐시에 채워둔다.
 * 프로젝트 설정 모달이 열리기 직전에 호출해 알림 탭 토글 깜빡임을 방지하는 용도.
 */
export function prefetchNotificationSetting(queryClient: QueryClient, projectId: number) {
  return queryClient.prefetchQuery({
    queryKey: notificationKeys.setting(projectId),
    queryFn: () => fetchNotificationSetting(projectId),
  });
}

export function useUpdateNotificationSettingMutation(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: {
      meetingEnabled: boolean;
      nodeEnabled: boolean;
      desktopEnabled: boolean;
      emailEnabled: boolean;
    }) => privateApi.notificationSetting.updateNotificationSetting(projectId, settings),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: notificationKeys.setting(projectId) }),
  });
}
