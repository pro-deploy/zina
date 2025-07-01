import React from 'react';

interface IdeasBlockProps {
  suggestions: string[];
  onSuggestionClick?: (suggestion: string) => void;
}

const IdeasBlock: React.FC<IdeasBlockProps> = ({ suggestions, onSuggestionClick }) => (
  <>
    <div className="flex items-center gap-2 mb-2 mt-4">
      <span className="text-lg">💡</span>
      <span className="text-gray-700 font-medium">Что дальше? Вот идеи:</span>
    </div>
    <div className="flex flex-row flex-wrap gap-2 mb-2">
      {suggestions.map((s, i) => (
        <div
          key={i}
          className="bg-white rounded-full px-4 py-2 text-gray-800 text-sm font-medium shadow border border-orange-100 w-fit cursor-pointer hover:bg-orange-50 transition"
          onClick={() => onSuggestionClick && onSuggestionClick(s)}
        >
          {s}
        </div>
      ))}
    </div>
  </>
);

export default IdeasBlock; 