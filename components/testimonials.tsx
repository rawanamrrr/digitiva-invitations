"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
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
      "The corporate event platform they built exceeded all expectations. Registration was seamless, and the design perfectly represented our brand identity.",
    author: "Michael Chen",
    role: "Events Director",
    event: "TechVision Summit",
    avatar: "/placeholder.svg?height=80&width=80",
    rating: 5,
  },
  {
    quote:
      "Working with Digitiva was a joy from start to finish. They understood our vision immediately and delivered something truly magical for our daughter's sweet sixteen.",
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
    <section className="py-24 lg:py-32 px-6 lg:px-8 bg-card">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl lg:text-5xl font-semibold text-card-foreground mb-4">
            Loved by <span className="font-script text-4xl lg:text-6xl text-primary font-normal">our clients</span>
          </h2>
        </div>

        <div className="relative bg-background rounded-3xl p-8 lg:p-12 shadow-xl">
          {/* Quote mark */}
          <div className="absolute top-6 left-8 text-8xl font-serif text-primary/10 leading-none">"</div>

          <div className="relative z-10">
            {/* Stars */}
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(testimonials[current].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>

            <blockquote className="font-serif text-xl lg:text-2xl text-center text-foreground leading-relaxed mb-8">
              "{testimonials[current].quote}"
            </blockquote>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden mb-4 ring-4 ring-primary/20">
                <Image
                  src={testimonials[current].avatar || "/placeholder.svg"}
                  alt={testimonials[current].author}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-semibold text-foreground">{testimonials[current].author}</p>
              <p className="text-sm text-muted-foreground">
                {testimonials[current].role} • {testimonials[current].event}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-secondary hover:border-primary/50 transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    current === index ? "bg-primary w-8" : "bg-border hover:bg-primary/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-secondary hover:border-primary/50 transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
