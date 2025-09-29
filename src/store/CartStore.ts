import { create } from 'zustand'

// Define what a cart item looks like
interface CartItem {
  id: string
  name: string
  brand: string
  price: number
  size: string
  color: string
  quantity: number
  image: string
}

// Define what the cart can do
interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

// Create the store
export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (newItem) => set((state) => {
    // Check if item already exists in cart
    const existingItem = state.items.find(
      item => item.id === newItem.id && 
              item.size === newItem.size && 
              item.color === newItem.color
    )

    if (existingItem) {
      // If exists, increase quantity
      return {
        items: state.items.map(item =>
          item.id === newItem.id &&
          item.size === newItem.size &&
          item.color === newItem.color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
    } else {
      // If new, add to cart
      return {
        items: [...state.items, { ...newItem, quantity: 1 }]
      }
    }
  }),

  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),

  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map(item =>
      item.id === id ? { ...item, quantity } : item
    )
  })),

  clearCart: () => set({ items: [] }),

  getTotalPrice: () => {
    const state = get()
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  },

  getTotalItems: () => {
    const state = get()
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }
}))