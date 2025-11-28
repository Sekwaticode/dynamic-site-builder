-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create hero_section table
create table public.hero_section (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text not null,
  cta_text text not null default 'Get in Touch',
  cta_url text not null default '#',
  hero_image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create hero_cards table (3 feature cards)
create table public.hero_cards (
  id uuid primary key default gen_random_uuid(),
  hero_id uuid references public.hero_section(id) on delete cascade,
  icon_name text not null,
  subtitle text not null,
  title text not null,
  display_order int not null default 0,
  created_at timestamp with time zone default now()
);

-- Create about_section table
create table public.about_section (
  id uuid primary key default gen_random_uuid(),
  section_subtitle text not null default 'Why We Exist',
  section_title text not null,
  main_paragraph text not null,
  mission_title text not null,
  mission_text text not null,
  mission_icon text not null default 'bonfire-outline',
  vision_title text not null,
  vision_text text not null,
  vision_icon text not null default 'document-text-outline',
  image_1_url text,
  image_2_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create about_list_items table
create table public.about_list_items (
  id uuid primary key default gen_random_uuid(),
  about_id uuid references public.about_section(id) on delete cascade,
  text text not null,
  display_order int not null default 0,
  created_at timestamp with time zone default now()
);

-- Create statistics table
create table public.statistics (
  id uuid primary key default gen_random_uuid(),
  number text not null,
  description text not null,
  display_order int not null default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create objectives table (services/objectives section)
create table public.objectives (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon_name text not null,
  position text not null check (position in ('left', 'right')),
  display_order int not null default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create objectives_section_settings table
create table public.objectives_section_settings (
  id uuid primary key default gen_random_uuid(),
  section_subtitle text not null default 'Our Objectives',
  section_title text not null,
  banner_image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create cta_section table
create table public.cta_section (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create photobiomodulation_cards table (blog/service cards)
create table public.photobiomodulation_cards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text,
  author text not null default 'Harva Team',
  comments_count int not null default 0,
  description text,
  display_order int not null default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create photobio_section_settings table
create table public.photobio_section_settings (
  id uuid primary key default gen_random_uuid(),
  section_subtitle text not null default 'Photobiomodulation Therapy',
  section_title text not null,
  cta_text text not null default 'View More Services',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create contact_details table
create table public.contact_details (
  id uuid primary key default gen_random_uuid(),
  hotline text not null,
  email text not null,
  address text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create social_links table
create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null,
  icon_name text not null,
  display_order int not null default 0,
  created_at timestamp with time zone default now()
);

-- Create footer_content table
create table public.footer_content (
  id uuid primary key default gen_random_uuid(),
  about_text text not null,
  newsletter_title text not null,
  copyright_text text not null default 'Made with love @harvagroup',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create footer_links table
create table public.footer_links (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('company_info', 'footer_bottom')),
  text text not null,
  url text not null,
  display_order int not null default 0,
  created_at timestamp with time zone default now()
);

-- Create site_settings table
create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_title text not null default 'Harva Group - Health baked by science',
  site_description text not null default 'Health, Science, rejuvenation, replenishment',
  logo_url text,
  favicon_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create user_roles table for admin access
create type public.app_role as enum ('admin', 'editor', 'viewer');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role app_role not null default 'viewer',
  created_at timestamp with time zone default now(),
  unique(user_id, role)
);

-- Create profiles table
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  email text,
  full_name text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on all tables
alter table public.hero_section enable row level security;
alter table public.hero_cards enable row level security;
alter table public.about_section enable row level security;
alter table public.about_list_items enable row level security;
alter table public.statistics enable row level security;
alter table public.objectives enable row level security;
alter table public.objectives_section_settings enable row level security;
alter table public.cta_section enable row level security;
alter table public.photobiomodulation_cards enable row level security;
alter table public.photobio_section_settings enable row level security;
alter table public.contact_details enable row level security;
alter table public.social_links enable row level security;
alter table public.footer_content enable row level security;
alter table public.footer_links enable row level security;
alter table public.site_settings enable row level security;
alter table public.user_roles enable row level security;
alter table public.profiles enable row level security;

-- Create security definer function for role checking
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- RLS Policies: Public read access, admin write access

-- Hero section policies
create policy "Anyone can view hero section"
  on public.hero_section for select using (true);

create policy "Admins can manage hero section"
  on public.hero_section for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Hero cards policies
create policy "Anyone can view hero cards"
  on public.hero_cards for select using (true);

create policy "Admins can manage hero cards"
  on public.hero_cards for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- About section policies
create policy "Anyone can view about section"
  on public.about_section for select using (true);

create policy "Admins can manage about section"
  on public.about_section for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- About list items policies
create policy "Anyone can view about list items"
  on public.about_list_items for select using (true);

create policy "Admins can manage about list items"
  on public.about_list_items for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Statistics policies
create policy "Anyone can view statistics"
  on public.statistics for select using (true);

create policy "Admins can manage statistics"
  on public.statistics for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Objectives policies
create policy "Anyone can view objectives"
  on public.objectives for select using (true);

create policy "Admins can manage objectives"
  on public.objectives for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Objectives section settings policies
create policy "Anyone can view objectives section settings"
  on public.objectives_section_settings for select using (true);

create policy "Admins can manage objectives section settings"
  on public.objectives_section_settings for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- CTA section policies
create policy "Anyone can view cta section"
  on public.cta_section for select using (true);

create policy "Admins can manage cta section"
  on public.cta_section for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Photobiomodulation cards policies
create policy "Anyone can view photobiomodulation cards"
  on public.photobiomodulation_cards for select using (true);

create policy "Admins can manage photobiomodulation cards"
  on public.photobiomodulation_cards for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Photobio section settings policies
create policy "Anyone can view photobio section settings"
  on public.photobio_section_settings for select using (true);

create policy "Admins can manage photobio section settings"
  on public.photobio_section_settings for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Contact details policies
create policy "Anyone can view contact details"
  on public.contact_details for select using (true);

create policy "Admins can manage contact details"
  on public.contact_details for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Social links policies
create policy "Anyone can view social links"
  on public.social_links for select using (true);

create policy "Admins can manage social links"
  on public.social_links for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Footer content policies
create policy "Anyone can view footer content"
  on public.footer_content for select using (true);

create policy "Admins can manage footer content"
  on public.footer_content for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Footer links policies
create policy "Anyone can view footer links"
  on public.footer_links for select using (true);

create policy "Admins can manage footer links"
  on public.footer_links for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Site settings policies
create policy "Anyone can view site settings"
  on public.site_settings for select using (true);

create policy "Admins can manage site settings"
  on public.site_settings for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- User roles policies
create policy "Admins can view all user roles"
  on public.user_roles for select
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can manage user roles"
  on public.user_roles for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.has_role(auth.uid(), 'admin'));

-- Create trigger function for profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

-- Trigger to create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply updated_at triggers to relevant tables
create trigger set_updated_at before update on public.hero_section
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.about_section
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.statistics
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.objectives
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.objectives_section_settings
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.cta_section
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.photobiomodulation_cards
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.photobio_section_settings
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.contact_details
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.footer_content
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.site_settings
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();