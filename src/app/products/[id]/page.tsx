/**
 * Product Detail Page - CORRECTED VERSION
 * File: src/app/products/[id]/page.tsx
 *
 * CRITICAL FIXES:
 * 1. Proper async/await for params (Next.js 15+)
 * 2. Correct import paths for moved components
 * 3. Enhanced error handling and logging
 * 4. Fallback mechanisms for data fetching
 */

import ProductDetailClient from "@/components/products/ProductDetailClient";
import { getProductById, getRelatedProducts } from "@/data/products";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// Type definition for params (Next.js 15+ compatibility)
type PageProps = {
  params: Promise<{ id: string }>;
};

/**
 * Generate static paths for pre-rendering
 */
export async function generateStaticParams() {
  try {
    console.log("🔄 Generating static params...");
    const { products } = await import("@/data/products");

    const params = products.map((product) => ({
      id: product.id,
    }));

    console.log(`✅ Generated ${params.length} static params`);
    return params;
  } catch (error) {
    console.error("❌ Error generating static params:", error);
    return [];
  }
}

/**
 * Generate dynamic metadata for SEO
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    // Await params (Next.js 15+ requirement)
    const resolvedParams = await params;
    const productId = resolvedParams.id;

    console.log(`🔍 Generating metadata for product: ${productId}`);

    // Await product data
    const product = await getProductById(productId);

    if (!product) {
      console.warn(`⚠️ Product not found for metadata: ${productId}`);
      return {
        title: "Product Not Found | Street Style",
        description: "The product you're looking for could not be found.",
      };
    }

    const discount = product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

    const title =
      product.seoTitle || `${product.name} - ${product.brand} | Street Style`;
    const description =
      product.seoDescription ||
      `${product.shortDescription || product.description.slice(0, 155)}${
        discount > 0 ? ` Save ${discount}%!` : ""
      }`;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const imageUrl = product.images[0]?.startsWith("http")
      ? product.images[0]
      : `${baseUrl}${product.images[0]}`;

    console.log(`✅ Metadata generated for: ${product.name}`);

    return {
      title,
      description,
      keywords: product.seoKeywords?.join(", "),

      openGraph: {
        title,
        description,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
        type: "website",
        siteName: "Street Style",
        url: `${baseUrl}/products/${productId}`,
      },

      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },

      other: {
        "product:price:amount": product.price.toString(),
        "product:price:currency": product.currency || "USD",
        "product:availability": product.inStock ? "in stock" : "out of stock",
        "product:condition": "new",
        "product:brand": product.brand,
      },

      alternates: {
        canonical: `${baseUrl}/products/${productId}`,
      },

      robots: {
        index: product.inStock,
        follow: true,
      },
    };
  } catch (error) {
    console.error("❌ Error generating metadata:", error);
    return {
      title: "Error | Street Style",
      description: "An error occurred while loading this product.",
    };
  }
}

/**
 * Generate JSON-LD structured data
 */
type Product = {
  id: string;
  name: string;
  description?: string;
  images: string[];
  brand?: string;
  price: number | string;
  currency?: string;
  inStock?: boolean;
};

function generateProductJsonLd(product: Product) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((img: string) =>
      img.startsWith("http") ? img : `${baseUrl}${img}`
    ),
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency || "USD",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${baseUrl}/products/${product.id}`,
    },
  };
}

/**
 * Product Detail Page Component
 * CRITICAL: This MUST be async and properly await all data
 */
export default async function ProductPage({ params }: PageProps) {
  try {
    console.log("🚀 ProductPage rendering started");

    // CRITICAL FIX 1: Await params (Next.js 15+)
    const resolvedParams = await params;
    console.log("📦 Params received:", resolvedParams);
    const productId = resolvedParams.id;

    console.log(`🔍 Fetching product with ID: ${productId}`);

    // CRITICAL FIX 2: Await product data
    const product = await getProductById(productId);

    console.log("📊 Product fetch result:", product ? "SUCCESS" : "NOT FOUND");

    // Handle product not found
    if (!product) {
      console.warn(`⚠️ Product not found: ${productId}`);
      notFound();
    }

    console.log(`✅ Product loaded: ${product.name}`);

    // CRITICAL FIX 3: Await related products
    console.log("🔗 Fetching related products...");
    const relatedProducts = await getRelatedProducts(product, 4);
    console.log(`✅ Found ${relatedProducts.length} related products`);

    // Generate JSON-LD for SEO
    const jsonLd = generateProductJsonLd(product);

    console.log("✅ ProductPage rendering complete");

    return (
      <>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Debug info (remove in production) */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-green-50 border border-green-200 p-4 m-4 rounded">
            <p className="text-sm font-mono text-green-800">
              ✅ Page rendered successfully
              <br />
              Product ID: {productId}
              <br />
              Product Name: {product.name}
              <br />
              Related Products: {relatedProducts.length}
            </p>
          </div>
        )}

        {/* Main Product Content */}
        <ProductDetailClient
          product={product}
          relatedProducts={relatedProducts}
        />
      </>
    );
  } catch (error) {
    console.error("❌ CRITICAL ERROR in ProductPage:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );

    // Re-throw to trigger error boundary
    throw new Error(
      `Failed to render product page: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Configure ISR (Incremental Static Regeneration)
export const revalidate = 3600; // Revalidate every hour

// Configure rendering strategy
export const dynamic = "auto";

// Configure fetch caching
export const fetchCache = "default-cache";
