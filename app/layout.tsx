import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#070a12',
};

export const metadata: Metadata = {
  title: 'C++ Odyssey | Interactive C++ & SEECS NUST BSCS Platform',
  description: 'Gamified C++ learning platform featuring in-browser memory visualizer, pointer simulator, bug hunter challenges, and complete SEECS NUST BSCS degree curriculum.',
  keywords: ['C++', 'NUST SEECS', 'BSCS', 'Memory Visualizer', 'Pointers', 'Data Structures', 'OOP', 'Next.js'],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#070a12] text-slate-100 min-h-screen antialiased selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden w-full" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
