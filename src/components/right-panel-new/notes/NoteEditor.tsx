"use client";

export default function NoteEditor({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <textarea
        className="flex-1 rounded-lg border p-3 text-sm"
        placeholder="Write your notes here..."
      />

      <button
        onClick={onClose}
        className="mt-3 rounded-lg bg-purple-600 py-2 text-white text-sm"
      >
        Save Note
      </button>
    </div>
  );
}