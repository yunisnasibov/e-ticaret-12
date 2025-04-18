"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Product } from "@/types/product"

export interface OrderItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  items: OrderItem[]
  totalAmount: number
  date: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: {
    fullName: string
    address: string
    city: string
    postalCode: string
    country: string
  }
  paymentMethod: string
}

interface OrderContextType {
  orders: Order[]
  addOrder: (order: Omit<Order, "id" | "date">) => void
  getOrderById: (id: string) => Order | undefined
}

const OrderContext = createContext<OrderContextType>({
  orders: [],
  addOrder: () => {},
  getOrderById: () => undefined,
})

export const useOrders = () => useContext(OrderContext)

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])

  // LocalStorage'dan siparişleri yükle
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedOrders = localStorage.getItem("orders")
      if (savedOrders) {
        try {
          setOrders(JSON.parse(savedOrders))
        } catch (error) {
          console.error("Siparişler yüklenirken hata oluştu:", error)
        }
      }
    }
  }, [])

  // Siparişler güncellendiğinde LocalStorage'a kaydet
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("orders", JSON.stringify(orders))
    }
  }, [orders])

  const addOrder = (order: Omit<Order, "id" | "date">) => {
    const newOrder: Order = {
      ...order,
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
    }

    setOrders((prevOrders) => [newOrder, ...prevOrders])
  }

  const getOrderById = (id: string) => {
    return orders.find((order) => order.id === id)
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}
