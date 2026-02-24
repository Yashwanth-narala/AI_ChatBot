"use client";

import { useState } from "react";
import type { Chapter } from "@/types/chapter";
import { Sidebar } from "@/components/sidebar";

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