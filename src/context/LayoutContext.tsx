'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LayoutContextType {
  rightSidebarCollapsed: boolean;
  toggleRightSidebar: () => void;
}

const LayoutContext = createContext<LayoutContextType>({
  rightSidebarCollapsed: false,
  toggleRightSidebar: () => {},
});

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  return (
    <LayoutContext.Provider value={{
      rightSidebarCollapsed,
      toggleRightSidebar: () => setRightSidebarCollapsed(prev => !prev),
    }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  return useContext(LayoutContext);
}
