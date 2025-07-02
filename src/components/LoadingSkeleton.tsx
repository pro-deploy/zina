import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="w-full max-w-3xl">
        {/* Скелетон для текста - одна строка */}
        <div className="space-y-2 mb-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: '70%' }}></div>
        </div>

        {/* Скелетон для категорий - только одна категория с 3 товарами */}
        <div className="space-y-2">
          {/* Заголовок категории */}
          <div className="h-6 bg-gray-200 rounded animate-pulse" style={{ width: '30%' }}></div>
          
          {/* Товары в категории - только 3 товара */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[1, 2, 3].map((j) => (
              <div key={j} className="w-24 flex-shrink-0 bg-gray-100 rounded-xl p-2">
                {/* Изображение товара */}
                <div className="w-16 h-16 bg-gray-200 rounded-lg mb-1 animate-pulse"></div>
                {/* Название товара */}
                <div className="h-3 bg-gray-200 rounded mb-1 animate-pulse"></div>
                {/* Цена */}
                <div className="h-3 bg-gray-200 rounded animate-pulse" style={{ width: '60%' }}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton; 