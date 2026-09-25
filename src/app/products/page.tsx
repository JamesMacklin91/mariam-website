// src/app/products/page.tsx
import { fetchProductsFromSheet } from '@/lib/sheets';
import ProductCatalog from '@/components/ProductCatalog';
import { SITE_CONFIG } from '@/lib/config';
import { Sparkles } from 'lucide-react';

export const metadata = {
  title: `All Products | ${SITE_CONFIG.name}`,
  description: SITE_CONFIG.tagline,
};

export default async function ProductsPage() {
  const products = await fetchProductsFromSheet();

  return (
    <div className="space-y-8 py-4">
      <section className="text-center space-y-3 max-w-2xl mx-auto pt-2">
        <span className="bg-rose-100 text-rose-900 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Full Catalog
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Explore Our Collection
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Filter through our live inventory of authentic perfumes, skincare, and daily health supplements.
        </p>
      </section>

      <ProductCatalog initialProducts={products} whatsappNumber={SITE_CONFIG.whatsappNumber} />
    </div>
  );
}