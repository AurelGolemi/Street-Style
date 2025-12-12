'use client'

import { ShoppingCart, Menu, X, Search } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/store/CartStore'
import Container from '@/components/ui/Container'
import UserDropdown from '@/components/layout/UserDropdown'
import SearchModal from '@/components/search/SearchModal'
import Link from 'next/link'

interface HeaderProps {
  onCartClick: () => void
  user: { id: string; email: string; name?: string } | null
}

export default function Header({ onCartClick, user }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const getTotalItems = useCartStore(state => state.getTotalItems)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const handleNavClick = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <Container>
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" onClick={handleNavClick} className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">SS</span>
              </div>
              <span className="font-bold text-xl text-gray-900 sm:block">Street Style</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/men" className="text-gray-800 hover:text-black font-medium transition">
                Men
              </Link>
              <Link href="/women" className="text-gray-800 hover:text-black font-medium transition">
                Women
              </Link>
              <Link href="/kids" className="text-gray-800 hover:text-black font-medium transition">
                Kids
              </Link>
              <Link href="/brands" className="text-gray-800 hover:text-black font-medium transition">
                Brands
              </Link>
              <Link href="/sales" className="text-gray-800 hover:text-black font-medium transition">
                Sales
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:block p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
                aria-label="search"
              >
                <Search className="w-5 h-5 text-gray-900" />
              </button>

              {/* User Dropdown */}
              {user ? (
                <UserDropdown user={user} />
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/login" className="text-gray-800 hover:text-black font-medium">
                    Sign in
                  </Link>
                  <Link href="/register" className="text-gray-800 hover:text-black font-medium">
                    Sign up
                  </Link>
                </div>
              )}

              {/* Cart */}
              <button
                onClick={onCartClick}
                className="relative p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
                aria-label="shopping cart"
              >
                <ShoppingCart className="w-5 h-5 text-gray-900" />
                {getTotalItems() > 0 && (
                  <span suppressHydrationWarning={true} className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
                aria-label="menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6 text-gray-900" /> : <Menu className="w-6 h-6 text-gray-900" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4">
                <Link href="/men" onClick={handleNavClick} className="text-gray-800 hover:text-black font-medium">
                  Men
                </Link>
                <Link href="/women" onClick={handleNavClick} className="text-gray-800 hover:text-black font-medium">
                  Women
                </Link>
                <Link href="/kids" onClick={handleNavClick} className="text-gray-800 hover:text-black font-medium">
                  Kids
                </Link>
                <Link href="/brands" onClick={handleNavClick} className="text-gray-800 hover:text-black font-medium">
                  Brands
                </Link>
                <Link href="/sales" onClick={handleNavClick} className="text-gray-800 hover:text-black font-medium">
                  Sales
                </Link>
              </nav>
            </div>
          )}
        </Container>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}