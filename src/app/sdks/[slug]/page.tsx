import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function SdkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sdk = await prisma.sdk.findUnique({ where: { slug }, include: { tags: true } }).catch(() => null);
  if (!sdk) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="eyebrow mb-2">SDKs</p>
      <h1 className="font-display text-4xl font-semibold">{sdk.name}</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {sdk.language && <Badge tone="cyan">{sdk.language}</Badge>}
        {sdk.tags.map((t) => (
          <Badge key={t.id}>{t.name}</Badge>
        ))}
      </div>

      <Section title="Overview">
        <p className="text-ink-muted">{sdk.overview}</p>
      </Section>

      <Section title="Installation">
        <pre className="panel overflow-x-auto p-4 font-mono text-sm text-cyan">{sdk.installation}</pre>
      </Section>

      <Section title="Features">
        <ul className="list-inside list-disc space-y-1 text-ink-muted">
          {sdk.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </Section>

      <Section title="Example code">
        <pre className="panel overflow-x-auto p-4 font-mono text-sm text-ink">{sdk.exampleCode}</pre>
      </Section>

      <div className="mt-8 flex gap-3">
        {sdk.docsUrl && (
          <a href={sdk.docsUrl} target="_blank" rel="noreferrer">
            <Button>Official documentation</Button>
          </a>
        )}
        {sdk.githubUrl && (
          <a href={sdk.githubUrl} target="_blank" rel="noreferrer">
            <Button variant="secondary">GitHub repository</Button>
          </a>
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
