'use client'

import { useCartStore } from '@/store/CartStore'
import { X, Trash2 } from 'lucide-react'
import Image from 'next/image'

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
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl">
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold">Shopping Cart ({items.length})</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <p className="text-center text-gray-500 mt-8">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 border-b pb-4">
                    {/* Item Image */}
                    <Image 
                      src={item.image} 
                      alt={item.name}
                      fill
                      className="w-20 h-20 object-cover rounded"
                    />

                    {/* Item Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.brand}</p>
                      <p className="text-sm text-gray-500">Size: {item.size} | Color: {item.color}</p>
                      
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.color, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 border rounded hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                          className="w-8 h-8 border rounded hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Price and Remove */}
                    <div className="text-right">
                      <p className="font-bold">€{item.price * item.quantity}</p>
                      <button
                        onClick={() => removeItem(item.id, item.size, item.color)}
                        className="mt-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-6">
              <div className="flex justify-between mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold">€{getTotalPrice().toFixed(2)}</span>
              </div>
              
              <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 mb-2">
                Checkout
              </button>
              
              <button 
                onClick={clearCart}
                className="w-full border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-100"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}