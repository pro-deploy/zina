import React, { useState, useEffect } from 'react';
import { User, Send, X } from 'lucide-react';

interface MobileInputProps {
  onSubmit: (message: string) => void;
  onClose: () => void;
  disabled?: boolean;
  initialValue?: string;
}

const MobileInput: React.FC<MobileInputProps> = ({
  onSubmit,
  onClose,
  disabled = false,
  initialValue = ''
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || disabled) return;
    
    onSubmit(inputValue.trim());
    setInputValue('');
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as React.FormEvent);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end lg:hidden">
      <div className="w-full bg-white rounded-t-3xl p-4 pb-8 animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Новое сообщение</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
            <User className="w-5 h-5 text-indigo-500 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Введите сообщение..."
              className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-base"
              disabled={disabled}
            />
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={disabled || !inputValue.trim()}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Отправить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MobileInput; 