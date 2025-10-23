import Container from '@/components/ui/Container'
import ProductCard from '@/components/product/ProductCard'
import { getProductsByCategory } from '@/data/products'

export default function KidsPage() {
  const kidsProducts = getProductsByCategory('kids')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-black text-white py-12">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{"Kids' Collection"}</h1>
          <p className="text-gray-300 text-lg">
            {"Discover the latest in men's footwear and apparel"}
          </p>
        </Container>
      </div>

      {/* Products Section */}
      <Container className="py-12">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Filters Sidebar */}
          <aside className="md:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Filters</h3>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2 text-gray-800">Category</h4>
                <label className="flex items-center space-x-2 mb-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-700">Shoes</span>
                </label>
                <label className="flex items-center space-x-2 mb-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-700">Clothing</span>
                </label>
                <label className="flex items-center space-x-2 mb-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-700">Accessories</span>
                </label>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2 text-gray-800">Brand</h4>
                <label className="flex items-center space-x-2 mb-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-700">Adidas</span>
                </label>
                <label className="flex items-center space-x-2 mb-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-700">Nike</span>
                </label>
                <label className="flex items-center space-x-2 mb-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-700">Hoodrich</span>
                </label>
                <label className="flex items-center space-x-2 mb-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-700">Puma</span>
                </label>
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="font-semibold mb-2 text-gray-800">Price Range</h4>
                <input type="range" min="0" max="200" className="w-full" />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span className="text-gray-800">€0</span>
                  <span className="text-gray-800">€200</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">{kidsProducts.length} products found</p>
              <select className="border rounded-lg px-4 py-2 text-gray-900">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-900">
              {kidsProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}