import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim();

  if (!query) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="font-mono text-sm text-ink-faint">Type a query in the header search bar.</p>
      </div>
    );
  }

  const where = { contains: query, mode: "insensitive" as const };
  const [frameworks, sdks, tools, articles, templates] = await Promise.all([
    prisma.framework.findMany({ where: { published: true, OR: [{ name: where }, { description: where }] }, take: 8 }).catch(() => []),
    prisma.sdk.findMany({ where: { published: true, OR: [{ name: where }, { overview: where }] }, take: 8 }).catch(() => []),
    prisma.tool.findMany({ where: { published: true, OR: [{ name: where }, { description: where }] }, take: 8 }).catch(() => []),
    prisma.article.findMany({ where: { published: true, OR: [{ title: where }, { excerpt: where }] }, take: 8 }).catch(() => []),
    prisma.template.findMany({ where: { published: true, OR: [{ name: where }, { description: where }] }, take: 8 }).catch(() => []),
  ]);

  const groups = [
    { label: "Frameworks", items: frameworks, base: "/frameworks", nameKey: "name" as const },
    { label: "SDKs", items: sdks, base: "/sdks", nameKey: "name" as const },
    { label: "Tools", items: tools, base: "/tools", nameKey: "name" as const },
    { label: "Templates", items: templates, base: "/templates", nameKey: "name" as const },
    { label: "Articles", items: articles, base: "/articles", nameKey: "title" as const },
  ];
  const total = groups.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="eyebrow mb-2">Search</p>
      <h1 className="font-display text-2xl font-semibold">
        Results for <span className="text-cyan">&ldquo;{query}&rdquo;</span>
      </h1>

      {total === 0 ? (
        <div className="panel mt-8 py-12 text-center font-mono text-sm text-ink-faint">
          No matches. Try a broader term.
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {groups.map(
            (g) =>
              g.items.length > 0 && (
                <div key={g.label}>
                  <p className="eyebrow mb-3">{g.label}</p>
                  <div className="space-y-2">
                    {g.items.map((item: any) => (
                      <Link key={item.id} href={`${g.base}/${item.slug}`}>
                        <Card className="flex items-center justify-between">
                          <span className="font-medium">{item[g.nameKey]}</span>
                          <Badge>{g.label.slice(0, -1)}</Badge>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
