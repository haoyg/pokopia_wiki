# SVG Icons - Pokopia Portal

## Type Icons (16 types)
- `/icons/fire.svg` - 🔥 Fire
- `/icons/water.svg` - 💧 Water
- `/icons/grass.svg` - 🌿 Grass
- `/icons/electric.svg` - ⚡ Electric
- `/icons/ice.svg` - ❄️ Ice
- `/icons/ghost.svg` - 👻 Ghost
- `/icons/dark.svg` - 🌑 Dark
- `/icons/dragon.svg` - 🐉 Dragon
- `/icons/steel.svg` - ⚙️ Steel
- `/icons/rock.svg` - 🪨 Rock
- `/icons/ground.svg` - 🌍 Ground
- `/icons/flying.svg` - 🕊️ Flying
- `/icons/normal.svg` - ⚪ Normal
- `/icons/poison.svg` - ☠️ Poison
- `/icons/fairy.svg` - ✨ Fairy
- `/icons/crystal.svg` - 💎 Crystal

## Habitat Icons
- `/icons/habitat-volcanic.svg` - Volcanic Cave
- `/icons/habitat-forest.svg` - Forest Valley
- `/icons/habitat-lake.svg` - Crystal Lake
- `/icons/habitat-plains.svg` - Windmill Plains
- `/icons/habitat-frost.svg` - Frost Peak
- `/icons/habitat-shadow.svg` - Shadow Marsh

## Usage in Code
Replace emoji with Image component or direct SVG reference:
```tsx
import Image from 'next/image'
<Image src="/icons/fire.svg" alt="Fire" width={48} height={48} />
```

## Style Guide
- All icons use viewBox="0 0 100 100"
- Gradients defined in defs for depth
- Consistent circle background for type icons
- 512x512 recommended if rasterized