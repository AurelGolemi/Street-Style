/**
 * Product Detail Page - Server Component
 *
 * This is a Next.js Server Component that:
 * 1. Fetches product data on the server
 * 2. Generates dynamic metadata for SEO
 * 3. Handles 404 errors for invalid products
 * 4. Passes data to client components
 *
 * Why Server Component:
 * - SEO: Content is pre-rendered for search engines
 * - Performance: No client-side data fetching
 * - Security: Sensitive logic stays on server
 * - Caching: Next.js can cache responses
 */

/**
 * Generate static paths for pre-rendering
 *
 * This tells Next.js which product pages to build at compile time.
 * In production with thousands of products, you'd only pre-render
 * the top-selling items and use ISR for the rest.
 */

import ProductDetailClient from "../ProductDetailClient";
import { getProductById, getRelatedProducts } from "@/data/products";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const { products } = await import("@/data/products");

  return products.map((product) => ({
    id: product.id,
  }));
}

/**
 * Generate dynamic metadata for SEO
 *
 * This function runs on the server for each request and generates
 * optimized meta tags for social sharing and search engines.
 *
 * @param params - Route parameters
 * @returns Metadata object for Next.js
 */
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = getProductById(params.id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  // Calculate discount for meta description
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const title =
    product.seoTitle || `${product.name} - ${product.brand} | Street Style`;
  const description =
    product.seoDescription ||
    `${product.shortDescription || product.description.slice(0, 160)}${
      discount > 0 ? ` Save ${discount}%!` : ""
    }`;

  return {
    title,
    description,
    keywords: product.seoKeywords?.join(", "),

    // Open Graph for social media
    openGraph: {
      title,
      description,
      images: [
        {
          url: product.images[0],
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      type: "website",
    },

    other: {
      "product:price:amount": product.price.toString(),
      "product:price:currency": product.currency,
      "product:availability": product.inStock ? "in stock" : "out of stock",
      "product:condition": "new",
      "product:brand": product.brand,
    },
  };
}

/**
 * Product Detail Page Component
 *
 * Server-side rendered page that fetches product data and passes
 * it to client components for interactivity.
 */
export default function ProductPage({ params }: { params: { id: string } }) {
  // Fetch product data on server
  const product = getProductById(params.id);

  // Handle product not found
  if (!product) {
    notFound();
  }

  // Fetch related products
  const relatedProducts = getRelatedProducts(product, 4);

  // Pass data to client component for interactivity
  return (
    <ProductDetailClient product={product} relatedProducts={relatedProducts} />
  );
}
