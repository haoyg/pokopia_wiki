const https = require('https');
const fs = require('fs');
const path = require('path');

const OUT_DIR = 'public/images/habitats';

// Ensure directory exists
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// Map each habitat to search keywords for Pexels
const habitats = [
  { id: '001', name: 'Volcanic Cave', search: 'volcanic+cave+lava' },
  { id: '051', name: 'Grave offering', search: 'cemetery+path+trees' },
  { id: '052', name: 'Creepy grave offering', search: 'dark+cemetery+night' },
  { id: '053', name: 'Chansey Resting area', search: 'meadow+flowers+clearing' },
  { id: '054', name: 'Irresistible scent and glow', search: 'glowing+forest+fireflies' },
  { id: '055', name: 'Floating in the shade', search: 'forest+shade+light+beams' },
  { id: '056', name: 'Smooth tall grass', search: 'green+meadow+grass+field' },
  { id: '057', name: 'Factory Storage', search: 'industrial+warehouse+storage' },
  { id: '058', name: 'Luxury chirp-chirp meal', search: 'picnic+table+forest+nature' },
  { id: '059', name: 'Berry-feast Campsite', search: 'camping+tent+berries+forest' },
  { id: '060', name: 'Rain Dance site', search: 'rain+puddle+reflection+nature' },
  { id: '061', name: 'Sunny Day site', search: 'sunny+meadow+flowers+grass' },
  { id: '062', name: "Professor's treasure trove", search: 'treasure+chest+books+library' },
  { id: '063', name: 'Crazy log handicrafts', search: 'wooden+crafts+logs+artisan' },
  { id: '064', name: 'Very-berry space', search: 'strawberry+berry+bush+garden' },
  { id: '065', name: 'Garden Terrace', search: 'garden+terrace+flowers+balcony' },
  { id: '066', name: 'Tree-shaded snoozing Snorlax', search: 'sleeping+cat+forest+tree' },
  { id: '067', name: 'Good old-fashioned antiques', search: 'antique+furniture+vintage+retro' },
  { id: '068', name: "Nothin' but Poke Balls", search: 'pokemon+pokeball+balls+collection' },
  { id: '069', name: 'Yellow tall grass', search: 'yellow+grass+field+wheat+sunflower' },
];

async function fetchUrl(url, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
      if (res.statusCode !== 200) { resolve(null); return; }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
    setTimeout(() => { req.destroy(); resolve(null); }, timeout);
  });
}

async function getPexelsPhotoIds(searchQuery, count = 3) {
  const searchUrl = `https://www.pexels.com/search/${encodeURIComponent(searchQuery)}/`;
  const html = await fetchUrl(searchUrl);
  if (!html) return [];
  const str = html.toString('utf8');
  const ids = [];
  const regex = /\/photo\/(\d+)/g;
  let match;
  while ((match = regex.exec(str)) !== null && ids.length < count) {
    if (!ids.includes(match[1])) ids.push(match[1]);
  }
  return ids;
}

async function downloadPexelsPhoto(photoId, outPath) {
  // Try to get the full-size download URL via pexels CDN
  const url = `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=800`;
  const buffer = await fetchUrl(url);
  if (!buffer) return false;
  fs.writeFileSync(outPath, buffer);
  return true;
}

async function main() {
  console.log(`Downloading ${habitats.length} habitat images...\n`);

  for (const hab of habitats) {
    const outPath = path.join(OUT_DIR, `${hab.id}.png`);
    if (fs.existsSync(outPath)) {
      console.log(`SKIP ${hab.id} (exists)`);
      continue;
    }

    process.stdout.write(`DOWNLOADING ${hab.id} (${hab.name})... `);

    const photoIds = await getPexelsPhotoIds(hab.search, 3);
    if (photoIds.length === 0) {
      console.log('NO PHOTOS FOUND');
      continue;
    }

    let downloaded = false;
    for (const pid of photoIds) {
      process.stdout.write(`[${pid}] `);
      const ok = await downloadPexelsPhoto(pid, outPath);
      if (ok) {
        console.log('OK');
        downloaded = true;
        break;
      }
    }

    if (!downloaded) console.log('FAILED');
    await new Promise(r => setTimeout(r, 500)); // polite delay
  }

  console.log('\nDone!');
}

main().catch(console.error);
