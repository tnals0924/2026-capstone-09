'use client';

import { useEffect, useRef, useState } from 'react';

import { TagItem } from '@/api/Api';
import { YJS_FIELDS, useYjsContext } from '@/contexts/YjsContext';

export function useYjsTags(initialTags: TagItem[] | undefined) {
  const yjsCtx = useYjsContext();
  const [tags, setTags] = useState<TagItem[]>([]);
  const initializedRef = useRef(false);

  // Yjs 배열 변경 구독; yjsCtx 교체 시(노드 변경) 초기화 플래그 리셋
  useEffect(() => {
    initializedRef.current = false;
    if (!yjsCtx) {
      setTags(initialTags ?? []);
      return;
    }

    const arr = yjsCtx.ydoc.getArray<TagItem>(YJS_FIELDS.tags);
    const observer = () => setTags(dedupeByTagId(arr.toArray()));
    arr.observe(observer);
    return () => arr.unobserve(observer);
    // initialTags는 의존성 제외 — 초기화 전용 effect에서만 사용
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yjsCtx]);

  // yjsCtx와 initialTags가 모두 준비된 후 최초 1회 초기화
  useEffect(() => {
    if (!yjsCtx || initialTags === undefined || initializedRef.current) return;

    const { ydoc, provider } = yjsCtx;
    const arr = ydoc.getArray<TagItem>(YJS_FIELDS.tags);

    const doInit = () => {
      if (initializedRef.current) return;
      initializedRef.current = true;
      if (arr.length === 0 && initialTags.length > 0) {
        ydoc.transact(() => arr.insert(0, initialTags));
      } else {
        setTags(dedupeByTagId(arr.toArray()));
      }
    };

    if (provider.synced) {
      doInit();
      return;
    }

    const handleSync = (synced: boolean) => {
      if (synced) doInit();
    };
    provider.on('sync', handleSync);
    return () => provider.off('sync', handleSync);
  }, [yjsCtx, initialTags]);

  const yAddTag = (tag: TagItem) => {
    if (!yjsCtx) {
      setTags((prev) => [...prev, tag]);
      return;
    }
    yjsCtx.ydoc.getArray<TagItem>(YJS_FIELDS.tags).push([tag]);
  };

  const yRemoveTag = (tagId: number) => {
    if (!yjsCtx) {
      setTags((prev) => prev.filter((t) => t.tagId !== tagId));
      return;
    }
    const arr = yjsCtx.ydoc.getArray<TagItem>(YJS_FIELDS.tags);
    const idx = arr.toArray().findIndex((t) => t.tagId === tagId);
    if (idx !== -1) arr.delete(idx, 1);
  };

  return { tags, yAddTag, yRemoveTag };
}

function dedupeByTagId(items: TagItem[]): TagItem[] {
  const seen = new Set<number>();
  return items.filter((item) => {
    if (!item.tagId || seen.has(item.tagId)) return false;
    seen.add(item.tagId);
    return true;
  });
}
