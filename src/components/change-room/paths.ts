// Outline paths for the change room's frame and dashed boxes. Kept apart from the components so they can be tested
// on their own (node can run this file directly).

// The change room's frame has 32 corners; everything inside it sits 12 in, so its corners are 20 (concentric).
export const FRAME_R = 32
export const INNER_R = 20

const topEdge = (w: number, r: number) => `M0 ${r} A${r} ${r} 0 0 1 ${r} 0 H${w - r} A${r} ${r} 0 0 1 ${w} ${r}`
const leftEdge = (h: number, r: number) => `H${r} A${r} ${r} 0 0 1 0 ${h - r} Z`

// A plain rounded box, w × h, corners r.
export function plainPath(w: number, h: number, r: number) {
  return `${topEdge(w, r)} V${h - r} A${r} ${r} 0 0 1 ${w - r} ${h} ${leftEdge(h, r)}`
}

// A rounded box with one dashed line wrapped round Try it on's pad: a circle of radius c round (px, py), the centre of
// the button's corner. The notch is wherever the box reaches into the pad, so a box growing down into it (an "Add a
// bottom" card becoming "No bottoms yet", the user's sketch of 9 Nov: one shape growing to the width, one to the
// length, one thread round both) gets its notch as part of the same line, instead of a second outline fading in.
// The pad can also slide out past the right edge with Try it on (px beyond w - r): the notch then closes round it
// into the plain corner, again without a jump. A box that doesn't reach the pad is a plain box.
// The notch's two outer turns take the box's own corner radius r (the user, 4 Nov: they mirror the bottom-left
// corner). Each turn touches the pad circle: the lower one sits on the bottom edge, the upper one on the pad's flat
// top (at rest) or on the right edge (while the pad slides out).
export function padPath(w: number, h: number, r: number, px: number, py: number, c: number) {
  const R = c + r // a turn's centre is this far from the pad's centre
  const k = c / R // where a turn touches the pad circle, along that line
  const dyL = py - (h - r) // the lower turn's centre is r above the bottom
  if (Math.abs(dyL) >= R) return plainPath(w, h, r)
  const dxL = Math.sqrt(R ** 2 - dyL ** 2)
  let upper: string
  if (px <= w - r) {
    const padTop = py - c
    if (h <= padTop || padTop < 2 * r) return plainPath(w, h, r)
    upper = `V${padTop - r} A${r} ${r} 0 0 1 ${w - r} ${padTop} H${px}`
  } else {
    // Once the corner's own turn (centre w - r, h - r) clears the pad, the notch has closed.
    const dxU = px - (w - r)
    if (dxU ** 2 + dyL ** 2 >= R ** 2) return plainPath(w, h, r)
    const uy = py - Math.sqrt(R ** 2 - dxU ** 2)
    if (uy < r) return plainPath(w, h, r)
    upper = `V${uy} A${r} ${r} 0 0 1 ${px - dxU * k} ${py - (py - uy) * k}`
  }
  // Too small to hold the notch (not a size the change room reaches): keep the plain box.
  if (px - dxL < r) return plainPath(w, h, r)
  return `${topEdge(w, r)} ${upper} A${c} ${c} 0 0 0 ${px - dxL * k} ${py - dyL * k} A${r} ${r} 0 0 1 ${px - dxL} ${h} ${leftEdge(h, r)}`
}

// A rounded box path, optionally with the notch round the Try it on button at the bottom-right corner
// (house rules › Corners). For the frame (inset 0) the button is 72 × 48 flush with the corner with 12 round it, so
// the inside curve shares the button's centre (24 + 12 = 36); a box `inset` inside the frame gets the same notch
// offset by that much (inside curve 36 + inset), so the frame's turns and the inset box's turns share centres.
export function boxPath(w: number, h: number, notch: boolean, r = FRAME_R, inset = 0) {
  return notch ? padPath(w, h, r, w - 48 + inset, h - 24 + inset, 36 + inset) : plainPath(w, h, r)
}
