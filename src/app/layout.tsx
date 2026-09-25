// src/app/layout.tsx
import './globals.css';
import { Metadata } from 'next';
import { fetchProductsFromSheet } from '@/lib/sheets';
import { ProductProvider } from '@/context/ProductContext';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';
import CartTrigger from '@/components/CartTrigger';
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/config';

// Open Graph & Meta Definition
export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} | Quality Perfumes & Wellness`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.tagline,
  keywords: [
    'Mariam Market',
    'Perfumes Tanzania',
    'Dar es Salaam cosmetics',
    'Lattafa perfumes',
    'Wellness supplements Tanzania',
    'Buy perfumes WhatsApp',
  ],
  authors: [{ name: SITE_CONFIG.name }],
  openGraph: {
    type: 'website',
    locale: 'en_TZ',
    url: SITE_CONFIG.url,
    title: `${SITE_CONFIG.name} | Quality Perfumes & Wellness`,
    description: SITE_CONFIG.tagline,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} Store Preview Banner`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.tagline,
    images: [SITE_CONFIG.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
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

            <CartDrawer />
          </CartProvider>
        </ProductProvider>
      </body>
    </html>
  );
}