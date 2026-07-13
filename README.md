<div align="center">
  <img src="public/logo.svg" alt="Open Poll" width="80" />
  <h1>Open Poll</h1>
  <p><strong>Free, beautiful, open-source polling. No accounts. No ads. No tracking.</strong></p>

<a href="https://openpollapp.vercel.app">Official Site</a> · <a href="#local-setup">Self-Host</a> · <a href="#contributing">Contribute</a>

<br /><br />
<img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
<img src="https://img.shields.io/badge/Supabase-Postgres-3FCF8E?logo=supabase" alt="Supabase" />
<img src="https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss" alt="Tailwind" />
<img src="https://img.shields.io/badge/License-MIT-blue" alt="MIT License" />
</div>

---

## What is Open Poll?

Open Poll is a **zero-friction polling platform** designed with a minimalist editorial aesthetic. Create a poll, share the link, get results - all without creating an account.

Every poll is **temporary by design**. When it expires (max 14 days), it's permanently and physically deleted from the database. No trace left behind.

## Features

| Feature           | Description                                                           |
| ----------------- | --------------------------------------------------------------------- |
| **No Accounts**   | Create and vote instantly - zero sign-up friction                     |
| **Admin Panel**   | Secure one-time admin link + optional password to manage your poll    |
| **Auto-Deletion** | Polls self-destruct after expiry via `pg_cron` - no trace left behind |
| **Real-Time**     | Live vote updates powered by Supabase Realtime                        |
| **Anti-Fraud**    | Device fingerprinting prevents duplicate votes without tracking users |
| **Open Source**   | MIT licensed - inspect the code, self-host, or contribute             |

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router, Server Actions, Turbopack)
- **Database:** [Supabase](https://supabase.com) (Postgres + Realtime + RLS)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **Animations:** [Motion](https://motion.dev) (formerly Framer Motion)
- **Charts:** [Recharts](https://recharts.org)
- **Fonts:** [Geist](https://vercel.com/font) + [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif)

## Security Architecture

Open Poll uses a **two-client security model**:

| Layer       | Key             | Access                                              |
| ----------- | --------------- | --------------------------------------------------- |
| **Browser** | Publishable key | Read-only - can only see safe columns               |
| **Server**  | Secret key      | Full access - handles all writes via Server Actions |

**What's hidden from the browser:**

- `admin_token` and `admin_password` on polls (column-level grants)
- `fingerprint` on votes (column-level grants)
- All INSERT/UPDATE/DELETE operations (revoked from anon role)

RLS is enabled on all tables. Supabase security advisors return **0 warnings**.

---

## Local Setup

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/openpoll.git
cd openpoll
npm install
```

### 2. Create a Supabase Project

Create a free project at [supabase.com](https://supabase.com), then run the following SQL in the **SQL Editor**:

```sql
-- Polls table
CREATE TABLE public.polls (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  question text NOT NULL CHECK (char_length(question) >= 3 AND char_length(question) <= 255),
  options jsonb NOT NULL,
  is_public boolean NOT NULL DEFAULT true,
  allow_multiple boolean NOT NULL DEFAULT false,
  admin_token text NOT NULL,
  admin_password text,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Votes table
CREATE TABLE public.votes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id uuid NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  option_id text NOT NULL,
  fingerprint text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE UNIQUE INDEX votes_poll_fingerprint_idx ON public.votes (poll_id, fingerprint) WHERE TRUE;
CREATE INDEX votes_poll_id_idx ON public.votes (poll_id);
CREATE INDEX polls_expires_at_idx ON public.polls (expires_at);
```

### 3. Enable RLS & Security

```sql
-- Enable Row Level Security
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Public read-only policies
CREATE POLICY "polls_public_read" ON public.polls FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "votes_public_read" ON public.votes FOR SELECT TO anon, authenticated USING (true);

-- Column-level grants (hide sensitive data from browser)
REVOKE ALL ON public.polls FROM anon, authenticated;
GRANT SELECT (id, slug, question, options, is_public, allow_multiple, expires_at, created_at) ON public.polls TO anon, authenticated;

REVOKE ALL ON public.votes FROM anon, authenticated;
GRANT SELECT (id, poll_id, option_id, created_at) ON public.votes TO anon, authenticated;
```

### 4. Enable Auto-Deletion

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
GRANT USAGE ON SCHEMA cron TO postgres;

-- Delete expired polls daily at midnight UTC
SELECT cron.schedule(
  'delete-expired-polls',
  '0 0 * * *',
  $$ DELETE FROM public.polls WHERE expires_at < now(); $$
);
```

### 5. Enable Realtime

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.votes;
```

### 6. Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxx
SUPABASE_SECRET_KEY=your_secret_key
```

### 7. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add your Supabase env vars in the Vercel dashboard
4. Deploy

The Vercel Supabase integration automatically provisions the correct environment variable names.

---

## Project Structure

```
openpoll/
├── app/
│   ├── page.tsx              # Landing page
│   ├── create/page.tsx       # 3-step poll creation wizard
│   ├── privacy/page.tsx      # Privacy policy
│   ├── terms/page.tsx        # Terms of service
│   ├── actions.ts            # Server Actions (service-role client)
│   ├── api/vote/route.ts     # Vote API with validation & rate limiting
│   └── p/[slug]/
│       ├── page.tsx          # Poll voting page
│       ├── results/page.tsx  # Live results with charts
│       └── admin/            # Admin panel (token + password auth)
├── components/ui/            # shadcn/ui components + logo
├── hooks/                    # usePoll, useLiveVotes (Realtime)
├── lib/
│   ├── supabase/client.ts    # Browser client (publishable key)
│   ├── supabase/server.ts    # Server client (secret key)
│   └── types.ts              # Zod schemas + TypeScript types
└── public/                   # Logo, icons, favicons
```

## Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## License

Released under the [MIT License](LICENSE).
