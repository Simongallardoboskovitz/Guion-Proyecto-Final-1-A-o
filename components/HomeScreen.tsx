
import React from 'react';

interface HomeScreenProps {
  onStart: () => void;
}

const VideoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-black mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />
    </svg>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ onStart }) => {
  return (
    <div className="w-full flex flex-col items-center text-center animate-fade-in-up max-w-3xl">
      <VideoIcon />
      <h2 className="text-4xl font-extrabold mb-4">Crea tu Guión para Videoblog</h2>
      <p className="text-lg text-gray-600 mb-12">
        Genera un guión completo para un videoblog de Instagram. La estructura combina una fase de investigación de un problema con la presentación de un proyecto o solución creativa.
      </p>
      <button
        onClick={onStart}
        className="bg-black text-white font-bold py-4 px-10 rounded-lg text-lg transform transition-all duration-300 hover:scale-105 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-50"
      >
        Empezar a Crear
      </button>
    </div>
  );
};

export default HomeScreen;
