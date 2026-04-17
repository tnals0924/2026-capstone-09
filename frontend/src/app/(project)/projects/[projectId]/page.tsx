'use client';

import Link from 'next/link';

import { useProjectDetailLayout, type ProjectViewTypes } from '@/app/(project)/projects/[projectId]/layout';

const VIEW_LABELS: Record<ProjectViewTypes, string> = {
  'node-flow': '노드 플로우',
  list: '리스트',
  kanban: '칸반',
};

export default function ProjectDetailPage() {
  const { activeView } = useProjectDetailLayout();

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-3 overflow-hidden bg-surface-canvas px-20 py-24">
      <p className="text-body-1 font-medium text-label-neutral">{VIEW_LABELS[activeView]}</p>
      <Link
        href="/projects"
        className="rounded-md border border-line-normal-neutral bg-static-white px-4 py-2 text-title-3 font-medium text-label-normal hover:bg-fill-alternative"
      >
        뒤로가기
      </Link>
    </section>
  );
}
