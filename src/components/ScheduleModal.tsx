import React from 'react';
import { ClassSchedule } from '../types';
import { ScheduleForm } from './ScheduleForm';
import { X } from 'lucide-react';

interface Props {
  schedule: ClassSchedule;
  onClose: () => void;
  onUpdate: (schedule: ClassSchedule) => void;
  onDelete: (id: string) => void;
}

export function ScheduleModal({ schedule, onClose, onUpdate, onDelete }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold dark:text-white">Detalhes da Turma</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <ScheduleForm
            initialData={schedule}
            onSubmit={(updatedSchedule) => {
              onUpdate(updatedSchedule);
              onClose();
            }}
          />

          <button
            onClick={() => {
              onDelete(schedule.id);
              onClose();
            }}
            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            Remover Turma
          </button>
        </div>
      </div>
    </div>
  );
}