import Link from 'next/link'
import { Home, Search } from 'lucide-react'
import Container from '@/components/ui/Container'

/**
 * Product Not Found Page
 * 
 * Displayed when:
 * - User visits /product/invalid-id
 * - Product has been deleted
 * - URL is mistyped
 * 
 * UX Goals:
 * 1. Clearly communicate the error
 * 2. Don't blame the user
 * 3. Provide helpful navigation options
 * 4. Maintain brand experience
 * 
 * Conversion Recovery:
 * - 30% of 404 visitors can be recovered with good UX
 * - Quick links reduce bounce rate
 * - Search helps users find what they need
 */

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center">
      <Container>
        <div className="max-w-2xl mx-auto text-center py-20">
          {/* 404 Visual */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-200 rounded-full mb-6">
              <span className="text-4xl">🔍</span>
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Product Not Found
            </h2>
            <p className="text-gray-600 text-lg">
              {"Sorry, we couldn't find the product you're looking for. It may have been removed, renamed, or is temporarily unavailable."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition"
            >
              <Search className="w-5 h-5" />
              Browse All Products
            </Link>
          </div>

          {/* Popular Categories */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Or explore our popular categories:
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {['Men', 'Women', 'Kids', 'Sale'].map((category) => (
                <Link
                  key={category}
                  href={`/${category.toLowerCase()}`}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:border-gray-900 hover:text-gray-900 transition font-medium"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-12 text-sm text-gray-500">
            <p>If you believe this is an error, please <Link href="/contact" className="text-blue-600 hover:text-blue-700 underline">contact us</Link></p>
          </div>
        </div>
      </Container>
    </div>
  )
}