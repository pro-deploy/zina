import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="w-full rounded-2xl px-3 py-2 sm:px-4 sm:py-3 overflow-hidden">
        <div className="text-xs mb-1 opacity-70">
          Зина • {new Date().toLocaleTimeString()}
        </div>
        <div className="space-y-2 sm:space-y-3">
          <div className="h-5 sm:h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div className="h-5 sm:h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
          <div className="h-5 sm:h-6 bg-gray-200 rounded animate-pulse w-5/6"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton; 