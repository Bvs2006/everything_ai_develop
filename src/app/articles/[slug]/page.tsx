import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await prisma.article
    .findUnique({ where: { slug }, include: { tags: true, author: true } })
    .catch(() => null);

  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-ink-faint">
        {article.category && <Badge tone="cyan">{article.category}</Badge>}
        <span>{format(article.publishedAt, "MMM d, yyyy")}</span>
        <span>· {article.readingTimeMin} min read</span>
        {article.author?.name && <span>· by {article.author.name}</span>}
      </div>

      <h1 className="mt-4 font-display text-4xl font-semibold">{article.title}</h1>

      <div className="mt-3 flex flex-wrap gap-2">
        {article.tags.map((t) => (
          <Badge key={t.id}>{t.name}</Badge>
        ))}
      </div>

      <div className="prose prose-invert prose-headings:font-display prose-a:text-cyan mt-10 max-w-none">
        <MDXRemote source={article.contentMdx} />
      </div>
    </article>
  );
}
