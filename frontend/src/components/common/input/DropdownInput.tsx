'use client';

import { FormField, FormLabel, FormControl, MenuItem, ContentBadge, Menu, MenuTrigger, MenuContent, MenuList, FlexBox } from '@wanteddev/wds';
import { Box } from '@wanteddev/wds-engine';
import type { Theme } from '@wanteddev/wds-engine';
import { IconChevronUpThickSmall, IconChevronDownThickSmall, IconClose } from '@wanteddev/wds-icon';
import type { ReactNode, RefObject } from 'react';
import { useRef, useState, useLayoutEffect, useEffect, useCallback } from 'react';

export interface DropdownOption {
  label: string;
  value: string;
  leadingContent?: ReactNode;
  trailingContent?: ReactNode;
}

export interface DropdownInputProps {
  heading?: string;
  value?: string[];
  options: DropdownOption[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
}

// 표시할 배지 개수를 계산하는 커스텀 훅
function useVisibleBadgeCount(
  selectedOptions: DropdownOption[],
  containerRef: RefObject<HTMLDivElement | null>,
  badgesRef: RefObject<HTMLDivElement | null>,
  iconRef: RefObject<HTMLDivElement | null>,
  plusBadgeRef: RefObject<HTMLDivElement | null>
) {
  const [visibleCount, setVisibleCount] = useState(0);

  const calculateCount = useCallback(() => {
    // selectedOptions가 없으면 0으로 설정
    if (selectedOptions.length === 0) {
      setVisibleCount(0);
      return;
    }

    if (!badgesRef.current || !containerRef.current || !iconRef.current || !plusBadgeRef.current) {
      return;
    }

    const containerWidth = containerRef.current.offsetWidth;
    const iconWidth = iconRef.current.offsetWidth;
    const plusBadgeWidth = plusBadgeRef.current.offsetWidth;
    const availableWidth = containerWidth - 24 - iconWidth - 8;

    const badges = Array.from(badgesRef.current.children) as HTMLElement[];
    let totalWidth = 0;
    let count = 0;

    for (let i = 0; i < badges.length; i++) {
      const badgeWidth = badges[i].offsetWidth;
      const gap = count > 0 ? 4 : 0;
      const newTotal = totalWidth + gap + badgeWidth;
      const remaining = badges.length - (count + 1);
      const required = newTotal + (remaining > 0 ? 4 + plusBadgeWidth : 0);

      // 15% 여유
      if (required * 1.15 <= availableWidth) {
        totalWidth = newTotal;
        count++;
      } else {
        break;
      }
    }

    setVisibleCount(count);
  }, [selectedOptions, badgesRef, containerRef, iconRef, plusBadgeRef]);

  // selectedOptions 변경 시 계산
  useLayoutEffect(() => {
    requestAnimationFrame(calculateCount);
  }, [calculateCount]);

  // ResizeObserver로 컨테이너 크기 변경 감지
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(calculateCount);
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [containerRef, calculateCount]);

  return visibleCount;
}

export const DropdownInput = ({
  heading,
  value = [],
  options,
  onChange,
  placeholder,
  width = '100%',
  height = '48px',
  className,
}: DropdownInputProps) => {
  const selectedValues = value;
  // 먼저 선택한 것이 앞에 오도록 value 배열 순서대로 정렬
  const selectedOptions = selectedValues
    .map((val) => options.find((opt) => opt.value === val))
    .filter((opt): opt is DropdownOption => opt !== undefined);

  // Ref 생성
  const containerRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const plusBadgeRef = useRef<HTMLDivElement>(null);

  // 커스텀 훅으로 표시할 배지 개수 계산
  const visibleCount = useVisibleBadgeCount(
    selectedOptions,
    containerRef,
    badgesRef,
    iconRef,
    plusBadgeRef
  );

  const [triggerWidth, setTriggerWidth] = useState<number | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);

  // 드롭다운 너비 설정
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setTriggerWidth(containerRef.current.offsetWidth);
      }
    };

    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);
    updateWidth();

    return () => observer.disconnect();
  }, []);

  const visibleOptions = selectedOptions.slice(0, visibleCount);
  const remainingCount = selectedOptions.length - visibleCount;

  const handleRemove = (valueToRemove: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const newValues = selectedValues.filter(v => v !== valueToRemove);
    onChange?.(newValues);
  };

  return (
    <FormField gap={8}>
      {heading && (
        <FormLabel
          variant="label1"
          weight="bold"
          sx={(theme: Theme) => ({
            color: theme.semantic.label.neutral,
          })}
        >
          {heading}
        </FormLabel>
      )}
      <FormControl>
        <Menu
          value={selectedValues}
          onValueChange={(newValue) => {
            onChange?.(newValue as string[]);
          }}
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          <MenuTrigger>
            <FlexBox
              ref={containerRef}
              gap="8px"
              alignItems="center"
              role="combobox"
              tabIndex={0}
              aria-expanded={isOpen}
              className={className}
              sx={(theme: Theme) => ({
                position: 'relative',
                width: width,
                height: height,
                padding: '12px',
                backgroundColor: theme.semantic.background.transparent.normal,
                backdropFilter: 'blur(32px)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: isOpen
                  ? `inset 0 0 0 2px #33EBC366, ${theme.semantic.elevation.shadow.normal.xsmall}`
                  : `inset 0 0 0 1px ${theme.semantic.line.normal.neutral}, ${theme.semantic.elevation.shadow.normal.xsmall}`,
                cursor: 'pointer',
                outline: 'none',
                transition: 'box-shadow ease 0.2s',
                '&:focus, &:focus-visible': {
                  outline: 'none',
                  boxShadow: `inset 0 0 0 2px #33EBC366, ${theme.semantic.elevation.shadow.normal.xsmall}`,
                },
              })}
            >
              <FlexBox
                flex="1"
                gap="4px"
                alignItems="center"
                data-role="select-multiple-render-wrapper"
                sx={{
                  overflow: 'hidden',
                  minWidth: 0,
                  minHeight: '24px',
                }}
              >
                {selectedOptions.length === 0 ? (
                  <Box
                    data-role="select-multiple-placeholder"
                    sx={(theme: Theme) => ({
                      color: theme.semantic.label.assistive,
                      fontSize: '16px',
                      lineHeight: '24px',
                      minHeight: '24px',
                      userSelect: 'none',
                    })}
                  >
                    {placeholder}
                  </Box>
                ) : (
                  <>
                    {/* 측정용 숨겨진 배지들 */}
                    <Box
                      ref={badgesRef}
                      sx={{
                        position: 'absolute',
                        visibility: 'hidden',
                        pointerEvents: 'none',
                        display: 'flex',
                        gap: '4px',
                      }}
                    >
                      {selectedOptions.map((option) => (
                        <ContentBadge
                          key={option.value}
                          size="small"
                          variant="solid"
                          color="neutral"
                          leadingContent={option.leadingContent}
                          trailingContent={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <IconClose width={16} height={16} />
                            </Box>
                          }
                          sx={{ paddingLeft: 12, gap: 12 }}
                        >
                          {option.label}
                        </ContentBadge>
                      ))}
                    </Box>
                    {/* 측정용 +N 배지 */}
                    <Box
                      ref={plusBadgeRef}
                      sx={{
                        position: 'absolute',
                        visibility: 'hidden',
                        pointerEvents: 'none',
                      }}
                    >
                      <ContentBadge size="small" variant="solid" color="neutral" sx={{ paddingLeft: 12, gap: 12 }}>
                        +99
                      </ContentBadge>
                    </Box>
                    {visibleOptions.map((option) => (
                      <ContentBadge
                        key={option.value}
                        size="small"
                        variant="solid"
                        color="neutral"
                        leadingContent={option.leadingContent}
                        trailingContent={
                            <button
                                type="button"
                                onClick={handleRemove(option.value)}
                                aria-label={`${option.label} 제거`}
                            >
                                <IconClose width={16} height={16}/>
                            </button>
                        }
                        sx={{
                            flexShrink: 0,
                            paddingLeft: 12,
                            gap: 12,
                        }}
                      >
                        {option.label}
                      </ContentBadge>
                    ))}
                    {remainingCount > 0 && (
                      <ContentBadge
                        size="small"
                        variant="solid"
                        color="neutral"
                        sx={{
                          flexShrink: 0,
                          paddingLeft: 12,
                          gap: 12,
                        }}
                      >
                        +{remainingCount}
                      </ContentBadge>
                    )}
                  </>
                )}
              </FlexBox>
              <Box
                ref={iconRef}
                sx={(theme: Theme) => ({
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                  fontSize: '16px',
                  margin: '4px',
                  color: theme.semantic.label.alternative,
                })}
              >
                {isOpen ? (
                  <IconChevronUpThickSmall />
                ) : (
                  <IconChevronDownThickSmall />
                )}
              </Box>
            </FlexBox>
          </MenuTrigger>
          <MenuContent
            offset={8}
            position="bottom-center"
            sx={{ width: triggerWidth, minWidth: '140px' }}
          >
            <MenuList>
              {options.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                  variant="normal"
                  sx={{ alignItems: 'center' }}
                  leadingContent={
                    option.leadingContent && (
                      <Box sx={{ marginRight: 8 }}>
                        {option.leadingContent}
                      </Box>
                    )
                  }
                  trailingContent={
                    option.trailingContent && (
                      <Box
                        sx={(theme: Theme) => ({
                          color: theme.semantic.label.alternative,
                        })}
                      >
                        {option.trailingContent}
                      </Box>
                    )
                  }
                >
                  {option.label}
                </MenuItem>
              ))}
            </MenuList>
          </MenuContent>
        </Menu>
      </FormControl>
    </FormField>
  );
};

DropdownInput.displayName = 'DropdownInput';