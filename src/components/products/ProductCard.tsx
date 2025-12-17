"use client";

import { formatPrice, getDiscountPercentage, isOnSale } from "@/data/products";
import { Product } from "@/lib/types";
import { useCartStore } from "@/store/CartStore";
import { getProductUrl } from "@/utils/urls";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  showQuickAdd?: boolean;
  onNavigate?: () => void;
}

export default function ProductCard({
  product,
  priority = false,
  showQuickAdd = true,
  onNavigate,
}: ProductCardProps) {
  // STATE MANAGEMENT
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Cart store
  const addItem = useCartStore((state) => state.addItem);

  // COMPUTED VALUES
  const discount = getDiscountPercentage(product);
  const onSale = isOnSale(product);

  // Get secondary image for hover effect (if available)
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] || product.images[0];

  // ✅ FIX: Correct product URL generation
  const productUrl = getProductUrl(product.id);

  // EVENT HANDLERS
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Validate: Product must have size options
    if (!product.sizes || product.sizes.length === 0) {
      // ✅ CRITICAL FIX: Changed from /product/ to /products/
      window.location.href = productUrl;
      return;
    }

    setIsAddingToCart(true);

    // Simulate API delay
    setTimeout(() => {
      addItem({
        productId: product.id,
        id: `${product.id}-${product.sizes[0]}-${
          product.colors[0]?.name || "default"
        }`,
        name: product.name,
        brand: product.brand,
        price: product.price,
        quantity: 1,
        size: product.sizes[0],
        color: product.colors[0]?.name || "Default",
        image: product.images[0],
      });

      setIsAddingToCart(false);

      setTimeout(() => {
        // Could trigger cart sidebar here
      }, 500);
    }, 300);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsWishlisted(!isWishlisted);

    // Track analytics
    if (typeof window !== "undefined") {
      const w = window as Window & { gtag?: (...args: unknown[]) => void };
      if (w.gtag) {
        w.gtag(
          "event",
          isWishlisted ? "remove_from_wishlist" : "add_to_wishlist",
          {
            items: [
              {
                item_id: product.id,
                item_name: product.name,
              },
            ],
          }
        );
      }
    }
  };

  // ✅ DEBUG: Log product URL in development
  if (process.env.NODE_ENV === "development") {
    console.log(`ProductCard: ${product.name} -> ${productUrl}`);
  }

  // RENDER
  return (
    <Link
      href={productUrl}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onNavigate}
    >
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-400 transition-all duration-300 hover:shadow-lg">
        {/* IMAGE SECTION */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {/* Primary Image */}
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-500 ${
              isHovered ? "opacity-0 scale-110" : "opacity-100 scale-100"
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
          />

          {/* Secondary Image (Hover) */}
          <Image
            src={secondaryImage}
            alt={`${product.name} - alternative view`}
            fill
            className={`object-cover transition-all duration-500 ${
              isHovered ? "opacity-100 scale-100" : "opacity-0 scale-110"
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {/* Sale Badge */}
            {onSale && discount > 0 && (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                -{discount}%
              </span>
            )}

            {/* New Badge */}
            {product.createdAt &&
              new Date().getTime() - new Date(product.createdAt).getTime() <
                30 * 24 * 60 * 60 * 1000 && (
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                  NEW
                </span>
              )}

            {/* Low Stock Badge */}
            {product.inStock &&
              product.stockLevel &&
              product.stockLevel <= (product.lowStockThreshold || 10) && (
                <span className="bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded">
                  LOW STOCK
                </span>
              )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-white/90 text-gray-700 hover:bg-white"
            } ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2"
            }`}
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
          >
            <Heart
              className={`w-5 h-5 transition-transform ${
                isWishlisted ? "fill-current scale-110" : ""
              }`}
            />
          </button>

          {/* Quick Add Button */}
          {showQuickAdd && product.inStock && (
            <div
              className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${
                isHovered
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              }`}
            >
              <button
                onClick={handleQuickAdd}
                disabled={isAddingToCart}
                className="w-full bg-gray-900 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAddingToCart ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Quick Add
                  </>
                )}
              </button>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center">
              <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* INFO SECTION */}
        <div className="p-4">
          {/* Brand */}
          <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">
            {product.brand}
          </p>

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(product.rating!)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">
                ({product.reviewCount})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice, product.currency)}
              </span>
            )}
          </div>

          {/* Color Options (Preview) */}
          {product.colors && product.colors.length > 1 && (
            <div className="flex items-center gap-1 mt-3">
              {product.colors.slice(0, 5).map((color, index) => (
                <div
                  key={index}
                  className="w-5 h-5 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.hex || "#ccc" }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-xs text-gray-600 ml-1">
                  +{product.colors.length - 5}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
