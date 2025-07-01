import { Product } from '../types/assistant';

export function getProducts(): Product[] {
  return Array.from({ length: 30 }).map((_, i) => ({
    name: `Товар ${i + 1}`,
    img: `https://placehold.co/120x120?text=Product+${i + 1}`,
    price: `${(100 + i * 10).toFixed(2)}₽`,
    weight: `${(0.5 + i * 0.05).toFixed(2)} кг`,
    rating: +(4 + (i % 10) * 0.1).toFixed(2),
  }));
} 