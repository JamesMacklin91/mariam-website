// src/app/layout.tsx
import './globals.css';
import { fetchProductsFromSheet } from '@/lib/sheets';
import { ProductProvider } from '@/context/ProductContext';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';
import CartTrigger from '@/components/CartTrigger';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/config';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetch initial products on server render so the entire app knows about them
  const products = await fetchProductsFromSheet();

  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased">
        <ProductProvider initialProducts={products}>
          <CartProvider>
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200">
              <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
                <Link href="/" className="text-base sm:text-lg font-bold text-slate-900 shrink-0">
                  {SITE_CONFIG.name}
                </Link>
                <CartTrigger />
              </div>
            </header>

            <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6">
              {children}
            </main>

            {/* Render CartDrawer at the root layout so it opens on ANY page */}
            <CartDrawer />
          </CartProvider>
        </ProductProvider>
      </body>
    </html>
  );
}