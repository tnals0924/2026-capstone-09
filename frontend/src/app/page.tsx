import Link from 'next/link';

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-1 items-center justify-center">
      <Link
        href="/auth/login"
        className="rounded-md border border-[#70737c29] bg-white px-4 py-2 text-title-3 font-medium text-[#171719] hover:bg-[#70737c0d]"
      >
        로그인 페이지로 이동
      </Link>
    </main>
  );
}