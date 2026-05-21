export interface Pokemon {
  id: string
  name: string
  type: string
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary'
  habitat: string
  favorite_food: string
  spawn_time: string
  weather: string
  specialty: string
  skills: string[]
  drops: string[]
  description: string
  image_url?: string
  image_alt?: string
}

export interface Habitat {
  id: string
  name: string
  unlock_condition: string
  spawn_list: string   // CSV string, e.g. "pkm001,pkm002"
  recommended_build: string
  weather: string
  difficulty: 'easy' | 'medium' | 'hard'
  resource_bonus: string
}

export interface Recipe {
  id: string
  name: string
  ingredients: string[]
  buff: string
  effect_duration: string
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary'
  best_use: string
}

export interface Guide {
  id: string
  title: string
  slug: string
  category: string
  seo_keyword: string
  content: string
  image_url?: string
  image_alt?: string
  related_pokemon: string   // CSV string, e.g. "pkm001,pkm002"
  related_items: string     // CSV string
  related_habitats: string  // CSV string
}

export interface News {
  id: string
  title: string
  slug: string
  category: 'update' | 'patch' | 'event' | 'announcement'
  excerpt: string
  content: string
  image_url?: string
  image_alt?: string
  published_at: string
}

export interface Build {
  id: string
  title: string
  author: string
  description: string
  pokemon_team: string[]
  habitat_layout: string
  likes: number
}
