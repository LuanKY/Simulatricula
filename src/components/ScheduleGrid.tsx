import React from 'react';
import { ClassSchedule, TimeRange } from '../types';
import { generateTimeRanges } from '../utils/scheduleParser';

interface Props {
  schedules: ClassSchedule[];
  onScheduleClick: (schedule: ClassSchedule) => void;
}

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const timeRanges = generateTimeRanges();

export function ScheduleGrid({ schedules, onScheduleClick }: Props) {
  const renderTimeCell = (time: TimeRange, dayIndex: number) => {
    const timeIndex = timeRanges.indexOf(time);
    const matchingSchedules = schedules.filter(schedule => 
      schedule.schedules.some(slot => 
        slot.day === dayIndex && 
        slot.slots.includes(timeIndex)
      )
    );

    if (matchingSchedules.length === 0) {
      return <td className="border p-1 h-16 w-32 text-center dark:border-gray-700 dark:text-gray-400">---</td>;
    }

    return (
      <td 
        className="border p-1 h-16 w-32 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 cursor-pointer dark:border-gray-700 transition-colors duration-200"
        onClick={() => onScheduleClick(matchingSchedules[0])}
      >
        <div className="flex flex-col h-full">
          <span className="font-semibold text-sm dark:text-white">{matchingSchedules[0].discipline}</span>
          <span className="text-xs text-gray-600 dark:text-gray-300">{matchingSchedules[0].professor}</span>
        </div>
      </td>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse border w-full dark:border-gray-700">
        <thead>
          <tr>
            <th className="border p-2 w-24 dark:border-gray-700 dark:text-white">Horário</th>
            {DAYS.map(day => (
              <th key={day} className="border p-2 w-32 dark:border-gray-700 dark:text-white">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeRanges.map((time, index) => (
            <tr key={index}>
              <td className="border p-1 text-sm text-center dark:border-gray-700 dark:text-gray-300">
                {time.start} - {time.end}
              </td>
              {DAYS.map((_, dayIndex) => (
                <React.Fragment key={dayIndex}>
                  {renderTimeCell(time, dayIndex)}
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}