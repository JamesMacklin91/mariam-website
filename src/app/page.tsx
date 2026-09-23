// src/app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { fetchProductsFromSheet } from '@/lib/sheets';
import ProductCarousel from '@/components/ProductCarousel';
import { SITE_CONFIG } from '@/lib/config';
import { ArrowRight, Sparkles, ShieldCheck, Truck, MessageSquare } from 'lucide-react';

export default async function Home() {
  // Fetch live products from Google Sheets
  const allProducts = await fetchProductsFromSheet();

  // Pick up to 5 random items that are in stock
  const inStockProducts = allProducts.filter((p) => p.inStock);
  const randomProducts = [...inStockProducts]
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);

  return (
    <div className="min-h-[75vh] flex flex-col justify-center items-center py-8">
      <div className="max-w-xl w-full text-center space-y-8">
        
        {/* Logo */}
        <div className="flex justify-center">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 p-2 bg-white rounded-3xl shadow-md border border-rose-100 flex items-center justify-center">
            <Image
              src="/logo.jpeg"
              alt={`${SITE_CONFIG.name} Logo`}
              width={140}
              height={140}
              priority
              className="object-contain rounded-2xl"
            />
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="space-y-3">
          <span className="bg-rose-100 text-rose-900 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Authentic Imports Tanzania
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {SITE_CONFIG.name}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-lg mx-auto leading-relaxed">
            {SITE_CONFIG.tagline}
          </p>
        </div>

        {/* Primary Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-1">
          <Link
            href="/products"
            className="w-full sm:w-auto bg-rose-900 hover:bg-rose-950 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-rose-950/10 transition-all flex items-center justify-center gap-2 text-base"
          >
            Browse All Products
            <ArrowRight className="w-5 h-5" />
          </Link>

          <a
            href={SITE_CONFIG.socials.whatsappLink('Hujambo! I have an inquiry from the website.')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-base"
          >
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            Chat on WhatsApp
          </a>
        </div>

        {/* Revolving Carousel of Random Products */}
        

<ProductCarousel products={randomProducts} whatsappNumber={SITE_CONFIG.whatsappNumber} />

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200 text-slate-600 text-xs font-medium">
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-rose-800" />
            <span>100% Authentic</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Truck className="w-6 h-6 text-rose-800" />
            <span>Nationwide Delivery</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <MessageSquare className="w-6 h-6 text-rose-800" />
            <span>Easy Mobile Pay</span>
          </div>
        </div>

      </div>
    </div>
  );
}