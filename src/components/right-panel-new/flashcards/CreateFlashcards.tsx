"use client";

import { useState } from "react";

interface CreateFlashcardsProps {
  onDone: () => void;
}

export default function CreateFlashcards({ onDone }: CreateFlashcardsProps) {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [instructions, setInstructions] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // placeholder action - in real app you'd call AI service
    console.log("creating flashcards", { title, topic, difficulty, instructions });
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm font-medium">
        Title
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </label>

      <label className="block text-sm font-medium">
        Topic
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </label>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Difficulty</legend>
        <div className="flex items-center gap-4">
          {(["easy", "medium", "hard"] as const).map((level) => (
            <label key={level} className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="difficulty"
                value={level}
                checked={difficulty === level}
                onChange={() => setDifficulty(level)}
                className="form-radio"
              />
              <span className="text-sm capitalize">{level}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block text-sm font-medium">
        Instructions to AI
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          rows={3}
          placeholder="Eg: Flashcards on Sasanka Expedition..."
        />
      </label>

      <button
        type="submit"
        className="w-full rounded-lg bg-purple-600 py-2 text-white text-sm"
      >
        Create
      </button>
    </form>
  );
}