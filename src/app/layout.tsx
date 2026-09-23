// src/app/layout.tsx
import './globals.css';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/config';
import { ShoppingBag, Home as HomeIcon } from 'lucide-react';

export const metadata = {
  title: SITE_CONFIG.name,
  description: SITE_CONFIG.tagline,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased">
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
            
            {/* Brand Logo / Name */}
            <Link 
              href="/" 
              className="text-base sm:text-lg font-bold text-slate-900 hover:text-rose-900 transition-colors shrink-0"
            >
              {SITE_CONFIG.name}
            </Link>

            {/* Nav Links Container (Spaced properly for mobile) */}
            <nav className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/"
                className="px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <HomeIcon className="w-4 h-4 text-slate-500" />
                <span>Home</span>
              </Link>

              <Link
                href="/products"
                className="px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-rose-900 text-white hover:bg-rose-950 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>All Products</span>
              </Link>
            </nav>

          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 mt-16 py-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}