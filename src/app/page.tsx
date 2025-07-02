'use client';

import { useState, useRef, useEffect } from 'react';
// import AssistantResponse from '../components/AssistantResponse';
import LoadingSkeleton from '../components/LoadingSkeleton';
import CategoryBlock from '../components/CategoryBlock';
import IdeasBlock from '../components/IdeasBlock';
import TypewriterText from '../components/TypewriterText';
import MobileNav from '../components/MobileNav';
import { CartProvider, useCart } from '../contexts/CartContext';
import VoiceInput from '../components/VoiceInput';
import { parseVoiceCommand, findProductByName, VoiceCommand } from '../utils/voiceCommands';

import { Category, AssistantResponseData } from '../types/assistant';
import { User, ShoppingCart, Send } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  categories?: Category[];
  suggestions?: string[];
}

function extractJsonBlock(text: string): unknown {
  // Ищем блок ```json ... ```
  const jsonStart = text.indexOf('```json');
  if (jsonStart === -1) return null;
  
  // Ищем конец JSON блока
  const jsonEnd = text.indexOf('```', jsonStart + 7);
  if (jsonEnd === -1) return null;
  
  // Извлекаем JSON содержимое
  let jsonContent = text.substring(jsonStart + 7, jsonEnd).trim();
  
  try {
    return JSON.parse(jsonContent);
  } catch (error) {
    console.error('JSON parsing error:', error);
    console.log('JSON content length:', jsonContent.length);
    console.log('JSON content preview:', jsonContent.substring(0, 500));
    // Fallback: пробуем вытащить категории вручную
    try {
      // Ищем все объекты категорий
      const categoryRegex = /\{\s*"name"\s*:\s*"([^"]+)",\s*"products"\s*:\s*\[([\s\S]*?)\]\s*\}/g;
      const productRegex = /\{\s*"name"\s*:\s*"([^"]+)",\s*"img"\s*:\s*"([^"]*)",\s*"price"\s*:\s*"([^"]+)",\s*"weight"\s*:\s*"([^"]+)",\s*"rating"\s*:\s*([0-9.]+)\s*\}/g;
      const categories = [];
      let match;
      while ((match = categoryRegex.exec(jsonContent)) !== null) {
        const catName = match[1];
        const productsRaw = match[2];
        const products = [];
        let prodMatch;
        while ((prodMatch = productRegex.exec(productsRaw)) !== null) {
          products.push({
            name: prodMatch[1],
            img: prodMatch[2],
            price: prodMatch[3],
            weight: prodMatch[4],
            rating: parseFloat(prodMatch[5])
          });
        }
        categories.push({ name: catName, products });
      }
      if (categories.length > 0) {
        return { categories, suggestions: [] };
      }
    } catch (fallbackError) {
      console.error('Fallback JSON extraction error:', fallbackError);
    }
    return null;
  }
}

function cleanTextFromJson(text: string): string {
  // Удаляем JSON блок из текста
  const jsonStart = text.indexOf('```json');
  if (jsonStart === -1) return text.trim();
  
  const jsonEnd = text.indexOf('```', jsonStart + 7);
  if (jsonEnd === -1) return text.trim();
  
  // Возвращаем текст до JSON блока и после него
  const beforeJson = text.substring(0, jsonStart).trim();
  const afterJson = text.substring(jsonEnd + 3).trim();
  
  return (beforeJson + ' ' + afterJson).trim();
}

function HomeContent() {
  const { getTotalItems, addToCart } = useCart();
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());
  const [isListening, setIsListening] = useState(false);
  

  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentResponse, setCurrentResponse] = useState<AssistantResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Автоматическая прокрутка к началу последнего сообщения
  useEffect(() => {
    if (chatContainerRef.current) {
      // Используем setTimeout для гарантии того, что DOM обновился
      setTimeout(() => {
        if (chatContainerRef.current) {
          const container = chatContainerRef.current;
          const lastMessage = container.lastElementChild;
          if (lastMessage) {
            const containerRect = container.getBoundingClientRect();
            const scrollTop = (lastMessage as HTMLElement).offsetTop - containerRect.height * 0.2; // 20% от высоты контейнера
            container.scrollTop = Math.max(0, scrollTop);
          }
        }
      }, 100);
    }
  }, [chatHistory, currentResponse, loading]);

  const handleVoiceInput = (transcript: string) => {
    // Сначала проверяем, не является ли это голосовой командой
    const command = parseVoiceCommand(transcript);
    
    if (command) {
      handleVoiceCommand(command);
    } else {
      // Если это не команда, отправляем как обычное сообщение
      setTimeout(() => {
        handleSendMessage(transcript);
      }, 2000);
    }
  };

  const handleVoiceCommand = (command: VoiceCommand) => {
    console.log('Voice command:', command);
    
    switch (command.action) {
      case 'open_category':
        if (command.target) {
          setOpenCategories(prev => new Set([...prev, command.target!]));
        }
        break;
        
      case 'close_category':
        setOpenCategories(new Set());
        break;
        
      case 'add_to_cart':
        if (command.target) {
          // Ищем товар во всех открытых категориях
          const allProducts = currentResponse?.categories?.flatMap((cat: Category) => cat.products) || [];
          const product = findProductByName(command.target, allProducts);
          
          if (product) {
            addToCart(product);
            console.log(`Added ${product.name} to cart`);
          }
        }
        break;
        
      case 'show_products':
        // Открываем все категории
        if (currentResponse?.categories) {
          setOpenCategories(new Set(currentResponse.categories.map((cat: Category) => cat.name)));
        }
        break;
    }
  };

  const handleInterimVoiceInput = (transcript: string) => {
    // Показываем промежуточные результаты в поле ввода
    setInputValue(transcript);
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    const userMessage = message.trim();
    
    // Добавляем сообщение пользователя в историю
    const newUserMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, newUserMessage]);
    setCurrentResponse(null);
    setLoading(true);
    
    try {
      // Подготавливаем историю чата для API
      const chatHistoryForAPI = chatHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          chatHistory: chatHistoryForAPI 
        }),
      });
      const data = await res.json();
      console.log('AI Response:', data.response);
      
      const parsed = extractJsonBlock(data.response);
      console.log('Parsed JSON:', parsed);
      console.log('Response length:', data.response.length);
      console.log('Response preview:', data.response.substring(0, 500) + '...');
      console.log('JSON start position:', data.response.indexOf('```json'));
      console.log('JSON end position:', data.response.lastIndexOf('```'));
      
      if (parsed && typeof parsed === 'object' && parsed !== null && 'categories' in parsed && 'suggestions' in parsed) {
        const parsedData = parsed as { categories: Category[]; suggestions: string[] };
        console.log('Parsed data:', parsedData);
        
        // Проверяем валидность структуры
        if (!Array.isArray(parsedData.categories) || !Array.isArray(parsedData.suggestions)) {
          console.error('Invalid JSON structure: categories or suggestions are not arrays');
          throw new Error('Invalid JSON structure');
        }
        
        // Используем товары, которые вернула нейросеть, без дополнительной обработки
        console.log('Categories with products from AI:', parsedData.categories);
        
        // Добавляем ответ ассистента в историю чата с товарами
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: cleanTextFromJson(data.response),
          timestamp: new Date(),
          categories: parsedData.categories,
          suggestions: parsedData.suggestions,
        };
        setChatHistory(prev => [...prev, assistantMessage]);
        
        setCurrentResponse({
          userMessage: userMessage,
          text: cleanTextFromJson(data.response),
          categories: parsedData.categories,
          suggestions: parsedData.suggestions,
        });
      } else {
        console.log('No valid JSON found, checking for partial JSON...');
        
        // Проверяем, есть ли частичный JSON в ответе
        const hasJsonStart = data.response.includes('```json');
        const hasJsonEnd = data.response.includes('```');
        
        if (hasJsonStart && hasJsonEnd) {
          console.log('Partial JSON detected, trying to extract what we can...');
          // Пытаемся извлечь то, что можем из частичного JSON
          const jsonStart = data.response.indexOf('```json');
          const jsonEnd = data.response.lastIndexOf('```');
          
          if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
            const partialJson = data.response.substring(jsonStart + 7, jsonEnd).trim();
            console.log('Partial JSON content:', partialJson.substring(0, 200) + '...');
            
            // Проверяем, обрезался ли JSON (есть ли незакрытые скобки)
            const openBraces = (partialJson.match(/\{/g) || []).length;
            const closeBraces = (partialJson.match(/\}/g) || []).length;
            const openBrackets = (partialJson.match(/\[/g) || []).length;
            const closeBrackets = (partialJson.match(/\]/g) || []).length;
            
            console.log('JSON structure check:', { openBraces, closeBraces, openBrackets, closeBrackets });
            
            // Если JSON обрезался, показываем fallback
            if (openBraces !== closeBraces || openBrackets !== closeBrackets) {
              console.log('JSON is truncated, showing fallback products');
              
              // Определяем тип запроса для показа релевантных товаров
              const responseText = data.response.toLowerCase();
              let fallbackCategories = [];
              
              if (responseText.includes('борщ') || responseText.includes('суп')) {
                fallbackCategories = [
                  {
                    name: "Мясо и птица",
                    products: [
                      { name: "Говядина", img: "https://placehold.co/120x120?text=Beef", price: "450₽", weight: "0.5 кг", rating: 4.5 },
                      { name: "Свинина", img: "https://placehold.co/120x120?text=Pork", price: "380₽", weight: "0.5 кг", rating: 4.3 }
                    ]
                  },
                  {
                    name: "Овощи",
                    products: [
                      { name: "Картофель", img: "https://placehold.co/120x120?text=Potato", price: "45₽", weight: "1 кг", rating: 4.7 },
                      { name: "Морковь", img: "https://placehold.co/120x120?text=Carrot", price: "35₽", weight: "1 кг", rating: 4.5 },
                      { name: "Лук", img: "https://placehold.co/120x120?text=Onion", price: "25₽", weight: "1 кг", rating: 4.3 },
                      { name: "Помидоры", img: "https://placehold.co/120x120?text=Tomato", price: "120₽", weight: "1 кг", rating: 4.6 }
                    ]
                  },
                  {
                    name: "Специи и приправы",
                    products: [
                      { name: "Соль", img: "https://placehold.co/120x120?text=Salt", price: "15₽", weight: "1 кг", rating: 4.8 },
                      { name: "Перец черный", img: "https://placehold.co/120x120?text=Pepper", price: "45₽", weight: "50 г", rating: 4.6 },
                      { name: "Лавровый лист", img: "https://placehold.co/120x120?text=Bay", price: "25₽", weight: "10 г", rating: 4.4 },
                      { name: "Чеснок", img: "https://placehold.co/120x120?text=Garlic", price: "55₽", weight: "0.2 кг", rating: 4.5 }
                    ]
                  },
                  {
                    name: "Зелень",
                    products: [
                      { name: "Петрушка", img: "https://placehold.co/120x120?text=Parsley", price: "45₽", weight: "100 г", rating: 4.5 },
                      { name: "Укроп", img: "https://placehold.co/120x120?text=Dill", price: "35₽", weight: "100 г", rating: 4.4 }
                    ]
                  }
                ];
              } else {
                // Общий fallback для других запросов
                fallbackCategories = [
                  {
                    name: "Основные продукты",
                    products: [
                      { name: "Яйца куриные", img: "https://placehold.co/120x120?text=Eggs", price: "120₽", weight: "10 шт", rating: 4.6 },
                      { name: "Мука пшеничная", img: "https://placehold.co/120x120?text=Flour", price: "45₽", weight: "1 кг", rating: 4.6 },
                      { name: "Молоко", img: "https://placehold.co/120x120?text=Milk", price: "85₽", weight: "1 л", rating: 4.6 }
                    ]
                  }
                ];
              }
              
              const assistantMessage: ChatMessage = {
                role: 'assistant',
                content: cleanTextFromJson(data.response || 'Нет ответа от ИИ'),
                timestamp: new Date(),
                categories: fallbackCategories,
                suggestions: ['Добавить специи', 'Украсить зеленью', 'Дополнить сметаной']
              };
              setChatHistory(prev => [...prev, assistantMessage]);
              
              setCurrentResponse({
                userMessage: userMessage,
                text: cleanTextFromJson(data.response || 'Нет ответа от ИИ'),
                categories: fallbackCategories,
                suggestions: ['Добавить специи', 'Украсить зеленью', 'Дополнить сметаной']
              });
              return;
            }
          }
        }
        
        // Проверяем, содержит ли ответ ключевые слова о покупках/приготовлении
        const responseText = data.response.toLowerCase();
        const isShoppingRequest = responseText.includes('купить') || 
                                 responseText.includes('приготовить') || 
                                 responseText.includes('сделать') || 
                                 responseText.includes('хочу') ||
                                 responseText.includes('нужны') ||
                                 responseText.includes('продукты');
        
        if (isShoppingRequest) {
          console.log('Shopping request detected, showing fallback products');
          // Показываем базовые категории для запросов о покупках
          const fallbackCategories = [
            {
              name: "Основные продукты",
              products: [
                { name: "Яйца куриные", img: "https://placehold.co/120x120?text=Eggs", price: "120₽", weight: "10 шт", rating: 4.6 },
                { name: "Мука пшеничная", img: "https://placehold.co/120x120?text=Flour", price: "45₽", weight: "1 кг", rating: 4.6 },
                { name: "Молоко", img: "https://placehold.co/120x120?text=Milk", price: "85₽", weight: "1 л", rating: 4.6 }
              ]
            }
          ];
          
          const assistantMessage: ChatMessage = {
            role: 'assistant',
            content: cleanTextFromJson(data.response || 'Нет ответа от ИИ'),
            timestamp: new Date(),
            categories: fallbackCategories,
            suggestions: ['Добавить овощи', 'Дополнить специями', 'Украсить зеленью']
          };
          setChatHistory(prev => [...prev, assistantMessage]);
          
          setCurrentResponse({
            userMessage: userMessage,
            text: cleanTextFromJson(data.response || 'Нет ответа от ИИ'),
            categories: fallbackCategories,
            suggestions: ['Добавить овощи', 'Дополнить специями', 'Украсить зеленью']
          });
        } else {
          // Если нет JSON, значит это информационный ответ без товаров
          const assistantMessage: ChatMessage = {
            role: 'assistant',
            content: cleanTextFromJson(data.response || 'Нет ответа от ИИ'),
            timestamp: new Date(),
            // Не добавляем категории и предложения для информационных ответов
          };
          setChatHistory(prev => [...prev, assistantMessage]);
          
          setCurrentResponse({
            userMessage: userMessage,
            text: cleanTextFromJson(data.response || 'Нет ответа от ИИ'),
            categories: [], // Пустой массив категорий
            suggestions: [], // Пустой массив предложений
          });
        }
      }
    } catch (error) {
      console.error('Error processing response:', error);
      
      // Добавляем сообщение об ошибке в историю
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Ошибка при обращении к ИИ',
        timestamp: new Date(),
        categories: [], // Пустой массив категорий
        suggestions: [], // Пустой массив предложений
      };
      setChatHistory(prev => [...prev, errorMessage]);
      
      setCurrentResponse({
        userMessage: userMessage,
        text: 'Ошибка при обращении к ИИ',
        categories: [], // Пустой массив категорий
        suggestions: [], // Пустой массив предложений
      });
    } finally {
      setInputValue('');
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;
    
    const message = inputValue;
    setInputValue('');
    await handleSendMessage(message);
  };

  // Обработка клика по идее
  const handleSuggestionClick = async (suggestion: string) => {
    if (!suggestion.trim()) return;
    const userMessage = suggestion.trim();
    const newUserMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, newUserMessage]);
    setCurrentResponse(null);
    setLoading(true);
    try {
      // Подготавливаем историю чата для API
      const chatHistoryForAPI = chatHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          chatHistory: chatHistoryForAPI 
        }),
      });
      const data = await res.json();
      const parsed = extractJsonBlock(data.response);
      
      if (parsed && typeof parsed === 'object' && parsed !== null && 'categories' in parsed && 'suggestions' in parsed) {
        const parsedData = parsed as { categories: Category[]; suggestions: string[] };
        
        // Используем товары, которые вернула нейросеть, без дополнительной обработки
        
        // Добавляем ответ ассистента в историю чата с товарами
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: cleanTextFromJson(data.response),
          timestamp: new Date(),
          categories: parsedData.categories,
          suggestions: parsedData.suggestions,
        };
        setChatHistory(prev => [...prev, assistantMessage]);
        
        setCurrentResponse({
          userMessage: userMessage,
          text: cleanTextFromJson(data.response),
          categories: parsedData.categories,
          suggestions: parsedData.suggestions,
        });
      } else {
        // Добавляем ответ ассистента в историю чата с демо-товарами
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: cleanTextFromJson(data.response || 'Нет ответа от ИИ'),
          timestamp: new Date(),
          categories: [], // Пустой массив вместо demoAssistantResponse.categories
          suggestions: [], // Пустой массив вместо demoAssistantResponse.suggestions
        };
        setChatHistory(prev => [...prev, assistantMessage]);
        
        setCurrentResponse({
          userMessage: userMessage,
          text: cleanTextFromJson(data.response || 'Нет ответа от ИИ'),
          categories: [], // Пустой массив вместо demoAssistantResponse.categories
          suggestions: [], // Пустой массив вместо demoAssistantResponse.suggestions
        });
      }
    } catch (error) {
      console.error('Error processing response:', error);
      
      // Добавляем сообщение об ошибке в историю
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Ошибка при обращении к ИИ',
        timestamp: new Date(),
        categories: [], // Пустой массив вместо demoAssistantResponse.categories
        suggestions: [], // Пустой массив вместо demoAssistantResponse.suggestions
      };
      setChatHistory(prev => [...prev, errorMessage]);
      
      setCurrentResponse({
        userMessage: userMessage,
        text: 'Ошибка при обращении к ИИ',
        categories: [], // Пустой массив вместо demoAssistantResponse.categories
        suggestions: [], // Пустой массив вместо demoAssistantResponse.suggestions
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] w-full overflow-hidden flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Основной контейнер */}
      <div className="w-full max-w-[1152px] mx-auto h-full flex flex-col shadow-2xl bg-white/80 backdrop-blur-sm rounded-t-3xl overflow-hidden">
        {/* История чата */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 sm:px-4 sm:py-4 space-y-3 pb-20 lg:pb-4" ref={chatContainerRef}>
          {chatHistory.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`${message.role === 'user' ? 'w-[85%] sm:w-[60%] md:w-[40%]' : 'w-full'} rounded-2xl px-3 py-2 sm:px-4 sm:py-3 overflow-hidden ${
                message.role === 'user' 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
                  : 'text-gray-800'
              }`}>
                <div className="text-xs mb-1 opacity-70">
                  {message.role === 'user' ? 'Вы' : 'Зина'} • {message.timestamp.toLocaleTimeString()}
                </div>
                <div className="whitespace-pre-line text-base sm:text-lg leading-relaxed">
                  {message.role === 'assistant' ? (
                    <TypewriterText text={message.content} speed={1} />
                  ) : (
                    message.content
                  )}
                </div>
                {/* Показываем товары и идеи из истории сообщений */}
                {message.role === 'assistant' && message.categories && (
                  <div className="mt-3 sm:mt-4">
                    <div className="w-full">
                      <div className="flex-1 min-h-0 overflow-auto overflow-x-hidden">
                        {/* Не показываем текст, так как он уже есть в message.content */}
                        {message.categories && message.categories.length > 0 && (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-3">
                            {message.categories.map((cat) => (
                              <CategoryBlock 
                                key={cat.name} 
                                {...cat} 
                                isOpen={openCategories.has(cat.name)}
                                onToggle={(isOpen) => {
                                  setOpenCategories(prev => {
                                    const newSet = new Set(prev);
                                    if (isOpen) {
                                      newSet.add(cat.name);
                                    } else {
                                      newSet.delete(cat.name);
                                    }
                                    return newSet;
                                  });
                                }}
                              />
                            ))}
                          </div>
                        )}
                        {message.suggestions && message.suggestions.length > 0 && (
                          <IdeasBlock suggestions={message.suggestions} onSuggestionClick={handleSuggestionClick} isVisible={true} />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Индикатор загрузки */}
          {loading && <LoadingSkeleton />}
        </div>

        {/* Форма ввода - скрыта на мобильных */}
        <div className="hidden lg:block flex-shrink-0 px-2 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-white/95 to-gray-50/95 shadow-lg overflow-x-hidden">
          <form
            onSubmit={handleSend}
            className="w-full min-w-0 bg-white/95 shadow-xl rounded-2xl flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 border border-gray-200/50"
          >
            <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-indigo-500 flex-shrink-0" />
            <input
              className="flex-1 min-w-0 bg-[#f8fafc] border border-indigo-200 rounded-full px-3 sm:px-4 py-2 text-base sm:text-lg font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder:text-gray-400 shadow"
              placeholder="Чем вам помочь?"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              disabled={loading}
            />
            <VoiceInput 
              onTranscript={handleVoiceInput}
              onInterimResult={handleInterimVoiceInput}
              disabled={loading}
            />
            <button
              type="button"
              className="rounded-full p-1.5 sm:p-2 hover:bg-indigo-100 transition relative flex-shrink-0"
              tabIndex={-1}
              aria-label="Корзина"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-indigo-500" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              )}
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full p-1.5 sm:p-2 font-semibold shadow hover:from-indigo-600 hover:to-purple-600 transition disabled:opacity-50 flex items-center gap-1 flex-shrink-0"
              disabled={loading || !inputValue.trim()}
              aria-label="Отправить"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Мобильная навигация */}
      <MobileNav
        onVoiceToggle={handleVoiceToggle}
        onSend={() => handleSendMessage(inputValue)}
        onInputChange={setInputValue}
        inputValue={inputValue}
        isListening={isListening}
        disabled={loading}
      />
    </div>
  );
}

export default function Home() {
  return (
    <CartProvider>
      <HomeContent />
    </CartProvider>
  );
} 