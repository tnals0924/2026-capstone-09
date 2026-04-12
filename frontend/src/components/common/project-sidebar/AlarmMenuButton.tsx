import { IconBell } from '@wanteddev/wds-icon';
import { motion } from 'framer-motion';


interface AlarmMenuButtonProps {
  isCollapsed: boolean;
}

export const AlarmMenuButton = ({ isCollapsed }: AlarmMenuButtonProps) => {
  return (
    <button
      type="button"
      className={`flex h-14 w-full items-center overflow-hidden rounded-[6px] px-4 py-4 hover:bg-[#70737c0d] ${
        isCollapsed ? 'justify-start' : 'justify-between'
      }`}
    >
      <span className="flex items-center gap-2 text-[#17171985]">
        <IconBell className="h-[18px] w-[18px]" />
        <motion.span
          initial={false}
          animate={{ maxWidth: isCollapsed ? 0 : 64, opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: 0.16, ease: 'easeInOut' }}
          className="overflow-hidden whitespace-nowrap text-center text-title-3 font-normal text-[#17171985]"
        >
          수신함
        </motion.span>
      </span>
      {!isCollapsed && (
        <span className="rounded-[6px] bg-[#70737c14] px-[6px] py-[3px] text-headline-1 font-medium text-[#37383c9c]">
          +99
        </span>
      )}
    </button>
  );
};
