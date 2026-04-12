'use client';

import {
  IconChevronDoubleLeft,
  IconCompany,
  IconLeftSide,
} from '@wanteddev/wds-icon';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { PROJECT_SIDEBAR_LAYOUT } from '@/constants/exampleConstant';

import { AlarmMenuButton } from './AlarmMenuButton';
import { ProjectSettingMenuButton } from './ProjectSettingMenuButton';
import { SearchMenuButton } from './SearchMenuButton';
import { UserProfileButton } from './UserProfileButton';

interface ProjectSidebarProps {
  projectName?: string;
  userName?: string;
  userEmail?: string;
}

export const ProjectSidebar = ({ projectName, userName, userEmail }: ProjectSidebarProps) => {
  const [isCollapsedInternal, setIsCollapsedInternal] = useState(false);
  const isCollapsed = isCollapsedInternal;
  const [isCollapseSettled, setIsCollapseSettled] = useState(true);
  const shouldUseCollapsedLayout = isCollapsed && isCollapseSettled;

  useEffect(() => {
    if (isCollapsed) {
      setIsCollapseSettled(false);
      return;
    }

    setIsCollapseSettled(true);
  }, [isCollapsed]);

  const handleToggleCollapsed = () => {
    setIsCollapsedInternal((prev) => !prev);
  };

  return (
    <motion.aside
      className="h-screen shrink-0 overflow-hidden border-r border-[#70737c29] bg-[#f7f7f8] px-4 py-2"
      initial={false}
      animate={{ width: isCollapsed ? 56 : 220 }}
      transition={{ duration: PROJECT_SIDEBAR_LAYOUT.transitionDuration, ease: 'easeInOut' }}
      onAnimationComplete={() => {
        if (isCollapsed) {
          setIsCollapseSettled(true);
        }
      }}
    >
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-4">
          <div
            className={`border-b border-[#70737c29] ${
              shouldUseCollapsedLayout
                ? 'flex flex-col items-center justify-center gap-3 pt-5 pb-2'
                : 'flex items-center justify-between py-5 pl-2'
            }`}
          >
            <div className={`flex items-center ${shouldUseCollapsedLayout ? 'w-full justify-center gap-0' : 'gap-3'}`}>
              <div className="relative flex items-center justify-center">
                <div className="relative flex aspect-square h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[6px] bg-[#E8E9EA] outline outline-1 outline-[#DEE0E1] outline-offset-[-1px]">
                  <IconCompany className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
              </div>
              {projectName && (
                <motion.div
                  initial={false}
                  animate={{
                    maxWidth: isCollapsed ? 0 : 128,
                    opacity: isCollapsed ? 0 : 1,
                  }}
                  transition={{ duration: 0.16, ease: 'easeInOut' }}
                  className="overflow-hidden whitespace-nowrap text-center text-title-3 font-medium text-[#686868]"
                >
                  {projectName}
                </motion.div>
              )}
            </div>

            {!isCollapsed && (
              <button
                type="button"
                onClick={handleToggleCollapsed}
                className="grid h-[18px] w-[18px] place-items-center text-[#17171985] hover:text-[#171719b8]"
                aria-label="사이드바 접기"
              >
                <IconLeftSide
                  className="h-[18px] w-[18px] transition-transform rotate-0"
                  aria-hidden="true"
                />
              </button>
            )}
            {shouldUseCollapsedLayout && (
              <button
                type="button"
                onClick={handleToggleCollapsed}
                className="flex h-14 w-full items-center justify-center overflow-hidden rounded-[6px] px-4 py-4 text-[#17171985] hover:bg-[#70737c0d]"
                aria-label="사이드바 펼치기"
              >
                <IconChevronDoubleLeft
                  className="h-[18px] w-[18px] rotate-180"
                  aria-hidden="true"
                />
              </button>
            )}
          </div>

          <nav className={`flex flex-col gap-2 ${isCollapsed ? 'items-start' : ''}`}>
            <SearchMenuButton isCollapsed={isCollapsed} />
            <AlarmMenuButton isCollapsed={isCollapsed} />
            <ProjectSettingMenuButton isCollapsed={isCollapsed} />
          </nav>
        </div>

        <div className="w-full bg-[#F6F6F6]">
          <UserProfileButton isCollapsed={isCollapsed} userName={userName} userEmail={userEmail} />
        </div>
      </div>
    </motion.aside>
  );
};
