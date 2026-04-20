export default async function MeetingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="p-6">
      {/* 회의 컨텐츠 공통 컴포넌트 슬롯 */}
      <div className="flex min-h-50 items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50">
        <span className="text-sm text-gray-400">회의 컨텐츠 컴포넌트 영역</span>
      </div>
    </div>
  );
}
