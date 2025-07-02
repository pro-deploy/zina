import React from 'react';

interface IdeasBlockProps {
  suggestions: string[];
  onSuggestionClick?: (suggestion: string) => void;
  isVisible?: boolean;
}

const IdeasBlock: React.FC<IdeasBlockProps> = ({ suggestions, onSuggestionClick, isVisible = true }) => (
  <>
    <div className={`flex items-center gap-2 mb-2 mt-3 sm:mt-4 transition-all duration-500 ease-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
    }`}>
      <span className="text-base sm:text-lg">💡</span>
      <span className="text-gray-700 font-medium text-sm sm:text-base">Что дальше? Вот идеи:</span>
    </div>
    <div className="flex flex-row flex-wrap gap-2 mb-2">
      {suggestions.map((s, i) => (
        <div
          key={i}
          className={`bg-white rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-gray-800 text-xs sm:text-sm font-medium shadow-sm border border-indigo-100 w-fit cursor-pointer hover:bg-indigo-50 transition-all duration-500 ease-out ${
            isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
          }`}
          style={{
            transitionDelay: `${i * 100}ms`,
            transformOrigin: 'center'
          }}
          onClick={() => onSuggestionClick && onSuggestionClick(s)}
        >
          {s}
        </div>
      ))}
    </div>
  </>
);

export default IdeasBlock; 