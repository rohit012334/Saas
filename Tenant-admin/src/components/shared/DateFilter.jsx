import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Filter, ChevronDown, Calendar } from 'lucide-react';

export const DateFilter = ({ onFilterChange }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(t('common:allTime'));

  const options = [
    { label: t('common:allTime'), value: 'all' },
    { label: t('common:today'), value: 'today' },
    { label: t('common:tomorrow'), value: 'tomorrow' },
    { label: t('common:yesterday'), value: 'yesterday' },
    { label: t('common:sevenDays'), value: '7days' },
    { label: t('common:thirtyDays'), value: '30days' },
    { label: t('common:thisMonth'), value: 'this_month' },
  ];

  const handleSelect = (option) => {
    setSelected(option.label);
    setIsOpen(false);
    if (onFilterChange) onFilterChange(option.value);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-bold text-muted hover:text-white hover:bg-white/5 transition-smooth"
      >
        <Filter size={18} />
        {selected}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2 border-b border-border/50 bg-white/5">
                <p className="text-[10px] font-bold text-muted uppercase px-2">{t('common:filterByDate')}</p>
            </div>
            {options.map((option) => (
              <button 
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-smooth ${selected === option.label ? 'text-primary bg-primary/5' : 'text-muted hover:text-white hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-3">
                    <Calendar size={14} className={selected === option.label ? 'text-primary' : 'text-muted'} />
                    {option.label}
                </div>
                {selected === option.label && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
