import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "SDKs" };

export default async function SdksPage() {
  const sdks = await prisma.sdk
    .findMany({ where: { published: true }, include: { tags: true }, orderBy: { name: "asc" } })
    .catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="eyebrow mb-2">Registry / SDKs</p>
      <h1 className="font-display text-3xl font-semibold">SDK Library</h1>
      <p className="mt-2 max-w-2xl text-ink-muted">
        Client libraries for building against AI models and platforms.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sdks.length === 0 && (
          <div className="panel col-span-full py-12 text-center font-mono text-sm text-ink-faint">
            No SDKs yet — run <span className="text-cyan">npm run db:seed</span>.
          </div>
        )}
        {sdks.map((sdk) => (
          <Link key={sdk.id} href={`/sdks/${sdk.slug}`}>
            <Card className="h-full">
              <p className="font-display text-lg font-medium">{sdk.name}</p>
              <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{sdk.overview}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {sdk.language && <Badge tone="cyan">{sdk.language}</Badge>}
                {sdk.tags.slice(0, 3).map((t) => (
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
