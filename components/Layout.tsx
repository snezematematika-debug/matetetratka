
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f0f7ff]">
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 p-2 rounded-lg">
            <i className="fas fa-calculator text-white text-xl"></i>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Мате Тетратка</h1>
        </div>
        <nav className="hidden md:flex gap-6">
          <a href="#" className="text-blue-600 font-semibold border-b-2 border-blue-600">Почетна</a>
          <a href="#" className="text-gray-500 hover:text-blue-500 transition-colors">Лекции</a>
          <a href="#" className="text-gray-500 hover:text-blue-500 transition-colors">Напредок</a>
        </nav>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 hidden sm:inline">Здраво, Ученик!</span>
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-lg shadow-inner">
            🧑‍🎓
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4 md:p-8">
        {children}
      </main>
      <footer className="bg-white border-t py-6 text-center text-gray-400 text-sm">
        <p>&copy; 2025 Мате Тетратка - Твојот дигитален пат до знаењето</p>
      </footer>
    </div>
  );
};

export default Layout;
