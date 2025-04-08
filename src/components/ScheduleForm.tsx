import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { ClassSchedule } from '../types';
import { capitalizeWords, parseTimeCode, validateTimeCode } from '../utils/scheduleParser';
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
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Professor
          </label>
          <input
            type="text"
            value={formData.professor}
            onChange={(e) => setFormData(prev => ({ ...prev, professor: e.target.value }))}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
            placeholder="Nome do professor"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Disciplina
          </label>
          <input
            type="text"
            value={formData.discipline}
            onChange={(e) => setFormData(prev => ({ ...prev, discipline: e.target.value }))}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
            placeholder="Nome da disciplina"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Código de Horário
          </label>
          <input
            type="text"
            value={formData.timeCode}
            onChange={(e) => setFormData(prev => ({ ...prev, timeCode: e.target.value.toUpperCase() }))}
            placeholder="Ex: 35T12 ou 4N12 6N34"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
            title="Formato: [DIAS][TURNO][HORÁRIOS] - Ex: 35T12 (Terça e Quinta, Tarde, 1º e 2º horários)"
            required
          />
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium"
        >
          {initialData ? 'Atualizar' : 'Adicionar'} Turma
        </motion.button>
      </motion.form>

      {showError && (
        <ErrorModal
          message="O código de horário informado está em um formato inválido."
          onClose={() => setShowError(false)}
        />
      )}
    </>
  );
}