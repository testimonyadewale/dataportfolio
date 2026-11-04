import { createReader } from "@keystatic/core/reader";
import Markdoc, { type Node } from "@markdoc/markdoc";
import React from "react";
import config from "@/keystatic.config";

// At build time the site reads content straight from the repo files.
export const reader = createReader(process.cwd(), config);

export async function getSettings() {
  return (await reader.singletons.settings.read()) ?? {
    name: "Testimony Adewale",
    role: "Data Analyst",
    tagline: "",
    intro: "",
    alsoInterestedIn: "",
    photo: null,
    resume: null,
    email: "",
    linkedin: null,
    github: null,
    location: "",
    availability: "",
  };
}

export async function getSkills() {
  const skills = await reader.collections.skills.all();
  return skills.sort((a, b) => (a.entry.order ?? 0) - (b.entry.order ?? 0));
}

export async function getProjects() {
  const projects = await reader.collections.projects.all();
  return projects.sort((a, b) => (a.entry.order ?? 0) - (b.entry.order ?? 0));
}

export async function getProject(slug: string) {
  return reader.collections.projects.read(slug, { resolveLinkedFiles: true });
}

export async function getExperience() {
  const items = await reader.collections.experience.all();
  // Most recent first: current roles (no end) on top, then by end/start date.
  return items.sort((a, b) => {
    const ae = a.entry.end || "9999";
    const be = b.entry.end || "9999";
    return be.localeCompare(ae) || (b.entry.start ?? "").localeCompare(a.entry.start ?? "");
  });
}

export async function getEducation() {
  const items = await reader.collections.education.all();
  return items.sort((a, b) => (a.entry.order ?? 10) - (b.entry.order ?? 10));
}

export async function getCertifications() {
  const items = await reader.collections.certifications.all();
  return items.sort((a, b) => (b.entry.date ?? "").localeCompare(a.entry.date ?? ""));
}

export async function getPosts() {
  const posts = await reader.collections.posts.all();
  return posts
    .filter((p) => !p.entry.draft)
    .sort((a, b) => (b.entry.date ?? "").localeCompare(a.entry.date ?? ""));
}

/** Map of skill slug -> projects that use it. */
export async function getSkillUsage() {
  const projects = await getProjects();
  const usage: Record<string, { slug: string; title: string }[]> = {};
  for (const p of projects) {
    for (const tool of p.entry.tools) {
      if (!tool) continue;
      (usage[tool] ??= []).push({ slug: p.slug, title: p.entry.title });
    }
  }
  return usage;
}

/** Render a Keystatic Markdoc field to React. */
export function renderMarkdoc(node: Node) {
  const tree = Markdoc.transform(node);
  return Markdoc.renderers.react(tree, React);
}

export function formatYm(ym?: string | null) {
  if (!ym) return "Present";
  const [y, m] = ym.split("-");
  if (!m) return y;
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export const categoryLabels: Record<string, string> = {
  analysis: "Analysis & spreadsheets",
  data: "Databases & querying",
  bi: "Visualisation & BI",
  programming: "Programming & ML",
  product: "Product & delivery",
};
