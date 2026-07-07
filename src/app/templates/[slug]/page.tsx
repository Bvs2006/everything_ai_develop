import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = await prisma.template.findUnique({ where: { slug } }).catch(() => null);
  if (!template) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="eyebrow mb-2">Templates</p>
      <Badge tone="cyan">{template.category.replaceAll("_", " ")}</Badge>
      <h1 className="mt-3 font-display text-4xl font-semibold">{template.name}</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">{template.description}</p>

      <Section title="Folder structure">
        <pre className="panel overflow-x-auto p-4 font-mono text-sm text-cyan">
          {template.folderStructure}
        </pre>
      </Section>

      <Section title="Recommended tech stack">
        <div className="flex flex-wrap gap-2">
          {template.recommendedStack.map((s) => (
            <Badge key={s}>{s}</Badge>
          ))}
        </div>
      </Section>

      <Section title="Architecture diagram">
        <div className="panel flex h-48 items-center justify-center text-sm text-ink-faint">
          Architecture diagram placeholder — add an image or embed here.
        </div>
      </Section>

      <div className="mt-8">
        {template.githubUrl ? (
          <a href={template.githubUrl} target="_blank" rel="noreferrer">
            <Button>Use this template</Button>
          </a>
        ) : (
          <Button disabled title="GitHub repo coming soon">
            GitHub link coming soon
          </Button>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-10">
      <p className="eyebrow mb-3">{title}</p>
      {children}
    </div>
  );
}
