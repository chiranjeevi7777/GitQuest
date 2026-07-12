import React from 'react';
import { motion } from 'framer-motion';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}) => {
  return (
    <label className={`flex items-start justify-between cursor-pointer select-none gap-4 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {(label || description) && (
        <div className="flex flex-col gap-0.5">
          {label && <span className="text-sm font-bold text-slate-200">{label}</span>}
          {description && <span className="text-xs text-slate-400">{description}</span>}
        </div>
      )}
      
      <div className="relative flex items-center mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
          disabled={disabled}
        />
        {/* Track */}
        <div className={`w-11 h-6 rounded-full transition-colors border-2 border-slate-900 ${checked ? 'bg-indigo-500' : 'bg-slate-700'}`} />
        
        {/* Thumb */}
        <motion.div
          className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white border border-slate-900 shadow-[1px_1px_0px_0px_#0f172a]"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
    </label>
  );
};
