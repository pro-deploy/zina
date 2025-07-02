'use client';

import { useState, useRef, useEffect } from 'react';
// import AssistantResponse from '../components/AssistantResponse';
import LoadingSkeleton from '../components/LoadingSkeleton';
import CategoryBlock from '../components/CategoryBlock';
import IdeasBlock from '../components/IdeasBlock';
import TypewriterText from '../components/TypewriterText';
import AnimatedContent from '../components/AnimatedContent';
import { CartProvider, useCart } from '../contexts/CartContext';
import VoiceInput from '../components/VoiceInput';
import { parseVoiceCommand, findProductByName, VoiceCommand } from '../utils/voiceCommands';

import { AssistantResponseData, Category } from '../types/assistant';
import { User, ShoppingCart, Mic, Send } from 'lucide-react';
import { getProducts } from '../mock/getProducts';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  categories?: Category[];
  suggestions?: string[];
}

function extractJsonBlock(text: string): unknown {
  // Ищем блок ```json ... ```
  const match = text.match(/```json([\s\S]*?)```/);
  if (match) {
    try {
      return JSON.parse(match[1]);
    } catch {
      return null;
    }
  }
  return null;
}

function cleanTextFromJson(text: string): string {
  // Удаляем JSON блок из текста
  return text.replace(/```json[\s\S]*?```/g, '').trim();
}

function HomeContent() {
  const { getTotalItems, addToCart } = useCart();
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());
  
  // Создаем локальный объект для демо-ответа
  const demoAssistantResponse: AssistantResponseData = {
    userMessage: 'Демо сообщение',
    text: 'Это демо-ответ ассистента',
    categories: [
      {
        name: 'Мясо и птица',
        products: getProducts(),
      },
      {
        name: 'Овощи',
        products: getProducts(),
      },
      {
        name: 'Молочные продукты',
        products: getProducts(),
      }
    ],
    suggestions: [
      'Посоветуйте рецепт на ужин',
      'Какие продукты сейчас в акции?',
      'Как правильно хранить свежие овощи?'
    ],
  };
  
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
          const allProducts = currentResponse?.categories?.flatMap(cat => cat.products) || [];
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
          setOpenCategories(new Set(currentResponse.categories.map(cat => cat.name)));
        }
        break;
    }
  };

  const handleInterimVoiceInput = (transcript: string) => {
    // Показываем промежуточные результаты в поле ввода
    setInputValue(transcript);
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
      
      if (parsed && typeof parsed === 'object' && parsed !== null && 'categories' in parsed && 'suggestions' in parsed) {
        const parsedData = parsed as { categories: Category[]; suggestions: string[] };
        console.log('Parsed data:', parsedData);
        
        const categoriesWithProducts = parsedData.categories.map((cat: Category) => ({
          ...cat,
          // Всегда добавляем товары, игнорируя что возвращает нейросеть в products
          products: getProducts(),
        }));
        
        console.log('Categories with products:', categoriesWithProducts);
        
        // Добавляем ответ ассистента в историю чата с товарами
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: cleanTextFromJson(data.response),
          timestamp: new Date(),
          categories: categoriesWithProducts,
          suggestions: parsedData.suggestions,
        };
        setChatHistory(prev => [...prev, assistantMessage]);
        
        setCurrentResponse({
          userMessage: userMessage,
          text: cleanTextFromJson(data.response),
          categories: categoriesWithProducts,
          suggestions: parsedData.suggestions,
        });
      } else {
        console.log('No valid JSON found, using demo response');
        
        // Добавляем ответ ассистента в историю чата с демо-товарами
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: cleanTextFromJson(data.response || 'Нет ответа от ИИ'),
          timestamp: new Date(),
          categories: demoAssistantResponse.categories,
          suggestions: demoAssistantResponse.suggestions,
        };
        setChatHistory(prev => [...prev, assistantMessage]);
        
        setCurrentResponse({
          ...demoAssistantResponse,
          userMessage: userMessage,
          text: cleanTextFromJson(data.response || 'Нет ответа от ИИ'),
        });
      }
    } catch (error) {
      console.error('Error processing response:', error);
      
      // Добавляем сообщение об ошибке в историю
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Ошибка при обращении к ИИ',
        timestamp: new Date(),
        categories: demoAssistantResponse.categories,
        suggestions: demoAssistantResponse.suggestions,
      };
      setChatHistory(prev => [...prev, errorMessage]);
      
      setCurrentResponse({
        ...demoAssistantResponse,
        userMessage: userMessage,
        text: 'Ошибка при обращении к ИИ',
      });
    } finally {
      setInputValue('');
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    await handleSendMessage(inputValue);
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
        const categoriesWithProducts = parsedData.categories.map((cat: Category) => ({
          ...cat,
          products: getProducts(),
        }));
        
        // Добавляем ответ ассистента в историю чата с товарами
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: cleanTextFromJson(data.response),
          timestamp: new Date(),
          categories: categoriesWithProducts,
          suggestions: parsedData.suggestions,
        };
        setChatHistory(prev => [...prev, assistantMessage]);
        
        setCurrentResponse({
          userMessage: userMessage,
          text: cleanTextFromJson(data.response),
          categories: categoriesWithProducts,
          suggestions: parsedData.suggestions,
        });
      } else {
        // Добавляем ответ ассистента в историю чата с демо-товарами
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: cleanTextFromJson(data.response || 'Нет ответа от ИИ'),
          timestamp: new Date(),
          categories: demoAssistantResponse.categories,
          suggestions: demoAssistantResponse.suggestions,
        };
        setChatHistory(prev => [...prev, assistantMessage]);
        
        setCurrentResponse({
          ...demoAssistantResponse,
          userMessage: userMessage,
          text: cleanTextFromJson(data.response || 'Нет ответа от ИИ'),
        });
      }
    } catch (error) {
      console.error('Error processing response:', error);
      
      // Добавляем сообщение об ошибке в историю
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Ошибка при обращении к ИИ',
        timestamp: new Date(),
        categories: demoAssistantResponse.categories,
        suggestions: demoAssistantResponse.suggestions,
      };
      setChatHistory(prev => [...prev, errorMessage]);
      
      setCurrentResponse({
        ...demoAssistantResponse,
        userMessage: userMessage,
        text: 'Ошибка при обращении к ИИ',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Контейнер с адаптивной шириной */}
      <div className="w-full max-w-[1152px] mx-auto h-full flex flex-col shadow-2xl bg-white/80 backdrop-blur-sm rounded-t-3xl">
        {/* История чата */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4" ref={chatContainerRef}>
        {chatHistory.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`${message.role === 'user' ? 'w-[70%] sm:w-[40%]' : 'w-full'} rounded-2xl px-3 sm:px-4 py-2 ${
              message.role === 'user' 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
                : 'text-gray-800'
            }`}>
              <div className="text-xs sm:text-sm mb-1 opacity-70">
                {message.role === 'user' ? 'Вы' : 'Зина'} • {message.timestamp.toLocaleTimeString()}
              </div>
              <div className="whitespace-pre-line text-sm sm:text-base">
                {message.role === 'assistant' ? (
                  <TypewriterText text={message.content} speed={80} />
                ) : (
                  message.content
                )}
              </div>
              {/* Показываем товары и идеи из истории сообщений */}
              {message.role === 'assistant' && message.categories && (
                <div className="mt-3 sm:mt-4">
                  <div className="w-full">
                    <div className="flex-1 min-h-0 overflow-auto pr-1">
                      {/* Не показываем текст, так как он уже есть в message.content */}
                      {message.categories && message.categories.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 mb-3">
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

      {/* Форма ввода */}
      <div className="flex-shrink-0 p-2 sm:p-4 bg-gradient-to-r from-white/95 to-gray-50/95 shadow-lg">
        <form
          onSubmit={handleSend}
          className="w-full bg-white/95 shadow-xl rounded-2xl flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-3 sm:py-4 border border-gray-200/50"
        >
          <User className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500 flex-shrink-0" />
          <input
            className="flex-1 bg-[#f8fafc] border border-indigo-200 rounded-full px-3 sm:px-4 py-2 text-sm sm:text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder:text-gray-400 shadow"
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
            className="rounded-full p-1.5 sm:p-2 hover:bg-indigo-100 transition relative"
            tabIndex={-1}
            aria-label="Корзина"
          >
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold">
                {getTotalItems()}
              </span>
            )}
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full p-1.5 sm:p-2 font-semibold shadow hover:from-indigo-600 hover:to-purple-600 transition disabled:opacity-50 flex items-center gap-1"
            disabled={loading || !inputValue.trim()}
            aria-label="Отправить"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </form>
      </div>
      </div>
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