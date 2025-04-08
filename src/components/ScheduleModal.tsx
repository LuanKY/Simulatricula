import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ClassSchedule } from '../types';
import { ScheduleForm } from './ScheduleForm';

interface Props {
  schedule: ClassSchedule;
  onClose: () => void;
  onUpdate: (schedule: ClassSchedule) => void;
  onDelete: (id: string) => void;
}

export function ScheduleModal({ schedule, onClose, onUpdate, onDelete }: Props) {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
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

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-2 w-full py-2 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium"
            onClick={() => {
              onDelete(schedule.id);
              onClose();
            }}
          >
            Remover Turma
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
