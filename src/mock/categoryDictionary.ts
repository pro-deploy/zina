import { Product } from '../types/assistant';
import { getProducts } from './getProducts';

// Справочник категорий продуктов с плейсхолдерами
export const categoryDictionary: Record<string, Product[]> = {
  // Основные категории продуктов
  "Мясо и птица": [
    { name: "Говядина", img: "https://placehold.co/120x120?text=Beef", price: "450₽", weight: "0.5 кг", rating: 4.5 },
    { name: "Свинина", img: "https://placehold.co/120x120?text=Pork", price: "380₽", weight: "0.5 кг", rating: 4.3 },
    { name: "Курица", img: "https://placehold.co/120x120?text=Chicken", price: "280₽", weight: "1 кг", rating: 4.6 },
    { name: "Индейка", img: "https://placehold.co/120x120?text=Turkey", price: "420₽", weight: "0.8 кг", rating: 4.4 },
    { name: "Баранина", img: "https://placehold.co/120x120?text=Lamb", price: "520₽", weight: "0.5 кг", rating: 4.2 }
  ],
  
  "Овощи": [
    { name: "Картофель", img: "https://placehold.co/120x120?text=Potato", price: "45₽", weight: "1 кг", rating: 4.7 },
    { name: "Морковь", img: "https://placehold.co/120x120?text=Carrot", price: "35₽", weight: "1 кг", rating: 4.5 },
    { name: "Лук", img: "https://placehold.co/120x120?text=Onion", price: "25₽", weight: "1 кг", rating: 4.3 },
    { name: "Помидоры", img: "https://placehold.co/120x120?text=Tomato", price: "120₽", weight: "1 кг", rating: 4.6 },
    { name: "Огурцы", img: "https://placehold.co/120x120?text=Cucumber", price: "85₽", weight: "1 кг", rating: 4.4 }
  ],
  
  "Специи и приправы": [
    { name: "Соль", img: "https://placehold.co/120x120?text=Salt", price: "15₽", weight: "1 кг", rating: 4.8 },
    { name: "Перец черный", img: "https://placehold.co/120x120?text=Pepper", price: "45₽", weight: "50 г", rating: 4.6 },
    { name: "Лавровый лист", img: "https://placehold.co/120x120?text=Bay", price: "25₽", weight: "10 г", rating: 4.4 },
    { name: "Чеснок", img: "https://placehold.co/120x120?text=Garlic", price: "55₽", weight: "0.2 кг", rating: 4.5 },
    { name: "Укроп", img: "https://placehold.co/120x120?text=Dill", price: "35₽", weight: "50 г", rating: 4.3 }
  ],
  
  "Молочные продукты": [
    { name: "Молоко", img: "https://placehold.co/120x120?text=Milk", price: "85₽", weight: "1 л", rating: 4.6 },
    { name: "Сметана", img: "https://placehold.co/120x120?text=Sour", price: "65₽", weight: "400 г", rating: 4.4 },
    { name: "Творог", img: "https://placehold.co/120x120?text=Cottage", price: "120₽", weight: "0.5 кг", rating: 4.5 },
    { name: "Сыр", img: "https://placehold.co/120x120?text=Cheese", price: "280₽", weight: "0.3 кг", rating: 4.7 },
    { name: "Йогурт", img: "https://placehold.co/120x120?text=Yogurt", price: "75₽", weight: "400 г", rating: 4.3 }
  ],
  
  "Мука и крупы": [
    { name: "Мука пшеничная", img: "https://placehold.co/120x120?text=Flour", price: "45₽", weight: "1 кг", rating: 4.6 },
    { name: "Рис", img: "https://placehold.co/120x120?text=Rice", price: "85₽", weight: "1 кг", rating: 4.5 },
    { name: "Гречка", img: "https://placehold.co/120x120?text=Buckwheat", price: "95₽", weight: "1 кг", rating: 4.7 },
    { name: "Овсянка", img: "https://placehold.co/120x120?text=Oatmeal", price: "65₽", weight: "0.8 кг", rating: 4.4 },
    { name: "Макароны", img: "https://placehold.co/120x120?text=Pasta", price: "55₽", weight: "0.5 кг", rating: 4.3 }
  ],
  
  "Зелень": [
    { name: "Петрушка", img: "https://placehold.co/120x120?text=Parsley", price: "45₽", weight: "100 г", rating: 4.5 },
    { name: "Укроп", img: "https://placehold.co/120x120?text=Dill", price: "35₽", weight: "100 г", rating: 4.4 },
    { name: "Базилик", img: "https://placehold.co/120x120?text=Basil", price: "55₽", weight: "50 г", rating: 4.6 },
    { name: "Кинза", img: "https://placehold.co/120x120?text=Cilantro", price: "40₽", weight: "50 г", rating: 4.3 },
    { name: "Руккола", img: "https://placehold.co/120x120?text=Arugula", price: "85₽", weight: "100 г", rating: 4.7 }
  ],
  
  "Масла и соусы": [
    { name: "Подсолнечное масло", img: "https://placehold.co/120x120?text=Oil", price: "95₽", weight: "1 л", rating: 4.5 },
    { name: "Оливковое масло", img: "https://placehold.co/120x120?text=Olive", price: "280₽", weight: "0.5 л", rating: 4.8 },
    { name: "Майонез", img: "https://placehold.co/120x120?text=Mayo", price: "65₽", weight: "400 г", rating: 4.2 },
    { name: "Кетчуп", img: "https://placehold.co/120x120?text=Ketchup", price: "55₽", weight: "350 г", rating: 4.4 },
    { name: "Соевый соус", img: "https://placehold.co/120x120?text=Soy", price: "85₽", weight: "250 мл", rating: 4.6 }
  ],
  
  "Яйца и масло": [
    { name: "Яйца куриные", img: "https://placehold.co/120x120?text=Eggs", price: "120₽", weight: "10 шт", rating: 4.6 },
    { name: "Масло сливочное", img: "https://placehold.co/120x120?text=Butter", price: "180₽", weight: "0.4 кг", rating: 4.5 },
    { name: "Маргарин", img: "https://placehold.co/120x120?text=Margarine", price: "95₽", weight: "0.4 кг", rating: 4.2 },
    { name: "Яйца перепелиные", img: "https://placehold.co/120x120?text=Quail", price: "85₽", weight: "20 шт", rating: 4.7 },
    { name: "Масло топленое", img: "https://placehold.co/120x120?text=Ghee", price: "220₽", weight: "0.3 кг", rating: 4.4 }
  ],
  
  "Белковые продукты": [
    { name: "Тунец", img: "https://placehold.co/120x120?text=Tuna", price: "180₽", weight: "0.2 кг", rating: 4.6 },
    { name: "Лосось", img: "https://placehold.co/120x120?text=Salmon", price: "450₽", weight: "0.3 кг", rating: 4.8 },
    { name: "Творог", img: "https://placehold.co/120x120?text=Cottage", price: "120₽", weight: "0.5 кг", rating: 4.5 },
    { name: "Куриная грудка", img: "https://placehold.co/120x120?text=Breast", price: "320₽", weight: "0.6 кг", rating: 4.7 },
    { name: "Яйца", img: "https://placehold.co/120x120?text=Eggs", price: "120₽", weight: "10 шт", rating: 4.6 }
  ],
  
  "Свежие овощи": [
    { name: "Брокколи", img: "https://placehold.co/120x120?text=Broccoli", price: "95₽", weight: "0.4 кг", rating: 4.6 },
    { name: "Шпинат", img: "https://placehold.co/120x120?text=Spinach", price: "85₽", weight: "0.3 кг", rating: 4.5 },
    { name: "Цукини", img: "https://placehold.co/120x120?text=Zucchini", price: "65₽", weight: "0.5 кг", rating: 4.4 },
    { name: "Болгарский перец", img: "https://placehold.co/120x120?text=Pepper", price: "75₽", weight: "0.4 кг", rating: 4.6 },
    { name: "Баклажаны", img: "https://placehold.co/120x120?text=Eggplant", price: "85₽", weight: "0.5 кг", rating: 4.3 }
  ],
  
  "Цельнозерновые": [
    { name: "Хлеб цельнозерновой", img: "https://placehold.co/120x120?text=Bread", price: "65₽", weight: "0.4 кг", rating: 4.6 },
    { name: "Киноа", img: "https://placehold.co/120x120?text=Quinoa", price: "180₽", weight: "0.3 кг", rating: 4.7 },
    { name: "Булгур", img: "https://placehold.co/120x120?text=Bulgur", price: "95₽", weight: "0.4 кг", rating: 4.5 },
    { name: "Полба", img: "https://placehold.co/120x120?text=Spelt", price: "120₽", weight: "0.4 кг", rating: 4.4 },
    { name: "Ячмень", img: "https://placehold.co/120x120?text=Barley", price: "75₽", weight: "0.5 кг", rating: 4.3 }
  ]
};

// Функция для получения товаров по названию категории
export function getProductsByCategory(categoryName: string): Product[] {
  return categoryDictionary[categoryName] || getProducts();
}

// Функция для получения всех доступных категорий
export function getAvailableCategories(): string[] {
  return Object.keys(categoryDictionary);
} 