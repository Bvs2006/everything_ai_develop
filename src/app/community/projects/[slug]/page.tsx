import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { countLikes } from "@/lib/likes";
import { LikeButton } from "@/components/shared/like-button";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await prisma.project
    .findUnique({ where: { slug }, include: { author: { include: { profile: true } } } })
    .catch(() => null);

  if (!project) notFound();
  const likeCount = await countLikes("PROJECT", project.id).catch(() => 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Badge tone="cyan">{project.category.replaceAll("_", " ")}</Badge>
      <h1 className="mt-3 font-display text-3xl font-semibold">{project.name}</h1>
      <p className="mt-1 font-mono text-sm text-ink-muted">
        by {project.author.profile?.username ?? project.author.name}
      </p>

      <p className="mt-6 text-ink-muted">{project.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.techStack.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
      </div>

      {project.screenshots.length > 0 && (
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {project.screenshots.map((s) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={s} src={s} alt={project.name} className="rounded-md border border-base-border" />
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noreferrer" className="pill hover:text-cyan">
            GitHub
          </a>
        )}
        {project.demoUrl && (
          <a href={project.demoUrl} target="_blank" rel="noreferrer" className="pill hover:text-cyan">
            Live demo
          </a>
        )}
        <LikeButton type="PROJECT" targetId={project.id} initialCount={likeCount} />
      </div>
    </div>
  );
}
