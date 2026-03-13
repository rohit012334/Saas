import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const variants = {
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger: 'bg-destructive/10 text-destructive border-destructive/20',
  info: 'bg-primary/10 text-primary border-primary/20',
  purple: 'bg-purple/10 text-purple border-purple/20',
  muted: 'bg-muted/10 text-muted border-muted/20',
};

export const Badge = ({ children, variant = 'info', className }) => {
  return (
    <span className={twMerge(
      'px-2.5 py-0.5 rounded-full text-xs font-medium border transition-smooth',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};
