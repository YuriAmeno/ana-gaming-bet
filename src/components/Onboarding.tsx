'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  action?: () => void;
}

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: '🎉 Bem-vindo à ANA Gaming!',
      description:
        'Sua plataforma completa para acompanhar odds de apostas esportivas. Vamos fazer um tour rápido?',
    },
    {
      id: 'categories',
      title: '⚽ Explore as Categorias',
      description:
        'Clique nas categorias de esportes para ver jogos específicos. Use a estrela ⭐ para favoritar suas categorias preferidas!',
      target: 'categories-section',
    },
    {
      id: 'favorites',
      title: '🌟 Organize seus Favoritos',
      description:
        'Suas categorias favoritas aparecerão em um painel especial onde você pode arrastar e reorganizar!',
      target: 'favorites-panel',
    },
    {
      id: 'filters',
      title: '🔍 Use os Filtros',
      description:
        'Filtre jogos por categoria, ordene por data, odds ou outras preferências para encontrar exatamente o que procura.',
      target: 'sort-controls',
    },
    {
      id: 'games',
      title: '🎯 Explore os Jogos',
      description:
        'Clique em qualquer jogo para ver odds detalhadas de diferentes casas de apostas. Compare e encontre as melhores oportunidades!',
      target: 'games-section',
    },
    {
      id: 'complete',
      title: '🚀 Pronto para Começar!',
      description:
        'Agora você conhece todas as funcionalidades. Explore à vontade e aproveite a plataforma!',
    },
  ];

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('ana-gaming-onboarding-completed');
    if (!hasSeenOnboarding) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [steps.length])

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const skipOnboarding = () => {
    completeOnboarding();
  };

  const completeOnboarding = () => {
    localStorage.setItem('ana-gaming-onboarding-completed', 'true');
    setIsVisible(false);
  };

  const scrollToTarget = (target?: string) => {
    if (target) {
      const element = document.getElementById(target);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    if (isVisible && steps[currentStep]?.target) {
      scrollToTarget(steps[currentStep].target);
    }
  }, [currentStep, isVisible]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-500">
              Passo {currentStep + 1} de {steps.length}
            </div>
            <button onClick={skipOnboarding} className="text-gray-400 hover:text-gray-600 text-sm">
              Pular
            </button>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">{steps[currentStep]?.title}</h2>
            <p className="text-gray-600 leading-relaxed">{steps[currentStep]?.description}</p>
          </div>

          <div className="flex justify-between gap-3">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Anterior
            </button>

            <div className="flex gap-2">
              {currentStep === steps.length - 1 ? (
                <motion.button
                  onClick={completeOnboarding}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🎉 Começar!
                </motion.button>
              ) : (
                <motion.button
                  onClick={nextStep}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Próximo
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
