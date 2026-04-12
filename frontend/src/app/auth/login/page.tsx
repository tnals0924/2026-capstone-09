import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-1 items-center justify-center px-8">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="rounded-md border border-[#70737c29] bg-white px-4 py-2 text-title-3 font-medium text-[#171719] hover:bg-[#70737c0d]"
        >
          뒤로가기
        </Link>
        <Link
          href="/projects"
          className="rounded-md border border-[#70737c29] bg-white px-4 py-2 text-title-3 font-medium text-[#171719] hover:bg-[#70737c0d]"
        >
          프로젝트 선택으로 이동
        </Link>
      </div>
    </main>
  );
}

