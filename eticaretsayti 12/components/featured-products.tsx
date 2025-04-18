"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/types/product"
import ProductCard from "./product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 saniye timeout

        const response = await fetch("https://fakestoreapi.com/products", {
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`API yanıt hatası: ${response.status}`)
        }

        const data = await response.json()

        // Yeni kategoriler ekle
        const homeProducts = data.slice(0, 10).map((product: Product) => ({
          ...product,
          category: "home",
          id: product.id + 1000,
          title: `Ev üçün ${product.title}`,
        }))

        const giftProducts = data.slice(10, 20).map((product: Product) => ({
          ...product,
          category: "gifts",
          id: product.id + 2000,
          title: `Hədiyyə ${product.title}`,
        }))

        // Tüm ürünleri birleştir
        const allProducts = [...data, ...homeProducts, ...giftProducts]

        setProducts(allProducts)
      } catch (error) {
        console.error("Məhsullar yüklənərkən xəta baş verdi:", error)
        // Hata durumunda boş bir dizi ayarla
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Kategorilere göre ürünleri filtreleme
  const menClothing = products.filter((product) => product.category === "men's clothing")
  const womenClothing = products.filter((product) => product.category === "women's clothing")
  const electronics = products.filter((product) => product.category === "electronics")
  const jewelery = products.filter((product) => product.category === "jewelery")
  const home = products.filter((product) => product.category === "home")
  const gifts = products.filter((product) => product.category === "gifts")

  if (loading) {
    return (
      <div className="py-8">
        <Skeleton className="h-10 w-48 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-28" />
              </div>
            ))}
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">Seçilmiş Məhsullar</h2>

      <Tabs defaultValue="popular" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="popular">Populyar</TabsTrigger>
          <TabsTrigger value="men">Kişi Geyimləri</TabsTrigger>
          <TabsTrigger value="women">Qadın Geyimləri</TabsTrigger>
          <TabsTrigger value="electronics">Elektronika</TabsTrigger>
          <TabsTrigger value="jewelery">Zərgərlik</TabsTrigger>
          <TabsTrigger value="home">Ev & Yaşayış</TabsTrigger>
          <TabsTrigger value="gifts">Hədiyyələr</TabsTrigger>
        </TabsList>

        <TabsContent value="popular" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="men" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {menClothing.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="women" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {womenClothing.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="electronics" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {electronics.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="jewelery" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {jewelery.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="home" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {home.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="gifts" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {gifts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
