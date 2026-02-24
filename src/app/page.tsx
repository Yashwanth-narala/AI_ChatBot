import { StorySection } from "@/components/story-section";
import { storyCards } from "@/lib/data";
import { BookOpen } from "lucide-react";

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              First Expedition Against Sasanka
            </h1>
            <p className="text-xs text-muted-foreground">
              {"History > Social Studies > Military Campaigns and Expansion"}
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-8">
        <StorySection cards={storyCards} />
      </div>
    </main>
  );
}
