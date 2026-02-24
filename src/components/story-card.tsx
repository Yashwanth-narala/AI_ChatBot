"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTextSelection } from "@/hooks/use-text-selection"
import { TextSelectionToolbar } from "@/components/text-selection-toolbar"
import type { StoryCardData } from "@/lib/types"

interface StoryCardProps {
  data: StoryCardData
  priority?: boolean
}

export function StoryCard({ data, priority = false }: StoryCardProps) {
  const [expanded, setExpanded] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const selectableRef = useRef<HTMLDivElement>(null)
  const { text, rect, isVisible, clearSelection } = useTextSelection(selectableRef)

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev)
  }, [])

  return (
    <article
      className={cn(
        "group rounded-2xl bg-card border border-border shadow-sm",
        "hover:shadow-md hover:-translate-y-0.5",
        "transition-all duration-300 ease-in-out",
        "p-6 flex flex-col gap-4"
      )}
    >
      {/* Badge */}
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-xs font-medium text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          {data.label}
        </span>
      </div>

      {/* Image */}
      <div className="overflow-hidden rounded-xl">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          <Image
            src={data.image}
            alt={data.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-foreground md:text-2xl text-balance">
          {data.title}
        </h2>
        {data.subtitle && (
          <p className="text-sm text-muted-foreground">{data.subtitle}</p>
        )}
      </div>

      {/* Description with expand/collapse */}
      <div className="relative flex flex-col gap-2" ref={selectableRef}>
        <div
          ref={contentRef}
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out"
          )}
        >
          <p
            className={cn(
              "text-base leading-relaxed text-muted-foreground",
              !expanded && "line-clamp-3"
            )}
          >
            {data.description}
          </p>
        </div>

        <button
          onClick={toggleExpanded}
          aria-expanded={expanded}
          className={cn(
            "inline-flex items-center gap-1 self-start text-sm font-medium",
            "text-amber-600 hover:text-amber-700",
            "transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          )}
        >
          {expanded ? "Read Less" : "Read More"}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              expanded && "rotate-180"
            )}
          />
        </button>

        {/* Selection Toolbar */}
        <TextSelectionToolbar
          text={text}
          rect={rect}
          isVisible={isVisible}
          onClearSelection={clearSelection}
        />
      </div>
    </article>
  )
}
