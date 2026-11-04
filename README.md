# testimonyadewale.com

Personal data analytics portfolio. Next.js 15 + Keystatic (content stored in this GitHub repo) + Vercel.

Everything on the site (projects, skills, CV, photo, blog posts, experience, education) is edited in the Keystatic editor at **/keystatic**. You never need to touch code to add a project.

---

## 1. Run it on your laptop

You need [Node.js 20+](https://nodejs.org) and Git.

```bash
npm install
npm run dev
```

- Site: http://localhost:3000
- Editor: http://localhost:3000/keystatic

Locally, edits save straight to the files in `content/` and `public/`.

## 2. Put it on GitHub

Create an empty repo on GitHub (e.g. `portfolio`), then:

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/portfolio.git
git push -u origin main
```

## 3. Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new), import the repo. Framework is detected as Next.js; keep the defaults.
2. Under **Environment Variables**, add:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND` | `github` |
   | `NEXT_PUBLIC_GITHUB_OWNER` | your GitHub username |
   | `NEXT_PUBLIC_GITHUB_REPO` | `portfolio` (your repo name) |
   | `NEXT_PUBLIC_SITE_URL` | `https://testimonyadewale.com` |

3. Deploy.

The site builds and works at this point, but `/keystatic` on the live site will say it is
missing configuration until you finish step 4 — that is expected.

## 4. Turn on editing from the live site (Keystatic GitHub mode)

Keystatic needs a small GitHub App so the editor can commit for you. It is created from your
laptop, then its keys are copied to Vercel.

1. Locally, create `.env.local` with the three `NEXT_PUBLIC_…` values from the table above.
2. Run `npm run dev` and open http://localhost:3000/keystatic.
3. Keystatic walks you through creating the GitHub App. Name it something like `testimony-portfolio-keystatic`. Add these callback URLs in the app settings:
   - `http://127.0.0.1:3000/api/keystatic/github/oauth/callback`
   - `https://testimonyadewale.com/api/keystatic/github/oauth/callback`
4. When it finishes, `.env.local` will contain `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` and `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`. **Copy all four into Vercel's Environment Variables** and redeploy.
5. Install the GitHub App on your portfolio repo when prompted.

Now `https://testimonyadewale.com/keystatic` → sign in with GitHub → edit → Save. Each save commits to the repo, and Vercel redeploys automatically (about a minute).

Remove `.env.local`'s `NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND` line if you want local editing to go back to saving files on your laptop.

## 5. Connect testimonyadewale.com

1. Buy the domain (Vercel → Domains, or any registrar such as Namecheap or Cloudflare).
2. Vercel project → **Settings → Domains** → add `testimonyadewale.com` and `www.testimonyadewale.com`.
3. If you bought it elsewhere, add the DNS records Vercel shows you (an `A` record for the root and a `CNAME` for `www`). HTTPS is set up automatically.

## 6. Contact form (emails you via Resend)

1. Sign up at [resend.com](https://resend.com) (free tier is plenty) and create an API key.
2. In Vercel add:
   - `RESEND_API_KEY` = your key
   - `CONTACT_TO_EMAIL` = the inbox you want messages in
   - `CONTACT_FROM_EMAIL` = `Portfolio <onboarding@resend.dev>` to start
3. Later, verify `testimonyadewale.com` in Resend (it gives you DNS records to add) and change the sender to `Portfolio <hello@testimonyadewale.com>`. Messages are then less likely to land in spam.

Hitting Reply on a message replies straight to the person who wrote it. Until the keys are set, the form politely tells visitors to use LinkedIn.

---

## Where things live in the editor

| Editor section | What it controls |
|---|---|
| **Site settings, photo & CV** | Name, headline, intro, photo, CV PDF (shown inline in the CV section), LinkedIn, GitHub, availability badge |
| **About & pivot story** | The philosophy → data story |
| **Projects** | Each case study. Pick *Tools used* from your Skills; that's what powers the skill links and the tool filter. Tick *Featured* to show it on the home page. |
| **Skills** | Each skill shows "Used in…" links automatically, based on which projects list it |
| **Experience / Education / Certifications** | Sections stay hidden until they have at least one entry |
| **Blog / insights** | Posts start as *Draft*; untick it to publish |

## Project structure

```
app/(site)/        public pages (home, /projects, /projects/[slug], /blog, /blog/[slug])
app/keystatic/     the editor UI
app/api/contact/   contact form → Resend
components/        UI pieces
content/           all your content (edited via Keystatic)
keystatic.config.ts  content schema
public/images, public/resume   uploaded photo, project images, CV
```
