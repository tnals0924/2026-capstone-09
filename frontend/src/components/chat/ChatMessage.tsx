'use client';

import { useState, useEffect, useRef } from 'react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  isStreaming?: boolean;
}

export function ChatMessage({ role, content, isStreaming = false }: ChatMessageProps) {
  const isUser = role === 'user';
  const [displayedContent, setDisplayedContent] = useState(isUser ? content : '');
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevContentRef = useRef(content);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!isUser && prevContentRef.current !== content) {
      prevContentRef.current = content;
      if (isStreaming) {
        setDisplayedContent('');
        setCurrentIndex(0);
      } else {
        setDisplayedContent(content);
      }
    }
  }, [content, isUser, isStreaming]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // AI 메시지 타이핑 애니메이션
  useEffect(() => {
    if (!isUser && isStreaming && currentIndex < content.length) {
      const timeout = setTimeout(() => {
        setDisplayedContent(content.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 20); // 20ms 간격으로 한 글자씩 표시

      return () => clearTimeout(timeout);
    }
  }, [content, currentIndex, isUser, isStreaming]);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {isUser ? (
        <div className="max-w-[80%]">
          <div className="px-4 py-2 rounded-2xl bg-fill-alternative text-label-normal rounded-tr-sm">
            <p className="text-body-2 whitespace-pre-wrap break-words">{content}</p>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <p className="text-body-2 text-label-normal whitespace-pre-wrap break-words">
            {displayedContent}
            {isStreaming && currentIndex < content.length && (
              <span className="inline-block w-1 h-4 ml-1 bg-label-normal animate-pulse" />
            )}
          </p>
        </div>
      )}
    </div>
  );
}