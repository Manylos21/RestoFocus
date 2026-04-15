import type { LucideIcon } from "lucide-react";

type DashboardStatCardProps = {
  title: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  variant?: "default" | "muted";
};

export function DashboardStatCard({
  title,
  value,
  hint,
  icon: Icon,
  variant = "default",
}: DashboardStatCardProps) {
  return (
    <div
      className={`rounded-xl border p-5 shadow-sm ${
        variant === "muted"
          ? "border-dashed border-zinc-200 bg-zinc-50/80"
          : "border-zinc-200/80 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-zinc-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
            {value}
          </p>
          {hint ? (
            <p className="mt-1 text-xs text-zinc-500">{hint}</p>
          ) : null}
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      </div>
    </div>
  );
}
