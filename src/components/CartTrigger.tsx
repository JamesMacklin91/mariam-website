// src/components/CartTrigger.tsx
'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingBag } from 'lucide-react';

export default function CartTrigger() {
  const { totalCount, setIsCartOpen } = useCart();

  return (
    <button
      onClick={() => setIsCartOpen(true)}
      type="button"
      className="relative flex items-center justify-center p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
      aria-label="Open cart"
    >
      <ShoppingBag className="w-5 h-5 text-slate-700" />
      {totalCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-rose-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-xs">
          {totalCount}
        </span>
      )}
    </button>
  );
}