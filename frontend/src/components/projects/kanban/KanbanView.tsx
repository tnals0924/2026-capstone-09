'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { privateApi } from '@/api';
import { KanbanItem } from '@/api/Api';
import { usePositionedToast } from '@/components/commons/custom-toast/usePositionedToast';
import { Loading } from '@/components/commons/loading/Loading';
import { NodeSidebar } from '@/components/node-datail/NodeSidebar';
import { NodeStatusType } from '@/constants/nodeStatus';

import { KanbanColumn } from './KanbanColumn';

interface KanbanViewProps {
  projectId: number;
}

const KANBAN_STATUSES: NodeStatusType[] = ['WAITING', 'IN_PROGRESS', 'DONE'];
const SORT_ORDER_GAP = 1024;

export function KanbanView({ projectId }: KanbanViewProps) {
  const toast = usePositionedToast();
  const [loading, setLoading] = useState(true);
  const [groupedNodes, setGroupedNodes] = useState<Record<NodeStatusType, KanbanItem[]>>({
    WAITING: [],
    IN_PROGRESS: [],
    DONE: [],
  });
  const [sidebarNodeId, setSidebarNodeId] = useState<number | null>(null);

  const groupedNodesRef = useRef(groupedNodes);

  useEffect(() => {
    groupedNodesRef.current = groupedNodes;
  }, [groupedNodes]);

  // 8px 이상 움직였을 때만 드래그 시작
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const loadKanbanData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await privateApi.node.getKanban(projectId);
      const chartData = data.data.data ?? null;

      // sortOrder가 0인 노드는 createdAt 기준으로 정렬 후 초기화
      const initializeSortOrder = (nodes: KanbanItem[]) => {
        const sorted = [...nodes].sort((a, b) => {
          const aDate = new Date(a.createdAt ?? 0).getTime();
          const bDate = new Date(b.createdAt ?? 0).getTime();
          return aDate - bDate;
        });

        return sorted.map((node, index) => ({
          ...node,
          sortOrder: node.sortOrder && node.sortOrder > 0 ? node.sortOrder : (index + 1) * SORT_ORDER_GAP,
        }));
      };

      setGroupedNodes({
        WAITING: initializeSortOrder(chartData?.waiting ?? []).sort(
          (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
        ),
        IN_PROGRESS: initializeSortOrder(chartData?.inProgress ?? []).sort(
          (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
        ),
        DONE: initializeSortOrder(chartData?.done ?? []).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
      });
    } catch (error) {
      console.error('Failed to load kanban:', error);
      const errorMessage =
        error instanceof Error ? error.message : '칸반 데이터를 불러오는데 실패했습니다.';
      toast({
        content: errorMessage,
        variant: 'negative',
        placement: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  }, [projectId, toast]);

  useEffect(() => {
    void loadKanbanData();
  }, [loadKanbanData]);

  const handleNodeDoubleClick = useCallback((nodeId: number) => {
    setSidebarNodeId(nodeId);
  }, []);

  const findNodeStatus = useCallback(
    (nodeId: number, nodes: Record<NodeStatusType, KanbanItem[]>): NodeStatusType | null => {
      for (const status of ['WAITING', 'IN_PROGRESS', 'DONE'] as NodeStatusType[]) {
        if (nodes[status].some((n) => n.nodeId === nodeId)) {
          return status;
        }
      }
      return null;
    },
    []
  );

  const updateNodePosition = useCallback(
    (activeId: number, overId: string | number) => {
      setGroupedNodes((prev) => {
        const activeStatus = findNodeStatus(activeId, prev);
        if (!activeStatus) return prev;

        const isOverColumn = ['WAITING', 'IN_PROGRESS', 'DONE'].includes(overId as string);
        const overStatus = isOverColumn ? (overId as NodeStatusType) : findNodeStatus(Number(overId), prev);

        if (!overStatus) return prev;

        // 같은 컬럼 내에서 이동
        if (activeStatus === overStatus) {
          if (isOverColumn) {
            return prev; // 같은 컬럼으로 드롭하면 무시
          }

          const oldIndex = prev[activeStatus].findIndex((n) => n.nodeId === activeId);
          const newIndex = prev[overStatus].findIndex((n) => n.nodeId === Number(overId));

          if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
            return prev;
          }

          return {
            ...prev,
            [activeStatus]: arrayMove(prev[activeStatus], oldIndex, newIndex),
          };
        } else {
          // 다른 컬럼으로 이동
          const activeNode = prev[activeStatus].find((n) => n.nodeId === activeId);
          if (!activeNode) return prev;

          const sourceNodes = prev[activeStatus].filter((n) => n.nodeId !== activeId);
          const destNodes = [...prev[overStatus]];

          let insertIndex: number;
          if (isOverColumn) {
            insertIndex = destNodes.length;
          } else {
            insertIndex = destNodes.findIndex((n) => n.nodeId === Number(overId));
            // insertIndex가 -1이면 마지막에 추가
            if (insertIndex === -1) {
              insertIndex = destNodes.length;
            }
          }

          destNodes.splice(insertIndex, 0, activeNode);

          return {
            ...prev,
            [activeStatus]: sourceNodes,
            [overStatus]: destNodes,
          };
        }
      });
    },
    [findNodeStatus]
  );

  // 0ms 디바운스로 무한 루프 방지 (dnd-kit sortable 이슈)
  const debouncedUpdateNodePosition = useDebouncedCallback(updateNodePosition, 0);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;

      if (!over) return;

      const activeId = Number(active.id);
      const overId = over.id;

      debouncedUpdateNodePosition(activeId, overId);
    },
    [debouncedUpdateNodePosition]
  );

  // 드래그 종료 후 서버 저장
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) {
        return;
      }

      const nodeId = Number(active.id);
      const currentNodes = groupedNodesRef.current;

      const isOverColumn = KANBAN_STATUSES.includes(over.id as NodeStatusType);
      const targetStatus = isOverColumn
        ? (over.id as NodeStatusType)
        : findNodeStatus(Number(over.id), currentNodes);

      if (!targetStatus) return;

      const sourceStatus = findNodeStatus(nodeId, currentNodes);
      if (!sourceStatus) return;

      const currentNode = currentNodes[sourceStatus].find((n) => n.nodeId === nodeId);
      if (!currentNode) return;

      try {
        let nodes = currentNodes[targetStatus];
        if (sourceStatus === targetStatus) {
          // 같은 컬럼 내 이동
          nodes = nodes.filter((n) => n.nodeId !== nodeId);
        }

        let nodeIndex: number;
        if (isOverColumn) {
          nodeIndex = nodes.length; // 마지막
        } else {
          nodeIndex = nodes.findIndex((n) => n.nodeId === Number(over.id));
          if (nodeIndex === -1) {
            nodeIndex = nodes.length;
          }
        }

        // sortOrder 계산
        let newSortOrder: number;
        let needsRebalance = false;

        if (nodeIndex === 0) {
          // 첫 번째 위치
          const nextNode = nodes[0];
          const nextOrder = nextNode?.sortOrder ?? SORT_ORDER_GAP;
          newSortOrder = nextOrder / 2;

          if (newSortOrder < 1) {
            needsRebalance = true;
          }
        } else if (nodeIndex === nodes.length) {
          // 마지막 위치
          const prevNode = nodes[nodes.length - 1];
          newSortOrder = (prevNode?.sortOrder ?? 0) + SORT_ORDER_GAP;
        } else {
          // 중간 위치
          const prevNode = nodes[nodeIndex - 1];
          const nextNode = nodes[nodeIndex];
          const prevOrder = prevNode?.sortOrder ?? 0;
          const nextOrder = nextNode?.sortOrder ?? 0;
          newSortOrder = (prevOrder + nextOrder) / 2;

          const gap = Math.abs(newSortOrder - prevOrder);
          if (gap < 1) {
            needsRebalance = true;
          }
        }

        if (needsRebalance) {
          // 간격이 좁을 경우 리밸런싱
          const nextNodes = [
            ...nodes.slice(0, nodeIndex),
            { ...currentNode, sortOrder: 0 }, // 임시값
            ...nodes.slice(nodeIndex),
          ];

          const rebalanced = nextNodes.map((node, index) => ({
            ...node,
            sortOrder: (index + 1) * SORT_ORDER_GAP,
          }));

          setGroupedNodes((prev) => ({
            ...prev,
            [targetStatus]: rebalanced,
            ...(sourceStatus !== targetStatus && {
              [sourceStatus]: prev[sourceStatus].filter((n) => n.nodeId !== nodeId),
            }),
          }));

          newSortOrder = (nodeIndex + 1) * SORT_ORDER_GAP;
        } else {
          const nextNodes = [
            ...nodes.slice(0, nodeIndex),
            { ...currentNode, sortOrder: newSortOrder },
            ...nodes.slice(nodeIndex),
          ];

          setGroupedNodes((prev) => ({
            ...prev,
            [targetStatus]: nextNodes,
            ...(sourceStatus !== targetStatus && {
              [sourceStatus]: prev[sourceStatus].filter((n) => n.nodeId !== nodeId),
            }),
          }));
        }

        await privateApi.node.updateNodeKanban(projectId, nodeId, {
          status: targetStatus,
          sortOrder: newSortOrder,
        });
      } catch (error) {
        console.error('Failed to update node status:', error);
        const errorMessage =
          error instanceof Error ? error.message : '노드 상태 변경에 실패했습니다.';
        toast({
          content: errorMessage,
          variant: 'negative',
          placement: 'top-center',
        });
        await loadKanbanData();
      }
    },
    [findNodeStatus, loadKanbanData, projectId, toast]
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <DndContext sensors={sensors} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="flex-1 h-full w-full p-10 bg-surface-canvas">
        <div className="flex gap-2.5 h-full">
          {KANBAN_STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              nodes={groupedNodes[status]}
              onNodeDoubleClick={handleNodeDoubleClick}
            />
          ))}
        </div>
      </div>

      <NodeSidebar projectId={projectId} nodeId={sidebarNodeId} onClose={() => setSidebarNodeId(null)} />
    </DndContext>
  );
}