'use client';

import { useEffect, useRef, useState } from 'react';

import { AssigneeItem } from '@/api/Api';
import { YJS_FIELDS, useYjsContext } from '@/contexts/YjsContext';

export function useYjsAssignees(initialAssignees: AssigneeItem[] | undefined) {
  const yjsCtx = useYjsContext();
  const [assignees, setAssignees] = useState<AssigneeItem[]>([]);
  const initializedRef = useRef(false);

  useEffect(() => {
    initializedRef.current = false;
    if (!yjsCtx) {
      setAssignees(initialAssignees ?? []);
      return;
    }

    const arr = yjsCtx.ydoc.getArray<AssigneeItem>(YJS_FIELDS.assignees);
    const observer = () => setAssignees(dedupeByUserId(arr.toArray()));
    arr.observe(observer);
    return () => arr.unobserve(observer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yjsCtx]);

  useEffect(() => {
    if (!yjsCtx || initialAssignees === undefined || initializedRef.current) return;

    const { ydoc, provider } = yjsCtx;
    const arr = ydoc.getArray<AssigneeItem>(YJS_FIELDS.assignees);

    const doInit = () => {
      if (initializedRef.current) return;
      initializedRef.current = true;
      if (arr.length === 0 && initialAssignees.length > 0) {
        ydoc.transact(() => arr.insert(0, initialAssignees));
      } else {
        setAssignees(dedupeByUserId(arr.toArray()));
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
  }, [yjsCtx, initialAssignees]);

  const yAddAssignee = (assignee: AssigneeItem) => {
    if (!yjsCtx) {
      setAssignees((prev) => [...prev, assignee]);
      return;
    }
    yjsCtx.ydoc.getArray<AssigneeItem>(YJS_FIELDS.assignees).push([assignee]);
  };

  const yRemoveAssignee = (userId: number) => {
    if (!yjsCtx) {
      setAssignees((prev) => prev.filter((a) => a.userId !== userId));
      return;
    }
    const arr = yjsCtx.ydoc.getArray<AssigneeItem>(YJS_FIELDS.assignees);
    const idx = arr.toArray().findIndex((a) => a.userId === userId);
    if (idx !== -1) arr.delete(idx, 1);
  };

  return { assignees, yAddAssignee, yRemoveAssignee };
}

function dedupeByUserId(items: AssigneeItem[]): AssigneeItem[] {
  const seen = new Set<number>();
  return items.filter((item) => {
    if (!item.userId || seen.has(item.userId)) return false;
    seen.add(item.userId);
    return true;
  });
}
