import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  id?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
  brand?: string;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (
    productId: string,
    size?: string,
    color?: string,
    quantity?: number
  ) => void;
  clearCart: () => void;
  clearError: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  syncToServer: () => Promise<void>;
  loadFromServer: () => Promise<void>;
  initializeCart: (userId: string | null) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isSyncing: false,
      error: null,

      addItem: (item: CartItem) => {
        set((state) => {
          // Handle backwards compatibility: extract productId from id if not provided
          let productId = item.productId;
          if (!productId && item.id) {
            productId = item.id.split("-")[0];
          }
          if (!productId) {
            console.warn("Item added without productId:", item);
            return state;
          }

          const itemToAdd: CartItem = {
            ...item,
            productId: productId as string,
            quantity: item.quantity || 1,
          };

          console.log("Adding item to cart:", itemToAdd);

          const existingItem = state.items.find(
            (i) =>
              i.productId === productId &&
              i.size === item.size &&
              i.color === item.color
          );
          if (existingItem) {
            console.log("Item already in cart, updating quantity");
            return {
              items: state.items.map((i) =>
                i.productId === productId &&
                i.size === item.size &&
                i.color === item.color
                  ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                  : i
              ) as CartItem[],
            };
          }
          return {
            items: [...state.items, itemToAdd],
          };
        });
        get().syncToServer();
      },

      removeItem: (productId: string, size?: string, color?: string) => {
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(
                i.productId === productId &&
                i.size === size &&
                i.color === color
              )
          ),
        }));
        get().syncToServer();
      },

      updateQuantity: (
        productId: string,
        size?: string,
        color?: string,
        quantity?: number
      ) => {
        if (quantity === undefined || quantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.size === size && i.color === color
              ? { ...i, quantity }
              : i
          ),
        }));
        get().syncToServer();
      },

      clearCart: () => {
        set({ items: [] });
        get().syncToServer();
      },

      clearError: () => {
        set({ error: null });
      },

      getTotalPrice: () => {
        const total = get().items.reduce((total, item) => {
          const itemTotal = item.price * item.quantity;
          console.log(
            `Item ${item.productId}: €${item.price} × ${item.quantity} = €${itemTotal}`
          );
          return total + itemTotal;
        }, 0);
        console.log("Cart total:", total);
        return total;
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      syncToServer: async () => {
        try {
          set({ isSyncing: true });
          const items = get().items;
          const response = await fetch("/api/cart/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ items }),
          });
          if (!response.ok) {
            // Log 401 so debugging is easier
            if (response.status === 401) {
              console.log(
                "[Cart Sync] syncToServer returned 401 - not authenticated"
              );
            } else {
              console.error("Failed to sync cart:", response.statusText);
              set({ error: "Failed to sync cart" });
            }
          } else {
            set({ error: null });
          }
        } catch (error) {
          console.error("Failed to sync cart:", error);
          set({ error: "Failed to sync cart" });
        } finally {
          set({ isSyncing: false });
        }
      },

      // inside useCartStore: replace loadFromServer implementation with:

      loadFromServer: async () => {
        try {
          set({ isLoading: true });
          let response = await fetch("/api/cart/sync", {
            credentials: "include",
          });

          // If unauthenticated, retry once briefly in case the cookie is still being set
          if (response.status === 401) {
            console.log("[Cart] loadFromServer received 401 - retrying once");
            await new Promise((r) => setTimeout(r, 250));
            response = await fetch("/api/cart/sync", {
              credentials: "include",
            });
          }

          if (response.ok) {
            const { items: serverItems = [] } = await response.json();
            const localItems = get().items || [];

            // Merge strategy: key by productId + size + color and sum quantities
            const keyOf = (i: CartItem) =>
              `${i.productId}::${i.size ?? ""}::${i.color ?? ""}`;

            const map = new Map<string, CartItem>();

            const put = (it: CartItem) => {
              const key = keyOf(it);
              if (!map.has(key)) {
                map.set(key, { ...it });
              } else {
                const existing = map.get(key)!;
                map.set(key, {
                  ...existing,
                  quantity: existing.quantity + (it.quantity || 0),
                  // prefer existing metadata but fall back to new fields
                  name: existing.name || it.name,
                  price: existing.price || it.price,
                  image: existing.image || it.image,
                  brand: existing.brand || it.brand,
                });
              }
            };

            serverItems.forEach(put);
            localItems.forEach(put);

            const merged = Array.from(map.values());

            set({ items: merged });

            // If server didn't already have the merged result, push it back
            const serverJson = JSON.stringify(serverItems || []);
            const mergedJson = JSON.stringify(merged || []);
            if (serverJson !== mergedJson) {
              // ensures server has the merged view across devices
              await get().syncToServer();
            }
          } else if (response.status !== 401) {
            console.error("Failed to load cart:", response.statusText);
            set({ error: "Failed to load cart" });
          } else {
            // if still 401, keep local cart intact and log for debugging
            console.log(
              "[Cart] loadFromServer aborted due to unauthenticated (401)"
            );
          }
        } catch (error) {
          console.error("Failed to load cart:", error);
          set({ error: "Failed to load cart" });
        } finally {
          set({ isLoading: false });
        }
      },

      initializeCart: (userId: string | null) => {
        if (userId) {
          console.log(
            "[Cart] initializeCart: user logged in, loading from server",
            userId
          );
          get().loadFromServer();
        } else {
          // Do not clear local guest cart on transient unauthenticated checks.
          // Clearing should happen only on explicit sign-out via `clearCart`.
          console.log(
            "[Cart] initializeCart: no userId provided, keeping local cart intact"
          );
        }
      },
    }),
    {
      name: "cart-store",
      version: 1,
    }
  )
);
