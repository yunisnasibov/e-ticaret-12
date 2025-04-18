"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import type { Product } from "@/types/product"
import ProductCard from "@/components/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(query)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [sortBy, setSortBy] = useState("default")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 saniye timeout

        const response = await fetch("https://fakestoreapi.com/products", {
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`API yanıt hatası: ${response.status}`)
        }

        const data = await response.json()

        // Yeni kategoriler ekle
        const homeProducts = data.slice(0, 10).map((product: Product) => ({
          ...product,
          category: "home",
          id: product.id + 1000,
          title: `Ev için ${product.title}`,
        }))

        const giftProducts = data.slice(10, 20).map((product: Product) => ({
          ...product,
          category: "gifts",
          id: product.id + 2000,
          title: `Hediye ${product.title}`,
        }))

        // Tüm ürünleri birleştir
        const allProducts = [...data, ...homeProducts, ...giftProducts]

        setProducts(allProducts)

        // Fiyat aralığını belirle
        const prices = allProducts.map((product: Product) => product.price)
        const maxPrice = Math.ceil(Math.max(...prices))
        setPriceRange([0, maxPrice])

        // Kategorileri çek ve yeni kategorileri ekle
        try {
          const categoriesResponse = await fetch("https://fakestoreapi.com/products/categories", {
            signal: AbortSignal.timeout(5000),
          })

          if (!categoriesResponse.ok) {
            throw new Error(`Kategoriler API yanıt hatası: ${categoriesResponse.status}`)
          }

          let categoriesData = await categoriesResponse.json()

          // Yeni kategorileri ekle
          categoriesData = [...categoriesData, "home", "gifts"]

          setCategories(categoriesData)
        } catch (error) {
          console.error("Kategoriler yüklenirken hata oluştu:", error)
          // Varsayılan kategorileri ayarla
          setCategories(["electronics", "jewelery", "men's clothing", "women's clothing", "home", "gifts"])
        }
      } catch (error) {
        console.error("Ürünler yüklenirken hata oluştu:", error)
        // Hata durumunda boş diziler ayarla
        setProducts([])
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    setSearchQuery(query)
  }, [query])

  useEffect(() => {
    let result = [...products]

    // Arama filtresi
    if (searchQuery) {
      const queryLower = searchQuery.toLowerCase()
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(queryLower) || product.description.toLowerCase().includes(queryLower),
      )
    }

    // Kategori filtresi
    if (selectedCategory !== "all") {
      result = result.filter((product) => product.category === selectedCategory)
    }

    // Fiyat aralığı filtresi
    result = result.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Sıralama
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === "name-desc") {
      result.sort((a, b) => b.title.localeCompare(a.title))
    }

    setFilteredProducts(result)
  }, [searchQuery, selectedCategory, priceRange, sortBy, products])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // URL'yi güncelle
    const url = new URL(window.location.href)
    url.searchParams.set("q", searchQuery)
    window.history.pushState({}, "", url.toString())
  }

  const clearFilters = () => {
    setSelectedCategory("all")
    setPriceRange([0, Math.ceil(Math.max(...products.map((product) => product.price)))])
    setSortBy("default")
  }

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
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-full max-w-xs" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array(8)
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Arama Sonuçları</h1>
        {searchQuery && (
          <p className="text-muted-foreground">
            "{searchQuery}" için {filteredProducts.length} sonuç bulundu
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobil filtre butonu */}
        <div className="lg:hidden w-full mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <SlidersHorizontal className="mr-2 h-4 w-4" /> Filtreler
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filtreler</SheetTitle>
                <SheetDescription>Arama sonuçlarını filtreleyin</SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Kategoriler</h3>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Checkbox
                        id="all-mobile"
                        checked={selectedCategory === "all"}
                        onCheckedChange={() => setSelectedCategory("all")}
                      />
                      <Label htmlFor="all-mobile" className="ml-2">
                        Tüm Kategoriler
                      </Label>
                    </div>
                    {categories.map((category) => (
                      <div key={category} className="flex items-center">
                        <Checkbox
                          id={`${category}-mobile`}
                          checked={selectedCategory === category}
                          onCheckedChange={() => setSelectedCategory(category)}
                        />
                        <Label htmlFor={`${category}-mobile`} className="ml-2">
                          {formatCategoryName(category)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Fiyat Aralığı</h3>
                    <span>
                      {priceRange[0]} TL - {priceRange[1]} TL
                    </span>
                  </div>
                  <Slider
                    value={priceRange}
                    min={0}
                    max={Math.ceil(Math.max(...products.map((product) => product.price)))}
                    step={1}
                    onValueChange={setPriceRange}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Sıralama</h3>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
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

                <Button variant="outline" className="w-full" onClick={clearFilters}>
                  Filtreleri Temizle
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Masaüstü filtreler */}
        <div className="hidden lg:block w-64 space-y-6">
          <div>
            <h3 className="font-medium mb-2">Kategoriler</h3>
            <div className="space-y-1">
              <div className="flex items-center">
                <Checkbox
                  id="all"
                  checked={selectedCategory === "all"}
                  onCheckedChange={() => setSelectedCategory("all")}
                />
                <Label htmlFor="all" className="ml-2">
                  Tüm Kategoriler
                </Label>
              </div>
              {categories.map((category) => (
                <div key={category} className="flex items-center">
                  <Checkbox
                    id={category}
                    checked={selectedCategory === category}
                    onCheckedChange={() => setSelectedCategory(category)}
                  />
                  <Label htmlFor={category} className="ml-2">
                    {formatCategoryName(category)}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <h3 className="font-medium">Fiyat Aralığı</h3>
              <span>
                {priceRange[0]} TL - {priceRange[1]} TL
              </span>
            </div>
            <Slider
              value={priceRange}
              min={0}
              max={Math.ceil(Math.max(...products.map((product) => product.price)))}
              step={1}
              onValueChange={setPriceRange}
            />
          </div>

          <div>
            <h3 className="font-medium mb-2">Sıralama</h3>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
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

          <Button variant="outline" className="w-full" onClick={clearFilters}>
            Filtreleri Temizle
          </Button>
        </div>

        <div className="flex-1">
          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Ürün ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
                {searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Temizle</span>
                  </Button>
                )}
              </div>
              <Button type="submit">Ara</Button>
            </form>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500 dark:text-gray-400">Aradığınız kriterlere uygun ürün bulunamadı.</p>
              <Button variant="link" onClick={clearFilters}>
                Filtreleri temizle ve tekrar dene
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
