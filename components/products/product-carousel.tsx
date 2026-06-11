"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import { Button } from "@/components/ui/button"

interface ProductCarouselProps {
  images: string[]
  alt: string
}

export function ProductCarousel({ images, alt }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative w-full overflow-hidden rounded-lg bg-muted">
        <div className="relative aspect-square">
          <Image
            src={images[currentIndex]}
            alt={`${alt} - Image ${currentIndex + 1}`}
            fill
            className="object-cover transition-opacity duration-300"
            priority
          />
        </div>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white dark:bg-black/80 dark:hover:bg-black"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute right-3 bottom-3 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                index === currentIndex
                  ? "border-primary"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt={`${alt} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
