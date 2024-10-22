import { cn } from "@/lib/utils";
import { AnyImportSource } from "@/types/import";

// components/import/ImportSourceCard.tsx
export default function ImportSourceCard({
  source,
  selected,
  onSelect,
}: {
  source: AnyImportSource;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "p-4 rounded-lg border-2 cursor-pointer transition-all",
        "hover:border-primary-500 hover:shadow-md",
        selected ? "border-primary-500 bg-primary-50" : "border-gray-200"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="text-primary-600">{source.icon}</div>
        <div>
          <h3 className="font-medium">{source.name}</h3>
          <p className="text-sm text-gray-500">{source.description}</p>
        </div>
      </div>
    </div>
  );
}