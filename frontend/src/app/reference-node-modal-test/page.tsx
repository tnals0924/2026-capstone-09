'use client';

import { Button } from '@wanteddev/wds';
import { IconLink } from '@wanteddev/wds-icon';
import { useState } from 'react';

import { useModal } from '@/components/commons/modal/ModalContext';
import {
  ReferenceNodeModalContent,
  type CreateReferenceNodePathParams,
  type ReferenceNodeCreatePayload,
} from '@/components/projects/project-detail/reference-node';
import { EXAMPLE_REFERENCE_NODE_MODAL } from '@/constants/exampleConstant';

interface SubmittedReferenceNodeRequest {
  pathParams: CreateReferenceNodePathParams;
  body: ReferenceNodeCreatePayload;
}

export default function ReferenceNodeModalTestPage() {
  const { openModal, closeModal } = useModal();
  const [submittedRequest, setSubmittedRequest] = useState<SubmittedReferenceNodeRequest | null>(
    null,
  );
  const pathParams = { projectId: EXAMPLE_REFERENCE_NODE_MODAL.projectId };

  const handleCreate = (payload: ReferenceNodeCreatePayload) => {
    // TODO: privateApi.edge.createEdge(pathParams.projectId, payload)로 참조 노드 연결선 생성 API 연동
    setSubmittedRequest({ pathParams, body: payload });
  };

  const handleOpenModal = () => {
    openModal({
      variant: 'default',
      closeOnBackdrop: true,
      closeOnEsc: true,
      content: (
        <ReferenceNodeModalContent
          startNodeId={EXAMPLE_REFERENCE_NODE_MODAL.startNodeId}
          referencedNodes={EXAMPLE_REFERENCE_NODE_MODAL.referencedNodes}
          nodeOptions={EXAMPLE_REFERENCE_NODE_MODAL.nodeOptions}
          onClose={closeModal}
          onCreate={handleCreate}
        />
      ),
    });
  };

  return (
    <main className="bg-background-normal-alternative flex min-h-screen flex-col items-center justify-center gap-6 p-10">
      <Button
        variant="solid"
        color="primary"
        size="large"
        leadingContent={<IconLink />}
        onClick={handleOpenModal}
      >
        참조 노드 모달
      </Button>
      {submittedRequest && (
        <pre className="border-line-normal-neutral bg-background-normal-normal text-caption-1 text-label-neutral max-w-full overflow-auto rounded-xl border p-4 font-normal">
          {JSON.stringify(submittedRequest, null, 2)}
        </pre>
      )}
    </main>
  );
}
