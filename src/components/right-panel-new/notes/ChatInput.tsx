"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatInput({ onSend }: { onSend: (v: string) => void }) {
  const [value, setValue] = useState("");

  return (
    <div className="mt-3 flex items-center gap-2 border-t pt-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask anything about this chapter"
        className="flex-1 rounded-lg border px-3 py-2 text-sm"
      />
      <button
        onClick={() => {
          if (!value) return;
          onSend(value);
          setValue("");
        }}
        className="rounded-lg bg-purple-600 p-2 text-white"
      >
        <Send size={16} />
      </button>
    </div>
  );
}