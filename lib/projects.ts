import { getProjects, getSkills } from "./content";
import type { ProjectSummary } from "@/components/ProjectCard";

export async function getSkillNames() {
  const skills = await getSkills();
  return Object.fromEntries(skills.map((s) => [s.slug, s.entry.name])) as Record<string, string>;
}

export async function getProjectSummaries(): Promise<ProjectSummary[]> {
  const [projects, names] = await Promise.all([getProjects(), getSkillNames()]);
  return projects.map(({ slug, entry }) => ({
    slug,
    title: entry.title,
    summary: entry.summary,
    industry: entry.industry,
    tools: entry.tools.filter((t): t is string => !!t).map((t) => names[t] ?? t),
    keyResult: entry.keyResult,
    cover: entry.cover,
    status: entry.status,
    featured: entry.featured,
  }));
}
