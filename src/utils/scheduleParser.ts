import { Period, TimeSlot } from '../types';

const DAYS_MAP: Record<string, number> = {
  '0': 0,
  '2': 1,
  '3': 2,
  '4': 3,
  '5': 4,
  '6': 5,
  '7': 6,
};

const TIME_RANGES = {
  M: [
    { start: '07:30', end: '08:15' },
    { start: '08:15', end: '09:00' },
    { start: '09:15', end: '10:00' },
    { start: '10:00', end: '10:45' },
    { start: '11:00', end: '11:45' },
    { start: '11:45', end: '12:30' },
  ],
  T: [
    { start: '13:30', end: '14:15' },
    { start: '14:15', end: '15:00' },
    { start: '15:15', end: '16:00' },
    { start: '16:00', end: '16:45' },
    { start: '17:00', end: '17:45' },
    { start: '17:45', end: '18:30' },
  ],
  N: [
    { start: '19:00', end: '19:45' },
    { start: '19:45', end: '20:30' },
    { start: '20:45', end: '21:30' },
    { start: '21:30', end: '22:15' },
  ],
};

function parseTimeBlock(code: string): { days: string[], period: Period, slots: number[] } {
  const match = code.match(/^([0234567]+)([MTN])([1-6]+)$/);
  if (!match) throw new Error('Invalid time code format');

  const [, days, period, slots] = match;
  return {
    days: days.split(''),
    period: period as Period,
    slots: slots.split('').map(Number),
  };
}

export function validateTimeCode(timeCode: string): boolean {
  const codes = timeCode.trim().split(' ');

  try {
    for (const code of codes) {
      const { days, period, slots } = parseTimeBlock(code);

      if (days.some(day => !DAYS_MAP.hasOwnProperty(day))) {
        return false;
      }

      const maxSlot = period === 'N' ? 4 : 6;
      if (slots.some(slot => slot < 1 || slot > maxSlot)) {
        return false;
      }

      for (let i = 1; i < slots.length; i++) {
        if (slots[i] <= slots[i - 1]) {
          return false;
        }
      }
    }
    return true;
  } catch {
    return false;
  }
}

export function parseTimeCode(timeCode: string): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const codes = timeCode.trim().split(' ');

  for (const code of codes) {
    const { days, period, slots: timeSlots } = parseTimeBlock(code);

    const baseIndex = period === 'M' ? 0 : period === 'T' ? 6 : 12;

    for (const day of days) {
      slots.push({
        day: DAYS_MAP[day],
        period,
        slots: timeSlots.map(slot => baseIndex + (slot - 1)),
      });
    }
  }

  return slots;
}

export function generateTimeRanges() {
  return [
    ...TIME_RANGES.M,
    ...TIME_RANGES.T,
    ...TIME_RANGES.N,
  ];
}

export function capitalizeWords(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}