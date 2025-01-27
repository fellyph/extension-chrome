import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import { SuggestionGenerator } from './utils/suggestionGenerator';
import { Header } from './components/Header';
import { RiskLevel } from './components/RiskLevel';
import type { AnalysisResult } from './types/AnalysisResult';
import type { BadgeColors } from './types/BadgeColors';
import './i18n';
import './style.css';
import { TextAnalyzer } from './utils/textAnalyzer';

type RiskScore = 'red' | 'yellow' | 'green' | 'black';

const Popup: React.FC = () => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSelectedText = async () => {
      const { selectedText } = await chrome.storage.local.get('selectedText');
      if (selectedText) {
        setText(selectedText);
        await chrome.storage.local.remove('selectedText');
        analyzeText(selectedText);
      }
    };

    checkSelectedText();
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup when popup closes
      TextAnalyzer.destroySession();
    };
  }, []);

  const handleClose = () => {
    window.close();
  };

  const updateBadge = async (riskScore: RiskScore) => {
    const badgeColors: BadgeColors = {
      black: '#000000',
      red: '#ef4444',
      yellow: '#eab308',
      green: '#22c55e',
    };

    await chrome.runtime.sendMessage({
      type: 'UPDATE_BADGE',
      payload: {
        color: badgeColors[riskScore],
        text: '',
      },
    });
  };

  const analyzeText = async (inputText: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await SuggestionGenerator.generate(inputText);

      if (!result) {
        throw new Error(t('common.error'));
      }

      await updateBadge(result.score.level.toLowerCase() as RiskScore);
      setAnalysis(result);
    } catch (err) {
      setError(t('common.error'));
      console.error('Error processing suggestions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-[400px] p-4 font-sans">
      <div className="flex flex-col gap-4">
        <Header onClose={handleClose} />

        <div className="flex flex-col gap-2.5">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('common.enterText')}
            className="h-[100px] w-full resize-y rounded border border-gray-300 p-2"
          />
          <button
            onClick={() => analyzeText(text)}
            disabled={isLoading || !text}
            className="rounded bg-emerald-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isLoading ? t('common.analyzing') : t('common.analyzeText')}
          </button>
        </div>

        {error && <div className="rounded bg-red-50 p-3 text-red-600">{error}</div>}

        {analysis && !error && (
          <div className="mt-2.5">
            <RiskLevel score={analysis.score} />
            <div className="mt-4">
              <h4 className="mb-2 font-semibold">{t('common.fullAnalysis')}:</h4>
              <div
                className="markdown-content prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: marked(analysis.analysis.rawText) }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Initialize React
const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
