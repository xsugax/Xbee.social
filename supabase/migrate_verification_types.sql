-- ============================================================
-- XBEE SOCIAL — Fix Verification Types
-- Run this in your Supabase SQL Editor
-- ============================================================
-- Changes:
--   - Celebrities get 'celebrity' verification (blue badge)
--   - Government/political accounts get 'government' verification (red badge)
--   - No more 'official' type on celebrity accounts

-- ========== Government accounts → 'government' ==========
UPDATE public.profiles SET verification = 'government' WHERE id IN (
  'a0000000-0000-0000-0000-000000000002',  -- Donald Trump
  'a0000000-0000-0000-0000-000000000003',  -- The White House
  'a0000000-0000-0000-0000-000000000032',  -- NASA
  'a0000000-0000-0000-0000-000000000048',  -- Barack Obama
  'a0000000-0000-0000-0000-000000000049',  -- Michelle Obama
  'a0000000-0000-0000-0000-000000000056'   -- Joe Biden
);

-- ========== All other celebrities → 'celebrity' ==========
UPDATE public.profiles SET verification = 'celebrity' WHERE id IN (
  'a0000000-0000-0000-0000-000000000001',  -- Elon Musk
  'a0000000-0000-0000-0000-000000000004',  -- Salma Hayek
  'a0000000-0000-0000-0000-000000000005',  -- Keanu Reeves
  'a0000000-0000-0000-0000-000000000006',  -- Charlize Theron
  'a0000000-0000-0000-0000-000000000007',  -- Rihanna
  'a0000000-0000-0000-0000-000000000008',  -- Drake
  'a0000000-0000-0000-0000-000000000009',  -- Taylor Swift
  'a0000000-0000-0000-0000-000000000010',  -- Beyonce
  'a0000000-0000-0000-0000-000000000011',  -- Cristiano Ronaldo
  'a0000000-0000-0000-0000-000000000012',  -- Leo Messi
  'a0000000-0000-0000-0000-000000000013',  -- LeBron James
  'a0000000-0000-0000-0000-000000000014',  -- Oprah
  'a0000000-0000-0000-0000-000000000015',  -- Bill Gates
  'a0000000-0000-0000-0000-000000000016',  -- Jeff Bezos
  'a0000000-0000-0000-0000-000000000017',  -- Mark Zuckerberg
  'a0000000-0000-0000-0000-000000000018',  -- Kim Kardashian
  'a0000000-0000-0000-0000-000000000019',  -- Selena Gomez
  'a0000000-0000-0000-0000-000000000020',  -- Justin Bieber
  'a0000000-0000-0000-0000-000000000021',  -- The Rock
  'a0000000-0000-0000-0000-000000000022',  -- Kevin Hart
  'a0000000-0000-0000-0000-000000000023',  -- Snoop Dogg
  'a0000000-0000-0000-0000-000000000024',  -- Neymar
  'a0000000-0000-0000-0000-000000000025',  -- Katy Perry
  'a0000000-0000-0000-0000-000000000026',  -- Lady Gaga
  'a0000000-0000-0000-0000-000000000027',  -- Ariana Grande
  'a0000000-0000-0000-0000-000000000028',  -- Tom Holland
  'a0000000-0000-0000-0000-000000000029',  -- Zendaya
  'a0000000-0000-0000-0000-000000000030',  -- Will Smith
  'a0000000-0000-0000-0000-000000000031',  -- Tim Cook
  'a0000000-0000-0000-0000-000000000033',  -- Ellen DeGeneres
  'a0000000-0000-0000-0000-000000000034',  -- Jack Black
  'a0000000-0000-0000-0000-000000000035',  -- Ryan Reynolds
  'a0000000-0000-0000-0000-000000000036',  -- Margot Robbie
  'a0000000-0000-0000-0000-000000000037',  -- Chris Evans
  'a0000000-0000-0000-0000-000000000038',  -- Scarlett Johansson
  'a0000000-0000-0000-0000-000000000039',  -- Jennifer Lopez
  'a0000000-0000-0000-0000-000000000040',  -- Shakira
  'a0000000-0000-0000-0000-000000000041',  -- MS Dhoni
  'a0000000-0000-0000-0000-000000000042',  -- Virat Kohli
  'a0000000-0000-0000-0000-000000000043',  -- Rihanna (alt)
  'a0000000-0000-0000-0000-000000000044',  -- MrBeast
  'a0000000-0000-0000-0000-000000000045',  -- PewDiePie
  'a0000000-0000-0000-0000-000000000046',  -- Khloe Kardashian
  'a0000000-0000-0000-0000-000000000047',  -- Kylie Jenner
  'a0000000-0000-0000-0000-000000000050',  -- Bruno Mars
  'a0000000-0000-0000-0000-000000000051',  -- Cardi B
  'a0000000-0000-0000-0000-000000000052',  -- Travis Scott
  'a0000000-0000-0000-0000-000000000053',  -- Lizzo
  'a0000000-0000-0000-0000-000000000054',  -- Post Malone
  'a0000000-0000-0000-0000-000000000055'   -- Billie Eilish
);

-- Verify
SELECT verification, count(*) FROM public.profiles WHERE id LIKE 'a0000000%' GROUP BY verification ORDER BY verification;
