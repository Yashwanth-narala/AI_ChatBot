"use client"

import { useState, useEffect, useCallback, useRef, type RefObject } from "react"

interface SelectionState {
  text: string
  rect: DOMRect | null
  isVisible: boolean
}

export function useTextSelection(containerRef: RefObject<HTMLElement | null>) {
  const [selection, setSelection] = useState<SelectionState>({
    text: "",
    rect: null,
    isVisible: false,
  })

  const updateSelection = useCallback(() => {
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed || !sel.rangeCount) {
      setSelection({ text: "", rect: null, isVisible: false })
      return
    }

    const range = sel.getRangeAt(0)
    const container = containerRef.current

    if (!container || !container.contains(range.commonAncestorContainer)) {
      setSelection({ text: "", rect: null, isVisible: false })
      return
    }

    const text = sel.toString().trim()
    if (text.length < 3) {
      setSelection({ text: "", rect: null, isVisible: false })
      return
    }

    const rect = range.getBoundingClientRect()
    console.log("[v0] Selection detected:", { text: text.substring(0, 30), rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height } })
    setSelection({ text, rect, isVisible: true })
  }, [containerRef])

  const clearSelection = useCallback(() => {
    setSelection({ text: "", rect: null, isVisible: false })
  }, [])

  useEffect(() => {
    const handleSelectionChange = () => {
      updateSelection()
    }

    const handleMouseUp = () => {
      // Small delay to ensure selection is updated
      setTimeout(updateSelection, 10)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        window.getSelection()?.removeAllRanges()
        clearSelection()
      }
    }

    const handleClick = (e: MouseEvent) => {
      const toolbar = document.querySelector('[role="toolbar"]')
      const target = e.target as Node

      // Don't clear if clicking on the toolbar itself
      if (toolbar && toolbar.contains(target)) {
        return
      }

      // Clear selection if clicking outside the toolbar and selection area
      const selection = window.getSelection()
      if (!selection || selection.isCollapsed) {
        clearSelection()
      }
    }

    document.addEventListener("selectionchange", handleSelectionChange)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("click", handleClick)
    window.addEventListener("scroll", clearSelection)

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("click", handleClick)
      window.removeEventListener("scroll", clearSelection)
    }
  }, [updateSelection, clearSelection])

  return { ...selection, clearSelection }
}
