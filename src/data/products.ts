/* New products.ts */
import { Brand, Product } from "@/lib/types";

export const brands: Brand[] = [
  {
    id: "nike",
    name: "Nike",
    logo: "/brand-logos/nike-logo.svg",
    description:
      "Just Do It. Nike delivers innovative products, experiences and services to inspire athletes.",
  },
  {
    id: "adidas",
    name: "Adidas",
    logo: "/brand-logos/adidas-logo.svg",
    description:
      "Impossible is Nothing. Adidas creates products and experiences that enable people to feel free to shape their future.",
  },
  {
    id: "puma",
    name: "Puma",
    logo: "/brand-logos/puma-logo.svg",
    description:
      "Forever Faster. Puma is the third largest sportswear manufacturer in the world.",
  },
  {
    id: "hoodrich",
    name: "Hoodrich",
    logo: "/brand-logos/hoodrich-logo.svg",
    description:
      "Hoodrich is a streetwear brand known for its bold designs and urban fashion.",
  },
];

export const products: Product[] = [
  {
    id: "nike-air-max-95-og",
    sku: "IB7936-001",
    name: "Air Max 95",
    brand: "Nike",
    description: `Rep '90s-inspired sneaks with these men's Air Max 95 OG trainers from Nike. In a Black, Persian Violet and Wolf Grey colourway, these sneaks mix real and synthetic leather with airy textiles for a layered look. They feature a lace fastening to keep you locked in, with wavy side panels for natural flow. Underfoot, the foam midsole and visible Max Air unit provide responsive cushioning, while flex groves in the midsole and grippy rubber outsole let you move freely. Finished up with signature Nike Air Max branding throughout.`,
    price: 189.99,
    currency: "EUR",
    images: [
      "/brand-product/nike-air-max-95-og/nike-air-max-95-og.jpg",
      "/brand-product/nike-air-max-95-og/nike-air-max-95-og-2.jpg",
      "/brand-product/nike-air-max-95-og/nike-air-max-95-og-3.jpg",
      "/brand-product/nike-air-max-95-og/nike-air-max-95-og-4.jpg",
      "/brand-product/nike-air-max-95-og/nike-air-max-95-og-5.jpg",
      "/brand-product/nike-air-max-95-og/nike-air-max-95-og-6.jpg",
    ],
    category: "men",
    subcategory: "shoes",
    tags: ["sneakers", "running", "casual", "retro", "bestseller"],

    sizes: ["41", "42"],
    colors: [
      {
        name: "Black-Violet",
        hex: "#1f11f1",
        images: ["/brand-product/nike-air-max-95-og/nike-air-max-95-og.jpg"],
      },
      {
        name: "Baltic-Blue",
        hex: "#11f1ff",
        images: [
          "/brand-product/nike-air-max-95-og/nike-air-max-95-og-baltic-blue.jpg",
        ],
      },
      {
        name: "Gold-White",
        hex: "#FFFFF4",
        images: [
          "/brand-product/nike-air-max-95-og/nike-air-max-95-og-baltic-blue.jpg",
        ],
      },
      {
        name: "Black-Green",
        hex: "#1ff11f",
        images: [
          "/brand-product/nike-air-max-95-og/nike-air-max-95-og-black-green.jpg",
        ],
      },
      {
        name: "Silver-Black-Metallic",
        hex: "#706F6D",
        images: [
          "/brand-product/nike-air-max-95-og/nike-air-max-95-og-silver-black-metallic.jpg",
        ],
      },
    ],

    features: [
      "Max Air cushioning in heel for impact protection",
      "Leather and synthetic upper for durability",
      "Padded low-cut collar for comfortable fit",
      "Waffle-inspired rubber outsole for traction",
      "Foam midsole for lightweight cushioning",
      "Visible Air unit for iconic style",
      "Lace-up closure for secure fit",
    ],

    materials: ["Leather", "Synthetic", "Rubber", "Foam"],
    care: [
      "Carefully wipe away dust and dirt with a dry brush.",
      "Clean your shoes with water and a little dishwashing liquid or laundry detergent, and using a soft brush or old toothbrush, gently wash the upper and outsole of your sneakers. If your Nike shoes are white, add a small amount of baking soda to make them extra clean!",
      "Remove the laces from your shoes and wash them with the same solution.",
      "Allow your sneakers to dry naturally, under shade, so they retain their colour and shape. Remember that your sneakers need to dry very well before you wear them, which can take around 8 hours.",
    ],

    inStock: true,
    stockLevel: 45,
    lowStockThreshold: 10,

    rating: 4.7,
    reviewCount: 43,

    relatedProducts: ["adidas-ultraboost-22", "puma-rs-x", "new-balance-574"],

    createdAt: new Date("2025-09-12"),
    updatedAt: new Date("2025-10-21"),

    seoTitle: "Nike Air Max 95 - Classic Sneakers | Street Style",
    seoDescription:
      "Shop the iconic Nike Air Max 90 with visible Air cushioning. Available in multiple colorways. Free shipping on orders over €50.",
    seoKeywords: [
      "nike air max",
      "air max 95",
      "nike sneakers",
      "retro running shoes",
      "streetwear",
    ],
  },
  {
    id: "nike-tech-mix-track-pants",
    sku: "CW7456-063",
    name: "Nike Tech Mix Track Pants",
    brand: "Nike",
    description:
      "Made for the streets. These men's Tech Mix trackpants from Nike land in a Cool Grey colourway and are exclusive to JD. They're crafted from Nike's signature Tech Fleece fabric with cut-and-sew panels for a textured, modern look. Featuring an elasticated waistband and tapered legs for a streamlined fit, they're finished with side pockets and a Futura logo on the thigh.",
    price: 100.0,
    currency: "EUR",
    images: ["/brand-product/nike-tech-mix-track-pants.jpg"],
    category: "men",
    subcategory: "clothing",
    tags: ["track pants", "tech fleece", "streetwear", "casual"],

    sizes: ["XS", "S", "M", "L"],
    colors: [
      {
        name: "Cool Grey",
        hex: "#8B8B8B",
        images: ["/brand-product/nike-tech-mix-track-pants.jpg"],
      },
    ],

    features: [
      "Tech Fleece fabric for warmth and comfort",
      "Cut-and-sew panels for modern design",
      "Elasticated waistband with drawcord",
      "Tapered legs for streamlined fit",
      "Side pockets for storage",
      "Futura logo branding",
    ],

    materials: ["Polyester", "Cotton"],
    care: [
      "Machine wash cold",
      "Tumble dry low",
      "Do not bleach",
      "Do not iron",
    ],

    inStock: true,
    stockLevel: 25,
    lowStockThreshold: 5,

    rating: 4.5,
    reviewCount: 18,

    createdAt: new Date("2025-10-01"),
    updatedAt: new Date("2025-10-15"),

    seoTitle:
      "Nike Tech Mix Track Pants - Streetwear Essentials | Street Style",
    seoDescription:
      "Shop Nike Tech Mix Track Pants in Cool Grey. Premium Tech Fleece fabric with modern cut-and-sew design. Free shipping on orders over €50.",
    seoKeywords: [
      "nike track pants",
      "tech fleece",
      "streetwear pants",
      "nike clothing",
    ],
  },
  {
    id: "hoodrich-chromatic-hoodie",
    sku: "HR-CH-001",
    name: "Hoodrich Chromatic Hoodie",
    brand: "Hoodrich",
    description:
      "Layer up in iconic style with the Hoodrich Chromatic Hoodie in a black colourway with the shiny detail on the chest giving the perfect touch. This staple is made of smooth and soft fleece fabric to provide everyday comfort and warmth, while it features a hood that closes with a button for even more coverage from the cold. The front pocket is ideal for storing essentials, but also to keep your hands warm.",
    price: 55.0,
    currency: "EUR",
    images: ["/brand-product/hoodrich-chromatic-hoodie.jpg"],
    category: "men",
    subcategory: "clothing",
    tags: ["hoodie", "streetwear", "urban", "chromatic"],

    sizes: ["XS", "S", "M", "L"],
    colors: [
      {
        name: "Black-Silver-Chromatic",
        hex: "#000000",
        images: ["/brand-product/hoodrich-chromatic-hoodie.jpg"],
      },
      {
        name: "Sky-Captain-Silver-Chromatic",
        hex: "#4A90E2",
        images: ["/brand-product/hoodrich-chromatic-hoodie.jpg"],
      },
    ],

    features: [
      "Premium fleece fabric for comfort",
      "Hood with button closure",
      "Front kangaroo pocket",
      "Chromatic chest detail",
      "Ribbed cuffs and hem",
    ],

    materials: ["Cotton", "Polyester"],
    care: ["Machine wash cold", "Tumble dry low", "Do not bleach"],

    inStock: true,
    stockLevel: 30,
    lowStockThreshold: 5,

    rating: 4.3,
    reviewCount: 12,

    createdAt: new Date("2025-09-20"),
    updatedAt: new Date("2025-10-10"),

    seoTitle: "Hoodrich Chromatic Hoodie - Streetwear Icon | Street Style",
    seoDescription:
      "Shop the Hoodrich Chromatic Hoodie with signature shiny chest detail. Premium streetwear in black and blue colorways.",
    seoKeywords: [
      "hoodrich hoodie",
      "chromatic hoodie",
      "streetwear",
      "urban fashion",
    ],
  },
  {
    id: "adidas-ultraboost-22",
    sku: "GX5455",
    name: "Adidas Ultraboost 22",
    brand: "Adidas",
    description:
      "Experience epic energy with the Ultraboost 22 shoes from Adidas. These men's running shoes feature a Primeknit upper with a heel pull for easy on/off, while the soft foam midsole provides responsive cushioning. The Continental rubber outsole delivers superior traction, and the Linear Energy Push system returns energy with every step.",
    price: 190.0,
    currency: "EUR",
    images: ["/brand-product/adidas-ultraboost-22.avif"],
    category: "men",
    subcategory: "shoes",
    tags: ["running shoes", "boost", "comfort", "performance"],

    sizes: ["40", "41", "42", "43"],
    colors: [
      {
        name: "Core Black",
        hex: "#000000",
        images: ["/brand-product/adidas-ultraboost-22.jpg"],
      },
    ],

    features: [
      "Primeknit upper for adaptive fit",
      "BOOST midsole for energy return",
      "Continental rubber outsole for grip",
      "Linear Energy Push system",
      "Heel pull for easy entry",
    ],

    materials: ["Primeknit", "BOOST", "Rubber"],
    care: ["Clean with damp cloth", "Air dry naturally", "Do not machine wash"],

    inStock: true,
    stockLevel: 20,
    lowStockThreshold: 5,

    rating: 4.8,
    reviewCount: 67,

    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-10-05"),

    seoTitle: "Adidas Ultraboost 22 - Premium Running Shoes | Street Style",
    seoDescription:
      "Shop Adidas Ultraboost 22 with BOOST technology. Responsive cushioning and superior traction. Free shipping on orders over €50.",
    seoKeywords: [
      "adidas ultraboost",
      "running shoes",
      "boost cushioning",
      "adidas sneakers",
    ],
  },
  {
    id: "puma-rs-x-toys",
    sku: "PM-RS-X-001",
    name: "Puma RS-X Toys",
    brand: "Puma",
    description:
      "Step into playful style with the Puma RS-X Toys sneakers. These chunky retro runners feature a mesh and synthetic upper with signature RS branding. The IMEVA foam midsole provides lightweight cushioning, while the rubber outsole ensures excellent traction. Perfect for streetwear enthusiasts.",
    price: 110.0,
    currency: "EUR",
    images: ["/brand-product/puma-rs-x-toys.webp"],
    category: "women",
    subcategory: "shoes",
    tags: ["sneakers", "retro", "chunky", "streetwear"],

    sizes: ["36", "37", "38", "39"],
    colors: [
      {
        name: "White-Black",
        hex: "#FFFFFF",
        images: ["/brand-product/puma-rs-x-toys.jpg"],
      },
    ],

    features: [
      "Mesh and synthetic upper",
      "IMEVA foam midsole",
      "Rubber outsole for traction",
      "RS branding details",
      "Lace-up closure",
    ],

    materials: ["Mesh", "Synthetic", "Rubber"],
    care: ["Clean with damp cloth", "Air dry naturally"],

    inStock: true,
    stockLevel: 15,
    lowStockThreshold: 3,

    rating: 4.4,
    reviewCount: 23,

    createdAt: new Date("2025-09-01"),
    updatedAt: new Date("2025-10-20"),

    seoTitle: "Puma RS-X Toys - Retro Sneakers | Street Style",
    seoDescription:
      "Shop Puma RS-X Toys sneakers with chunky design and retro appeal. Perfect for streetwear looks.",
    seoKeywords: [
      "puma rs-x",
      "retro sneakers",
      "chunky shoes",
      "puma sneakers",
    ],
  },
];

/**
 * Get product by ID
 *
 * @param id - Product ID or slug
 * @returns Product object or undefined
 */

export async function getProductById(id: string): Promise<Product | null> {
  return Promise.resolve(
    products.find((p) => p.id === id) || null
  );
}

/**
 * Get products by category
 *
 * @param category - Category filter
 * @returns Array of matching products
 */

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

/**
 * Get products by brand
 *
 * @param brand - Brand name
 * @returns Array of matching products
 */

export function getProductsByBrand(brand: string): Product[] {
  return products.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
}

/**
 * Get featured/bestselling products
 *
 * @param limit - Maximum number of products to return
 * @returns Array of featured products
 */

export function getFeaturedProducts(limit: number = 4): Product[] {
  return products.slice(0, limit);
}

/**
 * Get related products
 *
 * @param product - Current product
 * @param limit - Maximum number of related products
 * @returns Array of related products
 */

export async function getRelatedProducts(
  product: Product,
  limit: number = 4
): Promise<Product[]> {
  // If product has explicit relatedProducts use those ids to fetch
  if (product.relatedProducts && product.relatedProducts.length > 0) {
    const related = await Promise.all(
      product.relatedProducts.map((id) => getProductById(id))
    );
    return related.filter((p): p is Product => p !== null).slice(0, limit);
  }

  // Fallback: find products with same category or brand
  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category || p.brand === product.brand)
    )
    .slice(0, limit);
}

/**
 * Search products
 *
 * @param query - Search term
 * @returns Array of matching products
 */

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();

  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.brand.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Calculate discount percentage
 *
 * @param product - Product object
 * @returns Discount percentage or 0
 */

export function getDiscountPercentage(product: Product): number {
  if (!product.originalPrice) return 0;
  return Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );
}

/**
 * Check if product is on sale
 *
 * @param product - Product object
 * @returns Boolean indicating sale status
 */
export function isOnSale(product: Product): boolean {
  return Boolean(
    product.originalPrice && product.originalPrice > product.price
  );
}

/**
 * Check if product is low stock
 *
 * @param product - Product object
 * @returns Boolean indicating low stock status
 */

export function isLowStock(product: Product): boolean {
  if (!product.stockLevel || !product.lowStockThreshold) return false;
  return product.stockLevel <= product.lowStockThreshold;
}

/**
 * Format price with currency symbol
 *
 * @param price - Price value
 * @param currency - Currency code
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency: string = "GBP"): string {
  const symbols: Record<string, string> = {
    GBP: "£",
    USD: "$",
    EUR: "€",
  };
  const symbol = symbols[currency] || currency;
  return `${symbol}${price.toFixed(2)}`;
}