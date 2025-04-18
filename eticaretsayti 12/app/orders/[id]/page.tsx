"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useOrders, type Order } from "@/context/order-context"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from "lucide-react"
import { formatDate } from "@/utils/format-date"

export default function OrderDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { getOrderById } = useOrders()
  const [order, setOrder] = useState<Order | undefined>(undefined)

  useEffect(() => {
    if (typeof id === "string") {
      const foundOrder = getOrderById(id)
      if (foundOrder) {
        setOrder(foundOrder)
      }
    }
  }, [id, getOrderById])

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-xl">Sipariş bulunamadı.</p>
        <Button variant="link" onClick={() => router.push("/orders")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Siparişlere Dön
        </Button>
      </div>
    )
  }

  const getStatusIcon = () => {
    switch (order.status) {
      case "pending":
        return <Clock className="h-6 w-6 text-yellow-500" />
      case "processing":
        return <Package className="h-6 w-6 text-blue-500" />
      case "shipped":
        return <Truck className="h-6 w-6 text-purple-500" />
      case "delivered":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      default:
        return <Clock className="h-6 w-6 text-red-500" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.push("/orders")} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Siparişlere Dön
      </Button>

      <div className="grid gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold">Sipariş #{order.id}</h1>
            <p className="text-gray-500 dark:text-gray-400">{formatDate(order.date)}</p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span
              className={`px-3 py-1 rounded-full ${
                order.status === "delivered"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : order.status === "cancelled"
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    : order.status === "shipped"
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                      : order.status === "processing"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              }`}
            >
              {order.status === "pending"
                ? "Beklemede"
                : order.status === "processing"
                  ? "İşleniyor"
                  : order.status === "shipped"
                    ? "Kargoya Verildi"
                    : order.status === "delivered"
                      ? "Teslim Edildi"
                      : "İptal Edildi"}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Sipariş Öğeleri</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex border rounded-lg p-4 gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <Image
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.title}
                      fill
                      className="object-contain"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-grow">
                    <Link href={`/product/${item.product.id}`} className="font-medium hover:underline">
                      {item.product.title}
                    </Link>
                    <div className="flex justify-between mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Adet: {item.quantity}</span>
                      <span className="font-semibold">{(item.product.price * item.quantity).toFixed(2)} TL</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Sipariş Özeti</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Ara Toplam</span>
                  <span>{order.totalAmount.toFixed(2)} TL</span>
                </div>
                <div className="flex justify-between">
                  <span>Kargo</span>
                  <span>Ücretsiz</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Toplam</span>
                    <span>{order.totalAmount.toFixed(2)} TL</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Teslimat Bilgileri</h2>
              <div className="space-y-2">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.postalCode}, {order.shippingAddress.city}, {order.shippingAddress.country}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Ödeme Bilgileri</h2>
              <p>{order.paymentMethod}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
