'use client';

import { useCallback, useMemo } from 'react';

import type { CreateMultiNodeSummaryRequest, MultiNodeSummaryNode } from './types';

interface UseMultiNodeSummaryRequestParams {
  nodes: readonly MultiNodeSummaryNode[];
  onSubmit?: (payload: CreateMultiNodeSummaryRequest) => void;
}

export const useMultiNodeSummaryRequest = ({
  nodes,
  onSubmit,
}: UseMultiNodeSummaryRequestParams) => {
  const payload = useMemo<CreateMultiNodeSummaryRequest>(
    () => ({
      nodeIds: nodes.map((node) => node.id),
    }),
    [nodes],
  );

  const handleSubmit = useCallback(() => {
    // TODO: privateApi.ai.createMultiNodeSummary(projectId, payload) 생성 후 연결
    onSubmit?.(payload);
  }, [onSubmit, payload]);

  return {
    payload,
    handleSubmit,
  };
};
