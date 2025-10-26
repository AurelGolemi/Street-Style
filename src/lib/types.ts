// New product info

export interface Product {
  // identifiers
  id: string;
  sku?: string;

  // Basic Information
  name: string;
  brand: string;
  description: string;
  shortDescription?: string;

  // Pricing
  price: number;
  originalPrice?: number;
  currency: string;

  // Visual Assets
  images: string[];
  video?: string;

  // Categorization
  category: "men" | "women" | "kids";
  subcategory: "shoes" | "clothing" | "accessories";
  tags?: string[];

  // Variants
  sizes: string[];
  colors: Array<{
    // Colored variants with structured data
    name: string;
    hex?: string;
    images?: string[];
  }>;

  // Product Details
  features: string[];
  materials?: string[];
  care?: string[];

  // Inventory & Availability
  inStock: boolean;
  stockLevel?: number;
  lowStockThreshold?: number;

  // Social Proof (optional)
  rating?: number;
  reviewCount?: number;
  reviews?: Review[];

  // Relationships
  relatedProducts?: string[];

  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  verified: boolean;
  helpful: number;
  images?: string[];
  createdAt: Date;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  addedAt: Date;
}

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

export type ProductSortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "rating"
  | "popularity";


export interface Breadcrumb {
  label: string;
  href: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
}

