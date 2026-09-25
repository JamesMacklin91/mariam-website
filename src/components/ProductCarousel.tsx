// src/components/ProductCarousel.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
  const [dragOffset, setDragOffset] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const startXRef = useRef<number>(0);
  const isAnimatingRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to start/reset the auto-play countdown
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (products.length <= 1) return;

    timerRef.current = setInterval(() => {
      if (!isDraggingRef.current && !isAnimatingRef.current) {
        isAnimatingRef.current = true;
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);
      }
    }, 4500);
  }, [products.length]);

  // Initialize and cleanup timer
  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  // Handle seamless teleporting at boundaries after transition completes
  const handleTransitionEnd = () => {
    isAnimatingRef.current = false;

    if (currentIndex === 0) {
      setIsTransitioning(false);
      setCurrentIndex(products.length);
    } else if (currentIndex === extendedProducts.length - 1) {
      setIsTransitioning(false);
      setCurrentIndex(1);
    }
  };

  // Re-enable smooth transitions on the frame after a silent teleport
  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  const handlePrev = useCallback(() => {
    if (isAnimatingRef.current) return;
    startTimer(); // Reset auto-play timer on manual action
    isAnimatingRef.current = true;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [startTimer]);

  const handleNext = useCallback(() => {
    if (isAnimatingRef.current) return;
    startTimer(); // Reset auto-play timer on manual action
    isAnimatingRef.current = true;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [startTimer]);

  // Gesture Handlers (Real-time Drag + Instant Response)
  const handleGestureStart = (clientX: number) => {
    if (isAnimatingRef.current) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = clientX;
    setDragOffset(0);
  };

  const handleGestureMove = (clientX: number) => {
    if (!isDraggingRef.current) return;
    const deltaX = clientX - startXRef.current;

    if (Math.abs(deltaX) > 6) {
      hasDraggedRef.current = true;
    }

    setDragOffset(deltaX);
  };

  const handleGestureEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    const containerWidth = containerRef.current?.offsetWidth || 300;
    const threshold = containerWidth * 0.15; // Requires 15% container swipe width

    setIsTransitioning(true);

    if (dragOffset < -threshold) {
      handleNext();
    } else if (dragOffset > threshold) {
      handlePrev();
    } else {
      // If swipe didn't cross threshold, still reset timer
      startTimer();
    }

    setDragOffset(0);
  };

  // Prevent modal popping if drag occurred
  const handleCaptureClick = (e: React.MouseEvent) => {
    if (hasDraggedRef.current) {
      e.stopPropagation();
      e.preventDefault();
      hasDraggedRef.current = false;
    }
  };

  const handleDotClick = (realIndex: number) => {
    if (isAnimatingRef.current) return;
    startTimer(); // Reset timer when clicking dots
    isAnimatingRef.current = true;
    setIsTransitioning(true);
    setCurrentIndex(realIndex + 1);
  };

  const activeDotIndex = (currentIndex - 1 + products.length) % products.length;

  return (
    <div className="w-full space-y-4 pt-4 max-w-sm sm:max-w-md mx-auto select-none">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-2">
        <span className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Featured In Stock
        </span>

        {/* Manual Controls */}
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            aria-label="Previous product"
            className="p-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next product"
            className="p-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Track Container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl border border-slate-200 shadow-2xs bg-white touch-pan-y cursor-grab active:cursor-grabbing"
        onTouchStart={(e) => handleGestureStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleGestureMove(e.touches[0].clientX)}
        onTouchEnd={handleGestureEnd}
        onMouseDown={(e) => handleGestureStart(e.clientX)}
        onMouseMove={(e) => handleGestureMove(e.clientX)}
        onMouseUp={handleGestureEnd}
        onMouseLeave={handleGestureEnd}
        onClickCapture={handleCaptureClick}
      >
        <div
          onTransitionEnd={handleTransitionEnd}
          className={`flex ${
            isTransitioning && !isDraggingRef.current
              ? 'transition-transform duration-500 ease-out'
              : ''
          }`}
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
          }}
        >
          {extendedProducts.map((product, idx) => (
            <div key={`${product.id || product.name}-${idx}`} className="w-full shrink-0">
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
                activeDotIndex === idx ? 'w-6 bg-rose-900' : 'w-2 bg-slate-200 hover:bg-slate-300'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}