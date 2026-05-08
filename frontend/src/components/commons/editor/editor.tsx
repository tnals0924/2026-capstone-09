'use client';

import { useEffect, useRef } from 'react';
import { Collaboration, isChangeOrigin } from '@tiptap/extension-collaboration';
import { Placeholder } from '@tiptap/extensions';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown, type MarkdownStorage } from 'tiptap-markdown';
import type { XmlFragment } from 'yjs';

const SAVE_DEBOUNCE_MS = 1000;

interface EditorProps {
  content: string | undefined;
  /** Yjs XmlFragment — 전달 시 협업 편집 활성화 */
  fragment?: XmlFragment | null;
  /** 로컬 변경 발생 후 디바운스 저장 콜백 */
  onUpdate?: (markdown: string) => void;
}

export default function Editor({ content, fragment, onUpdate }: EditorProps) {
  const onUpdateRef = useRef(onUpdate);
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({ undoRedo: false }),
        Markdown,
        Placeholder.configure({ placeholder: '내용을 입력하세요.' }),
        ...(fragment ? [Collaboration.configure({ fragment })] : []),
      ],
      content: fragment ? undefined : (content ?? ''),
      onUpdate({ editor: e, transaction }) {
        // 원격 Yjs 업데이트는 저장 생략 — 변경한 본인만 REST API에 저장
        if (isChangeOrigin(transaction)) return;

        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
          const mdStorage = (e.storage as unknown as Record<string, unknown>).markdown as MarkdownStorage;
          onUpdateRef.current?.(mdStorage.getMarkdown());
        }, SAVE_DEBOUNCE_MS);
      },
      editorProps: {
        attributes: { class: 'prose focus:outline-none m-5 pb-40' },
      },
      immediatelyRender: false,
    },
    [fragment],
  );

  // fragment가 비어 있을 때만 API 데이터로 초기화
  useEffect(() => {
    if (!editor || !fragment || !content) return;
    if (fragment.length === 0) {
      editor.commands.setContent(content);
    }
  }, [editor, fragment, content]);

  // 언마운트 시 대기 중인 타이머 정리
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  return (
    <div className="prose [&_.ProseMirror]:leading-[1.4] [&_.ProseMirror_p]:my-0">
      <EditorContent editor={editor} />
    </div>
  );
}
