'use client';

import { FormField, FormLabel, FormControl, MenuItem, ContentBadge, Menu, MenuTrigger, MenuContent, MenuList } from '@wanteddev/wds';
import { Box } from '@wanteddev/wds-engine';
import type { Theme } from '@wanteddev/wds-engine';
import type { ReactNode } from 'react';

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
  disabled?: boolean;
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const DropdownInput = ({
  heading,
  value = [],
  options,
  onChange,
  placeholder = '선택하세요',
  width = '100%',
  height = '48px',
  className,
}: DropdownInputProps) => {
  const selectedValues = value;
  const selectedOptions = options.filter((opt) => selectedValues.includes(opt.value));

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
        >
          <MenuTrigger>
            <Box
              className={className}
              sx={(theme: Theme) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: width,
                height: height,
                padding: '12px',
                border: `1px solid ${theme.semantic.line.normal.neutral}`,
                borderRadius: '12px',
                cursor: 'pointer',
                overflow: 'hidden',
                '&:hover': {
                  borderColor: theme.semantic.line.normal.alternative,
                },
              })}
            >
              {selectedOptions.length === 0 ? (
                <Box sx={(theme: Theme) => ({ color: theme.semantic.label.assistive })}>
                  {placeholder}
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    gap: 4,
                    flexWrap: 'nowrap',
                    overflow: 'hidden',
                  }}
                >
                  {selectedOptions.map((option) => (
                    <ContentBadge
                      key={option.value}
                      size="small"
                      variant="solid"
                      color="neutral"
                      leadingContent={option.leadingContent}
                      sx={{ flexShrink: 0 }}
                    >
                      {option.label}
                    </ContentBadge>
                  ))}
                </Box>
              )}
            </Box>
          </MenuTrigger>
          <MenuContent>
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