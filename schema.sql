-- Create a table for public profiles using Supabase Auth
create table profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  business_name text unique, -- only for vendors
  phone text,
  instagram_username text,
  is_vendor boolean default false,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  constraint business_name_check check (is_vendor = false or business_name is not null)
);

-- Row Level Security for profiles
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for products
create table products (
  id uuid default uuid_generate_v4() primary key,
  vendor_id uuid references profiles(id) not null,
  title text not null,
  description text,
  price numeric not null,
  category text not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security for products
alter table products enable row level security;

create policy "Products are viewable by everyone." on products
  for select using (true);

create policy "Vendors can insert their own products." on products
  for insert with check (auth.uid() = vendor_id);

create policy "Vendors can update their own products." on products
  for update using (auth.uid() = vendor_id);

create policy "Vendors can delete their own products." on products
  for delete using (auth.uid() = vendor_id);

-- Storage bucket for products
insert into storage.buckets (id, name, public) values ('products', 'products', true);

create policy "Product images are viewable by everyone"
  on storage.objects for select
  using ( bucket_id = 'products' );

create policy "Vendors can upload product images"
  on storage.objects for insert
  with check ( bucket_id = 'products' and auth.role() = 'authenticated' );

-- Trigger to handle new user signup automatically
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, is_vendor, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone',
    (new.raw_user_meta_data ->> 'is_vendor')::boolean,
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
