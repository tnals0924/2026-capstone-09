import { motion } from 'framer-motion';
import type { ComponentType, SVGProps } from 'react';

import { cn } from '@/utils/cn';

interface SidebarMenuButtonProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  isCollapsed: boolean;
  label: string;
  labelWidth: string;
  labelTransitionDuration: number;
  badgeText?: string;
  onClick?: () => void;
}

export const SidebarMenuButton = ({
  icon: Icon,
  isCollapsed,
  label,
  labelWidth,
  labelTransitionDuration,
  badgeText,
  onClick,
}: SidebarMenuButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-14 w-full items-center justify-start overflow-hidden rounded-md px-4 py-4 hover:bg-fill-alternative',
        isCollapsed && 'justify-center px-0',
      )}
    >
      <span className={cn('flex items-center gap-2 text-label-alternative', isCollapsed && 'gap-0')}>
        <Icon className="h-7 w-7" aria-hidden="true" />
        <motion.span
          initial={false}
          animate={{ maxWidth: isCollapsed ? 0 : labelWidth, opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: labelTransitionDuration, ease: 'easeInOut' }}
          className="overflow-hidden whitespace-nowrap text-center text-title-3 font-normal text-label-alternative"
        >
          {label}
        </motion.span>
      </span>
      {!isCollapsed && badgeText && (
        <span className="ml-auto rounded-md bg-fill-normal px-1.5 py-0.5 text-headline-1 font-medium text-label-alternative">
          {badgeText}
        </span>
      )}
    </button>
  );
};
