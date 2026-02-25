"use client";

import { useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "../notes/ChatInput";

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
};

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = (text: string) => {
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", text };
    const aiMsg: Message = {
      id: crypto.randomUUID(),
      role: "ai",
      text: "Harsha was one of the youngest kings in Indian history...",
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto">
        
        {messages.map((m) => (
          <ChatMessage key={m.id} {...m} />
        ))}
      </div>

      <ChatInput onSend={sendMessage} />
    </div>
  );
}