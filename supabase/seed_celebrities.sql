-- ============================================================
-- XBEE SOCIAL — Celebrity Seed Data (55+ verified accounts)
-- Run this in your Supabase SQL Editor
-- ============================================================
-- This creates auth users (non-loginable) + profiles + posts + comments
-- Admin can manage all these accounts from the /admin panel

-- Fix CHECK constraints to support new tiers
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_verification_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_verification_check
  CHECK (verification IN ('none','identity','authority','government','business','celebrity','creator','official'));

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_trust_tier_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_trust_tier_check
  CHECK (trust_tier IN ('new','building','established','trusted','authority','diamond','legendary'));

-- Temporarily disable the auto-profile trigger so it doesn't conflict
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Add cover_image column if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cover_image TEXT DEFAULT '';

DO $$
DECLARE
  -- Celebrity UUIDs (deterministic so we can reference them)
  id_elonmusk       UUID := 'a0000000-0000-0000-0000-000000000001';
  id_trump          UUID := 'a0000000-0000-0000-0000-000000000002';
  id_whitehouse     UUID := 'a0000000-0000-0000-0000-000000000003';
  id_salmahayek     UUID := 'a0000000-0000-0000-0000-000000000004';
  id_keanureeves    UUID := 'a0000000-0000-0000-0000-000000000005';
  id_charlize       UUID := 'a0000000-0000-0000-0000-000000000006';
  id_rihanna        UUID := 'a0000000-0000-0000-0000-000000000007';
  id_drake          UUID := 'a0000000-0000-0000-0000-000000000008';
  id_taylorswift    UUID := 'a0000000-0000-0000-0000-000000000009';
  id_beyonce        UUID := 'a0000000-0000-0000-0000-000000000010';
  id_cristiano      UUID := 'a0000000-0000-0000-0000-000000000011';
  id_leomessi       UUID := 'a0000000-0000-0000-0000-000000000012';
  id_lebron         UUID := 'a0000000-0000-0000-0000-000000000013';
  id_oprah          UUID := 'a0000000-0000-0000-0000-000000000014';
  id_billgates      UUID := 'a0000000-0000-0000-0000-000000000015';
  id_jeffbezos      UUID := 'a0000000-0000-0000-0000-000000000016';
  id_markz          UUID := 'a0000000-0000-0000-0000-000000000017';
  id_kimk           UUID := 'a0000000-0000-0000-0000-000000000018';
  id_selenagomez    UUID := 'a0000000-0000-0000-0000-000000000019';
  id_justinbieber   UUID := 'a0000000-0000-0000-0000-000000000020';
  id_therock        UUID := 'a0000000-0000-0000-0000-000000000021';
  id_kevinhart      UUID := 'a0000000-0000-0000-0000-000000000022';
  id_snoopdogg      UUID := 'a0000000-0000-0000-0000-000000000023';
  id_neymar         UUID := 'a0000000-0000-0000-0000-000000000024';
  id_katyperry      UUID := 'a0000000-0000-0000-0000-000000000025';
  id_ladygaga       UUID := 'a0000000-0000-0000-0000-000000000026';
  id_arianagrande   UUID := 'a0000000-0000-0000-0000-000000000027';
  id_tomholland     UUID := 'a0000000-0000-0000-0000-000000000028';
  id_zendaya        UUID := 'a0000000-0000-0000-0000-000000000029';
  id_willsmith      UUID := 'a0000000-0000-0000-0000-000000000030';
  id_timcook        UUID := 'a0000000-0000-0000-0000-000000000031';
  id_nasa           UUID := 'a0000000-0000-0000-0000-000000000032';
  id_ellenshow      UUID := 'a0000000-0000-0000-0000-000000000033';
  id_jackblack      UUID := 'a0000000-0000-0000-0000-000000000034';
  id_ryanreynolds   UUID := 'a0000000-0000-0000-0000-000000000035';
  id_margotrobbie   UUID := 'a0000000-0000-0000-0000-000000000036';
  id_chrisevans     UUID := 'a0000000-0000-0000-0000-000000000037';
  id_scarjo         UUID := 'a0000000-0000-0000-0000-000000000038';
  id_jlo            UUID := 'a0000000-0000-0000-0000-000000000039';
  id_shakira        UUID := 'a0000000-0000-0000-0000-000000000040';
  id_msdhoni        UUID := 'a0000000-0000-0000-0000-000000000041';
  id_viratkohli     UUID := 'a0000000-0000-0000-0000-000000000042';
  id_badgalriri     UUID := 'a0000000-0000-0000-0000-000000000043';
  id_mrbeast        UUID := 'a0000000-0000-0000-0000-000000000044';
  id_pewdiepie      UUID := 'a0000000-0000-0000-0000-000000000045';
  id_khloek         UUID := 'a0000000-0000-0000-0000-000000000046';
  id_kyliejenner    UUID := 'a0000000-0000-0000-0000-000000000047';
  id_barackobama    UUID := 'a0000000-0000-0000-0000-000000000048';
  id_michelleobama  UUID := 'a0000000-0000-0000-0000-000000000049';
  id_brunomars      UUID := 'a0000000-0000-0000-0000-000000000050';
  id_cardi          UUID := 'a0000000-0000-0000-0000-000000000051';
  id_travisscott    UUID := 'a0000000-0000-0000-0000-000000000052';
  id_lizzo          UUID := 'a0000000-0000-0000-0000-000000000053';
  id_postmalone     UUID := 'a0000000-0000-0000-0000-000000000054';
  id_billieeilish   UUID := 'a0000000-0000-0000-0000-000000000055';
  id_joebiden       UUID := 'a0000000-0000-0000-0000-000000000056';

  inst UUID := '00000000-0000-0000-0000-000000000000';
BEGIN

-- ============================================================
-- 1. INSERT INTO auth.users (non-loginable placeholder accounts)
-- ============================================================
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role, raw_app_meta_data, raw_user_meta_data)
VALUES
  (id_elonmusk,     inst, 'elon@xbee.social',       crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_trump,        inst, 'trump@xbee.social',       crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_whitehouse,   inst, 'whitehouse@xbee.social',  crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_salmahayek,   inst, 'salma@xbee.social',       crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_keanureeves,  inst, 'keanu@xbee.social',       crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_charlize,     inst, 'charlize@xbee.social',    crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_rihanna,      inst, 'rihanna@xbee.social',     crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_drake,        inst, 'drake@xbee.social',        crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_taylorswift,  inst, 'taylor@xbee.social',      crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_beyonce,      inst, 'beyonce@xbee.social',     crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_cristiano,    inst, 'cristiano@xbee.social',   crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_leomessi,     inst, 'messi@xbee.social',       crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_lebron,       inst, 'lebron@xbee.social',      crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_oprah,        inst, 'oprah@xbee.social',       crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_billgates,    inst, 'bill@xbee.social',        crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_jeffbezos,    inst, 'bezos@xbee.social',       crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_markz,        inst, 'zuck@xbee.social',        crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_kimk,         inst, 'kimk@xbee.social',        crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_selenagomez,  inst, 'selena@xbee.social',      crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_justinbieber, inst, 'justin@xbee.social',      crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_therock,      inst, 'therock@xbee.social',     crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_kevinhart,    inst, 'kevin@xbee.social',       crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_snoopdogg,    inst, 'snoop@xbee.social',       crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_neymar,       inst, 'neymar@xbee.social',      crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_katyperry,    inst, 'katy@xbee.social',        crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_ladygaga,     inst, 'gaga@xbee.social',        crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_arianagrande, inst, 'ariana@xbee.social',      crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_tomholland,   inst, 'tom@xbee.social',         crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_zendaya,      inst, 'zendaya@xbee.social',     crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_willsmith,    inst, 'will@xbee.social',        crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_timcook,      inst, 'timcook@xbee.social',     crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_nasa,         inst, 'nasa@xbee.social',        crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_ellenshow,    inst, 'ellen@xbee.social',       crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_jackblack,    inst, 'jack@xbee.social',        crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_ryanreynolds, inst, 'ryan@xbee.social',        crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_margotrobbie, inst, 'margot@xbee.social',      crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_chrisevans,   inst, 'chris@xbee.social',       crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_scarjo,       inst, 'scarjo@xbee.social',      crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_jlo,          inst, 'jlo@xbee.social',          crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_shakira,      inst, 'shakira@xbee.social',     crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_msdhoni,      inst, 'dhoni@xbee.social',       crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_viratkohli,   inst, 'virat@xbee.social',       crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_badgalriri,   inst, 'riri@xbee.social',       crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_mrbeast,      inst, 'mrbeast@xbee.social',     crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_pewdiepie,    inst, 'pewds@xbee.social',       crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_khloek,       inst, 'khloe@xbee.social',       crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_kyliejenner,  inst, 'kylie@xbee.social',       crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_barackobama,  inst, 'obama@xbee.social',       crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_michelleobama,inst, 'michelle@xbee.social',    crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_brunomars,    inst, 'bruno@xbee.social',       crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_cardi,        inst, 'cardi@xbee.social',       crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_travisscott,  inst, 'travis@xbee.social',      crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_lizzo,        inst, 'lizzo@xbee.social',       crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_postmalone,   inst, 'post@xbee.social',        crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_billieeilish, inst, 'billie@xbee.social',      crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}'),
  (id_joebiden,     inst, 'biden@xbee.social',       crypt('NOLOGIN_' || gen_random_uuid()::text, gen_salt('bf')), now(), '2024-01-15T00:00:00Z', now(), 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}')
ON CONFLICT (id) DO NOTHING;

-- Also insert into auth.identities (required by Supabase)
INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
SELECT id, id, jsonb_build_object('sub', id::text, 'email', email), 'email', id::text, now(), now(), now()
FROM auth.users WHERE id IN (
  id_elonmusk, id_trump, id_whitehouse, id_salmahayek, id_keanureeves, id_charlize,
  id_rihanna, id_drake, id_taylorswift, id_beyonce, id_cristiano, id_leomessi,
  id_lebron, id_oprah, id_billgates, id_jeffbezos, id_markz, id_kimk,
  id_selenagomez, id_justinbieber, id_therock, id_kevinhart, id_snoopdogg, id_neymar,
  id_katyperry, id_ladygaga, id_arianagrande, id_tomholland, id_zendaya, id_willsmith,
  id_timcook, id_nasa, id_ellenshow, id_jackblack, id_ryanreynolds, id_margotrobbie,
  id_chrisevans, id_scarjo, id_jlo, id_shakira, id_msdhoni, id_viratkohli,
  id_badgalriri, id_mrbeast, id_pewdiepie, id_khloek, id_kyliejenner, id_barackobama,
  id_michelleobama, id_brunomars, id_cardi, id_travisscott, id_lizzo, id_postmalone,
  id_billieeilish, id_joebiden
)
ON CONFLICT DO NOTHING;


-- ============================================================
-- 2. INSERT PROFILES (Real bios matching X/Twitter style)
-- ============================================================
INSERT INTO profiles (id, username, display_name, email, avatar, cover_image, bio, verified, verification, trust_score, trust_tier, badges, streak, followers_count, following_count, created_at) VALUES
(id_elonmusk,     'elonmusk',       'Elon Musk',           'elon@xbee.social',     'https://randomuser.me/api/portraits/men/32.jpg', 'https://picsum.photos/seed/tesla-space/1200/400', 'CEO of Tesla, SpaceX, xAI & The Boring Company. Mars is next.', true, 'official', 99, 'legendary', '["verified","pioneer","influencer"]', 365, 195000000, 832, '2024-01-15T00:00:00Z'),
(id_trump,        'realDonaldTrump','Donald J. Trump',      'trump@xbee.social',    'https://randomuser.me/api/portraits/men/75.jpg', 'https://picsum.photos/seed/whitehouse-dc/1200/400', '45th & 47th President of the United States of America. MAGA!', true, 'official', 95, 'legendary', '["verified","influencer"]', 300, 92000000, 51, '2024-01-15T00:00:00Z'),
(id_whitehouse,   'WhiteHouse',     'The White House',      'whitehouse@xbee.social','https://api.dicebear.com/7.x/shapes/svg?seed=WhiteHouse&backgroundColor=002868', 'https://picsum.photos/seed/washington-monument/1200/400', 'Welcome to the White House. Tweets may be archived: WH.gov/privacy', true, 'official', 98, 'legendary', '["verified","official"]', 365, 35000000, 12, '2024-01-15T00:00:00Z'),
(id_salmahayek,   'salaboreal',    'Salma Hayek Pinault',   'salma@xbee.social',    'https://randomuser.me/api/portraits/women/44.jpg', 'https://picsum.photos/seed/hollywood-set/1200/400', 'Actress. Producer. Mom. Lover of animals and life.', true, 'official', 90, 'diamond', '["verified","creator"]', 200, 25000000, 312, '2024-01-15T00:00:00Z'),
(id_keanureeves,  'KeanuReeves',   'Keanu Reeves',          'keanu@xbee.social',    'https://randomuser.me/api/portraits/men/22.jpg', 'https://picsum.photos/seed/motorcycle-road/1200/400', 'Be excellent to each other.', true, 'official', 97, 'legendary', '["verified","trusted"]', 180, 7200000, 0, '2024-01-15T00:00:00Z'),
(id_charlize,     'CharlizeAfrica','Charlize Theron',       'charlize@xbee.social', 'https://randomuser.me/api/portraits/women/90.jpg', 'https://picsum.photos/seed/south-africa-sunset/1200/400', 'Actress. Mom. CTAOP Founder helping African youth. UN Messenger of Peace.', true, 'official', 92, 'diamond', '["verified","humanitarian"]', 210, 9500000, 445, '2024-01-15T00:00:00Z'),
(id_rihanna,      'raboreal',      'Rihanna',               'rihanna@xbee.social',  'https://randomuser.me/api/portraits/women/33.jpg', 'https://picsum.photos/seed/fenty-beauty/1200/400', 'FENTY BEAUTY | SAVAGE X FENTY | Clara Lionel Foundation', true, 'official', 96, 'legendary', '["verified","influencer","creator"]', 365, 110000000, 1302, '2024-01-15T00:00:00Z'),
(id_drake,        'Drake',         'Drake',                  'drake@xbee.social',    'https://randomuser.me/api/portraits/men/41.jpg', 'https://picsum.photos/seed/toronto-night/1200/400', 'Boy Meets World. OVO', true, 'official', 94, 'diamond', '["verified","creator"]', 250, 80500000, 2100, '2024-01-15T00:00:00Z'),
(id_taylorswift,  'taylorswift13', 'Taylor Swift',           'taylor@xbee.social',   'https://randomuser.me/api/portraits/women/65.jpg', 'https://picsum.photos/seed/concert-stage-lights/1200/400', 'This is not a brag, this is a thank you letter.', true, 'official', 98, 'legendary', '["verified","influencer","creator"]', 365, 95000000, 0, '2024-01-15T00:00:00Z'),
(id_beyonce,      'Beyonce',       'Beyonce',                'beyonce@xbee.social',  'https://randomuser.me/api/portraits/women/50.jpg', 'https://picsum.photos/seed/concert-golden/1200/400', 'RENAISSANCE world tour. BeyGOOD.', true, 'official', 98, 'legendary', '["verified","influencer","creator"]', 365, 32000000, 1, '2024-01-15T00:00:00Z'),
(id_cristiano,    'Cristiano',     'Cristiano Ronaldo',      'cristiano@xbee.social','https://randomuser.me/api/portraits/men/45.jpg', 'https://picsum.photos/seed/soccer-stadium/1200/400', 'Professional footballer. Al Nassr FC & Portugal. SIU!', true, 'official', 99, 'legendary', '["verified","athlete","influencer"]', 365, 112000000, 578, '2024-01-15T00:00:00Z'),
(id_leomessi,     'TeamMessi',     'Leo Messi',              'messi@xbee.social',    'https://randomuser.me/api/portraits/men/36.jpg', 'https://picsum.photos/seed/miami-beach-sunset/1200/400', 'Inter Miami CF. Argentina. 8x Ballon d''Or winner. #M10', true, 'official', 99, 'legendary', '["verified","athlete","influencer"]', 300, 17000000, 291, '2024-01-15T00:00:00Z'),
(id_lebron,       'KingJames',     'LeBron James',           'lebron@xbee.social',   'https://randomuser.me/api/portraits/men/47.jpg', 'https://picsum.photos/seed/basketball-court/1200/400', 'I am more than an athlete. @Lakers. @SpringHillEnt. 4x Champion.', true, 'official', 97, 'legendary', '["verified","athlete","influencer"]', 300, 53000000, 1050, '2024-01-15T00:00:00Z'),
(id_oprah,        'Oprah',         'Oprah Winfrey',          'oprah@xbee.social',    'https://randomuser.me/api/portraits/women/60.jpg', 'https://picsum.photos/seed/studio-purple/1200/400', 'Live your best life. @OWNTV @OprahDaily @OprahBookClub', true, 'official', 96, 'legendary', '["verified","influencer","humanitarian"]', 365, 43000000, 315, '2024-01-15T00:00:00Z'),
(id_billgates,    'BillGates',     'Bill Gates',             'bill@xbee.social',     'https://randomuser.me/api/portraits/men/68.jpg', 'https://picsum.photos/seed/tech-innovation/1200/400', 'Sharing things I''m learning through my foundation work and other interests.', true, 'official', 97, 'legendary', '["verified","pioneer","humanitarian"]', 300, 65000000, 522, '2024-01-15T00:00:00Z'),
(id_jeffbezos,    'JeffBezos',     'Jeff Bezos',             'bezos@xbee.social',    'https://randomuser.me/api/portraits/men/69.jpg', 'https://picsum.photos/seed/rocket-sky/1200/400', 'Bezos Earth Fund. Blue Origin. The Washington Post. Day 1.', true, 'official', 95, 'legendary', '["verified","pioneer"]', 200, 8200000, 25, '2024-01-15T00:00:00Z'),
(id_markz,        'faboreal',       'Mark Zuckerberg',       'zuck@xbee.social',     'https://randomuser.me/api/portraits/men/10.jpg', 'https://picsum.photos/seed/meta-campus/1200/400', 'Building Meta. Father. Martial artist.', true, 'official', 93, 'diamond', '["verified","pioneer"]', 250, 14000000, 495, '2024-01-15T00:00:00Z'),
(id_kimk,         'KimKardashian', 'Kim Kardashian',         'kimk@xbee.social',     'https://randomuser.me/api/portraits/women/7.jpg', 'https://picsum.photos/seed/fashion-runway/1200/400', 'SKIMS. SKKN BY KIM. Law Student. Mom of 4.', true, 'official', 90, 'diamond', '["verified","influencer","creator"]', 300, 75000000, 1300, '2024-01-15T00:00:00Z'),
(id_selenagomez,  'selenagomez',   'Selena Gomez',           'selena@xbee.social',   'https://randomuser.me/api/portraits/women/8.jpg', 'https://picsum.photos/seed/rare-beauty-pink/1200/400', 'Rare Beauty founder. Actress. Advocate for mental health.', true, 'official', 93, 'diamond', '["verified","influencer","humanitarian"]', 280, 68000000, 290, '2024-01-15T00:00:00Z'),
(id_justinbieber, 'justinbieber',  'Justin Bieber',          'justin@xbee.social',   'https://randomuser.me/api/portraits/men/11.jpg', 'https://picsum.photos/seed/music-recording/1200/400', 'JUSTICE. husband. believer.', true, 'official', 91, 'diamond', '["verified","creator"]', 200, 114000000, 510, '2024-01-15T00:00:00Z'),
(id_therock,      'TheRock',       'Dwayne Johnson',         'therock@xbee.social',  'https://randomuser.me/api/portraits/men/12.jpg', 'https://picsum.photos/seed/gym-iron-dark/1200/400', 'Mana. Gratitude. Tequila. Hardest worker in the room.', true, 'official', 96, 'legendary', '["verified","influencer","creator"]', 350, 40000000, 600, '2024-01-15T00:00:00Z'),
(id_kevinhart,    'KevinHart4real','Kevin Hart',              'kevin@xbee.social',    'https://randomuser.me/api/portraits/men/13.jpg', 'https://picsum.photos/seed/comedy-stage/1200/400', 'Comedian. Actor. Entrepreneur. Doing it all, one laugh at a time.', true, 'official', 91, 'diamond', '["verified","creator"]', 250, 38000000, 768, '2024-01-15T00:00:00Z'),
(id_snoopdogg,    'SnoopDogg',     'Snoop Dogg',             'snoop@xbee.social',    'https://randomuser.me/api/portraits/men/14.jpg', 'https://picsum.photos/seed/chill-vibes/1200/400', 'Boss Dogg. Tha Dogg Father. Nuff said.', true, 'official', 93, 'diamond', '["verified","creator","influencer"]', 300, 23000000, 1200, '2024-01-15T00:00:00Z'),
(id_neymar,       'naboreal',       'Neymar Jr',             'neymar@xbee.social',   'https://randomuser.me/api/portraits/men/15.jpg', 'https://picsum.photos/seed/brazil-football/1200/400', 'Footballer. Instituto Neymar Jr. @SantosFC heritage.', true, 'official', 90, 'diamond', '["verified","athlete"]', 200, 64000000, 850, '2024-01-15T00:00:00Z'),
(id_katyperry,    'katyperry',     'KATY PERRY',             'katy@xbee.social',     'https://randomuser.me/api/portraits/women/9.jpg', 'https://picsum.photos/seed/neon-stage/1200/400', 'Love. Light. 143.', true, 'official', 92, 'diamond', '["verified","creator"]', 220, 108000000, 248, '2024-01-15T00:00:00Z'),
(id_ladygaga,     'ladygaga',      'Lady Gaga',              'gaga@xbee.social',     'https://randomuser.me/api/portraits/women/10.jpg', 'https://picsum.photos/seed/glamour-lights/1200/400', 'Born This Way Foundation. Mother Monster. Chromatica.', true, 'official', 95, 'legendary', '["verified","creator","humanitarian"]', 300, 84000000, 130000, '2024-01-15T00:00:00Z'),
(id_arianagrande, 'ArianaGrande',  'Ariana Grande',          'ariana@xbee.social',   'https://randomuser.me/api/portraits/women/11.jpg', 'https://picsum.photos/seed/pink-clouds/1200/400', 'eternal sunshine. rem beauty. singer tiny person.', true, 'official', 94, 'diamond', '["verified","creator"]', 280, 80000000, 715, '2024-01-15T00:00:00Z'),
(id_tomholland,   'TomHolland1996','Tom Holland',             'tom@xbee.social',      'https://randomuser.me/api/portraits/men/16.jpg', 'https://picsum.photos/seed/spiderman-city/1200/400', 'Your friendly neighbourhood Spider-Man. The Brothers Trust.', true, 'official', 88, 'diamond', '["verified","creator"]', 150, 9300000, 623, '2024-01-15T00:00:00Z'),
(id_zendaya,      'Zendaya',       'Zendaya',                'zendaya@xbee.social',  'https://randomuser.me/api/portraits/women/12.jpg', 'https://picsum.photos/seed/fashion-editorial/1200/400', 'See me. Hear me. Know me.', true, 'official', 92, 'diamond', '["verified","creator"]', 200, 22000000, 420, '2024-01-15T00:00:00Z'),
(id_willsmith,    'WillSmith',     'Will Smith',             'will@xbee.social',     'https://randomuser.me/api/portraits/men/17.jpg', 'https://picsum.photos/seed/skydiving-sky/1200/400', 'I''m that dude from Bel-Air. Just livin my life.', true, 'official', 85, 'diamond', '["verified","creator"]', 180, 13000000, 100, '2024-01-15T00:00:00Z'),
(id_timcook,      'timaboreal',      'Tim Cook',              'timcook@xbee.social',  'https://randomuser.me/api/portraits/men/18.jpg', 'https://picsum.photos/seed/apple-minimal/1200/400', 'CEO of Apple. Auburn fan. Views are my own.', true, 'official', 94, 'diamond', '["verified","pioneer"]', 300, 14000000, 87, '2024-01-15T00:00:00Z'),
(id_nasa,         'NASA',          'NASA',                   'nasa@xbee.social',     'https://api.dicebear.com/7.x/shapes/svg?seed=NASA&backgroundColor=0B3D91', 'https://picsum.photos/seed/nasa-galaxy/1200/400', 'There''s space for everybody. Explore: nasa.gov', true, 'official', 99, 'legendary', '["verified","official","pioneer"]', 365, 98000000, 200, '2024-01-15T00:00:00Z'),
(id_ellenshow,    'TheEllenShow',  'Ellen DeGeneres',        'ellen@xbee.social',    'https://randomuser.me/api/portraits/women/13.jpg', 'https://picsum.photos/seed/dancing-fun/1200/400', 'Comedian. Be kind to one another.', true, 'official', 88, 'diamond', '["verified","creator"]', 180, 77000000, 570, '2024-01-15T00:00:00Z'),
(id_jackblack,    'jackblack',     'Jack Black',             'jack@xbee.social',     'https://randomuser.me/api/portraits/men/19.jpg', 'https://picsum.photos/seed/rock-guitar/1200/400', 'Actor. Musician. Gamer. Tenacious D. JablinJablin.', true, 'official', 89, 'diamond', '["verified","creator"]', 160, 6200000, 410, '2024-01-15T00:00:00Z'),
(id_ryanreynolds, 'VancityReynolds','Ryan Reynolds',          'ryan@xbee.social',    'https://randomuser.me/api/portraits/men/20.jpg', 'https://picsum.photos/seed/wrexham-soccer/1200/400', 'Wrexham Co-Owner. Aviation Gin. Mint Mobile. Maximum Effort. Mostly dad things.', true, 'official', 93, 'diamond', '["verified","creator","influencer"]', 280, 21000000, 750, '2024-01-15T00:00:00Z'),
(id_margotrobbie, 'MargotRobbie',  'Margot Robbie',          'margot@xbee.social',   'https://randomuser.me/api/portraits/women/14.jpg', 'https://picsum.photos/seed/film-director/1200/400', 'Actress. Producer. LuckyChap Entertainment.', true, 'official', 88, 'diamond', '["verified","creator"]', 150, 4200000, 90, '2024-01-15T00:00:00Z'),
(id_chrisevans,   'ChrisEvans',    'Chris Evans',            'chris@xbee.social',    'https://randomuser.me/api/portraits/men/21.jpg', 'https://picsum.photos/seed/captain-shield/1200/400', 'Politically active. Dodger''s dad. A Starting Point.', true, 'official', 90, 'diamond', '["verified","creator"]', 200, 18000000, 310, '2024-01-15T00:00:00Z'),
(id_scarjo,       'ScarlettJo',    'Scarlett Johansson',     'scarjo@xbee.social',   'https://randomuser.me/api/portraits/women/15.jpg', 'https://picsum.photos/seed/skincare-glow/1200/400', 'Actress. The Outset skincare founder.', true, 'official', 89, 'diamond', '["verified","creator"]', 170, 9500000, 68, '2024-01-15T00:00:00Z'),
(id_jlo,          'JLo',           'Jennifer Lopez',         'jlo@xbee.social',      'https://randomuser.me/api/portraits/women/16.jpg', 'https://picsum.photos/seed/bronx-city/1200/400', 'Actress. Singer. Dancer. Producer. Entrepreneur. JLo Beauty.', true, 'official', 91, 'diamond', '["verified","creator","influencer"]', 250, 46000000, 1700, '2024-01-15T00:00:00Z'),
(id_shakira,      'shakira',       'Shakira',                'shakira@xbee.social',  'https://randomuser.me/api/portraits/women/17.jpg', 'https://picsum.photos/seed/colombia-colors/1200/400', 'Singer. Songwriter. Barefoot foundation. Colombian.', true, 'official', 93, 'diamond', '["verified","creator"]', 220, 18000000, 295, '2024-01-15T00:00:00Z'),
(id_msdhoni,      'msdhoni',       'MS Dhoni',               'dhoni@xbee.social',    'https://randomuser.me/api/portraits/men/23.jpg', 'https://picsum.photos/seed/cricket-stadium/1200/400', 'Cricket. CSK forever. Captain Cool. Ranchi boy.', true, 'official', 94, 'diamond', '["verified","athlete"]', 180, 41000000, 15, '2024-01-15T00:00:00Z'),
(id_viratkohli,   'imVkohli',      'Virat Kohli',            'virat@xbee.social',    'https://randomuser.me/api/portraits/men/24.jpg', 'https://picsum.photos/seed/cricket-field/1200/400', 'Cricketer. Father. WROGN. One8. Keep pushing the boundaries.', true, 'official', 95, 'legendary', '["verified","athlete","influencer"]', 300, 61000000, 43, '2024-01-15T00:00:00Z'),
(id_badgalriri,   'badgalriri',    'Rihanna',                'riri@xbee.social',     'https://randomuser.me/api/portraits/women/18.jpg', 'https://picsum.photos/seed/riri-fenty/1200/400', 'Fenty Corp. This is an alt.', true, 'official', 88, 'diamond', '["verified","creator"]', 100, 5800000, 800, '2024-01-15T00:00:00Z'),
(id_mrbeast,      'MrBeast',       'MrBeast',                'mrbeast@xbee.social',  'https://randomuser.me/api/portraits/men/25.jpg', 'https://picsum.photos/seed/youtube-creator/1200/400', 'Philanthropist. YouTuber. Feastables. I give away money.', true, 'official', 95, 'legendary', '["verified","creator","humanitarian"]', 365, 32000000, 980, '2024-01-15T00:00:00Z'),
(id_pewdiepie,    'pewdiepie',     'PewDiePie',              'pewds@xbee.social',    'https://randomuser.me/api/portraits/men/26.jpg', 'https://picsum.photos/seed/gaming-setup/1200/400', 'Swedish YouTuber. Brofist. 111M subs. Semi-retired dad mode.', true, 'official', 90, 'diamond', '["verified","creator"]', 200, 24000000, 680, '2024-01-15T00:00:00Z'),
(id_khloek,       'khloekardashian','Khloe Kardashian',      'khloe@xbee.social',    'https://randomuser.me/api/portraits/women/19.jpg', 'https://picsum.photos/seed/good-american/1200/400', 'Good American founder. Mom x2. True crime obsessed.', true, 'official', 85, 'diamond', '["verified","influencer"]', 150, 32000000, 510, '2024-01-15T00:00:00Z'),
(id_kyliejenner,  'KylieJenner',   'Kylie Jenner',           'kylie@xbee.social',    'https://randomuser.me/api/portraits/women/20.jpg', 'https://picsum.photos/seed/kylie-cosmetics/1200/400', 'Kylie Cosmetics. Kylie Skin. Khy. Mom of 2.', true, 'official', 91, 'diamond', '["verified","influencer","creator"]', 280, 42000000, 420, '2024-01-15T00:00:00Z'),
(id_barackobama,  'BarackObama',   'Barack Obama',           'obama@xbee.social',    'https://randomuser.me/api/portraits/men/27.jpg', 'https://picsum.photos/seed/hope-change/1200/400', 'Dad, husband, 44th President. Citizen. Author of A Promised Land.', true, 'official', 99, 'legendary', '["verified","official","humanitarian"]', 365, 133000000, 570000, '2024-01-15T00:00:00Z'),
(id_michelleobama, 'MichelleObama', 'Michelle Obama', 'michelle@xbee.social', 'https://randomuser.me/api/portraits/women/21.jpg', 'https://picsum.photos/seed/becoming-light/1200/400', 'Wife, mother, author, former First Lady. The Light We Carry.', true, 'official', 97, 'legendary', '["verified","official","humanitarian"]', 300, 22000000, 130, '2024-01-15T00:00:00Z'),
(id_brunomars,    'BrunoMars',     'Bruno Mars',             'bruno@xbee.social',    'https://randomuser.me/api/portraits/men/28.jpg', 'https://picsum.photos/seed/vegas-lights/1200/400', 'Singer. Songwriter. Producer. Silk Sonic. SelvaRey Rum lover.', true, 'official', 93, 'diamond', '["verified","creator"]', 250, 35000000, 230, '2024-01-15T00:00:00Z'),
(id_cardi,        'iamcardib',     'Cardi B',                'cardi@xbee.social',    'https://randomuser.me/api/portraits/women/22.jpg', 'https://picsum.photos/seed/bronx-graffiti/1200/400', 'REGULAR DEGULAR GIRL FROM THE BRONX. rapper. mom. wife-ish.', true, 'official', 89, 'diamond', '["verified","creator"]', 200, 30000000, 1700, '2024-01-15T00:00:00Z'),
(id_travisscott,  'traboreal',      'Travis Scott',           'travis@xbee.social',   'https://randomuser.me/api/portraits/men/29.jpg', 'https://picsum.photos/seed/utopia-dark/1200/400', 'UTOPIA. Cactus Jack Records. La Flame.', true, 'official', 87, 'diamond', '["verified","creator"]', 180, 20000000, 350, '2024-01-15T00:00:00Z'),
(id_lizzo,        'lizzo',         'Lizzo',                  'lizzo@xbee.social',    'https://randomuser.me/api/portraits/women/23.jpg', 'https://picsum.photos/seed/self-love-colors/1200/400', 'Singer. Flutist. Body positivity queen. YITTY founder.', true, 'official', 88, 'diamond', '["verified","creator"]', 180, 5200000, 1500, '2024-01-15T00:00:00Z'),
(id_postmalone,   'PostMalone',    'Post Malone',            'post@xbee.social',     'https://randomuser.me/api/portraits/men/30.jpg', 'https://picsum.photos/seed/country-road/1200/400', 'Austin Post. Singer-songwriter. Bud Light lover. Posty.', true, 'official', 87, 'diamond', '["verified","creator"]', 170, 22000000, 620, '2024-01-15T00:00:00Z'),
(id_billieeilish, 'billieeilish',  'Billie Eilish',          'billie@xbee.social',   'https://randomuser.me/api/portraits/women/24.jpg', 'https://picsum.photos/seed/green-planet/1200/400', 'HIT ME HARD AND SOFT. vegan. climate advocate. she/her.', true, 'official', 91, 'diamond', '["verified","creator","humanitarian"]', 220, 11000000, 880, '2024-01-15T00:00:00Z'),
(id_joebiden,     'JoeBiden',      'Joe Biden',              'biden@xbee.social',    'https://randomuser.me/api/portraits/men/31.jpg', 'https://picsum.photos/seed/oval-office/1200/400', '46th President of the United States. Dad. Grandfather. Irish American.', true, 'official', 94, 'diamond', '["verified","official"]', 300, 38000000, 32, '2024-01-15T00:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  display_name = EXCLUDED.display_name,
  bio = EXCLUDED.bio,
  avatar = EXCLUDED.avatar,
  cover_image = EXCLUDED.cover_image,
  verified = EXCLUDED.verified,
  verification = EXCLUDED.verification,
  trust_score = EXCLUDED.trust_score,
  trust_tier = EXCLUDED.trust_tier,
  badges = EXCLUDED.badges,
  followers_count = EXCLUDED.followers_count,
  following_count = EXCLUDED.following_count;

-- ============================================================
-- 3. INSERT POSTS (Realistic content, backdated)
-- ============================================================

-- Elon Musk posts
INSERT INTO posts (author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(id_elonmusk, 'Starship Flight 7 was a success. Full orbital velocity achieved. Next stop: Mars refueling depot. The future is multiplanetary.', 2400000, 380000, 95000, 180000000, '2026-03-28T14:30:00Z'),
(id_elonmusk, 'Tesla Robotaxi launches in Austin next month. No steering wheel. No pedals. Just vibes and AI. The age of autonomous transport is here.', 1800000, 290000, 120000, 150000000, '2026-03-15T18:45:00Z'),
(id_elonmusk, 'Free speech is the bedrock of democracy. Period.', 3200000, 510000, 240000, 220000000, '2026-02-20T09:12:00Z'),
(id_elonmusk, 'Just visited the Neuralink facility. First patient played chess using only their thoughts yesterday. We are living in the future.', 1500000, 200000, 75000, 100000000, '2026-01-10T21:30:00Z'),

-- Donald Trump posts
(id_trump, 'America is WINNING again. Stock market at ALL TIME HIGHS. Jobs are back. Energy is DOMINANT. This is what LEADERSHIP looks like. MAGA!', 890000, 120000, 340000, 95000000, '2026-04-01T07:15:00Z'),
(id_trump, 'Just had a TREMENDOUS meeting with world leaders. They all say the same thing - America is RESPECTED again. We are the GREATEST country in HISTORY!', 750000, 95000, 180000, 80000000, '2026-03-20T12:00:00Z'),
(id_trump, 'The FAKE NEWS media will never report the truth. But the American people know. And that is all that matters!', 1200000, 180000, 400000, 120000000, '2026-02-15T06:30:00Z'),

-- White House posts
(id_whitehouse, 'Today, the President signed the American Innovation Act — investing $200 billion in semiconductor manufacturing, quantum computing, and AI safety research over the next decade.', 450000, 85000, 32000, 60000000, '2026-03-25T16:00:00Z'),
(id_whitehouse, 'Gas prices have dropped to their lowest level in 4 years. Unemployment remains at 3.4%. The American economy is strong.', 320000, 55000, 28000, 45000000, '2026-03-10T14:30:00Z'),

-- Salma Hayek posts
(id_salmahayek, 'On set today feeling grateful for every opportunity. 30 years in this industry and I still get butterflies before every scene. Never stop being passionate about your craft.', 680000, 42000, 15000, 25000000, '2026-03-30T10:20:00Z'),
(id_salmahayek, 'My garden is finally blooming after months of care. There is something deeply meditative about nurturing life from the soil. Nature is the best therapist.', 520000, 28000, 8500, 18000000, '2026-03-12T08:45:00Z'),
(id_salmahayek, 'Happy International Women''s Day to every woman fighting, creating, leading, and loving out loud. We are unstoppable together.', 950000, 120000, 22000, 40000000, '2026-03-08T09:00:00Z'),

-- Keanu Reeves posts
(id_keanureeves, 'Finished filming today. Grateful for the crew, the cast, and every single person who makes movie magic happen behind the camera. You are the real stars.', 1200000, 95000, 18000, 45000000, '2026-03-22T19:30:00Z'),
(id_keanureeves, 'Be excellent to each other. That is still the whole philosophy.', 2800000, 350000, 45000, 120000000, '2026-02-14T12:00:00Z'),

-- Charlize Theron posts
(id_charlize, 'Just wrapped our annual CTAOP gala. Over $4.2 million raised for African youth programs. Every child deserves a chance to dream big. Thank you to everyone who showed up.', 720000, 85000, 12000, 28000000, '2026-03-18T20:15:00Z'),
(id_charlize, 'Training for the new role. Day 47. My body is screaming but my spirit is singing. There is no shortcut to becoming someone else on screen.', 580000, 38000, 9500, 22000000, '2026-03-05T07:00:00Z'),

-- Rihanna posts
(id_rihanna, 'FENTY BEAUTY new summer collection dropping Friday. Y''all are NOT ready for these shades.', 2100000, 180000, 85000, 90000000, '2026-03-26T13:00:00Z'),
(id_rihanna, 'studio vibes. something special cooking. that''s all i''m saying.', 3500000, 420000, 150000, 130000000, '2026-03-01T23:45:00Z'),

-- Drake posts
(id_drake, 'New album is 90% done. This one is different. This one is personal. Coming this summer. OVO Season.', 1800000, 290000, 95000, 75000000, '2026-03-29T02:00:00Z'),
(id_drake, 'Toronto raised me different. Every time I come home it hits the same. Gratitude on max.', 980000, 120000, 42000, 45000000, '2026-03-14T20:30:00Z'),

-- Taylor Swift posts
(id_taylorswift, 'The Eras Tour was the greatest experience of my life. 146 shows across 5 continents. Every single one of you made it magical. I love you all forever.', 4200000, 680000, 350000, 250000000, '2026-03-01T18:00:00Z'),
(id_taylorswift, 'Writing. Always writing. The words won''t leave me alone and I wouldn''t have it any other way.', 2800000, 380000, 120000, 140000000, '2026-02-10T22:15:00Z'),

-- Beyonce posts
(id_beyonce, 'COWBOY CARTER vinyl is now available worldwide. This album changed my life to make. I hope it changes yours to listen to.', 3800000, 520000, 180000, 200000000, '2026-03-15T12:00:00Z'),

-- Cristiano Ronaldo posts
(id_cristiano, 'Another hat trick today. 920 career goals. The fire never goes out. SIIIIUUUUUU!', 5200000, 680000, 250000, 300000000, '2026-03-30T22:00:00Z'),
(id_cristiano, 'Hard work beats talent when talent doesn''t work hard. Morning session done. Afternoon session loading. Never stop grinding.', 3100000, 420000, 95000, 180000000, '2026-03-20T06:00:00Z'),

-- Leo Messi posts
(id_leomessi, 'Beautiful night in Miami. Thank you to the fans who never stop believing. This club, this city, this family. VAMOS!', 2800000, 350000, 85000, 150000000, '2026-03-28T23:30:00Z'),
(id_leomessi, 'Playing with my kids is still the best part of every day. Football is life, but family is everything.', 3500000, 480000, 65000, 180000000, '2026-03-10T16:00:00Z'),

-- LeBron James posts
(id_lebron, 'Year 24 in the NBA. They said I would slow down. I said watch me. 40 points tonight. #TheKidFromAkron', 2200000, 320000, 120000, 130000000, '2026-03-25T23:00:00Z'),
(id_lebron, 'I Promise School just graduated its 3rd class with 100% college acceptance rate. THAT is my legacy. Not the rings.', 3800000, 550000, 85000, 200000000, '2026-03-08T10:00:00Z'),

-- Oprah posts
(id_oprah, 'Read this book immediately. It changed my entire perspective on what it means to live with intention. Link in bio for the full book club list.', 920000, 130000, 35000, 50000000, '2026-03-20T14:00:00Z'),
(id_oprah, 'When someone shows you who they are, believe them the first time. Maya taught me that. I teach it to you.', 1800000, 280000, 55000, 90000000, '2026-02-28T09:30:00Z'),

-- Bill Gates posts
(id_billgates, 'Just published my annual letter on climate innovation. Nuclear energy, direct air capture, and sustainable agriculture are the three pillars. We can solve this. gatesnotes.com', 980000, 180000, 42000, 60000000, '2026-03-22T10:00:00Z'),
(id_billgates, 'AI will be the most transformative technology of our lifetime. But only if we ensure it benefits everyone, not just the privileged few. Read my thoughts:', 1200000, 220000, 68000, 80000000, '2026-02-18T15:00:00Z'),

-- Jeff Bezos posts
(id_jeffbezos, 'Blue Origin successfully landed its New Glenn rocket for the 3rd time. Reusability is no longer the future — it is the present. Day 1 energy.', 680000, 95000, 28000, 35000000, '2026-03-15T11:00:00Z'),

-- Mark Zuckerberg posts
(id_markz, 'Llama 4 is now open source. 1.2 trillion parameters. Beats GPT-5 on 7 out of 10 benchmarks. Open source AI wins.', 1500000, 280000, 95000, 80000000, '2026-03-28T09:00:00Z'),
(id_markz, 'New personal best deadlift: 545 lbs. Jiu jitsu tomorrow. The only way out is through.', 890000, 65000, 42000, 40000000, '2026-03-10T07:30:00Z'),

-- Kim Kardashian posts
(id_kimk, 'SKIMS just opened our flagship store in Paris. Dreams really do come true when you put in the work. So proud of this team.', 1200000, 85000, 42000, 55000000, '2026-03-25T16:00:00Z'),
(id_kimk, 'Studying for the bar exam while managing 4 kids and a billion dollar business. Sleep is optional. Coffee is mandatory.', 980000, 75000, 65000, 48000000, '2026-03-05T22:00:00Z'),

-- Selena Gomez posts
(id_selenagomez, 'Rare Beauty just crossed $1 billion in sales. Started this because I wanted to challenge unrealistic beauty standards. You are rare. You are enough.', 2200000, 280000, 45000, 100000000, '2026-03-20T12:00:00Z'),
(id_selenagomez, 'Mental health is not a trend. It is a necessity. Check on your friends. Check on yourself. You matter more than you know.', 3100000, 420000, 75000, 140000000, '2026-02-25T09:00:00Z'),

-- The Rock posts
(id_therock, '4:30 AM. Iron paradise. The world is still sleeping but we are BUILDING. Every rep is a promise to yourself. Now get after it.', 1800000, 220000, 65000, 80000000, '2026-03-29T04:30:00Z'),
(id_therock, 'Just wrapped filming on the biggest movie of my career. 6 months of 14-hour days. Blood, sweat, and tequila. Can''t wait for you to see this one.', 2500000, 320000, 85000, 120000000, '2026-03-10T21:00:00Z'),

-- Kevin Hart posts
(id_kevinhart, 'Fell off the stage last night. Got back up. Finished the show. That''s life. You fall. You get up. You make people laugh about it. HARTBEAT.', 1500000, 220000, 85000, 70000000, '2026-03-22T23:00:00Z'),

-- Snoop Dogg posts
(id_snoopdogg, 'Cooking show season 4 starts next week. Martha and I got some crazy episodes this time. We made a 7-course meal with only things from my garden if u know what i mean', 1200000, 180000, 75000, 60000000, '2026-03-18T16:20:00Z'),

-- Katy Perry posts
(id_katyperry, 'Performing in Tokyo tonight. This crowd is ELECTRIC. Music is the universal language and I am just the translator.', 890000, 95000, 28000, 40000000, '2026-03-26T18:00:00Z'),

-- Lady Gaga posts
(id_ladygaga, 'Born This Way Foundation has now supported over 5 million young people with mental health resources. Kindness is punk rock. Be brave. Be kind.', 2200000, 320000, 55000, 100000000, '2026-03-15T14:00:00Z'),

-- Ariana Grande posts
(id_arianagrande, 'eternal sunshine (deluxe) is here. 6 new songs. poured my whole heart into these. stream it and tell me your favorite.', 2800000, 350000, 120000, 130000000, '2026-03-22T00:00:00Z'),

-- Tom Holland & Zendaya posts
(id_tomholland, 'Been off social media for months. Mental health first. I''m back now and feeling better than ever. Missed you lot.', 1500000, 180000, 65000, 70000000, '2026-03-18T10:00:00Z'),
(id_zendaya, 'Grateful. That''s the only word for today. New project announcement coming soon.', 1800000, 220000, 42000, 80000000, '2026-03-25T13:00:00Z'),

-- Ryan Reynolds posts
(id_ryanreynolds, 'Wrexham just got promoted again. From the 5th tier to the Championship in 4 years. If that''s not a movie, I don''t know what is.', 1500000, 220000, 55000, 70000000, '2026-03-30T19:00:00Z'),
(id_ryanreynolds, 'My daughter asked me what I do for a living and I said "I pretend to be other people" and she said "that''s lying, daddy" and honestly she has a point.', 2800000, 380000, 120000, 130000000, '2026-03-12T11:00:00Z'),

-- Obama posts
(id_barackobama, 'Democracy is not a spectator sport. It requires all of us to show up, speak out, and do the work. Every day. Not just on election day.', 2500000, 380000, 85000, 130000000, '2026-03-20T10:00:00Z'),
(id_barackobama, 'Here are my summer reading recommendations. 12 books that will challenge your thinking and expand your world. Thread:', 1800000, 290000, 42000, 95000000, '2026-03-01T12:00:00Z'),

-- Michelle Obama posts
(id_michelleobama, 'To every young girl reading this: your voice matters more than you know. Use it. The world is waiting for exactly what you have to offer.', 2200000, 350000, 65000, 110000000, '2026-03-08T09:00:00Z'),

-- MrBeast posts
(id_mrbeast, 'We just built 100 homes for families in need. Took 6 months and a massive team. This is what the internet is for. Full video dropping tomorrow.', 3200000, 520000, 180000, 200000000, '2026-03-28T15:00:00Z'),
(id_mrbeast, 'Every dollar from Feastables this month goes directly to feeding people. No overhead. No marketing budget. Just food for families. Let''s go.', 2500000, 380000, 95000, 140000000, '2026-03-10T12:00:00Z'),

-- NASA posts
(id_nasa, 'BREAKING: Artemis IV astronauts have successfully collected the first samples from the lunar south pole. Water ice confirmed. This changes everything for sustained human presence on the Moon.', 4500000, 680000, 120000, 250000000, '2026-03-28T20:00:00Z'),
(id_nasa, 'The James Webb Space Telescope has captured the most detailed image ever of a potentially habitable exoplanet 40 light-years away. The data is extraordinary.', 3200000, 520000, 85000, 180000000, '2026-03-10T16:00:00Z'),

-- Tim Cook posts
(id_timcook, 'Apple Vision Pro 2 ships next month. Lighter, more powerful, and more accessible. Spatial computing is entering its next chapter.', 1500000, 220000, 65000, 70000000, '2026-03-25T09:00:00Z'),

-- Bruno Mars posts
(id_brunomars, 'Vegas residency show 847. Every single night feels like the first. This is what I was born to do. Thank you for still showing up.', 1200000, 150000, 42000, 55000000, '2026-03-22T01:00:00Z'),

-- Cardi B posts
(id_cardi, 'Y''ALL I JUST HIT #1 AGAIN!!! BRONX FOREVER!! When they said I was done I said OKURRR watch this!! New album coming and it''s my best work PERIOD', 1800000, 280000, 120000, 90000000, '2026-03-26T22:00:00Z'),

-- Billie Eilish posts
(id_billieeilish, 'wrote a song at 3am last night that made me cry. those are always the best ones. something is coming and it scares me in the best way.', 1500000, 200000, 55000, 70000000, '2026-03-20T03:30:00Z'),

-- Kylie Jenner posts
(id_kyliejenner, 'Khy just launched our sustainable denim line. Fashion should not cost the earth literally. So proud of where this brand is going.', 980000, 85000, 32000, 45000000, '2026-03-18T14:00:00Z'),

-- Joe Biden posts
(id_joebiden, 'Folks, here''s the deal: we passed the most significant climate legislation in history, and now we''re seeing the results. 500,000 new clean energy jobs. That''s not a talking point — that''s your neighbor getting a good-paying job.', 680000, 95000, 120000, 40000000, '2026-03-15T11:00:00Z'),

-- Will Smith posts
(id_willsmith, 'Took the kids skydiving today. If you''re not scared, you''re not growing. Fear is the compass pointing where you need to go.', 1200000, 150000, 45000, 55000000, '2026-03-22T16:00:00Z'),

-- Shakira posts
(id_shakira, 'Just announced 20 new dates for the world tour. South America, the energy you gave me last month was unreal. I am coming back and bringing MORE.', 1500000, 180000, 42000, 65000000, '2026-03-18T10:00:00Z'),

-- Virat Kohli posts
(id_viratkohli, 'Century number 82. The hunger never dies. Thank you to every fan who stayed, believed, and never stopped cheering. This one was for you.', 2800000, 380000, 65000, 140000000, '2026-03-25T22:30:00Z'),

-- Neymar posts
(id_neymar, 'Back on the pitch after 8 months. Tears in my eyes. Football is my oxygen and I was suffocating without it. VAMOS!', 1800000, 250000, 55000, 80000000, '2026-03-20T21:00:00Z'),

-- Post Malone posts
(id_postmalone, 'new country album is done. yes you read that right. posty goes full Nashville. dropping next month and it slaps different trust me', 980000, 120000, 55000, 45000000, '2026-03-15T03:00:00Z'),

-- Lizzo posts
(id_lizzo, 'Self-love is not narcissism. It is SURVIVAL. Look in the mirror today and tell yourself something beautiful. I''ll start: you are a masterpiece in progress.', 1200000, 180000, 42000, 55000000, '2026-03-12T09:00:00Z'),

-- PewDiePie posts
(id_pewdiepie, 'Being a dad is the hardest and best game I have ever played. No respawns. No save points. But the rewards are infinite.', 1500000, 200000, 85000, 70000000, '2026-03-10T08:00:00Z'),

-- Jack Black posts
(id_jackblack, 'Just performed a 7-minute drum solo at a charity gig. Nobody asked for it. Everyone needed it. ROCK IS NOT DEAD PEOPLE.', 980000, 130000, 55000, 40000000, '2026-03-22T22:00:00Z'),

-- Scarlett Johansson posts
(id_scarjo, 'The Outset just reached 1 million customers. Built this brand because I believe clean beauty should be accessible to everyone, not just the few.', 680000, 55000, 18000, 28000000, '2026-03-14T11:00:00Z'),

-- Chris Evans posts
(id_chrisevans, 'Take a break from the internet today. Go outside. Pet a dog. Talk to a neighbor. The algorithm can wait. Your soul cannot.', 1800000, 280000, 45000, 80000000, '2026-03-18T09:00:00Z'),

-- Margot Robbie posts
(id_margotrobbie, 'LuckyChap just greenlit our 15th film with a female director. Representation behind the camera matters just as much as in front of it.', 720000, 85000, 22000, 30000000, '2026-03-20T15:00:00Z'),

-- JLo posts
(id_jlo, 'This is me now... LIVE. The tour starts in 2 weeks. Every show will be a celebration of every version of myself. The girl from the Bronx is ready.', 1200000, 120000, 42000, 50000000, '2026-03-25T18:00:00Z'),

-- MS Dhoni posts
(id_msdhoni, 'CSK forever. Yellow is not just a color, it is an emotion. See you in the stands. #WhistlePodu', 2200000, 280000, 55000, 100000000, '2026-03-20T18:00:00Z'),

-- Ellen posts
(id_ellenshow, 'Started my morning by dancing in the kitchen with my dogs. 10/10 would recommend as a life philosophy.', 580000, 42000, 15000, 22000000, '2026-03-12T08:00:00Z'),

-- Justin Bieber posts
(id_justinbieber, 'New music coming. Healthier than I have been in years. Hailey and I just celebrated 8 years. God is good. Grateful season.', 2200000, 280000, 85000, 100000000, '2026-03-18T20:00:00Z'),

-- Travis Scott posts
(id_travisscott, 'UTOPIA tour just went platinum. Every city showed out different. The rage is eternal. New sounds loading for 2026.', 1200000, 150000, 55000, 55000000, '2026-03-22T01:30:00Z'),

-- Khloe K posts
(id_khloek, 'Being a mom of two is the most challenging and rewarding thing I have ever done. True went to school with her backpack on backwards today and honestly same energy.', 680000, 55000, 28000, 30000000, '2026-03-15T09:00:00Z'),

-- LeBron (second post)
(id_lebron, 'Space Jam 3? Let''s just say Bugs Bunny called and I answered. More details soon.', 1500000, 220000, 95000, 80000000, '2026-03-15T14:00:00Z')

ON CONFLICT DO NOTHING;


-- ============================================================
-- 4. INSERT COMMENTS (Cross-celebrity interactions)
-- ============================================================
-- Get post IDs dynamically by matching content patterns

INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_keanureeves, 'This is breathtaking. You are breathtaking.',
  p.created_at + interval '2 hours'
FROM posts p WHERE p.author_id = id_elonmusk AND p.content LIKE '%Starship%' LIMIT 1;

INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_billgates, 'Great progress. The implications for climate science alone are enormous.',
  p.created_at + interval '3 hours'
FROM posts p WHERE p.author_id = id_elonmusk AND p.content LIKE '%Starship%' LIMIT 1;

INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_jeffbezos, 'Congrats to the SpaceX team. Space is big enough for all of us.',
  p.created_at + interval '5 hours'
FROM posts p WHERE p.author_id = id_elonmusk AND p.content LIKE '%Starship%' LIMIT 1;

INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_therock, 'My man! The future is HERE. Hardest working dude on the planet.',
  p.created_at + interval '1 hour'
FROM posts p WHERE p.author_id = id_elonmusk AND p.content LIKE '%Tesla Robotaxi%' LIMIT 1;

INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_snoopdogg, 'Does it come with a built-in speaker system tho? Asking for a friend',
  p.created_at + interval '4 hours'
FROM posts p WHERE p.author_id = id_elonmusk AND p.content LIKE '%Tesla Robotaxi%' LIMIT 1;

-- Comments on Trump posts
INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_elonmusk, 'The economy speaks for itself.',
  p.created_at + interval '2 hours'
FROM posts p WHERE p.author_id = id_trump AND p.content LIKE '%Stock market%' LIMIT 1;

-- Comments on Taylor Swift posts
INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_selenagomez, 'I love you forever and always. You inspired a generation.',
  p.created_at + interval '30 minutes'
FROM posts p WHERE p.author_id = id_taylorswift AND p.content LIKE '%Eras Tour%' LIMIT 1;

INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_ryanreynolds, 'I brought my daughter to 3 shows. She now insists I call her Taylor. I have lost my child to friendship bracelets.',
  p.created_at + interval '2 hours'
FROM posts p WHERE p.author_id = id_taylorswift AND p.content LIKE '%Eras Tour%' LIMIT 1;

INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_arianagrande, 'QUEEN. Every show was a masterclass.',
  p.created_at + interval '1 hour'
FROM posts p WHERE p.author_id = id_taylorswift AND p.content LIKE '%Eras Tour%' LIMIT 1;

-- Comments on Ronaldo posts
INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_leomessi, 'Great numbers. The game needs both of us.',
  p.created_at + interval '6 hours'
FROM posts p WHERE p.author_id = id_cristiano AND p.content LIKE '%920 career goals%' LIMIT 1;

INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_neymar, 'GOAT things! Miss playing against you bro. SIUUUU!',
  p.created_at + interval '3 hours'
FROM posts p WHERE p.author_id = id_cristiano AND p.content LIKE '%920 career goals%' LIMIT 1;

INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_lebron, 'Different sport, same mentality. Respect always CR7.',
  p.created_at + interval '4 hours'
FROM posts p WHERE p.author_id = id_cristiano AND p.content LIKE '%920 career goals%' LIMIT 1;

-- Comments on Rihanna posts
INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_kimk, 'OMG the swatches look INSANE! Take my money!',
  p.created_at + interval '1 hour'
FROM posts p WHERE p.author_id = id_rihanna AND p.content LIKE '%summer collection%' LIMIT 1;

INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_selenagomez, 'YOUR SHADES CHANGED THE BEAUTY INDUSTRY. Period.',
  p.created_at + interval '2 hours'
FROM posts p WHERE p.author_id = id_rihanna AND p.content LIKE '%summer collection%' LIMIT 1;

INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_drake, 'WE NEED THE ALBUM THO 👀',
  p.created_at + interval '30 minutes'
FROM posts p WHERE p.author_id = id_rihanna AND p.content LIKE '%studio vibes%' LIMIT 1;

INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_katyperry, 'R9 IS COMING I CAN FEEL IT',
  p.created_at + interval '1 hour'
FROM posts p WHERE p.author_id = id_rihanna AND p.content LIKE '%studio vibes%' LIMIT 1;

-- Comments on MrBeast posts
INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_billgates, 'This is exactly the kind of grassroots impact we need more of. Incredible work.',
  p.created_at + interval '4 hours'
FROM posts p WHERE p.author_id = id_mrbeast AND p.content LIKE '%100 homes%' LIMIT 1;

INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_oprah, 'THIS is what using your platform for good looks like. Proud of you.',
  p.created_at + interval '6 hours'
FROM posts p WHERE p.author_id = id_mrbeast AND p.content LIKE '%100 homes%' LIMIT 1;

INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_pewdiepie, 'Bro really out here changing lives while I struggle to change my socks. Legend.',
  p.created_at + interval '3 hours'
FROM posts p WHERE p.author_id = id_mrbeast AND p.content LIKE '%100 homes%' LIMIT 1;

-- Comments on NASA posts
INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_elonmusk, 'Water ice on the Moon is a game changer for Mars missions. We can refuel there. Incredible.',
  p.created_at + interval '1 hour'
FROM posts p WHERE p.author_id = id_nasa AND p.content LIKE '%Artemis IV%' LIMIT 1;

INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_billgates, 'Historic moment. The scientific value of these samples cannot be overstated.',
  p.created_at + interval '3 hours'
FROM posts p WHERE p.author_id = id_nasa AND p.content LIKE '%Artemis IV%' LIMIT 1;

INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_markz, 'This is what happens when humanity collaborates at scale. Congratulations to the entire team.',
  p.created_at + interval '5 hours'
FROM posts p WHERE p.author_id = id_nasa AND p.content LIKE '%Artemis IV%' LIMIT 1;

-- Comments on LeBron posts
INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_therock, 'KING. 24 years and still dominating. Respect is an understatement.',
  p.created_at + interval '1 hour'
FROM posts p WHERE p.author_id = id_lebron AND p.content LIKE '%Year 24%' LIMIT 1;

INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_barackobama, 'I Promise School is proof that when we invest in children, they always exceed expectations. Proud of you, LeBron.',
  p.created_at + interval '5 hours'
FROM posts p WHERE p.author_id = id_lebron AND p.content LIKE '%I Promise School%' LIMIT 1;

-- Comments on Keanu posts
INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_ryanreynolds, 'I aspire to this level of wholesome. I really do. Currently failing but aspirations are there.',
  p.created_at + interval '3 hours'
FROM posts p WHERE p.author_id = id_keanureeves AND p.content LIKE '%Be excellent%' LIMIT 1;

INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_jackblack, 'BILL AND TED FOREVER! Be excellent, party on, and always air guitar your feelings.',
  p.created_at + interval '2 hours'
FROM posts p WHERE p.author_id = id_keanureeves AND p.content LIKE '%Be excellent%' LIMIT 1;

-- Comments on Ryan Reynolds posts
INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_jackblack, 'Your daughter is smarter than all of us. Give her my number she can be my agent.',
  p.created_at + interval '2 hours'
FROM posts p WHERE p.author_id = id_ryanreynolds AND p.content LIKE '%daughter asked me%' LIMIT 1;

INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_chrisevans, 'Kids have zero chill and maximum truth. My nephew told me Captain America was "okay but not the best one."',
  p.created_at + interval '4 hours'
FROM posts p WHERE p.author_id = id_ryanreynolds AND p.content LIKE '%daughter asked me%' LIMIT 1;

-- Comments on Selena Gomez posts
INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_taylorswift, 'SO proud of you! You built an empire and changed lives doing it. Love you.',
  p.created_at + interval '1 hour'
FROM posts p WHERE p.author_id = id_selenagomez AND p.content LIKE '%$1 billion%' LIMIT 1;

INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_ladygaga, 'THIS is what happens when business meets compassion. Beautiful.',
  p.created_at + interval '3 hours'
FROM posts p WHERE p.author_id = id_selenagomez AND p.content LIKE '%Mental health%' LIMIT 1;

-- Comments on Mark Zuckerberg posts
INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_elonmusk, 'Open source is the way. Respect.',
  p.created_at + interval '2 hours'
FROM posts p WHERE p.author_id = id_markz AND p.content LIKE '%Llama 4%' LIMIT 1;

INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_billgates, 'Open sourcing models this powerful is a bold move. Looking forward to seeing what the community builds.',
  p.created_at + interval '4 hours'
FROM posts p WHERE p.author_id = id_markz AND p.content LIKE '%Llama 4%' LIMIT 1;

-- Comments on Obama posts
INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_michelleobama, 'Couldn''t agree more. When we all participate democracy works for everyone.',
  p.created_at + interval '2 hours'
FROM posts p WHERE p.author_id = id_barackobama AND p.content LIKE '%Democracy%' LIMIT 1;

INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_oprah, 'Thank you for continuing to inspire civic engagement. The world needs this message.',
  p.created_at + interval '4 hours'
FROM posts p WHERE p.author_id = id_barackobama AND p.content LIKE '%Democracy%' LIMIT 1;

-- Comments on Charlize posts
INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_salmahayek, 'You are an absolute warrior on and off screen. The work you do for African youth is extraordinary. Love you.',
  p.created_at + interval '3 hours'
FROM posts p WHERE p.author_id = id_charlize AND p.content LIKE '%CTAOP%' LIMIT 1;

INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_oprah, 'What a night! The generosity in that room was palpable. Proud to be part of it.',
  p.created_at + interval '2 hours'
FROM posts p WHERE p.author_id = id_charlize AND p.content LIKE '%CTAOP%' LIMIT 1;

-- Comments on Salma Hayek posts
INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_charlize, 'You are timeless. 30 years and still the most captivating person on screen.',
  p.created_at + interval '4 hours'
FROM posts p WHERE p.author_id = id_salmahayek AND p.content LIKE '%30 years in this industry%' LIMIT 1;

INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_jlo, 'Butterflies are good. They mean you still care. Queen energy always.',
  p.created_at + interval '2 hours'
FROM posts p WHERE p.author_id = id_salmahayek AND p.content LIKE '%30 years in this industry%' LIMIT 1;

-- Comments on Billie Eilish posts
INSERT INTO comments (post_id, author_id, content, created_at)
SELECT p.id, id_arianagrande, '3am songs hit different. The vulnerability is what makes your music special. Cannot wait.',
  p.created_at + interval '5 hours'
FROM posts p WHERE p.author_id = id_billieeilish AND p.content LIKE '%3am%' LIMIT 1;

-- Update reply counts on posts that received comments
UPDATE posts SET replies_count = replies_count + sub.cnt
FROM (SELECT post_id, COUNT(*) as cnt FROM comments GROUP BY post_id) sub
WHERE posts.id = sub.post_id;

RAISE NOTICE 'Celebrity seed data inserted successfully!';
END $$;

-- Re-enable the auto-profile trigger for future signups
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Final verification
SELECT 'Profiles created: ' || COUNT(*) FROM profiles WHERE verified = true;
SELECT 'Posts created: ' || COUNT(*) FROM posts;
SELECT 'Comments created: ' || COUNT(*) FROM comments;
