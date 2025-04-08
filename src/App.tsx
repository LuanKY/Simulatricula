import { AnimatePresence, motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { Download, Save, Trash2, Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ScheduleForm } from './components/ScheduleForm';
import { ScheduleGrid } from './components/ScheduleGrid';
import { ScheduleModal } from './components/ScheduleModal';
import { ThemeToggle } from './components/ThemeToggle';
import { ThemeContext } from './hooks/useTheme';
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
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const savedSchedules = localStorage.getItem('schedules');
    if (savedSchedules) {
      setSchedules(JSON.parse(savedSchedules));
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
    } else {
      setIsDark(false);
    }

    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem('schedules', JSON.stringify(schedules));
    }
  }, [schedules, initialized]);

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
    if (!gridElement) return;

    const fixedWidth = 1260;
    const fixedHeight = gridElement.offsetHeight;

    const clone = gridElement.cloneNode(true) as HTMLElement;
    clone.style.width = `${fixedWidth}px`;
    clone.style.height = `${fixedHeight}px`;

    const container = document.createElement('div');
    container.appendChild(clone);
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    document.body.appendChild(container);

    clone.querySelectorAll('*').forEach((node) => {
      if (node instanceof HTMLElement) {
        node.classList.remove('dark');

        node.style.color = 'black';

        const isHeader =
          node.tagName === 'TH' ||
          node.tagName === 'THEAD' ||
          node.classList.contains('header') ||
          node.closest('thead');

        if (isHeader) {
          node.style.backgroundColor = 'white';
        }

        if (node.classList.contains('dark:bg-gray-800')) {
          node.style.backgroundColor = 'white';
        }
        if (node.classList.contains('dark:border-gray-700')) {
          node.style.borderColor = '#e5e7eb';
        }
      }
    });

    try {
      const canvas = await html2canvas(clone, {
        backgroundColor: '#ffffff',
        scale: 1,
        logging: false,
        width: fixedWidth,
        height: fixedHeight,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.body.querySelector('#schedule-grid');
          if (clonedElement instanceof HTMLElement) {
            clonedElement.style.width = `${fixedWidth}px`;
            clonedElement.style.height = `${fixedHeight}px`;
          }
        }
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'grade-horarios.png';
      link.href = dataUrl;
      link.click();
    } finally {
      document.body.removeChild(container);
    }
  };


  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme: () => setIsDark(!isDark) }}>
      <div className="relative min-h-screen overflow-x-hidden dark:bg-gray-900 transition-colors duration-500">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 py-8 px-4 sm:px-6 lg:px-8"
        >
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />

          <div className="max-w-[1920px] mx-auto">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Simulatrícula
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Simulador de Matrículas Institucionais
              </p>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="xl:col-span-1"
              >
                <div className="border-[0.5px] border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
                  <h2 className="text-lg font-semibold mb-4 dark:text-white">Adicionar Turma</h2>
                  <ScheduleForm onSubmit={handleAddSchedule} />
                </div>
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="xl:col-span-4"
              >
                <div className="border-[0.5px] border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="text-lg font-semibold dark:text-white">Grade de Horários</h2>
                    <div className="flex flex-wrap gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSchedules([])}
                        className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
                        title="Limpar toda a grade"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Limpar
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveAsPNG}
                        className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-green-600 dark:text-green-400 bg-green-50/80 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200"
                        title="Salvar grade como imagem PNG"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Salvar PNG
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleExport}
                        className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
                        title="Exportar dados para arquivo JSON"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Exportar
                      </motion.button>
                      <motion.label
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-50/80 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 cursor-pointer transition-colors duration-200"
                        title="Importar dados de arquivo JSON"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Importar
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImport}
                          className="hidden"
                        />
                      </motion.label>
                    </div>
                  </div>

                  <div id="schedule-grid" className="overflow-x-auto rounded-lg">
                    <ScheduleGrid
                      schedules={schedules}
                      onScheduleClick={setSelectedSchedule}
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            <AnimatePresence>
              {selectedSchedule && (
                <ScheduleModal
                  schedule={selectedSchedule}
                  onClose={() => setSelectedSchedule(null)}
                  onUpdate={handleUpdateSchedule}
                  onDelete={handleDeleteSchedule}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;