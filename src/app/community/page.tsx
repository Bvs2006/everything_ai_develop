import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export const metadata = { title: "Community" };

export default async function CommunityHomePage() {
  const [trending, latestProjects, newMembers, groups] = await Promise.all([
    prisma.discussion
      .findMany({
        include: { author: { include: { profile: true } }, _count: { select: { comments: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      })
      .catch(() => []),
    prisma.project
      .findMany({ include: { author: { include: { profile: true } } }, orderBy: { createdAt: "desc" }, take: 3 })
      .catch(() => []),
    prisma.userProfile.findMany({ orderBy: { createdAt: "desc" }, take: 5 }).catch(() => []),
    prisma.group.findMany({ include: { _count: { select: { members: true } } }, take: 4 }).catch(() => []),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="eyebrow mb-2">Community</p>
      <h1 className="font-display text-3xl font-semibold">The Everything AI Develop network</h1>
      <p className="mt-2 max-w-2xl text-ink-muted">
        Discussions, project showcases, and topic groups for people shipping with AI.
      </p>

      <div className="mt-6 flex gap-3">
        <Link href="/community/discussions" className="pill hover:border-cyan/50">
          Start a discussion
        </Link>
        <Link href="/community/projects" className="pill hover:border-cyan/50">
          Showcase a project
        </Link>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        {/* Trending discussions */}
        <div className="lg:col-span-2">
          <p className="eyebrow mb-4">Trending discussions</p>
          <div className="space-y-3">
            {trending.length === 0 && <EmptyState label="No discussions yet." />}
            {trending.map((d) => (
              <Link key={d.id} href={`/community/discussions/${d.id}`}>
                <Card>
                  <div className="flex items-center justify-between">
                    <Badge tone="cyan">{d.category.replaceAll("_", " ")}</Badge>
                    <span className="font-mono text-xs text-ink-faint">
                      {formatDistanceToNow(d.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="mt-2 font-display font-medium">{d.title}</p>
                  <p className="mt-1 font-mono text-xs text-ink-faint">
                    by {d.author.profile?.username ?? d.author.name} · {d._count.comments} replies
                  </p>
                </Card>
              </Link>
            ))}
          </div>

          <p className="eyebrow mb-4 mt-10">Featured projects</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {latestProjects.length === 0 && <EmptyState label="No projects yet." />}
            {latestProjects.map((p) => (
              <Link key={p.id} href={`/community/projects/${p.slug}`}>
                <Card>
                  <p className="font-display font-medium">{p.name}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{p.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div>
            <p className="eyebrow mb-4">New members</p>
            <div className="panel divide-y divide-base-border">
              {newMembers.length === 0 && <p className="p-4 text-sm text-ink-faint">No members yet.</p>}
              {newMembers.map((m) => (
                <Link
                  key={m.id}
                  href={`/community/profile/${m.username}`}
                  className="flex items-center justify-between p-3 text-sm hover:bg-base-panel2"
                >
                  <span>{m.username}</span>
                  <Badge tone="amber">{m.level.replaceAll("_", " ")}</Badge>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow mb-4">Learning groups</p>
            <div className="space-y-2">
              {groups.length === 0 && <EmptyState label="No groups yet." />}
              {groups.map((g) => (
                <Card key={g.id} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{g.name}</span>
                  <span className="font-mono text-xs text-ink-faint">{g._count.members} members</span>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow mb-4">Upcoming AI events</p>
            <div className="panel p-4 text-sm text-ink-faint">
              Event calendar is a planned extension point — hook this up to an
              Events model when ready.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return <div className="panel py-8 text-center font-mono text-sm text-ink-faint">{label}</div>;
}
