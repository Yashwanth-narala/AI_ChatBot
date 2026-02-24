"use client";

<<<<<<< HEAD
import { useState, useCallback } from "react";
import type { Chapter } from "@/types/chapter";
import { Navbar, TopicHeader } from "@/components/layout";
import { Sidebar } from "@/components/sidebar";
import RightPanel from "@/components/right-panel-new/RightPanel";
=======
import { useState } from "react";
import type { Chapter } from "@/types/chapter";
import { Sidebar } from "@/components/sidebar";
>>>>>>> 8e596ea (Add collapsible Sidebar and PrepdhaLogo component)

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

<<<<<<< HEAD
export default function PrepdhaPage() {
  const [selectedChapterId, setSelectedChapterId] = useState(
    CHAPTERS[0]?.id ?? ""
  );

  const selectedChapter =
    CHAPTERS.find((c) => c.id === selectedChapterId) ?? CHAPTERS[0];

  const [contextReference, setContextReference] = useState<string | null>(null);

  const handleClearReference = useCallback(() => {
    setContextReference(null);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5fb] flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      {/* Topic Header */}
      <TopicHeader
        title={selectedChapter.title}
        progress={selectedChapter.progress}
      />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 p-6">
          <Sidebar
            chapters={CHAPTERS}
            selectedChapterId={selectedChapterId}
            onSelectChapter={setSelectedChapterId}
          />
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex justify-end">
          <div className="h-full w-full max-w-md min-w-[320px] bg-background">
            <RightPanel
              contextReference={contextReference}
              onClearReference={handleClearReference}
              chapterContext={null}
              currentChapterId={selectedChapterId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
=======
export default function SidebarOnlyPage() {
  const [selectedChapterId, setSelectedChapterId] = useState(
    CHAPTERS[0]?.id ?? ""
  );

  return (
    <div className="min-h-screen bg-[#f5f5fb] p-6">
      {/* Centered container just for Sidebar */}
      <div className="mx-auto max-w-xs">
        <Sidebar
          chapters={CHAPTERS}
          selectedChapterId={selectedChapterId}
          onSelectChapter={setSelectedChapterId}
        />
      </div>
    </div>
  );
}
>>>>>>> 8e596ea (Add collapsible Sidebar and PrepdhaLogo component)
