/**
 * URL Helper Utilities
 * File: src/utils/urls.ts
 * 
 * Centralized URL generation to prevent typos and ensure consistency
 * across the application. All route URLs should be generated through
 * these helper functions.
 */

/**
 * Generate product detail page URL
 * @param id - Product ID or slug
 * @returns Product detail page URL
 */
export const getProductUrl = (id: string): string => {
  if (!id) {
    console.error('getProductUrl: Product ID is required');
    return '/products';
  }
  return `/products/${id}`;
};

/**
 * Generate category page URL
 * @param category - Category name or slug
 * @returns Category page URL
 */
export const getCategoryUrl = (category: string): string => {
  if (!category) {
    console.error('getCategoryUrl: Category is required');
    return '/categories';
  }
  return `/categories/${category.toLowerCase()}`;
};

/**
 * Generate brand page URL
 * @param brand - Brand name or slug
 * @returns Brand page URL
 */
export const getBrandUrl = (brand: string): string => {
  if (!brand) {
    console.error('getBrandUrl: Brand is required');
    return '/brands';
  }
  return `/brands/${brand.toLowerCase()}`;
};

/**
 * Generate search results URL
 * @param query - Search query
 * @returns Search results URL
 */
export const getSearchUrl = (query: string): string => {
  if (!query) return '/search';
  return `/search?q=${encodeURIComponent(query)}`;
};

/**
 * Generate cart page URL
 * @returns Cart page URL
 */
export const getCartUrl = (): string => {
  return '/cart';
};

/**
 * Generate checkout page URL
 * @returns Checkout page URL
 */
export const getCheckoutUrl = (): string => {
  return '/checkout';
};

/**
 * Generate user profile URL
 * @param section - Optional profile section (orders, wishlist, etc.)
 * @returns User profile URL
 */
export const getProfileUrl = (section?: string): string => {
  return section ? `/profile/${section}` : '/profile';
};

/**
 * Generate static page URLs
 */
export const getAboutUrl = (): string => '/about';
export const getContactUrl = (): string => '/contact';
export const getTermsUrl = (): string => '/terms';
export const getPrivacyUrl = (): string => '/privacy';

/**
 * Validate and sanitize product ID
 * Removes file extensions and invalid characters
 */
export const sanitizeProductId = (id: string): string => {
  return id
    .replace(/\.(jpg|jpeg|png|webp|gif|svg)$/i, '') // Remove extensions
    .replace(/[^a-z0-9-_]/gi, '-') // Replace invalid chars with dash
    .toLowerCase();
};