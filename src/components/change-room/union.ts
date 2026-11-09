// ONE dashed outline round several empty boxes at once, while two of them merge into "Your change room is empty" or
// split back apart (EmptyBoxes). Where the boxes overlap there's a single line, and where a narrower box meets a wider
// one the inside corner is rounded, so they read as one shape melting together (the user, 10 Nov: "path morphing ...
// when both bottom and top row intertwine"), no longer two outlines sliding over each other.
//
// Each box is the shape padPath draws: a rounded rectangle notched round Try it on's pad. That shape is exactly "every
// point within r of E", E being the box shrunk by r with the pad (grown by r) cut out, so the boxes together are every
// point within r of any of their E's. The outline is traced from those distances on a 4px grid (marching squares with
// linear interpolation: straight edges come out exact, curves within about 0.1px), so it can change shape freely: two
// loops become one as the boxes touch, and one becomes two as they part.

// A box's outline in stage coordinates (its right and bottom edges at x + w and y + h), and Try it on's pad centre.
export type OutlineBox = { x: number; y: number; w: number; h: number; pad: { x: number; y: number } }

type Seg = [number, number, number, number] // axis-aligned: x1 <= x2, y1 <= y2
// E for one box: the inner rectangle (x1..x2, y1..y2), less the pad's disc (centre px, py, radius R) and the corner
// region right of and below the disc's centre (from its top, `top`), as padPath cuts it.
type Region = { x1: number; y1: number; x2: number; y2: number; px: number; py: number; R: number; top: number; flat: Float64Array }
// A rounded inside corner where two boxes meet: inside the square, it's every point at least f from (cx, cy).
type Pocket = { x1: number; y1: number; x2: number; y2: number; cx: number; cy: number; f: number }

function region(b: OutlineBox, r: number, c: number): Region {
  let x1 = b.x + r
  let x2 = b.x + b.w - r
  let y1 = b.y + r
  let y2 = b.y + b.h - r
  if (x2 < x1) x1 = x2 = (x1 + x2) / 2
  if (y2 < y1) y1 = y2 = (y1 + y2) / 2
  const R = c + r
  const { x: px, y: py } = b.pad
  const top = py - R
  // The cut-out across a horizontal line (as an x interval) or a vertical one (as a y interval).
  const cutH = (y: number): [number, number] | null => {
    let lo = Infinity
    let hi = -Infinity
    const dy = y - py
    if (Math.abs(dy) < R) {
      const h = Math.sqrt(R * R - dy * dy)
      lo = px - h
      hi = px + h
    }
    if (y > top) {
      lo = Math.min(lo, px)
      hi = Infinity
    }
    return lo < hi ? [lo, hi] : null
  }
  const cutV = (x: number): [number, number] | null => {
    let lo = Infinity
    let hi = -Infinity
    const dx = x - px
    if (Math.abs(dx) < R) {
      const v = Math.sqrt(R * R - dx * dx)
      lo = py - v
      hi = py + v
    }
    if (x > px) {
      lo = Math.min(lo, top)
      hi = Infinity
    }
    return lo < hi ? [lo, hi] : null
  }
  const segs: Seg[] = []
  const keep = (a: number, b2: number, cut: [number, number] | null, add: (a: number, b: number) => void) => {
    if (!cut) return add(a, b2)
    if (cut[0] > a) add(a, Math.min(b2, cut[0]))
    if (cut[1] < b2) add(Math.max(a, cut[1]), b2)
  }
  for (const y of y1 === y2 ? [y1] : [y1, y2]) keep(x1, x2, cutH(y), (a, b2) => segs.push([a, y, b2, y]))
  for (const x of x1 === x2 ? [x1] : [x1, x2]) keep(y1, y2, cutV(x), (a, b2) => segs.push([x, a, x, b2]))
  // The cut-out's own straight edges inside the rectangle: the corner region's top, and its left side below the disc.
  if (top >= y1 && top <= y2 && Math.max(px, x1) <= x2) segs.push([Math.max(px, x1), top, x2, top])
  if (px >= x1 && px <= x2 && py + R <= y2) segs.push([px, py + R, px, y2])
  return { x1, y1, x2, y2, px, py, R, top, flat: Float64Array.from(segs.flat()) }
}

// A quick lower bound on |dist|, from outside: E lies inside its rectangle.
function outsideRect(g: Region, x: number, y: number) {
  const dx = x < g.x1 ? g.x1 - x : x > g.x2 ? x - g.x2 : 0
  const dy = y < g.y1 ? g.y1 - y : y > g.y2 ? y - g.y2 : 0
  return Math.sqrt(dx * dx + dy * dy)
}

// Signed distance to E's edge: positive outside E, negative inside.
function dist(g: Region, x: number, y: number): number {
  const ux = x - g.px
  const uy = y - g.py
  const l = Math.sqrt(ux * ux + uy * uy)
  const inside = x >= g.x1 && x <= g.x2 && y >= g.y1 && y <= g.y2 && l >= g.R && !(x > g.px && y > g.top)
  let d2 = Infinity
  const s = g.flat
  for (let k = 0; k < s.length; k += 4) {
    const dx = x < s[k] ? s[k] - x : x > s[k + 2] ? x - s[k + 2] : 0
    const dy = y < s[k + 1] ? s[k + 1] - y : y > s[k + 3] ? y - s[k + 3] : 0
    const q = dx * dx + dy * dy
    if (q < d2) d2 = q
  }
  let d = Math.sqrt(d2)
  // The disc's edge: its left half, where that lies in the rectangle (the right half is inside the corner region).
  if (l > 0) {
    const qx = g.px + (g.R * ux) / l
    const qy = g.py + (g.R * uy) / l
    if (qx <= g.px + 1e-9 && qx >= g.x1 && qx <= g.x2 && qy >= g.y1 && qy <= g.y2) d = Math.min(d, Math.abs(l - g.R))
  }
  return inside ? -d : d
}

// Rounded inside corners where a box's side stands on another box's top or bottom edge. The radius grows from 0 as
// the boxes overlap and shrinks back to 0 as the step between them closes, so the line never jumps.
function pockets(boxes: OutlineBox[], r: number, fr: number): Pocket[] {
  const out: Pocket[] = []
  const add = (jx: number, jy: number, sx: number, sy: number, room: number) => {
    const f = Math.min(fr, room)
    if (f <= 0.01) return
    const ex = jx + sx * f
    const ey = jy + sy * f
    out.push({ x1: Math.min(jx, ex), x2: Math.max(jx, ex), y1: Math.min(jy, ey), y2: Math.max(jy, ey), cx: ex, cy: ey, f })
  }
  for (const n of boxes) {
    for (const m of boxes) {
      if (n === m) continue
      const nr = n.x + n.w
      const nb = n.y + n.h
      const mr = m.x + m.w
      const mb = m.y + m.h
      // n's side over m's top edge (n reaching higher) or its bottom edge (n reaching lower). The pocket lies along
      // both straight edges, clear of their rounded ends.
      for (const [jx, sx, along] of [
        [n.x, -1, Math.min(n.x - (m.x + r), mr - r - n.x)],
        [nr, 1, Math.min(mr - r - nr, nr - (m.x + r))],
      ] as const) {
        if ((sx < 0 && n.x <= m.x) || (sx > 0 && nr >= mr)) continue
        if (n.y < m.y) add(jx, m.y, sx, -1, Math.min(along, m.y - (n.y + r), nb - r - m.y))
        if (nb > mb) add(jx, mb, sx, 1, Math.min(along, nb - r - mb, mb - (n.y + r)))
      }
    }
  }
  return out
}

// The boxes' signed distance: negative inside, 0 on the outline. It never changes faster than the distance moved, except
// that a rounded inside corner can sit up to f·(√2 − 1) nearer than it says (POCKET_SLACK covers that).
export function outlineField(boxes: OutlineBox[], r: number, c: number, fr = r) {
  const regs = boxes.map((b) => region(b, r, c))
  const pks = pockets(boxes, r, fr)
  return (x: number, y: number) => {
    let v = Infinity
    for (let k = 0; k < regs.length; k++) if (outsideRect(regs[k], x, y) - r < v) v = Math.min(v, dist(regs[k], x, y) - r)
    for (let k = 0; k < pks.length; k++) {
      const p = pks[k]
      if (x >= p.x1 && x <= p.x2 && y >= p.y1 && y <= p.y2) v = Math.min(v, p.f - Math.sqrt((x - p.cx) ** 2 + (y - p.cy) ** 2))
    }
    return v
  }
}
const POCKET_SLACK = 10

// The outline as an SVG path: one closed loop per separate shape, each starting where padPath starts (the top end of
// the left edge of the highest box in it) and running clockwise like padPath, so the dashes line up with the boxes'
// own outlines when this takes over from them and hands back.
export function unionPath(boxes: OutlineBox[], r: number, c: number, fr = r, step = 4): string {
  if (!boxes.length) return ''
  const field = outlineField(boxes, r, c, fr)
  const minX = Math.min(...boxes.map((b) => b.x))
  const minY = Math.min(...boxes.map((b) => b.y))
  const maxX = Math.max(...boxes.map((b) => b.x + b.w))
  const maxY = Math.max(...boxes.map((b) => b.y + b.h))
  // Off the whole pixels, so grid lines don't sit exactly on box edges.
  const ox = Math.floor(minX) - 2 * step + 0.37
  const oy = Math.floor(minY) - 2 * step + 0.37
  const nx = Math.ceil((maxX - ox) / step) + 2
  const ny = Math.ceil((maxY - oy) / step) + 2
  // Only points near the line need their true value: a point d from it means the next few along the row are on the
  // same side, so they're skipped (stored as at least a step away, which keeps them out of the tracing).
  const v = new Float64Array((nx + 1) * (ny + 1))
  for (let j = 0; j <= ny; j++) {
    const row = j * (nx + 1)
    for (let i = 0; i <= nx; ) {
      const f = field(ox + i * step, oy + j * step)
      v[row + i] = f
      const skip = Math.floor((Math.abs(f) - POCKET_SLACK) / step) - 1
      for (let k = 1; k <= skip && i + k <= nx; k++) v[row + i + k] = Math.sign(f) * (Math.abs(f) - k * step)
      i += 1 + Math.max(0, skip)
    }
  }
  const val = (i: number, j: number) => v[j * (nx + 1) + i]

  // Crossing points sit on grid edges: horizontal edge (i, j)-(i+1, j) is H, vertical edge (i, j)-(i, j+1) is V.
  const nH = nx * (ny + 1)
  const total = nH + (nx + 1) * ny
  const H = (i: number, j: number) => j * nx + i
  const V = (i: number, j: number) => nH + j * (nx + 1) + i
  const px = new Float64Array(total)
  const py = new Float64Array(total)
  const nb = new Int32Array(total * 2).fill(-1)
  const point = (id: number) => {
    if (id < nH) {
      const j = Math.floor(id / nx)
      const i = id - j * nx
      const a = val(i, j)
      const t = a / (a - val(i + 1, j))
      px[id] = ox + (i + t) * step
      py[id] = oy + j * step
    } else {
      const k = id - nH
      const j = Math.floor(k / (nx + 1))
      const i = k - j * (nx + 1)
      const a = val(i, j)
      const t = a / (a - val(i, j + 1))
      px[id] = ox + i * step
      py[id] = oy + (j + t) * step
    }
  }
  const half = (p: number, q: number) => {
    if (nb[p * 2] === -1) {
      nb[p * 2] = q
      point(p)
    } else nb[p * 2 + 1] = q
  }
  const link = (a: number, b: number) => {
    half(a, b)
    half(b, a)
  }
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const tl = val(i, j) < 0
      const tr = val(i + 1, j) < 0
      const br = val(i + 1, j + 1) < 0
      const bl = val(i, j + 1) < 0
      if (tl === tr && tr === br && br === bl) continue
      const top = H(i, j)
      const bottom = H(i, j + 1)
      const left = V(i, j)
      const right = V(i + 1, j)
      const n = +(tl !== tr) + +(tr !== br) + +(br !== bl) + +(bl !== tl)
      if (n === 2) {
        // The two edges the line crosses, in order round the cell.
        const a = tl !== tr ? top : tr !== br ? right : bottom
        const b = bl !== tl ? left : br !== bl ? bottom : right
        link(a, b)
      } else {
        // A saddle: the middle decides whether the inside corners join across the cell.
        const mid = field(ox + (i + 0.5) * step, oy + (j + 0.5) * step) < 0
        const cutInside = !mid
        // Cut off each corner on the cut side: link the two edges next to it.
        if (tl === cutInside) link(top, left)
        if (tr === cutInside) link(top, right)
        if (br === cutInside) link(right, bottom)
        if (bl === cutInside) link(bottom, left)
      }
    }
  }

  // Walk the loops.
  const seen = new Uint8Array(total)
  const loops: [number, number][][] = []
  for (let s = 0; s < total; s++) {
    if (nb[s * 2] === -1 || seen[s]) continue
    const loop: [number, number][] = []
    let prev = -1
    let cur = s
    while (!seen[cur]) {
      seen[cur] = 1
      loop.push([px[cur], py[cur]])
      const a = nb[cur * 2]
      const b2 = nb[cur * 2 + 1]
      const next = a !== prev && !seen[a] ? a : b2 !== -1 && !seen[b2] ? b2 : -1
      if (next === -1) break
      prev = cur
      cur = next
    }
    if (loop.length > 2) loops.push(loop)
  }

  const anchors = [...boxes].sort((a, b) => a.y - b.y).map((b) => [b.x, b.y + r] as const)
  return loops.map((loop) => serialise(start(clockwise(loop), anchors))).join(' ')
}

function clockwise(loop: [number, number][]) {
  let area = 0
  for (let k = 0; k < loop.length; k++) {
    const [x1, y1] = loop[k]
    const [x2, y2] = loop[(k + 1) % loop.length]
    area += x1 * y2 - x2 * y1
  }
  return area < 0 ? loop.reverse() : loop
}

// Start the loop at the first anchor that lies on it (to 1px), cutting the segment there.
function start(loop: [number, number][], anchors: (readonly [number, number])[]) {
  for (const [ax, ay] of anchors) {
    let best = Infinity
    let at = -1
    for (let k = 0; k < loop.length; k++) {
      const [x1, y1] = loop[k]
      const [x2, y2] = loop[(k + 1) % loop.length]
      const dx = x2 - x1
      const dy = y2 - y1
      const l2 = dx * dx + dy * dy
      const t = l2 ? Math.max(0, Math.min(1, ((ax - x1) * dx + (ay - y1) * dy) / l2)) : 0
      const qx = x1 + t * dx
      const qy = y1 + t * dy
      const d = Math.hypot(ax - qx, ay - qy)
      if (d < best) {
        best = d
        at = k
      }
    }
    // The anchor itself is on the true outline (the trace's chord can pass a hair off it).
    if (best < 1) return [[ax, ay] as [number, number], ...loop.slice(at + 1), ...loop.slice(0, at + 1)]
  }
  let top = 0
  for (let k = 1; k < loop.length; k++) if (loop[k][1] < loop[top][1] || (loop[k][1] === loop[top][1] && loop[k][0] < loop[top][0])) top = k
  return [...loop.slice(top), ...loop.slice(0, top)]
}

function serialise(loop: [number, number][]) {
  const r2 = (n: number) => Math.round(n * 100) / 100
  const out: string[] = []
  for (let k = 0; k < loop.length; k++) {
    // Drop points in the middle of a straight run (every grid crossing along an edge).
    if (k > 0) {
      const [x0, y0] = loop[k - 1]
      const [x1, y1] = loop[k]
      const [x2, y2] = loop[(k + 1) % loop.length]
      const cross = (x1 - x0) * (y2 - y1) - (y1 - y0) * (x2 - x1)
      const dot = (x1 - x0) * (x2 - x1) + (y1 - y0) * (y2 - y1)
      if (Math.abs(cross) < 1e-3 && dot > 0) {
        loop[k] = loop[k - 1] // keep measuring the run from its start
        continue
      }
    }
    out.push(`${k ? 'L' : 'M'}${r2(loop[k][0])} ${r2(loop[k][1])}`)
  }
  return out.join('') + 'Z'
}
