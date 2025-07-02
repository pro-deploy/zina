import React from 'react';

interface UserMessageChipProps {
  message: string;
  timestamp: Date;
}

const UserMessageChip: React.FC<UserMessageChipProps> = ({ message, timestamp }) => {
  return (
    <div className="flex justify-end">
      <div className="w-[85%] sm:w-[60%] md:w-[40%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <div className="text-xs mb-1 opacity-70">
          Вы • {timestamp.toLocaleTimeString()}
        </div>
        <div className="whitespace-pre-line text-base sm:text-lg leading-relaxed">
          {message}
        </div>
      </div>
    </div>
  );
};

export default UserMessageChip; 