"use client"

import { useEffect, useState } from "react"
import type { Product } from "@/types/product"
import ProductCard from "./product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

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

        let data = await response.json()

        // Ürün sayısını 50'ye çıkarmak için mevcut ürünleri çoğaltıyoruz
        if (data.length < 50) {
          const originalLength = data.length
          const duplicationsNeeded = Math.ceil(50 / originalLength) - 1

          let extendedData = [...data]

          for (let i = 0; i < duplicationsNeeded; i++) {
            const duplicatedProducts = data.map((product: Product, index: number) => ({
              ...product,
              id: product.id + originalLength * (i + 1), // Benzersiz ID'ler oluştur
              title: `${product.title} - Versiyon ${i + 2}`, // Başlığı biraz değiştir
            }))
            extendedData = [...extendedData, ...duplicatedProducts]
          }

          // Tam olarak 50 ürün olacak şekilde kes
          data = extendedData.slice(0, 50)
        }

        // Yeni kategoriler ekle
        const homeProducts = data.slice(0, 10).map((product: Product) => ({
          ...product,
          category: "home",
          id: product.id + 1000, // Benzersiz ID'ler oluştur
          title: `Ev için ${product.title}`,
        }))

        const giftProducts = data.slice(10, 20).map((product: Product) => ({
          ...product,
          category: "gifts",
          id: product.id + 2000, // Benzersiz ID'ler oluştur
          title: `Hediye ${product.title}`,
        }))

        // Tüm ürünleri birleştir
        const allProducts = [...data, ...homeProducts, ...giftProducts]

        setProducts(allProducts)
        setFilteredProducts(allProducts)

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
        setFilteredProducts([])
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    let result = [...products]

    // Kategori filtresi
    if (selectedCategory !== "all") {
      result = result.filter((product) => product.category === selectedCategory)
    }

    // Arama filtresi
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (product) => product.title.toLowerCase().includes(query) || product.description.toLowerCase().includes(query),
      )
    }

    setFilteredProducts(result)
  }, [searchQuery, selectedCategory, products])

  if (loading) {
    return (
      <div>
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
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Ürün ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Kategoriler</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "home"
                  ? "Ev & Yaşam"
                  : category === "gifts"
                    ? "Hediyeler"
                    : category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500 dark:text-gray-400">Aradığınız kriterlere uygun ürün bulunamadı.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
