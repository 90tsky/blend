// Pulls event banner photos, Try-On photos and icons out of the Blend-remake Figma file (read-only).
// Usage: npm run figma:assets   (writes into public/ and src/assets/icons/)
// Garment photos still come from `npm run figma:export`.
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const FILE_KEY = 'bYTCLufBocYOUavvlHgAdy'
const ROOT = path.resolve(import.meta.dirname, '..')
const PUBLIC = path.join(ROOT, 'public')
const ICONS = path.join(ROOT, 'src', 'assets', 'icons')

// Image fills, by their Figma image hash (the photo without the banner's title or shade).
const PHOTOS = {
  'events/casual.webp': '7e9dfc354c9f96499995a4329ad96a78e7c8c5c5',
  'events/outdoors.webp': 'd4c8a5618fd589b1cf413ad60138d1023e2eb5f7',
  'events/office-hours.webp': '2d38836154ec473e640bcfb2bf3ef9420b9c0a8f',
  'events/day-off.webp': '5766b407665f5eb210fd506b996a6299ec6a5181',
  'events/maternity.webp': 'bc46154baca93f02ab3f16b795ec5947b4c00348',
  'events/working-out.webp': 'eff3dad2c335fddede84fec1a077728b6f7a765f',
  'events/night-out.webp': '7d69e3a33e7379050a055cd0f613215a11d9843f',
  'events/beach-day.webp': '0cd61881af247cb5a94c356c397c5d26e7eea2cf',
  'try-on/person-demo.webp': '4e4af1cd5c7763f30cb829749365126983092f74',
  'try-on/example-not-like-this.webp': 'ec811499569c0220fe6cbfc8c6e76aebf9fdfd99',
}

// Rendered layers (keeps Figma's crop), PNG at 2x, saved as webp.
const RENDERS = {
  'gender/women.webp': 'I578:9476;588:136',
  'gender/men.webp': 'I578:9476;588:138',
}

// Icon components, saved as SVG with their fill switched to currentColor.
const SVG_ICONS = {
  menu: '488:18117',
  search: '488:18115',
  'turn-around': '488:18116',
  'ai-sparkle': '1280:1787',
  back: '1596:6906',
  close: '1596:6915',
  'glyph-top': '1793:212',
  'glyph-bottom': '1793:215',
  tick: '1807:13066',
  cross: '1807:13069',
  add: '1803:442',
  check: '1803:445',
  timer: '1734:208',
  'switch-camera': '1928:14947',
}

const token = (await fs.readFile(path.join(ROOT, '.figma-token'), 'utf8')).trim()

async function api(endpoint) {
  const res = await fetch(`https://api.figma.com/v1/${endpoint}`, { headers: { 'X-Figma-Token': token } })
  if (!res.ok) throw new Error(`Figma API ${res.status}: ${await res.text()}`)
  return res.json()
}

async function download(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download ${res.status} for ${url}`)
  return Buffer.from(await res.arrayBuffer())
}

async function saveWebp(buffer, relPath, maxWidth = 1200) {
  const target = path.join(PUBLIC, relPath)
  await fs.mkdir(path.dirname(target), { recursive: true })
  await sharp(buffer).resize({ width: maxWidth, withoutEnlargement: true }).webp({ quality: 82 }).toFile(target)
  console.log('wrote', relPath)
}

// 1. Photos from image fills
const { meta } = await api(`files/${FILE_KEY}/images`)
for (const [relPath, hash] of Object.entries(PHOTOS)) {
  const url = meta.images[hash]
  if (!url) { console.warn('missing image fill', hash, 'for', relPath); continue }
  await saveWebp(await download(url), relPath)
}

// 2. Rendered layers
const renderIds = Object.values(RENDERS)
const renders = await api(`images/${FILE_KEY}?ids=${encodeURIComponent(renderIds.join(','))}&scale=2&format=png`)
for (const [relPath, id] of Object.entries(RENDERS)) {
  const url = renders.images[id]
  if (!url) { console.warn('render failed for', id); continue }
  await saveWebp(await download(url), relPath, 600)
}

// 3. Icons as SVG
await fs.mkdir(ICONS, { recursive: true })
const iconIds = Object.values(SVG_ICONS)
const svgs = await api(`images/${FILE_KEY}?ids=${encodeURIComponent(iconIds.join(','))}&format=svg&svg_include_id=false&svg_simplify_stroke=true`)
for (const [name, id] of Object.entries(SVG_ICONS)) {
  const url = svgs.images[id]
  if (!url) { console.warn('svg failed for', name); continue }
  const svg = (await download(url)).toString('utf8')
    .replace(/fill="(?!none)[^"]*"/g, 'fill="currentColor"')
    .replace(/stroke="(?!none)[^"]*"/g, 'stroke="currentColor"')
  await fs.writeFile(path.join(ICONS, `${name}.svg`), svg)
  console.log('wrote icons/' + name + '.svg')
}
