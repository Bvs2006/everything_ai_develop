import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Project Templates" };

export default async function TemplatesPage() {
  const templates = await prisma.template
    .findMany({ where: { published: true }, orderBy: { name: "asc" } })
    .catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="eyebrow mb-2">Registry / Templates</p>
      <h1 className="font-display text-3xl font-semibold">Project Templates</h1>
      <p className="mt-2 max-w-2xl text-ink-muted">
        Starter scaffolds for the six most common AI project shapes.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.length === 0 && (
          <div className="panel col-span-full py-12 text-center font-mono text-sm text-ink-faint">
            No templates yet — run <span className="text-cyan">npm run db:seed</span>.
          </div>
        )}
        {templates.map((t) => (
          <Link key={t.id} href={`/templates/${t.slug}`}>
            <Card className="h-full">
              <Badge tone="cyan">{t.category.replaceAll("_", " ")}</Badge>
              <p className="mt-3 font-display text-lg font-medium">{t.name}</p>
              <p className="mt-2 line-clamp-3 text-sm text-ink-muted">{t.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
