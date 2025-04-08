import React from 'react';
import { motion } from 'framer-motion';
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
      return (
        <td className="border p-1 h-16 w-32 text-center dark:border-gray-700 dark:text-gray-400 transition-colors duration-200">
          <span className="text-gray-300 dark:text-gray-600">---</span>
        </td>
      );
    }

    return (
      <motion.td 
        whileHover={{ scale: 1.02 }}
        className="border p-1 h-16 w-32 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 cursor-pointer dark:border-gray-700 transition-all duration-200"
        onClick={() => onScheduleClick(matchingSchedules[0])}
      >
        <div className="cell-content flex flex-col h-full justify-center p-2">
          <span className="font-semibold text-sm text-blue-700 dark:text-blue-300">
            {matchingSchedules[0].discipline}
          </span>
          <span className="text-xs text-blue-600/80 dark:text-blue-400/80">
            {matchingSchedules[0].professor}
          </span>
        </div>
      </motion.td>
    );
  };

  return (
    <div className="w-full">
      <table className="w-full border-collapse border dark:border-gray-700 rounded-lg overflow-hidden table-fixed">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800/50">
            <th className="border p-3 font-semibold text-gray-700 dark:text-gray-300 dark:border-gray-700 w-24">
              Horário
            </th>
            {DAYS.map(day => (
              <th key={day} className="border p-3 font-semibold text-gray-700 dark:text-gray-300 dark:border-gray-700 w-32">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeRanges.map((time, index) => (
            <tr key={index} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors duration-200">
              <td className="border p-2 text-sm text-center dark:border-gray-700 text-gray-600 dark:text-gray-400 font-medium">
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