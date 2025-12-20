"use client";

import UserDropdown from "@/components/layout/UserDropdown";
import SearchModal from "@/components/search/SearchModal";
import Container from "@/components/ui/Container";
import { useCartStore } from "@/store/CartStore";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface HeaderProps {
  onCartClick: () => void;
  user: { id: string; email: string; name?: string } | null;
}

export default function Header({ onCartClick, user }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <Container>
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              onClick={handleNavClick}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">SS</span>
              </div>
              <span className="font-bold text-xl text-gray-900 sm:block hidden lg:block">
                Street Style
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/men"
                className="text-gray-800 hover:text-black font-medium transition"
              >
                Men
              </Link>
              <Link
                href="/women"
                className="text-gray-800 hover:text-black font-medium transition"
              >
                Women
              </Link>
              <Link
                href="/kids"
                className="text-gray-800 hover:text-black font-medium transition"
              >
                Kids
              </Link>
              <Link
                href="/brands"
                className="text-gray-800 hover:text-black font-medium transition"
              >
                Brands
              </Link>
              <Link
                href="/sales"
                className="text-gray-800 hover:text-black font-medium transition"
              >
                Sales
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart Button */}
              <button
                onClick={onCartClick}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {user ? (
                <UserDropdown user={user} />
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-black transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-1">
              <Link
                href="/men"
                onClick={handleNavClick}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Men
              </Link>
              <Link
                href="/women"
                onClick={handleNavClick}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Women
              </Link>
              <Link
                href="/kids"
                onClick={handleNavClick}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Kids
              </Link>
              <Link
                href="/brands"
                onClick={handleNavClick}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Brands
              </Link>
              <Link
                href="/sales"
                onClick={handleNavClick}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Sales
              </Link>
            </div>
          )}
        </Container>
      </header>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
