import Link from "next/link";
import Section from "@/components/Section";
import { getPosts } from "@/lib/content";

export const metadata = { title: "Insights" };

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <Section eyebrow="Insights" title="Notes from the data">
      {posts.length === 0 ? (
        <p className="text-muted">First post coming soon.</p>
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {posts.map(({ slug, entry }) => (
            <li key={slug}>
              <Link href={`/blog/${slug}`} className="group flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:gap-8">
                <span className="w-32 shrink-0 font-mono text-xs text-muted">{entry.date}</span>
                <span>
                  <span className="text-lg font-medium group-hover:text-accent">{entry.title}</span>
                  {entry.summary && <span className="mt-1 block text-muted">{entry.summary}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
