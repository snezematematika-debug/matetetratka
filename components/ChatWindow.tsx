
import React, { useState, useEffect, useRef } from 'react';
import { Lesson, Message } from '../types';
import { getTutorResponse } from '../geminiService';

interface ChatWindowProps {
  lesson: Lesson;
  onBack: () => void;
}

/**
 * A component that safely renders text containing LaTeX formulas.
 * It splits text by $ delimiters and renders the math parts using KaTeX.
 */
const MathContent: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\$.*?\$)/g);

  return (
    <div className="leading-relaxed whitespace-pre-wrap text-sm md:text-base">
      {parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          const formula = part.slice(1, -1);
          try {
            const html = (window as any).katex.renderToString(formula, {
              throwOnError: false,
              displayMode: false,
            });
            return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
          } catch (e) {
            return <span key={index}>{part}</span>;
          }
        }
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
};

const ChatWindow: React.FC<ChatWindowProps> = ({ lesson, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const startLesson = async () => {
      setIsLoading(true);
      const initialText = await getTutorResponse(
        lesson.title, 
        lesson.content, 
        "Здраво наставнику! Сакам да ја почнам лекцијата и да ги решавам задачите.", 
        []
      );
      setMessages([{
        id: 'start-1',
        role: 'model',
        text: initialText,
        timestamp: new Date()
      }]);
      setIsLoading(false);
    };
    startLesson();
  }, [lesson]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const historyForAPI = messages.map(m => ({ role: m.role, text: m.text }));
    const responseText = await getTutorResponse(
      lesson.title,
      lesson.content,
      inputValue,
      historyForAPI
    );

    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    }]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[85vh] md:h-[80vh] flex flex-col bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border-4 md:border-8 border-blue-100">
      {/* Header */}
      <div className="bg-blue-600 p-3 md:p-4 text-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 md:gap-3">
          <button onClick={onBack} className="hover:bg-blue-700 p-2 rounded-full transition-colors">
            <i className="fas fa-chevron-left"></i>
          </button>
          <div>
            <h2 className="font-bold text-sm md:text-lg leading-tight">{lesson.title}</h2>
            <p className="text-[10px] md:text-xs opacity-80 uppercase tracking-wider">Интерактивна Тетратка</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="bg-blue-400 px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold shadow-sm">
            АКТИВЕН
          </div>
        </div>
      </div>

      {/* Notebook Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 paper-texture notebook-line scroll-smooth bg-[#fafafa]"
        style={{ paddingLeft: '2.5rem', borderLeft: '2px solid #fee2e2' }}
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] md:max-w-[85%] p-3 md:p-4 rounded-2xl shadow-md ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none font-medium'
            }`}>
              <MathContent text={msg.text} />
              <span className={`text-[9px] mt-2 block opacity-60 text-right ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 p-3 md:p-4 rounded-2xl shadow-sm flex gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 md:p-4 bg-gray-50 border-t flex gap-2 items-center shrink-0">
        <input 
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Твојот одговор..."
          className="flex-1 bg-white border border-gray-300 rounded-full px-4 md:px-6 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading || !inputValue.trim()}
          className="bg-blue-600 text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-blue-700 disabled:bg-gray-300 transition-colors shadow-md shrink-0"
        >
          <i className="fas fa-paper-plane text-sm md:text-base"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
