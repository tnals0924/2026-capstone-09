'use client';

import { Toast, ToastContainer, ToastContent, ToastIcon } from '@wanteddev/wds';
import { useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import type { ToastPlacement } from './toast.types';
import { getOrCreateContainer } from './toastContainerMap';
import { toastStore } from './toastStore';
import type { ToastItem } from './toastStore';

// placement별로 컨테이너를 동적 생성 -> toastStore를 구독하면서 placement별로 그룹핑 후 각 컨테이너 DOM에 createPortal로 렌더링

const containerMap = new Map<ToastPlacement, HTMLDivElement>();

function cleanupUnusedContainers(usedPlacements: Set<ToastPlacement>) {
  containerMap.forEach((el, placement) => {
    if (!usedPlacements.has(placement)) {
      document.body.removeChild(el);
      containerMap.delete(placement);
    }
  });
}

export function ToastRenderer() {
  const toasts = useSyncExternalStore<ToastItem[]>(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getServerSnapshot,
  );

  useEffect(() => {
    const usedPlacements = new Set(toasts.map((t) => t.placement));
    cleanupUnusedContainers(usedPlacements);
  }, [toasts]);

  useEffect(() => {
    return () => {
      containerMap.forEach((el) => document.body.removeChild(el));
      containerMap.clear();
    };
  }, []);

  if (typeof window === 'undefined') return null;

  const grouped = toasts.reduce<Map<ToastPlacement, ToastItem[]>>((acc, toast) => {
    const list = acc.get(toast.placement) ?? [];
    acc.set(toast.placement, [...list, toast]);
    return acc;
  }, new Map());

  return (
    <>
      {Array.from(grouped.entries()).map(([placement, items]) => {
        const container = getOrCreateContainer(placement);

        return createPortal(
          items.map((t) => (
            <Toast
              key={t.id}
              open
              variant={t.variant}
              duration={t.duration}
              onOpenChange={(open) => {
                if (!open) toastStore.remove(t.id);
              }}
              onAnimationEnd={t.onAnimationEnd}
              disablePortal
            >
              <ToastContainer>
                {t.icon !== undefined ? (
                  <ToastIcon>{t.icon}</ToastIcon>
                ) : (
                  t.variant !== 'normal' && <ToastIcon />
                )}
                <ToastContent>{t.content}</ToastContent>
              </ToastContainer>
            </Toast>
          )),
          container,
        );
      })}
    </>
  );
}
