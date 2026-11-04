import { Suspense } from "react";
import Section from "@/components/Section";
import ProjectFilter from "@/components/ProjectFilter";
import { getProjectSummaries } from "@/lib/projects";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await getProjectSummaries();
  return (
    <Section eyebrow="Portfolio" title="Projects">
      <p className="-mt-4 mb-10 max-w-2xl text-muted">
        Filter by the tool you care about, then narrow by industry. Each project walks through the problem, the data, the
        method and the result.
      </p>
      <Suspense>
        <ProjectFilter projects={projects} />
      </Suspense>
    </Section>
  );
}
