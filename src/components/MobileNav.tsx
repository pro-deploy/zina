import React from 'react';
import { ShoppingCart, Mic, Send } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface MobileNavProps {
  onVoiceToggle: () => void;
  onSend: () => void;
  onInputChange: (v: string) => void;
  inputValue: string;
  isListening: boolean;
  disabled: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({
  onVoiceToggle,
  onSend,
  onInputChange,
  inputValue,
  isListening,
  disabled
}) => {
  const { getTotalItems } = useCart();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200/50 p-2 z-50 lg:hidden">
      <form className="flex items-center justify-between max-w-md mx-auto gap-2" onSubmit={e => { e.preventDefault(); onSend(); }}>
        <button
          type="button"
          className="flex items-center justify-center w-10 h-10 rounded-full transition-colors"
          onClick={onVoiceToggle}
          disabled={disabled}
          aria-label={isListening ? 'Остановить диктовку' : 'Начать диктовку'}
        >
          {isListening ? (
            <div className="relative">
              <Mic className="w-6 h-6 text-red-500" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          ) : (
            <Mic className="w-6 h-6 text-indigo-500" />
          )}
        </button>
        <input
          type="text"
          className="flex-1 bg-[#f8fafc] border border-indigo-200 rounded-full px-3 py-2 text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder:text-gray-400 shadow"
          placeholder="Сообщение..."
          value={inputValue}
          onChange={e => onInputChange(e.target.value)}
          disabled={disabled}
        />
        <button
          type="submit"
          className="flex items-center justify-center w-10 h-10 rounded-full transition-colors"
          disabled={disabled || !inputValue.trim()}
          aria-label="Отправить"
        >
          <Send className={`w-6 h-6 ${disabled || !inputValue.trim() ? 'text-gray-300' : 'text-indigo-500'}`} />
        </button>
        <button
          type="button"
          className="flex items-center justify-center w-10 h-10 rounded-full transition-colors relative"
          aria-label="Корзина"
          tabIndex={-1}
        >
          <ShoppingCart className="w-6 h-6 text-indigo-500" />
          {getTotalItems() > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {getTotalItems()}
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default MobileNav; 