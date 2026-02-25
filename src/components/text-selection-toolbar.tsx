"use client"

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react"
import {
  Sparkles,
  PenLine,
  ClipboardCopy,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TextSelectionToolbarProps {
  text: string
  rect: DOMRect | null
  isVisible: boolean
  onClearSelection: () => void
  onAskAI?: (text: string) => void
}

export function TextSelectionToolbar({
  text,
  rect,
  isVisible,
  onClearSelection,
  onAskAI,
}: TextSelectionToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [copied, setCopied] = useState(false)
  const [highlighted, setHighlighted] = useState(false)

  // Position calculation using fixed positioning (viewport-relative)
  useLayoutEffect(() => {
    if (!rect || !isVisible) return

    const padding = 12
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth

    // Measure actual toolbar width if mounted, else estimate
    const toolbarEl = toolbarRef.current
    const toolbarWidth = toolbarEl ? toolbarEl.offsetWidth : 350
    const toolbarHeight = toolbarEl ? toolbarEl.offsetHeight : 48

    // Calculate preferred position above the selection
    let top = rect.top - toolbarHeight - padding
    let left = rect.left + rect.width / 2 - toolbarWidth / 2

    // Adjust if toolbar would go off-screen
    // Left edge
    if (left < padding) left = padding

    // Right edge
    if (left + toolbarWidth > viewportWidth - padding) {
      left = viewportWidth - toolbarWidth - padding
    }

    // If toolbar would go above viewport or selection is too high, put it below
    if (top < padding || rect.top < 100) {
      top = rect.bottom + padding
    }

    // If toolbar would go below viewport, put it above
    if (top + toolbarHeight > viewportHeight - padding) {
      top = rect.top - toolbarHeight - padding
    }

    // Final safety check - if still off-screen, center it
    if (top < 0) top = padding
    if (top + toolbarHeight > viewportHeight) top = viewportHeight - toolbarHeight - padding

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPosition({ top, left })
  }, [rect, isVisible])


  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Fallback
      const textarea = document.createElement("textarea")
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }, [text])

  const handleHighlight = useCallback(() => {
    const sel = window.getSelection()
    if (!sel || !sel.rangeCount) return

    const range = sel.getRangeAt(0)
    const mark = document.createElement("mark")
    mark.className =
      "bg-amber-200/70 text-foreground rounded-sm px-0.5 transition-colors"

    try {
      range.surroundContents(mark)
      sel.removeAllRanges()
      setHighlighted(true)
      setTimeout(() => {
        setHighlighted(false)
        onClearSelection()
      }, 800)
    } catch {
      // surroundContents fails if selection spans multiple elements
      setHighlighted(false)
    }
  }, [onClearSelection])

  const handleAskAI = useCallback(() => {
    if (onAskAI) {
      onAskAI(text)
    } else {
      console.log("[Prepdha AI] Selected text:", text)
    }
  }, [text, onAskAI])

  console.log("[v0] Toolbar render check:", { isVisible, hasRect: !!rect, text: text.substring(0, 30), position })

  if (!isVisible || !rect) return null

  return (
    <div
      ref={toolbarRef}
      role="toolbar"
      aria-label="Text selection actions"
      aria-hidden={!isVisible}
      className={cn(
        "fixed z-[9999] flex items-center gap-1 rounded-xl border border-border bg-card px-2 py-1.5 shadow-lg",
        "animate-in fade-in zoom-in-95 duration-150",
        "pointer-events-auto"
      )}
      style={{
        top: position.top,
        left: position.left,
        position: 'fixed',
        transform: 'translateZ(0)', // Force hardware acceleration
      }}
    >
      {/* Ask AI */}
      <ToolbarButton icon={Sparkles} label="Ask AI" onClick={handleAskAI} />

      <Separator />

      {/* Highlight */}
      <ToolbarButton
        icon={PenLine}
        label={highlighted ? "Highlighted!" : "Highlight"}
        onClick={handleHighlight}
        active={highlighted}
      />

      <Separator />

      {/* Copy Text */}
      <ToolbarButton
        icon={ClipboardCopy}
        label={copied ? "Copied!" : "Copy Text"}
        onClick={handleCopy}
      />
    </div>
  )
}

function Separator() {
  return <div className="h-5 w-px bg-border" />
}

function ToolbarButton({
  icon: Icon,
  label,
  onClick,
  active = false,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick: () => void
  active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium",
        "text-card-foreground hover:bg-accent",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        active && "bg-accent text-amber-600"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  )
}
