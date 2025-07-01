import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types/assistant';
import { getProductsByCategory } from '../mock/categoryDictionary';

interface CategoryBlockProps {
  name: string;
  products: Product[];
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

const CategoryBlock: React.FC<CategoryBlockProps> = ({ name, products }) => {
  const [open, setOpen] = useState(false);
  // Получаем товары из справочника по названию категории
  const categoryProducts = getProductsByCategory(name);
  // Ограничиваем максимум 30 товаров
  const limitedProducts = categoryProducts.slice(0, 30);
  // Делим на ряды по 10
  const rows = chunkArray(limitedProducts, 10);

  return (
    <div>
      <button
        className="w-full flex items-center justify-between text-left font-semibold text-gray-800 py-2 px-2 rounded-lg hover:bg-orange-50 transition"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <span>{name}</span>
        <span>{open ? '▴' : '▾'}</span>
      </button>
      {open && rows.length > 0 && (
        <div className="space-y-3 mt-2 mb-2">
          {rows.map((row, idx) => (
            <div
              key={idx}
              className="flex flex-nowrap gap-3 overflow-x-auto pb-2"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {row.map((prod) => (
                <ProductCard key={prod.name} {...prod} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryBlock; 