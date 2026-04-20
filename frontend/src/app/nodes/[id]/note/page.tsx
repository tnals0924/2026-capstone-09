export default async function NotesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="p-6">
      {/* 노트 에디터 공통 컴포넌트 슬롯 */}
      <div className="flex min-h-50 items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50">
        <span className="text-sm text-gray-400">노트 에디터 컴포넌트 영역</span>
      </div>
    </div>
  );
}
