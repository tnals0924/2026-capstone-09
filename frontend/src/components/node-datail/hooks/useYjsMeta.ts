'use client';

import { useEffect, useRef, useState } from 'react';

import { NodeStatusType } from '@/constants/nodeStatus';
import { YJS_FIELDS, useYjsContext } from '@/contexts/YjsContext';

export function useYjsMeta(initialStatus: NodeStatusType | undefined) {
  const yjsCtx = useYjsContext();
  const [status, setStatus] = useState<NodeStatusType | undefined>(undefined);
  const initializedRef = useRef(false);

  useEffect(() => {
    initializedRef.current = false;
    if (!yjsCtx) {
      setStatus(initialStatus);
      return;
    }

    const map = yjsCtx.ydoc.getMap<string>(YJS_FIELDS.meta);
    const observer = () => setStatus((map.get('status') as NodeStatusType) || undefined);
    map.observe(observer);
    return () => map.unobserve(observer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yjsCtx]);

  useEffect(() => {
    if (!yjsCtx || initialStatus === undefined || initializedRef.current) return;

    const { ydoc, provider } = yjsCtx;
    const map = ydoc.getMap<string>(YJS_FIELDS.meta);

    const doInit = () => {
      if (initializedRef.current) return;
      initializedRef.current = true;
      if (!map.get('status')) {
        map.set('status', initialStatus);
      } else {
        setStatus(map.get('status') as NodeStatusType);
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
  }, [yjsCtx, initialStatus]);

  const ySetStatus = (newStatus: NodeStatusType) => {
    if (!yjsCtx) {
      setStatus(newStatus);
      return;
    }
    yjsCtx.ydoc.getMap<string>(YJS_FIELDS.meta).set('status', newStatus);
  };

  return { status, ySetStatus };
}
