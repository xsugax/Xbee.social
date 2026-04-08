-- ============================================================
-- XBEE SOCIAL — Real Celebrity Avatars + Massive Content Expansion
-- Run this in your Supabase SQL Editor
-- ============================================================
-- Uses unavatar.io/x/{handle} for real X profile pictures
-- Adds 200+ new posts with professional, realistic content

-- ========== STEP 1: Update all celebrity avatars to real X profile pictures ==========
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/elonmusk' WHERE id = 'a0000000-0000-0000-0000-000000000001';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/realDonaldTrump' WHERE id = 'a0000000-0000-0000-0000-000000000002';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/WhiteHouse' WHERE id = 'a0000000-0000-0000-0000-000000000003';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/salmahayek', username = 'salmahayek' WHERE id = 'a0000000-0000-0000-0000-000000000004';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/KeanuReeves', username = 'KeanuReeves' WHERE id = 'a0000000-0000-0000-0000-000000000005';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/CharlizeAfrica' WHERE id = 'a0000000-0000-0000-0000-000000000006';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/rihanna', username = 'rihanna' WHERE id = 'a0000000-0000-0000-0000-000000000007';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/Drake' WHERE id = 'a0000000-0000-0000-0000-000000000008';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/taylorswift13' WHERE id = 'a0000000-0000-0000-0000-000000000009';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/Beyonce' WHERE id = 'a0000000-0000-0000-0000-000000000010';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/Cristiano' WHERE id = 'a0000000-0000-0000-0000-000000000011';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/TeamMessi' WHERE id = 'a0000000-0000-0000-0000-000000000012';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/KingJames' WHERE id = 'a0000000-0000-0000-0000-000000000013';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/Oprah' WHERE id = 'a0000000-0000-0000-0000-000000000014';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/BillGates' WHERE id = 'a0000000-0000-0000-0000-000000000015';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/JeffBezos' WHERE id = 'a0000000-0000-0000-0000-000000000016';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/finkd', username = 'finkd' WHERE id = 'a0000000-0000-0000-0000-000000000017';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/KimKardashian' WHERE id = 'a0000000-0000-0000-0000-000000000018';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/selenagomez' WHERE id = 'a0000000-0000-0000-0000-000000000019';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/justinbieber' WHERE id = 'a0000000-0000-0000-0000-000000000020';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/TheRock' WHERE id = 'a0000000-0000-0000-0000-000000000021';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/KevinHart4real' WHERE id = 'a0000000-0000-0000-0000-000000000022';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/SnoopDogg' WHERE id = 'a0000000-0000-0000-0000-000000000023';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/neymarjr', username = 'naboreal' WHERE id = 'a0000000-0000-0000-0000-000000000024';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/katyperry' WHERE id = 'a0000000-0000-0000-0000-000000000025';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/ladygaga' WHERE id = 'a0000000-0000-0000-0000-000000000026';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/ArianaGrande' WHERE id = 'a0000000-0000-0000-0000-000000000027';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/TomHolland1996' WHERE id = 'a0000000-0000-0000-0000-000000000028';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/Zendaya' WHERE id = 'a0000000-0000-0000-0000-000000000029';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/WillSmith' WHERE id = 'a0000000-0000-0000-0000-000000000030';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/tim_cook', username = 'tim_cook' WHERE id = 'a0000000-0000-0000-0000-000000000031';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/NASA' WHERE id = 'a0000000-0000-0000-0000-000000000032';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/TheEllenShow' WHERE id = 'a0000000-0000-0000-0000-000000000033';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/jackblack' WHERE id = 'a0000000-0000-0000-0000-000000000034';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/VancityReynolds' WHERE id = 'a0000000-0000-0000-0000-000000000035';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/MargotRobbie' WHERE id = 'a0000000-0000-0000-0000-000000000036';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/ChrisEvans' WHERE id = 'a0000000-0000-0000-0000-000000000037';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/ScarlettJo' WHERE id = 'a0000000-0000-0000-0000-000000000038';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/JLo' WHERE id = 'a0000000-0000-0000-0000-000000000039';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/shakira' WHERE id = 'a0000000-0000-0000-0000-000000000040';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/msdhoni' WHERE id = 'a0000000-0000-0000-0000-000000000041';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/imVkohli' WHERE id = 'a0000000-0000-0000-0000-000000000042';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/badgalriri' WHERE id = 'a0000000-0000-0000-0000-000000000043';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/MrBeast' WHERE id = 'a0000000-0000-0000-0000-000000000044';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/pewdiepie' WHERE id = 'a0000000-0000-0000-0000-000000000045';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/khloekardashian' WHERE id = 'a0000000-0000-0000-0000-000000000046';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/KylieJenner' WHERE id = 'a0000000-0000-0000-0000-000000000047';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/BarackObama' WHERE id = 'a0000000-0000-0000-0000-000000000048';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/MichelleObama' WHERE id = 'a0000000-0000-0000-0000-000000000049';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/BrunoMars' WHERE id = 'a0000000-0000-0000-0000-000000000050';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/iamcardib' WHERE id = 'a0000000-0000-0000-0000-000000000051';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/traboreal' WHERE id = 'a0000000-0000-0000-0000-000000000052';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/liaboreal' WHERE id = 'a0000000-0000-0000-0000-000000000053';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/PostMalone' WHERE id = 'a0000000-0000-0000-0000-000000000054';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/billieeilish' WHERE id = 'a0000000-0000-0000-0000-000000000055';
UPDATE public.profiles SET avatar = 'https://unavatar.io/x/JoeBiden' WHERE id = 'a0000000-0000-0000-0000-000000000056';

-- ========== STEP 2: Massive content expansion — 200+ new posts ==========
-- Realistic posts that match each celebrity's voice and style

DO $$
DECLARE
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
  id_mrbeast        UUID := 'a0000000-0000-0000-0000-000000000044';
  id_pewdiepie      UUID := 'a0000000-0000-0000-0000-000000000045';
  id_khloek         UUID := 'a0000000-0000-0000-0000-000000000046';
  id_kyliejenner    UUID := 'a0000000-0000-0000-0000-000000000047';
  id_barackobama    UUID := 'a0000000-0000-0000-0000-000000000048';
  id_michelleobama  UUID := 'a0000000-0000-0000-0000-000000000049';
  id_brunomars      UUID := 'a0000000-0000-0000-0000-000000000050';
  id_cardi          UUID := 'a0000000-0000-0000-0000-000000000051';
  id_travisscott    UUID := 'a0000000-0000-0000-0000-000000000052';
  id_postmalone     UUID := 'a0000000-0000-0000-0000-000000000054';
  id_billieeilish   UUID := 'a0000000-0000-0000-0000-000000000055';
  id_joebiden       UUID := 'a0000000-0000-0000-0000-000000000056';
BEGIN

-- ===== ELON MUSK — Tech/Space/Vision =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_elonmusk, 'Starship''s 7th test flight achieved full orbital velocity. The heat shield performed flawlessly. Mars is getting closer every day.', 892000, 124000, 45000, 89000000, NOW() - INTERVAL '2 hours'),
(gen_random_uuid(), id_elonmusk, 'Just visited the Gigafactory. Production line efficiency is up 40% from last quarter. The team never stops optimizing.', 234000, 31000, 12000, 34000000, NOW() - INTERVAL '6 hours'),
(gen_random_uuid(), id_elonmusk, 'FSD v13.2 rolling out tonight. The neural net now handles roundabouts in Europe perfectly. Been testing it myself all week.', 567000, 89000, 34000, 67000000, NOW() - INTERVAL '14 hours'),
(gen_random_uuid(), id_elonmusk, 'Neuralink patient #3 just typed 120 words per minute using only thought. This technology will change humanity forever.', 1200000, 198000, 67000, 120000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_elonmusk, 'The Boring Company just completed the Vegas Loop expansion. 68 stations, 0 accidents, avg speed 155mph underground.', 345000, 45000, 18000, 42000000, NOW() - INTERVAL '2 days'),
(gen_random_uuid(), id_elonmusk, 'People don''t realize how close we are to AGI. Within 2 years, Grok will be smarter than any single human in every domain.', 780000, 134000, 89000, 95000000, NOW() - INTERVAL '3 days'),
(gen_random_uuid(), id_elonmusk, 'Optimus robots are now building other Optimus robots in the factory. The recursive self-improvement loop has begun.', 650000, 98000, 45000, 78000000, NOW() - INTERVAL '4 days'),
(gen_random_uuid(), id_elonmusk, 'xAI just released Grok-3. It wrote a physics paper that was peer-reviewed and accepted. The future of research is AI-augmented.', 890000, 156000, 56000, 102000000, NOW() - INTERVAL '5 days');

-- ===== DONALD TRUMP =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_trump, 'Incredible rally in Pennsylvania tonight! 85,000 patriots showed up. The movement is STRONGER than ever. MAGA!', 1200000, 234000, 89000, 145000000, NOW() - INTERVAL '3 hours'),
(gen_random_uuid(), id_trump, 'Just signed the biggest trade deal in American history. Other countries are finally paying their fair share. America FIRST!', 980000, 178000, 67000, 112000000, NOW() - INTERVAL '8 hours'),
(gen_random_uuid(), id_trump, 'The economy is BOOMING. Stock market at all-time highs. Unemployment at record lows. We are making America great again!', 876000, 156000, 78000, 98000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_trump, 'Thank you to all the incredible men and women in uniform. Our military has NEVER been stronger. God bless our troops!', 1100000, 198000, 45000, 134000000, NOW() - INTERVAL '2 days'),
(gen_random_uuid(), id_trump, 'Just had a very productive meeting. Deals are being made that will benefit the American people for GENERATIONS. Stay tuned!', 567000, 89000, 34000, 67000000, NOW() - INTERVAL '4 days');

-- ===== TAYLOR SWIFT =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_taylorswift, 'The Eras Tour has been the most magical chapter of my life. Every single one of you made this happen. I love you all so much 💕', 2300000, 456000, 123000, 234000000, NOW() - INTERVAL '1 hour'),
(gen_random_uuid(), id_taylorswift, 'Just finished recording something I''ve been dreaming about for years. Can''t wait for you to hear it. This one''s different.', 1890000, 345000, 98000, 189000000, NOW() - INTERVAL '5 hours'),
(gen_random_uuid(), id_taylorswift, 'Nothing makes me happier than seeing friendship bracelets from the Eras Tour still being traded years later. That community you built is everything.', 1200000, 234000, 67000, 134000000, NOW() - INTERVAL '12 hours'),
(gen_random_uuid(), id_taylorswift, 'Wrote three songs today. Sometimes the words just pour out and you have to chase them before they disappear. One of those days.', 987000, 178000, 56000, 112000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_taylorswift, 'To the girl who held up the sign that said "you taught me to be brave" — YOU are the brave one. Never forget that.', 1560000, 289000, 78000, 167000000, NOW() - INTERVAL '2 days'),
(gen_random_uuid(), id_taylorswift, 'Late night in the studio. The cats are judging my lyrics. Meredith just walked across the keyboard and honestly, her contribution was solid.', 890000, 167000, 89000, 98000000, NOW() - INTERVAL '3 days');

-- ===== CRISTIANO RONALDO =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_cristiano, 'Hat trick today. 900 career goals. I''m not done yet. The best is yet to come. SIUUUUU! ⚽🔥', 3400000, 567000, 234000, 345000000, NOW() - INTERVAL '2 hours'),
(gen_random_uuid(), id_cristiano, 'Hard work beats talent when talent doesn''t work hard. 5am training session done. No days off.', 2100000, 345000, 123000, 234000000, NOW() - INTERVAL '7 hours'),
(gen_random_uuid(), id_cristiano, 'Thank you to all the fans around the world. Your love and support makes everything worth it. We go again! 💪', 1800000, 289000, 89000, 198000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_cristiano, 'Age is just a number. At 41, I feel stronger than ever. The secret? Discipline, dedication, and never accepting mediocrity.', 2500000, 456000, 167000, 278000000, NOW() - INTERVAL '2 days'),
(gen_random_uuid(), id_cristiano, 'Family time is the most important time. Nothing in the world matters more than these moments. ❤️', 1900000, 312000, 98000, 212000000, NOW() - INTERVAL '3 days');

-- ===== BEYONCE =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_beyonce, 'RENAISSANCE World Tour just hit 1 billion in revenue. Every show was a celebration of Black excellence. Thank you for riding with me.', 2800000, 478000, 156000, 298000000, NOW() - INTERVAL '4 hours'),
(gen_random_uuid(), id_beyonce, 'The new album is almost ready. I''ve been exploring sounds that don''t have names yet. Art with no boundaries.', 2100000, 389000, 123000, 234000000, NOW() - INTERVAL '10 hours'),
(gen_random_uuid(), id_beyonce, 'To every little girl who sees herself in me — you are THE standard. Don''t let anyone dim your light.', 1700000, 298000, 89000, 189000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_beyonce, 'Just wrapped a 14-hour rehearsal. The dancers were INCREDIBLE tonight. When the energy is right, you can feel it in your bones.', 1200000, 234000, 67000, 145000000, NOW() - INTERVAL '3 days');

-- ===== DWAYNE "THE ROCK" JOHNSON =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_therock, '4:30 AM. Iron therapy. The clanking of weights is the only alarm clock I need. Let''s get after it! 💪🏽', 1200000, 198000, 56000, 134000000, NOW() - INTERVAL '3 hours'),
(gen_random_uuid(), id_therock, 'Cheat meal Sunday: 4 double cheeseburgers, 2 large pizzas, a dozen donuts, and a pint of ice cream. I regret nothing. 🍕', 890000, 156000, 89000, 98000000, NOW() - INTERVAL '9 hours'),
(gen_random_uuid(), id_therock, 'Just wrapped principal photography on the new film. This one is going to blow your minds. The most physically demanding role of my career.', 678000, 112000, 45000, 78000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_therock, 'Remember — success isn''t overnight. I got cut from the CFL. I had $7 in my pocket. Stay hungry, stay humble, stay grinding.', 1500000, 267000, 78000, 167000000, NOW() - INTERVAL '2 days'),
(gen_random_uuid(), id_therock, 'Tequila update: Teremana just passed 2 billion in lifetime sales. Started this brand from scratch. Mana in every bottle. 🥃', 567000, 89000, 34000, 67000000, NOW() - INTERVAL '4 days');

-- ===== DRAKE =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_drake, 'The boy is back. New album drops midnight. 22 songs. No features. Just me and the music. 🦉', 1800000, 345000, 123000, 198000000, NOW() - INTERVAL '1 hour'),
(gen_random_uuid(), id_drake, 'Toronto will always be home. Just donated $5M to rebuild community centers across the city. The 6ix raised me, time to give back.', 980000, 178000, 67000, 112000000, NOW() - INTERVAL '8 hours'),
(gen_random_uuid(), id_drake, 'Late night in the studio. The vibe is unmatched right now. Sometimes you just gotta trust the process and let the music speak.', 670000, 112000, 45000, 78000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_drake, 'Certified Lover Boy was just the beginning. What''s coming next will redefine what people think they know about me.', 1200000, 234000, 89000, 134000000, NOW() - INTERVAL '3 days'),
(gen_random_uuid(), id_drake, 'My son made me a Father''s Day card that says "best dad in the world." That''s the only award I need.', 1560000, 289000, 78000, 167000000, NOW() - INTERVAL '5 days');

-- ===== BILL GATES =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_billgates, 'Just visited a lab in Nairobi where they''re using AI to diagnose malaria from a phone camera. The accuracy rate: 97.3%. This is what innovation looks like.', 456000, 78000, 34000, 56000000, NOW() - INTERVAL '4 hours'),
(gen_random_uuid(), id_billgates, 'My annual letter is live. This year''s focus: how AI will transform education in developing nations within 5 years. Link in bio.', 345000, 67000, 23000, 45000000, NOW() - INTERVAL '12 hours'),
(gen_random_uuid(), id_billgates, 'Finished reading "The Song of the Cell" by Siddhartha Mukherjee. Brilliant exploration of biology''s fundamental unit. Highly recommend.', 234000, 45000, 18000, 34000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_billgates, 'Climate tech investment has tripled since 2020. We''re finally seeing nuclear fusion, green hydrogen, and carbon capture reach commercial scale.', 456000, 89000, 34000, 56000000, NOW() - INTERVAL '2 days'),
(gen_random_uuid(), id_billgates, 'The Gates Foundation just committed $2.4B to global health this year. Polio eradication is within reach. We cannot stop now.', 567000, 98000, 45000, 67000000, NOW() - INTERVAL '4 days');

-- ===== KIM KARDASHIAN =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_kimk, 'SKIMS just opened our first flagship store in Tokyo. The line wrapped around the block twice. So grateful for this global family 🫶', 890000, 156000, 67000, 98000000, NOW() - INTERVAL '2 hours'),
(gen_random_uuid(), id_kimk, 'Passed another law school exam today. The journey to becoming a lawyer has been the hardest and most rewarding thing I''ve ever done.', 1200000, 234000, 89000, 134000000, NOW() - INTERVAL '7 hours'),
(gen_random_uuid(), id_kimk, 'New SKKN drop this Friday. We spent 18 months perfecting this formula. Clean ingredients, real results.', 567000, 89000, 45000, 67000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_kimk, 'Successfully helped get 42 wrongfully incarcerated people released. This criminal justice work is my purpose. We''re just getting started.', 1500000, 289000, 78000, 167000000, NOW() - INTERVAL '3 days'),
(gen_random_uuid(), id_kimk, 'Sunday morning with the kids. North just beat me at chess for the third time in a row. She''s terrifyingly smart. 😂', 780000, 134000, 56000, 89000000, NOW() - INTERVAL '5 days');

-- ===== SELENA GOMEZ =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_selenagomez, 'Rare Beauty just surpassed $1 billion in sales. Every purchase supports the Rare Impact Fund for mental health. You did this 💜', 1800000, 345000, 123000, 198000000, NOW() - INTERVAL '3 hours'),
(gen_random_uuid(), id_selenagomez, 'Filming Only Murders season 5 and I can''t stop laughing. Steve and Martin are national treasures. I learn from them every day.', 980000, 178000, 67000, 112000000, NOW() - INTERVAL '9 hours'),
(gen_random_uuid(), id_selenagomez, 'Mental health check-in: It''s okay to not be okay. I still have hard days. But asking for help is the bravest thing you can do.', 2100000, 389000, 156000, 234000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_selenagomez, 'Just finished cooking a new recipe for Selena + Chef. Made the most amazing pozole. My Tia would be proud. 🍲', 670000, 112000, 45000, 78000000, NOW() - INTERVAL '2 days'),
(gen_random_uuid(), id_selenagomez, 'Grateful for every single one of you. This community saved my life. I mean that literally. 💕', 1560000, 289000, 89000, 167000000, NOW() - INTERVAL '4 days');

-- ===== LEBRON JAMES =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_lebron, 'Year 22. Still averaging a triple-double. They said Father Time is undefeated. I''m built different. 👑', 2100000, 389000, 156000, 234000000, NOW() - INTERVAL '2 hours'),
(gen_random_uuid(), id_lebron, 'Just opened the 5th I PROMISE School. Education changes everything. Every kid deserves a chance to dream.', 1500000, 267000, 89000, 167000000, NOW() - INTERVAL '8 hours'),
(gen_random_uuid(), id_lebron, 'Watching film at 1am. The game never stops. The moment you think you''ve figured it out is the moment you start losing.', 890000, 156000, 56000, 98000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_lebron, 'Playing alongside Bronny is a dream I never thought would come true. Father and son on the same court. Nothing tops this.', 2800000, 478000, 198000, 298000000, NOW() - INTERVAL '3 days'),
(gen_random_uuid(), id_lebron, 'SpringHill is producing 14 films this year. From Akron to Hollywood. The kid from nothing became everything. Don''t let anyone tell you what you can''t be.', 1200000, 234000, 67000, 134000000, NOW() - INTERVAL '5 days');

-- ===== OPRAH =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_oprah, 'Today''s intention: Lead with compassion. The world doesn''t need more critics — it needs more people willing to understand before they judge.', 890000, 156000, 67000, 98000000, NOW() - INTERVAL '4 hours'),
(gen_random_uuid(), id_oprah, 'Oprah''s Book Club pick for Spring: this novel shattered me and rebuilt me in 300 pages. Announcement coming tomorrow.', 567000, 98000, 45000, 67000000, NOW() - INTERVAL '10 hours'),
(gen_random_uuid(), id_oprah, 'Had the most incredible conversation with a woman who started a literacy program in rural Mississippi. THIS is what changes generational cycles.', 780000, 134000, 56000, 89000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_oprah, 'What I know for sure: Your life is speaking to you all the time. The question is — are you listening?', 1200000, 234000, 89000, 134000000, NOW() - INTERVAL '3 days');

-- ===== MARK ZUCKERBERG =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_markz, 'Meta AI is now the most-used AI assistant in the world with 700M monthly users. Open source wins. Always has.', 567000, 98000, 45000, 67000000, NOW() - INTERVAL '5 hours'),
(gen_random_uuid(), id_markz, 'Llama 4 benchmarks are in. It outperforms every closed model on every benchmark. And it''s free. That''s the whole point.', 890000, 156000, 67000, 98000000, NOW() - INTERVAL '11 hours'),
(gen_random_uuid(), id_markz, 'Mixed reality is the future of work. Had my entire Monday morning meetings in VR. Zero commute, infinite whiteboards, spatial computing is real.', 345000, 67000, 34000, 45000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_markz, 'Just finished a jiu-jitsu tournament. Got submitted twice but won three matches. The mat doesn''t care about your net worth. Humbling and beautiful.', 456000, 89000, 45000, 56000000, NOW() - INTERVAL '2 days'),
(gen_random_uuid(), id_markz, 'Threads just crossed 300M daily active users. Turns out people wanted a text-based social network built on openness and interoperability.', 670000, 112000, 56000, 78000000, NOW() - INTERVAL '4 days');

-- ===== RIHANNA =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_rihanna, 'Fenty Beauty just launched in 12 new countries. Beauty is universal. Every shade matters. Every skin tone deserves to feel seen. 💄', 1800000, 345000, 123000, 198000000, NOW() - INTERVAL '3 hours'),
(gen_random_uuid(), id_rihanna, 'New music? Baby, when God is done cooking, you''ll eat. Trust the process. 😏', 2800000, 478000, 234000, 298000000, NOW() - INTERVAL '8 hours'),
(gen_random_uuid(), id_rihanna, 'Savage X Fenty show was OTHERWORLDLY last night. The future of fashion is inclusive, fierce, and unapologetic.', 1200000, 234000, 89000, 134000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_rihanna, 'Being a mom changed everything. My priorities? My boys, my brands, my Barbados. In that order. 🇧🇧', 1560000, 289000, 78000, 167000000, NOW() - INTERVAL '3 days');

-- ===== SNOOP DOGG =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_snoopdogg, 'Just cooked a 5-course meal on my cooking show. Martha taught me well. The secret ingredient is always love... and a lil bit of Snoop. 🍳', 890000, 156000, 89000, 98000000, NOW() - INTERVAL '2 hours'),
(gen_random_uuid(), id_snoopdogg, 'Olympics commentary was the highlight of my career. Watching equestrian events and providing play-by-play? I was BORN for this. 🐴', 1200000, 234000, 123000, 134000000, NOW() - INTERVAL '9 hours'),
(gen_random_uuid(), id_snoopdogg, 'Life lesson from the Dogg: Stay cool, stay real, and never let anyone steal your peace. That''s the game right there.', 670000, 112000, 56000, 78000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_snoopdogg, 'New Death Row Records drop this Friday. The West Coast sound is BACK. Fo shizzle. 🎵', 780000, 134000, 67000, 89000000, NOW() - INTERVAL '3 days');

-- ===== ARIANA GRANDE =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_arianagrande, 'Wicked changed my life. Playing Glinda taught me that vulnerability is the ultimate superpower. Grateful doesn''t begin to cover it. 💗', 2100000, 389000, 156000, 234000000, NOW() - INTERVAL '4 hours'),
(gen_random_uuid(), id_arianagrande, 'In the studio at 3am because inspiration doesn''t check the clock. New era loading... ✨', 1200000, 234000, 89000, 134000000, NOW() - INTERVAL '10 hours'),
(gen_random_uuid(), id_arianagrande, 'To my fans: you are the reason I get up every morning and choose to keep going. Your love is my oxygen. Thank you, always.', 1800000, 345000, 123000, 198000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_arianagrande, 'Voice lesson today. After 15 years, I''m still learning. The day you stop being a student is the day you stop growing as an artist.', 890000, 156000, 67000, 98000000, NOW() - INTERVAL '3 days');

-- ===== KEVIN HART =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_kevinhart, 'Sold out Madison Square Garden for the 8th time. I''m 5''2" and still the biggest thing on that stage. Let me say it louder for the people in the back! 😂', 890000, 156000, 89000, 98000000, NOW() - INTERVAL '3 hours'),
(gen_random_uuid(), id_kevinhart, 'Morning run done. 7 miles. My trainer said "great job Kevin" and I said "I know, I''m amazing." Confidence is key, people! 💪', 670000, 112000, 67000, 78000000, NOW() - INTERVAL '8 hours'),
(gen_random_uuid(), id_kevinhart, 'My kids asked me what I do for a living. I said "I make people laugh." My daughter said "That''s not a real job." This kid is RUTHLESS. 😭', 1500000, 267000, 123000, 167000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_kevinhart, 'Hart House restaurants going international. Vegan food that actually tastes good. My goal is to trick the world into eating healthy. 🌱', 456000, 78000, 34000, 56000000, NOW() - INTERVAL '2 days');

-- ===== LADY GAGA =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_ladygaga, 'Music is the only language that requires no translation. Tonight''s show in Paris reminded me why I was put on this earth. 🎤', 1500000, 267000, 89000, 167000000, NOW() - INTERVAL '2 hours'),
(gen_random_uuid(), id_ladygaga, 'Haus Labs reformulated our entire line to be 100% clean beauty. No compromises. You deserve products as bold as you are.', 670000, 112000, 45000, 78000000, NOW() - INTERVAL '9 hours'),
(gen_random_uuid(), id_ladygaga, 'To the Little Monsters: you saved a girl who didn''t believe she deserved to be saved. I will spend my life trying to give that back to you.', 2100000, 389000, 156000, 234000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_ladygaga, 'Acting in this new film pushed me to emotional places I''ve never been. Art is supposed to hurt sometimes. That''s how you know it''s real.', 890000, 156000, 56000, 98000000, NOW() - INTERVAL '3 days');

-- ===== RYAN REYNOLDS =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_ryanreynolds, 'Wrexham just won promotion to the Premier League. A Hollywood actor and a tech guy bought a Welsh football club and it ACTUALLY worked. Life is weird. ⚽', 1800000, 345000, 123000, 198000000, NOW() - INTERVAL '3 hours'),
(gen_random_uuid(), id_ryanreynolds, 'Blake told me I''m the "second most attractive person" in our house. I assume she''s counting the dog, which is fair.', 1200000, 234000, 156000, 134000000, NOW() - INTERVAL '7 hours'),
(gen_random_uuid(), id_ryanreynolds, 'Mint Mobile was acquired for $1.35 billion but I still use a cracked screen protector because I''m a man of the people.', 980000, 178000, 89000, 112000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_ryanreynolds, 'Deadpool & Wolverine broke records that weren''t even supposed to exist. Thank you for believing in the merc with a mouth. ❤️', 2100000, 389000, 134000, 234000000, NOW() - INTERVAL '3 days');

-- ===== BARACK OBAMA =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_barackobama, 'Democracy is not a spectator sport. It requires all of us — every voice, every vote, every act of service. Be the change.', 1500000, 267000, 89000, 167000000, NOW() - INTERVAL '5 hours'),
(gen_random_uuid(), id_barackobama, 'My summer reading list is up. 12 books that challenged my thinking and expanded my worldview. Hope you find something that moves you.', 890000, 156000, 67000, 98000000, NOW() - INTERVAL '12 hours'),
(gen_random_uuid(), id_barackobama, 'Visited a youth mentorship program in Chicago today. These young leaders are the reason I remain optimistic about our future.', 1200000, 234000, 78000, 134000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_barackobama, 'Michelle and I just celebrated our anniversary. She''s still the most extraordinary person I''ve ever known. I''m a lucky man.', 2100000, 389000, 123000, 234000000, NOW() - INTERVAL '3 days');

-- ===== MICHELLE OBAMA =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_michelleobama, 'When they go low, we go high. That''s not just a slogan — it''s a practice. Every single day, choose the higher path.', 1800000, 345000, 89000, 198000000, NOW() - INTERVAL '3 hours'),
(gen_random_uuid(), id_michelleobama, 'Girls'' education is the single most powerful investment we can make in the future. The data is clear. The moral case is clearer.', 1200000, 234000, 78000, 134000000, NOW() - INTERVAL '10 hours'),
(gen_random_uuid(), id_michelleobama, 'Went to the farmers market this morning. Came home with way too many heirloom tomatoes. The garden is about to be REAL productive. 🍅', 670000, 112000, 56000, 78000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_michelleobama, 'To every young person feeling lost: you are not behind. Your journey is not supposed to look like anyone else''s. Trust your timeline.', 2100000, 389000, 134000, 234000000, NOW() - INTERVAL '3 days');

-- ===== MRBEAST =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_mrbeast, 'We just gave away 500 houses to families in need. Not clickbait. Real homes. Real families. Real tears. This is what YouTube money is for. 🏠', 3400000, 567000, 234000, 345000000, NOW() - INTERVAL '2 hours'),
(gen_random_uuid(), id_mrbeast, 'New video idea: survive 100 days in the most extreme locations on Earth. Already filming episode 1. This might actually end me.', 1800000, 345000, 123000, 198000000, NOW() - INTERVAL '6 hours'),
(gen_random_uuid(), id_mrbeast, 'Feastables just passed $500M annual revenue. From a YouTube channel to a global snack brand. Dream big, execute bigger.', 1200000, 234000, 89000, 134000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_mrbeast, 'Planted our 50 millionth tree today with Team Trees. The forests are coming back. Every single donation made this happen.', 2100000, 389000, 156000, 234000000, NOW() - INTERVAL '3 days'),
(gen_random_uuid(), id_mrbeast, 'My editors are the most underrated people in the entertainment industry. They turn 400 hours of footage into 15 minutes of magic.', 890000, 156000, 67000, 98000000, NOW() - INTERVAL '5 days');

-- ===== NASA =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_nasa, 'James Webb just captured the clearest image of an exoplanet atmosphere ever recorded. We detected water vapor, methane, and CO2 — possible biosignatures. 🔭', 2800000, 478000, 198000, 298000000, NOW() - INTERVAL '1 hour'),
(gen_random_uuid(), id_nasa, 'Artemis III crew selection is complete. In 8 months, humans will walk on the Moon for the first time in over 50 years. History in the making.', 2100000, 389000, 156000, 234000000, NOW() - INTERVAL '6 hours'),
(gen_random_uuid(), id_nasa, 'Today''s Astronomy Picture of the Day: The Pillars of Creation in infrared light. Stars being born before our eyes. The universe is endlessly creative.', 1200000, 234000, 89000, 134000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_nasa, 'Mars Sample Return mission update: The first Martian soil samples are on their way to Earth. Expected arrival: March 2027. This changes everything.', 1800000, 345000, 123000, 198000000, NOW() - INTERVAL '2 days'),
(gen_random_uuid(), id_nasa, 'Fun fact: There are more stars in the observable universe than grains of sand on all of Earth''s beaches. And we''ve only explored 0.0000001% of it.', 890000, 156000, 78000, 98000000, NOW() - INTERVAL '4 days');

-- ===== TOM HOLLAND =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_tomholland, 'Spider-Man swinging through New York never gets old. 8 years in the suit and every single time still feels like the first time. 🕷️', 1500000, 267000, 89000, 167000000, NOW() - INTERVAL '4 hours'),
(gen_random_uuid(), id_tomholland, 'Taking a break from socials helped me understand who I am outside of fame. Mental health isn''t selfish — it''s survival.', 1200000, 234000, 78000, 134000000, NOW() - INTERVAL '12 hours'),
(gen_random_uuid(), id_tomholland, 'Just finished a carpentry class. Made a bookshelf. It''s slightly crooked but I''ve never been prouder of anything in my life. 🪚', 670000, 112000, 67000, 78000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_tomholland, 'The Bero non-alcoholic beer brand is growing beyond my wildest dreams. Sobriety gave me my life back and I want to normalize that choice.', 890000, 156000, 56000, 98000000, NOW() - INTERVAL '2 days');

-- ===== ZENDAYA =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_zendaya, 'Challengers was the most fun I''ve ever had on set. Playing a character that manipulative was genuinely thrilling. 🎾', 1200000, 234000, 89000, 134000000, NOW() - INTERVAL '3 hours'),
(gen_random_uuid(), id_zendaya, 'Fashion is not about following rules. It''s about breaking them with intention. Wear what makes YOUR soul feel powerful. ✨', 890000, 156000, 67000, 98000000, NOW() - INTERVAL '9 hours'),
(gen_random_uuid(), id_zendaya, 'Representation matters. Every time a young Black girl tells me she wants to act because of me, I remember why I do this.', 1800000, 345000, 123000, 198000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_zendaya, 'Self-care Sunday: face mask, good book, phone on airplane mode. Protecting my peace is non-negotiable.', 670000, 112000, 56000, 78000000, NOW() - INTERVAL '3 days');

-- ===== JEFF BEZOS =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_jeffbezos, 'Blue Origin''s New Glenn finally reached orbit. After 9 years of development, seeing that vehicle in space was one of the proudest moments of my life. 🚀', 890000, 156000, 67000, 98000000, NOW() - INTERVAL '5 hours'),
(gen_random_uuid(), id_jeffbezos, 'The best decisions I ever made were based on intuition, not data. Data tells you what is. Intuition tells you what could be.', 567000, 98000, 45000, 67000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_jeffbezos, 'Day 1 mentality: Still my guiding principle. The moment you stop thinking like a startup is the moment you begin to die. Every day is Day 1.', 780000, 134000, 56000, 89000000, NOW() - INTERVAL '2 days'),
(gen_random_uuid(), id_jeffbezos, 'The Bezos Earth Fund just pledged $1.2B for ocean conservation. We have one planet. Let''s act like it.', 1200000, 234000, 78000, 134000000, NOW() - INTERVAL '4 days');

-- ===== TIM COOK =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_timcook, 'Apple Vision Pro 2 shipping next month. The spatial computing revolution is just getting started. We''ve barely scratched the surface.', 890000, 156000, 56000, 98000000, NOW() - INTERVAL '4 hours'),
(gen_random_uuid(), id_timcook, 'Privacy is a fundamental human right. At Apple, we don''t build profiles of our users. We build products for them. There''s a difference.', 670000, 112000, 45000, 78000000, NOW() - INTERVAL '12 hours'),
(gen_random_uuid(), id_timcook, 'Apple is now carbon neutral across our entire supply chain. 300+ suppliers committed to 100% renewable energy. The planet doesn''t wait.', 567000, 98000, 34000, 67000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_timcook, 'Visited our developers in Mumbai today. The talent and creativity in India''s app economy continues to amaze me.', 456000, 78000, 34000, 56000000, NOW() - INTERVAL '3 days');

-- ===== KATY PERRY =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_katyperry, 'Vegas residency just extended for another year! You keep showing up and I''ll keep giving you the show of a lifetime. 🎪', 890000, 156000, 67000, 98000000, NOW() - INTERVAL '3 hours'),
(gen_random_uuid(), id_katyperry, 'Motherhood is the role of a lifetime. Daisy makes every sunrise feel like the first one I''ve ever seen. 💛', 1200000, 234000, 78000, 134000000, NOW() - INTERVAL '10 hours'),
(gen_random_uuid(), id_katyperry, 'New music dropping next month. This album is the most authentic thing I''ve ever made. No manufactured pop — just truth.', 670000, 112000, 56000, 78000000, NOW() - INTERVAL '1 day');

-- ===== KYLIE JENNER =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_kyliejenner, 'Kylie Cosmetics just launched our most inclusive shade range ever — 68 foundations. Finding your perfect match should never be a struggle.', 1200000, 234000, 89000, 134000000, NOW() - INTERVAL '2 hours'),
(gen_random_uuid(), id_kyliejenner, 'Stormi asked me "mommy why are you famous" and I genuinely had no answer. Kids keep you humble. 😂', 1800000, 345000, 156000, 198000000, NOW() - INTERVAL '8 hours'),
(gen_random_uuid(), id_kyliejenner, 'New Khy collection dropping this weekend. Designed every piece myself. Affordable luxury that doesn''t compromise on quality.', 670000, 112000, 45000, 78000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_kyliejenner, 'Behind every "overnight success" is a decade of work nobody saw. Started my brand at 17 and it''s been non-stop since.', 890000, 156000, 67000, 98000000, NOW() - INTERVAL '3 days');

-- ===== SHAKIRA =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_shakira, 'The hips don''t lie and neither does 30 years of making music. New world tour dates coming next week. 💃', 1500000, 267000, 89000, 167000000, NOW() - INTERVAL '3 hours'),
(gen_random_uuid(), id_shakira, 'Education is the most powerful weapon for change. My Pies Descalzos schools just graduated their 10,000th student. 📚', 890000, 156000, 67000, 98000000, NOW() - INTERVAL '10 hours'),
(gen_random_uuid(), id_shakira, 'Miami feels like home now. New chapter, new energy, new music. Life has a way of destroying you and then giving you exactly what you need.', 1200000, 234000, 89000, 134000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_shakira, 'Recorded a track in three languages today. Latin, English, and Arabic. Music knows no borders. 🌍', 670000, 112000, 56000, 78000000, NOW() - INTERVAL '3 days');

-- ===== WILL SMITH =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_willsmith, 'Redemption isn''t a destination — it''s a daily practice. Every morning I wake up and choose to be better than yesterday.', 1200000, 234000, 89000, 134000000, NOW() - INTERVAL '4 hours'),
(gen_random_uuid(), id_willsmith, 'Just finished a 20-day silent meditation retreat in India. The things I learned about myself in that silence changed everything.', 890000, 156000, 67000, 98000000, NOW() - INTERVAL '12 hours'),
(gen_random_uuid(), id_willsmith, 'New book coming this fall. It''s not a memoir — it''s a love letter to everyone who believed I could come back. And everyone who didn''t.', 1500000, 267000, 89000, 167000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_willsmith, 'My kids teach me more about life than any script ever could. Humility looks like being corrected by your teenager in public. 😅', 670000, 112000, 56000, 78000000, NOW() - INTERVAL '3 days');

-- ===== BRUNO MARS =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_brunomars, 'Vegas residency just crossed 200 shows. Every single one sold out. Vegas is my second home now. Thank you for keeping the love alive. 🎹', 1200000, 234000, 89000, 134000000, NOW() - INTERVAL '2 hours'),
(gen_random_uuid(), id_brunomars, 'Silk Sonic might have the best Grammy speech of all time but Anderson .Paak has the best laugh of all time. And that''s facts.', 890000, 156000, 89000, 98000000, NOW() - INTERVAL '9 hours'),
(gen_random_uuid(), id_brunomars, 'Wrote a song in 20 minutes today. Some days the music just flows through you like water. Other days it''s like pulling teeth. Today was water.', 670000, 112000, 56000, 78000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_brunomars, 'SelvaRey Rum is now the best-selling celebrity spirit in the world. Grandpa would be proud. 🥃', 567000, 98000, 45000, 67000000, NOW() - INTERVAL '3 days');

-- ===== CARDI B =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_cardi, 'I came from the Bronx with NOTHING. Now I''m a Grammy-winning artist with my own empire. Don''t tell me what''s impossible. OKURRR! 💅', 1800000, 345000, 156000, 198000000, NOW() - INTERVAL '2 hours'),
(gen_random_uuid(), id_cardi, 'Album dropping in two weeks and I PROMISE you it''s worth the wait. Every track is a different flavor. I gave y''all RANGE.', 1200000, 234000, 89000, 134000000, NOW() - INTERVAL '7 hours'),
(gen_random_uuid(), id_cardi, 'People love to hate on successful women. Baby, your opinion is a free sample I didn''t ask for. 💁‍♀️', 980000, 178000, 123000, 112000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_cardi, 'Just had the most amazing conversation with Kulture about her dreams. She wants to be a veterinarian AND a rapper. My genes are STRONG. 😂', 670000, 112000, 56000, 78000000, NOW() - INTERVAL '3 days');

-- ===== BILLIE EILISH =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_billieeilish, 'New album is the most honest music I''ve ever made. I stopped trying to be what people expected and just became myself. That''s the whole album.', 1800000, 345000, 123000, 198000000, NOW() - INTERVAL '3 hours'),
(gen_random_uuid(), id_billieeilish, 'Climate activism isn''t a phase. It''s a responsibility. Every tour we do is carbon-neutral and we''re pushing the industry to change.', 890000, 156000, 67000, 98000000, NOW() - INTERVAL '8 hours'),
(gen_random_uuid(), id_billieeilish, 'Made music in my bedroom at 14. Won Oscars at 21. Be delusional about your dreams. The universe respects audacity.', 1500000, 267000, 89000, 167000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_billieeilish, 'Finneas and I wrote a song in the car today. Just humming into our phones. Some of our best work starts in the most random places.', 670000, 112000, 56000, 78000000, NOW() - INTERVAL '3 days');

-- ===== POST MALONE =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_postmalone, 'Country album went triple platinum. They said a rapper can''t do country. I said hold my Bud Light. 🍺🤠', 1200000, 234000, 89000, 134000000, NOW() - INTERVAL '4 hours'),
(gen_random_uuid(), id_postmalone, 'New tattoo on my forehead. My barber is running out of space. My mom is running out of patience. 😂', 890000, 156000, 123000, 98000000, NOW() - INTERVAL '10 hours'),
(gen_random_uuid(), id_postmalone, 'Playing guitar at 2am on the porch with a glass of wine. Some things don''t need to be content. Some things are just for the soul.', 670000, 112000, 56000, 78000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_postmalone, 'Wine label just won its first international award. Maison No. 9 rosé isn''t just celebrity wine — it''s GOOD wine. 🍷', 567000, 98000, 45000, 67000000, NOW() - INTERVAL '3 days');

-- ===== SCARLETT JOHANSSON =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_scarjo, 'The Outset skincare line is everything I wish existed when I started acting. Clean, effective, and actually affordable. It''s not rocket science.', 567000, 98000, 45000, 67000000, NOW() - INTERVAL '5 hours'),
(gen_random_uuid(), id_scarjo, 'Directing my first feature film was the most terrifying and exhilarating experience. Being behind the camera is a completely different kind of power.', 890000, 156000, 67000, 98000000, NOW() - INTERVAL '12 hours'),
(gen_random_uuid(), id_scarjo, 'AI companies training on actors'' likenesses without permission is not innovation — it''s theft. We have to protect creative workers. Period.', 1200000, 234000, 89000, 134000000, NOW() - INTERVAL '1 day');

-- ===== JENNIFER LOPEZ =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_jlo, 'From the Bronx to the world stage. 30 years in this industry and I''m still as hungry as day one. The work ethic never changes. 💪', 890000, 156000, 67000, 98000000, NOW() - INTERVAL '3 hours'),
(gen_random_uuid(), id_jlo, 'JLo Beauty expanding into body care. Started with the glow, now we''re covering everything. Because you deserve to feel amazing everywhere.', 567000, 98000, 45000, 67000000, NOW() - INTERVAL '10 hours'),
(gen_random_uuid(), id_jlo, 'New movie wrapped yesterday. This role asked more of me as a woman and an actress than anything I''ve done before. I left it all on screen.', 780000, 134000, 56000, 89000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_jlo, 'Sunday dance session with the kids. They''re better than me now and I''m both proud and slightly offended. 💃😂', 670000, 112000, 56000, 78000000, NOW() - INTERVAL '3 days');

-- ===== CHRIS EVANS =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_chrisevans, 'Just adopted another rescue dog. That makes four. My apartment is basically a dog park now and I couldn''t be happier. 🐕', 1500000, 267000, 123000, 167000000, NOW() - INTERVAL '3 hours'),
(gen_random_uuid(), id_chrisevans, 'A Starting Point has facilitated over 5,000 conversations between elected officials and citizens. Democracy works when people engage.', 567000, 98000, 34000, 67000000, NOW() - INTERVAL '9 hours'),
(gen_random_uuid(), id_chrisevans, 'Putting down the shield was hard, but these new roles are letting me explore parts of myself Cap never could. Growth means change.', 890000, 156000, 67000, 98000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_chrisevans, 'My anxiety doesn''t define me. But being honest about it helps others feel less alone. If Captain America can feel afraid, so can you.', 2100000, 389000, 156000, 234000000, NOW() - INTERVAL '3 days');

-- ===== VIRAT KOHLI =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_viratkohli, 'Century number 82. 15 years of international cricket and the hunger hasn''t changed. If anything, it burns brighter. 🏏🔥', 2800000, 478000, 198000, 298000000, NOW() - INTERVAL '2 hours'),
(gen_random_uuid(), id_viratkohli, 'Fitness isn''t about looking good. It''s about performing at your best when it matters most. The gym is where championships are won.', 1200000, 234000, 89000, 134000000, NOW() - INTERVAL '8 hours'),
(gen_random_uuid(), id_viratkohli, 'Vamika drew me batting today. She gave me a really big bat and tiny legs. I choose to see it as artistic interpretation. 😂', 1800000, 345000, 123000, 198000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_viratkohli, 'Mental health in cricket needs to be taken as seriously as physical fitness. I''ve seen the best players crumble under pressure they couldn''t talk about.', 980000, 178000, 67000, 112000000, NOW() - INTERVAL '3 days');

-- ===== MS DHONI =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_msdhoni, 'Retired from cricket but not from life. The farm keeps me busy, the bikes keep me sane, and the dogs keep me humble. 🏍️', 2100000, 389000, 134000, 234000000, NOW() - INTERVAL '5 hours'),
(gen_random_uuid(), id_msdhoni, 'Spending the morning with my organic farming project. From helicopter shots to harvesting potatoes. Life comes full circle. 🌾', 1200000, 234000, 89000, 134000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_msdhoni, 'The best captain is the one who makes everyone around them better. That was always my philosophy. Results follow people, not plans.', 1800000, 345000, 123000, 198000000, NOW() - INTERVAL '3 days');

-- ===== PEWDIEPIE =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_pewdiepie, 'Living in Japan and raising a family is the plot twist nobody predicted from my Minecraft era. Life is beautifully weird.', 890000, 156000, 89000, 98000000, NOW() - INTERVAL '4 hours'),
(gen_random_uuid(), id_pewdiepie, 'Started as a kid screaming at horror games. Now I''m a dad who whispers so he doesn''t wake the baby. Character development.', 1200000, 234000, 123000, 134000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_pewdiepie, 'Reading manga in the original Japanese now. Only took 3 years of studying. The secret? Consistency beats talent every single time.', 670000, 112000, 56000, 78000000, NOW() - INTERVAL '2 days');

-- ===== JUSTIN BIEBER =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_justinbieber, 'Health update: feeling better every day. Ramsay Hunt took so much from me but it also showed me what really matters. Grateful for every good day.', 2100000, 389000, 156000, 234000000, NOW() - INTERVAL '3 hours'),
(gen_random_uuid(), id_justinbieber, 'Playing guitar again. Simple songs, simple joy. Music doesn''t have to be perfect to be healing.', 1200000, 234000, 78000, 134000000, NOW() - INTERVAL '10 hours'),
(gen_random_uuid(), id_justinbieber, 'Hailey and I painted together today. Neither of us are good at it. That''s the whole point. Joy without pressure.', 890000, 156000, 67000, 98000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_justinbieber, 'To every kid who grew up with me: we both turned out okay. Maybe not perfect, but okay. And okay is more than enough.', 1500000, 267000, 89000, 167000000, NOW() - INTERVAL '3 days');

-- ===== MARGOT ROBBIE =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_margotrobbie, 'LuckyChap has now produced 3 Best Picture nominees. We built this company to tell women''s stories. The industry is listening.', 890000, 156000, 67000, 98000000, NOW() - INTERVAL '4 hours'),
(gen_random_uuid(), id_margotrobbie, 'Barbie proved that a billion-dollar film can be smart, feminist, AND fun. You don''t have to choose. We chose all three. 💖', 1800000, 345000, 123000, 198000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_margotrobbie, 'From a Queensland farm to Hollywood producer. The girl who couldn''t afford headshots now greenlights films. Dream recklessly.', 1200000, 234000, 89000, 134000000, NOW() - INTERVAL '3 days');

-- ===== KHLOE KARDASHIAN =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_khloek, 'Being a mom of two is the most chaotic, beautiful, exhausting, perfect thing in the world. Wouldn''t trade it for anything. 💕', 670000, 112000, 56000, 78000000, NOW() - INTERVAL '3 hours'),
(gen_random_uuid(), id_khloek, 'Good American just launched our activewear line. Inclusive sizing from 00-32. Every body deserves to feel powerful in workout clothes.', 567000, 98000, 45000, 67000000, NOW() - INTERVAL '10 hours'),
(gen_random_uuid(), id_khloek, 'Revenge body is a mindset, not a look. The best glow-up is the one nobody can see — the one happening inside your heart.', 890000, 156000, 67000, 98000000, NOW() - INTERVAL '1 day');

-- ===== JACK BLACK =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_jackblack, 'Just learned a new TikTok dance in my underwear. My kids are mortified. My fans are delighted. I call that a perfect day. 🕺', 1200000, 234000, 156000, 134000000, NOW() - INTERVAL '2 hours'),
(gen_random_uuid(), id_jackblack, 'Tenacious D world tour kicking off next month. Kyle and I have been practicing and by "practicing" I mean eating burritos and jamming. 🎸', 890000, 156000, 89000, 98000000, NOW() - INTERVAL '8 hours'),
(gen_random_uuid(), id_jackblack, 'The secret to happiness? Be ridiculous. Take nothing too seriously. The universe rewards people who make it laugh.', 670000, 112000, 67000, 78000000, NOW() - INTERVAL '1 day');

-- ===== ELLEN DEGENERES =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_ellenshow, 'Life after the show is quiet and wonderful. Portia and I spend our days with animals, art, and absolute peace.', 567000, 98000, 45000, 67000000, NOW() - INTERVAL '5 hours'),
(gen_random_uuid(), id_ellenshow, 'Be kind to everyone. Not because they deserve it, but because you do. Kindness is a gift you give yourself.', 890000, 156000, 67000, 98000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_ellenshow, 'Designed and flipped my 14th house. Interior design might be my true calling all along. The talk show was just the warm-up act. 🏡', 456000, 78000, 34000, 56000000, NOW() - INTERVAL '3 days');

-- ===== TRAVIS SCOTT =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_travisscott, 'UTOPIA tour just wrapped with 120 shows in 42 countries. La Flame traveled the whole world. Thank you to every single rager. 🌵🔥', 1200000, 234000, 89000, 134000000, NOW() - INTERVAL '3 hours'),
(gen_random_uuid(), id_travisscott, 'Cactus Jack Foundation just opened a creative academy in Houston. Giving kids from the hood the resources I never had. This is bigger than music.', 890000, 156000, 67000, 98000000, NOW() - INTERVAL '10 hours'),
(gen_random_uuid(), id_travisscott, 'New album already 60% done. The sonic palette is something y''all have never heard from me. I''m pushing every boundary.', 1500000, 267000, 89000, 167000000, NOW() - INTERVAL '1 day');

-- ===== NEYMAR =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_neymar, 'Back on the pitch after injury. The comeback is always stronger than the setback. Let''s go! ⚽🇧🇷', 1800000, 345000, 123000, 198000000, NOW() - INTERVAL '4 hours'),
(gen_random_uuid(), id_neymar, 'Football is art. The pitch is my canvas. Every dribble is a brushstroke. They can copy the technique but they can''t copy the soul.', 1200000, 234000, 89000, 134000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_neymar, 'Gaming night with the boys. Lost 7 games in a row in CS2. My aim in football is better than my aim in games apparently. 😂🎮', 890000, 156000, 89000, 98000000, NOW() - INTERVAL '2 days');

-- ===== WHITE HOUSE =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_whitehouse, 'The President signed the Infrastructure Investment Act today, committing $200B to rebuild America''s roads, bridges, and broadband networks.', 567000, 98000, 45000, 67000000, NOW() - INTERVAL '4 hours'),
(gen_random_uuid(), id_whitehouse, 'The White House welcomed 50,000 visitors for the annual Easter Egg Roll. A tradition that unites Americans across every divide. 🥚', 345000, 67000, 23000, 45000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_whitehouse, 'Today we honor the brave men and women who serve our nation. Their sacrifice secures our freedom. #ArmedForcesDay 🇺🇸', 890000, 156000, 45000, 98000000, NOW() - INTERVAL '3 days');

-- ===== SALMA HAYEK =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_salmahayek, 'At 59, I refuse to be invisible. Women don''t expire. We ripen. And I intend to keep getting better. 🌹', 1200000, 234000, 89000, 134000000, NOW() - INTERVAL '3 hours'),
(gen_random_uuid(), id_salmahayek, 'Producing Latina stories for the world stage. Our voices deserve to be heard in every language, on every screen. Representation is revolution.', 890000, 156000, 67000, 98000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_salmahayek, 'Morning yoga with my rescue owl Kering. Yes, I do yoga with an owl. Yes, it''s exactly as magical as it sounds. 🦉', 670000, 112000, 78000, 78000000, NOW() - INTERVAL '2 days');

-- ===== CHARLIZE THERON =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_charlize, 'CTAOP just reached 500,000 young people across Southern Africa with HIV prevention programs. This work is my legacy. Everything else is just movies.', 890000, 156000, 67000, 98000000, NOW() - INTERVAL '4 hours'),
(gen_random_uuid(), id_charlize, 'Did my own stunts again. My body hates me but my soul is alive. Action films at 50 hit different when you prove them all wrong.', 1200000, 234000, 89000, 134000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_charlize, 'Single mom of two. Running a production company. Fighting for gender equity. Sleeping 4 hours. Looking fabulous. Any questions? 💁‍♀️', 1500000, 267000, 123000, 167000000, NOW() - INTERVAL '3 days');

-- ===== LEO MESSI =====
INSERT INTO public.posts (id, author_id, content, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
(gen_random_uuid(), id_leomessi, 'Miami has become my home. The fans, the city, the culture — I feel the love every single day. Vamos Inter Miami! 💗🖤', 2800000, 478000, 198000, 298000000, NOW() - INTERVAL '2 hours'),
(gen_random_uuid(), id_leomessi, 'The World Cup trophy still gives me chills every time I see it. Some dreams are worth waiting a lifetime for. 🏆', 3400000, 567000, 234000, 345000000, NOW() - INTERVAL '1 day'),
(gen_random_uuid(), id_leomessi, 'Playing with my sons in the backyard. They''re getting really good. A proud papá moment. Family above everything. ❤️', 1800000, 345000, 123000, 198000000, NOW() - INTERVAL '3 days');

END $$;

-- ========== STEP 3: Add cross-celebrity interactions (comments/replies) ==========
DO $$
DECLARE
  id_elonmusk       UUID := 'a0000000-0000-0000-0000-000000000001';
  id_taylorswift    UUID := 'a0000000-0000-0000-0000-000000000009';
  id_beyonce        UUID := 'a0000000-0000-0000-0000-000000000010';
  id_therock        UUID := 'a0000000-0000-0000-0000-000000000021';
  id_ryanreynolds   UUID := 'a0000000-0000-0000-0000-000000000035';
  id_barackobama    UUID := 'a0000000-0000-0000-0000-000000000048';
  id_billgates      UUID := 'a0000000-0000-0000-0000-000000000015';
  id_mrbeast        UUID := 'a0000000-0000-0000-0000-000000000044';
  post_id UUID;
BEGIN
  -- Get a recent Elon post and add comments
  SELECT id INTO post_id FROM public.posts WHERE author_id = id_elonmusk ORDER BY created_at DESC LIMIT 1;
  IF post_id IS NOT NULL THEN
    INSERT INTO public.posts (id, author_id, content, parent_id, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
    (gen_random_uuid(), id_billgates, 'Impressive progress on Starship. The engineering challenges you''ve overcome are remarkable.', post_id, 45000, 5600, 1200, 8900000, NOW() - INTERVAL '1 hour'),
    (gen_random_uuid(), id_therock, 'This is INCREDIBLE brother! The future is happening right now! 💪🚀', post_id, 67000, 8900, 2300, 12000000, NOW() - INTERVAL '90 minutes'),
    (gen_random_uuid(), id_mrbeast, 'Can I film a video from Mars? Serious question.', post_id, 89000, 12000, 3400, 15000000, NOW() - INTERVAL '2 hours');
  END IF;

  -- Get a recent Taylor Swift post and add comments
  SELECT id INTO post_id FROM public.posts WHERE author_id = id_taylorswift ORDER BY created_at DESC LIMIT 1;
  IF post_id IS NOT NULL THEN
    INSERT INTO public.posts (id, author_id, content, parent_id, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
    (gen_random_uuid(), id_beyonce, 'Can''t wait to hear it, sis. You always deliver. 👑✨', post_id, 234000, 34000, 8900, 45000000, NOW() - INTERVAL '30 minutes'),
    (gen_random_uuid(), id_ryanreynolds, 'Will there be a friendship bracelet for me? I''ve been practicing my beadwork.', post_id, 156000, 23000, 12000, 34000000, NOW() - INTERVAL '45 minutes');
  END IF;

  -- Get a recent Barack Obama post and add comments
  SELECT id INTO post_id FROM public.posts WHERE author_id = id_barackobama ORDER BY created_at DESC LIMIT 1;
  IF post_id IS NOT NULL THEN
    INSERT INTO public.posts (id, author_id, content, parent_id, likes_count, reposts_count, replies_count, views_count, created_at) VALUES
    (gen_random_uuid(), id_billgates, 'Couldn''t agree more. Civic engagement is the foundation of everything else.', post_id, 56000, 7800, 2300, 12000000, NOW() - INTERVAL '3 hours');
  END IF;
END $$;

-- Verify
SELECT 'Migration complete! Total posts: ' || count(*) FROM public.posts;
SELECT 'Avatars updated: ' || count(*) FROM public.profiles WHERE avatar LIKE '%unavatar.io%';
