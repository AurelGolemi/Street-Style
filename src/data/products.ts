/* New products.ts */ 
import { Product } from '@/lib/types'

export const products: Product[] = [
  {
    id: 'nike-air-max-95-og.jpg',
    sku: 'IB7936-001',
    name: 'Air Max 95',
    brand: 'Nike',
    description: `Rep '90s-inspired sneaks with these men's Air Max 95 OG trainers from Nike. In a Black, Persian Violet and Wolf Grey colourway, these sneaks mix real and synthetic leather with airy textiles for a layered look. They feature a lace fastening to keep you locked in, with wavy side panels for natural flow. Underfoot, the foam midsole and visible Max Air unit provide responsive cushioning, while flex groves in the midsole and grippy rubber outsole let you move freely. Finished up with signature Nike Air Max branding throughout.`,
    price: 189.99,
    currency: 'EUR',
    images: [
      '/brand-product/nike-air-max-95-og/nike-air-max-95-og.jpg',
      '/brand-product/nike-air-max-95-og/nike-air-max-95-og-2.jpg',
      '/brand-product/nike-air-max-95-og/nike-air-max-95-og-3.jpg',
      '/brand-product/nike-air-max-95-og/nike-air-max-95-og-4.jpg',
      '/brand-product/nike-air-max-95-og/nike-air-max-95-og-5.jpg',
      '/brand-product/nike-air-max-95-og/nike-air-max-95-og-6.jpg',
    ],
    category: 'men',
    subcategory: 'shoes',
    tags: ['sneakers', 'running', 'casual', 'retro', 'bestseller'],

    sizes: ['41', '42'],
    colors: [
      {
        name: 'Black-Violet',
        hex: '#1f11f1',
        images: [
          '/brand-product/nike-air-max-95-og/nike-air-max-95-og.jpg'
        ]
      },
      {
        name: 'Baltic-Blue',
        hex: '#11f1ff',
        images: [
          '/brand-product/nike-air-max-95-og/nike-air-max-95-og-baltic-blue.jpg'
        ]
      },
      {
        name: 'Gold-White',
        hex: '#FFFFF4',
        images: [
          '/brand-product/nike-air-max-95-og/nike-air-max-95-og-baltic-blue.jpg'
        ]
      },
      {
        name: 'Black-Green',
        hex: '#1ff11f',
        images: [
          '/brand-product/nike-air-max-95-og/nike-air-max-95-og-black-green.jpg'
        ]
      },
      {
        name: 'Silver-Black-Metallic',
        hex: '#706F6D',
        images: [
          '/brand-product/nike-air-max-95-og/nike-air-max-95-og-silver-black-metallic.jpg'
        ]
      }
    ],

    features: [
      'Max Air cushioning in heel for impact protection',
      'Leather and synthetic upper for durability',
      'Padded low-cut collar for comfortable fit',
      'Waffle-inspired rubber outsole for traction',
      'Foam midsole for lightweight cushioning',
      'Visible Air unit for iconic style',
      'Lace-up closure for secure fit',
    ],

    materials: ['Leather', 'Synthetic', 'Rubber', 'Foam'],
    care: [
      'Carefully wipe away dust and dirt with a dry brush.',
      'Clean your shoes with water and a little dishwashing liquid or laundry detergent, and using a soft brush or old toothbrush, gently wash the upper and outsole of your sneakers. If your Nike shoes are white, add a small amount of baking soda to make them extra clean!',
      'Remove the laces from your shoes and wash them with the same solution.',
      'Allow your sneakers to dry naturally, under shade, so they retain their colour and shape. Remember that your sneakers need to dry very well before you wear them, which can take around 8 hours.'
    ],

    inStock: true,
    stockLevel: 45,
    lowStockThreshold: 10,

    rating: 4.7,
    reviewCount: 43,

    relatedProducts: ['adidas-ultraboost-22', 'puma-rs-x', 'new-balance-574'],

    createdAt: new Date('2025-09-12'),
    updatedAt: new Date('2025-10-21'),

    seoTitle: 'Nike Air Max 95 - Classic Sneakers | Street Style',
    seoDescription: 'Shop the iconic Nike Air Max 90 with visible Air cushioning. Available in multiple colorways. Free shipping on orders over €50.',
    seoKeywords: ['nike air max', 'air max 95', 'nike sneakers', 'retro running shoes', 'streetwear'],
  },
]

/**
 * Get product by ID
 * 
 * @param id - Product ID or slug
 * @returns Product object or undefined
 */

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id)
}

/**
 * Get products by category
 * 
 * @param category - Category filter
 * @returns Array of matching products
 */

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category)
}

/**
 * Get products by brand
 * 
 * @param brand - Brand name
 * @returns Array of matching products
 */

export function getProductsByBrand(brand: string): Product[] {
  return products.filter(p => p.brand.toLowerCase() === brand.toLowerCase())
}

/**
 * Get featured/bestselling products
 * 
 * @param limit - Maximum number of products to return
 * @returns Array of featured products
 */

export function getFeaturedProducts(limit: number = 4): Product[] {
  return products.slice(0, limit)
}

/**
 * Get related products
 * 
 * @param product - Current product
 * @param limit - Maximum number of related products
 * @returns Array of related products
 */

export function getRelatedProducts(product: Product, limit: number = 4): Product[] {
  if (!product.relatedProducts) {
    return products.filter(p =>
      p.id !== product.id &&
      p.category === product.category &&
      p.subcategory === product.subcategory
    ).slice(0, limit)
  }

  return product.relatedProducts
    .map(id => getProductById(id))
    .filter((p): p is Product => p !== undefined)
    .slice(0, limit)
}

/**
 * Search products
 * 
 * @param query - Search term
 * @returns Array of matching products
 */

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase()

  return products.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.brand.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

/**
 * Calculate discount percentage
 * 
 * @param product - Product object
 * @returns Discount percentage or 0
 */

export function getDiscountPercentage(product: Product): number {
  if (!product.originalPrice) return 0
  return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
}

/**
 * Check if product is on sale
 * 
 * @param product - Product object
 * @returns Boolean indicating sale status
 */
export function isOnSale(product: Product): boolean {
  return Boolean(product.originalPrice && product.originalPrice > product.price)
}

/**
 * Check if product is low stock
 * 
 * @param product - Product object
 * @returns Boolean indicating low stock status
 */

export function isLowStock(product: Product): boolean {
  if (!product.stockLevel || !product.lowStockThreshold) return false
  return product.stockLevel <= product.lowStockThreshold
}

/**
 * Format price with currency symbol
 * 
 * @param price - Price value
 * @param currency - Currency code
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency: string = 'GBP'): string {
  const symbols: Record<string, string> = {
    GBP: '£',
    USD: '$',
    EUR: '€',
  }
  const symbol = symbols[currency] || currency
  return `${symbol}${price.toFixed(2)}`
}
{/* Old products.ts 2 */}
// export const brands = [
//   { id: 'nike', name: 'Nike', logo: '/brand-logos/nike-logo.svg' },
//   { id: 'adidas', name: 'Adidas', logo: '/brand-logos/adidas-logo.svg' },
//   { id: 'puma', name: 'Puma', logo: '/brand-logos/puma-logo.svg' },
//   { id: 'hoodrich', name: 'Hoodrich', logo: '/brand-logos/hoodrich-logo.svg'}
// ]

// export const products: Product[] = [
//   {
//     id: 'nike-air-max-95-og',
//     name: 'Air Max 95',
//     price: 189.99,
//     image: '/brand-product/nike-air-max-95-og.jpg',
//     category: 'men',
//     subcategory: 'shoes',
//     sizes: ['41', '42'],
//     colors: ['Black-Persian-Violet', 'Baltic-Blue-Black-Pearl', 'MTLC Gold-Black-Pearl', 'Green-Shock-Black-Pearl-Grey', 'Metallic-Silver-Black-White'],
//     description: "Get these '90s-inspired icons and stand out wherever you go! The Nike Air Max 95 trainers come in a black colourway with purple stitching that adds the perfect touch, from a durable and smooth upper for ultimate comfort, with a soft ankle collar to offer extra support.",
//     inStock: true,
//     brand: 'Nike',
//     features: [],
//   },
//   {
//     id: 'nike-tech-mix-track-pants',
//     name: 'Nike Tech Mix Track Pants',
//     price: 100.00,
//     image: '/brand-product/nike-tech-mix-track-pants.jpg',
//     category: 'men',
//     subcategory: 'trousers',
//     sizes: ['XS', 'S', 'M', 'L'],
//     colors: ['Gray'],
//     description: "Made for the streets. These men's Tech Mix trackpants from Nike land in a Cool Grey colourway and are exclusive to JD. They're crafted from Nike's signature Tech Fleece fabric with cut-and-sew panels for a textured, modern look. Featuring an elasticated waistband and tapered legs for a streamlined fit, they're finished with side pockets and a Futura logo on the thigh.",
//     inStock: true,
//     brand: 'Nike',
//     features: [],
//   },
//   {
//     id: 'Hoodrich-Chromatic-Hoodie',
//     name: 'Hoodrich Chromatic Hoodie',
//     price: 55.00,
//     image: '/brand-product/hoodrich-chromatic-hoodie.jpg',
//     category: 'men',
//     subcategory: 'hoodie',
//     sizes: ['XS', 'S', 'M', 'L'],
//     colors: ['Black-Silver-Chromatic', 'Sky-Captain-Silver-Chromatic'],
//     description: "Layer up in iconic style with the Hoodrich Chromatic Hoodie in a black colourway with the shiny detail on the chest giving the perfect touch. This staple is made of smooth and soft fleece fabric to provide everyday comfort and warmth, while it features a hood that closes with a button for even more coverage from the cold. The front pocket is ideal for storing essentials, but also to keep your hands warm.",
//     inStock: true,
//     brand: 'Hoodrich',
//     features: [],
//   },
// ]

// // Helper functions to filter products
// export const getProductsByCategory = (category: string) => {
//   return products.filter(p => p.category === category)
// }

// export const getProductsByBrand = (brand: string) => {
//   return products.filter(p => p.brand.toLowerCase() === brand.toLowerCase())
// }

// export const getFeaturedProducts = () => {
//   return products.slice(0, 4)
// }


// {/* Old products.ts */}
// export interface Product {
//   id: string
//   name: string
//   brand: string
//   price: number
//   originalPrice?: number
//   category: 'sneakers' | 'jackets'
//   images: string[]
//   subcategory: 'shoes' | 'clothing' | 'accessories'
//   sizes: string[]
//   colors: string[]
//   description: string
//   features: string[]
//   inStock: boolean
// }

// export interface Brand {
//   id: string
//   name: string
//   logo: string
//   description: string
//   // category: 'men' | 'women' | 'kids'
// }

// export const brands: Brand[] = [
//   { id: 'nike', name: 'Nike', logo: '/logos/nike.svg', description: 'Just Do It' },
//   { id: 'adidas', name: 'Adidas', logo: '/logos/adidas.svg', description: 'Impossible is Nothing' },
// ]

// export const products: Product[] = [
//   {
//     id: 'nike-air-max-95-mens-shoes',
//     name: `Air Max 95 Men's Shoes`,
//     brand: 'nike',
//     price: 190,
//     originalPrice: 190,
//     image: '/public/nike-air-max-95-og.jpg',
//     category: 'sneakers',
//     description: { "Rep '90s - inspired sneaks with these men's Air Max 95 OG trainers from Nike. In a Black, Persian Violet and Wolf Grey colourway, these sneaks mix real and synthetic leather with airy textiles for a layered look. They feature a lace fastening to keep you locked in, with wavy side panels for natural flow."},
//     sizes: [41, 42],
//     colors: ['black-persian-violet', 'black-baltic-blue', 'gold-black-pearl', 'green-shock-black-pearl', 'metallic-silver-black-white']
//   }
// ]
