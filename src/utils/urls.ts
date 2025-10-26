export const getProductUrl = (id: string): string => {
  if (!id) {
    console.error('getProductUrl: Product ID is required');
    return '/products';
  }
  return `/products/${id}`;
};

export const getCategoryUrl = (category: string): string => {
  if (!category) {
    console.error('getCategoryUrl: Category is required');
    return '/categories';
  }
  return `/categories/${category.toLowerCase()}`;
};

export const getBrandUrl = (brand: string): string => {
  if (!brand) {
    console.error('getBrandUrl: Brand is required');
    return '/brands';
  }
  return `/brands/${brand.toLowerCase()}`;
};

export const getSearchUrl = (query: string): string => {
  if (!query) return '/search';
  return `/search?q=${encodeURIComponent(query)}`;
};

export const getCartUrl = (): string => {
  return '/cart';
};

export const getCheckoutUrl = (): string => {
  return '/checkout';
};

export const getProfileUrl = (section?: string): string => {
  return section ? `/profile/${section}` : '/profile';
};

// Generate static page urls
export const getAboutUrl = (): string => '/about';
export const getContactUrl = (): string => '/contact';
export const getTermsUrl = (): string => '/terms';
export const getPrivacyUrl = (): string => '/privacy';

export const sanitizeProductId = (id: string): string => {
  return id
    .replace(/\.(jpg|jpeg|png|webp|gif|svg)$/i, '') // Remove extensions
    .replace(/[^a-z0-9-_]/gi, '-') // Replace invalid chars with dash
    .toLowerCase();
};