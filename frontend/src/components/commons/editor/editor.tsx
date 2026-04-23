'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';

export default function Editor() {
  const editor = useEditor({
    extensions: [StarterKit, Markdown],
    content:
      '### 초기 전략-개발 통합 검토\n비즈니스 모델 수립 시 기술 및 비용 검토를 병행하여 개발 지연 및 비용 문제를 최소화.\n\n### MVP 기능별 비용 예측 시스템 도입\nMVP 기능 정의 단계부터 운영 비용을 예측하고 지속 관리하여 예상치 못한 비용 발생 방지.\n\n### 발표 자료 실시간 현행화\n개발 상황 변화(기능 축소 등)를 PT에 즉시 반영, 현실적인 발표 내용으로 신뢰도 확보.',
    editorProps: {
      attributes: {
        class: 'prose focus:outline-none m-5',
      },
    },
    immediatelyRender: false,
  });

  return (
    <div className="prose [&_.ProseMirror]:leading-[1.4] [&_.ProseMirror_p]:my-0">
      <EditorContent editor={editor} />
    </div>
  );
}
