import ProductCard from "@/components/products/ProductCard";
import Container from "@/components/ui/Container";
import { brands, products } from "@/data/products";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Generate static params for all brands
export async function generateStaticParams() {
  return brands.map((brand) => ({
    slug: brand.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = brands.find((b) => b.id === slug);

  if (!brand) {
    return { title: "Brand Not Found" };
  }

  const productCount = products.filter(
    (p) => p.brand.toLowerCase() === brand.name.toLowerCase()
  ).length;

  return {
    title: `${brand.name} - Official Collection | Street Style`,
    description: `Shop ${productCount}+ ${brand.name} products. ${brand.description}. Free shipping on orders over €50.`,
    openGraph: {
      title: `${brand.name} Official Collection`,
      description: brand.description,
      images: [brand.logo],
    },
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Find brand data
  const brand = brands.find((b) => b.id === slug);

  if (!brand) {
    notFound();
  }

  // Get all products from this brand
  const brandProducts = products.filter(
    (p) => p.brand.toLowerCase() === brand.name.toLowerCase()
  );

  // Organize by category
  const menProducts = brandProducts.filter((p) => p.category === "men");
  const womenProducts = brandProducts.filter((p) => p.category === "women");
  const kidsProducts = brandProducts.filter((p) => p.category === "kids");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Brand Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <Container>
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Brand Logo */}
            <div className="w-32 h-32 bg-white rounded-2xl p-6 flex items-center justify-center flex-shrink-0">
              <div className="relative w-full h-full">
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  fill
                  className="object-contain filter grayscale"
                  sizes="128px"
                />
              </div>
            </div>

            {/* Brand Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {brand.name}
              </h1>
              <p className="text-xl text-gray-300 mb-6">{brand.description}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="text-center">
                  <p className="text-3xl font-bold">{brandProducts.length}+</p>
                  <p className="text-sm text-gray-400">Products</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{menProducts.length}</p>
                  <p className="text-sm text-gray-400">{"Men's"}</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{womenProducts.length}</p>
                  <p className="text-sm text-gray-400">{"Women's"}</p>
                </div>
                {kidsProducts.length > 0 && (
                  <div className="text-center">
                    <p className="text-3xl font-bold">{kidsProducts.length}</p>
                    <p className="text-sm text-gray-400">{"Kids'"}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Category Quick Links */}
      <div className="bg-white border-b border-gray-200">
        <Container>
          <div className="flex gap-8 py-4 overflow-x-auto">
            <Link
              href={`#all`}
              className="text-sm font-semibold text-gray-900 hover:text-blue-600 whitespace-nowrap transition"
            >
              All Products ({brandProducts.length})
            </Link>
            {menProducts.length > 0 && (
              <Link
                href={`#men`}
                className="text-sm font-semibold text-gray-700 hover:text-gray-900 whitespace-nowrap transition"
              >
                Men ({menProducts.length})
              </Link>
            )}
            {womenProducts.length > 0 && (
              <Link
                href={`#women`}
                className="text-sm font-semibold text-gray-700 hover:text-gray-900 whitespace-nowrap transition"
              >
                Women ({womenProducts.length})
              </Link>
            )}
            {kidsProducts.length > 0 && (
              <Link
                href={`#kids`}
                className="text-sm font-semibold text-gray-700 hover:text-gray-900 whitespace-nowrap transition"
              >
                Kids ({kidsProducts.length})
              </Link>
            )}
          </div>
        </Container>
      </div>

      {/* All Products Section */}
      <section id="all" className="py-12">
        <Container>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All {brand.name} Products
          </h2>

          {brandProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {brandProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No products available for this brand yet.
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* Men's Section (if products exist) */}
      {menProducts.length > 0 && (
        <section id="men" className="py-12 bg-white">
          <Container>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {"Men's"} {brand.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {menProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Women's Section */}
      {womenProducts.length > 0 && (
        <section id="women" className="py-12">
          <Container>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {"Women's"} {brand.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {womenProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Kids' Section */}
      {kidsProducts.length > 0 && (
        <section id="kids" className="py-12 bg-white">
          <Container>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {"Kids'"} {brand.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {kidsProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Brand Story Section (Optional Enhancement) */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              About {brand.name}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              {brand.description}
            </p>
            <Link
              href={`/brands/${brand.id}/story`}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              Read Full Brand Story
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
