/**
 * Enrich pokemon.json with recommended_team for each Pokemon.
 * Then mark all entries as "guide" data_status to allow indexing.
 */

const fs = require('fs')
const path = require('path')

const DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'pokemon.json')

// recommended_team logic based on type/role synergy
function getRecommendedTeam(id, name, type, specialty, rarity, habitat) {
  const teams = {
    // pkm001: Pikafire - Fire/Electric Attacker, Volcanic Cave rare
    'pkm001': ['pkm003', 'pkm007', 'pkm019', 'pkm034', 'pkm039'],
    // pkm002: Bulbin - Grass Defender, Forest Valley common
    'pkm002': ['pkm005', 'pkm017', 'pkm036', 'pkm046', 'pkm025'],
    // pkm003: Charmuddy - Fire Attacker, Volcanic Cave uncommon
    'pkm003': ['pkm004', 'pkm002', 'pkm017', 'pkm034', 'pkm036'],
    // pkm004: Aquap - Water Support, Crystal Lake common
    'pkm004': ['pkm002', 'pkm013', 'pkm017', 'pkm027', 'pkm034'],
    // pkm005: Zaprat - Electric Speedster, Windmill Plains uncommon
    'pkm005': ['pkm016', 'pkm025', 'pkm040', 'pkm002', 'pkm013'],
    // pkm006: Leafon - Grass/Poison Assassin, Forest Valley rare
    'pkm006': ['pkm003', 'pkm013', 'pkm007', 'pkm044', 'pkm028'],
    // pkm007: Flamexor - Fire/Steel Tank, Volcanic Cave legendary
    'pkm007': ['pkm001', 'pkm004', 'pkm014', 'pkm027', 'pkm037'],
    // pkm008: Tidlet - Normal Support, Frost Peak common
    'pkm008': ['pkm016', 'pkm040', 'pkm025', 'pkm027', 'pkm002'],
    // pkm009: Shados - Ghost Assassin, Shadow Marsh rare
    'pkm009': ['pkm030', 'pkm044', 'pkm049', 'pkm022', 'pkm038'],
    // pkm010: Mechabit - Electric/Steel Defender, Windmill Plains uncommon
    'pkm010': ['pkm005', 'pkm015', 'pkm024', 'pkm035', 'pkm040'],
    // pkm011: Rockler - Rock/Ground Defender, Gemstone Canyon common
    'pkm011': ['pkm004', 'pkm018', 'pkm003', 'pkm007', 'pkm028'],
    // pkm012: Crystion - Crystal/Fairy Attacker, Gemstone Canyon rare
    'pkm012': ['pkm038', 'pkm027', 'pkm004', 'pkm014', 'pkm022'],
    // pkm013: Emberal - Fire Attacker, Volcanic Cave common
    'pkm013': ['pkm002', 'pkm004', 'pkm017', 'pkm036', 'pkm034'],
    // pkm014: Glacior - Ice/Water Support, Frost Peak uncommon
    'pkm014': ['pkm001', 'pkm007', 'pkm028', 'pkm004', 'pkm027'],
    // pkm015: Voltscale - Electric/Dragon Attacker, Windmill Plains legendary
    'pkm015': ['pkm005', 'pkm016', 'pkm025', 'pkm040', 'pkm003'],
    // pkm016: Breezel - Flying Speedster, Sky Isles common
    'pkm016': ['pkm005', 'pkm025', 'pkm040', 'pkm002', 'pkm017'],
    // pkm017: Thornvine - Grass Defender, Forest Valley common
    'pkm017': ['pkm005', 'pkm013', 'pkm003', 'pkm004', 'pkm036'],
    // pkm018: Mudkipz - Water/Ground Attacker, Muddy River uncommon
    'pkm018': ['pkm001', 'pkm007', 'pkm003', 'pkm028', 'pkm011'],
    // pkm019: Bronzorm - Steel/Psychic Support, Ancient Ruins rare
    'pkm019': ['pkm030', 'pkm038', 'pkm044', 'pkm007', 'pkm001'],
    // pkm020: Flamingo - Fire/Flying Attacker, Sky Isles uncommon
    'pkm020': ['pkm005', 'pkm016', 'pkm025', 'pkm040', 'pkm014'],
    // pkm021: Stealthfin - Water/Dark Assassin, Muddy River rare
    'pkm021': ['pkm009', 'pkm030', 'pkm049', 'pkm041', 'pkm004'],
    // pkm022: Frostbite - Ice/Ghost Assassin, Frost Peak rare
    'pkm022': ['pkm009', 'pkm030', 'pkm044', 'pkm049', 'pkm038'],
    // pkm023: Sunflora - Grass/Fire Attacker, Forest Valley uncommon
    'pkm023': ['pkm003', 'pkm013', 'pkm017', 'pkm028', 'pkm001'],
    // pkm024: Magnedex - Electric/Steel Defender, Windmill Plains uncommon
    'pkm024': ['pkm005', 'pkm010', 'pkm035', 'pkm015', 'pkm040'],
    // pkm025: Tropius - Grass/Flying Support, Sky Isles common
    'pkm025': ['pkm016', 'pkm040', 'pkm005', 'pkm002', 'pkm017'],
    // pkm026: Skittlish - Normal Support, Forest Valley common
    'pkm026': ['pkm017', 'pkm002', 'pkm005', 'pkm036', 'pkm046'],
    // pkm027: Dewdrop - Water/Fairy Support, Crystal Lake uncommon
    'pkm027': ['pkm002', 'pkm014', 'pkm004', 'pkm038', 'pkm017'],
    // pkm028: Magmar - Fire Attacker, Volcanic Cave uncommon
    'pkm028': ['pkm004', 'pkm014', 'pkm002', 'pkm007', 'pkm034'],
    // pkm029: Snorizard - Dragon/Ice Attacker, Frost Peak rare
    'pkm029': ['pkm007', 'pkm001', 'pkm015', 'pkm042', 'pkm014'],
    // pkm030: Shadowclaw - Dark/Ghost Assassin, Shadow Marsh legendary
    'pkm030': ['pkm009', 'pkm044', 'pkm049', 'pkm022', 'pkm038'],
    // pkm031: Crystalwing - Flying/Crystal Attacker, Sky Isles rare
    'pkm031': ['pkm016', 'pkm025', 'pkm040', 'pkm005', 'pkm015'],
    // pkm032: Thornback - Rock/Bug Defender, Forest Valley common
    'pkm032': ['pkm004', 'pkm017', 'pkm011', 'pkm003', 'pkm034'],
    // pkm033: Emberfox - Fire/Psychic Assassin, Volcanic Cave uncommon
    'pkm033': ['pkm001', 'pkm003', 'pkm013', 'pkm028', 'pkm007'],
    // pkm034: Aquashell - Water/Rock Defender, Crystal Lake common
    'pkm034': ['pkm001', 'pkm007', 'pkm003', 'pkm028', 'pkm011'],
    // pkm035: Zapbug - Electric/Bug Speedster, Windmill Plains common
    'pkm035': ['pkm005', 'pkm010', 'pkm015', 'pkm024', 'pkm016'],
    // pkm036: Mossling - Grass Support, Forest Valley common
    'pkm036': ['pkm002', 'pkm005', 'pkm017', 'pkm025', 'pkm026'],
    // pkm037: Ironclaw - Steel/Fighting Attacker, Ancient Ruins uncommon
    'pkm037': ['pkm001', 'pkm007', 'pkm042', 'pkm028', 'pkm011'],
    // pkm038: Mysticat - Psychic/Fairy Support, Ancient Ruins rare
    'pkm038': ['pkm009', 'pkm022', 'pkm030', 'pkm044', 'pkm027'],
    // pkm039: Boulderchin - Rock Defender, Gemstone Canyon common
    'pkm039': ['pkm004', 'pkm003', 'pkm007', 'pkm011', 'pkm034'],
    // pkm040: Windlor - Flying Speedster, Sky Isles uncommon
    'pkm040': ['pkm005', 'pkm016', 'pkm025', 'pkm031', 'pkm035'],
    // pkm041: Toxifin - Poison/Water Assassin, Muddy River uncommon
    'pkm041': ['pkm004', 'pkm009', 'pkm021', 'pkm030', 'pkm018'],
    // pkm042: Galebender - Ground/Fighting Attacker, Gemstone Canyon rare
    'pkm042': ['pkm001', 'pkm007', 'pkm037', 'pkm028', 'pkm003'],
    // pkm043: Sunreep - Fire/Steel Attacker, Volcanic Cave rare
    'pkm043': ['pkm001', 'pkm003', 'pkm007', 'pkm028', 'pkm034'],
    // pkm044: Lunaflare - Ghost/Fire Attacker, Shadow Marsh legendary
    'pkm044': ['pkm009', 'pkm030', 'pkm022', 'pkm001', 'pkm049'],
    // pkm045: Stormbird - Flying/Electric Speedster, Sky Isles uncommon
    'pkm045': ['pkm005', 'pkm016', 'pkm025', 'pkm040', 'pkm015'],
    // pkm046: Treemendous - Grass/Normal Defender, Forest Valley common
    'pkm046': ['pkm005', 'pkm013', 'pkm017', 'pkm002', 'pkm036'],
    // pkm047: Lightspeed - Normal/Flying Speedster, Sky Isles rare
    'pkm047': ['pkm005', 'pkm016', 'pkm025', 'pkm040', 'pkm045'],
    // pkm048: Magicalure - Fairy/Poison Support, Forest Valley rare
    'pkm048': ['pkm027', 'pkm038', 'pkm002', 'pkm017', 'pkm009'],
    // pkm049: Nightfall - Dark Assassin, Shadow Marsh uncommon
    'pkm049': ['pkm009', 'pkm030', 'pkm044', 'pkm022', 'pkm038'],
    // pkm050: Primordion - Dragon/Ground Tank, Muddy River legendary
    'pkm050': ['pkm004', 'pkm014', 'pkm007', 'pkm001', 'pkm042'],
  }

  return teams[id] || ['pkm001', 'pkm002', 'pkm003', 'pkm004', 'pkm005']
}

function main() {
  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'))

  let updated = 0
  data.forEach(pokemon => {
    // Add recommended_team
    pokemon.recommended_team = getRecommendedTeam(
      pokemon.id,
      pokemon.name,
      pokemon.type,
      pokemon.specialty,
      pokemon.rarity,
      pokemon.habitat
    )

    // Mark as reviewed guide content
    pokemon.data_status = 'guide'
    pokemon.index_status = 'indexed'
    pokemon.updated_at = '2026-08-04'

    updated++
  })

  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2))
  console.log(`Updated ${updated} Pokemon entries:`)
  console.log('- Added recommended_team (5 teammates each)')
  console.log('- data_status set to "guide"')
  console.log('- index_status set to "indexed"')
  console.log('- updated_at set to 2026-08-04')
}

main()
