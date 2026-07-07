import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export const metadata = { title: "Discussions" };

const CATEGORIES = [
  "AI_ENGINEERING",
  "LLMS",
  "AGENTS",
  "RAG",
  "MCP",
  "MACHINE_LEARNING",
  "DEEP_LEARNING",
  "AI_TOOLS",
  "FRAMEWORKS",
  "PROJECTS",
  "CAREER",
] as const;

export default async function DiscussionsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const discussions = await prisma.discussion
    .findMany({
      where: category ? { category: category as (typeof CATEGORIES)[number] } : {},
      include: { author: { include: { profile: true } }, tags: true, _count: { select: { comments: true } } },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow mb-2">Community / Discussions</p>
          <h1 className="font-display text-3xl font-semibold">Discussions</h1>
        </div>
        <Link href="/community/discussions/new">
          <Button>New discussion</Button>
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-1">
        <Link
          href="?"
          className={`rounded-sm border px-2 py-1 font-mono text-xs ${!category ? "border-cyan/50 bg-cyan-soft text-cyan" : "border-base-border text-ink-muted"}`}
        >
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`?category=${c}`}
            className={`rounded-sm border px-2 py-1 font-mono text-xs ${category === c ? "border-cyan/50 bg-cyan-soft text-cyan" : "border-base-border text-ink-muted hover:text-ink"}`}
          >
            {c.replaceAll("_", " ")}
          </Link>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        {discussions.length === 0 && (
          <div className="panel py-12 text-center font-mono text-sm text-ink-faint">
            No discussions in this category yet — be the first to post.
          </div>
        )}
        {discussions.map((d) => (
          <Link key={d.id} href={`/community/discussions/${d.id}`}>
            <Card>
              <div className="flex items-center justify-between">
                <Badge tone="cyan">{d.category.replaceAll("_", " ")}</Badge>
                <span className="font-mono text-xs text-ink-faint">
                  {formatDistanceToNow(d.createdAt, { addSuffix: true })}
                </span>
              </div>
              <p className="mt-2 font-display text-lg font-medium">{d.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{d.content}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {d.tags.map((t) => (
                    <Badge key={t.id}>{t.name}</Badge>
                  ))}
                </div>
                <span className="font-mono text-xs text-ink-faint">
                  {d._count.comments} replies · by {d.author.profile?.username ?? d.author.name}
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
