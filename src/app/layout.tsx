// src/app/layout.tsx
import './globals.css';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/config';
import { CartProvider } from '@/context/CartContext';
import CartTrigger from '@/components/CartTrigger';
import CartDrawer from '@/components/CartDrawer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased">
        <CartProvider>
          <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
            <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
              <Link href="/" className="text-base sm:text-lg font-bold text-slate-900 shrink-0">
                {SITE_CONFIG.name}
              </Link>

              <div className="flex items-center gap-3">
                <CartTrigger />
              </div>
            </div>
          </header>

          <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6">
            {children}
          </main>

          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}