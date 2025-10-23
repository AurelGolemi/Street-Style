"use client";

import { products } from "@/data/products";
import { Search, TrendingUp, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(products.slice(0, 5));
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults(products.slice(0, 5));
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );

    setSearchResults(filtered.slice(0, 8));
  }, [searchQuery]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trendingSearches = [
    "Nike Air Max",
    "Adidas Ultraboost",
    "Hoodies",
    "Running Shoes",
  ];

  return (
    <div className="sticky inset-0 z-50 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-w-3xl mx-auto mt-20 bg-white rounded-2xl shadow-2xl animate-in slide-in-from-top duration-300">
        {/* Search Input */}
        <div className="flex items-center gap-4 p-6 border-b border-gray-200">
          <Search className="w-6 h-6 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for products, brands, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-lg outline-none bg-transparentplaceholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="p-1 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6 text-gray-700 cursor-pointer" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[500px] overflow-y-auto p-6">
          {searchQuery === "" ? (
            // Trending Searches
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-gray-900 ">
                  Trending Searches
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>

              {/* Popular Products */}
              <div className="mt-8">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Popular Products
                </h3>
                <div className="space-y-3">
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      onClick={onClose}
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition group"
                    >
                      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 uppercase font-semibold">
                          {product.brand}
                        </p>
                        <p className="font-medium text-gray-900 group-hover:text-blue-600">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          €{product.price.toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            // Search Results
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Found {searchResults.length} result
                {searchResults.length !== 1 ? "s" : ""}
              </p>
              <div className="space-y-3">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition group"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 uppercase font-semibold">
                        {product.brand}
                      </p>
                      <p className="font-medium text-gray-900 group-hover:text-blue-600">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        €{product.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {product.category}
                    </div>
                  </Link>
                ))}
              </div>

              {/* View All Results */}
              <Link
                href={`/products?search=${encodeURIComponent(searchQuery)}`}
                onClick={onClose}
                className="block mt-6 text-center py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
              >
                View All {searchResults.length} Results
              </Link>
            </div>
          ) : (
            // No Results
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-500 mb-6">
                Try searching for something else or browse our categories
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Men", "Women", "Kids", "Shoes", "Clothing"].map(
                  (category) => (
                    <Link
                      key={category}
                      href={`/${category.toLowerCase()}`}
                      onClick={onClose}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition"
                    >
                      {category}
                    </Link>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
