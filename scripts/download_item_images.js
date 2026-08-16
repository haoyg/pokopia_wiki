import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const items = JSON.parse(readFileSync('src/data/items.json', 'utf-8'));
const outputDir = 'public/images/items';

mkdirSync(outputDir, { recursive: true });

async function fetchPage(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }
  });
  return await response.text();
}

async function downloadImage(url, filepath) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = await response.arrayBuffer();
    await writeFile(filepath, Buffer.from(buffer));
    return true;
  } catch (e) {
    return false;
  }
}

function extractImageUrls(html) {
  const urls = [];
  const regex = /(?:https:\/\/)?assets\.pokopiawiki\.com\/items\/[^"']+\.(jpg|jpeg|png|webp)/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    let url = match[0];
    if (!url.startsWith('https://')) url = 'https://' + url;
    urls.push(url);
  }
  return [...new Set(urls)];
}

async function main() {
  console.log(`Processing ${items.length} items...\n`);

  let success = 0;
  let failed = 0;

  for (const item of items) {
    const slug = item.slug || item.id;
    process.stdout.write(`${slug}... `);

    try {
      const html = await fetchPage(`https://pokopiawiki.com/items/${slug}`);
      const imageUrls = extractImageUrls(html);

      if (imageUrls.length > 0) {
        const ext = imageUrls[0].split('.').pop();
        const filename = `${slug}.${ext}`;
        const filepath = join(outputDir, filename);

        const ok = await downloadImage(imageUrls[0], filepath);
        if (ok) {
          item.image_url = `/images/items/${filename}`;
          item.image_alt = `${item.name} item image`;
          success++;
          console.log(`✓`);
        } else {
          failed++;
          console.log(`✗`);
        }
      } else {
        console.log(`no image`);
        failed++;
      }

      await new Promise(r => setTimeout(r, 200));
    } catch (e) {
      console.error(`Error: ${e.message}`);
      failed++;
    }
  }

  writeFileSync('src/data/items.json', JSON.stringify(items, null, 2));

  console.log(`\n=== Results ===`);
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);
}

main().catch(console.error);
