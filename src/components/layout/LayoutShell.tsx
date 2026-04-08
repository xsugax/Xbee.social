'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import MobileNav from './MobileNav';
import { useLayout } from '@/context/LayoutContext';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const { rightSidebarCollapsed } = useLayout();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className={cn(
        'flex-1 ml-[275px] min-h-screen border-r border-theme max-xl:ml-[88px] max-lg:ml-0 max-lg:pb-16 transition-all duration-300',
        rightSidebarCollapsed ? 'mr-0' : 'mr-[350px] max-xl:mr-[300px] max-lg:mr-0'
      )}>
        {children}
      </main>
      <RightSidebar />
      <MobileNav />
    </div>
  );
}
