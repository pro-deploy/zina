import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  speed = 100, 
  className = "" 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Разбиваем текст на фразы (по предложениям или запятым)
  const phrases = text.split(/(?<=[.!?])\s+/).filter(phrase => phrase.trim());

  useEffect(() => {
    if (currentIndex < phrases.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + (currentIndex > 0 ? ' ' : '') + phrases[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, phrases, speed]);

  // Сброс при изменении текста
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  return (
    <span className={className}>
      {displayedText}
      {currentIndex < phrases.length && (
        <span className="animate-pulse text-orange-400">|</span>
      )}
    </span>
  );
};

export default TypewriterText; 