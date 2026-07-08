import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const map: Record<string, string> = {
  New: "bg-blue-50 text-blue-700 border-blue-200",
  Screening: "bg-amber-50 text-amber-700 border-amber-200",
  Interview: "bg-violet-50 text-violet-700 border-violet-200",
  Offer: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Hired: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected: "bg-rose-50 text-rose-700 border-rose-200",
  Open: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Draft: "bg-slate-100 text-slate-700 border-slate-200",
  Closed: "bg-slate-100 text-slate-600 border-slate-200",
  "Under review": "bg-amber-50 text-amber-700 border-amber-200",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("rounded-full border font-medium", map[status] ?? "")}>
      {status}
    </Badge>
  );
}

export function MatchScorePill({ value }: { value: number }) {
  const tone =
    value >= 90
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : value >= 75
        ? "bg-blue-50 text-blue-700 border-blue-200"
        : value >= 60
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : "bg-rose-50 text-rose-700 border-rose-200";
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold", tone)}>
      {value}%
    </span>
  );
}
