"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { useOrders } from "@/context/order-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, CreditCard, Landmark, Truck } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const { addOrder } = useOrders()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Türkiye",
    paymentMethod: "credit-card",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvc: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentMethodChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Form doğrulama
    if (!formData.fullName || !formData.address || !formData.city || !formData.postalCode) {
      toast({
        title: "Hata",
        description: "Lütfen tüm alanları doldurun",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    if (formData.paymentMethod === "credit-card") {
      if (!formData.cardNumber || !formData.cardName || !formData.cardExpiry || !formData.cardCvc) {
        toast({
          title: "Hata",
          description: "Lütfen tüm kart bilgilerini doldurun",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }
    }

    // Sipariş oluştur
    const order = {
      items: cart.map((item) => ({
        product: item,
        quantity: item.quantity,
      })),
      totalAmount,
      status: "pending" as const,
      shippingAddress: {
        fullName: formData.fullName,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      },
      paymentMethod:
        formData.paymentMethod === "credit-card"
          ? `Kredi Kartı (${formData.cardNumber.slice(-4)})`
          : formData.paymentMethod === "bank-transfer"
            ? "Banka Havalesi"
            : "Kapıda Ödeme",
    }

    // Siparişi kaydet
    setTimeout(() => {
      addOrder(order)
      clearCart()

      toast({
        title: "Başarılı",
        description: "Siparişiniz başarıyla oluşturuldu",
      })

      // Sipariş sayfasına yönlendir
      router.push("/orders")
      setIsSubmitting(false)
    }, 1500)
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-xl">Sepetinizde ürün bulunmamaktadır.</p>
        <Link href="/cart">
          <Button variant="link">
            <ArrowLeft className="mr-2 h-4 w-4" /> Sepete Dön
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/cart">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Sepete Dön
        </Button>
      </Link>

      <h1 className="text-3xl font-bold mb-6">Ödeme</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Truck className="mr-2 h-5 w-5" /> Teslimat Bilgileri
              </h2>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="fullName">Ad Soyad</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Adres</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Şehir</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Posta Kodu</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="country">Ülke</Label>
                  <Input id="country" name="country" value={formData.country} onChange={handleInputChange} required />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CreditCard className="mr-2 h-5 w-5" /> Ödeme Yöntemi
              </h2>
              <RadioGroup value={formData.paymentMethod} onValueChange={handlePaymentMethodChange} className="mb-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card">Kredi Kartı</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                  <Label htmlFor="bank-transfer">Banka Havalesi</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash-on-delivery" id="cash-on-delivery" />
                  <Label htmlFor="cash-on-delivery">Kapıda Ödeme</Label>
                </div>
              </RadioGroup>

              {formData.paymentMethod === "credit-card" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Kart Numarası</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardName">Kart Üzerindeki İsim</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      placeholder="AD SOYAD"
                      value={formData.cardName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cardExpiry">Son Kullanma Tarihi</Label>
                      <Input
                        id="cardExpiry"
                        name="cardExpiry"
                        placeholder="MM/YY"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardCvc">CVC</Label>
                      <Input
                        id="cardCvc"
                        name="cardCvc"
                        placeholder="123"
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.paymentMethod === "bank-transfer" && (
                <div className="p-4 border rounded-lg bg-white dark:bg-gray-900">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Landmark className="mr-2 h-4 w-4" /> Banka Bilgileri
                  </h3>
                  <p className="text-sm">Banka: Örnek Banka</p>
                  <p className="text-sm">IBAN: TR00 0000 0000 0000 0000 0000 00</p>
                  <p className="text-sm">Hesap Sahibi: E-Ticaret A.Ş.</p>
                  <p className="text-sm mt-2">Lütfen havale açıklamasına sipariş numaranızı yazmayı unutmayın.</p>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={isSubmitting}>
              {isSubmitting ? "İşleniyor..." : "Siparişi Tamamla"}
            </Button>
          </form>
        </div>

        <div>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Sipariş Özeti</h2>
            <div className="space-y-4 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative h-16 w-16 flex-shrink-0 rounded border overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-contain"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Adet: {item.quantity}</span>
                      <span className="text-sm font-semibold">{(item.price * item.quantity).toFixed(2)} TL</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Ara Toplam</span>
                <span>{totalAmount.toFixed(2)} TL</span>
              </div>
              <div className="flex justify-between">
                <span>Kargo</span>
                <span>Ücretsiz</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Toplam</span>
                <span className="text-primary">{totalAmount.toFixed(2)} TL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
