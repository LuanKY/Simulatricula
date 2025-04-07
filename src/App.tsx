import html2canvas from 'html2canvas';
import { Download, Save, Trash2, Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ScheduleForm } from './components/ScheduleForm';
import { ScheduleGrid } from './components/ScheduleGrid';
import { ScheduleModal } from './components/ScheduleModal';
import { ThemeToggle } from './components/ThemeToggle';
import { ClassSchedule } from './types';

function App() {
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<ClassSchedule | null>(null);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const savedSchedules = localStorage.getItem('schedules');
    if (savedSchedules) {
      setSchedules(JSON.parse(savedSchedules));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleAddSchedule = (schedule: ClassSchedule) => {
    setSchedules(prev => [...prev, schedule]);
  };

  const handleUpdateSchedule = (updatedSchedule: ClassSchedule) => {
    setSchedules(prev =>
      prev.map(schedule =>
        schedule.id === updatedSchedule.id ? updatedSchedule : schedule
      )
    );
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== id));
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(schedules);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'horarios.json');
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          const importedSchedules = JSON.parse(content);
          setSchedules(importedSchedules);
        } catch (error) {
          alert('Erro ao importar arquivo');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSaveAsPNG = async () => {
    const gridElement = document.getElementById('schedule-grid');
    if (gridElement) {
      const canvas = await html2canvas(gridElement);
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'grade-horarios.png';
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Simulatrícula (Simulador de Matrículas Institucionais)
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Gerencie sua grade de horários de forma simples e eficiente
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow transition-colors duration-200">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Adicionar Turma</h2>
            <ScheduleForm onSubmit={handleAddSchedule} />
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow transition-colors duration-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold dark:text-white">Grade de Horários</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSchedules([])}
                    className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Limpar
                  </button>
                  <button
                    onClick={handleSaveAsPNG}
                    className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar PNG
                  </button>
                  <button
                    onClick={handleExport}
                    className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </button>
                  <label className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors duration-200">
                    <Upload className="w-4 h-4 mr-2" />
                    Importar
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div id="schedule-grid" className="overflow-x-auto">
                <ScheduleGrid
                  schedules={schedules}
                  onScheduleClick={setSelectedSchedule}
                />
              </div>
            </div>
          </div>
        </div>

        {selectedSchedule && (
          <ScheduleModal
            schedule={selectedSchedule}
            onClose={() => setSelectedSchedule(null)}
            onUpdate={handleUpdateSchedule}
            onDelete={handleDeleteSchedule}
          />
        )}
      </div>
    </div>
  );
}

export default App;