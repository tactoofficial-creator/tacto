-- =====================================================
-- Tacto — Development seed data
-- NOTE: Run AFTER migrations. For dev only.
-- =====================================================

-- This seed inserts mock data matching src/lib/mockData.js.
-- In production, remove this file and use real data.

-- (Supabase auth users must be created via the Supabase Auth API,
--  then their UUIDs inserted here. Placeholder UUIDs used below.)

-- Insert sample host users
insert into public.users (id, email, full_name, bio, city, lat, lng, is_verified, role) values
  ('00000000-0000-0000-0000-000000000001', 'sofia@tacto.dev',  'Sofia Gallo',   'Architetta e amante delle serate lente. Nata a Napoli, vivo a Milano da 8 anni.', 'Milano',  45.474, 9.208,  true,  'both'),
  ('00000000-0000-0000-0000-000000000002', 'marco@tacto.dev',  'Marco Ferrante','Runner seriale e appassionato di caffè specialty.',                                 'Roma',    41.903, 12.457, true,  'both'),
  ('00000000-0000-0000-0000-000000000003', 'elena@tacto.dev',  'Elena Ricci',   'Sommelier e appassionata di cinema d''autore.',                                     'Firenze', 43.765, 11.246, true,  'both'),
  ('00000000-0000-0000-0000-000000000004', 'luca@tacto.dev',   'Luca Marini',   'Chef autodidatta. Ogni domenica mattina cucino con chi vuole imparare.',             'Bologna', 44.499, 11.335, false, 'both'),
  ('00000000-0000-0000-0000-000000000005', 'chiara@tacto.dev', 'Chiara Lombardi','Musicista e insegnante di yoga.',                                                   'Torino',  45.056, 7.685,  true,  'both')
on conflict (id) do nothing;

-- Insert sample experiences
insert into public.experiences (id, host_id, title, description, category, duration, max_participants, price, city, neighborhood, lat, lng) values
  (
    '00000000-0000-0000-0001-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Aperitivo al tramonto sulla mia terrazza',
    'Vivo al 6° piano a Porta Venezia con una vista mozzafiato sul Duomo.',
    'aperitivo', 120, 4, 22.00, 'Milano', 'Porta Venezia', 45.474, 9.208
  ),
  (
    '00000000-0000-0000-0001-000000000002',
    '00000000-0000-0000-0000-000000000002',
    'Running all''alba nei parchi nascosti di Roma',
    'Ti porto a scoprire la Roma che i turisti non vedono mai.',
    'run', 90, 3, 18.00, 'Roma', 'Prati', 41.903, 12.457
  )
on conflict (id) do nothing;
