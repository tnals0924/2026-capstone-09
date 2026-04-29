'use client';

import {
  Button,
  ContentBadge,
  DatePicker,
  TextField,
  TextFieldContent,
  TimePicker,
} from '@wanteddev/wds';
import { IconClose } from '@wanteddev/wds-icon';
import { Controller } from 'react-hook-form';

import { EXAMPLE_MEETING_PARTICIPANTS } from '@/constants/exampleConstant';

import { ParticipantsSelect } from './ParticipantsSelect';
import { useMeetingCreateForm } from './useMeetingCreateForm';

export interface MeetingCreatePayload {
  nodeBadge: string;
  nodeTitle: string;
  date: string;
  time: string;
  participants: string[];
}

interface MeetingCreateModalContentProps {
  nodeBadge: string;
  nodeTitle: string;
  onClose: () => void;
  onCreate?: (payload: MeetingCreatePayload) => void;
}

export const MeetingCreateModalContent = ({
  nodeBadge,
  nodeTitle,
  onClose,
  onCreate,
}: MeetingCreateModalContentProps) => {
  const {
    form,
    isDateOpen,
    setIsDateOpen,
    isTimeOpen,
    setIsTimeOpen,
    buildPayload,
  } = useMeetingCreateForm();
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = form;

  const handleCreate = handleSubmit((values) => {
    onCreate?.({ nodeBadge, nodeTitle, ...buildPayload(values) });
  });

  return (
    <form
      data-meeting-create-modal=""
      className="flex w-full flex-col gap-8"
      onSubmit={handleCreate}
    >
      <style>{`
        [data-meeting-create-modal] [data-role='text-field-wrapper']:has(input:focus),
        [data-meeting-create-modal] [data-role='text-field-wrapper']:focus-within,
        [data-meeting-create-modal] :focus-within > [data-role='text-field-wrapper'],
        [data-meeting-create-modal] :has(input:focus) > [data-role='text-field-wrapper'] {
          box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--color-primary-40) 43%, transparent) !important;
        }
        [data-meeting-create-modal] [data-role='text-field-wrapper']:has(input[aria-expanded='true']),
        [data-meeting-create-modal] [data-role='text-field-wrapper']:has(input[data-role='date-picker-field'][aria-expanded='true']),
        [data-meeting-create-modal] [data-role='text-field-wrapper']:has(input[data-role='time-picker-field'][aria-expanded='true']) {
          box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--color-primary-40) 43%, transparent) !important;
        }
        [data-meeting-create-modal] [data-role='text-field-wrapper'] input {
          caret-color: var(--color-primary-40) !important;
        }
        [data-meeting-create-modal] [data-role='text-field-reset'] {
          display: none !important;
        }
        [data-role^='time-list-']::after {
          display: none !important;
          min-height: 0 !important;
          content: none !important;
        }
      `}</style>

      <div className="flex items-center justify-between">
        <h2 className="text-heading-1 text-label-normal font-medium">회의 생성</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="text-label-alternative hover:text-label-neutral flex h-6 w-6 items-center justify-center border-none bg-transparent p-0"
        >
          <IconClose className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      <div className="flex w-full flex-col gap-6">
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col gap-2">
            <label
              htmlFor="meeting-create-node"
              className="text-label-1 text-label-neutral font-semibold"
            >
              회의를 진행할 노드
            </label>
            <TextField
              id="meeting-create-node"
              value={nodeTitle}
              readOnly
              disabled
              width="100%"
              leadingContent={
                <TextFieldContent variant="badge">
                  <ContentBadge
                    size="xsmall"
                    variant="solid"
                    color="accent"
                    className="!bg-primary-40/10 !text-primary-40"
                  >
                    {nodeBadge}
                  </ContentBadge>
                </TextFieldContent>
              }
            />
          </div>

          <div className="flex w-full items-start gap-3">
            <div className="flex flex-1 flex-col gap-2">
              <span className="text-label-1 text-label-neutral font-semibold">날짜</span>
              <Controller
                control={control}
                name="date"
                rules={{ required: true }}
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    format="YYYY-MM-DD"
                    placeholder="날짜 선택"
                    width="100%"
                    locale="ko"
                    open={isDateOpen}
                    onOpenChange={setIsDateOpen}
                    onClick={() => setIsDateOpen(true)}
                    contentProps={{ sx: { zIndex: 10000 } }}
                  />
                )}
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <span className="text-label-1 text-label-neutral font-semibold">시간</span>
              <Controller
                control={control}
                name="time"
                rules={{ required: true }}
                render={({ field }) => (
                  <TimePicker
                    value={field.value}
                    onChange={field.onChange}
                    format="HH:mm"
                    placeholder="시간 선택"
                    width="100%"
                    open={isTimeOpen}
                    onOpenChange={setIsTimeOpen}
                    onClick={() => setIsTimeOpen(true)}
                    contentProps={{
                      sx: {
                        zIndex: 10000,
                        '[data-radix-scroll-area-scrollbar]': {
                          display: 'none !important',
                        },
                        '[data-radix-scroll-area-corner]': {
                          display: 'none !important',
                        },
                        '[data-radix-scroll-area-viewport]': {
                          scrollbarWidth: 'none',
                          overscrollBehavior: 'contain',
                        },
                        '[data-radix-scroll-area-viewport]::-webkit-scrollbar': {
                          display: 'none',
                          width: 0,
                          height: 0,
                        },
                      },
                    }}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex w-full flex-col gap-2">
            <span className="text-label-1 text-label-neutral font-semibold">참여자</span>
            <Controller
              control={control}
              name="participants"
              render={({ field }) => (
                <ParticipantsSelect
                  options={EXAMPLE_MEETING_PARTICIPANTS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="이름 또는 이메일로 검색"
                />
              )}
            />
          </div>
        </div>

        <div className="flex w-full items-center gap-3">
          <Button
            type="button"
            variant="solid"
            color="assistive"
            size="medium"
            fullWidth
            onClick={onClose}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="solid"
            color="primary"
            size="medium"
            fullWidth
            disabled={isSubmitting}
          >
            회의 생성
          </Button>
        </div>
      </div>
    </form>
  );
};

MeetingCreateModalContent.displayName = 'MeetingCreateModalContent';
