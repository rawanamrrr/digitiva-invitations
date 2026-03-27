"use client"

import type React from "react"
import { useState } from "react"
import { Send, Mail, Phone, MapPin, Sparkles } from "lucide-react"

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    eventType: "",
    date: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <section id="contact" className="py-16 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left column - Info */}
          <div className="space-y-10 sm:space-y-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md glass border border-border/40 mb-6 sm:mb-8">
                <Sparkles className="w-3.5 h-3.5 text-teal" />
                <span className="text-xs sm:text-sm font-medium text-foreground/75">Get Started</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4 sm:mb-5">
                Let's create
                <span className="block font-script text-3xl sm:text-5xl lg:text-6xl text-teal font-normal mt-2 sm:mt-3">
                  Magic Together
                </span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-lg leading-relaxed">
                Ready to transform your event invitation into a memorable digital experience? Tell us about your celebration and we'll bring your vision to life.
              </p>
            </div>

            {/* Contact info */}
            <div className="space-y-5 sm:space-y-7">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-md bg-teal/8 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5.5 h-5.5 text-teal" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">Email us</p>
                  <p className="font-medium text-foreground text-sm sm:text-base">hello@digitiva.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-md bg-primary/8 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5.5 h-5.5 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">Call us</p>
                  <p className="font-medium text-foreground text-sm sm:text-base">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-md bg-emerald/8 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5.5 h-5.5 text-emerald" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">Visit us</p>
                  <p className="font-medium text-foreground text-sm sm:text-base">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Form */}
          <div className="bg-card rounded-md border border-border/60 p-8 sm:p-10 shadow-md hover:shadow-lg transition-shadow duration-300">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 sm:py-3 rounded-md bg-secondary border border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground text-sm sm:text-base"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 sm:py-3 rounded-md bg-secondary border border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground text-sm sm:text-base"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <label htmlFor="eventType" className="block text-sm font-medium text-foreground mb-2.5">
                    Event Type
                  </label>
                  <select
                    id="eventType"
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full px-4 py-2.5 sm:py-3 rounded-md bg-secondary border border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground text-sm sm:text-base"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="wedding">Wedding</option>
                    <option value="birthday">Birthday</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="baby-shower">Baby Shower</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-foreground mb-2.5">
                    Event Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 sm:py-3 rounded-md bg-secondary border border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground text-sm sm:text-base"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2.5">
                  Tell us about your event
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 sm:py-3 rounded-md bg-secondary border border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none text-foreground text-sm sm:text-base"
                  placeholder="Share your vision, theme ideas, or any specific requirements..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium bg-primary hover:bg-navy-deep text-primary-foreground rounded-md transition-all duration-300 active:scale-95"
              >
                <Send className="w-4.5 h-4.5" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
