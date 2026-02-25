"use client";

import { useState } from "react";
import type { Chapter } from "@/types/chapter";
import { ChevronDown } from "lucide-react";

type SidebarProps = {
  chapters: Chapter[];
  selectedChapterId: string;
  onSelectChapter: (id: string) => void;
};

export function Sidebar({
  chapters,
  selectedChapterId,
  onSelectChapter,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className="w-64 shrink-0 rounded-2xl bg-white p-4 shadow-sm">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="mb-4 flex w-full items-center justify-between rounded-xl border border-[--border-subtle] bg-[#f9fafb] px-3 py-2 text-xs font-medium text-gray-700"
      >
        <span>Chapters</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Content (only when open) */}
      {isOpen && (
        <>
          {/* Category */}
          <div className="mb-3 text-[10px] font-medium uppercase tracking-wide text-gray-500">
            History / Social Studies / Military Campaigns and Expansion
          </div>

          {/* Chapter list */}
          <div className="space-y-2 text-sm">
            {chapters.map((chapter) => {
              const isActive = chapter.id === selectedChapterId;

              return (
                <button
                  key={chapter.id}
                  type="button"
                  onClick={() => onSelectChapter(chapter.id)}
                  className={`flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left text-[13px] transition ${
                    isActive
                      ? "bg-[#eef2ff] font-semibold text-[--accent-purple]"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {/* Left: title + subtitle */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate">
                      {chapter.title}
                    </span>

                    {chapter.badgeText && (
                      <span className="text-[10px] text-gray-500">
                        {chapter.badgeText}
                      </span>
                    )}
                  </div>

                  {/* Right: status / progress */}
                  <span
                    className={`shrink-0 flex h-7 min-w-[36px] items-center justify-center rounded-full text-[10px] font-semibold ${
                      chapter.status === "in-progress"
                        ? "bg-white text-[--accent-purple]"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {chapter.status === "in-progress"
                      ? `${chapter.progress}%`
                      : chapter.statusLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </aside>
  );
}