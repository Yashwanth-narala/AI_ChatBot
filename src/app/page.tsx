"use client"

import { useState, useCallback } from "react"
import { RightPanel } from "@/components/right-panel"

export default function PrepdhaPage() {
  const [contextReference, setContextReference] = useState<string | null>(null)

  const handleClearReference = useCallback(() => {
    setContextReference(null)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <div className="flex-1 min-h-0 flex">
        <div className="ml-auto h-full w-full max-w-md min-w-[320px]">
          <RightPanel
            contextReference={contextReference}
            onClearReference={handleClearReference}
            chapterContext={null}
            currentChapterId={null}
          />
        </div>
      </div>
    </div>
  )
}
