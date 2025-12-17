
export interface Lesson {
  id: string;
  title: string;
  description: string;
  emoji: string;
  difficulty: 'Лесно' | 'Средно' | 'Тешко';
  content: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  emoji: string;
  lessons: Lesson[];
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  isFinished: boolean;
  history: Message[];
}
