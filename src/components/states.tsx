import { AlertTriangle, Inbox, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card p-8 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card p-8 text-center">
      <Inbox className="h-6 w-6 text-muted-foreground" aria-hidden />
      <p className="font-medium text-foreground">{title}</p>
      {description ? (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action}
    </div>
  );
}

export function ErrorState({ message }: { message?: string }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center">
      <AlertTriangle className="h-6 w-6 text-destructive" aria-hidden />
      <p className="font-medium text-foreground">Something went wrong</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        {message ?? "Please refresh the page and try again."}
      </p>
    </div>
  );
}
