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
}

export default function Header({ onCartClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const getTotalItems = useCartStore(state => state.getTotalItems)

  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">SS</span>
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:block">Street Style</span>
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
            <UserDropdown />

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-full transition cursor-pointer">
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
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition">
              {isMobileMenuOpen ? <X className="w-6 h-6 text-gray-900" /> : <Menu className="w-6 h-6 text-gray-900" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden py-4 border-t border-gray-200 dark:border-slate-700">
          <nav className="flex flex-col space-y-4">
            <Link href="/men" className="text-gray-800 hover:text-blackfont-medium">Men</Link>
              <Link href="/women" className="text-gray-800 hover:text-black font-medium">Women</Link>
            <Link href="/kids" className="text-gray-800 hover:text-blackfont-medium">Kids</Link>
            <Link href="/brands" className="text-gray-800 hover:text-blackfont-medium">Brands</Link>
            <Link href="/sales" className="text-gray-800 hover:text-blackfont-medium">Sales</Link>
          </nav>
        </div>
      </Container>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </>
  )
}

// export default function Header() {
//   const { items, getTotalItems } = useCartStore()

//   return (
//     <header className="bg-white shadow-sm sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">

//           {/* Logo */}
//           <div className="text-2xl font-bold">Street Style</div>

//           {/* Navigation Links */}
//           <nav className="hidden md:flex space-x-8">
//             <a href="/men" className="text-gray-700 hover:text-black">Men</a>
//             <a href="/women" className="text-gray-700 hover:text-black">Women</a>
//             <a href="/kids" className="text-gray-700 hover:text-black">Kids</a>
//           </nav>

//           {/* Cart Icon with Count */}
//           <button className="relative p-2 hover:bg-gray-100 rounded-full">
//             <ShoppingCart className="w-6 h-6" />

//             {/* This shows the number of items in cart */}
//             {getTotalItems() > 0 && (
//               <span className="absolyte -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
//                 {getTotalItems()}
//               </span>
//             )}
//           </button>

//         </div>
//       </div>
//     </header>
//   )
// }