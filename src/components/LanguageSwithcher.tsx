// src/components/LanguageSwitcher.tsx
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "es" : "en";
    i18n.changeLanguage(newLang);
  };

  const currentLang = i18n.language === "en" ? "EN" : "ES";
  const nextLang = i18n.language === "en" ? "ES" : "EN";

  return (
    <button
      onClick={toggleLanguage}
      className="group relative flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white border border-green-200 hover:border-green-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
      aria-label="Switch language"
    >
      <Globe className="w-4 h-4 text-green-600 group-hover:rotate-180 transition-transform duration-500" />
      <div className="flex items-center gap-1">
        <span className="text-sm font-semibold text-green-700">
          {currentLang}
        </span>
        <span className="text-xs text-gray-400">/</span>
        <span className="text-xs text-gray-500 opacity-60 group-hover:opacity-100 transition-opacity">
          {nextLang}
        </span>
      </div>
    </button>
  );
}
