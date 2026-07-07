import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const profile = await prisma.userProfile
    .findUnique({
      where: { username },
      include: {
        user: {
          include: {
            discussions: { take: 5, orderBy: { createdAt: "desc" } },
            articles: { take: 5, orderBy: { publishedAt: "desc" } },
            projects: { take: 5, orderBy: { createdAt: "desc" } },
            bookmarks: true,
          },
        },
      },
    })
    .catch(() => null);

  if (!profile) notFound();

  const { user } = profile;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-start gap-6">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-base-border bg-base-panel2">
          {user.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt={user.name ?? username} className="h-full w-full object-cover" />
          )}
        </div>
        <div>
          <h1 className="font-display text-3xl font-semibold">{user.name ?? username}</h1>
          <p className="font-mono text-sm text-cyan">@{profile.username}</p>
          {profile.bio && <p className="mt-2 max-w-xl text-ink-muted">{profile.bio}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="amber">{profile.level.replaceAll("_", " ")}</Badge>
            <Badge>{profile.points} pts</Badge>
            {profile.githubUrl && (
              <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="pill hover:text-cyan">
                GitHub
              </a>
            )}
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="pill hover:text-cyan">
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>

      {profile.skills.length > 0 && (
        <div className="mt-8">
          <p className="eyebrow mb-3">Skills</p>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s) => (
              <Badge key={s} tone="cyan">{s}</Badge>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        <Stat label="Discussions" value={user.discussions.length} />
        <Stat label="Articles" value={user.articles.length} />
        <Stat label="Bookmarks" value={user.bookmarks.length} />
      </div>

      {user.projects.length > 0 && (
        <div className="mt-10">
          <p className="eyebrow mb-4">Projects</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {user.projects.map((p) => (
              <Card key={p.id}>
                <p className="font-medium">{p.name}</p>
                <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{p.description}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="text-center">
      <p className="font-display text-2xl font-semibold text-amber">{value}</p>
      <p className="font-mono text-xs text-ink-faint">{label}</p>
    </Card>
  );
}
