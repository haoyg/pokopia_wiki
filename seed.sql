-- Seed data for Pokopia Portal

-- Sample Pokémon
INSERT INTO pokemon (id, name, type, rarity, habitat, favorite_food, spawn_time, weather, specialty, skills, drops, description) VALUES
('pkm001', 'Pikafire', 'Fire/Electric', 'rare', 'hab001', 'Apple', 'Day', 'Sunny', 'Attacker', 'Thunderbolt,Fire Blast,Quick Attack,Iron Tail', 'Fire Stone,Thunder Stone', 'A fiery variant of Pikachu with flame-themed markings. Found near volcanic areas.'),
('pkm002', 'Bulbin', 'Grass', 'common', 'hab002', 'Leaf', 'Any', 'Cloudy', 'Defender', 'Vine Whip,Razor Leaf,Protect,Growl', 'Leaf,Grass Fiber', 'A loyal grass-type starter. Easy to catch and great for beginners.'),
('pkm003', 'Charmuddy', 'Fire', 'uncommon', 'hab001', 'Honey', 'Night', 'Clear', 'Attacker', 'Ember,Fire Spin,Flamethrower,Fire Blast', 'Fire Stone,Ash', 'A cuddly fire-type with fluffy fur. Evolves from Firdle.'),
('pkm004', 'Aquap', 'Water', 'common', 'hab003', 'Golden Fish', 'Any', 'Rain', 'Support', 'Water Gun,Bubble,Aqua Jet,Rain Dance', 'Water Stone,Pearl', 'A playful water creature. Found near rivers and lakes.'),
('pkm005', 'Zaprat', 'Electric', 'uncommon', 'hab004', 'Cheese', 'Morning', 'Windy', 'Speedster', 'Spark,Quick Attack,Thunder Wave,Discharge', 'Thunder Stone,Lightning Rod', 'An electric rat-like Pokémon. Extremely fast but fragile.'),
('pkm006', 'Leafon', 'Grass/Poison', 'rare', 'hab002', 'Mystery Mushroom', 'Night', 'Foggy', 'Assassin', 'Poison Powder,Sludge Bomb,Razor Leaf,Toxic', 'Poison Stone,Leaf Stone', 'A rare grass-type with toxic abilities. Stealthy hunter.'),
('pkm007', 'Flamexor', 'Fire/Steel', 'legendary', 'hab001', 'Iron Ore', 'Night', 'Clear', 'Tank', 'Flame Body,Iron Defense,Fire Blast,Stealth Rock', 'Fire Stone,Metal Coat,Legendary Scale', 'The legendary flame beast. Nearly extinct in the wild.'),
('pkm008', 'Tidlet', 'Normal', 'common', 'hab005', 'Any Food', 'Day', 'Snow', 'Support', 'Growl,Tackle,Play Nice,Swagger', 'Fur,Cloth', 'A small cute creature. Found in snowy regions.'),
('pkm009', 'Shados', 'Ghost', 'rare', 'hab006', 'Soul Dust', 'Night', 'Stormy', 'Assassin', 'Shadow Ball,Lick,Astonish,Night Shade', 'Ghost Stone,Soul Dust', 'A ghostly shadow Pokémon. Appears only in dark places.'),
('pkm010', 'Mechabit', 'Electric/Steel', 'uncommon', 'hab004', 'Battery', 'Any', 'Thunderstorm', 'Defender', 'Lock-On,Zap Cannon,Flash Cannon,Protect', 'Metal Coat,Piston', 'A robotic electric Pokémon. Created by ancient engineers.');

-- Sample Habitats
INSERT INTO habitats (id, name, unlock_condition, spawn_list, recommended_build, weather, difficulty, resource_bonus) VALUES
('hab001', 'Volcanic Cave', 'Reach Level 15', 'pkm001,pkm003,pkm007', 'Tank Build', 'Clear/Sunny', 'hard', '+50% Fire drops'),
('hab002', 'Forest Valley', 'Starting Habitat', 'pkm002,pkm006', 'Balanced', 'Cloudy/Foggy', 'easy', '+30% Leaf drops'),
('hab003', 'Crystal Lake', 'Reach Level 5', 'pkm004', 'Farming', 'Rain', 'easy', '+40% Water drops'),
('hab004', 'Windmill Plains', 'Reach Level 10', 'pkm005,pkm010', 'Speed Build', 'Windy', 'medium', '+25% Electric drops'),
('hab005', 'Frost Peak', 'Reach Level 20', 'pkm008', 'Defense Build', 'Snow', 'medium', '+35% Ice drops'),
('hab006', 'Shadow Marsh', 'Reach Level 25', 'pkm009', 'Stealth Build', 'Stormy/Night', 'hard', '+60% Ghost drops');

-- Sample Recipes
INSERT INTO recipes (id, name, ingredients, buff, effect_duration, rarity, best_use) VALUES
('rec001', 'Honey Cake', 'Honey x3, Flour x2, Egg x1', '+20% attraction rate', '30 min', 'uncommon', 'Rare Pokémon farming'),
('rec002', 'Fire Boost', 'Flame Fruit x5, Magma Stone x1', '+30% Fire damage', '1 hour', 'rare', 'Boss battles'),
('rec003', 'Speed Potion', 'Windy Herb x4, Zap Berry x2', '+25% movement speed', '45 min', 'uncommon', 'Speed runs'),
('rec004', 'Guardian Stew', 'Iron Root x3, Big Root x2, Mystery Meat x2', '+40% defense', '2 hours', 'rare', 'Hard habitats'),
('rec005', 'Lucky Charm', 'Golden Fish x1, Four Leaf x3, Star Dust x2', '+50% rare spawn chance', '1 hour', 'legendary', 'Legendary hunting');

-- Sample Guides
INSERT INTO guides (id, title, slug, category, seo_keyword, content, related_pokemon, related_items, related_habitats) VALUES
('guid001', 'Best Starter Pokémon in Pokopia', 'best-starter-pokemon', 'tier', 'best starter pokopia', 'Starting your journey in Pokopia? Here are the best starter choices for beginners.', 'pkm002,pkm004,pkm008', 'rec001', 'hab002,hab003,hab005'),
('guid002', 'How to Unlock Volcanic Cave', 'how-to-unlock-volcanic-cave', 'guides', 'volcanic cave unlock pokopia', 'Complete guide to unlocking the hardest habitat in Pokopia.', 'pkm001,pkm007', 'rec002', 'hab001'),
('guid003', 'Fast Farming Guide for Rare Pokémon', 'fast-farming-rare-pokemon', 'farming', 'rare pokemon farming pokopia', 'Master these farming routes to get rare Pokémon fast.', 'pkm001,pkm006,pkm009', 'rec005', 'hab001,hab006'),
('guid004', 'Best Fire-Type Team Build', 'best-fire-type-team', 'team', 'fire type team pokopia', 'Build the ultimate fire-type team for damage.', 'pkm001,pkm003,pkm007', 'rec002', 'hab001'),
('guid005', 'Shadow Marsh Complete Guide', 'shadow-marsh-guide', 'guides', 'shadow marsh pokopia', 'Everything you need to know about the hardest habitat.', 'pkm009', 'rec005', 'hab006');

-- Sample News
INSERT INTO news (id, title, slug, category, excerpt, content, published_at) VALUES
('news001', 'New Pokémon Update v1.5 Released', 'new-pokemon-update-v15', 'update', '5 new Pokémon added in the latest update!', 'The v1.5 update brings 5 new Pokémon including the legendary Flamexor...', 1746652800),
('news002', 'Patch Notes v1.4.3 - Balance Changes', 'patch-notes-v143', 'patch', 'Major balance changes to fire-type abilities', 'Fire-type abilities have been adjusted in the latest patch...', 1746566400),
('news003', 'Spring Festival Event Starting Soon', 'spring-festival-event', 'event', 'Limited time spring festival with bonus drops', 'Get ready for the spring festival with +50% rare drops...', 1746480000),
('news004', 'New Shadow Marsh Habitat Now Available', 'shadow-marsh-release', 'announcement', 'Face the ultimate challenge in Shadow Marsh', 'The hardest habitat in Pokopia is now available...', 1746393600),
('news005', 'Community Build Competition Winners', 'build-competition-winners', 'announcement', 'Check out the top community builds', 'Congratulations to our build competition winners...', 1746307200);
