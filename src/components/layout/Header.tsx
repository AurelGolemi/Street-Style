"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCartStore } from "@/store/CartStore";
import UserDropdown from "@/components/layout/UserDropdown";
import SearchModal from "@/components/search/SearchModal";
import Container from "@/components/ui/Container";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { useState, useTransition, startTransition as reactStartTransition } from "react";

interface HeaderProps {
  onCartClick?: () => void;
}

export default function Header({ onCartClick }: HeaderProps = {}) {  
  const { user, isAuthenticated, isLoading } = useAuth();
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPending, startTransition] = useTransition();


  const handleNavClick = () => {
    reactStartTransition(() => {
      setIsMobileMenuOpen(false);
    });
  };

  const handleCartClick = () => {
    if (onCartClick) {
      reactStartTransition(() => {
        onCartClick();
      });
    }
  };

  const handleSearchOpen = () => {
    reactStartTransition(() => {
      setIsSearchOpen(true);
      setIsMobileMenuOpen(false);
    });
  };

  const toggleMobileMenu = () => {
    reactStartTransition(() => {
      setIsMobileMenuOpen(prev => !prev);
    });
  };

  const renderAuthUI = () => {
    if (isLoading) {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-20 h-9 bg-gray-200 animate-pulse rounded-lg" />
          <div className="w-20 h-9 bg-gray-200 animate-pulse rounded-lg" />
        </div>
      );
    }

    if (isAuthenticated && user) {
      const displayName = user.firstName 
        ? `${user.firstName} ${user.lastName}`.trim()
        : user.email.split("@")[0];

      return (
        <UserDropdown
          user={{
            id: user.id,
            email: user.email,
            user_metadata: {  // <-- Added this to match UserDropdown's interface
            full_name: displayName,  // <-- Maps your computed displayName here
          },
          }}
        />
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <Link
          href="/login"
          className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    );
  };

  const navigationLinks = [
    { href: "/men", label: "Men" },
    { href: "/women", label: "Women" },
    { href: "/kids", label: "Kids" },
    { href: "/brands", label: "Brands" },
    { href: "/sales", label: "Sales" },
  ] as const;

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <Container>
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              onClick={handleNavClick}
              className="flex items-center space-x-2 group"
            >
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                <span className="text-white font-bold text-xl">SS</span>
              </div>
              <span className="font-bold text-xl text-gray-900 hidden sm:block">
                Street Style
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-800 hover:text-black font-medium transition-colors relative group"
                >
                  {link.label}
                  <span 
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <button
                onClick={handleSearchOpen}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Search products"
                type="button"
              >
                <Search className="w-5 h-5 text-gray-900" />
              </button>

              {/* Cart */}
              <button
                onClick={handleCartClick}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={`Shopping cart with ${getTotalItems()} items`}
                type="button"
              >
                <ShoppingCart className="w-5 h-5 text-gray-900" />
                {getTotalItems() > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    suppressHydrationWarning
                  >
                    {getTotalItems() > 9 ? "9+" : getTotalItems()}
                  </span>
                )}
              </button>

              {/* Desktop Auth UI */}
              <div className="hidden md:flex">
                {renderAuthUI()}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                type="button"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-900" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-900" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div 
              className="md:hidden pb-4 space-y-2 border-t border-gray-200 mt-2 pt-4"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <nav className="space-y-1">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleNavClick}
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="pt-4 border-t border-gray-200 px-4">
                {renderAuthUI()}
              </div>
            </div>
          )}
        </Container>
      </header>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => {
          reactStartTransition(() => {
            setIsSearchOpen(false);
          });
        }}
      />
    </>
  );
}