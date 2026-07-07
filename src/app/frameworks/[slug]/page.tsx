import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDifficulty } from "@/lib/utils";

export default async function FrameworkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fw = await prisma.framework
    .findUnique({ where: { slug }, include: { category: true, tags: true } })
    .catch(() => null);

  if (!fw) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="eyebrow mb-2">
        Frameworks{fw.category ? ` / ${fw.category.name}` : ""}
      </p>
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-display text-4xl font-semibold">{fw.name}</h1>
        <Badge tone="amber">★ {fw.stars}</Badge>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>{formatDifficulty(fw.difficulty)}</Badge>
        {fw.language && <Badge tone="cyan">{fw.language}</Badge>}
        {fw.tags.map((t) => (
          <Badge key={t.id}>{t.name}</Badge>
        ))}
      </div>

      <p className="mt-6 max-w-2xl text-lg text-ink-muted">{fw.description}</p>

      <div className="mt-8 flex gap-3">
        {fw.docsUrl && (
          <a href={fw.docsUrl} target="_blank" rel="noreferrer">
            <Button>Official documentation</Button>
          </a>
        )}
        {fw.githubUrl && (
          <a href={fw.githubUrl} target="_blank" rel="noreferrer">
            <Button variant="secondary">View on GitHub</Button>
          </a>
        )}
      </div>
    </div>
  );
}
