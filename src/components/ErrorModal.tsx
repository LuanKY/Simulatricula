import React from 'react';
import { X, AlertCircle } from 'lucide-react';

interface Props {
  message: string;
  onClose: () => void;
}

export function ErrorModal({ message, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <h2 className="text-lg font-semibold dark:text-white">Erro no Código de Horário</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <p className="text-gray-600 dark:text-gray-300 mb-4">{message}</p>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Formato correto:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
              <li>"35T12" - Terça e Quinta, Tarde, 1º e 2º horários</li>
              <li>"4N34" - Quarta, Noite, 3º e 4º horários</li>
              <li>"35T3456" - Terça e Quinta, Tarde, 3º ao 6º horários</li>
              <li>"356N1234" - Terça, Quinta e Sexta, Noite, 1º ao 4º horários</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}