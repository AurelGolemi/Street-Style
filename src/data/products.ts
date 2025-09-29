export interface Product {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  images: string[]
  category: 'men' | 'women' | 'kids'
  subcategory: 'shoes' | 'clothing' | 'accessories'
  sizes: string[]
  colors: string[]
  description: string
  features: string[]
  inStock: boolean
}

export interface Brand {
  id: string
  name: string
  logo: string
  description: string
}

export const brands: Brand[] = [
  { id: 'nike', name: 'Nike', logo: '/logos/nike.svg', description: 'Just Do It' },
  { id: 'adidas', name: 'Adidas', logo: '/logos/adidas.svg', description: 'Impossible is Nothing' },
]

export const products: Product[] = [
  {
    id: 'nike-air-max-95-mens-shoes',
    name: `Air Max 95 Men's Shoes`,
    brand: 'nike',
    price: 190,
    originalPrice: 190,
    image: '/public/nike-air-max-95-og.jpg',
    category: 'sneakers',
    description: { "Rep '90s - inspired sneaks with these men's Air Max 95 OG trainers from Nike. In a Black, Persian Violet and Wolf Grey colourway, these sneaks mix real and synthetic leather with airy textiles for a layered look. They feature a lace fastening to keep you locked in, with wavy side panels for natural flow."},
    sizes: [41, 42],
    colors: ['black-persian-violet', 'black-baltic-blue', 'gold-black-pearl', 'green-shock-black-pearl', 'metallic-silver-black-white']
  }
]