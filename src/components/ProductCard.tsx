import React from 'react';
import Image from 'next/image';
import { Product } from '../types/assistant';

const ProductCard: React.FC<Product> = ({ name, img, price, weight, rating }) => (
  <div className="bg-white rounded-2xl shadow border border-orange-100 p-2 w-32 flex-shrink-0 flex flex-col items-center">
    <Image 
      src={img} 
      alt={name} 
      width={80}
      height={80}
      className="object-contain rounded-xl mb-1" 
    />
    <div className="text-xs font-medium text-gray-800 text-center line-clamp-2 mb-1">{name}</div>
    <div className="flex items-center gap-1 text-xs text-orange-600 mb-1">
      <span>★</span>
      <span>{rating}</span>
    </div>
    <div className="text-xs text-gray-500 mb-1">{weight}</div>
    <div className="text-base font-bold text-gray-900 mb-1">{price}</div>
    <button className="w-full bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-lg py-1 text-xs font-semibold hover:from-orange-500 hover:to-red-500 transition">В корзину</button>
  </div>
);

export default ProductCard; 