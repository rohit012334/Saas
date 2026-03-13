import React from 'react';
import { clsx } from 'clsx';

export const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) => {
  const colorMap = {
    blue: 'text-primary',
    green: 'text-success',
    amber: 'text-warning',
    red: 'text-destructive',
    purple: 'text-purple',
  };

  return (
    <div className="glass-card p-6 flex items-start justify-between">
      <div>
        <p className="text-muted text-sm mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        {trend && (
          <p className={clsx("text-xs mt-2 flex items-center gap-1", trend === 'up' ? 'text-success' : 'text-destructive')}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}% <span className="text-muted text-[10px] ml-1">vs last month</span>
          </p>
        )}
      </div>
      <div className={clsx("p-3 rounded-lg bg-surface/50 border border-border", colorMap[color])}>
        {Icon && <Icon size={24} />}
      </div>
    </div>
  );
};
