"use client";

import { useState } from "react";
import NotesList from "./NotesList";
import NoteEditor from "./NoteEditor";

export default function NotesPanel() {
  const [editing, setEditing] = useState(false);

  return editing ? (
    <NoteEditor onClose={() => setEditing(false)} />
  ) : (
    <NotesList onCreate={() => setEditing(true)} />
  );
}