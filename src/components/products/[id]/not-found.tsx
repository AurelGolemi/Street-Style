/**
 * Custom 404 Page for Products
 * Displayed when notFound() is called or product doesn't exist
 */

import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-24 w-24 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Product Not Found
        </h2>
        
        <p className="text-gray-600 mb-8">
          {"Sorry, we couldn't find the product you're looking for. It may have been removed or is no longer available."}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/products"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse All Products
          </Link>
          
          <Link
            href="/"
            className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>

        {/* Suggested actions */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">You might also want to:</p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>
              <Link href="/products?sort=new" className="hover:text-blue-600 underline">
                Check out our newest arrivals
              </Link>
            </li>
            <li>
              <Link href="/products?sale=true" className="hover:text-blue-600 underline">
                Browse products on sale
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-600 underline">
                Contact support for help
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}