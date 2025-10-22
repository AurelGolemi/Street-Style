"use client";

import { useCartStore } from "@/store/CartStore";
import Image from "next/image";
import { useState } from "react";

import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.name || ""
  );
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = () => {
    // Add Item to cart
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      category: product.category,
      image: product.images[0],
    });

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Product Image */}
      <div className="aspect-square bg-gray-200">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={700}
          height={700}
          className="object-contain"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-sm text-gray-500 dark:text-slate-400">
          {product.brand}
        </p>
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="text-xl font-bold mt-2 text-gray-900">€{product.price}</p>

        {/* Size Selector */}
        <div className="mt-4">
          <p className="text-sm font-medium mb-2 text-gray-900">Size:</p>
          <div className="flex gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1 border rounded cursor-pointer ${
                  selectedSize === size
                    ? "border-black bg-black text-white"
                    : "border-gray-300"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selector */}
        <div className="mt-4">
          <p className="text-sm font-medium mb-2 text-gray-900">Color:</p>
          <div className="flex gap-2">
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`w-8 h-8 rounded-full border-2 cursor-pointer ${
                  selectedColor === color.name
                    ? "border-black"
                    : "border-gray-300"
                }`}
                style={{
                  backgroundColor: color.hex || color.name.toLowerCase(),
                }}
              />
            ))}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full mt-4 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition cursor-pointer"
        >
          {showSuccess ? "✔ Added to Cart!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
