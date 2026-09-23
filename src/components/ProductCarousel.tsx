// src/components/ProductCarousel.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { ProductItem } from '@/lib/types';
import ProductCard from './ProductCard';
import { SITE_CONFIG } from '@/lib/config';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface ProductCarouselProps {
  products: ProductItem[];
  whatsappNumber?: string;
}

export default function ProductCarousel({
  products,
  whatsappNumber = SITE_CONFIG.whatsappNumber,
}: ProductCarouselProps) {
  if (!products || products.length === 0) return null;

  // Clone items for infinite wrap-around
  const extendedProducts = [
    products[products.length - 1],
    ...products,
    products[0],
  ];

  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Auto-play timer: restarting every time `currentIndex` updates
  useEffect(() => {
    if (products.length <= 1) return;

    const timer = setTimeout(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 4000);

    return () => clearTimeout(timer); // Clears timer instantly whenever index changes
  }, [currentIndex, products.length]);

  // Seamless Teleporting at Boundaries
  const handleTransitionEnd = () => {
    if (currentIndex === 0) {
      setIsTransitioning(false);
      setCurrentIndex(products.length);
    } else if (currentIndex === extendedProducts.length - 1) {
      setIsTransitioning(false);
      setCurrentIndex(1);
    }
  };

  // Re-enable smooth transitions on the next frame after a silent teleport
  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  const handlePrev = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1); // Updating state auto-resets the timer useEffect
  };

  const handleNext = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1); // Updating state auto-resets the timer useEffect
  };

  const handleDotClick = (realIndex: number) => {
    setIsTransitioning(true);
    setCurrentIndex(realIndex + 1);
  };

  // Active dot mapping
  const activeDotIndex =
    currentIndex === 0
      ? products.length - 1
      : currentIndex === extendedProducts.length - 1
      ? 0
      : currentIndex - 1;

  return (
    <div className="w-full space-y-4 pt-6">
      <div className="flex items-center justify-between px-2">
        <span className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Featured In Stock
        </span>

        {/* Manual Arrow Controls */}
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            aria-label="Previous product"
            className="p-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next product"
            className="p-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Track Container */}
      <div className="relative overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
        <div
          onTransitionEnd={handleTransitionEnd}
          className={`flex ${
            isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''
          }`}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {extendedProducts.map((product, idx) => (
            <div key={`${product.id}-${idx}`} className="w-full shrink-0">
              <ProductCard product={product} whatsappNumber={whatsappNumber} />
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {products.length > 1 && (
        <div className="flex justify-center gap-1.5 pt-1">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeDotIndex === idx ? 'w-6 bg-rose-900' : 'w-2 bg-slate-200'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}