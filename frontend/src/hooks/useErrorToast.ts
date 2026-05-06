'use client';

import { usePositionedToast } from '@/components/commons/custom-toast/usePositionedToast';

export function useErrorToast() {
  const toast = usePositionedToast();

  return (err: unknown, fallback: string) => {
    const message = (err as { error?: { message?: string } })?.error?.message ?? fallback;
    toast({ content: message, variant: 'negative', placement: 'top-center' });
  };
}
