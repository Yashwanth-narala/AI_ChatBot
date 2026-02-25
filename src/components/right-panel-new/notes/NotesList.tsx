export default function NotesList({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="space-y-3">
      <button
        onClick={onCreate}
        className="w-full rounded-lg bg-purple-600 py-2 text-white text-sm"
      >
        Add a Note
      </button>

      <div className="rounded-lg border p-3 text-sm">
        <p className="font-medium">Harsha’s Expedition</p>
        <p className="text-xs text-gray-500">Last edited just now</p>
      </div>
    </div>
  );
}