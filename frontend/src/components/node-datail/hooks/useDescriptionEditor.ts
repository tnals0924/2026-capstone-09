'use client';

import { useEffect, useRef } from 'react';
import { Collaboration } from '@tiptap/extension-collaboration';
import { Extension } from '@tiptap/core';
import { Placeholder } from '@tiptap/extensions';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { YJS_FIELDS, useYjsContext } from '@/contexts/YjsContext';

export function useDescriptionEditor(
  description: string | undefined,
  onSave: (value: string) => void,
) {
  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  const yjsCtx = useYjsContext();
  const fragment = yjsCtx?.ydoc.getXmlFragment(YJS_FIELDS.description) ?? null;

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({ undoRedo: false }),
        Placeholder.configure({ placeholder: '설명을 추가해 주세요' }),
        Extension.create({
          name: 'descriptionKeyboardShortcuts',
          addKeyboardShortcuts() {
            return {
              Enter: ({ editor: e }) => {
                e.view.dom.blur();
                return true;
              },
              Escape: ({ editor: e }) => {
                e.commands.blur();
                return true;
              },
            };
          },
        }),
        ...(fragment ? [Collaboration.configure({ fragment })] : []),
      ],
      content: fragment ? undefined : (description ?? ''),
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
        attributes: { class: 'prose focus:outline-none text-sm' },
      },
      immediatelyRender: false,
    },
    [fragment],
  );

  // fragment가 비어 있을 때만 API 데이터로 초기화
  useEffect(() => {
    if (!editor || !fragment || !description) return;
    if (fragment.length === 0) {
      editor.commands.setContent(description);
    }
  }, [editor, fragment, description]);

  return editor;
}
