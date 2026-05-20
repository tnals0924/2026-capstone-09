'use client';

import { useState, useEffect } from 'react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  isStreaming?: boolean;
}

// 타이핑 효과 전용 컴포넌트
function StreamingText({ content, isStreaming }: { content: string; isStreaming: boolean }) {
  const [displayedContent, setDisplayedContent] = useState(isStreaming ? '' : content);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 타이핑 애니메이션
  useEffect(() => {
    if (isStreaming && currentIndex < content.length) {
      const timeout = setTimeout(() => {
        setDisplayedContent(content.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 20);

      return () => clearTimeout(timeout);
    }
  }, [content, currentIndex, isStreaming]);

  return (
    <>
      {displayedContent}
      {isStreaming && currentIndex < content.length && (
        <span className="inline-block w-1 h-4 ml-1 bg-label-normal animate-pulse" />
      )}
    </>
  );
}

export function ChatMessage({ role, content, isStreaming = false }: ChatMessageProps) {
  const isUser = role === 'user';

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
            <StreamingText key={content} content={content} isStreaming={isStreaming} />
          </p>
        </div>
      )}
    </div>
  );
}