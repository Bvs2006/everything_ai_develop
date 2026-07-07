import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDifficulty } from "@/lib/utils";

export const metadata = { title: "Frameworks" };

type SearchParams = { category?: string; language?: string; sort?: string };

export default async function FrameworksPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category, language, sort } = await searchParams;

  const [frameworks, categories, languages] = await Promise.all([
    prisma.framework
      .findMany({
        where: {
          published: true,
          ...(category ? { category: { slug: category } } : {}),
          ...(language ? { language } : {}),
        },
        include: { category: true, tags: true },
        orderBy: sort === "name" ? { name: "asc" } : { stars: "desc" },
      })
      .catch(() => []),
    prisma.category.findMany().catch(() => []),
    prisma.framework
      .findMany({ distinct: ["language"], select: { language: true } })
      .catch(() => []),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="eyebrow mb-2">Registry / Frameworks</p>
      <h1 className="font-display text-3xl font-semibold">AI Frameworks</h1>
      <p className="mt-2 max-w-2xl text-ink-muted">
        Orchestration, agent, and application frameworks for building with LLMs.
      </p>

      {/* Filters */}
      <div className="mt-8 flex flex-wrap gap-3">
        <FilterGroup
          label="Category"
          param="category"
          current={category}
          options={categories.map((c) => ({ value: c.slug, label: c.name }))}
        />
        <FilterGroup
          label="Language"
          param="language"
          current={language}
          options={languages
            .filter((l) => l.language)
            .map((l) => ({ value: l.language as string, label: l.language as string }))}
        />
        <FilterGroup
          label="Sort"
          param="sort"
          current={sort}
          options={[
            { value: "popularity", label: "Popularity" },
            { value: "name", label: "Name" },
          ]}
        />
      </div>

      {/* Results */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {frameworks.length === 0 && (
          <div className="panel col-span-full py-12 text-center font-mono text-sm text-ink-faint">
            No frameworks match these filters — try clearing them, or run{" "}
            <span className="text-cyan">npm run db:seed</span>.
          </div>
        )}
        {frameworks.map((fw) => (
          <Link key={fw.id} href={`/frameworks/${fw.slug}`}>
            <Card className="flex h-full flex-col">
              <div className="flex items-start justify-between">
                <p className="font-display text-lg font-medium">{fw.name}</p>
                <Badge tone="amber">★ {fw.stars}</Badge>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{fw.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge>{formatDifficulty(fw.difficulty)}</Badge>
                {fw.language && <Badge tone="cyan">{fw.language}</Badge>}
                {fw.tags.slice(0, 2).map((t) => (
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

function FilterGroup({
  label,
  param,
  current,
  options,
}: {
  label: string;
  param: string;
  current?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-xs text-ink-faint">{label}:</span>
      <div className="flex flex-wrap gap-1">
        <FilterPill param={param} value={undefined} current={current} label="All" />
        {options.map((o) => (
          <FilterPill key={o.value} param={param} value={o.value} current={current} label={o.label} />
        ))}
      </div>
    </div>
  );
}

function FilterPill({
  param,
  value,
  current,
  label,
}: {
  param: string;
  value?: string;
  current?: string;
  label: string;
}) {
  const active = value === current || (!value && !current);
  const href = value ? `?${param}=${value}` : "?";
  return (
    <Link
      href={href}
      className={`rounded-sm border px-2 py-1 font-mono text-xs transition-colors ${
        active
          ? "border-cyan/50 bg-cyan-soft text-cyan"
          : "border-base-border bg-base-panel2 text-ink-muted hover:text-ink"
      }`}
    >
      {label}
    </Link>
  );
}
