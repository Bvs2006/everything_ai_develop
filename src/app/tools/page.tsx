import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "AI Tools Directory" };

const TOOL_CATEGORIES = [
  "IDE",
  "CODING_ASSISTANT",
  "MODELS",
  "APIS",
  "OCR",
  "DEPLOYMENT",
  "DATABASE",
  "VECTOR_DATABASE",
  "MONITORING",
  "HOSTING",
] as const;

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; pricing?: string }>;
}) {
  const { category, pricing } = await searchParams;

  const tools = await prisma.tool
    .findMany({
      where: {
        published: true,
        ...(category ? { category: category as (typeof TOOL_CATEGORIES)[number] } : {}),
        ...(pricing ? { pricing: pricing as "FREE" | "FREEMIUM" | "PAID" } : {}),
      },
      include: { tags: true },
      orderBy: { name: "asc" },
    })
    .catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="eyebrow mb-2">Registry / Tools</p>
      <h1 className="font-display text-3xl font-semibold">AI Tools Directory</h1>
      <p className="mt-2 max-w-2xl text-ink-muted">
        IDEs, coding assistants, APIs, vector databases, and everything else in
        an AI dev stack.
      </p>

      <div className="mt-8 flex flex-wrap gap-1">
        <CatLink category={undefined} current={category} label="All" />
        {TOOL_CATEGORIES.map((c) => (
          <CatLink key={c} category={c} current={category} label={c.replaceAll("_", " ")} />
        ))}
      </div>

      <div className="mt-6 flex gap-2">
        {(["FREE", "FREEMIUM", "PAID"] as const).map((p) => (
          <Link
            key={p}
            href={`?${category ? `category=${category}&` : ""}pricing=${p}`}
            className={`pill ${pricing === p ? "border-cyan/50 text-cyan" : ""}`}
          >
            {p}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.length === 0 && (
          <div className="panel col-span-full py-12 text-center font-mono text-sm text-ink-faint">
            No tools match — run <span className="text-cyan">npm run db:seed</span>.
          </div>
        )}
        {tools.map((tool) => (
          <Card key={tool.id} className="flex h-full flex-col">
            <div className="flex items-start justify-between">
              <p className="font-display text-lg font-medium">{tool.name}</p>
              <Badge tone={tool.pricing === "FREE" ? "good" : tool.pricing === "PAID" ? "bad" : "amber"}>
                {tool.pricing}
              </Badge>
            </div>
            <p className="mt-1 font-mono text-xs text-ink-faint">
              {tool.category.replaceAll("_", " ")}
            </p>
            <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{tool.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tool.tags.slice(0, 3).map((t) => (
                <Badge key={t.id}>{t.name}</Badge>
              ))}
            </div>
            {tool.website && (
              <a
                href={tool.website}
                target="_blank"
                rel="noreferrer"
                className="mt-4 text-sm text-cyan hover:underline"
              >
                Visit website →
              </a>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function CatLink({
  category,
  current,
  label,
}: {
  category?: string;
  current?: string;
  label: string;
}) {
  const active = category === current || (!category && !current);
  return (
    <Link
      href={category ? `?category=${category}` : "?"}
      className={`rounded-sm border px-2 py-1 font-mono text-xs ${
        active ? "border-cyan/50 bg-cyan-soft text-cyan" : "border-base-border text-ink-muted hover:text-ink"
      }`}
    >
      {label}
    </Link>
  );
}
