import React from 'react';

interface UserMessageChipProps {
  text: string;
}

const UserMessageChip: React.FC<UserMessageChipProps> = ({ text }) => (
  <div className="mb-4 flex justify-end">
    <div className="bg-gradient-to-r from-[#fbeee6] to-[#ffe5e0] border border-orange-200 rounded-full px-5 py-2 text-base font-medium text-gray-800 shadow-sm">
      {text}
    </div>
  </div>
);

export default UserMessageChip; 