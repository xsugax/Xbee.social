import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { LayoutProvider } from '@/context/LayoutContext';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import LayoutShell from '@/components/layout/LayoutShell';
import AppShell from '@/components/shell/AppShell';
import NotificationSystem from '@/components/notifications/NotificationSystem';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { ToastProvider } from '@/components/ui/Toast';
import { Analytics } from '@vercel/analytics/react';

const SITE_URL = 'https://xbee.social';
const SITE_NAME = 'Xbee';
const SITE_TITLE = 'Xbee — Trust-First Social Network by Xbee Technologies';
const SITE_DESC = 'Xbee is the trust-first social network. Cleaner. Smarter. Safer. More Rewarding. Real conversations, verified identities, AI-powered moderation.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | Xbee',
  },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  keywords: ['Xbee', 'Xbee social', 'Xbee Messenger', 'Xbee Technologies', 'social network', 'trust social', 'secure messaging', 'verified social media'],
  authors: [{ name: 'Xbee Technologies', url: SITE_URL }],
  creator: 'Xbee Technologies',
  publisher: 'Xbee Technologies',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-192.png', sizes: '192x192' },
    ],
    shortcut: '/icon.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESC,
    url: SITE_URL,
    locale: 'en_US',
    images: [
      {
        url: '/icons/icon-512.png',
        width: 512,
        height: 512,
        alt: 'Xbee — Trust-First Social Network',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: SITE_TITLE,
    description: SITE_DESC,
    images: ['/icons/icon-512.png'],
    creator: '@xbee',
    site: '@xbee',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: SITE_NAME,
  },
  other: {
    'google-site-verification': '',
  },
};

export const viewport: Viewport = {
  themeColor: '#1a2744',
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Xbee',
              alternateName: ['Xbee Messenger', 'Xbee Social', 'Xbee Technologies'],
              url: 'https://xbee.social',
              description: 'Xbee is the trust-first social network. Cleaner. Smarter. Safer. More Rewarding.',
              applicationCategory: 'SocialNetworkingApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              image: {
                '@type': 'ImageObject',
                url: 'https://xbee.social/icons/icon-512.png',
                width: 512,
                height: 512,
              },
              logo: {
                '@type': 'ImageObject',
                url: 'https://xbee.social/icons/icon-512.png',
                width: 512,
                height: 512,
              },
              author: {
                '@type': 'Organization',
                name: 'Xbee Technologies',
                url: 'https://xbee.social',
                logo: 'https://xbee.social/icons/icon-512.png',
                sameAs: ['https://xbee.social'],
              },
            }),
          }}
        />
      </head>
      <body className="bg-theme-primary text-theme-primary min-h-screen">
        <ThemeProvider>
          <ToastProvider>
          <LayoutProvider>
            <AuthProvider>
            <AppProvider>
              <ErrorBoundary>
              <AppShell>
                <LayoutShell>
                  {children}
                </LayoutShell>
              </AppShell>
              </ErrorBoundary>
              <NotificationSystem />
            </AppProvider>
            </AuthProvider>
          </LayoutProvider>
          </ToastProvider>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
