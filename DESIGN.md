# DESIGN.md: blend

<!-- The design helpers (ux-ui-designer, ux-writer, design-reviewer, case-study-writer, figma-animator) read this first.
     Short facts live here; the long rules live in the files linked below, which a helper opens only when it needs them.
     When a helper gets something wrong, fix the rule here or in the linked file, not just the result in chat.
     When CASE-STUDY-NOTES.md has a later dated decision than anything here, the notes win; update this file to match. -->

## Product
- What it is: blend, a sustainable capsule-wardrobe shop. Every piece in an event goes with every other piece, so any top works with any bottom, and each new piece multiplies the outfits. Keep that promise visible.
- Who it's for: shoppers who want fewer clothes that all work together.
- The main thing a user does here: find an outfit for an occasion, add pieces, try top × bottom combinations, buy.
- Main parts: **Events** (shop by occasion; each event is a capsule). **Change room** (the shopping bag: two carousels, tops above bottoms, to try combinations before buying). **Rotate** (a bottom-bar button that flips all clothes front/back). **Try-On** (a photo of you in the outfit). **Options** (settings). **Closet** (every top × bottom) exists in the coded app only.
- Platform and frame size: phone first, 430 × 932, used with one thumb. Left-handed mode was removed from the prototype on 2026-11-01 (one right-hand layout); it stays planned in the coded app.
- Most screens are a few instances (top bar, stage, bottom bar) whose content is driven by variables while the prototype plays. On the canvas they show their default state, often empty: judge filled states from the reactions, the notes and the component structure, and say so.
- There is also a coded React app in src/. Helpers only propose changes to it (file:line); the main chat edits code.

## Figma
- File: Blend-remake, https://www.figma.com/design/bYTCLufBocYOUavvlHgAdy/Blend-remake
- File key: bYTCLufBocYOUavvlHgAdy
- Pages: Components 0:1, Screens 257:2472, Archive 468:11154
- Example screens: Options 498:9264, Events 320:7350, Change room 479:9125. Change room stage: change-room-stage 495:276.
- Never touch: Archive 468:11154 (frozen history for the case study). Work only on Components and Screens.
- Not this project: the legacy file "Blended (Copy)", IQTTAGsYoKXWnLAp1ccIOV. Say so and stop.
- Where mock-ups go: Explorations. Hidden helper layers to delete from mock-up copies: "neighbors watcher" and similar watchers.
- Ideas tried and dropped (don't re-propose without saying why it's different now): rails, fisheye dots, the squash animation. Grep CASE-STUDY-NOTES.md for more.

## House rules
Full rules: [.claude/design/house-rules.md](.claude/design/house-rules.md) (layout, corners, tap targets, tokens, colour, where things live, content, prototype logic, motion, and the "Already known" list of older issues to report once). Read it before designing, building or reviewing. The key numbers:
- Side margin: 12 (layout/margin). Content columns are 406 wide at x=12.
- Card corner radius: 24 (radius/xl).
- Smallest tap target: 48 × 48. Buttons, fields and pickers are 48 tall (control/height). Icons 24 (size/icon).
- Spacing: only the `tokens` scale (space/*, layout/*, card/padding).
- Token collection: `tokens` (VariableCollectionId:857:123). Colour collection: `theme` (VariableCollectionId:549:9348, light and dark). Never bind to the legacy `all` collection, which is for prototype state only.
- Layers allowed past the side margin: full-width bars, event banners and heroes, change-room peeks (garment · prev / next). See the full rules for the rest.

## Audit config
design-reviewer fills the toolbox audit script's CONFIG with these:
```
MARGIN: 12, TAP_MIN: 48, CARD_R: 24,
TOKEN_COLLECTIONS: ['tokens'], THEME_COLLECTIONS: ['theme'],
EDGE_OK: 'garment · (prev|next)|peek', SAME_PAGE_LINKS: true
```
- Before running it, compare the live values of layout/margin, control/height and radius/xl (get_variable_defs) with 12, 48 and 24. If they differ, use the live values and say so.
- Note every variable the node uses that isn't in tokens or theme (for example brown/*, dark-brown/*, black, white, properties/*, Large-*, Product name).
- Component sets: audit at most 6 variants, one id at a time: the changed ones first, then a filled one and an empty one.
- Extra checks when nothing specific changed: unbound numbers grouped by layer name and value; every reaction grouped by layer name, trigger and action; fixed children and scroll direction; the buttons= property on instances; all text content.
- Grep CASE-STUDY-NOTES.md before judging a motion timing: carousel timing changed several times.
- For "Could not check": prototype flows and timers should be played in Chrome in a foreground window (background windows run at 1 frame per second); dark mode needs Appearance flipped in the prototype.

## Motion
- The rules: the "Motion" and "Prototype logic" parts of the house rules file. In short: one motion per transition; appearing or disappearing layers go to near-zero size AND opacity 0; no spring easings in timed hops; no timed Change to straight back; things move rather than deform (no photo crossfades, no squash on clothes).
- Options opens with Push and match layers, 0.3s ease-in-out.
- Carousel and toast timings changed several times: the notes hold the current ones.
- Motion videos go in motion-exports/.

## Voice and words
Full guide: [.claude/design/voice-and-words.md](.claude/design/voice-and-words.md) (voice, glossary, already decided, undecided).
- Voice in three words: friendly, direct, calm. "You" is the shopper, "we" is the shop.
- Sentence case. British spelling. Prices "42.00 EUR". Dates "12 Oct".
- The name is "blend", always lowercase. Brand labels are fictional (LOAM, VALE, SADDLE).
- Copy inventory (every string, collected 2026-10-31, may be stale): [.claude/design/copy-inventory.md](.claude/design/copy-inventory.md).

## Case study
- Notes file: CASE-STUDY-NOTES.md
- Draft file (for portfolio write-ups): CASE-STUDY-DRAFT.md
- Who the designer is in the notes: "Requested", "the designer's call" or "chosen by the designer". Never "I" or "Claude".
- Structure, voice and protected wording: [.claude/design/case-study-style.md](.claude/design/case-study-style.md). It wins over the helper's defaults.
- Never touch NEXT-SESSION.md, README.md, src/ or memory notes from the case-study helper.
