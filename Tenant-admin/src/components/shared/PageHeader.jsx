import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const PageHeader = ({ title, breadcrumbs = [], actions, onBack }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-2 text-muted text-xs mb-1">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <span>{crumb}</span>
              {idx < breadcrumbs.length - 1 && <span>/</span>}
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 hover:bg-surface rounded-lg transition-smooth text-muted hover:text-white"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="text-2xl font-bold text-white">{title}</h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {actions}
      </div>
    </div>
  );
};
