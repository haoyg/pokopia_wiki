-- Pokopia Portal Database Schema (Cloudflare D1)
-- Run with: npx wrangler d1 execute pokopia-db --file=./schema.sql --local

-- Pokémon Table
CREATE TABLE IF NOT EXISTS pokemon (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  rarity TEXT NOT NULL CHECK(rarity IN ('common', 'uncommon', 'rare', 'legendary')),
  habitat TEXT,
  favorite_food TEXT,
  spawn_time TEXT,
  weather TEXT,
  specialty TEXT,
  skills TEXT,
  drops TEXT,
  description TEXT,
  image_url TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Habitats Table
CREATE TABLE IF NOT EXISTS habitats (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  unlock_condition TEXT,
  spawn_list TEXT,
  recommended_build TEXT,
  weather TEXT,
  difficulty TEXT CHECK(difficulty IN ('easy', 'medium', 'hard')),
  resource_bonus TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Recipes Table
CREATE TABLE IF NOT EXISTS recipes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  ingredients TEXT,
  buff TEXT,
  effect_duration TEXT,
  rarity TEXT CHECK(rarity IN ('common', 'uncommon', 'rare', 'legendary')),
  best_use TEXT,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Guides Table
CREATE TABLE IF NOT EXISTS guides (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  seo_keyword TEXT,
  content TEXT,
  related_pokemon TEXT,
  related_items TEXT,
  related_habitats TEXT,
  published_at INTEGER DEFAULT (unixepoch()),
  created_at INTEGER DEFAULT (unixepoch())
);

-- News Table
CREATE TABLE IF NOT EXISTS news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('update', 'patch', 'event', 'announcement')),
  excerpt TEXT,
  content TEXT,
  published_at INTEGER,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Builds Table
CREATE TABLE IF NOT EXISTS builds (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  pokemon_team TEXT,
  habitat_layout TEXT,
  likes INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch())
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_pokemon_name ON pokemon(name);
CREATE INDEX IF NOT EXISTS idx_pokemon_rarity ON pokemon(rarity);
CREATE INDEX IF NOT EXISTS idx_pokemon_habitat ON pokemon(habitat);
CREATE INDEX IF NOT EXISTS idx_guides_slug ON guides(slug);
CREATE INDEX IF NOT EXISTS idx_guides_category ON guides(category);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published_at);
CREATE INDEX IF NOT EXISTS idx_builds_likes ON builds(likes);
