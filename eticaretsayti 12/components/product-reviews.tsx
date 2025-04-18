"use client"

import type React from "react"

import { useState } from "react"
import { Star, StarHalf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface Review {
  id: number
  productId: number
  username: string
  rating: number
  comment: string
  date: string
}

interface ProductReviewsProps {
  productId: number
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { toast } = useToast()
  const [reviews, setReviews] = useState<Review[]>(() => {
    if (typeof window !== "undefined") {
      const savedReviews = localStorage.getItem("productReviews")
      return savedReviews ? JSON.parse(savedReviews).filter((review: Review) => review.productId === productId) : []
    }
    return []
  })

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  })

  const handleRatingChange = (rating: number) => {
    setNewReview({ ...newReview, rating })
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewReview({ ...newReview, comment: e.target.value })
  }

  const handleSubmitReview = () => {
    if (newReview.comment.trim() === "") {
      toast({
        title: "Hata",
        description: "Lütfen bir yorum yazın",
        variant: "destructive",
      })
      return
    }

    const review: Review = {
      id: Date.now(),
      productId,
      username: "Kullanıcı",
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toLocaleDateString("tr-TR"),
    }

    const updatedReviews = [...reviews, review]
    setReviews(updatedReviews)

    // Tüm yorumları localStorage'a kaydet
    if (typeof window !== "undefined") {
      const allReviews = localStorage.getItem("productReviews")
      const parsedReviews = allReviews ? JSON.parse(allReviews) : []
      const filteredReviews = parsedReviews.filter((r: Review) => r.productId !== productId)
      localStorage.setItem("productReviews", JSON.stringify([...filteredReviews, ...updatedReviews]))
    }

    setNewReview({
      rating: 5,
      comment: "",
    })

    toast({
      title: "Başarılı",
      description: "Yorumunuz eklendi",
    })
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
    }

    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)
    }

    return stars
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6">Ürün Yorumları</h2>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Yorum Yaz</h3>
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <span className="mr-2">Puanınız:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleRatingChange(rating)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      rating <= newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <Textarea
            placeholder="Yorumunuzu buraya yazın..."
            value={newReview.comment}
            onChange={handleCommentChange}
            className="min-h-[100px]"
          />
        </div>
        <Button onClick={handleSubmitReview}>Yorum Gönder</Button>
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="font-semibold mr-2">{review.username}</span>
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-gray-500">Bu ürün için henüz yorum yapılmamış.</p>
          <p className="text-gray-500">İlk yorumu siz yapın!</p>
        </div>
      )}
    </div>
  )
}
