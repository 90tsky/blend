// Figma carousel · top / bottom: a step slides in 450ms on cubic-bezier(0.25, 0.5, 0.25, 1).
// Removing a slot's last piece, its Undo and the empty box stretching out of the add card (motion Aplus2) share it.
export const SLIDE = { duration: 0.45, ease: [0.25, 0.5, 0.25, 1] as [number, number, number, number] }

// How far Try it on slides out of an empty room, to the right. The notches round it (the frame's, "No bottoms yet")
// move by the same amount on the same SLIDE, so they close round the button as it leaves and open as it comes back.
export const TRY_ON_OUT = 96
