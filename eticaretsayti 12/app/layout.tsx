import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { CartProvider } from "@/context/cart-context"
import { FavoritesProvider } from "@/context/favorites-context"
import { OrderProvider } from "@/context/order-context"
import { AuthProvider } from "@/context/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "E-Ticarət Tətbiqi",
  description: "Next.js və Tailwind CSS ilə yaradılmış e-ticarət tətbiqi",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="az">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <OrderProvider>
                <div className="flex min-h-screen flex-col">
                  <Navbar />
                  <div className="flex-1">{children}</div>
                  <footer className="border-t py-6 md:py-0 bg-[#333333] text-white">
                    <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                      <p className="text-sm">
                        &copy; {new Date().getFullYear()} E-Ticarət Tətbiqi. Bütün hüquqlar qorunur.
                      </p>
                    </div>
                  </footer>
                </div>
              </OrderProvider>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
