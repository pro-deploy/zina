export interface Product {
  name: string;
  img: string;
  price: string;
  weight: string;
  rating: number;
}

export interface Category {
  name: string;
  products: Product[];
}

export interface AssistantResponseData {
  userMessage: string;
  text: string;
  categories: Category[];
  suggestions: string[];
} 