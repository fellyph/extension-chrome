import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: import.meta.env?.MODE === 'development',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          header: {
            title: 'Text Improver',
            description: 'Improve your text with AI',
          },
          riskLevel: {
            title: 'Risk Level',
            low: 'Low',
            medium: 'Medium',
            high: 'High',
          },
          common: {
            close: 'Close',
            loading: 'Loading...',
            error: 'An error occurred. Please try again.',
            retry: 'Retry',
            enterText: 'Enter your text here...',
            analyzing: 'Analyzing...',
            analyzeText: 'Analyze Text',
            fullAnalysis: 'Full Analysis',
          },
        },
      },
      'pt-BR': {
        translation: {
          header: {
            title: 'Melhorador de Texto',
            description: 'Melhore seu texto com IA',
          },
          riskLevel: {
            title: 'Nível de Risco',
            low: 'Baixo',
            medium: 'Médio',
            high: 'Alto',
          },
          common: {
            close: 'Fechar',
            loading: 'Carregando...',
            error: 'Ocorreu um erro. Por favor, tente novamente.',
            retry: 'Tentar novamente',
            enterText: 'Digite seu texto aqui...',
            analyzing: 'Analisando...',
            analyzeText: 'Analisar Texto',
            fullAnalysis: 'Análise Completa',
          },
        },
      },
    },
  });

export default i18n;
