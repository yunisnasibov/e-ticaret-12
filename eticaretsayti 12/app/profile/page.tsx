"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useOrders } from "@/context/order-context"
import { formatDate } from "@/utils/format-date"
import Link from "next/link"
import { ChevronRight, LogOut, User, Package } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, updateUser, isLoading } = useAuth()
  const { orders } = useOrders()
  const { toast } = useToast()

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  })

  const [addressData, setAddressData] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Türkiye",
    phone: "",
  })

  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }

    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
      })

      // LocalStorage'dan adres bilgilerini al
      if (typeof window !== "undefined") {
        const storedAddress = localStorage.getItem(`address-${user.id}`)
        if (storedAddress) {
          try {
            setAddressData(JSON.parse(storedAddress))
          } catch (error) {
            console.error("Adres bilgileri yüklenirken hata oluştu:", error)
          }
        }
      }
    }
  }, [user, isLoading, router])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAddressData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      updateUser({ name: profileData.name })

      toast({
        title: "Profil güncellendi",
        description: "Profil bilgileriniz başarıyla güncellendi",
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "Profil güncellenirken bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      // Adres bilgilerini LocalStorage'a kaydet
      if (typeof window !== "undefined" && user) {
        localStorage.setItem(`address-${user.id}`, JSON.stringify(addressData))
      }

      toast({
        title: "Adres güncellendi",
        description: "Adres bilgileriniz başarıyla güncellendi",
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "Adres güncellenirken bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
    toast({
      title: "Çıkış yapıldı",
      description: "Hesabınızdan çıkış yaptınız",
    })
  }

  if (isLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Hesabım</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                {user.name}
              </CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" /> Profil Bilgilerim
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/orders">
                  <Package className="mr-2 h-4 w-4" /> Siparişlerim
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/favorites">
                  <Package className="mr-2 h-4 w-4" /> Favorilerim
                </Link>
              </Button>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full text-red-500" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Çıkış Yap
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profil Bilgileri</TabsTrigger>
              <TabsTrigger value="address">Adres Bilgileri</TabsTrigger>
              <TabsTrigger value="orders">Son Siparişler</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profil Bilgileri</CardTitle>
                  <CardDescription>Kişisel bilgilerinizi güncelleyebilirsiniz</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ad Soyad</Label>
                      <Input id="name" name="name" value={profileData.name} onChange={handleProfileChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta</Label>
                      <Input id="email" name="email" type="email" value={profileData.email} disabled />
                      <p className="text-sm text-muted-foreground">E-posta adresiniz değiştirilemez</p>
                    </div>
                    <Button type="submit" disabled={isUpdating} className="bg-primary hover:bg-primary/90 text-white">
                      {isUpdating ? "Güncelleniyor..." : "Bilgileri Güncelle"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="address">
              <Card>
                <CardHeader>
                  <CardTitle>Adres Bilgileri</CardTitle>
                  <CardDescription>Teslimat adresinizi güncelleyebilirsiniz</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Ad Soyad</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={addressData.fullName}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Adres</Label>
                      <Input
                        id="address"
                        name="address"
                        value={addressData.address}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Şehir</Label>
                        <Input id="city" name="city" value={addressData.city} onChange={handleAddressChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Posta Kodu</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          value={addressData.postalCode}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Ülke</Label>
                      <Input
                        id="country"
                        name="country"
                        value={addressData.country}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={addressData.phone}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={isUpdating} className="bg-primary hover:bg-primary/90 text-white">
                      {isUpdating ? "Güncelleniyor..." : "Adresi Güncelle"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Son Siparişlerim</CardTitle>
                  <CardDescription>Son siparişlerinizi görüntüleyebilirsiniz</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-6">
                      <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Henüz siparişiniz bulunmamaktadır</p>
                      <Button className="mt-4" asChild>
                        <Link href="/">Alışverişe Başla</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">{order.id}</p>
                              <p className="text-sm text-muted-foreground">{formatDate(order.date)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{order.totalAmount.toFixed(2)} TL</p>
                              <span
                                className={`inline-block px-2 py-1 text-xs rounded-full ${
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
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-sm">{order.items.length} ürün</p>
                            <Link href={`/orders/${order.id}`}>
                              <Button variant="ghost" size="sm">
                                Detaylar <ChevronRight className="ml-1 h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}

                      {orders.length > 5 && (
                        <div className="text-center mt-4">
                          <Button variant="outline" asChild>
                            <Link href="/orders">Tüm Siparişleri Görüntüle</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
