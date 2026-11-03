import type { CSSProperties } from 'react'

// Icons exported from Figma (`npm run figma:assets` → src/assets/icons/*.svg, fills set to currentColor).
// Until an icon has been exported, a hand-drawn stand-in in the same thin style is used.
const exported = import.meta.glob('../assets/icons/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const exportedByName = Object.fromEntries(Object.entries(exported).map(([file, svg]) => [file.split('/').pop()!.replace('.svg', ''), svg]))

export type IconName =
  | 'menu' | 'search' | 'turn-around' | 'ai-sparkle' | 'back' | 'close' | 'tick' | 'cross'
  | 'add' | 'check' | 'timer' | 'switch-camera' | 'glyph-top' | 'glyph-bottom'

const STROKE: Partial<Record<IconName, string>> = {
  menu: 'M4 7h16M4 12h16M4 17h16',
  search: 'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Zm4.6-1.9L20 20',
  'turn-around': 'M5 13.5c0 1.9 3.1 3.5 7 3.5s7-1.6 7-3.5S15.9 10 12 10s-7 1.6-7 3.5M15 15l-3 2 3 2',
  back: 'M19 12H5M11 6l-6 6 6 6',
  close: 'M6 6l12 12M18 6 6 18',
  tick: 'm5 12.5 4.5 4.5L19 7.5',
  cross: 'M7 7l10 10M17 7 7 17',
  add: 'M12 5v14M5 12h14',
  check: 'm5 12.5 4.5 4.5L19 7.5',
  timer: 'M12 20a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm0-10v4.5M9.5 3h5M18 6l1.2-1.2',
  'switch-camera': 'M5.4 9.6a7 7 0 0 1 13.2 0M19.6 7.4l-1 2.2-2.2-1M18.6 14.4a7 7 0 0 1-13.2 0M4.4 16.6l1-2.2 2.2 1',
  'ai-sparkle': 'M12 4l1.8 4.7L18.5 10.5l-4.7 1.8L12 17l-1.8-4.7L5.5 10.5l4.7-1.8L12 4Z',
}

const FILL: Partial<Record<IconName, string>> = {
  'glyph-top': 'M3.5 1 1 2.6 2 5l1.2-.5V9h5.6V4.5L10 5l1-2.4L8.5 1H7.3C7 1.7 6.6 2 6 2s-1-.3-1.3-1H3.5Z',
  'glyph-bottom': 'M2.5 1h7l.8 9H7.2L6 4.5 4.8 10H1.7l.8-9Z',
}

type Props = { name: IconName; size?: number; className?: string; style?: CSSProperties }

export function Icon({ name, size = 24, className, style }: Props) {
  const svg = exportedByName[name]
  if (svg) {
    return <span className={className} style={{ display: 'inline-flex', width: size, height: size, ...style }} aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg.replace('<svg', `<svg width="${size}" height="${size}"`) }} />
  }
  const isGlyph = name in FILL
  return (
    <svg className={className} style={style} width={size} height={size} viewBox={isGlyph ? '0 0 11 11' : '0 0 24 24'} aria-hidden="true"
      fill={isGlyph ? 'currentColor' : 'none'} stroke={isGlyph ? 'none' : 'currentColor'} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <path d={isGlyph ? FILL[name] : STROKE[name]} />
    </svg>
  )
}
