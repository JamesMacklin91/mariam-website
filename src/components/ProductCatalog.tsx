'use client';

import { useMemo, useTransition } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ProductItem } from '../lib/types';
import ProductCard from './ProductCard';
import { Search, Filter, ArrowUpDown, Package } from 'lucide-react';

interface ProductCatalogProps {
  initialProducts: ProductItem[];
  whatsappNumber: string;
}

export default function ProductCatalog({ initialProducts, whatsappNumber }: ProductCatalogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Read state directly from URL query parameters (resilient to browser history navigation)
  const searchTerm = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'All';
  const sortBy = (searchParams.get('sort') as 'default' | 'price-asc' | 'price-desc') || 'default';
  const inStockOnly = searchParams.get('inStock') === 'true';

  // Helper function to update search params reliably without breaking history stack
  const updateQueryParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'All' || value === 'default' || value === 'false') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const queryString = params.toString();
    const query = queryString ? `?${queryString}` : '';

    // Non-blocking transition preventing state race conditions on rapid navigation
    startTransition(() => {
      router.replace(`${pathname}${query}`, { scroll: false });
    });
  };

  const categories = useMemo(() => {
    const cats = new Set(initialProducts.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        const matchesSearch =
          !searchTerm ||
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
          selectedCategory === 'All' || product.category === selectedCategory;

        const matchesStock = !inStockOnly || product.inStock;

        return matchesSearch && matchesCategory && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceTZS - b.priceTZS;
        if (sortBy === 'price-desc') return b.priceTZS - a.priceTZS;
        return 0;
      });
  }, [initialProducts, searchTerm, selectedCategory, sortBy, inStockOnly]);

  return (
    <div className={`space-y-8 transition-opacity duration-150 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
      {/* Search & Filters Header */}
      <div className="bg-white border border-slate-200 p-4 sm:p-6 rounded-xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by perfume name, supplement..."
              value={searchTerm}
              onChange={(e) => updateQueryParams({ search: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
            />
          </div>

          <div className="flex gap-3">
            <div className="relative min-w-[160px]">
              <ArrowUpDown className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => updateQueryParams({ sort: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-rose-800 cursor-pointer"
              >
                <option value="default">Sort by: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            <label className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => updateQueryParams({ inStock: e.target.checked ? 'true' : null })}
                className="accent-rose-800 rounded"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateQueryParams({ category: cat })}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-rose-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Rendering */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
          <Package className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-slate-700 font-semibold">No products match your current filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              whatsappNumber={whatsappNumber}
            />
          ))}
        </div>
      )}
    </div>
  );
}