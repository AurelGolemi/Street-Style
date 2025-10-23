/**
 * Analytics Helper Functions
 *
 * Centralizes all analytics tracking for consistency and maintainability.
 * Supports multiple analytics platforms:
 * - Google Analytics 4 (GA4)
 * - Facebook Pixel
 * - TikTok Pixel
 * - Custom events
 *
 * Usage:
 * import { trackProductView, trackAddToCart } from '@/lib/analytics'
 *
 * Key Metrics to Track:
 * 1. Product Views - Which products are popular
 * 2. Add to Cart - Conversion funnel entry
 * 3. Remove from Cart - Hesitation signals
 * 4. Purchases - Revenue tracking
 * 5. Time on Page - Engagement
 * 6. Image Gallery Usage - Interest indicators
 */

// declare global {
//   interface Window {
//     gtag?: (...args: any[]) => void;
//     fbq?: (...args: any[]) => void;
//     ttq?: {
//       track: (event: string, data?: any) => void;
//     };
//     dataLayer?: any[];
//   }
// }

// /**
//  * Track Product Page View
//  *
//  * Called when user lands on product detail page
//  * Important for: Remarketing, Popular Products, Funnel Analysis
//  */
// export function trackProductView(product: {
//   id: string;
//   name: string;
//   brand: string;
//   category: string;
//   price: number;
//   currency: string;
// }) {
//   // Google Analytics 4
//   if (typeof window !== "undefined" && window.gtag) {
//     window.gtag("event", "view_item", {
//       currency: product.currency,
//       value: product.price,
//       items: [
//         {
//           item_id: product.id,
//           item_name: product.name,
//           item_brand: product.brand,
//           item_category: product.category,
//           price: product.price,
//         },
//       ],
//     });
//   }

//   // Facebook Pixel
//   if (typeof window !== "undefined" && window.fbq) {
//     window.fbq("track", "ViewContent", {
//       content_ids: [product.id],
//       content_name: product.name,
//       content_type: "product",
//       value: product.price,
//       currency: product.currency,
//     });
//   }

//   // TikTok Pixel
//   if (typeof window !== "undefined" && window.ttq) {
//     window.ttq.track("ViewContent", {
//       content_id: product.id,
//       content_name: product.name,
//       content_type: "product",
//       value: product.price,
//       currency: product.currency,
//     });
//   }

//   // Custom tracking (your backend)
//   sendCustomEvent("product_view", {
//     product_id: product.id,
//     timestamp: new Date().toISOString(),
//   });
// }

// /**
//  * Track Add to Cart
//  *
//  * Critical conversion funnel metric
//  */
// export function trackAddToCart(product: {
//   id: string;
//   name: string;
//   brand: string;
//   price: number;
//   currency: string;
//   quantity: number;
//   size?: string;
//   color?: string;
// }) {
//   // Google Analytics 4
//   if (typeof window !== "undefined" && window.gtag) {
//     window.gtag("event", "add_to_cart", {
//       currency: product.currency,
//       value: product.price * product.quantity,
//       items: [
//         {
//           item_id: product.id,
//           item_name: product.name,
//           item_brand: product.brand,
//           price: product.price,
//           quantity: product.quantity,
//           item_variant:
//             [product.size, product.color].filter(Boolean).join(" / ") ||
//             undefined,
//         },
//       ],
//     });
//   }

//   // Facebook Pixel
//   if (typeof window !== "undefined" && window.fbq) {
//     window.fbq("track", "AddToCart", {
//       content_ids: [product.id],
//       content_name: product.name,
//       content_type: "product",
//       value: product.price * product.quantity,
//       currency: product.currency,
//     });
//   }

//   // TikTok Pixel
//   if (typeof window !== "undefined" && window.ttq) {
//     window.ttq.track("AddToCart", {
//       content_id: product.id,
//       content_name: product.name,
//       value: product.price * product.quantity,
//       currency: product.currency,
//       quantity: product.quantity,
//     });
//   }

//   sendCustomEvent("add_to_cart", {
//     product_id: product.id,
//     variant:
//       [product.size, product.color].filter(Boolean).join(" / ") || undefined,
//     quantity: product.quantity,
//   });
// }

// /**
//  * Track Size Selection
//  *
//  * Helps understand popular sizes for inventory management
//  */
// export function trackSizeSelection(productId: string, size: string) {
//   sendCustomEvent("size_selected", {
//     product_id: productId,
//     size: size,
//   });
// }

// /**
//  * Track Color Selection
//  *
//  * Identifies popular colorways
//  */
// export function trackColorSelection(productId: string, color: string) {
//   sendCustomEvent("color_selected", {
//     product_id: productId,
//     color: color,
//   });
// }

// /**
//  * Track Image Gallery Interaction
//  *
//  * High engagement signal - user is seriously interested
//  */
// export function trackImageGalleryClick(productId: string, imageIndex: number) {
//   sendCustomEvent("image_gallery_interaction", {
//     product_id: productId,
//     image_index: imageIndex,
//   });
// }

// /**
//  * Track Tab Change
//  *
//  * Understand what information users seek
//  */
// export function trackTabChange(productId: string, tab: string) {
//   sendCustomEvent("product_tab_view", {
//     product_id: productId,
//     tab: tab,
//   });
// }

// /**
//  * Track Wishlist Add
//  *
//  * Intent signal - user interested but not ready to buy
//  */
// export function trackWishlistAdd(productId: string) {
//   if (typeof window !== "undefined" && window.gtag) {
//     window.gtag("event", "add_to_wishlist", {
//       items: [{ item_id: productId }],
//     });
//   }

//   if (typeof window !== "undefined" && window.fbq) {
//     window.fbq("track", "AddToWishlist", {
//       content_ids: [productId],
//     });
//   }

//   sendCustomEvent("wishlist_add", { product_id: productId });
// }

// /**
//  * Track Social Share
//  *
//  * Organic marketing opportunity
//  */
// export function trackShare(productId: string, method: string) {
//   if (typeof window !== "undefined" && window.gtag) {
//     window.gtag("event", "share", {
//       method: method,
//       content_type: "product",
//       item_id: productId,
//     });
//   }

//   sendCustomEvent("product_share", {
//     product_id: productId,
//     method: method,
//   });
// }

// /**
//  * Send Custom Event to Backend
//  *
//  * For your own analytics database
//  */
// async function sendCustomEvent(eventName: string, data: any) {
//   if (typeof window === "undefined") return;

//   try {
//     // In production, send to your analytics API
//     await fetch("/api/analytics", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         event: eventName,
//         data: data,
//         timestamp: new Date().toISOString(),
//         url: window.location.href,
//         userAgent: navigator.userAgent,
//       }),
//     });
//   } catch (error) {
//     console.error("Analytics error:", error);
//   }
// }

// /**
//  * Initialize Analytics
//  *
//  * Call this in your root layout
//  */
// export function initializeAnalytics() {
//   // Google Analytics 4 - Add your measurement ID
//   if (typeof window !== "undefined") {
//     const script = document.createElement("script");
//     script.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX";
//     script.async = true;
//     document.head.appendChild(script);

//     window.gtag = function (...args: any[]) {
      
//       window.dataLayer = window.dataLayer || [];
      
//       window.dataLayer.push(args);
//     };
//     window.gtag("js", new Date());
//     window.gtag("config", "G-XXXXXXXXXX");
//   }
// }
