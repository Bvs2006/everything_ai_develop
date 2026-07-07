import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// MVP implementation uses Postgres ILIKE for portability across any Postgres
// instance (Neon included) without requiring a tsvector migration first.
// To upgrade to true full-text search/ranking later:
//   1. Add a `searchVector Unsupported("tsvector")?` column + GIN index via a
//      raw SQL migration (`prisma/migrations/.../migration.sql`).
//   2. Populate it with a trigger or on write.
//   3. Replace the `contains` filters below with
//      `prisma.$queryRaw` using `to_tsquery` / `websearch_to_tsquery`.
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ frameworks: [], sdks: [], tools: [], articles: [], templates: [] });

  const where = { contains: q, mode: "insensitive" as const };

  const [frameworks, sdks, tools, articles, templates] = await Promise.all([
    prisma.framework.findMany({
      where: { published: true, OR: [{ name: where }, { description: where }] },
      take: 5,
    }),
    prisma.sdk.findMany({
      where: { published: true, OR: [{ name: where }, { overview: where }] },
      take: 5,
    }),
    prisma.tool.findMany({
      where: { published: true, OR: [{ name: where }, { description: where }] },
      take: 5,
    }),
    prisma.article.findMany({
      where: { published: true, OR: [{ title: where }, { excerpt: where }] },
      take: 5,
    }),
    prisma.template.findMany({
      where: { published: true, OR: [{ name: where }, { description: where }] },
      take: 5,
    }),
  ]);

  return NextResponse.json({ frameworks, sdks, tools, articles, templates });
}
