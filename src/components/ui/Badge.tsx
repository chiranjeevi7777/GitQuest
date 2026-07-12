import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'cartoon';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className = '',
  variant = 'cartoon',
  size = 'md',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-bold tracking-wide rounded-full uppercase select-none';
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  const variantStyles = {
    primary: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    info: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
    // Cartoon style: solid bold border, solid bright color background
    cartoon: 'bg-amber-200 text-slate-900 border-2 border-slate-900 shadow-[1px_1px_0px_0px_#0f172a]',
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};
