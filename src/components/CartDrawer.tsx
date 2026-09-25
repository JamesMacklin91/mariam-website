// src/components/CartDrawer.tsx
'use client';

import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductContext';
import { SITE_CONFIG } from '@/lib/config';
import { formatImageUrl } from '@/lib/utils';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

export default function CartDrawer({
  whatsappNumber = SITE_CONFIG.whatsappNumber,
}: {
  whatsappNumber?: string;
}) {
  const { cartRecords, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart, totalCount } = useCart();
  const { getProductById } = useProducts();

  if (!isCartOpen) return null;

  // Re-map IDs to live product data directly on render
  const resolvedItems = cartRecords
    .map((record) => {
      const product = getProductById(record.id);
      if (!product || !product.inStock) return null; // Automatically drops items removed from sheet
      return {
        product,
        quantity: record.quantity,
      };
    })
    .filter((item): item is { product: ReturnType<typeof getProductById> & {}; quantity: number } => item !== null);

  const totalPriceTZS = resolvedItems.reduce(
    (sum, item) => sum + (item.product.priceTZS || 0) * item.quantity,
    0
  );

  const handleWhatsAppCheckout = () => {
    if (resolvedItems.length === 0) return;

    let message = `*NEW ORDER - MARIAM'S MARKET*\n`;
    message += `-----------------------------------\n`;

    resolvedItems.forEach((item, index) => {
      const itemTotal = (item.product.priceTZS || 0) * item.quantity;
      message += `${index + 1}. *${item.product.name}*\n`;
      message += `   Qty: ${item.quantity} x TZS ${item.product.priceTZS.toLocaleString()} = TZS ${itemTotal.toLocaleString()}\n\n`;
    });

    message += `-----------------------------------\n`;
    message += `*TOTAL AMOUNT: TZS ${totalPriceTZS.toLocaleString()}*\n\n`;
    message += `Please confirm availability and delivery options. Thank you!`;

    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div onClick={() => setIsCartOpen(false)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-rose-900" />
              <h2 className="text-lg font-bold text-slate-900">Your Shopping Bag</h2>
              <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-rose-100 text-rose-900 rounded-full">
                {totalCount}
              </span>
            </div>
            <button onClick={() => setIsCartOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {resolvedItems.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-slate-700 font-semibold">Your bag is empty</p>
              </div>
            ) : (
              resolvedItems.map(({ product, quantity }) => {
                const itemId = product.id || product.name;
                const formattedImg = formatImageUrl(product.imageUrl);
                const maxStock = typeof product.stock === 'number' ? product.stock : 10;
                const isAtMax = quantity >= maxStock;

                return (
                  <div key={itemId} className="flex gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl items-center">
                    <div className="w-16 h-16 rounded-lg bg-slate-200 shrink-0 overflow-hidden relative">
                      {formattedImg && (
                        <img src={formattedImg} alt={product.name} className="w-full h-full object-cover" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{product.name}</h4>
                        <button onClick={() => removeFromCart(itemId)} className="text-slate-400 hover:text-rose-600 p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs font-bold text-slate-700">
                        TZS {((product.priceTZS || 0) * quantity).toLocaleString()}
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <button onClick={() => updateQuantity(itemId, -1, maxStock)} className="w-6 h-6 border rounded bg-white flex items-center justify-center">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                        <button onClick={() => updateQuantity(itemId, 1, maxStock)} disabled={isAtMax} className="w-6 h-6 border rounded bg-white flex items-center justify-center disabled:opacity-40">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {resolvedItems.length > 0 && (
            <div className="p-4 border-t bg-slate-50 space-y-4">
              <div className="flex justify-between items-center text-sm font-bold">
                <span>Total:</span>
                <span className="text-rose-900">TZS {totalPriceTZS.toLocaleString()}</span>
              </div>
              <button onClick={handleWhatsAppCheckout} className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm">
                <span>Send Order via WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}