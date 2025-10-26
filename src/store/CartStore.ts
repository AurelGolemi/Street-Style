{/* New CartStore.ts */}
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Define what a cart item looks like
export interface CartItem {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  size: string
  color: string
  quantity: number
  image: string
  category: string
}

// Define all cart operations
interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string, size: string, color: string) => void
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

// Create the store with persistence (saves to localStorage)
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          // Check if exact item (same product, size, color) exists
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.id === newItem.id &&
              item.size === newItem.size &&
              item.color === newItem.color
          )

          if (existingItemIndex > -1) {
            // Item exists, increase quantity
            const updatedItems = [...state.items]
            updatedItems[existingItemIndex].quantity += 1
            return { items: updatedItems }
          } else {
            // New item, add to cart
            return {
              items: [...state.items, { ...newItem, quantity: 1 }]
            }
          }
        })
      },

      removeItem: (id, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.id === id && item.size === size && item.color === color)
          )
        }))
      },

      updateQuantity: (id, size, color, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && item.size === size && item.color === color
              ? { ...item, quantity: Math.max(0, quantity) }
              : item
          ).filter(item => item.quantity > 0) // Remove items with 0 quantity
        }))
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        const state = get()
        return state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      getTotalItems: () => {
        const state = get()
        return state.items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage', // localStorage key
    }
  )
)