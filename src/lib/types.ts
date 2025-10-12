export interface NavItem {
  name: string
  href: string
  icon?: React.ReactNode
}

export interface Feature {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color?: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  features: string[]
  brand: string
  subcategory: string
  sizes: string[]
  colors: string[]
  inStock: boolean
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  avatar: string
  rating: number
}