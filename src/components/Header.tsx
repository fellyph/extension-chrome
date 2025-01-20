import React from 'react';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  onClose: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <header className="app-header -m-4 mb-4 flex items-center gap-3 bg-emerald-600 p-4 text-white">
      <img src="icons/icon48.png" alt="Logo" className="h-4 w-4" />
      <h2 className="text-base font-semibold">{t('header.title')}</h2>
      <button
        onClick={onClose}
        className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-medium text-emerald-600 transition-colors duration-200 hover:bg-emerald-50"
        aria-label={t('common.close')}
      >
        ✕
      </button>
    </header>
  );
};
