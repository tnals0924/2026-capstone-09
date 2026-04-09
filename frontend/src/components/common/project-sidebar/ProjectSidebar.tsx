'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';

import IcAlarm from '@/components/common/icons/IcAlarm';
import IcAvatar from '@/components/common/icons/IcAvatar';
import IcProject from '@/components/common/icons/IcProject';
import IcSearch from '@/components/common/icons/IcSearch';
import IcSidebar from '@/components/common/icons/IcSidebar';
import IcSetting from '@/components/common/icons/IcSetting';
import { cn } from '@/utils/cn';

interface ProjectSidebarProps {
  projectName?: string;
  userName?: string;
  userEmail?: string;
}

const DEFAULT_PROJECT_NAME = '플로밋 기획';
const DEFAULT_USER_NAME = '황수민';
const DEFAULT_USER_EMAIL = 'tnals655@naver.com';

const CollapseIcon = ({ className, isCollapsed }: { className?: string; isCollapsed: boolean }) => {
  return (
    <IcSidebar
      className={cn('transition-transform', isCollapsed ? 'rotate-180' : 'rotate-0', className)}
      aria-hidden="true"
    />
  );
};

export const ProjectSidebar = ({
  projectName = DEFAULT_PROJECT_NAME,
  userName = DEFAULT_USER_NAME,
  userEmail = DEFAULT_USER_EMAIL,
}: ProjectSidebarProps) => {
  const pathname = usePathname();
  const [isCollapsedInternal, setIsCollapsedInternal] = useState(false);

  const sidebarMode = useMemo(() => {
    if (pathname === '/projects') return 'projectSelect';
    if (pathname?.startsWith('/projects/')) return 'projectDetail';
    return 'projectDetail';
  }, [pathname]);

  const shouldShowProjectMenus = sidebarMode === 'projectDetail';
  const isCollapsible = sidebarMode !== 'projectSelect';
  const isHoverExpandable = sidebarMode === 'projectDetail';
  const isCollapsed = isCollapsible ? isCollapsedInternal : true;

  const handleToggleCollapsed = () => {
    if (!isCollapsible) return;
    setIsCollapsedInternal((prev) => !prev);
  };

  const handleSidebarMouseEnter = () => {
    if (!isHoverExpandable) return;
    if (!isCollapsedInternal) return;
    setIsCollapsedInternal(false);
  };

  return (
    <aside
      className={cn(
        'h-screen shrink-0 border-r border-[rgba(112,115,124,0.16)] bg-[rgba(247,247,248,1)] px-4 py-2',
        isCollapsed ? 'w-[56px]' : 'w-[220px]',
      )}
      onMouseEnter={handleSidebarMouseEnter}
    >
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[rgba(112,115,124,0.16)] py-3">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center">
                <div className="relative flex aspect-square h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-[6px] bg-[#E8E9EA] outline outline-1 outline-[#DEE0E1] outline-offset-[-1px]">
                  <IcProject className="h-4 w-4 text-white" aria-hidden="true" />
                </div>
              </div>
              {!isCollapsed && (
                <div className="text-center text-[15px] font-medium leading-[22.01px] tracking-[0.14px] text-[#686868]">
                  {projectName}
                </div>
              )}
            </div>

            {isCollapsible && !isCollapsed && (
              <button
                type="button"
                onClick={handleToggleCollapsed}
                className={cn(
                  'grid h-[18px] w-[18px] place-items-center text-[rgba(23,23,25,0.52)] hover:text-[rgba(23,23,25,0.72)]',
                  isCollapsed && 'translate-x-[2px]',
                )}
                aria-label={isCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
              >
                <CollapseIcon isCollapsed={isCollapsed} className="h-[18px] w-[18px]" />
              </button>
            )}
          </div>

          {shouldShowProjectMenus && (
            <nav className={cn('flex flex-col gap-2', isCollapsed ? 'items-start' : '')}>
              <SidebarItem
                href="#"
                icon={<IcSearch className="h-[18px] w-[18px]" />}
                label="검색"
                isCollapsed={isCollapsed}
              />

              <SidebarItem
                href="#"
                icon={<IcAlarm className="h-[18px] w-[18px]" />}
                label="알림"
                isCollapsed={isCollapsed}
                trailing={
                  !isCollapsed ? (
                    <span className="rounded-[6px] bg-[rgba(112,115,124,0.08)] px-[6px] py-[3px] text-[11px] font-medium leading-[14px] tracking-[0.34px] text-[rgba(55,56,60,0.61)]">
                      +99
                    </span>
                  ) : null
                }
              />

              <SidebarItem
                href="#"
                icon={<IcSetting className="h-[18px] w-[18px]" />}
                label="프로젝트 설정"
                isCollapsed={isCollapsed}
              />
            </nav>
          )}
        </div>

        <div className="w-full bg-[#F6F6F6]">
          <div
            className={cn(
              'flex w-full items-center border-t border-[rgba(112,115,124,0.16)] py-3',
              isCollapsed ? 'justify-center px-0' : 'gap-2 px-1',
            )}
          >
            <div className="relative flex aspect-square h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E8E9EA] outline outline-1 outline-[#DEE0E1] outline-offset-[-1px]">
              <IcAvatar className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col gap-0">
                <div className="text-left text-[13px] font-medium leading-[18px] tracking-[0.25px] text-[#7E7E7E]">
                  {userName}
                </div>
                <div className="text-left text-[11px] font-normal leading-[14px] tracking-[0.34px] text-[#7E7E7E]">
                  {userEmail}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

const SidebarItem = ({
  href,
  icon,
  label,
  isCollapsed,
  trailing,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  trailing?: React.ReactNode;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        'flex h-8 w-full items-center overflow-hidden rounded-[6px] p-1 hover:bg-[rgba(112,115,124,0.05)]',
        isCollapsed ? 'justify-start' : 'justify-between',
      )}
    >
      <span className="flex items-center gap-2 text-[rgba(23,23,25,0.52)]">
        {icon}
        {!isCollapsed && (
          <span className="text-center text-[15px] font-normal leading-6 tracking-[0.14px] text-[rgba(23,23,25,0.52)]">
            {label}
          </span>
        )}
      </span>
      {trailing}
    </Link>
  );
};

