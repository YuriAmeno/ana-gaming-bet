'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Step {
  title: string;
  description: string;
  icon: string;
}

export default function Onboarding() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const steps: Step[] = [
    {
      title: 'Bem-vindo ao ANA Gaming!',
      description: 'Compare odds de múltiplas casas de apostas em tempo real',
      icon: '🎯'
    },
    {
      title: 'Organize seus Favoritos',
      description: 'Use drag & drop para organizar suas categorias favoritas',
      icon: '⭐'
    },
    {
      title: 'Análise Completa',
      description: 'Veja estatísticas detalhadas e histórico de cada partida',
      icon: '📊'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [steps.length])

  const handleClose = useCallback(() => {
    setIsVisible(false);
    localStorage.setItem('onboarding-dismissed', 'true');
  }, []);

  useEffect(() => {
    const dismissed = localStorage.getItem('onboarding-dismissed');
    if (dismissed) {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
      
      <div className="relative z-10 flex justify-between items-center">
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center space-x-4"
            >
              <div className="text-4xl">{steps[currentStep].icon}</div>
              <div>
                <h3 className="text-xl font-bold mb-1">
                  {steps[currentStep].title}
                </h3>
                <p className="text-blue-100">
                  {steps[currentStep].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white text-2xl font-bold leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </motion.div>
  );
}
