import React from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';

const LanguageToggle = ({ className }) => {
  const { i18n } = useTranslation();
  
  // Directly use i18n.language to ensure the toggle re-renders immediately
  const currentLang = i18n.language || 'en';
  const isAR = currentLang.startsWith('ar');
  
  // Sync document attributes
  React.useEffect(() => {
    const dir = isAR ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLang;
  }, [isAR, currentLang]);

  const toggleLanguage = () => {
    const newLang = isAR ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    localStorage.setItem('gms-language', newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      dir="ltr"
      className={clsx(
        "relative flex items-center p-1 bg-surface border border-border rounded-full transition-smooth w-[100px] h-[38px] cursor-pointer isolate",
        className
      )}
    >
      {/* Sliding pill */}
      <div className={clsx(
        "absolute top-1 h-[30px] w-[46px] rounded-full bg-primary shadow-lg shadow-primary/20 transition-all duration-300 ease-in-out z-0",
        isAR ? "translate-x-[46px]" : "translate-x-0"
      )} />
      
      {/* EN label */}
      <div className={clsx(
        "relative z-10 flex h-[30px] w-[46px] items-center justify-center rounded-full transition-colors duration-300",
        !isAR ? "text-white" : "text-muted hover:text-white"
      )}>
        <span className="text-[10px] font-black uppercase tracking-widest">EN</span>
      </div>
      
      {/* AR label */}
      <div className={clsx(
        "relative z-10 flex h-[30px] w-[46px] items-center justify-center rounded-full transition-colors duration-300",
        isAR ? "text-white" : "text-muted hover:text-white"
      )}>
        <span className="text-[10px] font-bold uppercase tracking-widest">عربي</span>
      </div>
    </button>
  );
};

export default LanguageToggle;
