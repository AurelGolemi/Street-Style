"use client";

import Container from "@/components/ui/Container";
import {
  formatPrice,
  getDiscountPercentage,
  isLowStock,
} from "@/data/products";
import { Product } from "@/lib/types";
import { useCartStore } from "@/store/CartStore";
import {
  ChevronRight,
  Heart,
  RefreshCw,
  Share2,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import ProductTabs from "@/components/products/ProductTabs";
import RelatedProducts from "@/components/products/RelatedProducts";

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (
      command: "event",
      action: string,
      parameters?: Record<string, unknown>
    ) => void;
  }
}

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {

  // State Management

  // User selections
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors[0]?.name || ""
  );
  const [quantity, setQuantity] = useState<number>(1);

  // UI states
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAddedConfirmation, setShowAddedConfirmation] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  // Wishlist state (local - would sync with backend in production)
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Cart store
  const addItem = useCartStore((state) => state.addItem);

// Computed Values

  const discount = getDiscountPercentage(product);
  const isLowStockProduct = isLowStock(product);
  const savings = product.originalPrice
    ? formatPrice(product.originalPrice - product.price, product.currency)
    : null;

  // Get current color images (if available)
  const currentColorImages =
    product.colors.find((c) => c.name === selectedColor)?.images ||
    product.images;

// Event Handlers

  const handleAddToCart = () => {
    // Validate size selection
    if (!selectedSize) {
      setSizeError(true);
      // Scroll to size selector
      document.getElementById("size-selector")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    setSizeError(false);
    setIsAddingToCart(true);

    // Simulate API call delay (remove in production)
    setTimeout(() => {
      // Add to cart
      addItem({
        id: `${product.id}-${selectedSize}-${selectedColor}`,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        size: selectedSize,
        color: selectedColor,
        image: currentColorImages[0],
        category: product.category,
      });

      setIsAddingToCart(false);
      setShowAddedConfirmation(true);

      // Track analytics (example)
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "add_to_cart", {
          currency: product.currency,
          value: product.price * quantity,
          items: [
            {
              item_id: product.id,
              item_name: product.name,
              item_brand: product.brand,
              price: product.price,
              quantity: quantity,
            },
          ],
        });
      }

      // Hide confirmation after 3 seconds
      setTimeout(() => {
        setShowAddedConfirmation(false);
      }, 3000);
    }, 500);
  };

  {/*
   * Handle Wishlist Toggle
   *
   * In production, this would:
   * 1. Call API to save to user's wishlist
   * 2. Update global wishlist state
   * 3. Show toast notification
   */}
  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);

    // Track analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag(
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
  };

  // Handle social share
  // Uses Web Share API if available, falls back to copy link
  const handleShare = async () => {
    const shareData = {
      title: `${product.brand} ${product.name}`,
      text: product.shortDescription || product.description.slice(0, 100),
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

// Handle size selection
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setSizeError(false);
  };

// Handle color selection
  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName);
  };

// Handle quality change
  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

// Render

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        {/* Product Navigation */}
        <nav
          className="flex items-center space-x-2 text-sm mb-8"
          aria-label="Product Navigation"
        >
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 transition"
          >
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link
            href={`/${product.category}`}
            className="text-gray-600 hover:text-gray-900 transition capitalize"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link
            href={`/${product.category}?subcategory=${product.subcategory}`}
            className="text-gray-600 hover:text-gray-900 transition capitalize"
          >
            {product.subcategory}
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        {/* MAIN PRODUCT SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* LEFT COLUMN: Image Gallery */}
          <div>
            <ProductImageGallery
              images={currentColorImages}
              productName={product.name}
            />
          </div>

          {/* RIGHT COLUMN: Product Info */}
          <div>
            {/* Brand */}
            <Link
              href={`/brands/${product.brand.toLowerCase()}`}
              className="inline-block text-sm font-semibold text-gray-600 hover:text-gray-900 uppercase tracking-wider mb-2"
            >
              {product.brand}
            </Link>

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            {product.rating && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating!)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Price Section */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(product.originalPrice, product.currency)}
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>
              {savings && (
                <p className="text-sm text-green-600 font-medium">
                  You save {savings}
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.inStock ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium text-green-700">
                    {isLowStockProduct
                      ? `Only ${product.stockLevel} left in stock!`
                      : "In Stock"}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-sm font-medium text-red-700">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-gray-700 mb-8 leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* Color Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Color:{" "}
                <span className="font-normal text-gray-600">
                  {selectedColor}
                </span>
              </label>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleColorSelect(color.name)}
                    className={`group relative w-12 h-12 rounded-full border-2 transition-all ${
                      selectedColor === color.name
                        ? "border-gray-900 scale-110"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    aria-label={`Select ${color.name}`}
                    title={color.name}
                  >
                    <div
                      className="w-full h-full rounded-full"
                      style={{ backgroundColor: color.hex || "#ccc" }}
                    />
                    {selectedColor === color.name && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full border border-gray-900" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div id="size-selector" className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-900">
                  Select Size{" "}
                  {selectedSize && (
                    <span className="font-normal text-gray-600">
                      : {selectedSize}
                    </span>
                  )}
                </label>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Size Guide
                </button>
              </div>

              {sizeError && (
                <p className="text-sm text-red-600 mb-2">
                  Please select a size
                </p>
              )}

              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    className={`py-3 px-4 border-2 rounded-lg font-medium transition-all cursor-pointer ${
                      selectedSize === size
                        ? "border-gray-900 bg-gray-900 text-white"
                        : sizeError
                        ? "border-red-300 text-gray-700 hover:border-red-400"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 font-semibold text-gray-900 border-x-2 border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  (Max 10 per order)
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 mb-8">
              {/* Add to Cart - Primary CTA */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || isAddingToCart}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  showAddedConfirmation
                    ? "bg-green-600 text-white"
                    : product.inStock
                    ? "bg-gray-900 text-white hover:bg-gray-800 active:scale-95"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isAddingToCart ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </>
                ) : showAddedConfirmation ? (
                  <>
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </>
                )}
              </button>

              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleWishlistToggle}
                  className={`py-3 px-6 border-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isWishlisted
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                  />
                  {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                </button>

                <button
                  onClick={handleShare}
                  className="py-3 px-6 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:border-gray-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-200">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <p className="text-xs font-medium text-gray-900">
                  Free Delivery
                </p>
                <p className="text-xs text-gray-600">On orders over €50</p>
              </div>
              <div className="text-center">
                <RefreshCw className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <p className="text-xs font-medium text-gray-900">
                  Easy Returns
                </p>
                <p className="text-xs text-gray-600">30-day return policy</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <p className="text-xs font-medium text-gray-900">
                  Secure Payment
                </p>
                <p className="text-xs text-gray-600">SSL encrypted</p>
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCT TABS */}
        <ProductTabs product={product} />

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <RelatedProducts products={relatedProducts} />
          </div>
        )}
      </Container>
    </div>
  );
}
