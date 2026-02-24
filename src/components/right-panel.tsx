"use client"

import { useState, useCallback, useEffect } from "react"
import { ChatPanel, AISummaryPanel } from "./chat-panel"
import { FlashcardsPanel } from "./flashcards-panel"
import { QuestionsPanel } from "./questions-panel"
import { NotesPanel } from "./notes-panel"
import { AttachmentsPanel } from "./attachments-panel"
import {
  MessageSquare,
  BookOpen,
  HelpCircle,
  FileText,
  Paperclip,
  Pencil,
  X,
  Plus,
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  reference?: string
  image?: string
}

interface ChatThread {
  id: string
  title: string
  messages: Message[]
  chapterId: string | null
}

type TabId = "chat" | "flashcards" | "questions" | "notes" | "attachments" | "edit"

const tabs: { id: TabId; icon: typeof MessageSquare; label: string }[] = [
  { id: "chat", icon: MessageSquare, label: "Chat" },
  { id: "flashcards", icon: BookOpen, label: "Flashcards" },
  { id: "questions", icon: HelpCircle, label: "Questions" },
  { id: "notes", icon: FileText, label: "Notes" },
  { id: "attachments", icon: Paperclip, label: "Attachments" },
  { id: "edit", icon: Pencil, label: "Edit" },
]

// Pre-populated chat threads to match the Figma design
const initialThreads: ChatThread[] = [
  {
    id: "thread-1",
    title: "Youngest Kings in History",
    chapterId: "chapter-2",
    messages: [
      {
        id: "t1-1",
        role: "user",
        content: "Has anyone else ever ascended to throne in such a young age?",
        timestamp: "2:23 PM",
        reference: "When Harsha ascended to the throne at just sixteen years old in 606 CE",
      },
      {
        id: "t1-2",
        role: "assistant",
        content:
          "Yes, Harsha wasn't alone in ascending the throne at such a young age. History is full of monarchs who became rulers as children or teenagers, sometimes even infants. Here are a few notable examples:\n\n- Tutankhamun became pharaoh at around 9 years old\n- Alexander the Great became king at 20\n- Mary Queen of Scots became queen when she was just 6 days old",
        timestamp: "2:23 PM",
      },
    ],
  },
  {
    id: "thread-2",
    title: "Topic explanation as a five year old",
    chapterId: "chapter-2",
    messages: [
      {
        id: "t2-1",
        role: "user",
        content: "Explain like I'm five",
        timestamp: "2:20 PM",
      },
      {
        id: "t2-2",
        role: "assistant",
        content:
          "Imagine a teenager who suddenly had to become the boss of a really, really big team. His older brother, who was supposed to be the boss, was tricked and hurt by a mean neighbor named Sasanka. So this teenager, Harsha, said \"I will take care of my people. I will protect them.\" Even though he was still very young, Harsha put on the crown and became a wise and powerful ruler.",
        timestamp: "2:20 PM",
      },
    ],
  },
  {
    id: "thread-3",
    title: "Summary of \"First Expedition Aga...",
    chapterId: "chapter-2",
    messages: [
      {
        id: "t3-1",
        role: "user",
        content: "Summarize topic",
        timestamp: "2:18 PM",
      },
      {
        id: "t3-2",
        role: "assistant",
        content:
          "This chapter covers the first military expedition against Sasanka. Key points:\n\n- Harsha ascended the throne at just 16 years old in 606 CE\n- His brother Rajyavardhana was killed by Sasanka\n- Harsha vowed to avenge his brother's death\n- The expedition marked the beginning of Harsha's rise as a major ruler in North India",
        timestamp: "2:18 PM",
      },
    ],
  },
]

interface RightPanelProps {
  contextReference: string | null
  chapterContext: string | null
  onClearReference: () => void
  currentChapterId: string | null
}

export function RightPanel({
  contextReference,
  chapterContext,
  onClearReference,
  currentChapterId,
}: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>("chat")
  const [threads, setThreads] = useState<ChatThread[]>(initialThreads)
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  const [activeThreadByChapter, setActiveThreadByChapter] = useState<
    Record<string, string | null>
  >({})
  const [showHistory, setShowHistory] = useState(false)
  const [showSummary, setShowSummary] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const activeThread = threads.find((t) => t.id === activeThreadId) ?? null

  // When the chapter changes, restore that chapter's last active chat (if any),
  // otherwise show the summary for a fresh start.
  useEffect(() => {
    if (!currentChapterId) return

    const lastActiveForChapter = activeThreadByChapter[currentChapterId] ?? null
    setShowHistory(false)

    if (lastActiveForChapter) {
      setActiveThreadId(lastActiveForChapter)
      setShowSummary(false)
    } else {
      setActiveThreadId(null)
      setShowSummary(true)
    }
  }, [currentChapterId, activeThreadByChapter])

  const getSuggestionsForThread = useCallback((thread: ChatThread | null): string[] => {
    if (!thread || thread.messages.length === 0) {
      return [
        "Explain this slowly step by step",
        "Explain like I'm five using a short story",
        "Give me 3 practice questions on this chapter",
      ]
    }

    const lastUser = [...thread.messages].reverse().find((m) => m.role === "user")
    const lastAssistant = [...thread.messages].reverse().find(
      (m) => m.role === "assistant"
    )

    const userText = lastUser?.content.toLowerCase() ?? ""
    const assistantText = lastAssistant?.content.toLowerCase() ?? ""

    // If we just summarized, suggest follow‑ups that go deeper
    if (userText.includes("summarize") || assistantText.includes("summary")) {
      return [
        "Explain this slowly step by step",
        "Give me a simple real‑life example",
        "Ask me 3 questions to check my understanding",
      ]
    }

    // If we just had an explanation, suggest applications and checks
    if (userText.includes("explain")) {
      return [
        "Give me a quick summary in 3 lines",
        "List the most important reasons or causes",
        "Create a short quiz (3 questions) on this explanation",
      ]
    }

    // Generic fall‑back suggestions
    return [
      "Explain this slowly step by step",
      "Explain like I'm five using a short story",
      "Give me 3 practice questions on this chapter",
    ]
  }, [])

  const handleNewChat = useCallback(() => {
    setActiveThreadId(null)
    setShowHistory(false)
    setShowSummary(true)
    if (currentChapterId) {
      setActiveThreadByChapter((prev) => ({
        ...prev,
        [currentChapterId]: null,
      }))
    }
  }, [currentChapterId])

  const handleSelectThread = useCallback((threadId: string) => {
    setActiveThreadId(threadId)
    setShowHistory(false)
    setShowSummary(false)
    if (currentChapterId) {
      setActiveThreadByChapter((prev) => ({
        ...prev,
        [currentChapterId]: threadId,
      }))
    }
  }, [currentChapterId])

  const sendToAI = useCallback(
    async (
      threadId: string,
      messages: Message[],
      reference?: string,
      chapterFallback?: string | null
    ) => {
      try {
        setIsSending(true)
        setError(null)

        const placeholderId = `${threadId}-ai-${Date.now()}`
        const placeholderTimestamp = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })

        const placeholderMsg: Message = {
          id: placeholderId,
          role: "assistant",
          content: "",
          timestamp: placeholderTimestamp,
        }

        setThreads((prev) =>
          prev.map((t) =>
            t.id === threadId
              ? { ...t, messages: [...t.messages, placeholderMsg] }
              : t
          )
        )

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            context: reference ?? chapterFallback ?? undefined,
          }),
        })

        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}))
          throw new Error(errorBody?.error || "Failed to get a response from AI")
        }

        const data = await response.json()
        const aiContent: string =
          typeof data?.content === "string"
            ? data.content
            : "I’m sorry, I couldn’t generate a response. Please try again."

        let index = 0
        const step = Math.max(2, Math.floor(aiContent.length / 80))

        const interval = setInterval(() => {
          index += step
          const nextText =
            index >= aiContent.length
              ? aiContent
              : aiContent.slice(0, index)

          setThreads((prev) =>
            prev.map((t) =>
              t.id === threadId
                ? {
                    ...t,
                    messages: t.messages.map((m) =>
                      m.id === placeholderId ? { ...m, content: nextText } : m
                    ),
                  }
                : t
            )
          )

          if (index >= aiContent.length) {
            clearInterval(interval)
          }
        }, 20)
      } catch (err) {
        console.error(err)
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while talking to the AI."
        )
      } finally {
        setIsSending(false)
      }
    },
    []
  )

  const handleSendMessage = useCallback(
    async (text: string) => {
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })

      if (!activeThreadId) {
        // Create a new thread
        const newTitle = text.length > 30 ? text.slice(0, 30) + "..." : text
        const newId = `thread-${Date.now()}`
        const userMsg: Message = {
          id: `${newId}-1`,
          role: "user",
          content: text,
          timestamp,
          reference: contextReference || undefined,
        }
        const newThread: ChatThread = {
          id: newId,
          title: newTitle,
          messages: [userMsg],
          chapterId: currentChapterId ?? null,
        }
        setThreads((prev) => [newThread, ...prev])
        setActiveThreadId(newId)
        setShowSummary(false)
        if (currentChapterId) {
          setActiveThreadByChapter((prev) => ({
            ...prev,
            [currentChapterId]: newId,
          }))
        }

        if (contextReference) onClearReference()

        void sendToAI(newId, [userMsg], contextReference || chapterContext)
      } else {
        // Add to existing thread
        const userMsg: Message = {
          id: Date.now().toString(),
          role: "user",
          content: text,
          timestamp,
          reference: contextReference || undefined,
        }
        const currentThread = threads.find((t) => t.id === activeThreadId)
        const messagesForApi = currentThread
          ? [...currentThread.messages, userMsg]
          : [userMsg]

        setThreads((prev) =>
          prev.map((t) =>
            t.id === activeThreadId
              ? { ...t, messages: [...t.messages, userMsg] }
              : t
          )
        )
        if (contextReference) onClearReference()

        void sendToAI(
          activeThreadId,
          messagesForApi,
          contextReference || chapterContext
        )
      }
    },
    [
      activeThreadId,
      contextReference,
      chapterContext,
      threads,
      onClearReference,
      sendToAI,
      currentChapterId,
    ]
  )

  return (
    <div className="flex flex-col w-full min-w-0 h-full bg-card border-l border-border">
      {/* Tab Icons */}
      <div className="flex items-center justify-center gap-1 px-3 py-2.5 border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-[#7c3aed] text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              aria-label={tab.label}
              title={tab.label}
            >
              <Icon className="w-4 h-4" />
            </button>
          )
        })}
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === "chat" && (
          <>
            {/* Chat History Drawer */}
            {showHistory && (
              <div className="border-b border-border bg-card">
                {/* History Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowHistory(false)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Close chat history"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-semibold text-foreground">
                      Chats
                    </span>
                  </div>
                  <button
                    onClick={handleNewChat}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#7c3aed]/10 text-[#7c3aed] font-medium hover:bg-[#7c3aed]/20 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    New
                  </button>
                </div>
                {/* Thread List */}
                <div className="max-h-48 overflow-y-auto">
                  {threads
                    .filter((thread) =>
                      currentChapterId
                        ? thread.chapterId === currentChapterId
                        : thread.chapterId === null
                    )
                    .map((thread) => (
                      <button
                        key={thread.id}
                        onClick={() => handleSelectThread(thread.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-muted transition-colors ${
                          activeThreadId === thread.id
                            ? "bg-[#7c3aed]/5"
                            : ""
                        }`}
                      >
                        <MessageSquare className="w-4 h-4 text-[#7c3aed] shrink-0" />
                        <span className="text-sm text-foreground truncate">
                          {thread.title}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Chat Content */}
            <div className="flex-1 overflow-hidden">
              {showSummary && !activeThread ? (
                <AISummaryPanel
                  onSendMessage={handleSendMessage}
                  contextReference={contextReference}
                  onClearReference={onClearReference}
                  onOpenHistory={() => setShowHistory(true)}
                  chapterId={currentChapterId}
                />
              ) : activeThread ? (
                <ChatPanel
                  messages={activeThread.messages}
                  onSendMessage={handleSendMessage}
                  suggestions={getSuggestionsForThread(activeThread)}
                  contextReference={contextReference}
                  onClearReference={onClearReference}
                  title={activeThread.title}
                  onOpenHistory={() => setShowHistory(true)}
                />
              ) : (
                <AISummaryPanel
                  onSendMessage={handleSendMessage}
                  contextReference={contextReference}
                  onClearReference={onClearReference}
                  onOpenHistory={() => setShowHistory(true)}
                  chapterId={currentChapterId}
                />
              )}
            </div>
          </>
        )}
        {activeTab === "flashcards" && <FlashcardsPanel />}
        {activeTab === "questions" && <QuestionsPanel />}
        {activeTab === "notes" && <NotesPanel />}
        {activeTab === "attachments" && <AttachmentsPanel />}
        {activeTab === "edit" && (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-sm font-medium text-foreground">
                Edit Mode
              </span>
            </div>
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#7c3aed]/10 flex items-center justify-center mx-auto mb-3">
                  <Pencil className="w-5 h-5 text-[#7c3aed]" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Edit Content
                </p>
                <p className="text-xs text-muted-foreground">
                  Select text in the reader to edit or annotate content
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Simple error / status message */}
      {error && (
        <div className="px-4 py-2 text-xs text-red-600 border-t border-border bg-red-50">
          {error}
        </div>
      )}
      {isSending && !error && (
        <div className="px-4 py-2 text-xs text-muted-foreground border-t border-border bg-muted/40">
          Generating AI response...
        </div>
      )}
    </div>
  )
}
