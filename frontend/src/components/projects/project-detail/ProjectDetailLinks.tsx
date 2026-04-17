import { IconPlus } from '@wanteddev/wds-icon';

import { ProjectDetailLinkItem } from '@/components/projects/project-detail/ProjectDetailLinkItem';
import { EXAMPLE_PROJECT_DETAIL_LINKS } from '@/constants/exampleConstant';

export const ProjectDetailLinks = () => {
  return (
    <section className="flex h-12 shrink-0 items-center justify-between border-b border-line-soft bg-static-white p-3">
      <div className="flex items-center gap-4">
        {EXAMPLE_PROJECT_DETAIL_LINKS.map(({ href, id, label }) => (
          <ProjectDetailLinkItem key={id} label={label} href={href} />
        ))}

        <button
          type="button"
          className="flex h-7 w-7 appearance-none items-center justify-center rounded-md border-none bg-transparent text-label-alternative transition-colors hover:bg-fill-normal hover:text-label-neutral"
          aria-label="링크 추가"
        >
          <IconPlus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};
