
import React from 'react';
import { Lesson } from '../types';

interface LessonCardProps {
  lesson: Lesson;
  onSelect: (lesson: Lesson) => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, onSelect }) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Лесно': return 'bg-green-100 text-green-700';
      case 'Средно': return 'bg-yellow-100 text-yellow-700';
      case 'Тешко': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div 
      onClick={() => onSelect(lesson)}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 cursor-pointer border-b-4 border-blue-200 hover:-translate-y-1"
    >
      <div className="text-4xl mb-4">{lesson.emoji}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{lesson.title}</h3>
      <p className="text-gray-600 text-sm mb-4">{lesson.description}</p>
      <div className="flex justify-between items-center">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(lesson.difficulty)}`}>
          {lesson.difficulty}
        </span>
        <button className="text-blue-500 font-bold text-sm hover:underline">Започни &rarr;</button>
      </div>
    </div>
  );
};

export default LessonCard;
