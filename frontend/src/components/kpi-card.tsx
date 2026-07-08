import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  delta?: string;
  trend?: "up" | "down" | "flat";
  icon: LucideIcon;
}

export function KpiCard({ label, value, delta, trend = "up", icon: Icon }: KpiCardProps) {
  return (
    <Card className="border-border/60 shadow-[var(--shadow-card)]">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
          </div>
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </div>
        </div>
        {delta ? (
          <div
            className={cn(
              "mt-3 text-xs font-medium",
              trend === "up" && "text-success",
              trend === "down" && "text-destructive",
              trend === "flat" && "text-muted-foreground",
            )}
          >
            {delta}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
