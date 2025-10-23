import Container from '@/components/ui/Container'
import { brands } from '@/data/products'
import { products } from '@/data/products'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'

/**
 * Brands Directory Page
 * 
 * Central hub for brand discovery.
 * Shows all available brands with product counts and quick links.
 * 
 * UX Strategy:
 * - Visual brand recognition (logos)
 * - Social proof (product counts)
 * - Easy navigation (large click targets)
 * - Grid layout (scannable)
 * 
 * SEO Value:
 * - Internal linking hub
 * - Keyword targeting ("Nike products", "Adidas store")
 * - Category organization
 */

export const metadata: Metadata = {
  title: 'Shop by Brand - All Designer & Athletic Brands | Street Style',
  description: 'Browse products from Nike, Adidas, Puma, The North Face, Vans and more. Authentic products from your favorite brands.',
}

export default function BrandsPage() {
  // Calculate product counts per brand
  const brandStats = brands.map(brand => ({
    ...brand,
    productCount: products.filter(p => 
      p.brand.toLowerCase() === brand.name.toLowerCase()
    ).length,
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <Container className="py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Shop by Brand
            </h1>
            <p className="text-xl text-gray-600">
              {"Discover authentic products from the world's leading sportswear and lifestyle brands"}
            </p>
          </div>
        </Container>
      </div>

      {/* Brands Grid */}
      <Container className="py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandStats.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.id}`}
              className="group bg-white rounded-lg border-2 border-gray-200 hover:border-gray-900 p-8 transition-all hover:shadow-lg"
            >
              {/* Brand Logo */}
              <div className="relative h-24 mb-6 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    fill
                    className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>

              {/* Brand Info */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {brand.name}
                </h2>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {brand.description}
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <span>{brand.productCount} Products</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>

      {/* Featured Categories */}
      <div className="bg-white py-16">
        <Container>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Or Browse by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Men', 'Women', 'Kids'].map((category) => (
              <Link
                key={category}
                href={`/${category.toLowerCase()}`}
                className="relative group aspect-square rounded-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700">
                  {/* Add background image here in production */}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="text-4xl font-bold mb-2">{category}</h3>
                    <p className="text-lg opacity-90">{`Shop {category}'s Collection`}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </div>
  )
}