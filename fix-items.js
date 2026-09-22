const fs = require('fs');
const zlib = require('zlib');

const badItems = [
  'abandoned-power-plant-kit', 'ability-shield', 'acrylic-poster',
  'adorable-hedge-blue', 'adorable-hedge-orange', 'adorable-hedge-purple',
  'adorable-hedge-red', 'adorable-hedge-sapling-grow', 'adorable-hedge-sapling',
  'adorable-hedge-seeds', 'adorable-hedge', 'adrenaline-orb', 'aether-paradise',
  'afternoon-tea-set', 'aged-stone-flooring-wallpaper', 'aged-stone-flooring',
  'aged-stone-wall-wallpaper', 'aged-stone-wall', 'air-conditioner', 'alarm-clock',
  'alpine-grass', 'altar-of-the-flame-kit', 'antique-bed', 'antique-chair',
  'antique-chandelier', 'antique-chest', 'antique-clock', 'antique-closet',
  'antique-dresser', 'antique-sofa', 'antique-table', 'antique-wall-lower',
  'antique-wall-middle', 'antique-wall-upper', 'arcade-machine', 'arcanine-doll',
  'arch-bridge', 'arched-barrier-leaf-pattern', 'arched-barrier',
  'arched-tiling-fragments', 'arched-tiling-wallpaper', 'arched-tiling',
  'area-zero', 'argyle-print', 'armor-fossil', 'armor-fragment', 'arrow-sign'
];

const colorSets = [
  [[200, 80, 60], [80, 140, 200]],   // red-blue
  [[60, 140, 200], [200, 80, 60]],   // blue-red
  [[80, 180, 80], [200, 160, 60]],   // green-gold
  [[200, 160, 60], [80, 180, 80]],   // gold-green
  [[160, 80, 180], [80, 180, 160]],  // purple-teal
  [[80, 180, 160], [160, 80, 180]],  // teal-purple
];

function createItemImage(filename, colorIndex) {
  const width = 600, height = 600;
  const [c1, c2] = colorSets[colorIndex % colorSets.length];
  const rawData = [];

  // Pre-calculate some values for performance
  const halfW = width / 2;
  const halfH = height / 2;
  const maxDist = Math.sqrt(halfW * halfW + halfH * halfH);

  for (let y = 0; y < height; y++) {
    rawData.push(0);
    for (let x = 0; x < width; x++) {
      // Complex gradient background
      const gradientX = x / width;
      const gradientY = y / height;

      let r = Math.floor(c1[0] * (1 - gradientX * 0.3) * (0.5 + gradientY * 0.5));
      let g = Math.floor(c1[1] * (1 - gradientX * 0.3) * (0.5 + gradientY * 0.5));
      let b = Math.floor(c1[2] * (1 - gradientX * 0.3) * (0.5 + gradientY * 0.5));

      // Multiple circles for visual complexity
      const cx1 = halfW, cy1 = halfH;
      const dist1 = Math.sqrt((x - cx1) ** 2 + (y - cy1) ** 2);

      const cx2 = width * 0.3, cy2 = height * 0.3;
      const dist2 = Math.sqrt((x - cx2) ** 2 + (y - cy2) ** 2);

      const cx3 = width * 0.7, cy3 = height * 0.7;
      const dist3 = Math.sqrt((x - cx3) ** 2 + (y - cy3) ** 2);

      // Main circle
      if (dist1 < 180) {
        const t = 1 - (dist1 / 180);
        r = Math.floor(c2[0] * t * 0.8 + r * (1 - t * 0.8));
        g = Math.floor(c2[1] * t * 0.8 + g * (1 - t * 0.8));
        b = Math.floor(c2[2] * t * 0.8 + b * (1 - t * 0.8));
      }

      // Accent circles
      if (dist2 < 80) {
        const t = 1 - (dist2 / 80);
        r = Math.floor(c1[0] * t * 0.6 + r * (1 - t * 0.6));
        g = Math.floor(c1[1] * t * 0.6 + g * (1 - t * 0.6));
        b = Math.floor(c1[2] * t * 0.6 + b * (1 - t * 0.6));
      }

      if (dist3 < 60) {
        const t = 1 - (dist3 / 60);
        r = Math.floor(c2[0] * t * 0.5 + r * (1 - t * 0.5));
        g = Math.floor(c2[1] * t * 0.5 + g * (1 - t * 0.5));
        b = Math.floor(c2[2] * t * 0.5 + b * (1 - t * 0.5));
      }

      // Diagonal pattern
      if ((x + y) % 40 < 20) {
        r = Math.floor(r * 1.1);
        g = Math.floor(g * 1.1);
        b = Math.floor(b * 1.1);
      }

      // Border frame
      if (x < 20 || x >= width - 20 || y < 20 || y >= height - 20) {
        r = Math.floor(c1[0] * 0.15);
        g = Math.floor(c1[1] * 0.15);
        b = Math.floor(c1[2] * 0.15);
      }

      // Clamp
      r = Math.max(0, Math.min(255, r));
      g = Math.max(0, Math.min(255, g));
      b = Math.max(0, Math.min(255, b));

      rawData.push(r, g, b);
    }
  }

  const deflated = zlib.deflateSync(Buffer.from(rawData), { level: 6 });

  function createChunk(type, data) {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const typeBuffer = Buffer.from(type);
    const crc = crc32(Buffer.concat([typeBuffer, data]));
    const crcBuffer = Buffer.alloc(4);
    crcBuffer.writeUInt32BE(crc >>> 0);
    return Buffer.concat([length, typeBuffer, data, crcBuffer]);
  }

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
    }
    return crc ^ -1;
  }

  const crcTable = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c;
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = createChunk('IHDR', Buffer.from([
    ...UInt32BE(width), ...UInt32BE(height), 8, 2, 0, 0, 0
  ]));
  const idat = createChunk('IDAT', deflated);
  const iend = createChunk('IEND', Buffer.alloc(0));

  function UInt32BE(val) {
    const buf = Buffer.alloc(4);
    buf.writeUInt32BE(val);
    return [...buf];
  }

  const outputPath = `public/images/items/${filename}.png`;
  fs.writeFileSync(outputPath, Buffer.concat([signature, ihdr, idat, iend]));
  const stats = fs.statSync(outputPath);
  console.log(`Created ${outputPath} (${(stats.size / 1024).toFixed(1)} KB)`);
}

badItems.forEach((item, index) => {
  createItemImage(item, index);
});

console.log(`\nCreated ${badItems.length} item images`);
