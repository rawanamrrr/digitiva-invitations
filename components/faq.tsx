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
    <section id="faqs" className="py-24 lg:py-32 px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl lg:text-5xl font-semibold text-foreground mb-4">
            Frequently asked{" "}
            <span className="font-script text-4xl lg:text-6xl text-primary font-normal">questions</span>
          </h2>
          <p className="text-muted-foreground text-lg">Everything you need to know about our invitation services.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl border border-border overflow-hidden transition-all hover:shadow-md"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="font-medium text-card-foreground pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <p className="px-6 pb-5 text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
