"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Carousel banner renklerini ve resimlerini güncelle
const banners = [
  {
    id: 1,
    title: "Yeni Mövsüm Məhsulları",
    description: "Ən yeni məhsullarımızı kəşf edin və modaya ayaq uydurun",
    buttonText: "Alış-verişə Başla",
    buttonLink: "/",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&h=600&auto=format&fit=crop",
    bgColor: "bg-primary/10",
  },
  {
    id: 2,
    title: "Böyük Endirim",
    description: "Seçilmiş məhsullarda 50%-ə qədər endirimlər",
    buttonText: "Endirimləri Kəşf Et",
    buttonLink: "/",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&h=600&auto=format&fit=crop",
    bgColor: "bg-accent/10",
  },
  {
    id: 3,
    title: "Elektronik Məhsullar",
    description: "Ən son texnologiya məhsulları uyğun qiymətlərlə",
    buttonText: "İndi Bax",
    buttonLink: "/",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1200&h=600&auto=format&fit=crop",
    bgColor: "bg-secondary/10",
  },
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={`w-full flex-shrink-0 ${banner.bgColor} relative`}
            style={{ minWidth: "100%" }}
          >
            <div className="container mx-auto px-4 py-12 md:py-24 flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{banner.title}</h2>
                <p className="text-lg mb-6">{banner.description}</p>
                <Link href={banner.buttonLink}>
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                    {banner.buttonText}
                  </Button>
                </Link>
              </div>
              <div className="md:w-1/2 relative h-[200px] sm:h-[300px] md:h-[400px] w-full">
                <Image
                  src={banner.image || "/placeholder.svg"}
                  alt={banner.title}
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Əvvəlki</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Sonrakı</span>
      </Button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${currentSlide === index ? "bg-primary" : "bg-gray-300"}`}
            onClick={() => setCurrentSlide(index)}
          >
            <span className="sr-only">{index + 1}. banner</span>
          </button>
        ))}
      </div>
    </div>
  )
}
