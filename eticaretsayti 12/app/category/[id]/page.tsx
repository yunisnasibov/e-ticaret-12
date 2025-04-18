"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import type { Product } from "@/types/product"
import ProductCard from "@/components/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CategoryPage() {
  const { id } = useParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("default")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)

        // Özel kategoriler için
        if (id === "home" || id === "gifts") {
          // Önce tüm ürünleri çek
          const response = await fetch("https://fakestoreapi.com/products", {
            signal: AbortSignal.timeout(10000), // 10 saniye timeout ekle
          })

          if (!response.ok) {
            throw new Error(`API yanıt hatası: ${response.status}`)
          }

          const allProducts = await response.json()

          // Özel kategoriler için ürünleri oluştur
          if (id === "home") {
            const homeProducts = allProducts.slice(0, 10).map((product: Product) => ({
              ...product,
              category: "home",
              id: product.id + 1000,
              title: `Ev için ${product.title}`,
            }))
            setProducts(homeProducts)
          } else if (id === "gifts") {
            const giftProducts = allProducts.slice(10, 20).map((product: Product) => ({
              ...product,
              category: "gifts",
              id: product.id + 2000,
              title: `Hediye ${product.title}`,
            }))
            setProducts(giftProducts)
          }
        } else {
          // Normal kategoriler için API'den veri çek
          const response = await fetch(`https://fakestoreapi.com/products/category/${id}`, {
            signal: AbortSignal.timeout(10000), // 10 saniye timeout ekle
          })

          if (!response.ok) {
            throw new Error(`API yanıt hatası: ${response.status}`)
          }

          const data = await response.json()
          setProducts(data)
        }
      } catch (error) {
        console.error("Ürünler yüklenirken hata oluştu:", error)
        // Hata durumunda boş bir dizi ayarla
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProducts()
    }
  }, [id])

  // Ürünleri sırala
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-asc") {
      return a.price - b.price
    } else if (sortBy === "price-desc") {
      return b.price - a.price
    } else if (sortBy === "name-asc") {
      return a.title.localeCompare(b.title)
    } else if (sortBy === "name-desc") {
      return b.title.localeCompare(a.title)
    }
    return 0
  })

  const formatCategoryName = (category: string) => {
    if (category === "home") return "Ev & Yaşam"
    if (category === "gifts") return "Hediyeler"

    return category
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-48 mb-6" />
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
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
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" /> Tüm Kategoriler
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-6">{formatCategoryName(id as string)}</h1>

      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">{products.length} ürün bulundu</p>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sıralama" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Varsayılan</SelectItem>
            <SelectItem value="price-asc">Fiyat (Artan)</SelectItem>
            <SelectItem value="price-desc">Fiyat (Azalan)</SelectItem>
            <SelectItem value="name-asc">İsim (A-Z)</SelectItem>
            <SelectItem value="name-desc">İsim (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500 dark:text-gray-400">Bu kategoride ürün bulunamadı.</p>
          <Button variant="link" asChild>
            <Link href="/">Tüm ürünleri görüntüle</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
