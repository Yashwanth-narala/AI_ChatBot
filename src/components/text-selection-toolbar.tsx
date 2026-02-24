"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import {
  Plus,
  ChevronDown,
  Sparkles,
  MessageSquare,
  PenLine,
  ClipboardCopy,
  BookmarkPlus,
  FolderPlus,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

interface TextSelectionToolbarProps {
  text: string
  rect: DOMRect | null
  isVisible: boolean
  onClearSelection: () => void
}

export function TextSelectionToolbar({
  text,
  rect,
  isVisible,
  onClearSelection,
}: TextSelectionToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [showComment, setShowComment] = useState(false)
  const [comment, setComment] = useState("")
  const [copied, setCopied] = useState(false)
  const [highlighted, setHighlighted] = useState(false)

  // Position calculation using fixed positioning (viewport-relative)
  useEffect(() => {
    if (!rect || !isVisible) return

    const padding = 12

    // Measure actual toolbar width if mounted, else estimate
    const toolbarEl = toolbarRef.current
    const toolbarWidth = toolbarEl ? toolbarEl.offsetWidth : 520
    const toolbarHeight = toolbarEl ? toolbarEl.offsetHeight : 48

    // Place toolbar above the selection, centered horizontally
    let top = rect.top - toolbarHeight - padding
    let left = rect.left + rect.width / 2 - toolbarWidth / 2

    // Prevent overflow left
    if (left < padding) left = padding
    // Prevent overflow right
    if (left + toolbarWidth > window.innerWidth - padding) {
      left = window.innerWidth - toolbarWidth - padding
    }
    // If toolbar would go above viewport, put it below selection
    if (top < padding) {
      top = rect.bottom + padding
    }

    setPosition({ top, left })
  }, [rect, isVisible])

  // Click outside to close comment popover
  useEffect(() => {
    if (!showComment) return
    const handleClick = (e: MouseEvent) => {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(e.target as Node)
      ) {
        setShowComment(false)
        setComment("")
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [showComment])

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
    console.log("[Prepdha AI] Selected text:", text)
  }, [text])

  const handleCommentSubmit = useCallback(() => {
    if (comment.trim()) {
      console.log("[Prepdha] Comment on:", text, "| Comment:", comment)
      setComment("")
      setShowComment(false)
    }
  }, [comment, text])

  console.log("[v0] Toolbar render check:", { isVisible, hasRect: !!rect, text: text.substring(0, 30), position })

  if (!isVisible || !rect) return null

  return (
    <div
      ref={toolbarRef}
      role="toolbar"
      aria-label="Text selection actions"
      aria-hidden={!isVisible}
      className={cn(
        "fixed z-50 flex items-center gap-1 rounded-xl border border-border bg-card px-2 py-1.5 shadow-lg",
        "animate-in fade-in zoom-in-95 duration-150"
      )}
      style={{ top: position.top, left: position.left }}
    >
      {/* Add it to */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium",
              "text-amber-600 hover:bg-amber-50",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
            )}
          >
            <Plus className="h-4 w-4" />
            <span>Add it to</span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={8} className="w-48">
          <DropdownMenuLabel>Save to...</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <BookmarkPlus className="h-4 w-4" />
            Bookmarks
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FolderPlus className="h-4 w-4" />
            Study Notes
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FileText className="h-4 w-4" />
            Flashcards
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator />

      {/* Ask AI */}
      <ToolbarButton icon={Sparkles} label="Ask AI" onClick={handleAskAI} />

      <Separator />

      {/* Add a Comment */}
      <div className="relative">
        <ToolbarButton
          icon={MessageSquare}
          label="Add a Comment"
          onClick={() => setShowComment(!showComment)}
          active={showComment}
        />
        {showComment && (
          <div className="absolute top-full left-1/2 mt-2 w-64 -translate-x-1/2 rounded-xl border border-border bg-card p-3 shadow-lg animate-in fade-in zoom-in-95 duration-150">
            <textarea
              autoFocus
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleCommentSubmit()
                }
              }}
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={handleCommentSubmit}
                disabled={!comment.trim()}
                className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-card transition-colors hover:bg-amber-600 disabled:opacity-40"
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>

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
        "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium",
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
