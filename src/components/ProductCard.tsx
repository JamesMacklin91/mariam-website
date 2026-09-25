// src/components/ProductCard.tsx
'use client';

import { useState } from 'react';
import { ProductItem } from '../lib/types';
import OrderButton from './OrderButton';
import { Package, ShoppingBag } from 'lucide-react';
import { formatImageUrl } from '@/lib/utils';
import { useCart } from '@/context/CartContext'; // <--- Import

interface ProductCardProps {
  product: ProductItem;
  whatsappNumber: string;
}

export default function ProductCard({ product, whatsappNumber }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const { addToCart } = useCart(); // <--- Hook into cart context
  const formattedImgUrl = formatImageUrl(product.imageUrl);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        {/* Image Header */}
        <div className="relative w-full h-52 bg-slate-100 flex items-center justify-center">
          {formattedImgUrl && !imgError ? (
            <img
              src={formattedImgUrl}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-slate-400 flex flex-col items-center gap-1">
              <Package className="w-10 h-10" />
              <span className="text-xs">No image available</span>
            </div>
          )}
          <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 bg-white/90 backdrop-blur text-rose-900 rounded-md shadow-sm">
            {product.category}
          </span>
        </div>

        {/* Product Details */}
        <div className="p-5 space-y-2">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-base font-bold text-slate-900 leading-snug">{product.name}</h3>
            <span
              className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded shrink-0 ${
                product.inStock ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
              }`}
            >
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          {product.description && (
            <p className="text-slate-600 text-xs line-clamp-2">{product.description}</p>
          )}
        </div>
      </div>

      {/* Pricing & CTAs */}
      <div className="p-5 pt-0 mt-2 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Price</span>
            <span className="text-base font-bold text-slate-900">
              TZS {product.priceTZS.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => addToCart(product.id)}
            disabled={!product.inStock}
            type="button"
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>

          <OrderButton
            projectTitle={product.name}
            priceTZS={product.priceTZS}
            whatsappNumber={whatsappNumber}
          />
        </div>
      </div>
    </div>
  );
}