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
            // Only show error if not a 401 (unauthenticated)
            if (response.status !== 401) {
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

      loadFromServer: async () => {
        try {
          set({ isLoading: true });
          const response = await fetch("/api/cart/sync", {
            credentials: "include",
          });
          if (response.ok) {
            const { items } = await response.json();
            set({ items });
          } else if (response.status !== 401) {
            console.error("Failed to load cart:", response.statusText);
            set({ error: "Failed to load cart" });
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
          get().loadFromServer();
        } else {
          set({ items: [] });
        }
      },
    }),
    {
      name: "cart-store",
      version: 1,
    }
  )
);
