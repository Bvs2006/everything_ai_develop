import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { LikeButton } from "@/components/shared/like-button";
import { countLikes } from "@/lib/likes";

export default async function DiscussionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const discussion = await prisma.discussion
    .findUnique({
      where: { id },
      include: {
        author: { include: { profile: true } },
        tags: true,
        comments: {
          include: { author: { include: { profile: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    })
    .catch(() => null);

  if (!discussion) notFound();

  const likeCount = await countLikes("DISCUSSION", discussion.id).catch(() => 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <Badge tone="cyan">{discussion.category.replaceAll("_", " ")}</Badge>
        <span className="font-mono text-xs text-ink-faint">
          {formatDistanceToNow(discussion.createdAt, { addSuffix: true })}
        </span>
      </div>

      <h1 className="mt-3 font-display text-3xl font-semibold">{discussion.title}</h1>
      <Link
        href={`/community/profile/${discussion.author.profile?.username ?? ""}`}
        className="mt-2 inline-block font-mono text-sm text-ink-muted hover:text-cyan"
      >
        by {discussion.author.profile?.username ?? discussion.author.name}
      </Link>

      <div className="prose prose-invert mt-6 max-w-none whitespace-pre-wrap text-ink-muted">
        {discussion.content}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {discussion.tags.map((t) => (
          <Badge key={t.id}>{t.name}</Badge>
        ))}
      </div>

      <div className="mt-6">
        <LikeButton type="DISCUSSION" targetId={discussion.id} initialCount={likeCount} />
      </div>

      <div className="mt-10 border-t border-base-border pt-8">
        <p className="eyebrow mb-4">{discussion.comments.length} replies</p>
        <div className="space-y-4">
          {discussion.comments.map((c) => (
            <div key={c.id} className="panel p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-ink-muted">
                  {c.author.profile?.username ?? c.author.name}
                </span>
                <div className="flex items-center gap-2">
                  {c.isAnswer && <Badge tone="good">Helpful answer</Badge>}
                  <span className="font-mono text-xs text-ink-faint">
                    {formatDistanceToNow(c.createdAt, { addSuffix: true })}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-sm text-ink">{c.content}</p>
            </div>
          ))}
          {discussion.comments.length === 0 && (
            <p className="font-mono text-sm text-ink-faint">No replies yet — add the first one.</p>
          )}
        </div>
      </div>
    </div>
  );
}
