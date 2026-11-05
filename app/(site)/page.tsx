import Image from "next/image";
import Link from "next/link";
import Section from "@/components/Section";
import ProjectCard from "@/components/ProjectCard";
import ContactForm from "@/components/ContactForm";
import {
  categoryLabels,
  formatYm,
  getCertifications,
  getEducation,
  getExperience,
  getPosts,
  getSettings,
  getSkills,
  getSkillUsage,
  reader,
  renderMarkdoc,
} from "@/lib/content";
import { getProjectSummaries } from "@/lib/projects";

export default async function Home() {
  const [settings, about, projects, skills, usage, experience, education, certs, posts] =
    await Promise.all([
      getSettings(),
      reader.singletons.about.read({ resolveLinkedFiles: true }),
      getProjectSummaries(),
      getSkills(),
      getSkillUsage(),
      getExperience(),
      getEducation(),
      getCertifications(),
      getPosts(),
    ]);

  const featured = projects.filter((p) => p.featured);
  const highlight = featured.length ? featured : projects.slice(0, 3);

  const skillGroups = Object.entries(
    skills.reduce<Record<string, typeof skills>>((acc, s) => {
      (acc[s.entry.category] ??= []).push(s);
      return acc;
    }, {})
  );

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="mx-auto grid max-w-5xl items-center gap-12 px-5 pt-16 pb-12 sm:pt-24 md:grid-cols-[1.4fr_1fr]">
        <div>
          {settings.availability && (
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {settings.availability}
            </p>
          )}
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-accent">{settings.role}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            {settings.tagline || settings.name}
          </h1>
          {settings.intro && <p className="mt-6 max-w-xl text-lg text-muted">{settings.intro}</p>}
          {settings.alsoInterestedIn && (
            <p className="mt-3 max-w-xl text-sm text-muted">{settings.alsoInterestedIn}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/projects" className="rounded-full bg-accent px-6 py-3 font-medium text-accent-ink hover:opacity-90">
              See my work
            </Link>
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-3xl border border-line bg-accent-soft">
          {settings.photo ? (
            <Image src={settings.photo} alt={`Portrait of ${settings.name}`} fill priority className="object-cover" sizes="320px" />
          ) : (
            <div className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-muted">
              Photo goes here
              <br />
              <span className="text-xs">(upload it in /keystatic → Site settings)</span>
            </div>
          )}
          <div className="absolute -bottom-px -right-px h-16 w-16 rounded-tl-3xl bg-accent" aria-hidden />
        </div>
      </section>

      {/* ---------- About / pivot story ---------- */}
      {about && (
        <Section id="about" eyebrow="About" title={about.heading}>
          <div className="grid gap-10 md:grid-cols-[1fr_1.6fr]">
            <p className="text-xl leading-relaxed">{about.summary}</p>
            <div className="prose-content text-muted">{renderMarkdoc(about.story.node)}</div>
          </div>
        </Section>
      )}

      {/* ---------- Projects ---------- */}
      {highlight.length > 0 && (
        <Section
          id="projects"
          eyebrow="Portfolio"
          title="Selected projects"
          action={
            <Link href="/projects" className="text-sm font-medium text-accent hover:underline">
              All projects →
            </Link>
          }
        >
          <div className="grid gap-6 md:grid-cols-2">
            {highlight.map((p, i) => (
              <ProjectCard key={p.slug} p={p} large={i === 0} />
            ))}
          </div>
        </Section>
      )}

      {/* ---------- Skills, linked to the projects that use them ---------- */}
      {skills.length > 0 && (
        <Section id="skills" eyebrow="Toolkit" title="Skills, and where I've used them">
          <div className="grid gap-x-10 gap-y-10 md:grid-cols-2">
            {skillGroups.map(([cat, list]) => (
              <div key={cat}>
                <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted">{categoryLabels[cat] ?? cat}</h3>
                <ul className="divide-y divide-line border-y border-line">
                  {list.map((s) => {
                    const used = usage[s.slug] ?? [];
                    return (
                      <li key={s.slug} className="py-4">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="font-medium">{s.entry.name}</span>
                          {s.entry.level && <span className="text-xs text-muted">{s.entry.level}</span>}
                        </div>
                        {used.length > 0 ? (
                          <p className="mt-1 text-sm text-muted">
                            Used in{" "}
                            {used.map((u, i) => (
                              <span key={u.slug}>
                                {i > 0 && (i === used.length - 1 ? " and " : ", ")}
                                <Link href={`/projects/${u.slug}`} className="text-accent hover:underline">
                                  {u.title}
                                </Link>
                              </span>
                            ))}
                          </p>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ---------- Experience ---------- */}
      {experience.length > 0 && (
        <Section id="experience" eyebrow="Experience" title="Where I've worked">
          <ol className="relative space-y-10 border-l border-line pl-8">
            {experience.map(({ slug, entry }) => (
              <li key={slug} className="relative">
                <span className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full border-2 border-accent bg-bg" />
                <p className="font-mono text-xs uppercase tracking-wider text-muted">
                  {formatYm(entry.start)} – {formatYm(entry.end)}
                  {entry.location && ` · ${entry.location}`}
                </p>
                <h3 className="mt-1 text-lg font-semibold">
                  {entry.role} <span className="font-normal text-muted">· {entry.organisation}</span>
                </h3>
                {entry.highlights.length > 0 && (
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted">
                    {entry.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* ---------- Education & certifications ---------- */}
      {(education.length > 0 || certs.length > 0) && (
        <Section id="education" eyebrow="Education" title={certs.length ? "Education & certifications" : "Education"}>
          <div className="grid gap-6 md:grid-cols-2">
            {education.map(({ slug, entry }) => (
              <div key={slug} className="rounded-2xl border border-line bg-surface p-6">
                {(entry.start || entry.end) && (
                  <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted">
                    {entry.start ? `${formatYm(entry.start)} – ` : ""}
                    {entry.end ? formatYm(entry.end) : "Present"}
                  </p>
                )}
                <h3 className="text-lg font-semibold">{entry.qualification}</h3>
                <p className="text-muted">{entry.institution}</p>
                {entry.detail && <p className="mt-3 text-sm text-muted">{entry.detail}</p>}
              </div>
            ))}
          </div>
          {certs.length > 0 && (
            <ul className="mt-10 divide-y divide-line border-y border-line">
              {certs.map(({ slug, entry }) => (
                <li key={slug} className="flex flex-wrap items-baseline justify-between gap-2 py-4">
                  <span>
                    <span className="font-medium">{entry.name}</span>
                    <span className="text-muted"> · {entry.issuer}</span>
                  </span>
                  <span className="text-sm text-muted">
                    {entry.date ? formatYm(entry.date) : ""}
                    {entry.url && (
                      <a href={entry.url} target="_blank" rel="noopener noreferrer" className="ml-3 text-accent hover:underline">
                        Verify
                      </a>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      )}

      {/* ---------- Insights ---------- */}
      <Section
        id="insights"
        eyebrow="Insights"
        title="Notes from the data"
        action={
          posts.length > 0 ? (
            <Link href="/blog" className="text-sm font-medium text-accent hover:underline">
              All posts →
            </Link>
          ) : undefined
        }
      >
        {posts.length > 0 ? (
          <ul className="divide-y divide-line border-y border-line">
            {posts.slice(0, 3).map(({ slug, entry }) => (
              <li key={slug}>
                <Link href={`/blog/${slug}`} className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-8">
                  <span className="w-32 shrink-0 font-mono text-xs text-muted">{entry.date}</span>
                  <span>
                    <span className="font-medium group-hover:text-accent">{entry.title}</span>
                    {entry.summary && <span className="mt-1 block text-sm text-muted">{entry.summary}</span>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">First post coming soon.</p>
        )}
      </Section>

      {/* ---------- Contact ---------- */}
      <Section id="contact" eyebrow="Contact" title="Let's talk">
        <div className="grid gap-10 md:grid-cols-[1fr_1.6fr]">
          <div className="space-y-4 text-muted">
            <p>Hiring for a graduate scheme or analyst role, or need help making sense of your data? Send me a message.</p>
            <div className="flex flex-col gap-2 text-sm">
              {settings.linkedin && (
                <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  LinkedIn →
                </a>
              )}
              {settings.github && (
                <a href={settings.github} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  GitHub →
                </a>
              )}
            </div>
          </div>
          <ContactForm />
        </div>
      </Section>
    </>
  );
}
