import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "panel p-5 transition-colors hover:border-cyan/40",
        className
      )}
      {...props}
    />
  );
}
