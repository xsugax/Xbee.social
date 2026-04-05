'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Theme } from '@/types';
import { cn } from '@/lib/utils';

const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
  { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
  { value: 'amoled', label: 'AMOLED', icon: <Monitor className="w-4 h-4" /> },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-theme-tertiary">
      {themes.map((t) => (
        <motion.button
          key={t.value}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
            theme === t.value
              ? 'bg-xbee-primary text-white'
              : 'text-theme-secondary hover:text-theme-primary'
          )}
          onClick={() => setTheme(t.value)}
          whileTap={{ scale: 0.95 }}
        >
          {t.icon}
          <span className="max-sm:hidden">{t.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
