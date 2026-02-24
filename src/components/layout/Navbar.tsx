import { LightningIcon } from "@/components/ui/icons";
import { PrepdhaLogo } from "@/components/ui/PrepdhaLogo";

export function Navbar() {
  return (
    <header className="flex items-center justify-between border-b border-[--border-subtle] bg-white px-8 py-4 shadow-sm">
      <div className="flex items-center gap-3">
        <PrepdhaLogo />
        <span className="text-xl font-semibold tracking-tight">Prepdha</span>
      </div>

      <div className="flex-1 px-8">
        <div className="relative max-w-xl">
          <input
            type="search"
            placeholder="Search for keywords, topic, chapter, anything."
            className="w-full rounded-full border border-[--border-subtle] bg-[#f9fafb] px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[--accent-purple]"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-blue-500 text-white">
            <LightningIcon className="h-3 w-3" />
          </span>
          <span>1240 XP</span>
        </div>
        <div className="inline-flex items-center justify-center rounded-md border border-red-400 bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-600">
          80%
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-pink-500 text-xs font-semibold text-white">
          N
        </div>
      </div>
    </header>
  );
}
