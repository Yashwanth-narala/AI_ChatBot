import { LightningIcon, CheckIcon } from "@/components/ui/icons";

type TopicHeaderProps = {
  title: string;
  progress: number;
};

export function TopicHeader({ title, progress }: TopicHeaderProps) {
  const clamped = Math.max(0, Math.min(progress, 100));

  return (
    <section className="border-b border-[--border-subtle] bg-white/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>History</span>
          <span>/</span>
          <span>Social Studies</span>
          <span>/</span>
          <span>Military Campaigns and Expansion</span>
        </div>
        <div className="flex items-center justify-between gap-4">
        <div className="font-black text-2xl font-weight:bold border-grey border-2 rounded-md p-2">&lt;</div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-[11px] font-semibold text-yellow-800">
              Needs Attention
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium">
            <span className="text-gray-500">Progress</span>
            <div className="h-2 w-28 rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-green-500 progress-fill"
                style={{ ["--progress" as string]: `${clamped}%` }}
              />
            </div>
            <div className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-600">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                <LightningIcon className="h-3 w-3" />
              </span>
              <span>54 XP</span>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-[--accent-purple] bg-white px-4 py-1.5 text-[11px] font-semibold text-[--accent-purple] hover:bg-purple-50"
            >
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[--accent-purple] text-white">
                <CheckIcon className="h-2.5 w-2.5" />
              </span>
              <span>Mark Complete</span>
            </button>
          </div>
        </div>
       
      </div>
    </section>
  );
}
