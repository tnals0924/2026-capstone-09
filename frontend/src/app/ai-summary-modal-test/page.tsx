'use client';

import { Button } from '@wanteddev/wds';

import { useModal } from '@/components/commons/modal/ModalContext';
import { MultiNodeSummaryModalContent } from '@/components/projects/project-detail/multi-node-summary/MultiNodeSummaryModalContent';
import { useMultiNodeSummaryRequest } from '@/components/projects/project-detail/multi-node-summary/useMultiNodeSummaryRequest';
import {
  EXAMPLE_MULTI_NODE_SUMMARY_NODES,
  EXAMPLE_MULTI_NODE_SUMMARY_RESULT,
} from '@/constants/exampleConstant';
import { useErrorToast } from '@/hooks/useErrorToast';

export default function AiSummaryModalTestPage() {
  const { openModal, closeModal } = useModal();
  const showErrorToast = useErrorToast();
  const { handleSubmit } = useMultiNodeSummaryRequest({
    nodes: EXAMPLE_MULTI_NODE_SUMMARY_NODES,
  });

  const handleOpenClick = async () => {
    try {
      await handleSubmit();
      openModal({
        variant: 'default',
        closeOnBackdrop: true,
        closeOnEsc: true,
        content: (
          <MultiNodeSummaryModalContent
            nodes={EXAMPLE_MULTI_NODE_SUMMARY_NODES}
            result={EXAMPLE_MULTI_NODE_SUMMARY_RESULT}
            onClose={closeModal}
          />
        ),
      });
    } catch (err) {
      showErrorToast(err, 'AI 요약 생성에 실패했어요.');
    }
  };

  return (
    <main className="bg-background-normal-normal flex min-h-screen items-center justify-center p-10">
      <section className="flex w-full max-w-160 flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-heading-1 text-label-normal font-medium">
            AI 다중 노드 요약 모달 테스트
          </h1>
        </div>

        <div>
          <Button variant="solid" color="primary" size="medium" onClick={handleOpenClick}>
            AI 요약 모달 열기
          </Button>
        </div>
      </section>
    </main>
  );
}
