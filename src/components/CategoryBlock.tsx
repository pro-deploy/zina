import React, { useState, useRef, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types/assistant';
import { getProductsByCategory } from '../mock/categoryDictionary';

interface CategoryBlockProps {
  name: string;
  products: Product[];
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

const CategoryBlock: React.FC<CategoryBlockProps> = ({ name, isOpen, onToggle }) => {
  const [open, setOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Используем внешнее управление, если предоставлено
  const isCategoryOpen = isOpen !== undefined ? isOpen : open;
  const setIsCategoryOpen = (newState: boolean) => {
    if (onToggle) {
      onToggle(newState);
    } else {
      setOpen(newState);
    }
  };

  // Анимация при изменении состояния
  useEffect(() => {
    if (isCategoryOpen) {
      setIsAnimating(true);
      // Небольшая задержка для плавного начала анимации
      setTimeout(() => setIsAnimating(false), 50);
    }
  }, [isCategoryOpen]);

  // Получаем товары из справочника по названию категории
  const categoryProducts = getProductsByCategory(name);
  // Ограничиваем максимум 30 товаров
  const limitedProducts = categoryProducts.slice(0, 30);
  // Делим на ряды по 10
  const rows = chunkArray(limitedProducts, 10);

  return (
    <div className="overflow-hidden">
      <button
        className="w-full flex items-center justify-between text-left bg-gradient-to-r from-white to-indigo-50/30 rounded-xl px-3 py-1.5 text-gray-700 text-sm font-medium shadow-sm border border-indigo-200/50 hover:shadow-md hover:border-indigo-300/60 transition-all duration-300 group relative z-10"
        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
        type="button"
      >
        <span className="font-semibold">{name}</span>
        <span className={`text-indigo-400 group-hover:text-indigo-500 transition-all duration-300 transform ${isCategoryOpen ? 'rotate-180' : 'rotate-0'}`}>
          ▾
        </span>
      </button>
      
      <div 
        ref={contentRef}
        className={`transition-all duration-500 ease-out ${
          isCategoryOpen 
            ? 'max-h-[2000px] opacity-100 translate-y-0' 
            : 'max-h-0 opacity-0 -translate-y-4'
        }`}
        style={{
          transformOrigin: 'top',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {rows.length > 0 && (
          <div className="space-y-4 mt-3 mb-2">
            {rows.map((row, rowIdx) => (
              <div
                key={rowIdx}
                className={`flex flex-nowrap gap-3 overflow-x-auto pb-2 transition-all duration-700 ease-out ${
                  isCategoryOpen 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: `${rowIdx * 100}ms`,
                  transformOrigin: 'top'
                }}
              >
                {row.map((prod, prodIdx) => (
                  <div
                    key={prod.name}
                    className={`transition-all duration-500 ease-out ${
                      isCategoryOpen 
                        ? 'opacity-100 scale-100 translate-y-0' 
                        : 'opacity-0 scale-95 translate-y-4'
                    }`}
                    style={{
                      transitionDelay: `${(rowIdx * 100) + (prodIdx * 50)}ms`,
                      transformOrigin: 'top'
                    }}
                  >
                    <ProductCard {...prod} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryBlock; 