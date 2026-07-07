import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default async function AdminHomePage() {
  const [frameworks, sdks, tools, templates, articles, users] = await Promise.all([
    prisma.framework.count(),
    prisma.sdk.count(),
    prisma.tool.count(),
    prisma.template.count(),
    prisma.article.count(),
    prisma.user.count(),
  ]);

  const rows = [
    { label: "Frameworks", value: frameworks, href: "/admin/frameworks" },
    { label: "SDKs", value: sdks, href: "/admin/sdks" },
    { label: "Tools", value: tools, href: "/admin/tools" },
    { label: "Templates", value: templates, href: "/admin/templates" },
    { label: "Articles", value: articles, href: "/admin/articles" },
    { label: "Users", value: users, href: "#" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Content counts across the registry. Each section below links to a
        CRUD table — build out create/edit forms following the same
        server-action pattern as the rest of the app.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {rows.map((r) => (
          <Link key={r.label} href={r.href}>
            <Card>
              <p className="font-display text-3xl font-semibold text-amber">{r.value}</p>
              <p className="font-mono text-xs text-ink-faint">{r.label}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
