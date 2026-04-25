-- =====================================================
-- Tacto — Initial Schema
-- Run in Supabase SQL editor (or via CLI: supabase db push)
-- =====================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";  -- for geolocation queries

-- ─────────────────────────────────────────────────────
-- USERS (extends Supabase Auth)
-- ─────────────────────────────────────────────────────
create table public.users (
  id                  uuid references auth.users on delete cascade primary key,
  email               text unique not null,
  full_name           text,
  avatar_url          text,
  bio                 text check (length(bio) <= 500),
  city                text,
  lat                 decimal(10, 8),
  lng                 decimal(11, 8),
  role                text not null default 'both' check (role in ('buyer', 'seller', 'both')),
  is_verified         boolean not null default false,
  verification_status text not null default 'none' check (verification_status in ('none', 'pending', 'approved', 'rejected')),
  stripe_connect_id   text,
  stripe_customer_id  text,
  push_token          text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────
-- EXPERIENCES
-- ─────────────────────────────────────────────────────
create table public.experiences (
  id               uuid primary key default gen_random_uuid(),
  host_id          uuid references public.users(id) on delete cascade not null,
  title            text not null check (length(title) between 10 and 120),
  description      text check (length(description) <= 2000),
  category         text not null check (category in ('aperitivo', 'cinema', 'run', 'walk', 'reading', 'music', 'cooking', 'other')),
  duration         integer not null check (duration > 0),    -- minutes
  max_participants integer not null default 1 check (max_participants between 1 and 20),
  price            decimal(8, 2) not null check (price >= 1),
  city             text not null,
  neighborhood     text,
  location_name    text,
  lat              decimal(10, 8),
  lng              decimal(11, 8),
  photos           text[] default array[]::text[],
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────
-- EXPERIENCE SLOTS (availability)
-- ─────────────────────────────────────────────────────
create table public.experience_slots (
  id               uuid primary key default gen_random_uuid(),
  experience_id    uuid references public.experiences(id) on delete cascade not null,
  starts_at        timestamptz not null,
  ends_at          timestamptz not null,
  available_spots  integer not null,
  created_at       timestamptz not null default now(),
  constraint valid_slot check (ends_at > starts_at)
);

-- ─────────────────────────────────────────────────────
-- BOOKINGS
-- ─────────────────────────────────────────────────────
create table public.bookings (
  id                     uuid primary key default gen_random_uuid(),
  experience_id          uuid references public.experiences(id) not null,
  slot_id                uuid references public.experience_slots(id),
  buyer_id               uuid references public.users(id) not null,
  seller_id              uuid references public.users(id) not null,
  participants           integer not null default 1 check (participants >= 1),
  total_price            decimal(8, 2) not null check (total_price >= 0),
  platform_fee           decimal(8, 2) not null check (platform_fee >= 0),
  seller_amount          decimal(8, 2) not null check (seller_amount >= 0),
  status                 text not null default 'pending'
                           check (status in ('pending', 'confirmed', 'completed', 'cancelled', 'refunded')),
  stripe_payment_intent  text unique,
  stripe_transfer_id     text,
  meeting_point          text,   -- revealed only after confirmed
  meeting_lat            decimal(10, 8),
  meeting_lng            decimal(11, 8),
  buyer_completed        boolean not null default false,
  seller_completed       boolean not null default false,
  cancelled_by           uuid references public.users(id),
  cancelled_at           timestamptz,
  cancellation_reason    text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  constraint no_self_booking check (buyer_id != seller_id)
);

-- ─────────────────────────────────────────────────────
-- MESSAGES
-- ─────────────────────────────────────────────────────
create table public.messages (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid references public.bookings(id) on delete cascade not null,
  sender_id   uuid references public.users(id) not null,
  content     text not null check (length(content) between 1 and 2000),
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────
-- REVIEWS
-- ─────────────────────────────────────────────────────
create table public.reviews (
  id           uuid primary key default gen_random_uuid(),
  booking_id   uuid references public.bookings(id) not null,
  reviewer_id  uuid references public.users(id) not null,
  reviewee_id  uuid references public.users(id) not null,
  rating       smallint not null check (rating between 1 and 5),
  comment      text check (length(comment) <= 280),
  created_at   timestamptz not null default now(),
  unique (booking_id, reviewer_id),
  constraint no_self_review check (reviewer_id != reviewee_id)
);

-- ─────────────────────────────────────────────────────
-- NOTIFICATIONS
-- ─────────────────────────────────────────────────────
create table public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.users(id) on delete cascade not null,
  type        text not null check (type in (
    'booking_request', 'booking_confirmed', 'booking_cancelled',
    'new_message', 'experience_starting', 'review_received',
    'payment_released', 'identity_verified'
  )),
  title       text not null,
  body        text,
  data        jsonb,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────
-- REPORTS
-- ─────────────────────────────────────────────────────
create table public.reports (
  id                      uuid primary key default gen_random_uuid(),
  reporter_id             uuid references public.users(id) not null,
  reported_user_id        uuid references public.users(id),
  reported_experience_id  uuid references public.experiences(id),
  reason                  text not null,
  details                 text,
  status                  text not null default 'pending'
                            check (status in ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at              timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────────────
create index idx_experiences_host       on public.experiences(host_id);
create index idx_experiences_category   on public.experiences(category);
create index idx_experiences_city       on public.experiences(city);
create index idx_experiences_active     on public.experiences(is_active) where is_active = true;
create index idx_experiences_location   on public.experiences(lat, lng);
create index idx_bookings_buyer         on public.bookings(buyer_id);
create index idx_bookings_seller        on public.bookings(seller_id);
create index idx_bookings_status        on public.bookings(status);
create index idx_messages_booking       on public.messages(booking_id);
create index idx_messages_created       on public.messages(created_at desc);
create index idx_notifications_user     on public.notifications(user_id, is_read);
create index idx_notifications_created  on public.notifications(created_at desc);
create index idx_reviews_reviewee       on public.reviews(reviewee_id);
create index idx_slots_experience       on public.experience_slots(experience_id, starts_at);

-- ─────────────────────────────────────────────────────
-- UPDATED_AT trigger
-- ─────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_updated_at       before update on public.users       for each row execute procedure public.set_updated_at();
create trigger experiences_updated_at before update on public.experiences for each row execute procedure public.set_updated_at();
create trigger bookings_updated_at    before update on public.bookings    for each row execute procedure public.set_updated_at();

-- ─────────────────────────────────────────────────────
-- STORAGE BUCKETS (run in Supabase dashboard or CLI)
-- ─────────────────────────────────────────────────────
-- insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- values
--   ('avatars',             'avatars',             true,  5242880,  array['image/jpeg','image/png','image/webp']),
--   ('experience-photos',   'experience-photos',   true,  10485760, array['image/jpeg','image/png','image/webp']),
--   ('identity-documents',  'identity-documents',  false, 10485760, array['image/jpeg','image/png','application/pdf']);
