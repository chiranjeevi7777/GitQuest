import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'cartoon' | 'sleek' | 'glass';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'cartoon',
  hoverable = false,
  ...props
}) => {
  const baseStyles = 'overflow-hidden rounded-2xl';
  
  const variantStyles = {
    // Cartoon variant: warm cream background, bold outline, thick solid shadow
    cartoon: 'bg-amber-50 border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] text-slate-900',
    // Sleek variant: dark high-tech card
    sleek: 'bg-slate-800/90 border border-slate-700/80 shadow-xl text-slate-100',
    // Glassmorphic variant
    glass: 'bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-2xl text-slate-200',
  };

  const hoverMotion = hoverable
    ? {
        whileHover: {
          y: -4,
          transition: { duration: 0.2 },
        },
      }
    : {};

  return (
    <motion.div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...hoverMotion}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`p-5 border-b border-slate-900/10 flex items-center justify-between ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`p-5 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`px-5 py-4 border-t border-slate-900/10 bg-slate-900/5 flex items-center justify-end gap-3 ${className}`} {...props}>
    {children}
  </div>
);
