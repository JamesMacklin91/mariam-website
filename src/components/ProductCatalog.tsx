// src/components/ProductCatalog.tsx
'use client';

import { useState, useMemo } from 'react';
import { ProductItem } from '../lib/types';
import ProductCard from './ProductCard';
import { Search, Filter, ArrowUpDown, Package } from 'lucide-react';

interface ProductCatalogProps {
  initialProducts: ProductItem[];
  whatsappNumber: string;
}

export default function ProductCatalog({ initialProducts, whatsappNumber }: ProductCatalogProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  const categories: string[] = useMemo(() => {
    if (!initialProducts || !Array.isArray(initialProducts)) return ['All'];
    const cats = new Set<string>();
    initialProducts.forEach((p) => {
      if (p.category && typeof p.category === 'string' && p.category.trim()) {
        cats.add(p.category.trim());
      }
    });
    return ['All', ...Array.from(cats)];
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    if (!initialProducts) return [];

    const query = searchTerm.toLowerCase().trim();

    return initialProducts
      .filter((product) => {
        const matchesSearch =
          !query ||
          product.name?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query);

        const matchesCategory =
          selectedCategory === 'All' || product.category === selectedCategory;

        const matchesStock = !inStockOnly || Boolean(product.inStock);

        return matchesSearch && matchesCategory && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return (a.priceTZS || 0) - (b.priceTZS || 0);
        if (sortBy === 'price-desc') return (b.priceTZS || 0) - (a.priceTZS || 0);
        return 0;
      });
  }, [initialProducts, searchTerm, selectedCategory, sortBy, inStockOnly]);

  return (
    <div className="space-y-8">
      {/* Search & Filters Controls */}
      <div className="bg-white border border-slate-200 p-4 sm:p-6 rounded-xl shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 justify-between items-stretch lg:items-center">
          
          {/* Search Box */}
          <div className="relative flex-1 h-11 flex items-center">
            <Search className="w-5 h-5 absolute left-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by perfume name, supplement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-full pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-800"
            />
          </div>

          {/* Sort & Stock Toggles */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Sort Dropdown */}
            <div className="relative w-full sm:w-48 h-11 flex items-center">
              <ArrowUpDown className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none z-10" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full h-full pl-9 pr-8 bg-slate-50 border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-rose-800 cursor-pointer text-slate-700 font-medium"
              >
                <option value="default">Sort by: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <div className="absolute right-3 pointer-events-none text-slate-400 text-[10px]">
                ▼
              </div>
            </div>

            {/* In Stock Toggle */}
            <label className="flex items-center justify-center gap-2 px-4 h-11 w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 cursor-pointer select-none hover:bg-slate-100 transition-colors shrink-0">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-rose-800 rounded w-4 h-4 cursor-pointer"
              />
              <span className="whitespace-nowrap">In Stock Only</span>
            </label>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {categories.map((cat: string) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
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

      {/* Grid Display */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
          <Package className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-slate-700 font-semibold">No products match your current filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id || `${product.name}-${index}`}
              product={product}
              whatsappNumber={whatsappNumber}
            />
          ))}
        </div>
      )}
    </div>
  );
}