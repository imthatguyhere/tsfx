import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { RootProvider } from 'fumadocs-ui/provider';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import './global.css';

const inter = Inter({
    subsets: ['latin']
});

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <html lang='en' className={inter.className} suppressHydrationWarning>
            <body className='flex flex-col min-h-screen'>
                <RootProvider>{children}</RootProvider>
                <SpeedInsights />
                <Analytics />
            </body>
        </html>
    );
}
