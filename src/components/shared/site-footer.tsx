import Link from "next/link";

const COLUMNS = [
  {
    title: "Catalog",
    links: [
      { href: "/frameworks", label: "Frameworks" },
      { href: "/sdks", label: "SDKs" },
      { href: "/tools", label: "Tools" },
      { href: "/templates", label: "Templates" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/articles", label: "Articles" },
      { href: "/community", label: "Community" },
      { href: "/community/discussions", label: "Discussions" },
      { href: "/community/projects", label: "Project showcase" },
    ],
  },
  {
    title: "Coming soon",
    links: [
      { href: "#", label: "MCP Hub" },
      { href: "#", label: "AI Playground" },
      { href: "#", label: "Learning Roadmaps" },
      { href: "#", label: "AI News Aggregator" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-base-border bg-base-panel/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <p className="font-display text-lg font-semibold">
            everything<span className="text-cyan">.ai</span>develop
          </p>
          <p className="mt-2 max-w-xs text-sm text-ink-muted">
            A registry and knowledge network for people building with AI.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="eyebrow mb-3">{col.title}</p>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-ink-muted hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-base-border py-4 text-center font-mono text-xs text-ink-faint">
        © {new Date().getFullYear()} Everything AI Develop
      </div>
    </footer>
  );
}
