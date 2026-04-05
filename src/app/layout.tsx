import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { LayoutProvider } from '@/context/LayoutContext';
import { AppProvider } from '@/context/AppContext';
import LayoutShell from '@/components/layout/LayoutShell';
import AppShell from '@/components/shell/AppShell';
import NotificationSystem from '@/components/notifications/NotificationSystem';

export const metadata: Metadata = {
  title: 'Xbee Messenger — by Xbee Technologies',
  description: 'Trusted Intelligent Communication Network. Cleaner. Smarter. Safer. More Rewarding.',
  icons: { icon: '/favicon.ico', apple: '/icons/icon-192.png' },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Xbee',
  },
};

export const viewport: Viewport = {
  themeColor: '#f59e0b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
              <NotificationSystem />
            </AppProvider>
          </LayoutProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
