import { IconCheck, IconDot, IconMoreHorizontal } from '@wanteddev/wds-icon';

export type NodeStatusType = 'WAITING' | 'IN_PROGRESS' | 'DONE';

export const NODE_STATUS_INFO: Record<
  NodeStatusType,
  { label: string; color: string; icon: React.ReactNode }
> = {
  WAITING: {
    label: '진행 전',
    color: 'semantic.label.strong',
    icon: <IconMoreHorizontal />,
  },
  IN_PROGRESS: {
    label: '진행 중',
    color: 'semantic.accent.foreground.redOrange',
    icon: <IconDot />,
  },
  DONE: {
    label: '완료',
    color: 'semantic.accent.foreground.green',
    icon: <IconCheck />,
  },
} as const;
