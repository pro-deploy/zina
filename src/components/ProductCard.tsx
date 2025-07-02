import React from 'react';
import Image from 'next/image';
import { Product } from '../types/assistant';
import { useCart } from '../contexts/CartContext';

const ProductCard: React.FC<Product> = ({ name, img, price, weight, rating }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ name, img, price, weight, rating });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-2 w-28 sm:w-32 flex-shrink-0 flex flex-col items-center hover:shadow-md transition-shadow">
      <Image 
        src={img} 
        alt={name} 
        width={64}
        height={64}
        className="object-contain rounded-lg mb-1.5 sm:mb-2 w-12 h-12 sm:w-16 sm:h-16" 
      />
      <div className="text-xs font-medium text-gray-800 text-center line-clamp-2 mb-1 leading-tight">{name}</div>
      <div className="flex items-center gap-0.5 text-xs text-indigo-600 mb-1">
        <span>★</span>
        <span>{rating}</span>
      </div>
      <div className="text-xs text-gray-500 mb-1">{weight}</div>
      <div className="text-sm sm:text-base font-bold text-gray-900 mb-1.5">{price}</div>
      <button 
        onClick={handleAddToCart}
        className="w-full bg-gradient-to-r from-indigo-400 to-purple-400 text-white rounded-lg py-1.5 text-xs font-semibold hover:from-indigo-500 hover:to-purple-500 transition-colors"
      >
        В корзину
      </button>
    </div>
  );
};

export default ProductCard; 