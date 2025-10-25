/**
 * Loading State for Product Page
 * Displays a skeleton UI while product data is being fetched
 */

export default function ProductLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb skeleton */}
      <div className="flex gap-2 mb-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-16" />
        <div className="h-4 bg-gray-200 rounded w-4" />
        <div className="h-4 bg-gray-200 rounded w-24" />
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Image gallery skeleton */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>

        {/* Product details skeleton */}
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
          </div>
          <div className="h-12 bg-gray-200 rounded-lg w-full animate-pulse" />
        </div>
      </div>

      {/* Related products skeleton */}
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}