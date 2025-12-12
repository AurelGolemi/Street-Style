'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/store/CartStore'
import { useAuth } from '@/contexts/AuthContext'
import { X, Trash2, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart, isLoading, isSyncing, error, clearError } = useCartStore()
  const { user } = useAuth()

  // Initialize cart when component mounts or user changes
  useEffect(() => {
    useCartStore.getState().initializeCart(user?.id || null)
  }, [user?.id])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out"
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-white">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
              <p className="text-sm text-gray-700 mt-1">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </p>
              {user && (
                <p className="text-xs text-blue-600 mt-1">✓ Saved to your account</p>
              )}
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors" 
              aria-label="Close cart"
              disabled={isSyncing}
            >
              <X className="w-6 h-6 text-gray-700 cursor-pointer" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-6 py-3 bg-red-50 border-b border-red-200 flex items-start gap-3">
              <span className="text-red-600 text-sm">{error}</span>
              <button 
                onClick={clearError}
                className="text-red-600 hover:text-red-800 text-xs font-semibold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Syncing Indicator */}
          {isSyncing && (
            <div className="px-6 py-2 bg-blue-50 border-b border-blue-200 flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
              <span className="text-blue-600 text-xs font-medium">Saving changes...</span>
            </div>
          )}

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your cart...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-700 mb-4">
                  <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="text-gray-700 text-lg font-medium">Your cart is empty</p>
                <p className="text-gray-600 text-sm mt-2">Add items to get started</p>
                <Link href="/products">
                  <button
                    onClick={onClose}
                    className="mt-6 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => {
                  const itemKey = `${item.id}-${item.size}-${item.color}`

                  return (
                    <div
                      key={itemKey}
                      className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      {/* Product Image */}
                      <div className="relative w-24 h-24 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 uppercase font-semibold tracking-wide">
                          {item.brand}
                        </p>
                        <h3 className="font-semibold text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <div className="flex gap-3 mt-1 text-sm text-gray-600">
                          <span>Size: <span className="font-medium">{item.size}</span></span>
                          <span className="text-gray-500">|</span>
                          <span>Color: <span className="font-medium">{item.color}</span></span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100 transition cursor-pointer disabled:opacity-50"
                              aria-label="Decrease quantity"
                              disabled={isSyncing}
                            >
                              <Minus className="w-4 h-4 text-red-600" />
                            </button>
                            <span className="px-4 font-semibold min-w-[40px] text-center cursor-pointer text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100 transition cursor-pointer disabled:opacity-50"
                              aria-label="Increase quantity"
                              disabled={isSyncing}
                            >
                              <Plus className="w-4 h-4 text-green-600" />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item.id, item.size, item.color)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                            aria-label="Remove item"
                            disabled={isSyncing}
                          >
                            <Trash2 className="w-4 h-4 cursor-pointer" />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-gray-900">
                          €{(item.price * item.quantity).toFixed(2)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-gray-600">
                            €{item.price.toFixed(2)} each
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t bg-white p-6 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-lg font-semibold text-gray-800">Total:</span>
                <span className="text-2xl font-bold text-gray-800">€{getTotalPrice().toFixed(2)}</span>
              </div>

              {!user && (
                <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                  💡 Log in to save your cart and access it on other devices
                </p>
              )}

              <p className="text-sm text-gray-700 text-center">
                Shipping and taxes calculated at checkout
              </p>
              
              <div className="space-y-3">
                <Link href="/checkout">
                  <button
                    onClick={onClose}
                    className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 mb-2 cursor-pointer disabled:opacity-50"
                    disabled={isSyncing}
                  >
                    Checkout
                  </button>
                </Link>
              
                <button 
                  onClick={clearCart}
                  className="w-full text-gray-800 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-100 transition cursor-pointer disabled:opacity-50"
                  disabled={isSyncing}
                >
                  Clear Cart
                </button>
              </div>

              <button
                onClick={onClose}
                className="w-full text-gray-700 hover:text-gray-900 font-medium transition text-sm cursor-pointer"
              >
                ← Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}