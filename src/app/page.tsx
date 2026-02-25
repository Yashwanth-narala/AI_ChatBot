"use client";

import { useState, useCallback } from "react";
import type { Chapter } from "@/types/chapter";
import { Sidebar } from "@/components/sidebar";
import { RightPanel } from "@/components/right-panel";
import { StorySection } from "@/components/story-section";
import { storyCards } from "@/lib/data";
import { BookOpen } from "lucide-react";

// Generate chapters from story cards
const CHAPTERS: Chapter[] = storyCards.map((card, index) => ({
  id: card.id,
  title: card.title,
  status: index === 0 ? "in-progress" : index === 1 ? "completed" : "not-started",
  progress: index === 0 ? 30 : index === 1 ? 100 : 0,
  badgeText: index === 0 ? "30% completed" : index === 1 ? "Completed" : undefined,
  statusLabel: index === 0 ? "30%" : index === 1 ? "Completed" : "Not started",
  partLabel: card.label,
  bodyHeading: card.title,
  body: [card.description],
}));

export default function PrepdhaPage() {
  const [selectedChapterId, setSelectedChapterId] = useState(
    CHAPTERS[0]?.id ?? ""
  );

  const selectedChapter = CHAPTERS.find((c) => c.id === selectedChapterId);

  const chapterContext = selectedChapter ? 
    `Chapter: ${selectedChapter.title}\nDescription: ${selectedChapter.body[0]?.substring(0, 500) || ''}...` : 
    null;

  const [contextReference, setContextReference] = useState<string | null>(null);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const handleClearReference = useCallback(() => {
    setContextReference(null);
  }, []);

  const handleAskAI = useCallback((text: string) => {
    setPendingMessage(text);
  }, []);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-80 border-r border-border bg-card p-6">
        <Sidebar
          chapters={CHAPTERS}
          selectedChapterId={selectedChapterId}
          onSelectChapter={setSelectedChapterId}
        />
      </aside>

      {/* Main Story Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                {selectedChapter?.title || "Chapter"}
              </h1>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-6 py-8">
          <StorySection cards={storyCards.filter(card => card.id === selectedChapterId)} chapter={selectedChapter} onAskAI={handleAskAI} />
        </div>
      </main>

      {/* AI Right Panel */}
      <aside className="w-[380px] border-l border-border bg-card">
        <RightPanel
          contextReference={contextReference}
          onClearReference={handleClearReference}
          chapterContext={chapterContext}
          currentChapterId={selectedChapterId}
          pendingMessage={pendingMessage}
          onPendingMessageHandled={() => setPendingMessage(null)}
        />
      </aside>

    </div>
  );
}