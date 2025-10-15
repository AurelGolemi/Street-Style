'use client'

import { useCartStore } from '@/store/CartStore'
import { X, Trash2, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()

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
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close cart">
              <X className="w-6 h-6 text-gray-700 cursor-pointer" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-700 mb-4">
                  <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  </div>
                  <p className="text-gray-700 text-lg font-medium">Your cart is empty</p>
                  <p className="text-gray-600 text-sm mt-2">Add items to get started</p>
                  <Link href="/product">
                    <button
                      onClick={onClose}
                      className="mt-6 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition cursor-pointer">
                        Continue Shopping
                      </button>
                  </Link>
              </div>
            ) : (
                <div className="space-x-4">
                  {items.map((item => {
                    // Unique key combining id, size and color
                    const itemKey = `${item.id}-${item.size}-${item.color}`

                    return (
                      <div
                        key={itemKey}
                        className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                      >
                        {/* Product Image - Fixed Size Container */}
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
                          {/* Brand */}
                          <p className="text-xs text-gray-700 uppercase font-semibold tracking-wide">
                            {item.brand}
                          </p>

                          {/* Product Name */}
                          <h3 className="font-semibold text-gray-900 truncate">
                            {item.name}
                          </h3>

                          {/* Size and Color */}
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
                                className="p-2 hover:bg-gray-100 transition cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-4 h-4 text-red-600" />
                              </button>
                              <span className="px-4 font-semibold min-w-[40px] text-center cursor-pointer text-gray-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                                className="p-2 hover:bg-gray-100 transition cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-4 h-4 text-green-600"/>
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeItem(item.id, item.size, item.color)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              aria-label="Remove item"
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
                  }))}
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

              {/* Shipping Notice */}
              <p className="text-sm text-gray-700 text-center">
                Shipping and taxes calculated at checkout
              </p>
              
              {/* Action Buttons */}
              <div className="space-y-3">

              <Link href="/checkout">
                  <button
                    onClick={onClose}
                    className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 mb-2 cursor-pointer">
                Checkout
                  </button>
                </Link>
              
              <button 
                onClick={clearCart}
                className="w-full text-gray-800 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-100 transition cursor-pointer"
              >
                Clear Cart
              </button>
              </div>

              {/* Continue Shopping */}
              <button
                onClick={onClose}
                className="w-full text-gray-700 hover:text-gray-900 font-medium transition text-sm cursor-pointer">
                  ← Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}