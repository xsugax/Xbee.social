import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { LayoutProvider } from '@/context/LayoutContext';
import { AppProvider } from '@/context/AppContext';
import LayoutShell from '@/components/layout/LayoutShell';
import AppShell from '@/components/shell/AppShell';

export const metadata: Metadata = {
  title: 'Xbee Messenger — by Xbee Technologies',
  description: 'Trusted Intelligent Communication Network. Cleaner. Smarter. Safer. More Rewarding.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" data-theme="dark">
      <body className="bg-theme-primary text-theme-primary min-h-screen">
        <ThemeProvider>
          <LayoutProvider>
            <AppProvider>
              <AppShell>
                <LayoutShell>
                  {children}
                </LayoutShell>
              </AppShell>
            </AppProvider>
          </LayoutProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
