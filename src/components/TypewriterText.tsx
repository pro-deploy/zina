import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ text, speed = 1 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Разбиваем текст на слова
  const words = text.split(' ');

  useEffect(() => {
    if (currentIndex < words.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => 
          prev + (currentIndex === 0 ? '' : ' ') + words[currentIndex]
        );
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, words, speed]);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  return (
    <span className="text-base sm:text-lg leading-relaxed">
      {displayedText}
      {currentIndex < words.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

export default TypewriterText; 