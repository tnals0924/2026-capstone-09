import Link from 'next/link';

export default function ProjectDetailPage() {
  return (
    <div className="flex h-full w-full flex-1 flex-col overflow-hidden">
      <section className="border---line---soft flex h-[56px] shrink-0 items-center justify-between border-b bg-white p-3" />
      <section className="border---line---soft flex h-[49px] shrink-0 items-center justify-between border-b bg-white p-3" />
      <section className="bg---surface---canvas flex flex-1 items-center justify-center gap-3 overflow-hidden px-20 py-[100px]">
        <Link
          href="/projects"
          className="rounded-md border border-[#70737c29] bg-white px-4 py-2 text-title-3 font-medium text-[#171719] hover:bg-[#70737c0d]"
        >
          뒤로가기
        </Link>
      </section>
    </div>
  );
}

