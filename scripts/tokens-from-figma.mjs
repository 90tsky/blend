// Turns the design tokens exported from Figma into CSS custom properties.
// Usage: npm run tokens   (reads design-tokens/figma-tokens.json, writes src/styles/figma-tokens.css)
// The JSON is exported from the Figma file (variable collections "theme" and "tokens"); Figma's
// variables REST API needs an Enterprise plan, so it is refreshed from the file, not fetched here.
import fs from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const SOURCE = path.join(ROOT, 'design-tokens', 'figma-tokens.json')
const TARGET = path.join(ROOT, 'src', 'styles', 'figma-tokens.css')

const tokens = JSON.parse(await fs.readFile(SOURCE, 'utf8'))

// '#rrggbb' or '#rrggbbaa' -> { r, g, b, a } with a in 0..1
function parseHex(hex) {
  const h = hex.replace('#', '')
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a }
}

// A colour with alpha laid over an opaque one, as Figma draws two stacked fills.
function over(topHex, bottomHex) {
  const t = parseHex(topHex)
  const b = parseHex(bottomHex)
  const mix = (x, y) => Math.round(x * t.a + y * (1 - t.a)).toString(16).padStart(2, '0')
  return `#${mix(t.r, b.r)}${mix(t.g, b.g)}${mix(t.b, b.b)}`
}

function colourLines(mode) {
  const lines = []
  for (const [name, v] of Object.entries(tokens.colors)) lines.push(`  --color-${name}: ${v[mode]};`)
  for (const [name, v] of Object.entries(tokens.effectColors)) lines.push(`  --effect-${name}: ${v[mode]};`)
  for (const [name, c] of Object.entries(tokens.composites)) {
    lines.push(`  --color-${name}: ${over(tokens.colors[c.top][mode], tokens.colors[c.bottom][mode])};`)
  }
  return lines
}

function shadow(layers) {
  return layers
    .map((l) => `${l.inset ? 'inset ' : ''}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px var(--effect-${l.color})`)
    .join(', ')
}

const shared = []
for (const [name, value] of Object.entries(tokens.numbers)) shared.push(`  --${name}: ${value}px;`)
for (const [name, layers] of Object.entries(tokens.shadows)) shared.push(`  --shadow-${name}: ${shadow(layers)};`)
shared.push(`  --font-ui: ${tokens.fonts.ui};`)
for (const [name, t] of Object.entries(tokens.text)) {
  shared.push(`  --text-${name}-size: ${t.size}px;`)
  shared.push(`  --text-${name}-weight: ${t.weight};`)
  if (t.lineHeight) shared.push(`  --text-${name}-line: ${t.lineHeight}px;`)
  if (t.tracking) shared.push(`  --text-${name}-tracking: ${t.tracking};`)
  if (t.case) shared.push(`  --text-${name}-case: ${t.case};`)
}
for (const [name, family] of Object.entries(tokens.bannerFonts)) shared.push(`  --font-banner-${name}: '${family}';`)

const css = `/* Generated from design-tokens/figma-tokens.json by \`npm run tokens\`. Don't edit by hand. */
/* Light is the default. Dark follows the system, or data-theme="dark" on <html>; data-theme="light" forces light. */
:root {
${[...colourLines('light'), ...shared].join('\n')}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
${colourLines('dark').map((l) => '  ' + l).join('\n')}
  }
}

:root[data-theme='dark'] {
${colourLines('dark').join('\n')}
}
`

await fs.writeFile(TARGET, css)
console.log(`Wrote ${path.relative(ROOT, TARGET)} (${Object.keys(tokens.colors).length} colours, ${Object.keys(tokens.numbers).length} sizes, ${Object.keys(tokens.text).length} text styles)`)
