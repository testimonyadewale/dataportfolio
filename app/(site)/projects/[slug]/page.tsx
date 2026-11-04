import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, reader, renderMarkdoc } from "@/lib/content";
import { getSkillNames } from "@/lib/projects";

export async function generateStaticParams() {
  const slugs = await reader.collections.projects.list();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await reader.collections.projects.read(slug);
  return p ? { title: p.title, description: p.summary } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, names] = await Promise.all([getProject(slug), getSkillNames()]);
  if (!project) notFound();

  const tools = project.tools.filter((t): t is string => !!t);
  const steps = [
    { label: "The problem", text: project.problem },
    { label: "The data", text: project.data },
    { label: "The approach", text: project.approach },
    { label: "The results", text: project.results },
  ].filter((s) => s.text);
  const links = [
    { label: "Code on GitHub", href: project.githubUrl },
    { label: "Live app", href: project.liveUrl },
    { label: "Dashboard", href: project.dashboardUrl },
  ].filter((l): l is { label: string; href: string } => !!l.href);

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <Link href="/projects" className="text-sm text-muted hover:text-accent">
        ← All projects
      </Link>

      <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-accent">
        {project.industry || "Project"}
        {project.status === "in-progress" && " · In progress"}
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{project.title}</h1>
      {project.summary && <p className="mt-4 text-lg text-muted">{project.summary}</p>}

      {project.keyResult && (
        <p className="mt-8 rounded-2xl bg-accent-soft p-6 text-xl font-semibold">{project.keyResult}</p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {tools.map((t) => (
          <Link
            key={t}
            href={`/projects?tool=${encodeURIComponent(names[t] ?? t)}`}
            className="rounded-full border border-line px-3 py-1 text-sm text-muted hover:border-accent hover:text-accent"
          >
            {names[t] ?? t}
          </Link>
        ))}
      </div>

      {links.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg hover:bg-accent hover:text-accent-ink"
            >
              {l.label} ↗
            </a>
          ))}
        </div>
      )}

      {project.cover && (
        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-line">
          <Image src={project.cover} alt={`${project.title} preview`} fill className="object-cover" sizes="768px" priority />
        </div>
      )}

      {steps.length > 0 && (
        <div className="mt-12 grid gap-8">
          {steps.map((s, i) => (
            <section key={s.label} className="grid gap-2 sm:grid-cols-[10rem_1fr]">
              <h2 className="font-mono text-xs uppercase tracking-wider text-muted">
                0{i + 1} · {s.label}
              </h2>
              <p className="whitespace-pre-line leading-relaxed">{s.text}</p>
            </section>
          ))}
        </div>
      )}

      <div className="prose-content mt-12 border-t border-line pt-10">{renderMarkdoc(project.content.node)}</div>
    </article>
  );
}
