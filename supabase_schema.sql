-- MUSTANG ESPORTS — SUPABASE DATABASE SCHEMA SETUP
-- Copy and paste this script into your Supabase Dashboard SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Rosters Table (Pro Players & Athletes)
CREATE TABLE IF NOT EXISTS rosters (
  id TEXT PRIMARY KEY,
  handle TEXT NOT NULL,
  name TEXT NOT NULL,
  game TEXT NOT NULL,
  role TEXT NOT NULL,
  kda TEXT,
  win_rate TEXT,
  country TEXT,
  flag TEXT,
  image TEXT,
  signature_agent TEXT,
  gear TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Matches Table (Upcoming & Past Fixtures)
CREATE TABLE IF NOT EXISTS matches (
  id TEXT PRIMARY KEY,
  tournament TEXT NOT NULL,
  stage TEXT,
  game TEXT NOT NULL,
  team TEXT NOT NULL DEFAULT 'Mustang Esports',
  team_logo TEXT DEFAULT '/assets/images/logo.png',
  opponent TEXT NOT NULL,
  opponent_logo TEXT,
  match_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'Upcoming',
  stream_url TEXT,
  embed_id TEXT,
  venue TEXT,
  prize_pool TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. News Articles Table
CREATE TABLE IF NOT EXISTS news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Tournaments',
  author TEXT DEFAULT 'Mustang Media Team',
  image TEXT,
  summary TEXT,
  content TEXT,
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Shop Products Table (Merchandise Catalog)
CREATE TABLE IF NOT EXISTS shop_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'Apparel',
  price NUMERIC(10,2) NOT NULL,
  rating NUMERIC(3,1) DEFAULT 5.0,
  image TEXT,
  description TEXT,
  sizes JSONB,
  in_stock BOOLEAN DEFAULT TRUE,
  tag TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Brackets Table (Challonge Matchmaking Brackets)
CREATE TABLE IF NOT EXISTS brackets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  game TEXT NOT NULL,
  format TEXT NOT NULL,
  series_format TEXT,
  status TEXT DEFAULT 'In Progress',
  rounds JSONB NOT NULL,
  champion JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Esport Games Table (Registered Game Titles & Logos)
CREATE TABLE IF NOT EXISTS games (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  genre TEXT,
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Scouting Inquiries & Applications Table
CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  game TEXT,
  ign TEXT,
  rank TEXT,
  vod_link TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Allow Public Read/Write Access
ALTER TABLE rosters ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE brackets ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Access Rosters" ON rosters;
CREATE POLICY "Public Read Access Rosters" ON rosters FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Write Access Rosters" ON rosters;
CREATE POLICY "Public Write Access Rosters" ON rosters FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Access Matches" ON matches;
CREATE POLICY "Public Read Access Matches" ON matches FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Write Access Matches" ON matches;
CREATE POLICY "Public Write Access Matches" ON matches FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Access News" ON news;
CREATE POLICY "Public Read Access News" ON news FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Write Access News" ON news;
CREATE POLICY "Public Write Access News" ON news FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Access Shop" ON shop_products;
CREATE POLICY "Public Read Access Shop" ON shop_products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Write Access Shop" ON shop_products;
CREATE POLICY "Public Write Access Shop" ON shop_products FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Access Brackets" ON brackets;
CREATE POLICY "Public Read Access Brackets" ON brackets FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Write Access Brackets" ON brackets;
CREATE POLICY "Public Write Access Brackets" ON brackets FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Access Games" ON games;
CREATE POLICY "Public Read Access Games" ON games FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Write Access Games" ON games;
CREATE POLICY "Public Write Access Games" ON games FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Write Access Inquiries" ON inquiries;
CREATE POLICY "Public Write Access Inquiries" ON inquiries FOR ALL USING (true);

-- Seed Initial Registered Esport Games
INSERT INTO games (id, name, genre, logo_url, description) VALUES
('g_val', 'VALORANT', 'Tactical Shooter', '/assets/images/games/valorant.svg', '5v5 character-based tactical shooter'),
('g_mlbb', 'MLBB', 'MOBA Mobile', '/assets/images/games/mlbb.svg', '5v5 Mobile Legends Bang Bang'),
('g_codm', 'CODM', 'FPS Mobile', '/assets/images/games/codm.svg', 'Call of Duty Mobile'),
('g_hok', 'HOK', 'MOBA Mobile', '/assets/images/games/hok.svg', 'Honor of Kings'),
('g_lol', 'LEAGUE OF LEGENDS', 'MOBA PC', '/assets/images/games/lol.svg', '5v5 League of Legends PC'),
('g_tekken', 'TEKKEN 8', 'Fighting Game', '/assets/images/games/tekken8.svg', 'Next-gen fighting game')
ON CONFLICT (id) DO NOTHING;
