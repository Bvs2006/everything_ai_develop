import Link from "next/link";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/frameworks", label: "Frameworks" },
  { href: "/sdks", label: "SDKs" },
  { href: "/tools", label: "Tools" },
  { href: "/templates", label: "Templates" },
  { href: "/articles", label: "Articles" },
  { href: "/community", label: "Community" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-base-border bg-base/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="text-amber">$</span>
          everything<span className="text-cyan">.ai</span>develop
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-sm px-3 py-2 font-mono text-sm text-ink-muted transition-colors hover:bg-base-panel2 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/search"
            className="hidden items-center gap-2 rounded-md border border-base-border bg-base-panel px-3 py-1.5 font-mono text-xs text-ink-faint hover:border-cyan/50 sm:flex"
          >
            <span className="text-cyan">/</span>
            search registry…
          </Link>
          <Link href="/auth/signin">
            <Button variant="secondary" size="sm">
              Sign in
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
