-- Clear all data from tables (run before seed.sql)

DELETE FROM news;
DELETE FROM guides;
DELETE FROM recipes;
DELETE FROM habitats;
DELETE FROM pokemon;
DELETE FROM builds;

-- Reset auto-increment if needed (for local development)
-- DELETE FROM sqlite_sequence WHERE name IN ('news', 'guides', 'recipes', 'habitats', 'pokemon', 'builds');
