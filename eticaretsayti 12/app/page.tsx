import HeroCarousel from "@/components/hero-carousel"
import CategorySection from "@/components/category-section"
import FeaturedProducts from "@/components/featured-products"
import ProductList from "@/components/product-list"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <HeroCarousel />
      <CategorySection />
      <FeaturedProducts />

      <div className="mt-12">
        <h1 className="text-3xl font-bold mb-6">Bütün Məhsullar</h1>
        <ProductList />
      </div>
    </main>
  )
}
