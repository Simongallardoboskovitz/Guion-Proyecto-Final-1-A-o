
import React, { useState, useCallback } from 'react';
import { View } from './types';
import HomeScreen from './components/HomeScreen';
import GeneratorScreen from './components/GeneratorScreen';
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Home);

  const handleStartGenerator = useCallback(() => {
    setCurrentView(View.Generator);
  }, []);

  const handleGoHome = useCallback(() => {
    setCurrentView(View.Home);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        {currentView === View.Home && <HomeScreen onStart={handleStartGenerator} />}
        {currentView === View.Generator && <GeneratorScreen onBack={handleGoHome} />}
      </main>
      <Footer />
    </div>
  );
};

export default App;
