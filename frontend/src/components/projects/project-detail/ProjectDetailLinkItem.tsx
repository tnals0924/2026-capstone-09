interface ProjectDetailLinkItemProps {
  label: string;
  href: string;
}

export const ProjectDetailLinkItem = ({ label, href }: ProjectDetailLinkItemProps) => {
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${href}&sz=64`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-fill-normal"
    >
      <img src={faviconUrl} alt={`${label} favicon`} className="h-5 w-5 shrink-0" />
      <span className="text-caption-1 font-semibold text-label-neutral">{label}</span>
    </a>
  );
};
