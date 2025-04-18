import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-4">Sayfa Bulunamadı</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
      <Link href="/">
        <Button>Ana Sayfaya Dön</Button>
      </Link>
    </div>
  )
}
