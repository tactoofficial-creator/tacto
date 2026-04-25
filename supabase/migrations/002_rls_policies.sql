-- =====================================================
-- Tacto — Row Level Security Policies
-- =====================================================

-- Enable RLS on all tables
alter table public.users             enable row level security;
alter table public.experiences       enable row level security;
alter table public.experience_slots  enable row level security;
alter table public.bookings          enable row level security;
alter table public.messages          enable row level security;
alter table public.reviews           enable row level security;
alter table public.notifications     enable row level security;
alter table public.reports           enable row level security;

-- ─────────────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────────────

-- Anyone can view public profiles
create policy "Users are publicly readable"
  on public.users for select
  using (true);

-- Users can only update their own profile
create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ─────────────────────────────────────────────────────
-- EXPERIENCES
-- ─────────────────────────────────────────────────────

-- Active experiences are publicly readable
create policy "Active experiences are public"
  on public.experiences for select
  using (is_active = true or host_id = auth.uid());

-- Only authenticated users can create experiences
create policy "Authenticated users can create experiences"
  on public.experiences for insert
  with check (auth.uid() = host_id);

-- Hosts can only update their own experiences
create policy "Hosts can update own experiences"
  on public.experiences for update
  using (auth.uid() = host_id)
  with check (auth.uid() = host_id);

-- Hosts can delete (soft-delete via is_active) their own experiences
create policy "Hosts can delete own experiences"
  on public.experiences for delete
  using (auth.uid() = host_id);

-- ─────────────────────────────────────────────────────
-- EXPERIENCE SLOTS
-- ─────────────────────────────────────────────────────

create policy "Slots readable by all"
  on public.experience_slots for select
  using (true);

create policy "Hosts manage own slots"
  on public.experience_slots for all
  using (
    auth.uid() = (select host_id from public.experiences where id = experience_id)
  )
  with check (
    auth.uid() = (select host_id from public.experiences where id = experience_id)
  );

-- ─────────────────────────────────────────────────────
-- BOOKINGS
-- ─────────────────────────────────────────────────────

-- Only buyer and seller can see a booking
create policy "Booking participants can view bookings"
  on public.bookings for select
  using (auth.uid() in (buyer_id, seller_id));

-- Only authenticated users can create bookings (as buyer)
create policy "Authenticated users can create bookings"
  on public.bookings for insert
  with check (auth.uid() = buyer_id);

-- Both parties can update booking status
create policy "Booking participants can update bookings"
  on public.bookings for update
  using (auth.uid() in (buyer_id, seller_id))
  with check (auth.uid() in (buyer_id, seller_id));

-- ─────────────────────────────────────────────────────
-- MESSAGES
-- ─────────────────────────────────────────────────────

-- Only booking participants can read messages
create policy "Booking participants can read messages"
  on public.messages for select
  using (
    auth.uid() in (
      select buyer_id from public.bookings where id = booking_id
      union
      select seller_id from public.bookings where id = booking_id
    )
  );

-- Only booking participants can send messages
create policy "Booking participants can send messages"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and auth.uid() in (
      select buyer_id from public.bookings where id = booking_id
        and status = 'confirmed'
      union
      select seller_id from public.bookings where id = booking_id
        and status = 'confirmed'
    )
  );

-- Sender can update (mark read) their own messages — receiver marks received messages read
create policy "Receiver can mark messages as read"
  on public.messages for update
  using (
    auth.uid() in (
      select buyer_id from public.bookings where id = booking_id
      union
      select seller_id from public.bookings where id = booking_id
    )
  );

-- ─────────────────────────────────────────────────────
-- REVIEWS
-- ─────────────────────────────────────────────────────

-- Reviews are publicly readable
create policy "Reviews are publicly readable"
  on public.reviews for select
  using (true);

-- Only booking participants can write reviews
create policy "Booking participants can leave reviews"
  on public.reviews for insert
  with check (
    auth.uid() = reviewer_id
    and auth.uid() in (
      select buyer_id from public.bookings where id = booking_id and status = 'completed'
      union
      select seller_id from public.bookings where id = booking_id and status = 'completed'
    )
  );

-- Reviews cannot be updated or deleted (immutable)

-- ─────────────────────────────────────────────────────
-- NOTIFICATIONS
-- ─────────────────────────────────────────────────────

-- Users can only see their own notifications
create policy "Users see own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

-- Users can mark their own notifications as read
create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Service role can insert notifications (via edge functions)
create policy "Service role can insert notifications"
  on public.notifications for insert
  with check (true);  -- restricted by service_role key in edge functions

-- ─────────────────────────────────────────────────────
-- REPORTS
-- ─────────────────────────────────────────────────────

-- Authenticated users can file reports
create policy "Authenticated users can file reports"
  on public.reports for insert
  with check (auth.uid() = reporter_id);

-- Users can view their own reports
create policy "Users can view own reports"
  on public.reports for select
  using (auth.uid() = reporter_id);

-- ─────────────────────────────────────────────────────
-- STORAGE POLICIES (apply in Supabase dashboard)
-- ─────────────────────────────────────────────────────
-- Avatar bucket: public read, authenticated write own folder
-- Experience photos: public read, host write own experience folder
-- Identity docs: service role only
