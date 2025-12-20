"use client";

import CartSidebar from "@/components/cart/CartSidebar";
import Footer from "@/components/layout/Footer";
import HeaderWrapper from "@/components/layout/HeaderWrapper";
import { AuthProvider } from "@/contexts/AuthContext";
import { Analytics } from "@vercel/analytics/next";
import { Inter } from "next/font/google";
import { useState } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme Script runs before any renders */}
        <Analytics />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <div className="min-h-screen bg-white transition-colors duration-300">
            <HeaderWrapper onCartClick={() => setIsCartOpen(true)} />

            <main className="min-h-screen bg-white">{children}</main>

            <Footer />

            <CartSidebar
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
            />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
