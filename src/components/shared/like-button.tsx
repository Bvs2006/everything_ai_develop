"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function LikeButton({
  type,
  targetId,
  initialCount,
  initiallyLiked = false,
}: {
  type: "DISCUSSION" | "COMMENT" | "PROJECT" | "ARTICLE";
  targetId: string;
  initialCount: number;
  initiallyLiked?: boolean;
}) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(initiallyLiked);
  const [isPending, startTransition] = useTransition();

  function onClick() {
    // Optimistic update; the API route (to be wired to the session user)
    // handles auth + persistence via src/lib/likes.ts.
    setLiked((v) => !v);
    setCount((c) => (liked ? c - 1 : c + 1));
    startTransition(async () => {
      try {
        await fetch(`/api/likes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, targetId }),
        });
      } catch {
        // revert on failure
        setLiked((v) => !v);
        setCount((c) => (liked ? c + 1 : c - 1));
      }
    });
  }

  return (
    <button
      onClick={onClick}
      disabled={isPending}
      className={cn(
        "inline-flex items-center gap-2 rounded-md border border-base-border px-3 py-1.5 font-mono text-sm text-ink-muted hover:border-amber/50 hover:text-amber",
        liked && "border-amber/50 text-amber"
      )}
    >
      <Heart className={cn("h-4 w-4", liked && "fill-amber")} />
      {count}
    </button>
  );
}
