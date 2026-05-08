'use client';

import { useEffect, useRef } from 'react';
import { Collaboration } from '@tiptap/extension-collaboration';
import { Extension } from '@tiptap/core';
import { Placeholder } from '@tiptap/extensions';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { YJS_FIELDS, useYjsContext } from '@/contexts/YjsContext';

export function useTitleEditor(title: string | undefined, onSave: (value: string) => void) {
  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  const yjsCtx = useYjsContext();
  // nodeId가 바뀌면 ydoc이 교체되므로 fragment도 새 객체가 됨 → useEditor 재생성 트리거
  const fragment = yjsCtx?.ydoc.getXmlFragment(YJS_FIELDS.title) ?? null;

  const editor = useEditor(
    {
      extensions: [
        // Collaboration이 활성화되면 undo/redo를 직접 관리하므로 StarterKit undoRedo 비활성화
        StarterKit.configure({ undoRedo: false }),
        Placeholder.configure({ placeholder: '제목을 입력하세요.' }),
        Extension.create({
          name: 'titleKeyboardShortcuts',
          addKeyboardShortcuts() {
            return {
              Enter: ({ editor: e }) => {
                e.view.dom.blur();
                return true;
              },
              // 협업 편집 중 Escape는 단순 포커스 해제 (되돌리기는 Ctrl+Z 사용)
              Escape: ({ editor: e }) => {
                e.view.dom.blur();
                return true;
              },
            };
          },
        }),
        ...(fragment ? [Collaboration.configure({ fragment })] : []),
      ],
      // Collaboration 활성 시 content는 무시됨 — 빈 fragment 초기화는 useEffect에서 처리
      content: fragment ? undefined : (title ?? '새 노드'),
      onBlur({ editor: e }) {
        onSaveRef.current(e.getText());
      },
      editorProps: {
        handlePaste(view, event) {
          const text = event.clipboardData?.getData('text/plain');
          if (text) {
            event.preventDefault();
            view.dispatch(view.state.tr.insertText(text.replace(/\n/g, ' ')));
            return true;
          }
          return false;
        },
        attributes: { class: 'prose focus:outline-none text-2xl font-medium' },
      },
      immediatelyRender: false,
    },
    [fragment],
  );

  // fragment가 비어 있을 때만 API 데이터로 초기화
  useEffect(() => {
    if (!editor || !fragment || !title) return;
    if (fragment.length === 0) {
      editor.commands.setContent(title);
    }
  }, [editor, fragment, title]);

  return editor;
}
