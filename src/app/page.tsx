import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeroSearch } from "@/components/shared/hero-search";

const CATEGORIES = [
  { href: "/frameworks", label: "AI Frameworks", cmd: "npx create framework", count: "frameworks" },
  { href: "/sdks", label: "AI SDKs", cmd: "pip install sdk", count: "sdks" },
  { href: "/tools", label: "AI Tools", cmd: "brew install tool", count: "tools" },
  { href: "/templates", label: "Project Templates", cmd: "git clone template", count: "templates" },
] as const;

export const revalidate = 60;

export default async function HomePage() {
  const [frameworkCount, sdkCount, toolCount, templateCount, featured, latestArticles] =
    await Promise.all([
      prisma.framework.count({ where: { published: true } }).catch(() => 0),
      prisma.sdk.count({ where: { published: true } }).catch(() => 0),
      prisma.tool.count({ where: { published: true } }).catch(() => 0),
      prisma.template.count({ where: { published: true } }).catch(() => 0),
      prisma.framework
        .findMany({ where: { published: true }, orderBy: { stars: "desc" }, take: 3 })
        .catch(() => []),
      prisma.article
        .findMany({ where: { published: true }, orderBy: { publishedAt: "desc" }, take: 3 })
        .catch(() => []),
    ]);

  const counts: Record<string, number> = {
    frameworks: frameworkCount,
    sdks: sdkCount,
    tools: toolCount,
    templates: templateCount,
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-base-border">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="eyebrow mb-4">registry.everythingaidevelop.dev</p>
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-6xl">
            The package registry for people building{" "}
            <span className="text-amber">with AI</span>.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-muted">
            Frameworks, SDKs, tools, and project scaffolds — indexed, tagged, and
            ready to <span className="font-mono text-cyan">import</span>.
          </p>

          <div className="mt-8 max-w-2xl">
            <HeroSearch />
          </div>

          <div className="mt-6 flex gap-3">
            <Link href="/frameworks">
              <Button size="lg">Browse the registry</Button>
            </Link>
            <Link href="/community">
              <Button size="lg" variant="secondary">
                Join the community
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="eyebrow mb-6">Popular categories</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.href} href={cat.href}>
              <Card className="h-full">
                <p className="font-mono text-xs text-ink-faint">$ {cat.cmd}</p>
                <p className="mt-3 font-display text-xl font-medium">{cat.label}</p>
                <p className="mt-1 text-sm text-ink-muted">
                  {counts[cat.count] ?? 0} listed
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured resources */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-baseline justify-between">
          <p className="eyebrow">Featured resources</p>
          <Link href="/frameworks" className="text-sm text-cyan hover:underline">
            View all →
          </Link>
        </div>
        {featured.length === 0 ? (
          <EmptyState label="No featured frameworks yet — run `npm run db:seed`." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {featured.map((fw) => (
              <Link key={fw.id} href={`/frameworks/${fw.slug}`}>
                <Card className="h-full">
                  <div className="flex items-center justify-between">
                    <p className="font-display font-medium">{fw.name}</p>
                    <Badge tone="amber">★ {fw.stars}</Badge>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{fw.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Latest articles / news */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-baseline justify-between">
          <p className="eyebrow">Latest articles</p>
          <Link href="/articles" className="text-sm text-cyan hover:underline">
            View all →
          </Link>
        </div>
        {latestArticles.length === 0 ? (
          <EmptyState label="No articles published yet." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {latestArticles.map((a) => (
              <Link key={a.id} href={`/articles/${a.slug}`}>
                <Card className="h-full">
                  <p className="pill w-fit">{a.readingTimeMin} min read</p>
                  <p className="mt-3 font-display font-medium">{a.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{a.excerpt}</p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="panel flex flex-col items-center justify-center gap-2 py-12 text-center">
      <p className="font-mono text-sm text-ink-faint">{label}</p>
    </div>
  );
}
