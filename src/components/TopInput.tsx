import React from 'react';

const TopInput: React.FC = () => (
  <div className="flex items-center justify-between mb-4">
    <input
      className="w-full bg-[#f3f4f6] rounded-full px-5 py-2 text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder:text-gray-400"
      value="Что-то борща захотелось"
      readOnly
    />
    <button className="ml-2 text-gray-400 hover:text-gray-600 text-xl">✕</button>
  </div>
);

export default TopInput; 