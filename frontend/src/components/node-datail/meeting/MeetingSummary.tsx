'use client';

import { IconSparkleFill } from '@wanteddev/wds-icon';

import { MermaidDiagram } from '@/components/commons/mermaid/MermaidDiagram';

interface MeetingSummaryProps {
  summary: string;
  mermaidCode?: string;
}

export function MeetingSummary({ summary, mermaidCode }: MeetingSummaryProps) {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <IconSparkleFill className="text-primary-40 h-4 w-4 shrink-0" />
          <span className="text-label-1 text-label-normal font-semibold">회의 요약</span>
        </div>
        <p className="border-primary-40 text-body-1-reading text-label-neutral border-l-2 pl-3 whitespace-pre-wrap">
          {summary}
        </p>
      </div>
      {mermaidCode && (
        <div className="flex flex-col gap-2 pb-20">
          <span className="text-label-1 text-label-normal font-semibold">회의 흐름</span>
          <div className="bg-background-normal-alternative border-label-disable overflow-x-auto rounded-xl border p-3">
            <MermaidDiagram code={mermaidCode} />
          </div>
        </div>
      )}
    </div>
  );
}
