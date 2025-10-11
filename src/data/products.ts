{/* New products.ts */ }
import { Product } from '@/lib/types'

export const brands = [
  { id: 'nike', name: 'Nike', logo: '/brand-logos/nike-logo.svg' },
  { id: 'adidas', name: 'Adidas', logo: '/brand-logos/adidas-logo.svg' },
  { id: 'puma', name: 'Puma', logo: '/brand-logos/puma-logo.svg'}
]

export const products: Product[] = [
  {
    id: 'nike-air-max-95-og',
    name: 'Air Max 95',
    price: 189.99,
    image: '/nike-air-max-95-og.jpg',
    category: 'men',
    subcategory: 'shoes',
    sizes: [41, 42],
    colors: ['Black-Persian-Violet', 'Baltic-Blue-Black-Pearl', 'MTLC Gold-Black-Pearl', 'Green-Shock-Black-Pearl-Grey', 'Metallic-Silver-Black-White'],
    description: "Get these '90s-inspired icons and stand out wherever you go! The Nike Air Max 95 trainers come in a black colourway with purple stitching that adds the perfect touch, from a durable and smooth upper for ultimate comfort, with a soft ankle collar to offer extra support.",
    inStock: true,
  },
]

// Helper functions to filter products
export const getProductsByCategory = (category: string) => {
  return products.filter(p => p.category === category)
}

export const getProductsByBrand = (brand: string) => {
  return products.filter(p => p.brand.toLowerCase() === brand.toLowerCase())
}

export const getFeaturedProducts = () => {
  return products.slice(0, 4)
}


{/* Old products.ts */}
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