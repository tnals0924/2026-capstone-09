'use client';

import { cn } from '@/utils/cn';

interface EdgeDeleteConfirmContentProps {
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * 참조 연결(점선) 삭제 컨펌 모달 콘텐츠.
 *
 * - 삭제 API 호출은 부모에게 위임한다.
 */
export const EdgeDeleteConfirmContent = ({
  onConfirm,
  onClose,
}: EdgeDeleteConfirmContentProps) => (
  <div className="flex w-full flex-col gap-4 pb-2">
    <h3 className="text-heading-2 text-label-normal font-medium">참조 연결을 삭제하시겠어요?</h3>
    <p className="text-body-2 text-label-alternative">
      참조 연결을 삭제하면 복구할 수 없어요.
    </p>
    <div className="flex items-center justify-end gap-6 pt-2">
      <button
        type="button"
        onClick={onClose}
        className="text-body-1 text-label-alternative hover:bg-fill-normal active:bg-fill-strong focus-visible:ring-primary-40 rounded-md bg-transparent px-2 py-1 font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        취소
      </button>
      <button
        type="button"
        onClick={onConfirm}
        className={cn(
          'text-body-1 rounded-md px-2 py-1 font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2',
          'focus-visible:ring-primary-40',
          'text-status-negative hover:bg-fill-normal active:bg-fill-strong bg-transparent',
        )}
      >
        삭제
      </button>
    </div>
  </div>
);

EdgeDeleteConfirmContent.displayName = 'EdgeDeleteConfirmContent';
