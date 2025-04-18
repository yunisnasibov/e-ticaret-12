"use client"

import { useFavorites } from "@/context/favorites-context"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import { useCart } from "@/context/cart-context"

export default function FavoritesPage() {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites()
  const { addToCart } = useCart()

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Heart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Favori ürününüz bulunmamaktadır</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Henüz favori ürün eklemediniz.</p>
        <Link href="/">
          <Button>Alışverişe Başla</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Favori Ürünlerim</h1>
        <Button variant="outline" onClick={clearFavorites}>
          Tümünü Temizle
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map((product) => (
          <div key={product.id} className="border rounded-lg overflow-hidden group">
            <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-contain p-4 transition-transform group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>

            <div className="p-4">
              <div className="text-sm text-muted-foreground mb-2">{product.category}</div>
              <Link href={`/product/${product.id}`} className="hover:underline">
                <h3 className="font-medium line-clamp-2 min-h-[48px]">{product.title}</h3>
              </Link>
              <div className="flex items-center justify-between mt-4">
                <div className="font-bold">{product.price.toFixed(2)} TL</div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFromFavorites(product.id)}
                    className="text-red-500"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                  <Button size="sm" onClick={() => addToCart(product)}>
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
