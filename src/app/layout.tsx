import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zina GPT - AI Assistant',
  description: 'Интеллектуальный помощник с голосовым управлением и корзиной товаров',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
  themeColor: '#6366f1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Zina GPT'
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="h-full">
      <head>
        {/* Дополнительные мета-теги для мобильной оптимизации */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Zina GPT" />
        
        {/* Отключение инструментов разработчика */}
        <style dangerouslySetInnerHTML={{
          __html: `
            #__next-build-watcher,
            #__next-prerender-indicator,
            #__next-dev-tools,
            [data-nextjs-dev-overlay] {
              display: none !important;
            }
          `
        }} />
      </head>
      <body className="h-full overflow-hidden antialiased">
        {children}
      </body>
    </html>
  );
}
