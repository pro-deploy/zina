import React from 'react';

interface BottomInputProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

const BottomInput: React.FC<BottomInputProps> = ({ value, onChange, onSend, disabled }) => {
  const safeValue = String(value || '');
  return (
    <form
      className="mt-4 flex gap-2"
      onSubmit={e => {
        e.preventDefault();
        if (!disabled && safeValue.trim()) onSend();
      }}
    >
      <input
        className="flex-1 bg-[#f3f4f6] rounded-full px-5 py-2 text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder:text-gray-400"
        placeholder="Чем вам помочь?"
        value={safeValue}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
      />
      <button
        type="submit"
        className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full px-5 py-2 font-semibold shadow hover:from-orange-600 hover:to-red-600 transition disabled:opacity-50"
        disabled={disabled || !safeValue.trim()}
      >
        ➤
      </button>
    </form>
  );
};

export default BottomInput; 