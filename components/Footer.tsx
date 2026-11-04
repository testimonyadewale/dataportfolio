import type { getSettings } from "@/lib/content";

type Settings = Awaited<ReturnType<typeof getSettings>>;

export default function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {settings.name}
        </p>
        <div className="flex gap-5">
          {settings.linkedin && (
            <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
              LinkedIn
            </a>
          )}
          {settings.github && (
            <a href={settings.github} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
              GitHub
            </a>
          )}
          <a href="/#contact" className="hover:text-accent">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
