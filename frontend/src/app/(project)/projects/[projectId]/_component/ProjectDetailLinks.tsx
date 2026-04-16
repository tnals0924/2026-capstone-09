import { useEffect, useRef, useState } from 'react';
import { IconPlus } from '@wanteddev/wds-icon';

import { EXAMPLE_PROJECT_DETAIL_LINKS } from '@/constants/exampleConstant';
import { Dropdown } from '../../../../../components/commons/Dropdown';
import { ProjectDetailLinkItem } from './ProjectDetailLinkItem';

export const ProjectDetailLinks = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const handleLinkContextMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setPosition({ x: e.clientX, y: e.clientY });
        setIsOpen(true);
    };

    useEffect(() => {
        if (!isOpen) return;

        const handlePointerDown = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleScroll = () => {
            setIsOpen(false);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('mousedown', handlePointerDown);
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('mousedown', handlePointerDown);
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    return (
        <>
            <section className="flex h-12 shrink-0 items-center justify-between border-b border-line-soft bg-static-white p-3">
                <div className="flex items-center gap-4">
                    {EXAMPLE_PROJECT_DETAIL_LINKS.map(({ href, id, label }) => (
                        <ProjectDetailLinkItem
                            key={id}
                            label={label}
                            href={href}
                            onContextMenu={handleLinkContextMenu}
                        />
                    ))}

                    <button
                        type="button"
                        className="flex h-7 w-7 appearance-none items-center justify-center rounded-md border-none bg-transparent text-label-alternative transition-colors hover:bg-fill-normal hover:text-label-neutral"
                        aria-label="링크 추가"
                    >
                        <IconPlus className="h-4 w-4" aria-hidden="true" />
                    </button>
                </div>
            </section>

            {isOpen && (
                <Dropdown
                    x={position.x}
                    y={position.y}
                    dropdownRef={dropdownRef}
                    variant="link"
                />
            )}
        </>
    );
};
