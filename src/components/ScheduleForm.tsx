import React, { useState } from 'react';
import { ClassSchedule } from '../types';
import { parseTimeCode, validateTimeCode, capitalizeWords } from '../utils/scheduleParser';
import { ErrorModal } from './ErrorModal';

interface Props {
  onSubmit: (schedule: ClassSchedule) => void;
  initialData?: ClassSchedule;
}

export function ScheduleForm({ onSubmit, initialData }: Props) {
  const [formData, setFormData] = useState({
    professor: initialData?.professor || '',
    discipline: initialData?.discipline || '',
    timeCode: initialData?.timeCode || '',
  });
  const [showError, setShowError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateTimeCode(formData.timeCode)) {
      setShowError(true);
      return;
    }
    
    const schedules = parseTimeCode(formData.timeCode);
    
    onSubmit({
      id: initialData?.id || crypto.randomUUID(),
      ...formData,
      professor: capitalizeWords(formData.professor),
      discipline: capitalizeWords(formData.discipline),
      schedules,
    });

    if (!initialData) {
      setFormData({
        professor: '',
        discipline: '',
        timeCode: '',
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Professor
          </label>
          <input
            type="text"
            value={formData.professor}
            onChange={(e) => setFormData(prev => ({ ...prev, professor: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Disciplina
          </label>
          <input
            type="text"
            value={formData.discipline}
            onChange={(e) => setFormData(prev => ({ ...prev, discipline: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Código de Horário
          </label>
          <input
            type="text"
            value={formData.timeCode}
            onChange={(e) => setFormData(prev => ({ ...prev, timeCode: e.target.value.toUpperCase() }))}
            placeholder="Ex: 35T12 ou 4N12 6N34"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          {initialData ? 'Atualizar' : 'Adicionar'} Turma
        </button>
      </form>

      {showError && (
        <ErrorModal
          message="O código de horário informado está em um formato inválido."
          onClose={() => setShowError(false)}
        />
      )}
    </>
  );
}