"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProjectCard, { type ProjectSummary } from "./ProjectCard";

/** Filter by tool first, then by industry. State lives in the URL so filters are shareable. */
export default function ProjectFilter({ projects }: { projects: ProjectSummary[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const tool = params.get("tool") ?? "";
  const industry = params.get("industry") ?? "";

  const tools = useMemo(
    () => [...new Set(projects.flatMap((p) => p.tools))].sort(),
    [projects]
  );
  const byTool = tool ? projects.filter((p) => p.tools.includes(tool)) : projects;
  const industries = useMemo(
    () => [...new Set(byTool.map((p) => p.industry).filter(Boolean))].sort(),
    [byTool]
  );
  const shown = industry ? byTool.filter((p) => p.industry === industry) : byTool;

  function set(key: "tool" | "industry", value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    if (key === "tool") next.delete("industry"); // industry options depend on tool
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1 text-sm transition-colors ${
      active ? "border-accent bg-accent text-accent-ink" : "border-line text-muted hover:border-ink hover:text-ink"
    }`;

  return (
    <div>
      <div className="space-y-4">
        <FilterRow label="Tool">
          <button className={chip(!tool)} onClick={() => set("tool", "")}>All</button>
          {tools.map((t) => (
            <button key={t} className={chip(tool === t)} onClick={() => set("tool", t)}>{t}</button>
          ))}
        </FilterRow>
        {industries.length > 0 && (
          <FilterRow label="Industry">
            <button className={chip(!industry)} onClick={() => set("industry", "")}>All</button>
            {industries.map((i) => (
              <button key={i} className={chip(industry === i)} onClick={() => set("industry", i)}>{i}</button>
            ))}
          </FilterRow>
        )}
      </div>

      <p className="mt-8 mb-4 text-sm text-muted">
        {shown.length} project{shown.length === 1 ? "" : "s"}
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {shown.map((p) => (
          <ProjectCard key={p.slug} p={p} />
        ))}
      </div>
      {shown.length === 0 && <p className="text-muted">No projects match those filters yet.</p>}
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-20 font-mono text-xs uppercase tracking-wider text-muted">{label}</span>
      {children}
    </div>
  );
}
