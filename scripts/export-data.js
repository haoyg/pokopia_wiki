// Script to export D1 data to static JSON files
// Run: node scripts/export-data.js

const DB = require('better-sqlite3');

async function exportData() {
  const db = new DB('./pokopia.db');

  const pokemon = db.prepare('SELECT * FROM pokemon ORDER BY name').all();
  const habitats = db.prepare('SELECT * FROM habitats ORDER BY name').all();
  const recipes = db.prepare('SELECT * FROM recipes ORDER BY name').all();
  const guides = db.prepare('SELECT * FROM guides ORDER BY published_at DESC').all();
  const news = db.prepare('SELECT * FROM news ORDER BY published_at DESC').all();

  const fs = require('fs');
  const path = require('path');

  const publicDir = path.join(__dirname, '..', 'public', 'data');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'pokemon.json'), JSON.stringify(pokemon, null, 2));
  fs.writeFileSync(path.join(publicDir, 'habitats.json'), JSON.stringify(habitats, null, 2));
  fs.writeFileSync(path.join(publicDir, 'recipes.json'), JSON.stringify(recipes, null, 2));
  fs.writeFileSync(path.join(publicDir, 'guides.json'), JSON.stringify(guides, null, 2));
  fs.writeFileSync(path.join(publicDir, 'news.json'), JSON.stringify(news, null, 2));

  console.log('Data exported to public/data/');
  db.close();
}

exportData().catch(console.error);
