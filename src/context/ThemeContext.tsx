'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme } from '@/types';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('xbee-theme') as Theme | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('xbee-theme', theme);

    const root = document.documentElement;
    root.classList.remove('dark', 'light', 'amoled');
    root.classList.add(theme === 'light' ? 'light' : 'dark');
    root.setAttribute('data-theme', theme);
  }, [theme, mounted]);

  if (!mounted) {
    return <div className="bg-xbee-dark-800 min-h-screen" />;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
