"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { useFavorites } from "@/context/favorites-context"
import type { Product } from "@/types/product"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, ShoppingCart, Heart } from "lucide-react"
import ProductReviews from "@/components/product-reviews"

export default function ProductDetail() {
  const { id } = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 saniye timeout

        const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`API yanıt hatası: ${response.status}`)
        }

        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error("Ürün yüklenirken hata oluştu:", error)
        // Hata durumunda null olarak ayarla
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="h-[400px] w-full md:w-1/2 rounded-lg" />
          <div className="w-full md:w-1/2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-1/3" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-xl">Ürün bulunamadı.</p>
        <Button variant="link" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Ürünlere Dön
        </Button>
      </div>
    )
  }

  const isProductFavorite = isFavorite(product.id)

  const toggleFavorite = () => {
    if (isProductFavorite) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.push("/")} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Ürünlere Dön
      </Button>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative h-[400px] w-full max-w-[400px]">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 space-y-4">
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="text-2xl font-semibold text-primary">{product.price.toFixed(2)} TL</p>
          <div className="inline-block px-3 py-1 bg-accent/10 dark:bg-accent/20 text-accent dark:text-accent rounded-full text-sm">
            {product.category}
          </div>
          <p className="text-gray-700 dark:text-gray-300">{product.description}</p>

          <div className="pt-4 flex gap-2">
            <Button onClick={() => addToCart(product)} className="bg-primary hover:bg-primary/90 text-white">
              <ShoppingCart className="mr-2 h-4 w-4" /> Sepete Ekle
            </Button>
            <Button variant="outline" onClick={toggleFavorite} className={isProductFavorite ? "text-red-500" : ""}>
              <Heart className={`mr-2 h-4 w-4 ${isProductFavorite ? "fill-current" : ""}`} />
              {isProductFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
            </Button>
          </div>
        </div>
      </div>

      {/* Ürün yorumları bileşeni */}
      <div className="mt-12 w-full">
        <ProductReviews productId={Number(id)} />
      </div>
    </div>
  )
}
