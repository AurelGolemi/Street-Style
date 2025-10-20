import Hero from '@/components/sections/Hero'
import Container from '@/components/ui/Container'
import ProductCard from '@/components/product/ProductCard'
import { getFeaturedProducts } from '@/data/products'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  const featuredProducts = getFeaturedProducts()

  // Brand logos with real brand data
  const brands = [
    { 
      name: 'Nike', 
      logo: '/brand-logos/nike-logo.svg',
      href: '/brands/nike'
    },
    { 
      name: 'Adidas', 
      logo: '/brand-logos/adidas-logo.svg',
      href: '/brands/adidas'
    },
    { 
      name: 'Puma', 
      logo: '/brand-logos/puma-logo.svg',
      href: '/brands/puma'
    },
    { 
      name: 'Hoodrich', 
      logo: '/brand-logos/hoodrich-logo.svg',
      href: '/brands/the-north-face'
    },
  ]

  const categories = [
    {
      name: 'Men',
      href: '/men',
      image: '/brand-category/mens-collection.jpg',
      description: 'Discover the latest in men\'s fashion'
    },
    {
      name: 'Women',
      href: '/women',
      image: '/brand-category/womens-collection.webp',
      description: 'Explore women\'s collection'
    },
    {
      name: 'Kids',
      href: '/kids',
      image: '/brand-category/kids-collection.jpg',
      description: 'Shop for the little ones'
    }
  ]

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <Hero />

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <Container>
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
              NEW ARRIVALS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trending Now
            </h2>
            <p className="text-gray-800 text-lg max-w-2xl mx-auto">
              Discover the latest styles from your favourite brands.
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-gray-900">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link href="/products" >
              <button className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition cursor-pointer">
                View All Products
              </button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Shop by Category</h2>
            <p className="text-gray-600 text-lg">
              {"Find exactly what you're looking for"}
            </p>
          </div>
          

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative overflow-hidden rounded-2xl aspect-square bg-gray-200 dark:bg-slate-800 hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={category.image}
                    alt={`${category.name}'s Collection`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end p-8 text-center">
                  <h3 className="text-white text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">
                    {category.name}
                  </h3>
                  <p className="text-white/90 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {category.description}
                  </p>
                  <div className="inline-flex items-center gap-2 text-white font-semibold">
                    Shop Now
                    <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Brands Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold mb-4">
              FEATURED BRANDS
            </span>
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Featured Brands</h2>
            <p className="text-center text-gray-600 mb-12">
              {"Shop from the world's leading sportswear brands"}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {brands.map((brand) => (
              <Link
                key={brand.name}
                href={brand.href}
                className="group bg-gray-50 rounded-xl p-8 flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-200"
              >
                <div className="relative w-full h-16">
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} Logo`}
                    fill
                    className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration:300"
                  />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/brands">
              <button className="text-gray-700 hover:text-gray-900 border border-gray-500 p-3 rounded-xl font-semibold transition inline-flex items-center gap-2 cursor-pointer">
                View All Brands
              </button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  )
}

// export default function HomePage() {
//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//       <h1 className="text-4xl font-bold text-gray-900">
//         Street Style - Coming Soon
//       </h1>
//     </div>
//   );
// }
