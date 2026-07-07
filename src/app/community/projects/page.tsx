import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Project Showcase" };

export default async function ProjectShowcasePage() {
  const projects = await prisma.project
    .findMany({ include: { author: { include: { profile: true } } }, orderBy: { createdAt: "desc" } })
    .catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="eyebrow mb-2">Community / Showcase</p>
      <h1 className="font-display text-3xl font-semibold">Project Showcase</h1>
      <p className="mt-2 max-w-2xl text-ink-muted">
        AI agents, RAG apps, and research projects built by the community.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 && (
          <div className="panel col-span-full py-12 text-center font-mono text-sm text-ink-faint">
            No projects shared yet — be the first to showcase yours.
          </div>
        )}
        {projects.map((p) => (
          <Link key={p.id} href={`/community/projects/${p.slug}`}>
            <Card className="flex h-full flex-col">
              <Badge tone="cyan">{p.category.replaceAll("_", " ")}</Badge>
              <p className="mt-3 font-display text-lg font-medium">{p.name}</p>
              <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{p.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.techStack.slice(0, 3).map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
              <p className="mt-4 font-mono text-xs text-ink-faint">
                by {p.author.profile?.username ?? p.author.name}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
