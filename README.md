# Xbee.social

Xbee.social is a Next.js social app. Supabase provides user accounts, persistent conversations, and live message delivery.

## Run locally

1. Install Node.js 20.9 or later.
2. Install packages:

   ```powershell
   npm ci
   ```

3. Create a Supabase project. In **Project Settings > API**, copy the project URL and anon key.
4. Create a local environment file and add those values:

   ```powershell
   Copy-Item .env.example .env.local
   ```

   Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`. Never put a service-role key in a `NEXT_PUBLIC_` variable or commit `.env.local`.

5. In the Supabase SQL Editor, run [`supabase/schema.sql`](./supabase/schema.sql) for a new project. For a project that already has the schema, run [`supabase/realtime_messaging_migration.sql`](./supabase/realtime_messaging_migration.sql).
6. Start the app:

   ```powershell
   npm run dev
   ```

   Open `http://localhost:3000`, create accounts for two users, and test messages in separate browsers. New accounts must be able to sign in through Supabase Auth.

Without Supabase credentials, the app falls back to local demo mode; demo accounts and replies are not shared with other users.

## Deploy

Deploy the repository with a Next.js host such as Vercel. Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the host's project environment settings for the production environment, apply the SQL setup above, and deploy the `main` branch. Add the deployed site URL to the Supabase Auth redirect URL allowlist. Keep the Supabase service-role key private and do not expose it to the browser.

Live chats are protected by Supabase row-level security and delivered through Supabase Realtime. Message contents are not end-to-end encrypted; the app uses HTTPS and database access policies, so the interface describes them as private chats rather than encrypted chats.
