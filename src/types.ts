export interface ClassSchedule {
  id: string;
  professor: string;
  discipline: string;
  timeCode: string;
  schedules: TimeSlot[];
}

export interface TimeSlot {
  day: number;
  period: string;
  slots: number[];
}

export interface ScheduleCell {
  time: string;
  schedules: ClassSchedule[];
}

export type Period = 'M' | 'T' | 'N';

export interface TimeRange {
  start: string;
  end: string;
}