'use client';

import type { DateType } from '@wanteddev/wds';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import type { ParticipantOption } from './ParticipantsSelect';

export interface MeetingCreateFormValues {
  date: DateType;
  time: DateType;
  participants: ParticipantOption[];
}

const toDate = (value: DateType): Date | null => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const pad2 = (value: number): string => String(value).padStart(2, '0');

export const useMeetingCreateForm = () => {
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  const form = useForm<MeetingCreateFormValues>({
    defaultValues: {
      date: null,
      time: null,
      participants: [],
    },
    mode: 'onChange',
  });

  const buildPayload = (values: MeetingCreateFormValues) => {
    const date = toDate(values.date);
    const time = toDate(values.time);

    return {
      date: date
        ? `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
        : '',
      time: time ? `${pad2(time.getHours())}:${pad2(time.getMinutes())}` : '',
      participants: values.participants.map((participant) => participant.name),
    };
  };

  return {
    form,
    isDateOpen,
    setIsDateOpen,
    isTimeOpen,
    setIsTimeOpen,
    buildPayload,
  };
};
