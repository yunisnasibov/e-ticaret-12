"use client"

import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"

export default function CartPage() {
  const { cart, addToCart, removeFromCart, decreaseQuantity, clearCart } = useCart()

  const totalPrice = cart.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Sepetiniz boş</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Sepetinizde henüz ürün bulunmamaktadır.</p>
        <Link href="/">
          <Button>Alışverişe Başla</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Sepetim</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex border rounded-lg p-4 gap-4">
              <div className="relative h-24 w-24 flex-shrink-0">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-contain"
                  sizes="96px"
                />
              </div>

              <div className="flex-grow">
                <Link href={`/product/${item.id}`} className="font-medium hover:underline">
                  {item.title}
                </Link>
                <p className="text-lg font-semibold mt-1">{item.price.toFixed(2)} TL</p>
              </div>

              <div className="flex flex-col items-end justify-between">
                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} aria-label="Ürünü sil">
                  <Trash2 className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => decreaseQuantity(item.id)}
                    disabled={item.quantity <= 1}
                    aria-label="Azalt"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <span className="w-8 text-center">{item.quantity}</span>

                  <Button variant="outline" size="icon" onClick={() => addToCart(item)} aria-label="Artır">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-bold mb-4">Sipariş Özeti</h2>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Ara Toplam</span>
              <span>{totalPrice.toFixed(2)} TL</span>
            </div>
            <div className="flex justify-between">
              <span>Kargo</span>
              <span>Ücretsiz</span>
            </div>
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between font-bold">
              <span>Toplam</span>
              <span className="text-primary">{totalPrice.toFixed(2)} TL</span>
            </div>
          </div>

          <Link href="/checkout" className="w-full">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white">Ödemeye Geç</Button>
          </Link>

          <Button variant="outline" className="w-full mt-2" onClick={clearCart}>
            Sepeti Temizle
          </Button>
        </div>
      </div>
    </div>
  )
}
