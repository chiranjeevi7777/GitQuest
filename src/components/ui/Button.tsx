import React from 'react';
import { motion } from 'framer-motion';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'cartoon';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'cartoon',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none';
    
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
      md: 'px-4 py-2 text-sm rounded-xl gap-2',
      lg: 'px-6 py-3 text-base rounded-2xl gap-2.5',
    };

    const variantStyles = {
      primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 border border-indigo-500',
      secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700',
      outline: 'bg-transparent border border-slate-700 hover:bg-slate-800 text-slate-300',
      danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/20 border border-rose-500',
      ghost: 'bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-100',
      // Cartoon Variant matches our Phase 3 style guide: cozy rounded border, solid black shadow offset
      cartoon: 'bg-amber-100 hover:bg-amber-50 text-slate-900 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[2px_2px_0px_0px_#0f172a] active:translate-y-[3px] active:translate-x-[3px] active:shadow-[0px_0px_0px_0px_#0f172a]',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <motion.button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
        whileTap={variant !== 'cartoon' ? { scale: 0.98 } : undefined}
        {...(props as any)}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        <span className="truncate">{children}</span>
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
