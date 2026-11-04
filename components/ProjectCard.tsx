import Link from "next/link";
import Image from "next/image";

export type ProjectSummary = {
  slug: string;
  title: string;
  summary: string;
  industry: string;
  tools: string[]; // skill display names
  keyResult: string;
  cover: string | null;
  status: string;
  featured: boolean;
};

export default function ProjectCard({ p, large = false }: { p: ProjectSummary; large?: boolean }) {
  return (
    <Link
      href={`/projects/${p.slug}`}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition hover:-translate-y-0.5 hover:border-accent ${
        large ? "md:col-span-2 md:flex-row" : ""
      }`}
    >
      <div className={`relative aspect-[16/9] bg-accent-soft ${large ? "md:aspect-auto md:w-1/2" : ""}`}>
        {p.cover ? (
          <Image src={p.cover} alt="" fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
        ) : (
          <div className="absolute inset-0 grid place-items-center font-mono text-xs uppercase tracking-widest text-accent/70">
            {p.industry || "Project"}
          </div>
        )}
      </div>
      <div className={`flex flex-1 flex-col gap-3 p-6 ${large ? "md:p-8" : ""}`}>
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted">
          {p.industry && <span>{p.industry}</span>}
          {p.status === "in-progress" && (
            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-accent">In progress</span>
          )}
        </div>
        <h3 className={`font-semibold tracking-tight group-hover:text-accent ${large ? "text-2xl" : "text-xl"}`}>
          {p.title}
        </h3>
        {p.summary && <p className="text-muted">{p.summary}</p>}
        {p.keyResult && (
          <p className="border-l-2 border-accent pl-3 text-sm font-medium">{p.keyResult}</p>
        )}
        {p.tools.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {p.tools.map((t) => (
              <li key={t} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
