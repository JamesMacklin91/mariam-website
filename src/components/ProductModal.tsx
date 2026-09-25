// src/components/ProductModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ProductItem } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { formatImageUrl } from '@/lib/utils';
import { X, ShoppingBag, Plus, Minus, CheckCircle, Package, MessageCircle } from 'lucide-react';

interface ProductModalProps {
  product: ProductItem | null;
  whatsappNumber: string;
  onClose: () => void;
}

export default function ProductModal({ product, whatsappNumber, onClose }: ProductModalProps) {
  const { addToCart, cartRecords } = useCart();
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background scrolling when modal is open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  if (!product || !mounted) return null;

  const productId = product.id || product.name;
  const formattedImg = formatImageUrl(product.imageUrl);
  const maxStock = typeof product.stock === 'number' && product.stock > 0 ? product.stock : 10;
  
  const currentInCart = cartRecords.find((r) => r.id === productId)?.quantity || 0;
  const remainingAvailable = Math.max(0, maxStock - currentInCart);

  const handleAddMultiple = () => {
    if (!product.inStock || remainingAvailable <= 0) return;

    for (let i = 0; i < quantityToAdd; i++) {
      addToCart(productId, maxStock);
    }
    onClose();
  };

  const handleDirectWhatsApp = () => {
    const itemTotal = (product.priceTZS || 0) * quantityToAdd;
    let message = `*INQUIRY / DIRECT ORDER - MARIAM'S MARKET*\n`;
    message += `-----------------------------------\n`;
    message += `Product: *${product.name}*\n`;
    message += `Quantity: ${quantityToAdd}\n`;
    message += `Price: TZS ${itemTotal.toLocaleString()}\n`;
    message += `-----------------------------------\n`;
    message += `Please confirm availability and delivery options. Thank you!`;

    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-slate-200 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Panel */}
          <div className="bg-slate-100 relative min-h-[260px] md:min-h-[380px] flex items-center justify-center p-6">
            {formattedImg ? (
              <img
                src={formattedImg}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain max-h-[320px] rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                <Package className="w-12 h-12" />
                <span className="text-xs">No image preview</span>
              </div>
            )}

            {/* Category Badge (Matched to ProductCard) */}
            {product.category && (
              <span className="absolute top-2 left-2 bg-slate-900/75 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                {product.category}
              </span>
            )}

            {/* Stock Badge */}
            <div className="absolute bottom-4 left-4">
              {product.inStock ? (
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200 shadow-2xs">
                  <CheckCircle className="w-3.5 h-3.5" />
                  In Stock ({maxStock})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-full border border-rose-200 shadow-2xs">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Details & Actions */}
          <div className="p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 leading-snug">
                {product.name}
              </h2>

              <p className="text-2xl font-extrabold text-rose-900">
                TZS {(product.priceTZS || 0).toLocaleString()}
              </p>

              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Product Details
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-h-40 overflow-y-auto pr-1">
                  {product.description || 'No additional description available.'}
                </p>
              </div>
            </div>

            {/* Action Area */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              {product.inStock && remainingAvailable > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">Quantity:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantityToAdd((prev) => Math.max(1, prev - 1))}
                        disabled={quantityToAdd <= 1}
                        className="w-7 h-7 rounded border border-slate-300 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      
                      <span className="text-sm font-bold text-slate-800 w-6 text-center">
                        {quantityToAdd}
                      </span>

                      <button
                        onClick={() => setQuantityToAdd((prev) => Math.min(remainingAvailable, prev + 1))}
                        disabled={quantityToAdd >= remainingAvailable}
                        className="w-7 h-7 rounded border border-slate-300 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Stacked Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={handleAddMultiple}
                      type="button"
                      className="w-full py-2.5 px-3 bg-rose-900 hover:bg-rose-950 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>

                    <button
                      onClick={handleDirectWhatsApp}
                      type="button"
                      className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Order via WhatsApp</span>
                    </button>
                  </div>
                </>
              ) : (
                <button
                  disabled
                  className="w-full py-3 px-4 bg-slate-200 text-slate-500 font-bold rounded-xl text-sm cursor-not-allowed"
                >
                  Currently Unavailable
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}