import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-md border-b border-gray-200 w-full sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <h1 className="text-2xl md:text-3xl font-bold text-black">
          Guión Talleres Primer Año
        </h1>
      </div>
    </header>
  );
};

export default Header;
