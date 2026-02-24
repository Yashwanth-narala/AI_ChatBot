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
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    if (text.length === 0) {
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
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(updateSelection, 80)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        window.getSelection()?.removeAllRanges()
        clearSelection()
      }
    }

    document.addEventListener("selectionchange", handleSelectionChange)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange)
      document.removeEventListener("keydown", handleKeyDown)
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [updateSelection, clearSelection])

  return { ...selection, clearSelection }
}
