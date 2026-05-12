import { IconPersonFill } from '@wanteddev/wds-icon';

import { cn } from '@/utils/cn';

interface UserProfileButtonProps {
  isCollapsed: boolean;
  userName?: string;
  userEmail?: string;
  profileImageUrl?: string;
  onClick?: () => void;
}

export const UserProfileButton = ({
  isCollapsed,
  userName,
  userEmail,
  profileImageUrl,
  onClick,
}: UserProfileButtonProps) => {
  const shouldShowUserInfo = !isCollapsed && Boolean(userName || userEmail);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'border-line-normal-neutral flex w-full appearance-none items-center border-x-0 border-t border-b-0 bg-transparent py-4 leading-normal',
        isCollapsed ? 'justify-center px-0 py-5' : 'gap-2 px-1 py-5',
      )}
    >
      <div className="border-line-solid-normal bg-cool-neutral-96 relative flex aspect-square h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full border">
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt={userName ?? '프로필'}
            className="h-full w-full object-cover"
          />
        ) : (
          <IconPersonFill className="text-static-white h-4 w-4" aria-hidden="true" />
        )}
      </div>
      {shouldShowUserInfo && (
        <div className="flex flex-col gap-0">
          {userName && (
            <div className="text-caption-2 text-label-alternative text-left font-normal">
              {userName}
            </div>
          )}
          {userEmail && (
            <div className="text-caption-1 text-label-alternative text-left font-normal">
              {userEmail}
            </div>
          )}
        </div>
      )}
    </button>
  );
};
