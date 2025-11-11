'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react'

interface ProductImageGalleryProps {
  images: string[]
  productName: string
}

export default function ProductImageGallery({
  images,
  productName
}: ProductImageGalleryProps) {
  // State Management

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLightBoxOpen, setIsLightboxOpen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  // Event Handlers

  const goToImage = (index: number) => {
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index)
    }
  }

  // Navigate to next image
  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  // Navigate to previous image
  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // Open lightbox (fullscreen mode)
  const openLightbox = () => {
    setIsLightboxOpen(true)
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden'
  }

  // Close lightbox (back to normal screen)
  const closeLightbox = () => {
    setIsLightboxOpen(false)
    setIsZoomed(false)
    document.body.style.overflow = 'unset'
  }

  // Handle mouse move for zoom effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setMousePosition({ x, y })
  }

  // Handle keyboard navigation in lightbox
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isLightBoxOpen) return

    switch (e.key) {
      case 'ArrowLeft':
        prevImage()
        break;
      case 'ArrowRight':
        nextImage()
        break;
      case 'Escape':
        closeLightbox()
        break;
    }
  }

  // Listen for keyboard events
  useState(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  })

  // Render
  return (
    <>
      {/* Main Gallery */}
      <div className="space-y-4">
        {/* Main Image Display */}
        <div
          className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden group cursor-zoom-in"
          onClick={openLightbox}
        >
          <Image
            src={images[currentIndex]}
            alt={`${productName} - Image ${currentIndex + 1}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={currentIndex === 0} // Priority load first image
          />

          {/* Zoom Icon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-20">
            <div className="bg-white rounded-full p-3">
              <ZoomIn className="w-6 h-6 text-gray-900" />
            </div>
          </div>

          {/* Navigation Arrows (if multiple images) */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100 text-gray-900"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-4 top-1/2 translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100 text-gray-900"
              aria-label="Next Image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                  ? 'border-gray-900 scale-95'
                  : 'border-gray-200 hover:border-gray-400'
                  }`}
                aria-label={`View Image ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 10vw"
                />
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-gray-900 bg-opacity-20" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {isLightBoxOpen && (
        <div className="fixed inset-0 z-[100] bg-black">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full p-3 transition-all cursor-pointer"
            aria-label="Close fullscreen"
          >
            <X className="w-6 h-6 text-gray-900" />
          </button>

          {/* Zoom Toggle */}
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="top-4 left-4 z-10 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full p-3 transition-all cursor-pointer"
            aria-label={isZoomed ? 'Zoom Out' : 'Zoom In'}
          >
            <ZoomIn className={`w-6 h-6 text-gray-900 ${isZoomed ? 'scale-125' : ''}`} />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white bg-opacity-10 text-gray-900 px-4 py-2 rounded-full text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Main Lightbox Image */}
          <div
            className="w-full h-full flex items-center justify-center p-4"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <div className="relative w-full h-full max-w-5xl max-h-full">
              <Image
                src={images[currentIndex]}
                alt={`${productName} - Fullscreen ${currentIndex + 1}`}
                fill
                className={`object-contain transition-transform duration-200 ${
                  isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                style={
                  isZoomed
                    ? {
                      transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                    }
                    : undefined
                }
                sizes="100vw"
                priority
              />
            </div>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full p-4 transition-all"
                aria-label="Previous Image"
              >
                <ChevronLeft className="w-8 h-8 text-gray-900" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full p-4 transition-all"
                aria-label="Next Image"
              >
                <ChevronRight className="w-8 h-8 text-gray-900" />
              </button>
            </>
          )}

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="absolute bottom-20 left-1/2 translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex
                    ? 'border-white'
                    : 'border-white border-opacity-30 hover:border-opacity-60'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}