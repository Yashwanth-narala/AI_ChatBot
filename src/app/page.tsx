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
    <div className="min-h-screen flex">
      {/* LEFT SIDEBAR */}
      <aside className="p-6">
        <Sidebar
          chapters={CHAPTERS}
          selectedChapterId={selectedChapterId}
          onSelectChapter={setSelectedChapterId}
        />
      </aside>

      {/* EMPTY MAIN AREA (for now) */}
      <main className="flex-1 p-6">
        <div className="h-full rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
          Main content will go here later
        </div>
      </main>
    </div>
  );
}
