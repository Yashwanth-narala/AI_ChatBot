"use client";

import { useState } from "react";
import RightPanelTabs from "./RightPanelTabs";
import ChatPanel from "./chat/ChatPanel";
import FlashcardsPanel from "./flashcards/FlashcardsPanel";
import NotesPanel from "./notes/NotesPanel";

export type RightPanelView = "chat" | "flashcards" | "notes";

export default function RightPanel() {
  const [view, setView] = useState<RightPanelView>("chat");

  return (
    <aside className="w-[360px] shrink-0 border-l bg-white flex flex-col">
      <RightPanelTabs active={view} onChange={setView} />

      <div className="flex-1 overflow-y-auto p-4">
        {view === "chat" && <ChatPanel />}
        {view === "flashcards" && <FlashcardsPanel />}
        {view === "notes" && <NotesPanel />}
      </div>
    </aside>
  );
}