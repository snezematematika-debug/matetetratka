
import React, { useState } from 'react';
import Layout from './components/Layout';
import LessonCard from './components/LessonCard';
import ChatWindow from './components/ChatWindow';
import { TOPICS } from './constants';
import { Topic, Lesson } from './types';

const App: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setSelectedLesson(null);
  };

  const handleBackToLessons = () => {
    setSelectedLesson(null);
  };

  return (
    <Layout>
      {!selectedTopic ? (
        <div className="animate-fade-in">
          <section className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Математиката е <span className="text-blue-500">супер моќ!</span> 🚀
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Избери тема и започни со истражување. Твојот дигитален наставник Мате е тука да ти помогне!
            </p>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {TOPICS.map((topic) => (
              <div 
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-8 cursor-pointer border-b-8 border-blue-500 hover:-translate-y-2 group"
              >
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform inline-block">{topic.emoji}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 uppercase tracking-tight">{topic.title}</h3>
                <p className="text-gray-600 mb-6">{topic.description}</p>
                <div className="flex items-center text-blue-500 font-bold">
                  Види лекции <i className="fas fa-arrow-right ml-2 group-hover:translate-x-2 transition-transform"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : !selectedLesson ? (
        <div className="animate-fade-in max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={handleBackToTopics}
              className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{selectedTopic.title}</h2>
              <p className="text-gray-500">Избери лекција за да започнеш со учење</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedTopic.lessons.map((lesson) => (
              <LessonCard 
                key={lesson.id} 
                lesson={lesson} 
                onSelect={setSelectedLesson} 
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          <ChatWindow 
            lesson={selectedLesson} 
            onBack={handleBackToLessons} 
          />
        </div>
      )}
    </Layout>
  );
};

export default App;
