import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";

const SECTIONS = [
  { href: "/admin/frameworks", label: "Frameworks" },
  { href: "/admin/sdks", label: "SDKs" },
  { href: "/admin/tools", label: "Tools" },
  { href: "/admin/templates", label: "Templates" },
  { href: "/admin/articles", label: "Articles" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/signin?callbackUrl=/admin");
  }

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <aside className="w-56 shrink-0">
        <p className="eyebrow mb-4">Admin</p>
        <nav className="space-y-1">
          {SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="block rounded-sm px-3 py-2 font-mono text-sm text-ink-muted hover:bg-base-panel2 hover:text-ink"
            >
              {s.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
