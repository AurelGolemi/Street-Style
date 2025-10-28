'use client'

import { useState } from 'react'
import { Inter } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartSidebar from '@/components/cart/CartSidebar'
import { Analytics } from "@vercel/analytics/next"
import './globals.css'

const inter = Inter({ subsets: ['latin']})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
  }) {
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme Script runs before any renders */}
        <Analytics />
      </head>
      <body className={inter.className} suppressHydrationWarning>
          <div className="min-h-screen bg-white transition-colors duration-300">
            <Header onCartClick={() => setIsCartOpen(true)} />

          <main className="min-h-screen bg-white">
              {children}
          </main>

          <Footer />

        <CartSidebar
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          />
          </div>
      </body>
    </html>
  )
}