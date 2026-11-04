import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "next-themes";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/content";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://testimonyadewale.com";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const title = `${s.name} | ${s.role}`;
  const description = s.intro || s.tagline || `${s.name}, ${s.role}.`;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s | ${s.name}` },
    description,
    openGraph: { title, description, url: siteUrl, siteName: s.name, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <html lang="en-GB" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header name={settings.name} />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
        </ThemeProvider>
      </body>
    </html>
  );
}
