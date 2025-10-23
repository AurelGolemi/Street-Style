// New product info

/**
 * Core Product Interface
 *
 * This represents a complete product entity with all properties needed
 * for display, purchase, and management. Every product in the system
 * conforms to this structure.
 *
 * Design Decisions:
 * - id: string (not number) allows for various ID formats (UUID, slug, etc.)
 * - images: array (first image is primary, rest are gallery)
 * - sizes/colors: arrays allow for multi-variant selection
 * - Optional fields marked with ? for flexible data
 */

export interface Product {
  // identifiers
  id: string; // Unique Identifier used in URLs
  sku?: string; // Stock Keeping Unit for Inventory

  // Basic Information
  name: string; // Display Name
  brand: string; // Brand Name
  description: string; // Full Product Description
  shortDescription?: string; // Optional brief description for cards

  // Pricing
  price: number; // Current price in base currency
  originalPrice?: number; // Purpose of showing discounts currently
  currency: string; // ISO currency code (EUR, GBP)

  // Visual Assets
  images: string[]; // Array of image URLs
  video?: string; // Optional Product Video URL

  // Categorization
  category: "men" | "women" | "kids"; // Main Category
  subcategory: "shoes" | "clothing" | "accessories"; // Product Type
  tags?: string[]; // Additional tags for filtering

  // Variants
  sizes: string[]; // Available sizes (44, 45)
  colors: Array<{
    // Colored variants with structured data
    name: string;
    hex?: string;
    images?: string[];
  }>;

  // Product Details
  features: string[]; // Bullet point features
  materials?: string[]; // Material composition
  care?: string[]; // Care instructions

  // Inventory & Availability
  inStock: boolean; // General availability stock
  stockLevel?: number; // Exact stock count
  lowStockThreshold?: number; // When to show "Low Stock" warning

  // Social Proof (optional)
  rating?: number; // Average rating (0-5)
  reviewCount?: number; // Total number of reviews
  reviews?: Review[]; // Full review objects

  // Relationships
  relatedProducts?: string[]; // IDs of related products

  // Metadata
  createdAt?: Date; // When product was added
  updatedAt?: Date; // Last modification date
  seoTitle?: string; // Override title for SEO
  seoDescription?: string; // Meta description for SEO
  seoKeywords?: string[]; // Keywords for search
}

/*
 * Review Interface
 *
 * Represents a customer review with all necessary fields for display
 * and moderation.
 */

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  verified: boolean; // Is this a verified purchase
  helpful: number; // Number of helpful votes (optional)
  images?: string[]; // Optional user-uploaded images
  createdAt: Date;
}

export interface CartItem {
  product: Product; // Full product
  selectedSize: string; // User's size choice
  selectedColor: string; // User's color choice
  quantity: number; // Number of units
  addedAt: Date; // When added to cart
}

/**
 * Product Filter Options
 *
 * Used for filtering product lists on category pages
 */

export interface ProductFilters {
  brands?: string[];
  categories?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
  rating?: number;
}

/**
 * Product Sort Options
 *
 * Enumeration of available sorting methods
 */

export type ProductSortOption =
  | "featured" // Curated/promoted products first
  | "price-asc" // Lowest price first
  | "price-desc" // Highest price first
  | "newest" // Most recently added
  | "rating" // Highest rated first
  | "popularity"; // Most viewed/purchased

/**
 * Breadcrumb Interface
 *
 * For navigation breadcrumbs on product pages
 */

export interface Breadcrumb {
  label: string;
  href: string;
}

/**
 * Brand Interface
 *
 * Represents a brand entity with basic information for display
 * and navigation.
 */

export interface Brand {
  id: string; // Unique identifier used in URLs (slug)
  name: string; // Display name
  logo: string; // Logo image path
  description: string; // Brand description
}

// Old product info

// export interface NavItem {
//   name: string
//   href: string
//   icon?: React.ReactNode
// }

// export interface Feature {
//   id: string
//   title: string
//   description: string
//   icon: React.ReactNode
//   color?: string
// }

// export interface Product {
//   id: string
//   name: string
//   description: string
//   price: number
//   image: string
//   category: string
//   features: string[]
//   brand: string
//   subcategory: string
//   sizes: string[]
//   colors: string[]
//   inStock: boolean
// }

// export interface Testimonial {
//   id: string
//   name: string
//   role: string
//   company: string
//   content: string
//   avatar: string
//   rating: number
// }
