import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const guides = JSON.parse(readFileSync('src/data/guides.json', 'utf8'));
const outputDir = 'public/images/guides';

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
    console.error(`  Failed: ${e.message}`);
    return false;
  }
}

function extractImageUrls(html) {
  const urls = [];
  // Match pokopiaguide.com assets
  const regex = /https:\/\/assets\.pokopiaguide\.com\/images\/guides\/[^"'\'']+\.(jpg|jpeg|png|webp)/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    urls.push(match[0]);
  }
  return [...new Set(urls)];
}

async function main() {
  // Get pokopiawiki guides that need images (guid100+) that have placeholder SVGs
  const wikiGuides = guides.filter(g =>
    g.slug &&
    g.id.startsWith('guid1') &&
    g.image_url &&
    g.image_url.endsWith('.svg')
  );

  console.log(`Found ${wikiGuides.length} guides with placeholder SVGs that need real images\n`);

  let success = 0;
  let failed = 0;

  for (const guide of wikiGuides) {
    process.stdout.write(`Processing: ${guide.slug}... `);

    try {
      // Try pokopiaguide.com first
      const html = await fetchPage(`https://pokopiaguide.com/guides/${guide.slug}`);
      let imageUrls = extractImageUrls(html);

      if (imageUrls.length === 0) {
        // Try with -en suffix
        const htmlEn = await fetchPage(`https://pokopiaguide.com/guides/${guide.slug}-en`);
        imageUrls = extractImageUrls(htmlEn);
      }

      if (imageUrls.length > 0) {
        // Get the first image and convert thumb URL to full image
        let url = imageUrls[0].replace('/thumb/', '/');
        const ext = url.split('.').pop();
        const filename = `${guide.slug}.${ext}`;
        const filepath = join(outputDir, filename);

        const ok = await downloadImage(url, filepath);
        if (ok) {
          guide.image_url = `/images/guides/${filename}`;
          guide.image_source = 'pokopiaguide.com';
          guide.image_source_url = `https://pokopiaguide.com/guides/${guide.slug}`;
          console.log(`✓ -> ${filename}`);
          success++;
        } else {
          console.log(`✗`);
          failed++;
        }
      } else {
        console.log(`no images found`);
        failed++;
      }

      await new Promise(r => setTimeout(r, 300));
    } catch (e) {
      console.error(`Error: ${e.message}`);
      failed++;
    }
  }

  writeFileSync('src/data/guides.json', JSON.stringify(guides, null, 2));

  console.log(`\n=== Results ===`);
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);
  console.log(`\nUpdated guides.json`);
}

main().catch(console.error);