/**
 * 날짜를 YYYY.MM.DD 형식으로 포맷팅
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

/**
 * 태그 목록에서 표시할 태그와 나머지 개수 반환
 */
export const getVisibleTags = <T>(tags: T[], maxVisible = 2) => {
  const visibleTags = tags.slice(0, maxVisible);
  const remainingTagsCount = Math.max(0, tags.length - maxVisible);
  return { visibleTags, remainingTagsCount };
};