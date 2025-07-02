import { Product } from '../types/assistant';

export interface VoiceCommand {
  action: 'open_category' | 'add_to_cart' | 'show_products' | 'close_category';
  target?: string;
  confidence: number;
}

export function parseVoiceCommand(transcript: string): VoiceCommand | null {
  const lowerTranscript = transcript.toLowerCase().trim();
  
  // Команды для открытия категорий
  if (lowerTranscript.includes('раскрой') || lowerTranscript.includes('открой') || lowerTranscript.includes('покажи') || lowerTranscript.includes('открыть') || lowerTranscript.includes('разверни') || lowerTranscript.includes('выбери')) {
    if (lowerTranscript.includes('мясо') || lowerTranscript.includes('птица')) {
      return { action: 'open_category', target: 'Мясо и птица', confidence: 0.9 };
    }
    if (lowerTranscript.includes('овощ') || lowerTranscript.includes('овощи')) {
      return { action: 'open_category', target: 'Овощи', confidence: 0.9 };
    }
    if (lowerTranscript.includes('молоч') || lowerTranscript.includes('молоко')) {
      return { action: 'open_category', target: 'Молочные продукты', confidence: 0.9 };
    }
    if (lowerTranscript.includes('фрукт') || lowerTranscript.includes('фрукты')) {
      return { action: 'open_category', target: 'Фрукты', confidence: 0.9 };
    }
    if (lowerTranscript.includes('хлеб') || lowerTranscript.includes('выпечка')) {
      return { action: 'open_category', target: 'Хлеб и выпечка', confidence: 0.9 };
    }
  }
  
  // Команды для добавления в корзину
  const addToCartPatterns = [
    'добавь', 'положи', 'купи', 'в корзину', 'купить'
  ];
  
  const hasAddToCartCommand = addToCartPatterns.some(pattern => lowerTranscript.includes(pattern));
  
  if (hasAddToCartCommand) {
    // Ищем названия товаров
    const products = [
      'курица', 'говядина', 'свинина', 'индейка', 'баранина',
      'помидор', 'огурец', 'картофель', 'морковь', 'лук',
      'молоко', 'сыр', 'творог', 'сметана', 'кефир',
      'яблоко', 'банан', 'апельсин', 'груша', 'виноград',
      'хлеб', 'булка', 'батон', 'пирожок', 'печенье'
    ];
    
    for (const product of products) {
      if (lowerTranscript.includes(product)) {
        return { action: 'add_to_cart', target: product, confidence: 0.8 };
      }
    }
  }
  
  // Команды для показа товаров
  if (lowerTranscript.includes('товары') || lowerTranscript.includes('продукты') || lowerTranscript.includes('что есть')) {
    return { action: 'show_products', confidence: 0.7 };
  }
  
  // Команды для закрытия категорий
  if (lowerTranscript.includes('закрой') || lowerTranscript.includes('скрой') || lowerTranscript.includes('убери') || lowerTranscript.includes('закрыть')) {
    return { action: 'close_category', confidence: 0.8 };
  }
  
  return null;
}

export function findProductByName(name: string, products: Product[]): Product | null {
  const lowerName = name.toLowerCase();
  
  return products.find(product => 
    product.name.toLowerCase().includes(lowerName) ||
    lowerName.includes(product.name.toLowerCase())
  ) || null;
} 