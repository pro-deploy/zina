import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="w-full max-w-5xl">
        {/* Скелетон для текста */}
        <div className="space-y-3 mb-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: '60%' }}></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: '80%' }}></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: '70%' }}></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: '50%' }}></div>
        </div>

        {/* Скелетон для категорий */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              {/* Заголовок категории */}
              <div className="h-6 bg-gray-200 rounded animate-pulse" style={{ width: '40%' }}></div>
              
              {/* Товары в категории */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="w-32 flex-shrink-0 bg-gray-100 rounded-2xl p-2">
                    {/* Изображение товара */}
                    <div className="w-20 h-20 bg-gray-200 rounded-xl mb-1 animate-pulse"></div>
                    {/* Название товара */}
                    <div className="h-3 bg-gray-200 rounded mb-1 animate-pulse"></div>
                    {/* Рейтинг */}
                    <div className="h-3 bg-gray-200 rounded mb-1 animate-pulse" style={{ width: '60%' }}></div>
                    {/* Вес */}
                    <div className="h-3 bg-gray-200 rounded mb-1 animate-pulse" style={{ width: '40%' }}></div>
                    {/* Цена */}
                    <div className="h-4 bg-gray-200 rounded mb-1 animate-pulse" style={{ width: '70%' }}></div>
                    {/* Кнопка */}
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Скелетон для предложений */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: '30%' }}></div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded-full animate-pulse" style={{ width: `${120 + i * 20}px` }}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton; 