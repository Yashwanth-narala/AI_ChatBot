"use client";

import { useState } from "react";
import type { ChatMessage } from "@/types/chat";
import type { Chapter } from "@/types/chapter";
import { Navbar, TopicHeader } from "@/components/layout";
import { Sidebar } from "@/components/sidebar";
// import { Mainbar } from "@/components/mainbar";
// import { Chatbot } from "@/components/chatbot";

const CHAPTERS: Chapter[] = [
  {
    id: "first-expedition",
    title: "First Expedition Against Sasanka",
    status: "in-progress",
    progress: 30,
    badgeText: "30% completed",
    statusLabel: "30%",
    partLabel: "Part 1",
    bodyHeading: "The Challenge Ahead",
    body: [
      "When Harsha ascended to the throne at just sixteen years old in 606 CE, he faced one of the greatest challenges of his young life. His family had suffered terrible tragedies at the hands of King Sasanka of Gauda. Sasanka was a powerful and treacherous ruler who had caused the death of Harsha's brother and driven his sister into exile.",
      "In this chapter, you will explore how Harsha prepared for his first major expedition against Sasanka and what this conflict reveals about leadership, loyalty, and courage.",
    ],
  },
  {
    id: "conquest-after-death",
    title: "Conquest after Sasanka's death",
    status: "not-started",
    progress: 0,
    badgeText: undefined,
    statusLabel: "Not started",
    partLabel: "Overview",
    bodyHeading: "Aftermath of the Conflict",
    body: [
      "After Sasanka's death, new political opportunities and threats emerged across northern India. Harsha had to decide how far he was willing to extend his power while maintaining stability within his kingdom.",
      "This section introduces the key regions, rulers, and decisions that shaped the next phase of Harsha's rule.",
    ],
  },
  {
    id: "conquest-of-magadha",
    title: "Conquest of Magadha",
    status: "not-started",
    progress: 0,
    badgeText: undefined,
    statusLabel: "Not started",
    partLabel: "Prelude",
    bodyHeading: "Towards Magadha",
    body: [
      "Magadha was one of the most important regions in ancient India, both politically and culturally. Any ruler seeking lasting influence in the Gangetic plain had to reckon with its power.",
      "In this part of the course, you will examine why Magadha mattered so much and how Harsha planned his expansion into the region.",
    ],
  },
];

export default function LearningChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "This chapter discusses Sasanka's reign and the first major military expedition against him.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [isSelectionActive, setIsSelectionActive] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    CHAPTERS[0]?.id ?? "",
  );

  const selectedChapter: Chapter =
    CHAPTERS.find((chapter) => chapter.id === selectedChapterId) ??
    CHAPTERS[0];

  async function sendMessage(prompt?: string) {
    const text = prompt ?? input.trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are a helpful history tutor for middle-school students. Explain clearly and stay focused on the current chapter.",
            },
            ...messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            { role: "user", content: text },
          ],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          typeof data?.error === "string"
            ? data.error
            : "The server returned an error. Please check your API key and try again.";
        throw new Error(errorMessage);
      }

      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.content,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const messageText =
        error instanceof Error && error.message
          ? error.message
          : "I'm having trouble reaching the learning AI right now. Please check that your API key is configured, then try again.";

      const assistantMessage: ChatMessage = {
        id: Date.now() + 2,
        role: "assistant",
        content: messageText,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleTextSelection() {
    const selection = window.getSelection();
    const text = selection?.toString().trim() ?? "";

    if (text) {
      setSelectedText(text);
      setIsSelectionActive(true);
    } else {
      setSelectedText("");
      setIsSelectionActive(false);
    }
  }

  async function handleAskAiForSelection() {
    if (!selectedText) return;
    await sendMessage(
      `Explain the following highlighted passage from the chapter in simple terms:\n\n"${selectedText}"`
    );
  }

  function handleCopySelection() {
    if (!selectedText || typeof navigator === "undefined") return;
    void navigator.clipboard?.writeText(selectedText);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void sendMessage();
  }

  return (
    <div className="min-h-screen bg-[#f5f5fb]">
      <Navbar />
      <TopicHeader title={selectedChapter.title} progress={selectedChapter.progress} />

      <main className="mx-auto flex max-w-6xl gap-4 px-6 py-6">
        <Sidebar
          chapters={CHAPTERS}
          selectedChapterId={selectedChapterId}
          onSelectChapter={setSelectedChapterId}
        />
        {/* <Mainbar
          chapter={selectedChapter}
          selectedText={selectedText}
          isSelectionActive={isSelectionActive}
          onTextSelection={handleTextSelection}
          onAskAi={handleAskAiForSelection}
          onCopyText={handleCopySelection}
        />
        <Chatbot
          messages={messages}
          input={input}
          onInputChange={setInput}
          isLoading={isLoading}
          onSendMessage={sendMessage}
          onSubmit={handleSubmit}
        /> */}
      </main>
    </div>
  );
}
