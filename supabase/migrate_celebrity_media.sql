-- ============================================================
-- XBEE SOCIAL — Celebrity Media Migration
-- Adds cover photos, real avatars, and media images to posts
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Add cover_image column if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cover_image TEXT DEFAULT '';

-- 2. Update celebrity avatars and cover images
WITH celeb_media(uid, new_avatar, new_cover) AS (VALUES
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'https://randomuser.me/api/portraits/men/32.jpg',  'https://picsum.photos/seed/tesla-space/1200/400'),
  ('a0000000-0000-0000-0000-000000000002'::uuid, 'https://randomuser.me/api/portraits/men/75.jpg',  'https://picsum.photos/seed/whitehouse-dc/1200/400'),
  ('a0000000-0000-0000-0000-000000000003'::uuid, 'https://api.dicebear.com/7.x/shapes/svg?seed=WhiteHouse&backgroundColor=002868', 'https://picsum.photos/seed/washington-monument/1200/400'),
  ('a0000000-0000-0000-0000-000000000004'::uuid, 'https://randomuser.me/api/portraits/women/44.jpg', 'https://picsum.photos/seed/hollywood-set/1200/400'),
  ('a0000000-0000-0000-0000-000000000005'::uuid, 'https://randomuser.me/api/portraits/men/22.jpg',  'https://picsum.photos/seed/motorcycle-road/1200/400'),
  ('a0000000-0000-0000-0000-000000000006'::uuid, 'https://randomuser.me/api/portraits/women/90.jpg', 'https://picsum.photos/seed/south-africa-sunset/1200/400'),
  ('a0000000-0000-0000-0000-000000000007'::uuid, 'https://randomuser.me/api/portraits/women/33.jpg', 'https://picsum.photos/seed/fenty-beauty/1200/400'),
  ('a0000000-0000-0000-0000-000000000008'::uuid, 'https://randomuser.me/api/portraits/men/41.jpg',  'https://picsum.photos/seed/toronto-night/1200/400'),
  ('a0000000-0000-0000-0000-000000000009'::uuid, 'https://randomuser.me/api/portraits/women/65.jpg', 'https://picsum.photos/seed/concert-stage-lights/1200/400'),
  ('a0000000-0000-0000-0000-000000000010'::uuid, 'https://randomuser.me/api/portraits/women/50.jpg', 'https://picsum.photos/seed/concert-golden/1200/400'),
  ('a0000000-0000-0000-0000-000000000011'::uuid, 'https://randomuser.me/api/portraits/men/45.jpg',  'https://picsum.photos/seed/soccer-stadium/1200/400'),
  ('a0000000-0000-0000-0000-000000000012'::uuid, 'https://randomuser.me/api/portraits/men/36.jpg',  'https://picsum.photos/seed/miami-beach-sunset/1200/400'),
  ('a0000000-0000-0000-0000-000000000013'::uuid, 'https://randomuser.me/api/portraits/men/47.jpg',  'https://picsum.photos/seed/basketball-court/1200/400'),
  ('a0000000-0000-0000-0000-000000000014'::uuid, 'https://randomuser.me/api/portraits/women/60.jpg', 'https://picsum.photos/seed/studio-purple/1200/400'),
  ('a0000000-0000-0000-0000-000000000015'::uuid, 'https://randomuser.me/api/portraits/men/68.jpg',  'https://picsum.photos/seed/tech-innovation/1200/400'),
  ('a0000000-0000-0000-0000-000000000016'::uuid, 'https://randomuser.me/api/portraits/men/69.jpg',  'https://picsum.photos/seed/rocket-sky/1200/400'),
  ('a0000000-0000-0000-0000-000000000017'::uuid, 'https://randomuser.me/api/portraits/men/10.jpg',  'https://picsum.photos/seed/meta-campus/1200/400'),
  ('a0000000-0000-0000-0000-000000000018'::uuid, 'https://randomuser.me/api/portraits/women/7.jpg',  'https://picsum.photos/seed/fashion-runway/1200/400'),
  ('a0000000-0000-0000-0000-000000000019'::uuid, 'https://randomuser.me/api/portraits/women/8.jpg',  'https://picsum.photos/seed/rare-beauty-pink/1200/400'),
  ('a0000000-0000-0000-0000-000000000020'::uuid, 'https://randomuser.me/api/portraits/men/11.jpg',  'https://picsum.photos/seed/music-recording/1200/400'),
  ('a0000000-0000-0000-0000-000000000021'::uuid, 'https://randomuser.me/api/portraits/men/12.jpg',  'https://picsum.photos/seed/gym-iron-dark/1200/400'),
  ('a0000000-0000-0000-0000-000000000022'::uuid, 'https://randomuser.me/api/portraits/men/13.jpg',  'https://picsum.photos/seed/comedy-stage/1200/400'),
  ('a0000000-0000-0000-0000-000000000023'::uuid, 'https://randomuser.me/api/portraits/men/14.jpg',  'https://picsum.photos/seed/chill-vibes/1200/400'),
  ('a0000000-0000-0000-0000-000000000024'::uuid, 'https://randomuser.me/api/portraits/men/15.jpg',  'https://picsum.photos/seed/brazil-football/1200/400'),
  ('a0000000-0000-0000-0000-000000000025'::uuid, 'https://randomuser.me/api/portraits/women/9.jpg',  'https://picsum.photos/seed/neon-stage/1200/400'),
  ('a0000000-0000-0000-0000-000000000026'::uuid, 'https://randomuser.me/api/portraits/women/10.jpg', 'https://picsum.photos/seed/glamour-lights/1200/400'),
  ('a0000000-0000-0000-0000-000000000027'::uuid, 'https://randomuser.me/api/portraits/women/11.jpg', 'https://picsum.photos/seed/pink-clouds/1200/400'),
  ('a0000000-0000-0000-0000-000000000028'::uuid, 'https://randomuser.me/api/portraits/men/16.jpg',  'https://picsum.photos/seed/spiderman-city/1200/400'),
  ('a0000000-0000-0000-0000-000000000029'::uuid, 'https://randomuser.me/api/portraits/women/12.jpg', 'https://picsum.photos/seed/fashion-editorial/1200/400'),
  ('a0000000-0000-0000-0000-000000000030'::uuid, 'https://randomuser.me/api/portraits/men/17.jpg',  'https://picsum.photos/seed/skydiving-sky/1200/400'),
  ('a0000000-0000-0000-0000-000000000031'::uuid, 'https://randomuser.me/api/portraits/men/18.jpg',  'https://picsum.photos/seed/apple-minimal/1200/400'),
  ('a0000000-0000-0000-0000-000000000032'::uuid, 'https://api.dicebear.com/7.x/shapes/svg?seed=NASA&backgroundColor=0B3D91',     'https://picsum.photos/seed/nasa-galaxy/1200/400'),
  ('a0000000-0000-0000-0000-000000000033'::uuid, 'https://randomuser.me/api/portraits/women/13.jpg', 'https://picsum.photos/seed/dancing-fun/1200/400'),
  ('a0000000-0000-0000-0000-000000000034'::uuid, 'https://randomuser.me/api/portraits/men/19.jpg',  'https://picsum.photos/seed/rock-guitar/1200/400'),
  ('a0000000-0000-0000-0000-000000000035'::uuid, 'https://randomuser.me/api/portraits/men/20.jpg',  'https://picsum.photos/seed/wrexham-soccer/1200/400'),
  ('a0000000-0000-0000-0000-000000000036'::uuid, 'https://randomuser.me/api/portraits/women/14.jpg', 'https://picsum.photos/seed/film-director/1200/400'),
  ('a0000000-0000-0000-0000-000000000037'::uuid, 'https://randomuser.me/api/portraits/men/21.jpg',  'https://picsum.photos/seed/captain-shield/1200/400'),
  ('a0000000-0000-0000-0000-000000000038'::uuid, 'https://randomuser.me/api/portraits/women/15.jpg', 'https://picsum.photos/seed/skincare-glow/1200/400'),
  ('a0000000-0000-0000-0000-000000000039'::uuid, 'https://randomuser.me/api/portraits/women/16.jpg', 'https://picsum.photos/seed/bronx-city/1200/400'),
  ('a0000000-0000-0000-0000-000000000040'::uuid, 'https://randomuser.me/api/portraits/women/17.jpg', 'https://picsum.photos/seed/colombia-colors/1200/400'),
  ('a0000000-0000-0000-0000-000000000041'::uuid, 'https://randomuser.me/api/portraits/men/23.jpg',  'https://picsum.photos/seed/cricket-stadium/1200/400'),
  ('a0000000-0000-0000-0000-000000000042'::uuid, 'https://randomuser.me/api/portraits/men/24.jpg',  'https://picsum.photos/seed/cricket-field/1200/400'),
  ('a0000000-0000-0000-0000-000000000043'::uuid, 'https://randomuser.me/api/portraits/women/18.jpg', 'https://picsum.photos/seed/riri-fenty/1200/400'),
  ('a0000000-0000-0000-0000-000000000044'::uuid, 'https://randomuser.me/api/portraits/men/25.jpg',  'https://picsum.photos/seed/youtube-creator/1200/400'),
  ('a0000000-0000-0000-0000-000000000045'::uuid, 'https://randomuser.me/api/portraits/men/26.jpg',  'https://picsum.photos/seed/gaming-setup/1200/400'),
  ('a0000000-0000-0000-0000-000000000046'::uuid, 'https://randomuser.me/api/portraits/women/19.jpg', 'https://picsum.photos/seed/good-american/1200/400'),
  ('a0000000-0000-0000-0000-000000000047'::uuid, 'https://randomuser.me/api/portraits/women/20.jpg', 'https://picsum.photos/seed/kylie-cosmetics/1200/400'),
  ('a0000000-0000-0000-0000-000000000048'::uuid, 'https://randomuser.me/api/portraits/men/27.jpg',  'https://picsum.photos/seed/hope-change/1200/400'),
  ('a0000000-0000-0000-0000-000000000049'::uuid, 'https://randomuser.me/api/portraits/women/21.jpg', 'https://picsum.photos/seed/becoming-light/1200/400'),
  ('a0000000-0000-0000-0000-000000000050'::uuid, 'https://randomuser.me/api/portraits/men/28.jpg',  'https://picsum.photos/seed/vegas-lights/1200/400'),
  ('a0000000-0000-0000-0000-000000000051'::uuid, 'https://randomuser.me/api/portraits/women/22.jpg', 'https://picsum.photos/seed/bronx-graffiti/1200/400'),
  ('a0000000-0000-0000-0000-000000000052'::uuid, 'https://randomuser.me/api/portraits/men/29.jpg',  'https://picsum.photos/seed/utopia-dark/1200/400'),
  ('a0000000-0000-0000-0000-000000000053'::uuid, 'https://randomuser.me/api/portraits/women/23.jpg', 'https://picsum.photos/seed/self-love-colors/1200/400'),
  ('a0000000-0000-0000-0000-000000000054'::uuid, 'https://randomuser.me/api/portraits/men/30.jpg',  'https://picsum.photos/seed/country-road/1200/400'),
  ('a0000000-0000-0000-0000-000000000055'::uuid, 'https://randomuser.me/api/portraits/women/24.jpg', 'https://picsum.photos/seed/green-planet/1200/400'),
  ('a0000000-0000-0000-0000-000000000056'::uuid, 'https://randomuser.me/api/portraits/men/31.jpg',  'https://picsum.photos/seed/oval-office/1200/400')
)
UPDATE profiles p
SET avatar = cm.new_avatar, cover_image = cm.new_cover
FROM celeb_media cm
WHERE p.id = cm.uid;

-- 3. Add media images to select posts (matching by author + content pattern)
-- Space & Tech
UPDATE posts SET media = '[{"id":"m1","type":"image","url":"https://picsum.photos/seed/starship-launch/800/600","alt":"Starship launch"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000001' AND content LIKE '%Starship Flight 7%';

UPDATE posts SET media = '[{"id":"m2","type":"image","url":"https://picsum.photos/seed/robotaxi-austin/800/600","alt":"Tesla Robotaxi in Austin"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000001' AND content LIKE '%Tesla Robotaxi%';

UPDATE posts SET media = '[{"id":"m3","type":"image","url":"https://picsum.photos/seed/neuralink-chip/800/600","alt":"Neuralink facility"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000001' AND content LIKE '%Neuralink%';

-- NASA
UPDATE posts SET media = '[{"id":"m4","type":"image","url":"https://picsum.photos/seed/artemis-moon-landing/800/600","alt":"Artemis IV lunar south pole"},{"id":"m5","type":"image","url":"https://picsum.photos/seed/moon-ice-sample/800/600","alt":"Lunar water ice samples"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000032' AND content LIKE '%Artemis IV%';

UPDATE posts SET media = '[{"id":"m6","type":"image","url":"https://picsum.photos/seed/jwst-exoplanet/800/600","alt":"JWST exoplanet image"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000032' AND content LIKE '%James Webb%';

-- Sports
UPDATE posts SET media = '[{"id":"m7","type":"image","url":"https://picsum.photos/seed/ronaldo-hattrick/800/600","alt":"Cristiano Ronaldo celebration"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000011' AND content LIKE '%920 career goals%';

UPDATE posts SET media = '[{"id":"m8","type":"image","url":"https://picsum.photos/seed/messi-miami/800/600","alt":"Messi Miami celebration"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000012' AND content LIKE '%Beautiful night in Miami%';

UPDATE posts SET media = '[{"id":"m9","type":"image","url":"https://picsum.photos/seed/lebron-dunk/800/600","alt":"LeBron James action shot"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000013' AND content LIKE '%Year 24 in the NBA%';

UPDATE posts SET media = '[{"id":"m10","type":"image","url":"https://picsum.photos/seed/promise-school/800/600","alt":"I Promise School graduates"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000013' AND content LIKE '%I Promise School%';

UPDATE posts SET media = '[{"id":"m11","type":"image","url":"https://picsum.photos/seed/virat-century/800/600","alt":"Virat Kohli century celebration"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000042' AND content LIKE '%Century number 82%';

UPDATE posts SET media = '[{"id":"m12","type":"image","url":"https://picsum.photos/seed/dhoni-csk/800/600","alt":"CSK stadium atmosphere"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000041' AND content LIKE '%CSK forever%';

UPDATE posts SET media = '[{"id":"m27","type":"image","url":"https://picsum.photos/seed/neymar-comeback/800/600","alt":"Neymar back on the pitch"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000024' AND content LIKE '%Back on the pitch%';

-- Music & Entertainment
UPDATE posts SET media = '[{"id":"m13","type":"image","url":"https://picsum.photos/seed/eras-tour-crowd/800/600","alt":"Eras Tour crowd"},{"id":"m14","type":"image","url":"https://picsum.photos/seed/eras-tour-stage/800/600","alt":"Eras Tour stage"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000009' AND content LIKE '%Eras Tour%';

UPDATE posts SET media = '[{"id":"m15","type":"image","url":"https://picsum.photos/seed/cowboy-carter-vinyl/800/600","alt":"Cowboy Carter vinyl"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000010' AND content LIKE '%COWBOY CARTER%';

UPDATE posts SET media = '[{"id":"m16","type":"image","url":"https://picsum.photos/seed/fenty-summer-shades/800/600","alt":"Fenty Beauty summer collection"},{"id":"m17","type":"image","url":"https://picsum.photos/seed/fenty-lipstick/800/600","alt":"Fenty Beauty shades"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000007' AND content LIKE '%summer collection%';

UPDATE posts SET media = '[{"id":"m18","type":"image","url":"https://picsum.photos/seed/ariana-eternal/800/600","alt":"Eternal Sunshine deluxe artwork"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000027' AND content LIKE '%eternal sunshine%';

UPDATE posts SET media = '[{"id":"m28","type":"image","url":"https://picsum.photos/seed/vegas-residency/800/600","alt":"Bruno Mars Vegas show"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000050' AND content LIKE '%Vegas residency%';

UPDATE posts SET media = '[{"id":"m29","type":"image","url":"https://picsum.photos/seed/tokyo-concert/800/600","alt":"Concert in Tokyo"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000025' AND content LIKE '%Tokyo tonight%';

UPDATE posts SET media = '[{"id":"m30","type":"image","url":"https://picsum.photos/seed/shakira-tour/800/600","alt":"Shakira world tour"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000040' AND content LIKE '%world tour%';

-- Fitness & Lifestyle
UPDATE posts SET media = '[{"id":"m19","type":"image","url":"https://picsum.photos/seed/iron-paradise-gym/800/600","alt":"Iron Paradise gym at 4:30 AM"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000021' AND content LIKE '%4:30 AM%';

UPDATE posts SET media = '[{"id":"m20","type":"image","url":"https://picsum.photos/seed/zuck-deadlift/800/600","alt":"Deadlift training"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000017' AND content LIKE '%deadlift%';

UPDATE posts SET media = '[{"id":"m31","type":"image","url":"https://picsum.photos/seed/skydiving-view/800/600","alt":"Skydiving view"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000030' AND content LIKE '%skydiving%';

-- Business & Impact
UPDATE posts SET media = '[{"id":"m21","type":"image","url":"https://picsum.photos/seed/mrbeast-homes/800/600","alt":"100 homes built"},{"id":"m22","type":"image","url":"https://picsum.photos/seed/mrbeast-families/800/600","alt":"Families receiving homes"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000044' AND content LIKE '%100 homes%';

UPDATE posts SET media = '[{"id":"m23","type":"image","url":"https://picsum.photos/seed/rare-beauty-billion/800/600","alt":"Rare Beauty milestone"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000019' AND content LIKE '%$1 billion%';

UPDATE posts SET media = '[{"id":"m24","type":"image","url":"https://picsum.photos/seed/skims-paris/800/600","alt":"SKIMS Paris flagship"},{"id":"m25","type":"image","url":"https://picsum.photos/seed/skims-store-interior/800/600","alt":"SKIMS store interior"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000018' AND content LIKE '%SKIMS%';

UPDATE posts SET media = '[{"id":"m26","type":"image","url":"https://picsum.photos/seed/ctaop-gala/800/600","alt":"CTAOP annual gala"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000006' AND content LIKE '%CTAOP%';

UPDATE posts SET media = '[{"id":"m32","type":"image","url":"https://picsum.photos/seed/apple-vision-pro2/800/600","alt":"Apple Vision Pro 2"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000031' AND content LIKE '%Vision Pro 2%';

UPDATE posts SET media = '[{"id":"m33","type":"image","url":"https://picsum.photos/seed/blue-origin-rocket/800/600","alt":"Blue Origin New Glenn landing"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000016' AND content LIKE '%Blue Origin%';

UPDATE posts SET media = '[{"id":"m34","type":"image","url":"https://picsum.photos/seed/wrexham-promotion/800/600","alt":"Wrexham promotion celebration"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000035' AND content LIKE '%Wrexham%';

UPDATE posts SET media = '[{"id":"m35","type":"image","url":"https://picsum.photos/seed/khy-denim/800/600","alt":"Khy sustainable denim"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000047' AND content LIKE '%Khy%';

UPDATE posts SET media = '[{"id":"m36","type":"image","url":"https://picsum.photos/seed/garden-blooming/800/600","alt":"Beautiful blooming garden"}]'::jsonb
WHERE author_id = 'a0000000-0000-0000-0000-000000000004' AND content LIKE '%garden is finally%';

-- Verification
SELECT 'Updated ' || COUNT(*) || ' profiles with avatars and covers' FROM profiles WHERE cover_image != '' AND cover_image IS NOT NULL;
SELECT 'Posts with media: ' || COUNT(*) FROM posts WHERE media != '[]'::jsonb AND media IS NOT NULL AND jsonb_array_length(media) > 0;
