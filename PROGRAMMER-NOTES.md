# blend · notes for the programmer

What the Figma prototype shows, and what it only hints at, for the parts that changed in November 2026. Figma file: Blend-remake (https://www.figma.com/design/bYTCLufBocYOUavvlHgAdy/Blend-remake). Start the prototype at Events.

## 0. Build plan

**Build to the Figma file, not to the old code.** The code in `src/` follows an older design (a Closet sheet, a Settings sheet, a Try-On sheet). Reuse its pieces where they fit, but the Figma file is the source of truth. Open its first page, "Start here · handoff". In Dev Mode, the red "Prototype only" notes mark layers that exist only to make the Figma demo work: don't build those.

**Stack (decided):** a web app that works on any phone. React 19 + TypeScript + Vite (already set up). Add React Router for the screens and Motion (formerly Framer Motion) for the animations. The current store (React context) is enough to start; move to Zustand if it grows.

**Already done:**
- **Git:** a git repo (main branch). `.gitignore` keeps out `node_modules`, `dist`, the Figma token and the designer's photo drafts.
- **Design tokens:** they come from Figma. `npm run tokens` turns `design-tokens/figma-tokens.json` into `src/styles/figma-tokens.css`:
  - colours for light and dark;
  - spacing, radius and sizes;
  - text styles;
  - `--shadow-raised` and `--shadow-track`;
  - `--color-active` ("UNDO grey" = this is on).
  
  The old names in `tokens.css` point at them. `index.html` forces light mode until the components use the tokens only.
- **Build:** `npm run build` passes.

**Hosting (decided 3 Nov):**
- **Where:** GitHub Pages, public repos, on a free address for now. The designer's portfolio site will be its own repo (`<user>.github.io`), coded the same way, and each app lives under it: blend at `https://<user>.github.io/blend/`. A custom domain can be added later without changing anything else.
- **In this repo:**
  - `vite.config.ts` sets `base: '/blend/'`. Dev runs at http://localhost:5173/blend/.
  - Public files go through `asset()` (src/lib/asset.ts).
  - `.github/workflows/deploy.yml` builds and publishes on every push to main, and copies `index.html` to `404.html` so deep links work.
- **Try-On is a mock** for now: the result shows the shopper's own photo labelled "Demo preview", and photos never leave the device. A real provider needs a small server function later, for example a free Cloudflare Worker, because GitHub Pages can't run server code.

**Still needed:**
- **Repo:** the designer installs GitHub CLI and signs in (`gh auth login`); then the repo gets created and pushed.
- **Figma images:** the Figma token in `.figma-token` expired on 3 Nov. With a new one, `npm run figma:assets` exports the new event banners, the Try-On photos and the icons from Blend-remake. `scripts/export-figma.mjs` (garment photos) still points at the old file `IQTTAGsYoKXWnLAp1ccIOV`.
- To refresh tokens after design changes, export the Figma variables to `design-tokens/figma-tokens.json` again. Figma's variables API needs an Enterprise plan, so this is done from the file, not fetched by a script.

**Order of work.** Each step should be playable on a phone before the next.
1. **App shell:**
   - Routes for Events, Change room, Product, Checkout, Orders, Options and Account.
   - The top bar, fixed: logo and menu, with a shade over photos.
   - The bottom bar:
     - the EVENTS / CHANGE ROOM switch with the sliding knob;
     - the round search and turn-around buttons;
     - CHECKOUT with the total (see §2);
     - the split count badge (§3).
2. **Events:**
   - The first banner runs under the top bar, and banners stick while you scroll.
   - Product cards, with the +/✓ morph (§2).
   - The "Added to change room · Undo · View" toast. Undo should animate too.
3. **Change room:**
   - Top and bottom carousels, swiped or dragged.
   - ✕ to remove, and "That's your only top/bottom".
   - Empty states, and "+ Add a top/bottom", which opens Events filtered (§1).
4. **Product:**
   - Sizes in the chosen size system (EU/US/UK/Asia).
   - Sold out, with "Notify me".
   - "Wear it with".
5. **Search as a filter on Events (§1).**
6. **Checkout:**
   - Order placed.
   - My orders, Track order, returns.
   - Notifications.
7. **Account and Options:**
   - Welcome, sign in and create account, enter code, password reset.
   - Make it fit.
   - Options: sizes, currency, appearance and more.
8. **Try-On:**
   - Photo or camera (with the 5-second timer).
   - "A model like me".
   - Generating, then the result.
   - The server function.
   - The privacy line: the photo is only used for the preview and not kept.
9. **Polish:**
   - Dark mode.
   - Motion matched to the Figma timings.
   - Accessibility: every spoken name is in `.claude/design/copy-inventory.md` §2f.
   - The loading, offline and error states. In Figma they open with number keys, and the Start here page lists them.
10. **Tests and launch:**
    - Playwright for the main flows: add → change room → checkout, and search.
    - Vitest for the store logic.
    - A Lighthouse check on mobile.

**Where the details live:**
- Every visible string: `.claude/design/copy-inventory.md`.
- How each tricky part behaves: `.claude/design/house-rules.md`.
- The designer's voice and words: `.claude/design/voice-and-words.md`.

## 1. Search is a filter on Events (2 Nov 2026)

There is no separate Search page any more. Search narrows the Events page in place.

**How it works**
- The search button (bottom bar, left) opens a sheet over Events, with the keyboard and suggestions: Recent, Categories (Tops, Bottoms), Events, Popular pieces.
- Picking a suggestion or pressing search on the keyboard adds a **filter chip**. Events then shows only the matching pieces, still grouped by event. There's no count line on the filtered page (the designer removed it). The count only shows in the search sheet while typing: "Search “tee”" with "5 events · 4 pieces" (singular "1 event", "1 piece"; a piece in two events counts once; never "results").
- The chips sit in a pressed-in track inside the bottom bar, above the EVENTS / CHANGE ROOM switch (the track uses the same inner shadows as `--shadow-track`). The "+" is a raised white button (`--shadow-raised`). The applied chips, the picked suggestion, the dot on the search button and the change-room count badge are "UNDO grey" (`--color-active`: the primary colour with the toast action colour on top), which means "this is on". The switch itself has no track: a raised white knob (203×48, half the width) slides between the two tabs. ✕ on a chip removes it. "Clear all" appears from 2 chips on. "+" opens search again. 3 or more chips scroll sideways under a fade.
- A dot on the search button shows while any filter is on.
- Combining: chips of the same kind widen the results (Casual or Outdoors), and different kinds narrow them (Bottoms and "cargo").
- The filter stays while the shopper browses from Events (Product and back, Options, Checkout). It clears with ✕ / Clear all, or when they tap the EVENTS tab after leaving.
- In the change room, "+ Add a top / bottom" (and the + under "No tops yet" / "No bottoms yet") opens Events with the Tops or Bottoms chip already on.
- Popular pieces open the piece's Product page; they aren't filters.
- No results for a word: "Nothing for “wedding” yet" / "Try another word, or start from one of the **events** below." No match for a combination: "Nothing for these filters yet" / "Remove a filter, or start from one of the **events** below." Tapping the message opens search.

**Tags (the designer's idea)**
The filters can come from tags on each piece: event, clothing type (top, bottom, and finer types like tee or cargo), brand and colour. Add them as data on the pieces. Showing them on the Product page as tappable chips is parked for later (the designer, 2 Nov: "skip the tags on product idea for now").

**What the Figma demo can't do (build these for real)**
- Typing: in Figma a tap stands in for typing "tee".
- Real filtering: Figma has one frame per state (tee, bomber, shorts, beach, wedding, Tops, Bottoms, Bottoms + Casual, tee + Bottoms with no match).
- In the demo, tapping an event in the suggestions does nothing. In the app it should add the event as a filter. There are no separate event pages any more (removed 2 Nov): Events is the one list, grouped by event.
- The top of Events has no plain strip: the first event's photo runs to the top of the screen, under the white "blend" logo (on a soft dark shade) and the menu. The banners are sticky, so a photo always sits under the logo while scrolling.
- The keyboard is a picture, so its return key should say "Search" in the app.
- Keep the Events scroll position behind the sheet when search opens.
- Motion: the demo fades the sheet in over 0.2s. Consider letting it rise like a sheet (about 300ms ease-out).

**Spoken names (screen readers)**
- Search button: "Search"; with filters on: "Search, 1 filter on" / "Search, 2 filters on".
- Chip bar group: "Filters". Each chip is one item: "Bottoms, remove filter".
- Suggestions: "Casual, add filter", "tee, add filter". Pieces read their name.
- "+": "Add a filter". "Clear all": "Clear all filters". Field: "Search pieces or events". ✕ in the field: "Clear text".
- Count line: read "5 events, 4 pieces" and announce it when the chips change.

**Where it is in Figma**
- Screens page: sections "Events · search (2026-11-02)" and "Events · filters, tops and bottoms (2026-11-02)".
- Components page: section "Search in Events · filter chip, chip bar, suggestions sheet, keyboard (2026-11-02)", plus the bottom bar's "filter on" version.
- The old Search pages are on the Archive page, for reference.

## 2. Motion for the + and Checkout buttons (2 Nov 2026)

The designer wants both to animate on every change, never snap.
- **The + on a piece card** morphs into ✓ when the piece is added, and back when it's removed: 0.2s ease-out. The black circle turns light with an outline, and the two lines of the + slide into the two strokes of the ✓. In the app, Undo and removing from the change room should animate it too (the Figma demo can't do those).
- **Checkout:** when the first piece goes in, the button turns from light to black while "CHECKOUT" slides left and the total fades in beside it: 0.3s. When the last piece leaves, it reverses: 0.2s. The total and the label move together, so they never overlap.

## 3. Change room count: tops and bottoms (2 Nov 2026)

The badge on the CHANGE ROOM tab is one black pill with a T-shirt glyph and the number of tops, then a trousers glyph and the number of bottoms (for example "2 · 1").
- Each half hides at 0, and the whole badge hides when the change room is empty (the tab label then centres).
- Counts cap at 99+. Open question: 99+ tops and 99+ bottoms together don't fit next to "CHANGE ROOM"; a single "99+" may be better there.
- It pops when the count changes (+15% in 100ms ease-out, then settles in 180ms).
- Spoken name: "Change room, 2 tops, 1 bottom" (with singular forms).
- In the code, the bottom bar is src/components/BottomBar.tsx (around lines 25–31): two counts instead of one, and the hidden text ", 2 tops, 1 bottom in your change room".
