// src/context/ProductContext.tsx
'use client';

import React, { createContext, useContext } from 'react';
import { ProductItem } from '@/lib/types';

interface ProductContextType {
  products: ProductItem[];
  getProductById: (id: string) => ProductItem | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({
  children,
  initialProducts = [],
}: {
  children: React.ReactNode;
  initialProducts: ProductItem[];
}) {
  const getProductById = (id: string) => {
    return initialProducts.find((p) => (p.id || p.name) === id);
  };

  return (
    <ProductContext.Provider value={{ products: initialProducts, getProductById }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}