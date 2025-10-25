// Add loading skeleton for better perceived performance
// File: src/components/product/ProductDetailSkeleton.tsx

export default function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image skeleton */}
        <div className="aspect-square bg-gray-200 rounded-2xl" />
        
        {/* Info skeleton */}
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4 text-gray-900" />
          <div className="h-4 bg-gray-200 rounded w-1/2 text-gray-900" />
          <div className="h-12 bg-gray-200 rounded w-1/3 text-gray-900" />
          <div className="h-32 bg-gray-200 rounded text-gray-900" />
        </div>
      </div>
    </div>
  )
}