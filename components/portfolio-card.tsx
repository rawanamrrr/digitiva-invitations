"use client"

import Image from "next/image"
import { ArrowUpRight, Plus, ExternalLink } from "lucide-react"
import { Template } from "@/lib/templates"
import Link from "next/link"

interface PortfolioCardProps {
  item: Template
  index: number
  onClick: () => void
}

export function PortfolioCard({ item, index, onClick }: PortfolioCardProps) {
  const displayIndex = (index + 1).toString().padStart(2, "0")
  const isVideo = item.image?.toLowerCase().endsWith(".mp4")

  return (
    <article
      className="group flex flex-col animate-slide-up w-full"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div 
        className="relative w-full aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-white shadow-sm transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-primary/10 cursor-pointer"
        onClick={onClick}
      >
        {isVideo ? (
          <video
            src={item.image}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        ) : (
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        )}

        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-500" />

        {/* Floating Index */}
        <div className="absolute top-6 left-6 font-serif text-3xl font-light text-white/40 select-none">
          {displayIndex}
        </div>

        {/* View Demo Button on Card - Bottom Left */}
        <div className="absolute bottom-6 left-6 z-20">
          <Link 
            href={item.demoUrl}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium bg-white text-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-xl"
          >
            <ExternalLink className="w-4 h-4" />
            View Demo
          </Link>
        </div>
      </div>

      {/* Info Below */}
      <div className="mt-6 space-y-2 px-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] tracking-[0.2em] uppercase text-primary font-bold">
              {item.category}
            </p>
            <h3 className="font-serif text-2xl font-light text-foreground group-hover:text-primary transition-colors duration-300">
              {item.name}
            </h3>
          </div>
          <ArrowUpRight className="w-5 h-5 text-muted-foreground mt-1" />
        </div>
      </div>
    </article>
  )
}
