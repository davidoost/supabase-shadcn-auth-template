- run npm i
- add env variables

## Set up a user_profiles table in your Supabase

...

## Set up a trigger and function

...

## Set up your urls

TODO

- comments on all code
- Finish Readme

## Supabase setup

First, set up a profiles table;

```
create table user_profiles (
  id uuid not null primary key references auth.users (id),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  email text not null,
  first_name text not null,
  last_name text not null
);
```

Then, enable RLS and add appropriate access policies;

```
alter table user_profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on user_profiles
  for select using (true);

create policy "Users can insert their own profile." on user_profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update their own profile." on user_profiles
  for update using ((select auth.uid()) = id);
```

Now, we add a function that adds a user_profile, and we trigger it each time a user signs up;

```
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
```

And lastly, add a function that triggers on user update, that makes sure the email stays synced.

```
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
