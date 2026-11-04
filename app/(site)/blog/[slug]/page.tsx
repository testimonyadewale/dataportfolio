import Link from "next/link";
import { notFound } from "next/navigation";
import { getPosts, reader, renderMarkdoc } from "@/lib/content";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await reader.collections.posts.read(slug);
  return p ? { title: p.title, description: p.summary } : {};
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await reader.collections.posts.read(slug, { resolveLinkedFiles: true });
  if (!post || post.draft) notFound();

  return (
    <article className="mx-auto max-w-2xl px-5 py-16">
      <Link href="/blog" className="text-sm text-muted hover:text-accent">
        ← All insights
      </Link>
      <p className="mt-8 font-mono text-xs text-muted">{post.date}</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">{post.title}</h1>
      {post.summary && <p className="mt-4 text-lg text-muted">{post.summary}</p>}
      <div className="prose-content mt-10">{renderMarkdoc(post.content.node)}</div>
    </article>
  );
}
