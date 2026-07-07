import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "amber" | "cyan" | "good" | "bad";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "border-base-border bg-base-panel2 text-ink-muted",
    amber: "border-amber/30 bg-amber-soft text-amber",
    cyan: "border-cyan/30 bg-cyan-soft text-cyan",
    good: "border-good/30 bg-good/10 text-good",
    bad: "border-bad/30 bg-bad/10 text-bad",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 font-mono text-xs",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
