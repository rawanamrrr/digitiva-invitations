"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "How long does it take to create my invitation?",
    answer:
      "Most invitations are ready within 5-7 business days from design approval. Rush orders can be completed in 2-3 days for an additional fee.",
  },
  {
    question: "Can I make changes after the invitation is created?",
    answer:
      "We offer unlimited revisions during the design phase and minor updates after launch. Your invitation can evolve as your plans change.",
  },
  {
    question: "How do my guests RSVP?",
    answer:
      "Guests simply click a button on your invitation to respond. They can also add dietary requirements, song requests, or any other information you need. You'll see all responses in a real-time dashboard.",
  },
  {
    question: "Is my invitation mobile-friendly?",
    answer:
      "Yes! All our invitations are fully responsive and look beautiful on any device - smartphones, tablets, and desktops. Most guests will view on their phones, so we optimize for that experience.",
  },
  {
    question: "Can I see a preview before purchasing?",
    answer:
      "We offer a free consultation where we discuss your vision and show you relevant examples from our portfolio. You'll know exactly what to expect before committing.",
  },
  {
    question: "What's included in the price?",
    answer:
      "Our packages include custom design, development, hosting for 1 year, RSVP management, unlimited guest access, and ongoing support. No hidden fees!",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faqs" className="py-16 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 sm:mb-28">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md glass border border-border/40 mb-6 sm:mb-8">
            <ChevronDown className="w-3.5 h-3.5 text-teal rotate-180" />
            <span className="text-xs sm:text-sm font-medium text-foreground/75">Have Questions?</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4 sm:mb-6">
            Frequently asked
            <span className="block font-script text-3xl sm:text-5xl lg:text-6xl text-teal font-normal mt-2 sm:mt-3">Questions</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about creating beautiful invitations with Digitiva.
          </p>
        </div>

        <div className="space-y-3 sm:space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card rounded-md border border-border/60 overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-md"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between text-left group hover:bg-secondary/40 transition-colors duration-300"
              >
                <span className="font-medium text-foreground text-sm sm:text-base pr-4 group-hover:text-primary transition-colors duration-300">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <p className="px-6 sm:px-8 pb-4 sm:pb-5 text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
