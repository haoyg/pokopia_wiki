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
  overview?: string
  how_to_get?: string[]
  best_use?: string[]
  team_tips?: string[]
  farming_notes?: string[]
  common_mistakes?: string[]
  faqs?: {
    question: string
    answer: string
  }[]
  updated_at?: string
  image_url?: string
  image_alt?: string
  image_source?: string
  image_source_url?: string
  image_license_note?: string
  data_status?: string
  data_status_note?: string
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
  overview?: string
  unlock_steps?: string[]
  recommended_team?: string[]
  farming_route?: string[]
  rare_spawns?: string[]
  resource_notes?: string[]
  common_mistakes?: string[]
  faqs?: {
    question: string
    answer: string
  }[]
  recommended_recipe?: string
  updated_at?: string
  image_url?: string
  image_alt?: string
  image_source?: string
  image_source_url?: string
  image_license_note?: string
  data_status?: string
  data_status_note?: string
}

export interface Recipe {
  id: string
  name: string
  ingredients: string[]
  buff: string
  effect_duration: string
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary'
  best_use: string
  overview?: string
  ingredient_route?: string[]
  best_timing?: string[]
  recommended_for?: string[]
  alternatives?: string[]
  common_mistakes?: string[]
  faqs?: {
    question: string
    answer: string
  }[]
  related_pokemon?: string
  related_habitats?: string
  updated_at?: string
  image_url?: string
  image_alt?: string
  image_source?: string
  image_source_url?: string
  image_license_note?: string
  data_status?: string
  data_status_note?: string
}

export interface Guide {
  id: string
  title: string
  slug: string
  category: string
  seo_keyword: string
  content: string
  answer?: string
  steps?: string[]
  recommended_setup?: string[]
  common_mistakes?: string[]
  faqs?: {
    question: string
    answer: string
  }[]
  published_at?: string
  updated_at?: string
  image_url?: string
  image_alt?: string
  image_source?: string
  image_source_url?: string
  image_license_note?: string
  data_status?: string
  data_status_note?: string
  related_pokemon: string   // CSV string, e.g. "pkm001,pkm002"
  related_items: string     // CSV string
  related_habitats: string  // CSV string
}

export interface News {
  id: string
  title: string
  slug: string
  category: 'official' | 'trailer' | 'source-roundup' | 'site-update'
  excerpt: string
  content: string
  image_url?: string
  image_alt?: string
  image_source?: string
  image_source_url?: string
  image_license_note?: string
  verified_status?: string
  source_label?: string
  source_url?: string
  source_type?: string
  published_at: number
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
