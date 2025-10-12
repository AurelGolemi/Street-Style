import Hero from '@/components/sections/Hero'
import Container from '@/components/ui/Container'
import ProductCard from '@/components/product/ProductCard'
import { getFeaturedProducts } from '@/data/products'
import Link from 'next/link'

export default function HomePage() {
  const featuredProducts = getFeaturedProducts()

  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          {/* Section Header */}
          <div className="text-center mb-12">
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
            <Link href="/products" className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
              View All Products
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
