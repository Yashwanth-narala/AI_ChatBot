"use client";

import { useState, useCallback } from "react";
import type { Chapter } from "@/types/chapter";
import { Sidebar } from "@/components/sidebar";
import { RightPanel } from "@/components/right-panel";
import { StorySection } from "@/components/story-section";
import { storyCards } from "@/lib/data";
import { BookOpen } from "lucide-react";

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
    body: [],
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
    body: [],
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
    body: [],
  },
];

export default function PrepdhaPage() {
  const [selectedChapterId, setSelectedChapterId] = useState(
    CHAPTERS[0]?.id ?? ""
  );

  const [contextReference, setContextReference] = useState<string | null>(null);

  const handleClearReference = useCallback(() => {
    setContextReference(null);
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
                First Expedition Against Sasanka
              </h1>
              <p className="text-xs text-muted-foreground">
                History &gt; Social Studies &gt; Military Campaigns
              </p>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-6 py-8">
          <StorySection cards={storyCards} />
        </div>
      </main>

      {/* AI Right Panel */}
      <aside className="w-[380px] border-l border-border bg-card">
        <RightPanel
          contextReference={contextReference}
          onClearReference={handleClearReference}
          chapterContext={null}
          currentChapterId={selectedChapterId}
        />
      </aside>

    </div>
  );
}