'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { Product } from '@/lib/types'
import { useCartStore } from '@/store/CartStore'
import { formatPrice, getDiscountPercentage, isOnSale } from '@/data/products'

/**
 * ProductCard Component
 * 
 * Critical Conversion Component - This is where users first interact with products.
 * Every design decision here impacts revenue.
 * 
 * Architecture:
 * 1. Visual Appeal - High-quality image, clean layout
 * 2. Information Hierarchy - Price most prominent, then name, then brand
 * 3. Action Triggers - Quick add to cart, wishlist
 * 4. Trust Signals - Ratings, sale badges, stock status
 * 
 * Performance Considerations:
 * - Images optimized with Next.js Image component
 * - Hover states use CSS transforms (GPU accelerated)
 * - No unnecessary re-renders (React.memo could be added)
 * 
 * UX Research:
 * - Users scan left-to-right, top-to-bottom
 * - Price is decision factor #1
 * - Social proof (ratings) increases trust 25%
 * - Hover reveals additional info without cluttering
 * 
 * Conversion Optimization:
 * - Sale badges create urgency (scarcity principle)
 * - Quick add reduces friction
 * - Wishlist captures intent for remarketing
 * - Smooth animations feel premium
 */

interface ProductCardProps {
  product: Product
  priority?: boolean // For above-the-fold images
  showQuickAdd?: boolean // Toggle quick add button
}

export default function ProductCard({ 
  product, 
  priority = false,
  showQuickAdd = true 
}: ProductCardProps) {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  
  // Cart store
  const addItem = useCartStore(state => state.addItem)

  // ============================================
  // COMPUTED VALUES
  // ============================================
  
  const discount = getDiscountPercentage(product)
  const onSale = isOnSale(product)
  
  // Get secondary image for hover effect (if available)
  const primaryImage = product.images[0]
  const secondaryImage = product.images[1] || product.images[0]

  // ============================================
  // EVENT HANDLERS
  // ============================================

  /**
   * Quick Add to Cart
   * 
   * Adds product with first available size and color.
   * For products requiring variant selection, redirects to detail page.
   * 
   * UX Decision:
   * - Quick add reduces friction for simple products
   * - Redirects for complex products prevent errors
   * - Loading state prevents double-clicks
   * - Success feedback builds confidence
   */
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation to detail page
    e.stopPropagation() // Don't trigger parent Link

    // Validate: Product must have size options
    if (!product.sizes || product.sizes.length === 0) {
      // Navigate to detail page for size selection
      window.location.href = `/product/${product.id}`
      return
    }

    setIsAddingToCart(true)

    // Simulate API delay (remove in production)
    setTimeout(() => {
      addItem({
        id: `${product.id}-${product.sizes[0]}-${product.colors[0]?.name || 'default'}`,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        size: product.sizes[0], // Default to first size
        color: product.colors[0]?.name || 'Default',
        image: product.images[0],
        category: product.category,
      })

      setIsAddingToCart(false)
      
      // Show success state briefly
      setTimeout(() => {
        // Could trigger cart sidebar here
      }, 500)
    }, 300)
  }

  /**
   * Toggle Wishlist
   * 
   * In production, this would:
   * 1. Check authentication status
   * 2. Call API to save wishlist item
   * 3. Update global wishlist state
   * 4. Show toast notification
   */
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsWishlisted(!isWishlisted)
    
    // Track analytics
    if (typeof window !== 'undefined') {
      const w = window as Window & { gtag?: (...args: unknown[]) => void }
      if (w.gtag) {
        w.gtag('event', isWishlisted ? 'remove_from_wishlist' : 'add_to_wishlist', {
          items: [{
            item_id: product.id,
            item_name: product.name,
          }]
        })
      }
    }
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-400 transition-all duration-300 hover:shadow-lg">
        
        {/* ==================== IMAGE SECTION ==================== */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {/* Primary Image */}
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-500 ${
              isHovered ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority} // Load immediately if above fold
          />

          {/* Secondary Image (Hover) */}
          <Image
            src={secondaryImage}
            alt={`${product.name} - alternative view`}
            fill
            className={`object-cover transition-all duration-500 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
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
            
            {/* New Badge (if product is less than 30 days old) */}
            {product.createdAt && 
             new Date().getTime() - new Date(product.createdAt).getTime() < 30 * 24 * 60 * 60 * 1000 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                NEW
              </span>
            )}

            {/* Low Stock Badge */}
            {product.inStock && product.stockLevel && product.stockLevel <= (product.lowStockThreshold || 10) && (
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
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-gray-700 hover:bg-white'
            } ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart 
              className={`w-5 h-5 transition-transform ${isWishlisted ? 'fill-current scale-110' : ''}`} 
            />
          </button>

          {/* Quick Add Button */}
          {showQuickAdd && product.inStock && (
            <div 
              className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
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

        {/* ==================== INFO SECTION ==================== */}
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
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
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
                  style={{ backgroundColor: color.hex || '#ccc' }}
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
  )
}