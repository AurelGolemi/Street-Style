'use client'

import { useCartStore } from '@/store/cartStore'
import { ShoppingCart } from 'lucide-react'

export default function Header() {
  const { items, getTotalItems } = useCartStore()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="text-2xl font-bold">Street Style</div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <a href="/men" className="text-gray-700 hover:text-black">Men</a>
            <a href="/women" className="text-gray-700 hover:text-black">Women</a>
            <a href="/kids" className="text-gray-700 hover:text-black">Kids</a>
          </nav>

          {/* Cart Icon with Count */}
          <button className="relative p-2 hover:bg-gray-100 rounded-full">
            <ShoppingCart className="w-6 h-6" />

            {/* This shows the number of items in cart */}
            {getTotalItems() > 0 && (
              <span className="absolyte -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {getTotalItems()}
              </span>
            )}
          </button>

        </div>
      </div>
    </header>
  )
}