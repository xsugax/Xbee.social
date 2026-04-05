'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-xbee-primary text-white hover:bg-blue-500 shadow-glow',
    secondary: 'border border-theme text-theme-primary hover:bg-theme-hover',
    accent: 'bg-xbee-secondary text-white hover:opacity-90 shadow-glow-purple',
    ghost: 'text-theme-secondary hover:text-theme-primary hover:bg-theme-hover',
    danger: 'bg-xbee-danger text-white hover:opacity-90',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  };

  return (
    <motion.button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold',
        'transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        icon
      ) : null}
      {children}
    </motion.button>
  );
}
