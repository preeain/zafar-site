# Zafar Sandhu — Official Site

Official artist website and private control room for Zafar Sandhu. The application is intentionally isolated from the Pree Mayall website and any other artist system.

## Production

- Website: [zafarsandhu.com](https://zafarsandhu.com)
- Admin: `/admin/login`
- Hosting: Vercel
- Framework: Next.js 16 App Router
- Optional backend: a dedicated Zafar Supabase project

The public website is resilient by design: when Supabase is not configured or reachable, it renders the verified content in `content/site.ts`. Admin and audience tools remain disabled until the private backend variables are present.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Before shipping:

```bash
npm run build
npm audit --omit=dev
```

## Zafar Control Room

The private `/admin` area supports:

- Structured editing for the complete public site
- Private drafts and explicit publishing
- Media uploads
- Circle audience search and CSV export
- An administrative audit trail

### Backend setup

1. Create a Supabase project exclusively for Zafar.
2. Copy `.env.example` to `.env.local` and fill in the Zafar project values.
3. Apply `supabase/migrations/20260825204614_create_zafar_cms.sql` to that project only.
4. Create the approved administrator account in Supabase Authentication.
5. Add the same variables to the Zafar Vercel project.
6. Sign in at `/admin/login`, save a draft, and publish it.

Required variables:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAILS=
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only. Never expose it in browser code or give it a `NEXT_PUBLIC_` prefix.

## The Circle

When Supabase is configured, the signup endpoint stores the consented email and optional city in the Zafar database. If Supabase is unavailable, `MAILING_LIST_WEBHOOK_URL` can forward the signup to a provider such as Brevo.

The route includes same-origin validation, a body-size limit, explicit consent, a honeypot, and a per-instance rate limit. Durable edge rate limiting, confirmed opt-in, welcome email, and provider-level unsubscribe synchronization still require the selected production email account.

Optional fallback payload:

```json
{
  "email": "listener@example.com",
  "city": "Vancouver",
  "consent": true,
  "consentVersion": "2026-08-28",
  "source": "zafarsandhu.com"
}
```
