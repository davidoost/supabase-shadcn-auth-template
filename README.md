# 🔥 Next.js Template Starter

A **batteries-included** Next.js starter template with:

- ✅ [Supabase](https://supabase.com/docs/guides/auth/server-side/nextjs?queryGroups=router&router=app) Auth (fully wired)
- 🎨 [ShadCN UI](https://ui.shadcn.dev/)
- 🌍 [next-intl](https://next-intl-docs.vercel.app/) for internationalization
- 🌓 [next-themes](https://github.com/pacocoursey/next-themes) for dark/light mode

---

## 🚀 Getting Started

```bash
npm install
```

---

## 🔑 Supabase Setup

This template uses Supabase for authentication (email + password).

### 1. Create a Supabase project

Go to supabase.com and create a new project.

### 2. Set environment variables

In your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these in Supabase under **Project Settings → API Keys**.

### 3. Configure Allowed URLs

In Supabase, under **Authentication → URL Configuration**, add your urls to the **Redirect URLs**. For example:

- `http://localhost:3000`
- `https://yourproject.vercel.app`

This allows these urls to be used as redirect urls after signup and password reset confirmations.

### 4. Configure e-mail templates

In Supabase, under **Authentication → Emails**, we need to adjust the **Confirm Signup** and **Reset Password** email templates to point to our confirmation route. For **Confirm Signup**, change `{{ .ConfirmationURL }}` to `{{ .RedirectTo }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/profile`. For **Reset Password**, change `{{ .ConfirmationURL }}` to `{{ .RedirectTo }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/auth/reset-password`.

### 5. Run Supabase SQL setup

This template expects certain tables and auth settings. You can copy below script and run it in its entirety or run the snippets individually to get a better understanding of what we're doing.

```sql
-- First, set up a profiles table

create table user_profiles (
  id uuid not null primary key references auth.users (id),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  email text not null,
  first_name text not null,
  last_name text not null
);

-- Then, enable RLS and add appropriate access policies

alter table user_profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on user_profiles
  for select using (true);

create policy "Users can insert their own profile." on user_profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update their own profile." on user_profiles
  for update using ((select auth.uid()) = id);

-- Now, we add a function that adds a user_profile, and we trigger it each time a user signs up;

create function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.user_profiles (id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- And lastly, add a function that triggers on user update, that makes sure the email stays synced.

create function public.sync_user_email()
returns trigger
set search_path = ''
as $$
begin
  update public.user_profiles
  set email = new.email,
      updated_at = now()
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_updated
  after update of email on auth.users
  for each row
  when (old.email is distinct from new.email)
  execute procedure public.sync_user_email();
```
