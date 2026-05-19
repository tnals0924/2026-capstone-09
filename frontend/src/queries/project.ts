'use client';

import { useQuery } from '@tanstack/react-query';

import { privateApi } from '@/api';
import { projectKeys } from './keys/projectKeys';

export function useProjectQuery(projectId: number) {
  return useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => privateApi.project.getProject(projectId).then((res) => res.data.data),
    enabled: !!projectId,
  });
}
