"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"

const COUNT = 4

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

const testimonials = [
  {
    quote: "Your work is literally wow. Everyone from my friends & connections were gave a positive feedback cause its their first time seeing this new concept. Personally we loved it very much & dealing with professionals like you guys is what makes it worth it. The price is very reasonable for the memory we're creating, thank you! ❤️",
    author: "Abdalla & Leanne",
    relationship: "",
  },
  {
    quote: "I Can't even explain how happy I am The invitation is sooo beautiful, such a sweet new idea . Everyone is obsessed with it bgad , Thank you so much for all your effort and care 🩶♥️",
    author: "Ali & Mayada",
    relationship: "",
  },
  {
    quote: "صراحة جدا حبيت التعامل معكم كنتو متقبلين لاي تعديلات وافكار جديدة و كل حد بعتناله الدعوة سالني كيف سويتيها فعلا معاملة كتير حلوة وبنصح الكل يعمل عندكم!💕",
    author: "Mohamad & Mira",
    relationship: "",
  },
  {
    quote: "من احلى الحاجات اللى عملتها للخطوبه هى الانڤتيشن معاكو و الناس كلها كانت منبهره انبهار مش عادى و متحمسين للخطوبه من قبلها بسببها اصلاً فشكراً اوى اوى سبتولى ذكرى حلوه اوى و عملتولى كل اللى طلبته و احسن و فى وقت قليل اوى و ان شاء الله نكون مع بعض فى الفرح و نعمل حاجه مختلفه اكتر ♥️♥️♥️🥰",
    author: "Momen & Nada",
    relationship: "",
  },
]

export function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const { ref: sectionRef, isInView } = useInView(0.1)

  const next = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setCurrent((prev) => (prev + 1) % COUNT)
    }
  }

  const prev = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setCurrent((prev) => (prev - 1 + COUNT) % COUNT)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 500)
    return () => clearTimeout(timer)
  }, [current])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % COUNT)
      setIsAnimating(true)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const i = current

  return (
    <section ref={sectionRef} className="py-16 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className={`text-center mb-16 sm:mb-28 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4 sm:mb-6">
            What Our
            <span className="block font-script text-3xl sm:text-5xl lg:text-6xl text-teal font-normal mt-2 sm:mt-3">
              Couples Say
            </span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Real stories from real celebrations
          </p>
        </div>

        <div className={`relative bg-card border border-border/60 rounded-md p-6 sm:p-10 lg:p-12 shadow-md hover:shadow-lg transition-all duration-500 overflow-hidden ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
          <div className="absolute top-6 right-6 opacity-8">
            <Quote className="w-16 h-16 sm:w-20 sm:h-20 text-primary" />
          </div>

          <div className="relative z-10">
            <div className="flex justify-center gap-1 mb-8">
              {[...Array(5)].map((_, starI) => (
                <Star key={starI} className="w-5 h-5 fill-teal text-teal" />
              ))}
            </div>

            <blockquote className="font-serif text-lg sm:text-xl lg:text-2xl text-center text-foreground leading-relaxed mb-10 min-h-24 flex items-center justify-center px-4">
              &ldquo;{testimonials[i].quote}&rdquo;
            </blockquote>

            <div className="flex flex-col items-center gap-4">
              <div className="text-center">
                <p className="font-semibold text-foreground text-base sm:text-lg">{testimonials[i].author}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mt-10 sm:mt-12">
            <button
              type="button"
              onClick={prev}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-border bg-secondary/50 hover:bg-secondary hover:border-primary/30 flex items-center justify-center transition-all duration-200 active:scale-95"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-foreground rtl:rotate-180" />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: COUNT }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    if (!isAnimating) {
                      setIsAnimating(true)
                      setCurrent(index)
                    }
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    current === index ? "bg-teal w-8 h-2.5" : "bg-border h-2 w-2 hover:bg-primary/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-border bg-secondary/50 hover:bg-secondary hover:border-primary/30 flex items-center justify-center transition-all duration-200 active:scale-95"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-foreground rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
