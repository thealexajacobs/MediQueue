import type { Metadata } from 'next';
import { DM_Sans, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

const dmSans = DM_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MediQueue — Clinic Queue Management',
  description: 'Real-time multi-tenant clinic queue management system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{
          __html: `!function(){try{var e=localStorage.getItem("theme");"system"===e&&(e=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");"dark"===e?(document.documentElement.dataset.theme="dark",document.documentElement.classList.add("dark")):(document.documentElement.dataset.theme="light",document.documentElement.classList.remove("dark"))}catch(e){}}()`,
        }} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
