import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Shirt, Laptop, Home, Watch, Gift } from "lucide-react"

// Kategori renklerini güncelle
const categories = [
  {
    id: "men's clothing",
    name: "Kişi Geyimləri",
    icon: <Shirt className="h-6 w-6" />,
    color: "bg-primary/10 text-primary",
  },
  {
    id: "women's clothing",
    name: "Qadın Geyimləri",
    icon: <Shirt className="h-6 w-6" />,
    color: "bg-secondary/10 text-secondary",
  },
  {
    id: "electronics",
    name: "Elektronika",
    icon: <Laptop className="h-6 w-6" />,
    color: "bg-accent/10 text-accent",
  },
  {
    id: "jewelery",
    name: "Zərgərlik",
    icon: <Watch className="h-6 w-6" />,
    color: "bg-primary/10 text-primary",
  },
  {
    id: "home",
    name: "Ev & Yaşayış",
    icon: <Home className="h-6 w-6" />,
    color: "bg-secondary/10 text-secondary",
  },
  {
    id: "gifts",
    name: "Hədiyyələr",
    icon: <Gift className="h-6 w-6" />,
    color: "bg-accent/10 text-accent",
  },
]

export default function CategorySection() {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">Kateqoriyalar</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link key={category.id} href={`/category/${category.id}`}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className={`p-3 rounded-full ${category.color} mb-3`}>{category.icon}</div>
                <span className="text-center font-medium">{category.name}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
