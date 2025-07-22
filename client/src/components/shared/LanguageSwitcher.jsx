import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  return (
    <div className="flex gap-2 items-center p-2">
      <button
        onClick={() => i18n.changeLanguage('th')}
        className={`px-3 py-1 rounded-md font-semibold border transition-colors duration-200
          ${currentLang === 'th' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'}`}
      >
        ไทย
      </button>
      <button
        onClick={() => i18n.changeLanguage('en')}
        className={`px-3 py-1 rounded-md font-semibold border transition-colors duration-200
          ${currentLang === 'en' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'}`}
      >
        English
      </button>
    </div>
  );
};

export default LanguageSwitcher; 