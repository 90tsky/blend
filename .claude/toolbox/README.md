# blend toolbox (project-only)

Settings and recipes that only make sense for blend. The shared scripts themselves live in `D:\Kris Work\Claude\design-kit\toolbox\`. Don't copy them here; fill their CONFIG with the values below.

## Figma file
- Blend-remake, file key `bYTCLufBocYOUavvlHgAdy`. Pages: Components 0:1, Screens 257:2472, Archive 468:11154, Explorations 1084:8.
- Before any Build, save a version with the figma-save-version skill (design URL `https://www.figma.com/design/bYTCLufBocYOUavvlHgAdy/Blend-remake`).

## page-cleanup-scan.js: blend CONFIG
```js
const CONFIG = { PAGE_ID: '', ARCHIVE_PAGE: 'Archive', COMPONENTS_PAGE: 'Components', MAX_PER_GROUP: 40, EMPTY_OK: 'bottom offset' };
```
- `bottom offset` is the toast's intended empty spacer (10 tall, no fill): never a finding.
- The 11 main components on the Screens page (bottom-bar, change-room-stage, both carousels, top-bar, cr-garment top/bottom, nav-switch, toast, cr-neighbors, product-page) are there **on purpose**: their prototype links only work on the screens' page.
- The Archive page holds old components on purpose; they're only used by old static change rooms there. Explorations keeps mock-ups for the case study.
- Result of the first scan (2026-11-01): clean. Its only find was "tap to close" 615:2241 with no fill, which is now fixed.

## Chrome play-test recipe
- Prototype URL: `https://www.figma.com/proto/bYTCLufBocYOUavvlHgAdy/Blend-remake?node-id=320-7350&scaling=scale-down&content-scaling=fixed&hide-ui=1`
- Test in a foreground window, and only when no helper is editing the file (live edits reload the prototype).
- After loading, wait about 10s, then click once on the intro text (783,110) to give focus; the first tap is often swallowed.
- Coordinates in a 1568×744 viewport:
  - + on the black tee card: (758,423)
  - after scrolling down 5: + on the joggers (758,422)
  - tabs: EVENTS (713,630) and CHANGE ROOM (852,630)
  - Try it on button: (899,590)
  - top ✕ (907,273), bottom ✕ (907,547)
  - garment tap: top (752,200), bottom (748,440)
  - Product Back (651,117)
  - Try-On ✕ (918,117)
  - main button (782,629), second button (782,669)
  - "Use a model instead" (826,572)
  - build tiles at y 270: Even 675, Wider hips 746, Wider shoulders 818, Wider middle 890
- Number keys (press after focusing):
  - 1 / 2 on Checkout → Card declined / Payment failed
  - 1 on Sign in, Create account, Enter code, My orders and Notifications
  - 1 on Looks good? → Photo not usable; 1 on Dressing you… → Generation failed
- Timings:
  - the toast slides in about 1.5–2.5s after a screen opens
  - Paying… lasts 1.5s
  - Dressing you… lasts 2.5s
  - the missing-piece toast shows once per Try-On visit
