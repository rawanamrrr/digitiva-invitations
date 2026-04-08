"use client"

import { useEffect } from "react"
import Image from "next/image"
import { X, ExternalLink, Sparkles } from "lucide-react"
import Link from "next/link"
import { Template } from "@/lib/templates"

interface PortfolioModalProps {
  template: Template
  onClose: () => void
}

export function PortfolioModal({ template, onClose }: PortfolioModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  const isVideo = template.image?.toLowerCase().endsWith(".mp4")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card rounded-2xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative aspect-video">
          {isVideo ? (
            <video
              src={template.image}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover rounded-t-2xl"
            />
          ) : (
            <Image
              src={template.image || "/placeholder.svg"}
              alt={template.name}
              fill
              className="object-cover rounded-t-2xl"
            />
          )}
        </div>

        <div className="p-6 lg:p-10">
          <p className="text-xs tracking-widest uppercase text-accent mb-2">{template.category}</p>
          <h2 className="font-serif text-2xl lg:text-4xl font-medium text-card-foreground">{template.name}</h2>

          <p className="mt-6 text-muted-foreground leading-relaxed">{template.description}</p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link 
              href={template.demoUrl}
              target="_blank"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium bg-secondary text-secondary-foreground rounded-full hover:opacity-90 transition-opacity"
            >
              <ExternalLink className="w-4 h-4" />
              See Demo
            </Link>
            <Link
              href={`/create?template=${template.id}#templates`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
            >
              Create Invitation
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
