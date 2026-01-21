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
  hasLoadedFromServer: boolean;
  lastSyncTimestamp: number;
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
      hasLoadedFromServer: false,
      lastSyncTimestamp: 0,

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
  // Prevent concurrent loads
  const state = get();
  if (state.isLoading) {
    console.log('[Cart] loadFromServer already in progress, skipping');
    return;
  }

  try {
    set({ isLoading: true, error: null });
    
    let response = await fetch("/api/cart/sync", {
      credentials: "include",
    });

    // Retry once on 401
    if (response.status === 401) {
      console.log("[Cart] loadFromServer received 401 - retrying once");
      await new Promise((r) => setTimeout(r, 250));
      response = await fetch("/api/cart/sync", {
        credentials: "include",
      });
    }

    if (response.ok) {
      const { items: serverItems = [] } = await response.json();
      
      // CRITICAL FIX: Only merge if we haven't loaded from server yet
      // Otherwise, just use server items as source of truth
      if (!state.hasLoadedFromServer) {
        const localItems = state.items || [];
        
        // Only merge if we actually have local items
        if (localItems.length > 0) {
          console.log('[Cart] First load: merging local + server carts');
          const merged = mergeCartItems(serverItems, localItems);
          set({ 
            items: merged, 
            hasLoadedFromServer: true,
            lastSyncTimestamp: Date.now()
          });
          
          // Sync merged result back to server
          await get().syncToServer();
        } else {
          // No local items, just use server items
          console.log('[Cart] First load: using server cart (no local items)');
          set({ 
            items: serverItems, 
            hasLoadedFromServer: true,
            lastSyncTimestamp: Date.now()
          });
        }
      } else {
        // Subsequent loads: server is source of truth
        console.log('[Cart] Subsequent load: using server as source of truth');
        set({ 
          items: serverItems,
          lastSyncTimestamp: Date.now()
        });
      }
      
      set({ error: null });
    } else if (response.status !== 401) {
      console.error("Failed to load cart:", response.statusText);
      set({ error: "Failed to load cart" });
    } else {
      console.log("[Cart] loadFromServer aborted (401 - not authenticated)");
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
export function mergeCartItems(serverItems: CartItem[], localItems: CartItem[]): CartItem[] {
  const merged = new Map<string, CartItem>();

  // Add server items first
  serverItems.forEach((item) => {
    const key = `${item.productId}-${item.size || ''}-${item.color || ''}`;
    merged.set(key, item);
  });

  // Merge local items, preferring local quantities for existing items
  localItems.forEach((item) => {
    const key = `${item.productId}-${item.size || ''}-${item.color || ''}`;
    if (merged.has(key)) {
      // Item exists on server: keep server data but use local quantity
      const serverItem = merged.get(key)!;
      merged.set(key, { ...serverItem, quantity: item.quantity });
    } else {
      // New local item: add it
      merged.set(key, item);
    }
  });

  return Array.from(merged.values());
}

