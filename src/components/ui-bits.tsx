import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import type { SkillStatus } from "@/lib/skill-match";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: LucideIcon;
  tone?: "primary" | "accent" | "muted";
}) {
  return (
    <Card className="border-border/80 shadow-none">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        {Icon ? (
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-md",
              tone === "primary" && "bg-primary/10 text-primary",
              tone === "accent" && "bg-accent/10 text-accent",
              tone === "muted" && "bg-muted text-muted-foreground",
            )}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </span>
        ) : null}
      </CardContent>
    </Card>
  );
}

const statusStyles: Record<SkillStatus, string> = {
  met: "bg-[var(--success)]",
  partial: "bg-[var(--warning)]",
  gap: "bg-destructive",
};

const statusText: Record<SkillStatus, string> = {
  met: "text-[var(--success)]",
  partial: "text-[var(--warning)]",
  gap: "text-destructive",
};

export const statusLabel: Record<SkillStatus, string> = {
  met: "Meets requirement",
  partial: "Partially meets",
  gap: "Skill gap",
};

export function SkillBar({
  name,
  value,
  required,
  status = "met",
  category,
}: {
  name: string;
  value: number;
  required?: number;
  status?: SkillStatus;
  category?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium text-foreground">
          {name}
          {category ? (
            <span className="ml-2 text-xs font-normal text-muted-foreground">{category}</span>
          ) : null}
        </span>
        <span className={cn("tabular-nums font-medium", statusText[status])}>
          {value}%{required !== undefined ? ` / ${required}% needed` : ""}
        </span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", statusStyles[status])}
          style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}

export function MatchBadge({ score, size = "md" }: { score: number; size?: "sm" | "md" }) {
  const tone = score >= 75 ? "met" : score >= 50 ? "partial" : "gap";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-semibold tabular-nums",
        size === "sm" ? "text-xs" : "text-sm",
        tone === "met" && "border-[var(--success)]/30 bg-[var(--success)]/10 text-[var(--success)]",
        tone === "partial" &&
          "border-[var(--warning)]/40 bg-[var(--warning)]/10 text-[var(--warning)]",
        tone === "gap" && "border-destructive/30 bg-destructive/10 text-destructive",
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", statusStyles[tone as SkillStatus])}
        aria-hidden
      />
      {score}% match
    </span>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function DemoNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-md border border-border bg-[var(--surface)] px-3 py-2 text-xs text-muted-foreground">
      {children}
    </p>
  );
}
