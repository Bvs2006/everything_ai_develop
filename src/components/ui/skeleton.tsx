import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-base-panel2", className)}
      aria-hidden="true"
    />
  );
}
