'use client';

import { useModal } from '@/components/commons/modal/ModalContext';
import { MeetingCreateModalContent } from '@/components/projects/node-flow/MeetingCreateModalContent';
import { MeetingDeleteConfirmContent } from '@/components/projects/project-detail/meeting-delete/MeetingDeleteConfirmContent';
import { NodeDeleteConfirmContent } from '@/components/projects/project-detail/node-delete/NodeDeleteConfirmContent';
import { ReferenceNodeModalContent } from '@/components/projects/project-detail/reference-node/ReferenceNodeModalContent';
import { useDeleteMeetingMutation } from '@/queries/meetingDelete';
import { useDeleteNodeMutation } from '@/queries/nodeDelete';
import { useErrorToast } from './useErrorToast';

interface NodeMenuActionsOptions {
  nodeId: number;
  projectId: number;
  meetingId?: number;
  nodeTitle?: string;
  nodeNumber?: number | string;
  onBeforeAction?: () => void;
}

export function useNodeMenuActions({
  nodeId,
  projectId,
  meetingId,
  nodeTitle = '',
  nodeNumber,
  onBeforeAction,
}: NodeMenuActionsOptions) {
  const { openModal, closeModal } = useModal();
  const { mutate: deleteNode } = useDeleteNodeMutation(projectId);
  const { mutate: deleteMeeting } = useDeleteMeetingMutation(projectId);
  const showErrorToast = useErrorToast();

  const before = () => onBeforeAction?.();
  const badge = `#${nodeNumber ?? nodeId}`;

  return {
    onCreateSubNode: () => {
      before();
      // TODO: 서브 노드 생성
    },
    onCreateMeeting: () => {
      before();
      openModal({
        closeOnBackdrop: true,
        content: (
          <MeetingCreateModalContent
            nodeBadge={badge}
            nodeTitle={nodeTitle}
            participantOptions={[]}
            onClose={closeModal}
          />
        ),
      });
    },
    onEditMeeting: () => {
      before();
      // TODO: 회의 수정 모달
    },
    onDeleteMeeting: () => {
      before();
      if (!meetingId) return;
      openModal({
        closeOnBackdrop: true,
        content: (
          <MeetingDeleteConfirmContent
            onConfirm={() => {
              deleteMeeting(
                { nodeId, meetingId },
                {
                  onSuccess: closeModal,
                  onError: (err) => showErrorToast(err, '회의 삭제에 실패했어요.'),
                },
              );
            }}
            onCancel={closeModal}
          />
        ),
      });
    },
    onCreateReference: () => {
      before();
      openModal({
        closeOnBackdrop: true,
        content: (
          <ReferenceNodeModalContent
            startNodeId={nodeId}
            referencedNodes={[]}
            nodeOptions={[]}
            onClose={closeModal}
          />
        ),
      });
    },
    onDelete: () => {
      before();
      openModal({
        closeOnBackdrop: true,
        content: (
          <NodeDeleteConfirmContent
            nodeName={nodeTitle}
            onConfirm={() => {
              deleteNode(nodeId, {
                onSuccess: closeModal,
                onError: (err) => showErrorToast(err, '노드 삭제에 실패했어요.'),
              });
            }}
            onClose={closeModal}
          />
        ),
      });
    },
  };
}
