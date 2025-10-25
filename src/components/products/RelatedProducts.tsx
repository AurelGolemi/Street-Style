"use client";

import { Product } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ProductCard from "@/components/products/ProductCard";

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener("resize", checkScrollPosition);
    return () => window.removeEventListener("resize", checkScrollPosition);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });

    setTimeout(checkScrollPosition, 300);
  };

  if (products.length === 0) return null;

  return (
    <div className="relative">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          You Might Also Like
        </h2>

        {/* Desktop Navigation Arrows */}
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 rounded-full border-2 transition-all ${
              canScrollLeft
                ? "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                : "border-gray-300 text-gray-400 cursor-not-allowed"
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-2 rounded-full border-2 transition-all ${
              canScrollRight
                ? "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                : "border-gray-300 text-gray-400 cursor-not-allowed"
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Products Carousel */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScrollPosition}
        className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-64 snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* View All Link */}
      <div className="text-center mt-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition"
        >
          View All Products
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
