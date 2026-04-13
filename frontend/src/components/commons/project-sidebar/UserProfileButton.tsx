import { IconPersonFill } from '@wanteddev/wds-icon';

import { cn } from '@/utils/cn';

interface UserProfileButtonProps {
  isCollapsed: boolean;
  userName?: string;
  userEmail?: string;
  onClick?: () => void;
}

export const UserProfileButton = ({
  isCollapsed,
  userName,
  userEmail,
  onClick,
}: UserProfileButtonProps) => {
  const shouldShowUserInfo = !isCollapsed && Boolean(userName || userEmail);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center border-t border-line-normal-neutral py-7',
        isCollapsed ? 'justify-center px-0' : 'gap-2 px-1',
      )}
    >
      <div className="relative flex aspect-square h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cool-neutral-96 outline outline-1 outline-line-solid-normal outline-offset-[-1px]">
        <IconPersonFill className="h-6 w-6 text-static-white" aria-hidden="true" />
      </div>
      {shouldShowUserInfo && (
        <div className="flex flex-col gap-0">
          {userName && <div className="text-left text-heading-1 font-medium text-label-alternative">{userName}</div>}
          {userEmail && (
            <div className="text-left text-headline-1 font-normal text-label-alternative">{userEmail}</div>
          )}
        </div>
      )}
    </button>
  );
};
