-- Seed data for Pokopia Portal

-- Sample Pokémon (10 -> 30)
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
('pkm010', 'Mechabit', 'Electric/Steel', 'uncommon', 'hab004', 'Battery', 'Any', 'Thunderstorm', 'Defender', 'Lock-On,Zap Cannon,Flash Cannon,Protect', 'Metal Coat,Piston', 'A robotic electric Pokémon. Created by ancient engineers.'),
('pkm011', 'Rockler', 'Rock/Ground', 'common', 'hab007', 'Stone', 'Any', 'Clear', 'Defender', 'Rock Throw,Earthquake,Protect,Stealth Rock', 'Stone,Rock Fragment', 'A sturdy rock-type. Excellent for defense.'),
('pkm012', 'Crystion', 'Crystal/Fairy', 'rare', 'hab007', 'Gem', 'Night', 'Snow', 'Attacker', 'Crystal Beam,Moonblast,Power Gem,Dazzling Gleam', 'Crystal Shard,Diamond', 'A beautiful crystal creature. Very rare to find.'),
('pkm013', 'Emberal', 'Fire', 'common', 'hab001', 'Hot Pepper', 'Day', 'Sunny', 'Attacker', 'Ember,Fire Punch,Flame Wheel,Fire Spin', 'Fire Stone,Flame Ore', 'A small fire salamander. Popular among beginners.'),
('pkm014', 'Glacior', 'Ice/Water', 'uncommon', 'hab005', 'Snowball', 'Any', 'Snow', 'Support', 'Ice Beam,Blizzard,Aurora Veil,Hail', 'Ice Stone,Frost Crystal', 'An ice penguin. At home in frozen environments.'),
('pkm015', 'Voltscale', 'Electric/Dragon', 'legendary', 'hab004', 'Lightning Bug', 'Night', 'Thunderstorm', 'Attacker', 'Thunderbolt,Dragon Pulse,Wild Charge,Thunder Wave', 'Thunder Stone,Dragon Scale', 'The legendary storm dragon. Said to control lightning.'),
('pkm016', 'Breezel', 'Flying', 'common', 'hab008', 'Feather', 'Day', 'Windy', 'Speedster', 'Peck,Wing Attack,Quick Attack,Aerial Ace', 'Feather,Wind Essence', 'A gentle wind bird. Found in open plains.'),
('pkm017', 'Thornvine', 'Grass', 'common', 'hab002', 'Berry', 'Any', 'Rain', 'Defender', 'Bullet Seed,Power Whip,Leech Seed,Protect', 'Leaf,Thorn', 'A thorny plant Pokémon. Great for defensive teams.'),
('pkm018', 'Mudkipz', 'Water/Ground', 'uncommon', 'hab009', 'Mud Ball', 'Any', 'Rain', 'Attacker', 'Water Gun,Mud Shot,Earthquake,Protect', 'Mud Stone,Water Stone', 'A playful water dog. Loves playing in mud.'),
('pkm019', 'Bronzorm', 'Steel/Psychic', 'rare', 'hab010', 'Coin', 'Day', 'Cloudy', 'Support', 'Psychic,Flash Cannon,Recover,Iron Defense', 'Metal Coat,Bronze Medal', 'An ancient bronze statue that came to life.'),
('pkm020', 'Flamingo', 'Fire/Flying', 'uncommon', 'hab008', 'Hot Seed', 'Day', 'Sunny', 'Attacker', 'Fire Spin,Hurricane,Flame Charge,Brave Bird', 'Fire Stone,Feather', 'An elegant fire bird. Its dance mesmerizes opponents.'),
('pkm021', 'Stealthfin', 'Water/Dark', 'rare', 'hab009', 'Fish', 'Night', 'Rain', 'Assassin', 'Crunch,Aqua Jet,Knock Off,Ice Fang', 'Deep Sea Tooth,Dark Gem', 'A mysterious deep-sea creature. Hunts at night.'),
('pkm022', 'Frostbite', 'Ice/Ghost', 'rare', 'hab006', 'Frozen Soul', 'Night', 'Snow', 'Assassin', 'Ice Beam,Shadow Ball,Avalanche,Hypnosis', 'Ghost Stone,Ice Crystal', 'A spirit of the frozen wastes. Beware its icy gaze.'),
('pkm023', 'Sunflora', 'Grass/Fire', 'uncommon', 'hab002', 'Sunstone', 'Day', 'Sunny', 'Attacker', 'Solar Beam,Fire Blast,Weather Ball,Sunny Day', 'Sun Stone,Flame Ore', 'A flower that thrives in sunlight. Chaotic battle style.'),
('pkm024', 'Magnedex', 'Electric/Steel', 'uncommon', 'hab004', 'Magnet', 'Any', 'Thunderstorm', 'Defender', 'Magnet Bomb,Thunderbolt,Volt Switch,Protect', 'Metal Coil,Magnet', 'A magnetic robot Pokémon. Attracts steel-types.'),
('pkm025', 'Tropius', 'Grass/Flying', 'common', 'hab008', 'Tropical Fruit', 'Day', 'Clear', 'Support', 'Air Slash,Energy Ball,Roost,Synthesis', 'Leaf,Dragon Scale', 'A tropical flying dinosaur. Produces delicious fruit.'),
('pkm026', 'Skittlish', 'Normal', 'common', 'hab002', 'Cookie', 'Day', 'Cloudy', 'Support', 'Playful,Body Slam,Cotton Guard,Seismic Toss', 'Fur,Cloth', 'A hyperactive creature. Always bouncing around.'),
('pkm027', 'Dewdrop', 'Water/Fairy', 'uncommon', 'hab003', 'Crystal Dew', 'Morning', 'Rain', 'Support', 'Moonblast,Aqua Jet,Muddy Water,Charm', 'Water Stone,Star Piece', 'A water droplet with fairy-like properties.'),
('pkm028', 'Magmar', 'Fire', 'uncommon', 'hab001', 'Magma Stone', 'Night', 'Clear', 'Attacker', 'Flamethrower,Fire Punch,Thunder Punch,Will-O-Wisp', 'Fire Stone,Magma Core', 'A living flame. Can melt any material.'),
('pkm029', 'Snorizard', 'Dragon/Ice', 'rare', 'hab005', 'Frost Meat', 'Any', 'Snow', 'Attacker', 'Draco Meteor,Icicle Spear,Dragon Dance,Extreme Speed', 'Dragon Scale,Ice Stone', 'A rare dragon that lives in icy mountains.'),
('pkm030', 'Shadowclaw', 'Dark/Ghost', 'legendary', 'hab006', 'Void Fruit', 'Night', 'Stormy', 'Assassin', 'Shadow Claw,Phantom Strike,Crunch,Sucker Punch', 'Shadow Stone,King''s Rock', 'The legendary shadow beast. Master of darkness.');

-- Sample Habitats (6 -> 12)
INSERT INTO habitats (id, name, unlock_condition, spawn_list, recommended_build, weather, difficulty, resource_bonus) VALUES
('hab001', 'Volcanic Cave', 'Reach Level 15', 'pkm001,pkm003,pkm007,pkm013,pkm028', 'Tank Build', 'Clear/Sunny', 'hard', '+50% Fire drops'),
('hab002', 'Forest Valley', 'Starting Habitat', 'pkm002,pkm006,pkm017,pkm019,pkm023,pkm026', 'Balanced', 'Cloudy/Foggy', 'easy', '+30% Leaf drops'),
('hab003', 'Crystal Lake', 'Reach Level 5', 'pkm004,pkm027', 'Farming', 'Rain', 'easy', '+40% Water drops'),
('hab004', 'Windmill Plains', 'Reach Level 10', 'pkm005,pkm010,pkm015,pkm024', 'Speed Build', 'Windy', 'medium', '+25% Electric drops'),
('hab005', 'Frost Peak', 'Reach Level 20', 'pkm008,pkm014,pkm022,pkm029', 'Defense Build', 'Snow', 'medium', '+35% Ice drops'),
('hab006', 'Shadow Marsh', 'Reach Level 25', 'pkm009,pkm030', 'Stealth Build', 'Stormy/Night', 'hard', '+60% Ghost drops'),
('hab007', 'Gemstone Canyon', 'Reach Level 12', 'pkm011,pkm012', 'Mining Build', 'Clear', 'medium', '+50% Stone drops'),
('hab008', 'Sky Isles', 'Reach Level 18', 'pkm016,pkm020,pkm025', 'Flying Build', 'Windy', 'medium', '+40% Feather drops'),
('hab009', 'Muddy River', 'Reach Level 8', 'pkm018,pkm021', 'Farming Build', 'Rain', 'easy', '+35% Mud drops'),
('hab010', 'Ancient Ruins', 'Reach Level 30', 'pkm019', 'Treasure Build', 'Cloudy', 'hard', '+45% Metal drops'),
('hab011', 'Sunny Beach', 'Starting Habitat', 'pkm004,pkm023,pkm027', 'Relaxed Build', 'Sunny', 'easy', '+30% Shell drops'),
('hab012', 'Thunder Arena', 'Reach Level 22', 'pkm005,pkm015,pkm024', 'Electric Build', 'Thunderstorm', 'hard', '+55% Electric drops');

-- Sample Recipes (5 -> 15)
INSERT INTO recipes (id, name, ingredients, buff, effect_duration, rarity, best_use) VALUES
('rec001', 'Honey Cake', 'Honey x3, Flour x2, Egg x1', '+20% attraction rate', '30 min', 'uncommon', 'Rare Pokémon farming'),
('rec002', 'Fire Boost', 'Flame Fruit x5, Magma Stone x1', '+30% Fire damage', '1 hour', 'rare', 'Boss battles'),
('rec003', 'Speed Potion', 'Windy Herb x4, Zap Berry x2', '+25% movement speed', '45 min', 'uncommon', 'Speed runs'),
('rec004', 'Guardian Stew', 'Iron Root x3, Big Root x2, Mystery Meat x2', '+40% defense', '2 hours', 'rare', 'Hard habitats'),
('rec005', 'Lucky Charm', 'Golden Fish x1, Four Leaf x3, Star Dust x2', '+50% rare spawn chance', '1 hour', 'legendary', 'Legendary hunting'),
('rec006', 'Water Shield', 'Crystal Dew x3, Shell x2, Pearl x1', '+35% water resistance', '1.5 hours', 'uncommon', 'Water habitats'),
('rec007', 'Thunder Strike', 'Lightning Bug x5, Battery x3, Magnet x1', '+40% electric damage', '45 min', 'rare', 'Electric battles'),
('rec008', 'Ice Armor', 'Frost Crystal x4, Ice Stone x2, Snowball x3', '+50% ice resistance', '2 hours', 'rare', 'Frost Peak'),
('rec009', 'Grass Heal', 'Leaf x5, Berry x3, Sunleaf x2', '+30 HP restore', '20 min', 'common', 'Daily farming'),
('rec010', 'Ghost Veil', 'Soul Dust x4, Shadow Stone x2, Void Fruit x1', '+45% ghost damage', '1 hour', 'legendary', 'Shadow Marsh'),
('rec011', 'Dragon\'s Fury', 'Dragon Scale x3, Magma Core x2, Fire Stone x1', '+35% dragon damage', '90 min', 'rare', 'Boss fights'),
('rec012', 'Steel Shell', 'Metal Coat x4, Bronze Medal x2, Iron Ore x3', '+60% defense', '2 hours', 'rare', 'Tank builds'),
('rec013', 'Flying High', 'Feather x5, Wind Essence x2, Cloudy Wool x3', '+30% flying damage', '1 hour', 'uncommon', 'Sky Isles'),
('rec014', 'Muddy Swirl', 'Mud Ball x4, River Clay x3, Water Stone x1', '+25% ground damage', '45 min', 'uncommon', 'Muddy River'),
('rec015', 'Mega Restore', 'Star Piece x3, Gold Leaf x2, Rainbow Shell x1', 'Full HP restore', 'Instant', 'legendary', 'Emergency healing');

-- Sample Guides (5 -> 15)
INSERT INTO guides (id, title, slug, category, seo_keyword, content, related_pokemon, related_items, related_habitats) VALUES
('guid001', 'Best Starter Pokémon in Pokopia', 'best-starter-pokemon', 'tier', 'best starter pokopia', 'Starting your journey in Pokopia? Here are the best starter choices for beginners. Bulbin offers balanced stats and easy farming, while Aquap provides water-type coverage. For aggressive players, Pikafire delivers high damage output.', 'pkm002,pkm004,pkm001', 'rec001', 'hab002,hab003,hab001'),
('guid002', 'How to Unlock Volcanic Cave', 'how-to-unlock-volcanic-cave', 'guides', 'volcanic cave unlock pokopia', 'Complete guide to unlocking the hardest habitat in Pokopia. You need Level 15 and a Fire-type Pokémon. Visit the Town Hall and complete the Fire Trial.', 'pkm001,pkm007', 'rec002', 'hab001'),
('guid003', 'Fast Farming Guide for Rare Pokémon', 'fast-farming-rare-pokemon', 'farming', 'rare pokemon farming pokopia', 'Master these farming routes to get rare Pokémon fast. Shadow Marsh and Frost Peak offer the best rare spawn rates. Use Lucky Charm recipe for +50% rare chance.', 'pkm009,pkm030,pkm029', 'rec005', 'hab006,hab005'),
('guid004', 'Best Fire-Type Team Build', 'best-fire-type-team', 'team', 'fire type team pokopia', 'Build the ultimate fire-type team for damage. Pikafire + Charmuddy + Flamexor creates devastating fire coverage. Pair with Fire Boost recipe for maximum damage.', 'pkm001,pkm003,pkm007', 'rec002', 'hab001'),
('guid005', 'Shadow Marsh Complete Guide', 'shadow-marsh-guide', 'guides', 'shadow marsh pokopia', 'Everything you need to know about the hardest habitat. Shadowclaw and Shados dominate here. Bring Ghost Veil and pair with Stealth Build Pokémon.', 'pkm009,pkm030', 'rec010', 'hab006'),
('guid006', 'How to Get Legendary Pokémon', 'how-to-get-legendary-pokemon', 'guides', 'legendary pokemon pokopia', 'Legendary Pokémon are extremely rare. Flamexor spawns in Volcanic Cave, Shadowclaw in Shadow Marsh. Use Lucky Charm every time you enter a hard habitat.', 'pkm007,pkm030,pkm015', 'rec005', 'hab001,hab006'),
('guid007', 'Best Habitat for Each Pokémon Type', 'best-habitat-type-pokopia', 'guides', 'pokemon type habitat pokopia', 'Know where to farm each type. Fire-types → Volcanic Cave. Ice-types → Frost Peak. Electric-types → Thunder Arena. Ghost-types → Shadow Marsh.', 'pkm001,pkm014,pkm005,pkm009', 'rec002,rec008,rec007,rec010', 'hab001,hab005,hab012,hab006'),
('guid008', 'Speed Run Route for Leveling', 'speed-run-leveling-route', 'farming', 'fast leveling pokopia', 'The fastest way to level up: Crystal Lake → Forest Valley → Windmill Plains. Use Speed Potion and farm during clear weather for best XP.', 'pkm004,pkm002,pkm005', 'rec003', 'hab003,hab002,hab004'),
('guid009', 'Thunder Arena Unlock and Strategy', 'thunder-arena-guide', 'guides', 'thunder arena pokopia', 'Unlock Thunder Arena at Level 22. Zaprat and Magnedex are native here. Thunder Strike recipe boosts electric damage by 40%.', 'pkm005,pkm015,pkm024', 'rec007', 'hab012'),
('guid010', 'Frost Peak Exploration Guide', 'frost-peak-guide', 'guides', 'frost peak pokopia', 'Frost Peak habitat at Level 20. Ice Armor is essential here. Glacior and Snorizard are native. Best place for ice-type farming.', 'pkm008,pkm014,pkm029', 'rec008', 'hab005'),
('guid011', 'Best Defense Team Build', 'best-defense-team-pokopia', 'team', 'defense team pokopia', 'Build an unbreakable defense team: Bulbin + Tidlet + Mechabit. Steel Shell recipe adds +60% defense. Perfect for holding ground.', 'pkm002,pkm008,pkm010', 'rec012', 'hab002,hab005,hab004'),
('guid012', 'Dragon-Type Mastery Guide', 'dragon-type-guide', 'guides', 'dragon type pokopia', 'Dragon-types are powerful but rare. Snorizard at Frost Peak. Voltscale at Thunder Arena. Dragon''s Fury recipe boosts dragon damage.', 'pkm015,pkm029', 'rec011', 'hab005,hab012'),
('guid013', 'Complete Recipe List and Effects', 'complete-recipe-list', 'guides', 'recipes pokopia', 'Full list of all recipes and their effects. Lucky Charm is best for legendary hunting. Mega Restore for emergencies. Fire Boost for boss fights.', 'pkm001,pkm007', 'rec005,rec015,rec002', 'hab001'),
('guid014', 'Sky Isles and Flying-Type Guide', 'sky-isles-guide', 'guides', 'sky isles pokopia', 'Sky Isles opens at Level 18. Breezel and Flamingo are common spawns. Flying High recipe boosts flying damage. Great for feather farming.', 'pkm016,pkm020,pkm025', 'rec013', 'hab008'),
('guid015', 'Mudstone River Habitat Guide', 'muddy-river-guide', 'guides', 'muddy river pokopia', 'Muddy River is easy habitat from Level 8. Mudkipz and Stealthfin spawn here. Muddy Swirl recipe boosts ground damage. Great for beginners.', 'pkm018,pkm021', 'rec014', 'hab009');

-- Sample News (5 -> 12)
INSERT INTO news (id, title, slug, category, excerpt, content, published_at) VALUES
('news001', 'New Pokémon Update v1.5 Released', 'new-pokemon-update-v15', 'update', '5 new Pokémon added in the latest update!', 'The v1.5 update brings 5 new Pokémon including the legendary Flamexor! Also includes balance changes and new recipes. Update now to experience the new content.', 1746652800),
('news002', 'Patch Notes v1.4.3 - Balance Changes', 'patch-notes-v143', 'patch', 'Major balance changes to fire-type abilities', 'Fire-type abilities have been adjusted. Flamexor nerfed by 10%. Charmuddy buffed. Fire Boost recipe duration increased to 1 hour.', 1746566400),
('news003', 'Spring Festival Event Starting Soon', 'spring-festival-event', 'event', 'Limited time spring festival with bonus drops', 'Spring Festival starts March 20! +50% rare drops and +100% XP for 2 weeks. Special recipes available during event.', 1746480000),
('news004', 'New Shadow Marsh Habitat Now Available', 'shadow-marsh-release', 'announcement', 'Face the ultimate challenge in Shadow Marsh', 'Shadow Marsh is now open! Face Shadowclaw, the new legendary ghost Pokémon. +60% ghost drops. Only for Level 25+.', 1746393600),
('news005', 'Community Build Competition Winners', 'build-competition-winners', 'announcement', 'Check out the top community builds', 'Congratulations to our build competition winners! Top 3 builds featured on homepage. Winners receive 5000 gems each.', 1746307200),
('news006', 'Thunder Arena Grand Opening', 'thunder-arena-opening', 'announcement', 'New habitat Thunder Arena now open!', 'Thunder Arena opens at Level 22. Home to Voltscale, the legendary electric dragon! +55% electric drops. Bring Thunder Strike recipe!', 1746220800),
('news007', 'Bug Fixes and Performance Improvements', 'patch-notes-v144', 'patch', 'Version 1.4.4 fixes critical bugs', 'Fixed crash when entering Shadow Marsh. Improved frame rate on mobile. Fixed recipe_buff not applying correctly.', 1746134400),
('news008', 'Summer Beach Event Coming Next Month', 'summer-beach-event', 'event', 'Beach event with exclusive rewards', 'Summer Beach Event in June! New water Pokémon. Special Sunny Beach habitat. Beach-themed recipes and cosmetics.', 1746048000),
('news009', 'New Player Guide: Getting Started', 'new-player-guide', 'announcement', 'Complete guide for new players', 'New to Pokopia? Check out our getting started guide. Learn about habitats, recipes, and how to catch your first Pokémon.', 1745961600),
('news010', 'Community Submissions Now Open', 'community-submissions-open', 'announcement', 'Submit your builds and guides', 'Community submissions now open! Submit your best builds, guides, and fan art. Top submissions featured on site.', 1745875200),
('news011', 'Double XP Weekend Event', 'double-xp-weekend', 'event', 'This weekend only: Double XP!', 'Double XP this weekend! March 15-17. All habitats. Stack with Lucky Charm for triple XP. Perfect time to level up!', 1745788800),
('news012', 'Top 10 Most Popular Pokémon', 'top-10-popular-pokemon', 'announcement', 'Community votes on favorite Pokémon', 'Results are in! Pikafire takes #1 spot. Flamexor #2. Shados #3. See the full list on our Tier List page.', 1745702400);
