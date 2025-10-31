'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { section } from 'framer-motion/client';
import Link from 'next/link'

// TypeScript Interface: Ensures type safety and makes the component reusable
interface Slide {
  id: number;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
  overlayOpacity?: number;
}

// Component Props Interface - Defines what props the component accepts
interface HeroSlideshowProps {
  slides: Slide[];
  autoPlayInterval?: number;
  className?: string;
}

const HeroSlideshow: React.FC<HeroSlideshowProps> = ({
  slides,
  autoPlayInterval = 5000,
  className = ''
}) => {
  // State Management
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  // Navigate to specific slide
  const goToSlide = useCallback((index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 'next' : 'prev');
    setCurrentIndex(index);
  }, [currentIndex]);

  // Navigate to next slide
  const nextSlide = useCallback(() => {
    setDirection('next');
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  // Navigate to previous slide
  const prevSlide = useCallback(() => {
    setDirection('prev');
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-advande Effect - Runs whenever autoPlayInterval, isAutoPlaying or isPaused changes
  useEffect(() => {
    if (!isAutoPlaying || isPaused) return;

    const interval = setInterval(nextSlide, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlayInterval, isAutoPlaying, isPaused, nextSlide]);

  // Keyboard Navigation Effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch/Swipe Support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  // Render the slideshow
  return (
    <section
      className={`relative w-full h-screen overflow-hidden bg-gray-900 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-label="Hero Slideshow"
      role="region"
    >
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          const isPrev = index === currentIndex - 1 || (currentIndex === 0 && index === slides.length - 1);
          const isNext = index === currentIndex + 1 || (currentIndex === slides.length - 1 && index === 0);

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${isActive
                ? 'opacity-100 z-10 scale-100'
                : 'opacity-0 z-0 scale-105'
                }`}
              aria-hidden={!isActive}
            >
              {/* Background Image with Parallax Effect */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
                style={{
                  backgroundImage: `url(${slide.backgroundImage})`,
                  transform: isActive ? 'scale(1)' : 'scale(1.1)'
                }}
              />

              {/* Gradient Overlay for text readability */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"
                style={{
                  opacity: (slide.overlayOpacity ?? 60) / 100
                }}
              />
              
              {/* Content Container */}
              <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                  <div className="max-w-2xl">
                    {/* Animated Title */}
                    <h1
                      className={`text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 transition-all duration-700 delay-100 ${isActive
                        ? 'translate-y-0 opacity-100'
                        : direction === 'next'
                          ? 'translate-y-8 opacity-0'
                          : '-translate-y-8 opacity-0'
                        }`}
                    >
                      {slide.title}
                    </h1>

                    {/* Animated Description */}
                    <p
                      className={`text-lg sm:text-xl lg:text-2xl text-gray-200 mb-4 sm:mb-8 transition-all duration-700 delay-200 ${isActive
                        ? 'translate-y-0 opacity-100'
                        : direction === 'next'
                          ? 'translate-y-8 opacity-0'
                          : '-translate-y-8 opacity-0'
                        }`}
                    >
                      {slide.description}
                    </p>

                    {/* CTA Button with Hover Effects */}
                    <Link
                      href={slide.ctaLink}
                      className={`inline-block bg-white text-gray-900 px-8 py-3 sm:px-10 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl ${isActive
                        ? 'translate-y-0 opacity-100 delay-300'
                        : direction === 'next'
                          ? 'translate-y-8 opacity-0'
                          : '-translate-y-8 opacity-0'
                        }`}
                      tabIndex={isActive ? 0 : -1}
                    >
                      {slide.ctaText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>
      
      {/* Play/Pause Button */}
      <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute bottom-24 sm:bottom-28 right-4 sm:right-8 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
        aria-label={isAutoPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
      >
        {isAutoPlaying ? (
          <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" />
        )}
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer ${index === currentIndex
              ? 'w-8 sm:w-12 h-2 sm:h-3 bg-white'
              : 'w-2 sm:h-3 h-2 bg-white/40 hover:bg-white/60'
              }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex}
          />
        ))}
      </div>

      {/* Progress Bar (shows auto-advance progress) */}
      {isAutoPlaying && !isPaused && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
          <div
            className="h-full bg-white transition-all ease-linear"
            style={{
              width: '100%',
              animation: `slideProgress ${autoPlayInterval}ms linear`
            }}
          />
        </div>
      )}

      {/* CSS Animation for Progress Bar */}
      <style jsx>{`
        @keyframes slideProgress {
        from { width: 0%; }
        to { width: 100%; }
        }
      `}</style>
    </section>
  );

};

// Wrapper that provides sample slides and exports the default component
const Hero = () => {
  const slidesData: Slide[] = [
    {
      id: 1,
      title: "Black Deals",
      description: "Now Available, featuring multiple brands",
      ctaText: "Shop Now",
      ctaLink: "/sales",
      backgroundImage: '/slideshow-image/black-deals.jpg',
      overlayOpacity: 60
    },
    {
      id: 2,
      title: "Nike Shox Ride 2 Coming Soon",
      description: "Coming soon to Street Style",
      ctaText: "Shop Now",
      ctaLink: "/products/nike-shox-ride-2",
      backgroundImage: '/slideshow-image/street-style.jpg',
      overlayOpacity: 60
    },
  ];

  return (
    <div className="min-h-screen">
      <HeroSlideshow
        slides={slidesData}
        autoPlayInterval={5000}
      />
    </div>
  )
};

export default Hero;


// Old Hero Section
// export default function Hero() {
//   return (
//     <section className="section-padding bg-gradient-to-r from-gray-100 to-gray-200 ">
//       <div className="max-w-7xl mx-auto text-center text-gray-900">
//         <h1 className="text-4xl md:text-6xl font-bold mb-6">
//           Your Product Name
//         </h1>
//         <p className="text-xl mb-8 max-w-2xl mx-auto">
//           Brief description of your amazing Product
//         </p>
//         <button className="btn-primary bg-white  hover:bg-gray-100 p-1 cursor-pointer">
//           Get Started
//         </button>
//       </div>
//     </section>
//   )
// }
