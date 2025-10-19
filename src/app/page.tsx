import Hero from '@/components/sections/Hero'
import Container from '@/components/ui/Container'
import ProductCard from '@/components/product/ProductCard'
import { getFeaturedProducts } from '@/data/products'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  const featuredProducts = getFeaturedProducts()

  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
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
            <Link href="/products" className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition cursor-pointer">
              View All Products
            </Link>
          </div>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <Container>
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Shop by Category</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Men Category*/}

            <Link href="/men" className="group relative overflow-hidden rounded-lg aspect-square bg-gray-200 hover:shadow-xl transition">
              <Image
                src="/brand-category/mens-collection.jpg"
                alt="Men's Collection"
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
              />
                <div className="absolute inset-0 bg-transparent bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-white text-3xl font-bold">Men</h3>
                </div>
            </Link>

            {/* Women Category */}
            <Link href="/women" className="group relative overflow-hidden rounded-lg aspect-square bg-gray-200 hover:shadow-xl transition">
              <Image
                src="/brand-category/womens-collection.webp"
                alt="Women's collection"
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
              />
                <div className="absolute inset-0 bg-transparent bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-white text-3xl font-bold">Women</h3>
                </div>
            </Link>

            {/* Kids Category*/}
            <Link href="/kids" className="group relative overflow-hidden rounded-lg aspect-square bg-gray-200 hover-shadow:xl transition">
              <Image
                src="/brand-category/kids-collection.jpg"
                alt="Kids' collection"
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-transparent bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-3xl font-bold">Kids</h3>
              </div>
            </Link>
          </div>
        </Container>
      </section>

      {/* Brands Section */}
      <section className="py-16 bg-white">
        <Container>
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Featured Brands</h2>
          <p className="text-center text-gray-600 mb-12">
            {"Shop from the world's leading sportswear brands"}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {['Nike', 'Adidas', 'Puma', 'Hoodrich'].map((brand) => (
              <div
                key={brand}
                className="bg-white rounded-lg p-8 flex items-center border justify-center hover:shadow-lg transition cursor-pointer">
                <span className="text-xl font-bold text-gray-800">{brand}</span>
              </div>
            ))}
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
