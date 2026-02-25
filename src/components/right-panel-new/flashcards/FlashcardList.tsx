export default function FlashcardList({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="space-y-3">
      <p>Generate Flashcards Let Ai create flashcards for this topic or folloew a new step</p>
      <button
        onClick={onCreate}
        className="w-full rounded-lg bg-purple-600 py-2 text-white text-sm"
      >
        Generate Flashcards with AI
      </button>
      <button
        onClick={onCreate}
        className="w-full rounded-lg bg-white border-greey py-2 font-blold text-black text-sm"
      >
        Generate Yourself
      </button>

      <div className="rounded-lg border p-3 text-sm">
        <p className="font-medium">Sasanka vs Harsha</p>
        <p className="text-xs text-gray-500">12 cards</p>
      </div>
    </div>
  );
}