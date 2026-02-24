"use client"

import { useState } from "react"
import { Upload, FileText, X, Eye, MoreVertical, Download } from "lucide-react"

interface Attachment {
  id: string
  name: string
  type: "pdf" | "image"
  size: string
  thumbnails: number
}

export function AttachmentsPanel() {
  const [attachments, setAttachments] = useState<Attachment[]>([
    {
      id: "1",
      name: "Chapter_Notes.pdf",
      type: "pdf",
      size: "240 Kb",
      thumbnails: 3,
    },
    {
      id: "2",
      name: "Historical_Maps.pdf",
      type: "pdf",
      size: "540 Kb",
      thumbnails: 5,
    },
  ])
  const [isDragging, setIsDragging] = useState(false)

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const newAttachment: Attachment = {
      id: Date.now().toString(),
      name: "New_Upload.pdf",
      type: "pdf",
      size: "120 Kb",
      thumbnails: 1,
    }
    setAttachments([...attachments, newAttachment])
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-sm font-medium text-foreground">Attachments</span>
        <span className="text-xs text-muted-foreground">{attachments.length} files</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed transition-colors cursor-pointer ${
            isDragging
              ? "border-[#7c3aed] bg-[#7c3aed]/5"
              : "border-border hover:border-[#7c3aed]/50 hover:bg-muted/50"
          }`}
        >
          <Upload className="w-6 h-6 text-muted-foreground mb-2" />
          <span className="text-xs font-medium text-foreground mb-0.5">
            Drop files here or click to upload
          </span>
          <span className="text-[10px] text-muted-foreground">
            PDF, Images up to 10MB
          </span>
        </div>

        {/* Attachment List */}
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="rounded-xl border border-border bg-card overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-3 py-2.5 border-b border-border">
              <div className="w-8 h-8 rounded-lg bg-[#7c3aed] flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-medium text-foreground truncate">
                  {attachment.name}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase">
                  {attachment.type}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors">
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors">
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className="p-1 rounded text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex items-center gap-1.5 p-2">
              {Array.from({ length: Math.min(attachment.thumbnails, 3) }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-16 rounded-md bg-muted"
                />
              ))}
              {attachment.thumbnails > 3 && (
                <div className="flex-1 h-16 rounded-md bg-muted/80 flex items-center justify-center">
                  <span className="text-sm font-bold text-muted-foreground">
                    +{attachment.thumbnails - 3}
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-muted/30">
              <div className="flex items-center gap-1">
                <Download className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">{attachment.size}</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors">
                  <Eye className="w-3 h-3" />
                </button>
                <button className="p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors">
                  <MoreVertical className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
