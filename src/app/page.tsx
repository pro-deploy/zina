'use client';

import { useState, useRef, useEffect } from 'react';
import AssistantResponse from '../components/AssistantResponse';
import LoadingSkeleton from '../components/LoadingSkeleton';
import CategoryBlock from '../components/CategoryBlock';
import IdeasBlock from '../components/IdeasBlock';

import { AssistantResponseData, Category } from '../types/assistant';
import { User, ShoppingCart, Mic, Send } from 'lucide-react';
import { getProducts } from '../mock/getProducts';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
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

export default function Home() {
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

  // Автоматическая прокрутка к новым сообщениям
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, currentResponse, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const userMessage = inputValue.trim();
    
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
      
      // Добавляем ответ ассистента в историю чата
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: cleanTextFromJson(data.response),
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, assistantMessage]);
      
      if (parsed && typeof parsed === 'object' && parsed !== null && 'categories' in parsed && 'suggestions' in parsed) {
        const parsedData = parsed as { categories: Category[]; suggestions: string[] };
        console.log('Parsed data:', parsedData);
        
        const categoriesWithProducts = parsedData.categories.map((cat: Category) => ({
          ...cat,
          // Всегда добавляем товары, игнорируя что возвращает нейросеть в products
          products: getProducts(),
        }));
        
        console.log('Categories with products:', categoriesWithProducts);
        
        setCurrentResponse({
          userMessage: userMessage,
          text: cleanTextFromJson(data.response),
          categories: categoriesWithProducts,
          suggestions: parsedData.suggestions,
        });
      } else {
        console.log('No valid JSON found, using demo response');
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
        timestamp: new Date()
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
      
      // Добавляем ответ ассистента в историю чата
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: cleanTextFromJson(data.response),
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, assistantMessage]);
      
      if (parsed && typeof parsed === 'object' && parsed !== null && 'categories' in parsed && 'suggestions' in parsed) {
        const parsedData = parsed as { categories: Category[]; suggestions: string[] };
        const categoriesWithProducts = parsedData.categories.map((cat: Category) => ({
          ...cat,
          products: getProducts(),
        }));
        setCurrentResponse({
          userMessage: userMessage,
          text: cleanTextFromJson(data.response),
          categories: categoriesWithProducts,
          suggestions: parsedData.suggestions,
        });
      } else {
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
        timestamp: new Date()
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* История чата */}
      <div className="flex-1 overflow-auto p-4 space-y-4" ref={chatContainerRef}>
        {chatHistory.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3xl rounded-2xl px-4 py-2 ${
              message.role === 'user' 
                ? 'bg-orange-500 text-white' 
                : 'text-gray-800'
            }`}>
              <div className="text-sm mb-1 opacity-70">
                {message.role === 'user' ? 'Вы' : 'Зина'} • {message.timestamp.toLocaleTimeString()}
              </div>
              <div className="whitespace-pre-line">{message.content}</div>
              {/* Показываем товары и идеи только в последнем сообщении ассистента */}
              {message.role === 'assistant' && index === chatHistory.length - 1 && currentResponse && (
                <div className="mt-4">
                  <div className="w-full max-w-5xl">
                    <div className="flex-1 min-h-0 overflow-auto pr-1">
                      {/* Не показываем текст, так как он уже есть в message.content */}
                      {currentResponse.categories && currentResponse.categories.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          {currentResponse.categories.map((cat) => (
                            <CategoryBlock key={cat.name} {...cat} />
                          ))}
                        </div>
                      )}
                      {currentResponse.suggestions && currentResponse.suggestions.length > 0 && (
                        <IdeasBlock suggestions={currentResponse.suggestions} onSuggestionClick={handleSuggestionClick} />
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
      <div className="p-4 bg-white/90 shadow-lg">
        <form
          onSubmit={handleSend}
          className="w-full max-w-5xl mx-auto bg-white/90 shadow-2xl rounded-2xl flex items-center gap-3 px-6 py-4"
        >
          <User className="w-6 h-6 text-orange-400 flex-shrink-0" />
          <input
            className="flex-1 bg-[#f3f4f6] border border-orange-200 rounded-full px-4 py-2 text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder:text-gray-400 shadow"
            placeholder="Чем вам помочь?"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            disabled={loading}
          />
          <button
            type="button"
            className="rounded-full p-2 hover:bg-orange-100 transition"
            tabIndex={-1}
            aria-label="Диктовка"
          >
            <Mic className="w-6 h-6 text-orange-400" />
          </button>
          <button
            type="button"
            className="rounded-full p-2 hover:bg-orange-100 transition"
            tabIndex={-1}
            aria-label="Корзина"
          >
            <ShoppingCart className="w-6 h-6 text-orange-400" />
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full p-2 font-semibold shadow hover:from-orange-600 hover:to-red-600 transition disabled:opacity-50 flex items-center gap-1"
            disabled={loading || !inputValue.trim()}
            aria-label="Отправить"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
} 