import { IconSetting } from '@wanteddev/wds-icon';
import { motion } from 'framer-motion';


interface ProjectSettingMenuButtonProps {
  isCollapsed: boolean;
}

export const ProjectSettingMenuButton = ({ isCollapsed }: ProjectSettingMenuButtonProps) => {
  return (
    <button
      type="button"
      className={`flex h-14 w-full items-center overflow-hidden rounded-[6px] px-4 py-4 hover:bg-[#70737c0d] ${
        isCollapsed ? 'justify-start' : 'justify-between'
      }`}
    >
      <span className="flex items-center gap-2 text-[#17171985]">
        <IconSetting className="h-[18px] w-[18px]" />
        <motion.span
          initial={false}
          animate={{ maxWidth: isCollapsed ? 0 : 48, opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: 0.16, ease: 'easeInOut' }}
          className="overflow-hidden whitespace-nowrap text-center text-title-3 font-normal text-[#17171985]"
        >
          설정
        </motion.span>
      </span>
    </button>
  );
};
