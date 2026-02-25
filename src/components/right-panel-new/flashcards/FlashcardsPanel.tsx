"use client";

import { useState } from "react";
import CreateFlashcards from "./CreateFlashcards";
import FlashcardList from "./FlashcardList";

export default function FlashcardsPanel() {
  const [creating, setCreating] = useState(false);

  return creating ? (
    <CreateFlashcards onDone={() => setCreating(false)} />
  ) : (
    <FlashcardList onCreate={() => setCreating(true)} />
  );
}