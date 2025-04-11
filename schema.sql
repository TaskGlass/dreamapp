-- Create schema for DreamSage application

-- Enable Row Level Security
alter table auth.users enable row level security;

-- Create profiles table that extends the auth.users table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  email text not null,
  dream_credits integer not null default 10,
  is_subscribed boolean not null default false,
  subscription_plan text,
  subscription_end_date timestamp with time zone,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Create dreams table
create table public.dreams (
  id uuid default uuid_generate_v4() primary key not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  date date not null,
  emotion text,
  clarity text check (clarity in ('low', 'medium', 'high')) not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Create interpretations table
create table public.interpretations (
  id uuid default uuid_generate_v4() primary key not null,
  dream_id uuid references public.dreams(id) on delete cascade not null,
  interpretation_text text not null,
  symbols jsonb not null,
  actions jsonb not null,
  created_at timestamp with time zone default now() not null
);

-- Set up Row Level Security policies

-- Profiles: Users can only view and update their own profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Dreams: Users can only CRUD their own dreams
create policy "Users can view their own dreams"
  on public.dreams for select
  using (auth.uid() = user_id);

create policy "Users can create their own dreams"
  on public.dreams for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own dreams"
  on public.dreams for update
  using (auth.uid() = user_id);

create policy "Users can delete their own dreams"
  on public.dreams for delete
  using (auth.uid() = user_id);

-- Interpretations: Users can only view interpretations for their own dreams
create policy "Users can view interpretations for their own dreams"
  on public.interpretations for select
  using (auth.uid() = (select user_id from public.dreams where id = dream_id));

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Enable realtime for all tables
alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.dreams;
alter publication supabase_realtime add table public.interpretations;
