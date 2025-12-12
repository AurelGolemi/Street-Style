'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'

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

// Supabase cart item type (stored in database)
interface SupabaseCartItem {
  id: string
  user_id: string
  product_id: string
  product_name: string
  product_brand: string
  price: number
  original_price?: number
  size: string
  color: string
  quantity: number
  image: string
  category: string
  created_at: string
  updated_at: string
}

// Define all cart operations
interface CartState {
  items: CartItem[]
  isLoading: boolean
  isSyncing: boolean
  error: string | null
  userId: string | null

  // Cart operations
  addItem: (item: Omit<CartItem, 'quantity'>) => Promise<void>
  removeItem: (id: string, size: string, color: string) => Promise<void>
  updateQuantity: (id: string, size: string, color: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>

  // Calculations
  getTotalPrice: () => number
  getTotalItems: () => number

  // Sync operations
  initializeCart: (userId: string | null) => Promise<void>
  syncCartToSupabase: () => Promise<void>
  loadCartFromSupabase: (userId: string) => Promise<void>
  clearError: () => void
}

// Create the store with persistence (saves to localStorage for offline support)
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isSyncing: false,
      error: null,
      userId: null,

      // Initialize cart based on user state
      initializeCart: async (userId: string | null) => {
        set({ userId, isLoading: true, error: null })
        try {
          if (userId) {
            // User is logged in - load from Supabase
            await get().loadCartFromSupabase(userId)
          }
          // Otherwise, cart items are already loaded from localStorage by Zustand persist
        } catch (error) {
          console.error('Failed to initialize cart:', error)
          set({ 
            error: 'Failed to load cart. Using local version.',
            isLoading: false 
          })
        }
      },

      // Load cart from Supabase
      loadCartFromSupabase: async (userId: string) => {
        set({ isLoading: true, error: null })
        try {
          const supabase = createClient()
          
          const { data, error } = await supabase
            .from('user_cart')
            .select('*')
            .eq('user_id', userId)

          if (error) throw error

          // Transform Supabase data to CartItem format
          const items: CartItem[] = (data || []).map((item: SupabaseCartItem) => ({
            id: item.product_id,
            name: item.product_name,
            brand: item.product_brand,
            price: item.price,
            originalPrice: item.original_price,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            image: item.image,
            category: item.category,
          }))

          set({ items, isLoading: false })
        } catch (error) {
          console.error('Failed to load cart from Supabase:', error)
          set({ 
            error: 'Failed to load your saved cart',
            isLoading: false 
          })
          throw error
        }
      },

      // Sync local cart to Supabase
      syncCartToSupabase: async () => {
        const { userId, items } = get()
        
        if (!userId) return // Only sync if user is logged in

        set({ isSyncing: true, error: null })
        try {
          const supabase = createClient()

          // Clear existing cart items for this user
          await supabase
            .from('user_cart')
            .delete()
            .eq('user_id', userId)

          // Insert all current items
          if (items.length > 0) {
            const itemsToInsert = items.map((item) => ({
              user_id: userId,
              product_id: item.id,
              product_name: item.name,
              product_brand: item.brand,
              price: item.price,
              original_price: item.originalPrice,
              size: item.size,
              color: item.color,
              quantity: item.quantity,
              image: item.image,
              category: item.category,
            }))

            const { error } = await supabase
              .from('user_cart')
              .insert(itemsToInsert)

            if (error) throw error
          }

          set({ isSyncing: false })
        } catch (error) {
          console.error('Failed to sync cart to Supabase:', error)
          set({ 
            error: 'Failed to save cart changes',
            isSyncing: false 
          })
          throw error
        }
      },

      // Add item to cart
      addItem: async (newItem) => {
        set((state) => {
          // Check if exact item (same product, size, color) exists
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.id === newItem.id &&
              item.size === newItem.size &&
              item.color === newItem.color
          )

          let updatedItems: CartItem[]
          if (existingItemIndex > -1) {
            // Item exists, increase quantity
            updatedItems = [...state.items]
            updatedItems[existingItemIndex].quantity += 1
          } else {
            // New item, add to cart
            updatedItems = [...state.items, { ...newItem, quantity: 1 }]
          }

          return { items: updatedItems }
        })

        // Sync to Supabase if user is logged in
        if (get().userId) {
          try {
            await get().syncCartToSupabase()
          } catch (error) {
            console.error('Error syncing after add:', error)
          }
        }
      },

      // Remove item from cart
      removeItem: async (id, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.id === id && item.size === size && item.color === color)
          ),
        }))

        // Sync to Supabase if user is logged in
        if (get().userId) {
          try {
            await get().syncCartToSupabase()
          } catch (error) {
            console.error('Error syncing after remove:', error)
          }
        }
      },

      // Update item quantity
      updateQuantity: async (id, size, color, quantity) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id && item.size === size && item.color === color
                ? { ...item, quantity: Math.max(0, quantity) }
                : item
            )
            .filter((item) => item.quantity > 0), // Remove items with 0 quantity
        }))

        // Sync to Supabase if user is logged in
        if (get().userId) {
          try {
            await get().syncCartToSupabase()
          } catch (error) {
            console.error('Error syncing after update:', error)
          }
        }
      },

      // Clear entire cart
      clearCart: async () => {
        set({ items: [] })

        // Sync to Supabase if user is logged in
        if (get().userId) {
          try {
            const supabase = createClient()
            await supabase
              .from('user_cart')
              .delete()
              .eq('user_id', get().userId)
          } catch (error) {
            console.error('Error clearing cart in Supabase:', error)
          }
        }
      },

      // Calculate total price
      getTotalPrice: () => {
        const state = get()
        return state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      // Calculate total items
      getTotalItems: () => {
        const state = get()
        return state.items.reduce((total, item) => total + item.quantity, 0)
      },

      // Clear error message
      clearError: () => set({ error: null }),
    }),
    {
      name: 'cart-storage', // localStorage key
      // Only persist items and userId, not loading states
      partialize: (state) => ({
        items: state.items,
        userId: state.userId,
      }),
    }
  )
)