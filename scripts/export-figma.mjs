// Pulls garment photos, occasion banners and the logo out of the Figma file.
// Usage: npm run figma:export            (writes into public/)
//        npm run figma:export -- --sheet out.png   (also writes a contact sheet of all garments)
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const FILE_KEY = 'IQTTAGsYoKXWnLAp1ccIOV'
const ROOT = path.resolve(import.meta.dirname, '..')
const PUBLIC = path.join(ROOT, 'public')

// Figma node IDs (Mobile UI page)
const GARMENTS_SECTION = '7303:52688' // "front and back": frontandback01..21, each with front=true / front=false
const LOGO = '7303:52618'
const BANNERS = {
  casual: '7291:40491',
  outdoors: '7291:40497',
  work: '7291:40501',
  beach: '7291:40487',
  evening: '7291:40493',
  maternity: '7291:40495',
  'business-casual': '7291:40489',
  sport: '7291:40499',
}

const token = (await fs.readFile(path.join(ROOT, '.figma-token'), 'utf8')).trim()

async function api(endpoint) {
  const res = await fetch(`https://api.figma.com/v1/${endpoint}`, { headers: { 'X-Figma-Token': token } })
  if (!res.ok) throw new Error(`Figma API ${res.status}: ${await res.text()}`)
  return res.json()
}

async function renderNodes(ids, { scale = 1, format = 'png' } = {}) {
  const urls = {}
  for (let i = 0; i < ids.length; i += 20) {
    const batch = ids.slice(i, i + 20)
    const r = await api(`images/${FILE_KEY}?ids=${batch.join(',')}&scale=${scale}&format=${format}`)
    Object.assign(urls, r.images)
  }
  const out = {}
  for (const [id, url] of Object.entries(urls)) {
    if (!url) throw new Error(`Figma could not render node ${id}`)
    out[id] = Buffer.from(await (await fetch(url)).arrayBuffer())
  }
  return out
}

// --- Garments -------------------------------------------------------------
const section = (await api(`files/${FILE_KEY}/nodes?ids=${GARMENTS_SECTION}&depth=3`)).nodes[GARMENTS_SECTION].document
const garments = section.children
  .filter((c) => /^frontandback\d+$/.test(c.name))
  .map((c) => {
    const side = (front) => c.children.find((v) => v.name === `front=${front}`).children.find((n) => n.type === 'RECTANGLE').id
    return { id: 'g' + c.name.match(/\d+$/)[0], front: side(true), back: side(false) }
  })
  .sort((a, b) => a.id.localeCompare(b.id))

console.log(`Rendering ${garments.length} garments (front + back)…`)
const garmentPngs = await renderNodes(garments.flatMap((g) => [g.front, g.back]), { scale: 1 })
await fs.mkdir(path.join(PUBLIC, 'garments'), { recursive: true })

const manifest = []
for (const g of garments) {
  const entry = { id: g.id }
  for (const side of ['front', 'back']) {
    const file = `garments/${g.id}-${side}.webp`
    const img = sharp(garmentPngs[g[side]]).trim({ threshold: 5 }).resize({ height: 900, withoutEnlargement: true })
    const info = await img.webp({ quality: 86 }).toFile(path.join(PUBLIC, file))
    entry[side] = { src: '/' + file, width: info.width, height: info.height }
  }
  manifest.push(entry)
}
await fs.writeFile(path.join(ROOT, 'src/data/garment-images.json'), JSON.stringify(manifest, null, 2) + '\n')

// --- Occasion banners ------------------------------------------------------
console.log('Rendering occasion banners…')
const bannerPngs = await renderNodes(Object.values(BANNERS), { scale: 1 })
await fs.mkdir(path.join(PUBLIC, 'events'), { recursive: true })
for (const [name, id] of Object.entries(BANNERS)) {
  await sharp(bannerPngs[id]).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(PUBLIC, `events/${name}.webp`))
}

// --- Logo ------------------------------------------------------------------
console.log('Exporting logo…')
const svg = await renderNodes([LOGO], { format: 'svg' })
await fs.mkdir(path.join(PUBLIC, 'brand'), { recursive: true })
await fs.writeFile(path.join(PUBLIC, 'brand/logo.svg'), svg[LOGO])

// --- Optional contact sheet ------------------------------------------------
const sheetArg = process.argv.indexOf('--sheet')
if (sheetArg !== -1) {
  const cell = 220, cols = 7
  const tiles = []
  for (const [i, g] of manifest.entries()) {
    for (const [j, side] of ['front', 'back'].entries()) {
      const thumb = await sharp(path.join(PUBLIC, g[side].src)).resize(cell - 20, cell - 40, { fit: 'contain', background: '#f4eeee' }).png().toBuffer()
      const label = Buffer.from(`<svg width="${cell}" height="30"><text x="10" y="20" font-size="16" font-family="sans-serif">${g.id} ${side}</text></svg>`)
      const col = (i % cols), row = Math.floor(i / cols) * 2 + j
      tiles.push({ input: thumb, left: col * cell + 10, top: row * cell + 30 }, { input: label, left: col * cell, top: row * cell })
    }
  }
  const rows = Math.ceil(manifest.length / cols) * 2
  await sharp({ create: { width: cols * cell, height: rows * cell, channels: 3, background: '#f4eeee' } }).composite(tiles).png().toFile(process.argv[sheetArg + 1])
  console.log('Contact sheet:', process.argv[sheetArg + 1])
}

console.log('Done.')
