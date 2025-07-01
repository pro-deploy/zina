import React from 'react';
import CategoryBlock from './CategoryBlock';
import IdeasBlock from './IdeasBlock';
import { Category } from '../types/assistant';

interface AssistantResponseProps {
  userMessage: string;
  text: string;
  categories: Category[];
  suggestions: string[];
  onSuggestionClick?: (suggestion: string) => void;
}

const AssistantResponse: React.FC<AssistantResponseProps> = ({ text, categories, suggestions, onSuggestionClick }) => {
  return (
    <div className="w-full max-w-5xl">
      <div className="flex-1 min-h-0 overflow-auto pr-1">
        <div className="text-gray-800 text-base mb-4 whitespace-pre-line">
          {text}
        </div>
        {categories && categories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            {categories.map((cat) => (
              <CategoryBlock key={cat.name} {...cat} />
            ))}
          </div>
        )}
        {suggestions && suggestions.length > 0 && (
          <IdeasBlock suggestions={suggestions} onSuggestionClick={onSuggestionClick} />
        )}
      </div>
    </div>
  );
};

export default AssistantResponse; 