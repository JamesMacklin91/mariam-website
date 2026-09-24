// src/components/CartDrawer.tsx
'use client';

import { useCart } from '@/context/CartContext';
import { SITE_CONFIG } from '@/lib/config';
import { formatImageUrl } from '@/lib/utils';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  whatsappNumber?: string;
}

export default function CartDrawer({
  whatsappNumber = SITE_CONFIG.whatsappNumber,
}: CartDrawerProps) {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalPriceTZS,
    totalCount,
  } = useCart();

  if (!isCartOpen) return null;

  // Format multi-item order summary for WhatsApp
  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;

    let message = `*NEW ORDER - MARIAM'S MARKET*\n`;
    message += `-----------------------------------\n`;

    cart.forEach((item, index) => {
      const itemTotal = (item.product.priceTZS || 0) * item.quantity;
      message += `${index + 1}. *${item.product.name}*\n`;
      message += `   Qty: ${item.quantity} x TZS ${item.product.priceTZS.toLocaleString()} = TZS ${itemTotal.toLocaleString()}\n\n`;
    });

    message += `-----------------------------------\n`;
    message += `*TOTAL AMOUNT: TZS ${totalPriceTZS.toLocaleString()}*\n\n`;
    message += `Please confirm availability and delivery options. Thank you!`;

    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-rose-900" />
              <h2 className="text-lg font-bold text-slate-900">Your Shopping Bag</h2>
              <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-rose-100 text-rose-900 rounded-full">
                {totalCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-slate-700 font-semibold text-base">Your bag is empty</p>
                <p className="text-slate-500 text-xs">Add items from the catalog to build your order.</p>
              </div>
            ) : (
              cart.map((item) => {
                const itemId = item.product.id || item.product.name;
                const formattedImg = formatImageUrl(item.product.imageUrl);
                const maxStock = typeof item.product.stock === 'number' ? item.product.stock : 1;
                const isAtMax = item.quantity >= maxStock;

                return (
                  <div
                    key={itemId}
                    className="flex gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl items-center"
                  >
                    {/* Item Image */}
                    <div className="w-16 h-16 rounded-lg bg-slate-200 shrink-0 overflow-hidden relative">
                      {formattedImg ? (
                        <img
                          src={formattedImg}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    {/* Details & Controls */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(itemId)}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs font-bold text-slate-700">
                        TZS {((item.product.priceTZS || 0) * item.quantity).toLocaleString()}
                      </p>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => updateQuantity(itemId, -1)}
                          className="w-6 h-6 rounded border border-slate-300 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        
                        <span className="text-xs font-bold text-slate-800 w-4 text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(itemId, 1)}
                          disabled={isAtMax}
                          className="w-6 h-6 rounded border border-slate-300 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                          title={isAtMax ? `Only ${maxStock} available in stock` : undefined}
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>

                        {isAtMax && (
                          <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded ml-1">
                            Max stock ({maxStock})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & WhatsApp Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50 space-y-4">
              <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                <span>Total Amount:</span>
                <span className="text-lg text-rose-900">
                  TZS {totalPriceTZS.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleWhatsAppCheckout}
                  type="button"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <span>Send Order via WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={clearCart}
                  className="w-full text-center text-xs text-slate-500 hover:text-slate-700 py-1 cursor-pointer"
                >
                  Clear Bag
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}