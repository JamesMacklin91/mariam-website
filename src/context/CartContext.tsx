// src/context/CartContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ProductItem } from '@/lib/types';

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: ProductItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalCount: number;
  totalPriceTZS: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('mariam_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to parse cart from localStorage:', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('mariam_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cart]);

  // Helper to determine maximum allowable quantity for a product
  const getMaxStock = (product: ProductItem): number => {
    if (typeof product.stock === 'number' && product.stock > 0) {
      return product.stock;
    }
    // If no stock count is provided, but inStock is true, cap at 10 (or 1 if preferred)
    return product.inStock ? 10 : 0;
  };

  const addToCart = (product: ProductItem) => {
  const maxStock = getMaxStock(product);
  if (maxStock <= 0) return;

  setCart((prevCart) => {
    const targetId = product.id || product.name;
    const existingIndex = prevCart.findIndex(
      (item) => (item.product.id || item.product.name) === targetId
    );

    if (existingIndex > -1) {
      const currentQty = prevCart[existingIndex].quantity;
      
      // If already at or above max stock, return existing state unchanged
      if (currentQty >= maxStock) return prevCart;

      // Create a clean new array and increment quantity by EXACTLY 1
      return prevCart.map((item, idx) => {
        if (idx === existingIndex) {
          return {
            ...item,
            quantity: Math.min(item.quantity + 1, maxStock),
          };
        }
        return item;
      });
    }

    // New item being added for the first time
    return [...prevCart, { product, quantity: 1 }];
  });

  setIsCartOpen(true);
};
  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => (item.product.id || item.product.name) !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          const id = item.product.id || item.product.name;
          if (id === productId) {
            const maxStock = getMaxStock(item.product);
            const newQty = item.quantity + delta;

            if (newQty <= 0) return null;
            return { ...item, quantity: Math.min(newQty, maxStock) };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const clearCart = () => setCart([]);

  const totalCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const totalPriceTZS = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.priceTZS || 0) * item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalCount,
        totalPriceTZS,
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