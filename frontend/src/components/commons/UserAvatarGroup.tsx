import { IconPersonFill } from '@wanteddev/wds-icon';
import { useRef, useState } from 'react';

import { cn } from '@/utils/cn';

export interface UserInfo {
    email: string;
    name: string;
}

type UserDisplayMode = 'viewer' | 'active';

interface UsersProps {
    users: readonly UserInfo[];
    mode?: UserDisplayMode;
}

const MAX_VISIBLE_ACTIVE_USERS = 5;
const MAX_VISIBLE_VIEWER_USERS = 3;

interface UserAvatarProps {
    className?: string;
    iconClassName?: string;
}

const UserAvatar = ({ className, iconClassName }: UserAvatarProps) => {
    return (
        <div
            className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full border border-neutral-99 bg-cool-neutral-96',
                className,
            )}
        >
            <IconPersonFill
                className={cn('h-4 w-4 text-static-white', iconClassName)}
                aria-hidden="true"
            />
        </div>
    );
};

interface UserAvatarWithTooltipProps {
    user: UserInfo;
}

const UserAvatarWithTooltip = ({ user }: UserAvatarWithTooltipProps) => {
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [tooltipAlign, setTooltipAlign] = useState<'center' | 'end'>('center');

    const handleMouseEnter = () => {
        const triggerElement = triggerRef.current;
        const tooltipElement = tooltipRef.current;

        if (!triggerElement || !tooltipElement) return;

        const triggerRect = triggerElement.getBoundingClientRect();
        const tooltipWidth = tooltipElement.offsetWidth;
        const viewportWidth = window.innerWidth;
        const centeredRightEdge = triggerRect.left + triggerRect.width / 2 + tooltipWidth / 2;

        setTooltipAlign(centeredRightEdge > viewportWidth - 8 ? 'end' : 'center');
    };

    return (
        <div className="group relative" onMouseEnter={handleMouseEnter}>
            <div ref={triggerRef}>
                <UserAvatar />
            </div>

            <div
                ref={tooltipRef}
                className={
                    tooltipAlign === 'end'
                        ? 'pointer-events-none absolute top-full right-0 z-10 mt-2 min-w-max rounded-md border border-line-normal-neutral bg-static-white px-3.5 py-2.5 opacity-0 shadow-sm transition-opacity group-hover:opacity-100'
                        : 'pointer-events-none absolute top-full left-1/2 z-10 mt-2 min-w-max -translate-x-1/2 rounded-md border border-line-normal-neutral bg-static-white px-3.5 py-2.5 opacity-0 shadow-sm transition-opacity group-hover:opacity-100'
                }
            >
                <div className="flex items-center gap-2">
                    <UserAvatar className="h-8 w-8" iconClassName="h-5 w-5" />
                    <div className="flex flex-col">
                        <p className="text-caption-1 font-medium text-label-normal">{user.name}</p>
                        <p className="text-caption-2 font-normal text-label-alternative">{user.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface UserAvatarGroupProps {
    users: readonly UserInfo[];
    maxVisibleUsers: number;
    showUserTooltip: boolean;
    showHiddenUsersTooltip: boolean;
}

const UserAvatarGroup = ({
                             users,
                             maxVisibleUsers,
                             showUserTooltip,
                             showHiddenUsersTooltip,
                         }: UserAvatarGroupProps) => {
    const visibleUsers = users.slice(0, maxVisibleUsers);
    const hiddenUserCount = Math.max(users.length - maxVisibleUsers, 0);

    return (
        <div className="flex items-center">
            {visibleUsers.map((user) => (
                <div key={user.email} className="-ml-2.5 first:ml-0" aria-label={user.name}>
                    {showUserTooltip ? <UserAvatarWithTooltip user={user} /> : <UserAvatar />}
                </div>
            ))}

            {hiddenUserCount > 0 && showHiddenUsersTooltip && (
                <div className="group relative ml-2">
          <span className="cursor-default text-body-2 font-medium text-label-alternative">
            외 {hiddenUserCount}명
          </span>

                    <div className="pointer-events-none absolute top-full right-0 z-10 mt-2 min-w-max rounded-md border border-line-normal-neutral bg-static-white px-3.5 py-3.5 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                        <div className="flex min-w-44 flex-col gap-2.5">
                            {users.map((user) => (
                                <div key={user.email} className="flex items-center gap-2">
                                    <UserAvatar className="h-8 w-8" iconClassName="h-5 w-5" />
                                    <div className="flex flex-col">
                                        <p className="text-caption-1 font-medium text-label-normal">{user.name}</p>
                                        <p className="text-caption-2 font-normal text-label-alternative">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const Users = ({ users, mode = 'viewer' }: UsersProps) => {
    const isActiveMode = mode === 'active';

    return (
        <UserAvatarGroup
            users={users}
            maxVisibleUsers={isActiveMode ? MAX_VISIBLE_ACTIVE_USERS : MAX_VISIBLE_VIEWER_USERS}
            showUserTooltip={isActiveMode}
            showHiddenUsersTooltip={isActiveMode}
        />
    );
};