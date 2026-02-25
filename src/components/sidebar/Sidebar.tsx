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
  // 👇 START CLOSED
  const [isOpen, setIsOpen] = useState(false);

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

      {/* Content (hidden initially) */}
      {isOpen && (
        <>
          {/* Chapter list */}
          <div className="space-y-2 text-sm">
            {chapters.map((chapter) => {
              const isActive = chapter.id === selectedChapterId;

              return (
                <button
                  key={chapter.id}
                  type="button"
                  onClick={() => onSelectChapter(chapter.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[13px] transition ${
                    isActive
                      ? "bg-[#eef2ff] font-semibold text-[--accent-purple]"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {/* Title + badge */}
                  <span className="flex flex-col">
                    <span className="truncate">{chapter.title}</span>
                    {chapter.badgeText && (
                      <span className="text-[10px] font-medium text-gray-500">
                        {chapter.badgeText}
                      </span>
                    )}
                  </span>

                  {/* Status / Progress */}
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-semibold ${
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