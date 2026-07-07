# Everything AI Develop

An MVP for a registry + developer community for AI frameworks, SDKs, tools,
project templates, articles, and discussions.

## Status: architectural scaffold, not a finished product

This codebase implements the **real architecture** described in the brief —
correct Prisma schema, Auth.js config, App Router structure, and one working
page per major section — so it runs and is genuinely extensible. It is not a
fully polished, feature-complete production app: several admin CRUD screens,
notifications, group detail pages, and the full 20/20/30/10/10 seed counts are
stubbed or partial. Treat this as a strong foundation to finish, ideally with
Claude Code, which can iterate on a real repo far faster than a single chat
response can.

## What's implemented

- **Data model** (`prisma/schema.prisma`) — every model from both briefs:
  `User`, `Framework`, `Sdk`, `Tool`, `Template`, `Article`, `Category`, `Tag`,
  `Bookmark`, plus community models `UserProfile`, `Discussion`, `Comment`,
  `Project`, `Group`, `GroupMember`, `Like`, `Notification`.
- **Auth** (`src/lib/auth.ts`) — Auth.js v5 with Google, GitHub, and email
  (magic link) providers, Prisma adapter, auto-created `UserProfile` on
  sign-up.
- **Pages**: home, frameworks (list + filters + detail), SDK library (list +
  detail with install/features/example), tools directory (category + pricing
  filters), project templates (list + detail with folder structure/stack/
  diagram placeholder), articles (MDX-rendered blog), global search,
  community home, discussions (forum + detail + replies), project showcase,
  user profiles, and an admin dashboard shell with a role guard.
- **API routes**: NextAuth handler, global search, polymorphic likes.
- **Design system**: dark, developer/registry-themed Tailwind tokens (deep
  navy base, amber + cyan dual-accent, JetBrains Mono for code/tags, a
  terminal-style hero search as the signature element) — deliberately not the
  generic cream/serif or near-black/acid-green AI-template look.
- **Seed script** (`prisma/seed.ts`) — representative rows for every model,
  written so extending each array to the full MVP target count is copy-paste.

## What's intentionally left as extension points

- Admin **create/edit forms** (dashboard currently shows counts + nav; wire up
  server actions per model using the same patterns as the public pages).
- **Bookmarking UI** (the `Bookmark` model and API pattern from `likes.ts`
  are ready to copy).
- **Notifications** UI (model exists; no producer/consumer wired yet).
- **Group detail pages** (`Group`/`GroupMember` models exist; list page only).
- Full-text search currently uses Postgres `ILIKE` for portability — see the
  comment in `src/app/api/search/route.ts` for the upgrade path to
  `tsvector`/`websearch_to_tsquery`.
- Future modules called out in the brief (MCP Hub, AI Playground, AI
  Assistant, News Aggregator, Learning Roadmaps, Project Generator) have no
  code yet by design — the schema and folder structure (feature-based routes
  under `src/app/`) won't need restructuring to add them.

## Getting started

```bash
npm install
cp .env.example .env        # fill in DATABASE_URL, AUTH_SECRET, OAuth keys
npx prisma generate
npx prisma db push          # or `npm run db:migrate` once you're ready for real migrations
npm run db:seed
npm run dev
```

Generate `AUTH_SECRET` with `openssl rand -base64 32`.

### Deployment

- **Database**: create a Neon Postgres project, copy its connection string
  into `DATABASE_URL` (keep `?sslmode=require`).
- **Hosting**: push to GitHub, import into Vercel, add the same env vars from
  `.env.example` in the Vercel project settings, deploy.
- Auth callback URLs to register with Google/GitHub:
  `https://<your-domain>/api/auth/callback/google` and `.../github`.

## Folder structure

```
prisma/
  schema.prisma       # full data model
  seed.ts             # representative seed data
src/
  app/                # Next.js App Router — one folder per route
    admin/            # role-gated admin dashboard
    api/              # auth, search, likes
    articles/ frameworks/ sdks/ tools/ templates/
    community/        # discussions, projects, profile
  components/
    ui/               # shadcn-style primitives (button, card, badge, skeleton)
    shared/           # header, footer, hero search, like button
  lib/                # prisma client, auth config, likes helper, utils
  types/              # next-auth session augmentation
```

## Extending the seed data to full MVP counts

`prisma/seed.ts` arrays (`FRAMEWORKS`, `SDKS`, `TOOLS`, `TEMPLATES`,
`ARTICLES`) currently hold a representative subset. Add more objects in the
same shape to reach 20 frameworks / 20 SDKs / 30 tools / 10 templates / 10
articles — no code changes needed elsewhere.
