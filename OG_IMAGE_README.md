# OG Image

## Files
- `public/og-image.svg` — Twitter 兼容（SVG）
- `public/og-image-template.html` — 可直接在浏览器打开并截图

## 生成 PNG/JPEG 方法

### 方法 1: 浏览器截图（推荐）
1. 用浏览器打开 `public/og-image-template.html`
2. 截图工具截取整个页面（1200×630px）
3. 保存为 `public/og-image.png`

### 方法 2: 命令行转换
```bash
# 使用 rsvg-convert
rsvg-convert -w 1200 -h 630 public/og-image.svg > public/og-image.png

# 使用 ImageMagick
convert public/og-image.svg -resize 1200x630 public/og-image.png

# 使用 sharp (Node.js)
npm install sharp
node -e "const sharp=require('sharp'); sharp('public/og-image.svg').resize(1200,630).toFile('public/og-image.png')"
```

### 方法 3: 在线工具
- https://cloudconvert.com/svg-to-png
- https://www.iloveimg.com/resize-image/resize-svg

## 当前状态
- Twitter: ✅ 支持 SVG
- Facebook/LinkedIn: ⚠️ 需要 PNG/JPEG（请运行上述方法之一生成）
