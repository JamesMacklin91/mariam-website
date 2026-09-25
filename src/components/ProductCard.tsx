// src/components/ProductCard.tsx
'use client';

import { useState } from 'react';
import { ProductItem } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { formatImageUrl } from '@/lib/utils';
import ProductModal from './ProductModal';
import { ShoppingBag, Eye, Package, MessageCircle } from 'lucide-react';

interface ProductCardProps {
  product: ProductItem;
  whatsappNumber: string;
}

export default function ProductCard({ product, whatsappNumber }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const productId = product.id || product.name;
  const formattedImg = formatImageUrl(product.imageUrl);
  const maxStock = typeof product.stock === 'number' ? product.stock : (product.inStock ? 10 : 0);

  const handleDirectWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents opening modal when clicking WhatsApp button
    const message = `*INQUIRY - MARIAM'S MARKET*\nHi! I'm interested in ordering *${product.name}* (TZS ${(product.priceTZS || 0).toLocaleString()}). Is this item available?`;
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents opening modal when clicking Add to Bag
    addToCart(productId, maxStock);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group h-full">
        {/* Clickable Image & Details Area */}
        <div onClick={() => setIsModalOpen(true)} className="cursor-pointer">
          {/* Image Container */}
          <div className="relative aspect-square bg-slate-100 overflow-hidden flex items-center justify-center">
            {formattedImg ? (
              <img
                src={formattedImg}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 gap-1">
                <Package className="w-8 h-8" />
                <span className="text-[10px]">No Image</span>
              </div>
            )}

            {/* Quick-View Badge */}
            <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="bg-white/95 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-xs flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> Quick View
              </span>
            </div>

            {product.category && (
              <span className="absolute top-2 left-2 bg-slate-900/75 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                {product.category}
              </span>
            )}
          </div>

          {/* Card Info */}
          <div className="p-4 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-rose-900 transition-colors">
              {product.name}
            </h3>

            <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px]">
              {product.description || 'Quality product from Mariam\'s Market.'}
            </p>

            <p className="text-base font-extrabold text-rose-900">
              TZS {(product.priceTZS || 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Stacked Action Buttons */}
        <div className="p-4 pt-0 space-y-2">
          {/* Add to Bag Button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            type="button"
            className="w-full py-2.5 px-3 bg-rose-900 hover:bg-rose-950 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            title="Add to multi-item cart drawer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>

          {/* Order via WhatsApp Button */}
          <button
            onClick={handleDirectWhatsAppOrder}
            disabled={!product.inStock}
            type="button"
            className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            title="Order directly on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Order via WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Portal-backed Modal */}
      {isModalOpen && (
        <ProductModal
          product={product}
          whatsappNumber={whatsappNumber}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}