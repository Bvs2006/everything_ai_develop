import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const metadata = { title: "Articles" };

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const articles = await prisma.article
    .findMany({
      where: { published: true, ...(category ? { category } : {}) },
      include: { tags: true },
      orderBy: { publishedAt: "desc" },
    })
    .catch(() => []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="eyebrow mb-2">Learn / Articles</p>
      <h1 className="font-display text-3xl font-semibold">Articles</h1>
      <p className="mt-2 max-w-2xl text-ink-muted">
        Field notes and tutorials on frameworks, agents, and shipping AI products.
      </p>

      <div className="mt-8 space-y-4">
        {articles.length === 0 && (
          <div className="panel py-12 text-center font-mono text-sm text-ink-faint">
            No articles yet — run <span className="text-cyan">npm run db:seed</span>.
          </div>
        )}
        {articles.map((a) => (
          <Link key={a.id} href={`/articles/${a.slug}`}>
            <Card>
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-ink-faint">
                {a.category && <Badge tone="cyan">{a.category}</Badge>}
                <span>{format(a.publishedAt, "MMM d, yyyy")}</span>
                <span>· {a.readingTimeMin} min read</span>
              </div>
              <p className="mt-2 font-display text-xl font-medium">{a.title}</p>
              <p className="mt-1 text-sm text-ink-muted">{a.excerpt}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {a.tags.map((t) => (
                  <Badge key={t.id}>{t.name}</Badge>
                ))}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
