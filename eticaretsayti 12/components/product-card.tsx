"use client"

import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/types/product"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Eye, ShoppingCart, Heart } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useFavorites } from "@/context/favorites-context"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()

  const isProductFavorite = isFavorite(product.id)

  const toggleFavorite = () => {
    if (isProductFavorite) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product)
    }
  }

  return (
    <Card className="overflow-hidden group">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          fill
          className="object-contain p-4 transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 bg-black/20 backdrop-blur-sm">
          <Button size="sm" variant="secondary" asChild>
            <Link href={`/product/${product.id}`}>
              <Eye className="mr-2 h-4 w-4" /> Ətraflı
            </Link>
          </Button>
          <Button size="sm" onClick={() => addToCart(product)} className="bg-primary hover:bg-primary/90 text-white">
            <ShoppingCart className="mr-2 h-4 w-4" /> Səbətə Əlavə Et
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground mb-2">{product.category}</div>
        <Link href={`/product/${product.id}`} className="hover:underline">
          <h3 className="font-medium line-clamp-2 min-h-[48px]">{product.title}</h3>
        </Link>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="font-bold text-primary">{product.price.toFixed(2)} ₼</div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleFavorite}
            className={isProductFavorite ? "text-red-500" : "text-accent hover:text-accent/90"}
          >
            <Heart className={`h-4 w-4 ${isProductFavorite ? "fill-current" : ""}`} />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => addToCart(product)}>
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
