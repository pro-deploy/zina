import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onInterimResult?: (text: string) => void;
  disabled?: boolean;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, onInterimResult, disabled = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Мемоизируем onInterimResult для избежания лишних ререндеров
  const memoizedOnInterimResult = useCallback((text: string) => {
    if (onInterimResult) {
      onInterimResult(text);
    }
  }, [onInterimResult]);

  useEffect(() => {
    // Проверяем поддержку Web Speech API
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setIsSupported(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      if (recognition) {
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'ru-RU';

        recognition.onstart = () => {
          setIsListening(true);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = function (this: SpeechRecognition, event: any) {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          // Отправляем промежуточные результаты в поле ввода
          if (interimTranscript) {
            memoizedOnInterimResult(interimTranscript);
          }

          // Отправляем только финальный результат
          if (finalTranscript.trim()) {
            onTranscript(finalTranscript.trim());
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          // Не останавливаем прослушивание при ошибке
        };

        recognition.onend = () => {
          // Автоматически перезапускаем прослушивание
          if (isListening) {
            try {
              recognition.start();
            } catch (error) {
              console.error('Failed to restart recognition:', error);
              setIsListening(false);
            }
          }
        };
      }
    }
  }, [onTranscript, memoizedOnInterimResult, isListening]);

  const toggleListening = () => {
    if (!isSupported || disabled) return;

    if (isListening) {
      // Останавливаем прослушивание
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      // Начинаем прослушивание
      try {
        recognitionRef.current?.start();
      } catch (error) {
        console.error('Failed to start recognition:', error);
      }
    }
  };

  if (!isSupported) {
    return (
      <button
        type="button"
        className="rounded-full p-1.5 sm:p-2 hover:bg-indigo-100 transition opacity-50 cursor-not-allowed flex-shrink-0"
        tabIndex={-1}
        aria-label="Диктовка не поддерживается"
        disabled
      >
        <Mic className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-indigo-400" />
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`rounded-full p-1.5 sm:p-2 transition flex-shrink-0 ${
        isListening 
          ? 'bg-red-500 hover:bg-red-600' 
          : 'hover:bg-indigo-100'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={toggleListening}
      disabled={disabled}
      tabIndex={-1}
      aria-label={isListening ? 'Остановить диктовку' : 'Начать диктовку'}
    >
      {isListening ? (
        <div className="relative">
          <MicOff className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
          <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse"></div>
        </div>
      ) : (
        <Mic className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-indigo-400" />
      )}
    </button>
  );
};

export default VoiceInput; 