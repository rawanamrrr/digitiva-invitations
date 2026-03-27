"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    quote:
      "Digitiva transformed our wedding invitation into an unforgettable digital experience. Our guests couldn't stop talking about how beautiful and easy it was to RSVP!",
    author: "Emma Thompson",
    role: "Bride",
    event: "Garden Wedding",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
  },
  {
    quote:
      "The platform exceeded all expectations. Registration was seamless, and the design perfectly represented our brand identity perfectly.",
    author: "Michael Chen",
    role: "Events Director",
    event: "TechVision Summit",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
  },
  {
    quote:
      "Working with Digitiva was a joy from start to finish. They delivered something truly magical for our daughter's special day.",
    author: "Sarah Martinez",
    role: "Happy Mom",
    event: "Sweet Sixteen Party",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
  },
]

export function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const next = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }
  }

  const prev = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 500)
    return () => clearTimeout(timer)
  }, [current])

  // Auto-advance
  useEffect(() => {
    const interval = setInterval(next, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 sm:mb-28">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md glass border border-border/40 mb-6 sm:mb-8">
            <Star className="w-3.5 h-3.5 text-teal fill-teal" />
            <span className="text-xs sm:text-sm font-medium text-foreground/75">Success Stories</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4 sm:mb-6">
            Trusted by Hundreds of
            <span className="block font-script text-3xl sm:text-5xl lg:text-6xl text-teal font-normal mt-2 sm:mt-3">
              Happy Celebrations
            </span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            See what our clients say about creating beautiful invitations with Digitiva
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="relative bg-card border border-border/60 rounded-md p-6 sm:p-10 lg:p-12 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          {/* Decorative quote icon */}
          <div className="absolute top-6 right-6 opacity-8">
            <Quote className="w-16 h-16 sm:w-20 sm:h-20 text-primary" />
          </div>

          <div className="relative z-10">
            {/* Rating stars */}
            <div className="flex justify-center gap-1 mb-8">
              {[...Array(testimonials[current].rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-teal text-teal"
                />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="font-serif text-lg sm:text-xl lg:text-2xl text-center text-foreground leading-relaxed mb-10 min-h-24 flex items-center justify-center">
              "{testimonials[current].quote}"
            </blockquote>

            {/* Author info */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-3 ring-teal/20">
                <Image
                  src={testimonials[current].avatar || "/placeholder.svg"}
                  alt={testimonials[current].author}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground text-base sm:text-lg">
                  {testimonials[current].author}
                </p>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {testimonials[current].role} • {testimonials[current].event}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-6 mt-10 sm:mt-12">
            <button
              onClick={prev}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-border bg-secondary/50 hover:bg-secondary hover:border-primary/30 flex items-center justify-center transition-all duration-200 active:scale-95"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`transition-all duration-300 rounded-full ${
                    current === index
                      ? "bg-teal w-8 h-2.5"
                      : "bg-border h-2 w-2 hover:bg-primary/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-border bg-secondary/50 hover:bg-secondary hover:border-primary/30 flex items-center justify-center transition-all duration-200 active:scale-95"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
