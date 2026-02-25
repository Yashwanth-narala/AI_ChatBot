"use client"

import { useState, useEffect } from "react"
import { StoryCard } from "@/components/story-card"
import { SkeletonStoryCard } from "@/components/skeleton-story-card"
import type { StoryCardData } from "@/lib/types"
import type { Chapter } from "@/types/chapter"

interface StorySectionProps {
  cards: StoryCardData[]
  chapter?: Chapter | null
  onAskAI?: (text: string) => void
}

export function StorySection({ cards, chapter, onAskAI }: StorySectionProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="flex flex-col gap-8">
      {chapter && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {chapter.bodyHeading}
          </h2>
          <p className="text-muted-foreground">
            {chapter.title}
          </p>
        </div>
      )}
      {loading
        ? Array.from({ length: 3 }).map((_, i) => (
            <SkeletonStoryCard key={i} />
          ))
        : cards.map((card, index) => (
            <StoryCard key={card.id} data={card} priority={index === 0} onAskAI={onAskAI} />
          ))}
    </section>
  )
}
