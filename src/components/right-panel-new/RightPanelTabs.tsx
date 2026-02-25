import { MessageSquare, BookOpen, FileText } from "lucide-react";
import { RightPanelView } from "./RightPanel";

type Props = {
  active: RightPanelView;
  onChange: (v: RightPanelView) => void;
};

export default function RightPanelTabs({ active, onChange }: Props) {
  const tabClass = (isActive: boolean) =>
    `p-2 rounded-lg ${
      isActive ? "bg-purple-600 text-white" : "text-gray-500 hover:bg-gray-100"
    }`;

  return (
    <div className="flex items-center gap-2 border-b p-2">
      <button className={tabClass(active === "chat")} onClick={() => onChange("chat")}>
        <MessageSquare size={18} />
      </button>

      <button
        className={tabClass(active === "flashcards")}
        onClick={() => onChange("flashcards")}
      >
        <BookOpen size={18} />
      </button>

      <button className={tabClass(active === "notes")} onClick={() => onChange("notes")}>
        <FileText size={18} />
      </button>
    </div>
  );
}