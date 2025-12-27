'use client'

import { signOut } from '@/app/actions/auth'
import { useState } from 'react'
import Link from 'next/link'

interface UserDropdownProps {
  user: {
    id: string
    email: string
    user_metadata?: {
      full_name?: string
    }
  }
}

export default function UserDropdown({ user }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Why user_metadata?.full_name: Optional chaining. If user_metadata
  // or full_name don't exist, doesn't throw error, just returns undefined.
  const displayName = user.user_metadata?.full_name || user.email

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
      >
        {/* User Avatar Circle */}
        <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
          {displayName.charAt(0).toUpperCase()}
          {/* Why charAt(0).toUpperCase(): Gets first letter of name
              for avatar initial. toUpperCase ensures it's capitalized. */}
        </div>
        
        <span className="text-sm font-medium">{displayName}</span>
        
        {/* Dropdown Arrow */}
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {/* Why rotate-180: CSS transform that flips arrow when open.
            Combined with transition-transform for smooth animation. */}
      </button>

      {isOpen && (
        <>
          {/* Backdrop - Click Outside to Close */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          {/* Why fixed inset-0: Covers entire viewport. Clicking anywhere
              outside dropdown closes it. z-10 places below dropdown (z-20). */}
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">{displayName}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              {/* Why truncate: If email is long, cuts off with ... instead
                  of breaking layout. */}
            </div>

            {/* Profile Link */}
<div className="relative flex items-center">
  <Link
    href="/profile"
    className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
    onClick={() => setIsOpen(false)}
  >
    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
      {displayName.charAt(0).toUpperCase()}
    </div>
    <span className="text-sm font-medium">{displayName}</span>
  </Link>

  {/* Small toggle for dropdown menu */}
  <button
    onClick={() => setIsOpen(!isOpen)}
    aria-label="Open account menu"
    className="ml-1 p-2 rounded-md hover:bg-gray-100"
  >
    <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>
</div>

            {/* Orders Link */}
            <Link 
              href="/orders" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                My Orders
              </div>
            </Link>

            {/* Cart Link */}
            <Link 
              href="/cart" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Shopping Cart
              </div>
            </Link>

            <hr className="my-1 border-gray-200" />

            {/* Sign Out Button */}
            <button
              onClick={() => {
                setIsOpen(false)
                signOut()
              }}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  )
}