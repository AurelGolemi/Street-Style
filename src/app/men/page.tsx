import Container from '@/components/ui/Container'
import ProductCard from '@/components/product/ProductCard'
import { getProductsByCategory } from '@/data/products'

export default function MenPage() {
  const menProducts = getProductsByCategory('men')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-black text-white py-12">
        <Container>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{"Men's Collection"}</h1>
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
            </div>
          </aside>
        </div>
      </Container>
    </div>
  )
}