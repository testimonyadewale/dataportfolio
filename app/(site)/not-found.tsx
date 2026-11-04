import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-32 text-center">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-2 text-3xl font-semibold">This page isn't in the dataset.</h1>
      <Link href="/" className="mt-6 inline-block text-accent hover:underline">
        Back home →
      </Link>
    </div>
  );
}
