// src/context/CartContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

export interface CartRecord {
  id: string;
  quantity: number;
}

interface CartContextType {
  cartRecords: CartRecord[];
  addToCart: (productId: string, maxStock?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number, maxStock?: number) => void;
  clampRecordQuantity: (productId: string, maxStock: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartRecords, setCartRecords] = useState<CartRecord[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mariam_cart_v2');
      if (saved) {
        setCartRecords(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to parse cart from localStorage:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('mariam_cart_v2', JSON.stringify(cartRecords));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cartRecords, isHydrated]);

  const addToCart = (productId: string, maxStock = 10) => {
    if (maxStock <= 0) return;

    setCartRecords((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === productId);

      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        if (currentQty >= maxStock) return prev;

        return prev.map((item, idx) => {
          if (idx === existingIndex) {
            return { id: item.id, quantity: Math.min(item.quantity + 1, maxStock) };
          }
          return item;
        });
      }

      return [...prev, { id: productId, quantity: 1 }];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCartRecords((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number, maxStock = 10) => {
    setCartRecords((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return { id: item.id, quantity: Math.min(newQty, maxStock) };
          }
          return item;
        })
        .filter((item): item is CartRecord => item !== null)
    );
  };

  // Clamps stored state down to match live stock changes from Google Sheets
  const clampRecordQuantity = useCallback((productId: string, maxStock: number) => {
    setCartRecords((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            if (maxStock <= 0) return null;
            if (item.quantity > maxStock) {
              return { id: item.id, quantity: maxStock };
            }
          }
          return item;
        })
        .filter((item): item is CartRecord => item !== null)
    );
  }, []);

  const clearCart = () => setCartRecords([]);

  const totalCount = useMemo(() => {
    return cartRecords.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartRecords]);

  return (
    <CartContext.Provider
      value={{
        cartRecords,
        addToCart,
        removeFromCart,
        updateQuantity,
        clampRecordQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}