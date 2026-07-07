"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export function HeroSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    router.push(`/search?q=${encodeURIComponent(value.trim())}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center gap-3 rounded-md border border-base-border bg-base-panel px-4 py-3 font-mono text-sm focus-within:border-cyan/60"
    >
      <Search className="h-4 w-4 shrink-0 text-ink-faint" />
      <span className="text-amber">$</span>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="search frameworks, sdks, tools, templates…"
        aria-label="Search the registry"
        className="w-full bg-transparent text-ink placeholder:text-ink-faint focus:outline-none"
      />
      <span className="h-4 w-2 animate-blink bg-cyan" aria-hidden="true" />
    </form>
  );
}
