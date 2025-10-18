'use client'

import { useState, useRef, useEffect } from 'react'
import { User, LogIn, UserPlus, Settings, Heart, ShoppingBag, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Authentication state
  const [isLoggedIn] = useState(false)
  const [userName] = useState('John Doe')

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const menuItems = isLoggedIn ? [
    { icon: User, label: 'My Account', href: '/account' },
    { icon: ShoppingBag, label: 'Orders', href: '/orders' },
    { icon: Heart, label: 'Wishlist', href: '/wishlist' },
    { icon: Settings, label: 'Settings', href: '/settings'},
  ] : []

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
        aria-label="User Menu"
        aria-expanded={isOpen}
      >
        <User className="w-5 h-5 text-gray-800"/>
        {isLoggedIn && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white"/>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          {isLoggedIn ? (
            <>
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-700">john.doe@example.com</p>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <Icon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">{item.label}</span>
                    </Link>
                  )
                })}
              </div>

              {/* Logout */}
              <div className="border-t border-gray-100 pt-2">
                <button
                  onClick={() => {
                    setIsOpen(false)
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-700 font-medium">Log Out</span>
                </button>
              </div>
            </>
          ) : (
              <>
                {/* Guest Menu */}
                <div className="px-4 py-3">
                  <p className="text-sm text-gray-600 mb-3">
                    Sign In to access your account
                  </p>
                  <Link href="/login">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </button>
                  </Link>
                  <Link href="/register">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-full mt-2 border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </>
          )}
        </div>
      )}
    </div>
  )
}