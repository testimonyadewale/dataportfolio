import { config, collection, singleton, fields } from "@keystatic/core";

// Local storage while you work on your laptop (`npm run dev`),
// GitHub storage on the live site so edits at /keystatic commit to your repo.
const useGithub = process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND === "github";
const repo = `${process.env.NEXT_PUBLIC_GITHUB_OWNER ?? "owner"}/${
  process.env.NEXT_PUBLIC_GITHUB_REPO ?? "repo"
}` as `${string}/${string}`;

const yearMonth = (label: string) =>
  fields.text({ label, description: "e.g. 2024-09 (leave blank if not applicable)" });

export default config({
  storage: useGithub ? { kind: "github", repo } : { kind: "local" },

  ui: {
    brand: { name: "Testimony's portfolio" },
    navigation: {
      "Site": ["settings", "about"],
      "Work": ["projects", "skills", "experience"],
      "Background": ["education", "certifications"],
      "Writing": ["posts"],
    },
  },

  singletons: {
    settings: singleton({
      label: "Site settings, photo & CV",
      path: "content/settings",
      format: "json",
      schema: {
        name: fields.text({ label: "Full name", defaultValue: "Testimony Adewale" }),
        role: fields.text({ label: "Role line", defaultValue: "Data Analyst" }),
        tagline: fields.text({ label: "Headline", multiline: true }),
        intro: fields.text({ label: "Short intro under the headline", multiline: true }),
        alsoInterestedIn: fields.text({
          label: "Secondary interest line",
          description: "Shown quietly in the hero, e.g. product and technical project management",
        }),
        photo: fields.image({
          label: "Professional photo",
          description: "Square-ish portrait works best (at least 800×800).",
          directory: "public/images/profile",
          publicPath: "/images/profile/",
        }),
        resume: fields.file({
          label: "CV / resume (PDF)",
          directory: "public/resume",
          publicPath: "/resume/",
        }),
        email: fields.text({ label: "Public email (optional)" }),
        linkedin: fields.url({ label: "LinkedIn URL" }),
        github: fields.url({ label: "GitHub URL" }),
        location: fields.text({ label: "Location", defaultValue: "London, UK" }),
        availability: fields.text({
          label: "Availability note",
          description: "Small badge in the hero, e.g. 'Open to graduate roles from late 2027'",
        }),
      },
    }),

    about: singleton({
      label: "About & pivot story",
      path: "content/about",
      format: { contentField: "story" },
      schema: {
        heading: fields.text({ label: "Heading", defaultValue: "From philosophy to data" }),
        summary: fields.text({ label: "One-paragraph summary", multiline: true }),
        story: fields.markdoc({ label: "The story (why you pivoted)", extension: "mdoc" }),
      },
    }),
  },

  collections: {
    skills: collection({
      label: "Skills",
      slugField: "name",
      path: "content/skills/*",
      format: "json",
      schema: {
        name: fields.slug({ name: { label: "Skill" } }),
        category: fields.select({
          label: "Category",
          options: [
            { label: "Analysis & spreadsheets", value: "analysis" },
            { label: "Databases & querying", value: "data" },
            { label: "Visualisation & BI", value: "bi" },
            { label: "Programming & ML", value: "programming" },
            { label: "Product & delivery", value: "product" },
          ],
          defaultValue: "analysis",
        }),
        level: fields.select({
          label: "Level",
          options: [
            { label: "Expert", value: "Expert" },
            { label: "Advanced", value: "Advanced" },
            { label: "Intermediate", value: "Intermediate" },
            { label: "Beginner", value: "Beginner" },
            { label: "Don't show", value: "" },
          ],
          defaultValue: "",
        }),
        order: fields.integer({ label: "Sort order", defaultValue: 10 }),
      },
    }),

    projects: collection({
      label: "Projects",
      slugField: "title",
      path: "content/projects/*",
      format: { contentField: "content" },
      entryLayout: "content",
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        summary: fields.text({ label: "One-line summary (card text)", multiline: true }),
        featured: fields.checkbox({ label: "Featured on the home page" }),
        order: fields.integer({ label: "Sort order (lower shows first)", defaultValue: 10 }),
        industry: fields.text({ label: "Industry", description: "e.g. Retail, Aviation, Finance" }),
        tools: fields.array(
          fields.relationship({ label: "Tool", collection: "skills" }),
          { label: "Tools used (links to Skills)", itemLabel: (p) => p.value ?? "Pick a skill" }
        ),
        keyResult: fields.text({
          label: "Headline result",
          description: "The one number that matters, e.g. 'Cut forecast error by 23%'",
        }),
        problem: fields.text({ label: "Problem", multiline: true }),
        data: fields.text({ label: "Data", multiline: true }),
        approach: fields.text({ label: "Approach / method", multiline: true }),
        results: fields.text({ label: "Results & impact", multiline: true }),
        cover: fields.image({
          label: "Cover image (dashboard screenshot, chart…)",
          directory: "public/images/projects",
          publicPath: "/images/projects/",
        }),
        githubUrl: fields.url({ label: "GitHub repo" }),
        liveUrl: fields.url({ label: "Live app" }),
        dashboardUrl: fields.url({ label: "Dashboard (Power BI / Tableau public link)" }),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Complete", value: "complete" },
            { label: "In progress", value: "in-progress" },
          ],
          defaultValue: "complete",
        }),
        content: fields.markdoc({ label: "Full case study", extension: "mdoc" }),
      },
    }),

    experience: collection({
      label: "Experience",
      slugField: "role",
      path: "content/experience/*",
      format: "json",
      schema: {
        role: fields.slug({ name: { label: "Job title" } }),
        organisation: fields.text({ label: "Organisation" }),
        location: fields.text({ label: "Location" }),
        start: yearMonth("Start"),
        end: yearMonth("End (blank = present)"),
        highlights: fields.array(fields.text({ label: "Achievement" }), {
          label: "Achievements (use numbers where you can)",
          itemLabel: (p) => p.value,
        }),
      },
    }),

    education: collection({
      label: "Education",
      slugField: "qualification",
      path: "content/education/*",
      format: "json",
      schema: {
        qualification: fields.slug({ name: { label: "Qualification (e.g. MSc Data Analytics)" } }),
        institution: fields.text({ label: "Institution" }),
        start: yearMonth("Start"),
        end: yearMonth("End / expected"),
        detail: fields.text({
          label: "Detail (dissertation, focus modules…)",
          multiline: true,
        }),
        order: fields.integer({ label: "Sort order (lower shows first)", defaultValue: 10 }),
      },
    }),

    certifications: collection({
      label: "Certifications",
      slugField: "name",
      path: "content/certifications/*",
      format: "json",
      schema: {
        name: fields.slug({ name: { label: "Certification" } }),
        issuer: fields.text({ label: "Issuer" }),
        date: yearMonth("Date earned"),
        url: fields.url({ label: "Credential link" }),
      },
    }),

    posts: collection({
      label: "Blog / insights",
      slugField: "title",
      path: "content/posts/*",
      format: { contentField: "content" },
      entryLayout: "content",
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        date: fields.date({ label: "Published", defaultValue: { kind: "today" } }),
        summary: fields.text({ label: "Summary", multiline: true }),
        draft: fields.checkbox({ label: "Draft (hidden on the site)", defaultValue: true }),
        content: fields.markdoc({ label: "Post", extension: "mdoc" }),
      },
    }),
  },
});
