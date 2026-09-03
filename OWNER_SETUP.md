# I Cut owner dashboard setup

The dashboard is available at `/owner/login`. It intentionally stays inactive until a Supabase project is connected; no password or private key is stored in this repository.

1. Create a Supabase project.
2. Open **SQL Editor**, paste `supabase/schema.sql`, and run it once.
3. In **Authentication → Users**, create the owner's email/password account and mark the email as confirmed.
4. In **SQL Editor**, run the final commented owner-profile query from `supabase/schema.sql`, replacing `owner@example.com` with the owner's email.
5. Copy the project URL and public anon key from **Project Settings → API**.
6. In Vercel, add these Production environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Redeploy the latest Vercel deployment.

Never place the Supabase service-role key in a `VITE_` variable or in frontend code.
