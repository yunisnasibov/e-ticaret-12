"use client"

import { useOrders } from "@/context/order-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShoppingBag, ChevronRight } from "lucide-react"
import { formatDate } from "@/utils/format-date"

export default function OrdersPage() {
  const { orders } = useOrders()

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Henüz siparişiniz bulunmamaktadır</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Alışveriş yaparak sipariş geçmişinizi oluşturabilirsiniz.
        </p>
        <Link href="/">
          <Button>Alışverişe Başla</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Sipariş Geçmişim</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{order.id}</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : order.status === "cancelled"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
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
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(order.date)} - {order.items.length} ürün
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="font-bold">{order.totalAmount.toFixed(2)} TL</div>
                <Link href={`/orders/${order.id}`}>
                  <Button variant="ghost" size="sm">
                    Detaylar <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Teslimat Adresi</h3>
                <p className="text-sm">{order.shippingAddress.fullName}</p>
                <p className="text-sm">{order.shippingAddress.address}</p>
                <p className="text-sm">
                  {order.shippingAddress.postalCode}, {order.shippingAddress.city}, {order.shippingAddress.country}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Ödeme Yöntemi</h3>
                <p className="text-sm">{order.paymentMethod}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
