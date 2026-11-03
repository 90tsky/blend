# blend: where we left off

> **⏰ Reminder for the user (asked 1–2 Nov, night): "in the morning remind me to remove the white from the female model".** (A one-shot reminder is also set in the Claude session for about 09:03 on 2 Nov, but it only fires if that session is still open.)
>
> **The user's standing instruction (2 Nov, night):** "continue dont ask me anything collect questions after everything thats already aproved check all frames look for missing frames/unconcistencies". Build everything approved, then do a full-frame sweep for missing frames and inconsistencies, then bring ONE list of questions.

Last session: **20 October 2026**. Start next time by reading this file.

---

## What blend is
A sustainable clothing shop built around a **capsule wardrobe**. Every piece is curated to go with every other piece, so any top works with any bottom.

- **Events:** shop by occasion (Casual, Outdoors, Work, Beach, Evening, Maternity, Business casual). Each occasion is a capsule.
- **Change room:** the shopping bag. Two carousels, tops above and bottoms below, for trying combinations of what you've added before you buy.
- **Closet:** every combination your pieces make (this used to be called "Total Fits").
- **Rotate:** flips all clothes between front and back.
- **Left/right-handed setting:** moves the change room controls to your thumb side.
- **Try-On:** take or upload a photo and get an AI-generated image of you wearing the outfit.

**Where it's heading:** the project has grown toward a **Shopify add-on** that any shop could embed. We agreed to **keep the capsule idea**: merchants would curate capsules (like our occasions), and shoppers get the change room for each one. The change room is built as a self-contained piece so it can be wrapped for Shopify later.

---

## Your decisions so far
| Topic | Decision |
|---|---|
| What to build | A working app in this folder (phone-first web app, React) |
| Portfolio case study | Later, but we log decisions as we go in `CASE-STUDY-NOTES.md` |
| Desktop | In scope (built: Events left, change room right) |
| Name | **blend** (the logo was right; "blended" is old) |
| Product cards | Names match the photos, fictional brands, prices in **EUR only** |
| Closet | Redone from "Total Fits": every top × bottom combination |
| Try-On | Real AI virtual try-on from a photo |
| Handedness switch | Lives in Settings (gear icon in the header) |
| Back button | Replaced by the logo; Closet, Settings, Try-On and Checkout open as sheets with a close (✕) button |
| "Add to cart" | Buys everything in the change room (my default; you didn't object) |
| Adding more later | Not a problem; the app is built so new screens slot in |

---

## What's built and working
- **Events:** sticky banners that shrink on scroll, product cards, add/remove, "3 tops · 2 bottoms" counter on each banner.
- **Change room:** swipe carousels, a side pill per slot (remove, price, dot scrubber you can drag with your thumb), and Try-On, Closet and Rotate buttons.
- **Rotate:** front/back flip animation everywhere.
- **Closet:** all outfits with the maths ("3 tops × 2 bottoms = 6 outfits"); tap one to jump to it.
- **Settings:** left/right-handed, and empty the change room.
- **Try-On:** all screens done (photo, preview, loading, result) but it shows **"Coming soon"** until an AI service is connected.
- **Checkout:** demo only, no payment.
- **Saved on the device:** the change room contents and the handedness setting.
- **Garment sizing:** clothes are scaled to a shared waistline so outfits look true to life.
- **Products:** 21 garments with fictional labels (LOAM, VALE, SADDLE) and EUR prices.

**Run it:** open a terminal in this folder, run `npm run dev`, then open http://localhost:5173. On your phone, use the "Network" address it prints, on the same Wi-Fi.

---

## My open questions for you
1. **Try-On AI service.** Connecting real try-on needs an account with an AI image service, an API key, and costs roughly a few cents per image. Should I research the best current option and recommend one?
2. **Occasion title fonts.** Only Casual (Notable) and Work (Shrikhand) have their own font in Figma. Outdoors, Beach, Evening, Maternity and Business casual still use Noto Serif placeholders. Do you want to pick them, or should I suggest some?
3. **Public link.** Should we put it online for your portfolio? Vercel's free tier works well, and you'd need to sign up.
4. **Banner photo licence.** The Casual banner is from pngtree, a stock site. Check the licence before the portfolio goes public, or swap the photo.
5. **Your feedback** after playing with the app: what feels off, what's missing?

## Things I decided that you should double-check
- The floating **Closet / Rotate** buttons on Events slide away while scrolling down, because in the design they cover the ➕ buttons.
- **Product names, brands and prices** are mine; change any of them in `src/data/products.ts`.
- Which garments belong to which occasion is my guess; change it in `src/data/occasions.ts`.
- An **intro line** at the top of Events: "Dress for the day".

---

## Next steps (suggested order)
1. Your feedback on the current app → fixes.
2. Product detail page (tap a card to see more).
3. Try-On: pick a provider, then build the small backend at `/api/try-on`.
4. Fonts for the remaining occasions.
5. Put it online (Vercel) for a shareable link.
6. Portfolio case study, using `CASE-STUDY-NOTES.md` and the research pages in Figma (presentations, surveys, personas, user testing).

## Parked problems
- **Second copy of the same item:** what happens if someone wants two of the same piece in the change room? It breaks the "every combination" idea, so it needs thinking through.
- **Shopify add-on packaging:** how merchants install it and curate their capsules. This comes later.

---

## Figma connection
- File: https://www.figma.com/design/IQTTAGsYoKXWnLAp1ccIOV/Blended--Copy-
- The design target is the section called **"this should be the final result"** on the Mobile UI page.
- The read-only token is saved in `.figma-token`, which git ignores. **It was set to expire after about 7 days.** If it has expired, make a new one (Figma → Settings → Security → Personal access tokens, scope "File content: Read-only") and paste it into that file.
- `npm run figma:export` re-downloads the garment photos, occasion banners and logo if you change them in Figma.

## 31 October 2026: Figma prototype session ("Blend-remake")
Prototype file: https://www.figma.com/design/bYTCLufBocYOUavvlHgAdy/Blend-remake (Screens page). All edits were made directly in Figma; every decision is in `CASE-STUDY-NOTES.md` (dated 2026-10-31).

**Toasts verified in the prototype (31 Oct, via Claude in Chrome):** add → "Added to change room · View", ✓ or change room ✕ → "Removed … · Undo", Undo restores, View opens the change room, a new add/remove replaces the toast on screen. Undo in the change room animates (stage-level hotspot), badge pops, price fades in (all checked in Chrome).

Also worth re-testing in the prototype:
- Removing the last top / last bottom: one stage-level action per ✕ (the old double action was removed), smart-animates to the empty layout, no jump to Events.
- Undo restores the change room exactly (35 `undo/*` snapshot variables).
- Events list scrolls (it had been pinned by mistake; fixed).
- 48×48 tap targets everywhere; back/close icons back to normal size.

Later on 31 Oct:
- **Design tokens:** spacing, radius and size are variables in the `tokens` collection, and every screen uses them.
- **Rail:** it's now a component (`rail`, with `rail · dots`) and rolls like a wheel. With one piece, a swipe wobbles back.
- **Tidy-up:** both pages are tidied. Legacy components are in an Archive section.

Then:
- **Switching:** pieces switch with a squash-and-crossfade; dragging the dots switches too; one piece wiggles.
- **Empty change room:** the bug where a carousel stuck around in the empty layout (or stayed hidden after re-adding) is fixed.
- **Nav switch:** the halves are equal again.
- **Silhouette:** redrawn as a croquis with the dashed stroke.

**Change room v2 (31 Oct):**
- The rails are gone. Each slot shows peeks of the neighbouring pieces, an add card at the end, and a price + ✕ chip.
- The rail version is archived for the case study, next to a "Design process · discoveries" board on the Archive page.
- To check by hand: swiping, and left-handed mode.

Open decisions for you:
- **Rail gap:** option B (price above the dots) is applied. The other mock-ups are still on the Components page for reference.
- **Silhouette:** Fashion or Natural, in "Try-On silhouette · options". Fashion is on the screens now.

Still to check by hand: dragging the garment. Taps on the rail were tested in Chrome, but scripted drags don't register in Figma's player, so the drag-to-pull and the one-piece wobble need a real finger or mouse.

Review fixes 1-16 done (31 Oct). Skills to install by the user in a terminal: ponytail (claude plugin marketplace add DietrichGebert/ponytail; claude plugin install ponytail@ponytail), graphify (needs uv/Python: uv tool install graphifyy; graphify install), agent-skills (npx skills add vercel-labs/agent-skills, to confirm which repo).

## Other files
- `README.md`: how to run, and where everything lives.
- `CASE-STUDY-NOTES.md`: how the project evolved, plus every decision and why.

## 1 November 2026: helper review pass and approved work queue
A coordinated pass used the four helpers in `.claude/agents`. The result is `APPROVALS-2026-11-01.md`: 40 decisions (D), 51 fixes (F) and 12 play-tests (P). **You approved every recommendation and every fix.** On casing, the ux-writer decides, as long as it's consistent: buttons keep their capital look through the text style while labels are typed in sentence case, and banner titles use sentence case. The helpers' detailed findings are in `.claude/review-2026-11-01/`.

Saving a version: Figma's script connection can't save versions, so you save one by hand (File → Save to version history). "Before helpers 2026-11-01" is saved. The ux-ui-designer's rules now accept a hand-saved version. The same rule change to `ux-writer.md` and `~/.claude/agents/figma-animator.md` was blocked by Claude Code's permission check, so it still needs doing.

Work queue (Figma edits run one at a time):
1. The 9 vetted type/colour fixes T1–T4 and C1–C5. Done and checked by the design-reviewer.
2. Animated remove in the change room: done and play-tested in Chrome on 1 Nov. ✕ always brings back the previous piece (your choice "b"), or the next one if you removed the first. A double ✕ removes only once. "Undone!" now shows, and Undo after removing your only bottom works. Not tested: ✕ during a swipe, and bottoms with several pieces. The design-reviewer check is in progress.
2b. Change room follow-ups (in progress, change-room designer):
   - Fixing the white blocks: the 1% tap areas render solid white after being linked to color/surface.
   - The stale peek on open, and an empty peek after a removal.
   - Removal now moves like a forward swipe (your answer "Leaves left, prev from right"). Undo slides back on carousel · top, right hand, as a test; scale it up after the Chrome test passes.
   - Carousel order stays the catalogue order (your answer on 1 Nov).
3. Empty-state merge: you chose A+ (stretch with rounded notch corners, a pad behind the camera, the last piece leaving to the far side). The mock-up is on the Explorations page; build it into change-room-stage once the change room is stable.
4. Designer fixes F1–F33 and the visual decisions D14–D40. For D27, you said "if the helper disagrees rework it": if the Options name box isn't a real text-field (576:325) copy, rebuild it as one, so the placeholder colour fix covers it too.
5. Writer wording F34–F40, plus the D wording.
6. App code F41–F51: a helper already applied these on 1 Nov, but the coded app is now on hold. You'll rework the whole app once the Figma file is ready, so don't spend time on app checks or app fixes until then.
7. Play-tests P1–P12 in Chrome, then design-reviewer checks and the case-study log.

### Where we stopped (1 Nov, late)
- Change room removal and Undo work in Chrome on all four carousels: forward-swipe removal, Undo slides back, fast Undo, chip price, "Undone!", no white blocks, garment taps stay in the room. The hand switch is fixed: the carousel layers in the stage are now named per hand, and my last test showed both carousels mirrored correctly.
- Two left-handed tests remain unfinished. Skip them if left-handed mode is removed (next item).
- **Done on the morning of 1 Nov:**
  - Left-handed mode was removed from the prototype and play-tested. Bring it back in the coded app, as the reviewer advised.
  - The toast now sits above the nav switch again.
  - Night out uses an en space.
  - The motion videos are saved in motion-exports/.
  - The figma-animator is now building A+ on the real change room.
  - Done and Chrome-tested later on 1 Nov:
    - A+ built (stretch, rounded notch, far-side exit, clean whole-room fade)
    - all approved wording (CHECKOUT, sentence-case labels, banners, promise line, Try-On, orders, returns, Options subtitle, captions, curly That’s)
    - the new empty-state lines ("No tops yet")
    - Empty change room → "Change room emptied · Undo", which restores the room and every ✓
  - Now running: the last designer batch, in priority order:
    - P8, so the toast stops replaying on return
    - event-page toast position
    - Beach day banner padding to space/48
    - F11, F16, F17, F18, F21, F22, F27, F29, F30, F31, F32
    - D39 text styles
    - D40 portfolio frame
    - F26 missing states
  - **Colours chosen by you (1 Nov), queued to build once the batch designer finishes:**
    - Disabled Checkout, **option B** ("Quiet surface"): a white button with the shared shadow and "Checkout" in the hint colour. It can reuse cta's "secondary, disabled" variant, with its label on the hint colour.
    - **+ circle, option C** ("Dark"): a black circle with a white + (color/primary and color/on-primary), on every + in the change room (the empty state, the No tops/bottoms boxes and the Add a … cards).
    - Mock-ups are in the Explorations section "Empty-state colours · 2026-11-01" (1185:419).
  - Cancelled by later house rules:
    - F12's padding link
    - F33 (hit-area fills stay plain white at 1%)
    - F24 (the empty states stay per variant)
- **(Older) your requests:**
  1. **Remove left-handed mode.** The new layout makes it pointless. Ask the design-reviewer first what removing it touches: Options "Controls on", the 16 stage variants (hand=left), the carousel left states, the bottom bar and top bar left variants, and the notes and case study. Then have the ux-ui-designer remove it, and log it as a reversal.
  2. **Toast too low in the empty change room:** "Removed … · Undo" sits on top of the EVENTS / CHANGE ROOM switch (your screenshot). Raise it in the empty layouts so it clears the nav, like the other toasts.
- Then: build the A+ empty-state merge (figma-animator; its plan is in the chat summary, mock-up 1121:451 on Explorations), the design-reviewer check of the carousel scale-up (started), the remaining designer fixes (F11–F33, D38, D39, D40), the event-page toast position (y 838 → about 734, so it clears the new bottom bar), Beach day banner padding to space/48, the writer's wording F34–F40, and a case-study log of everything since the last batch.

- The design-reviewer finished checking the carousel scale-up: 0 must-fix. Give these to the change-room designer:
  - Should-fix:
    - "garment · undo" can ghost for about 0.12s when you swipe during the watch window. Keep it aligned with "garment" in every pick, slide and wiggle state.
    - A piece growing out of the peek fades and scales at the same time. Play-test it; if you see a ghost, fade it in earlier.
    - The chip corners and height aren't linked to tokens (older).
  - Safety net: in remove-next-pick, send "nothing found" to rest, so it can't bounce between the two pick states.
  - Double work on open: the screen recalculates the peeks and the watcher does too. Keep one of them.
  - Play-tests: ✕ a top, then ✕ the only bottom within 6s; ✕ a top, then switch to the Events tab and back; tap the corners of the peek.
  - Check the garment edges after the scale-up: the bottom box now runs past the screen edge.
  - Log the newer removal rows: forward-swipe removal and the Undo slide replace rows 163 and 165.

- **End of 1 Nov (final Chrome check passed):**
  - The colours are built: the disabled Checkout is option B (quiet white button, grey label) and every change-room + is option C (dark circle, white +).
  - The whole last designer batch is done:
    - P8: toasts no longer replay
    - icons a true 24px
    - "Removed …" toasts wrap to two lines
    - text styles, 27 in all
    - the Portfolio frame (Screens 1194:9632)
    - token tidy-up and button names
  - Still open:
    - F26 missing-state screens: get draft copy from the ux-writer first, then a designer builds them
    - P12: black clothes nearly disappear on the dark change room (an open problem in the notes; needs your call)
    - a design-reviewer pass over today's last batches (not yet run)
    - unused variables color/on-disabled, color/disabled and effect/glow disabled: delete them or keep them

- **Later on 1 Nov (all answered, built):**
  - P12: a lighter garment backdrop in dark mode (color/garment backdrop #3B3532). Night out: wider word space.
  - Unused disabled variables deleted.
  - Toast rebuilt to grow upwards (two-line toasts no longer sit low).
  - Aplus2: price chips slide in from the side; Try-on shadow fixed; new Checkout and + used (video: motion-exports/empty-state-merge-aplus2-v2.mp4).
  - F26: 18 missing-state frames built, with color/error. The Try-On privacy line sits above the buttons.
  - Bold keywords: "body strong" and "hint strong" styles. Words that only repeat the button next to them are unbolded ("Tap +", "Resend code", "Try again", "another card").
  - Garment tap → product page: **Chrome-tested, passes** (top only, and top + bottom; Back returns; swipes don't open it).

### Still open (end of 1 Nov)
- ~~Bug: stray "Added" toast on Product~~ **Fixed and Chrome-tested (1 Nov):** all 214 links into Product now clear the toast and open Product with "Reset component state". Saved before the edit: "Before Product toast fix". Same fix then applied to the 44 links into Events (saved before: "Before Events toast fix"), Chrome-tested via the tab and the empty-slot +. Still possible: Back links can't reset, so Back to Events mid-toast may replay it (parked). Not yet tested: Add more, Try-On, account and checkout-end routes into Events.
- Chrome rounds on 1 Nov passed: chip slide + Undo, bold words, privacy line, F26 wiring (keys 1/2), Try-On A+C, model route, live Pay total, the once-only toast. Not tested: a real two-line toast.
- A design-reviewer pass over the late batches (F26 frames, bold styles, toast rebuild, chip slide).
- Case-study log of the late items was sent to the case-study-writer.

- **Try-On (1 Nov, evening), Chrome-tested:** bottoms now show (the layers used the tops component); the camera + corner sparkle icon is on the Try it on button; a missing piece gives a one-piece preview plus a toast on the photo screen; the change room no longer replays old toasts. Saved before: "Before Try-On fixes".
- Research: .claude/review-2026-11-01/tryon-competitor-research.md. Explorations: "Try-On photo step" 1273:6654 (A upload + examples, B live camera, C model like me).
- To watch: twice I saw the change-room Checkout label grey with no price at 111.00 EUR; I couldn't reproduce it.

- **Decided late on 1 Nov, all built or in progress:**
  - Photo step A+C, with 32 corners.
  - Reviewer fixes done.
  - Try-On pieces open Product.
  - Payment and sign-in states are wired; keys 1 and 2 open the error states (keyboard only, on purpose).
  - Instructions unbolded.
  - Writer's Try-On copy approved (build labels Even / Wider hips / Wider shoulders / Wider middle).
  - Model-screen sizes sync with Options.
  - The missing-piece toast shows once per visit.
  - The toast's 20px slide is kept.
- **Versions:** Claude now saves them itself with the user-level skill figma-save-version (Chrome, Ctrl+Alt+S). The latest is "Before Try-On copy fixes".

### Queue (1 Nov, evening)
1. The success icon becomes a dashed ring (designer running; saved before: "Before success icon change").
2. Design-reviewer check of the newest screens, including the icon.
3. Page clean-up: run toolbox page-cleanup-scan.js (read-only), show the user an archive / rename / remove list (e.g. duplicate "button" components), then after OK + a saved version run page-cleanup-apply.js. Archive, never delete.

### Questions waiting for you
- None. Parked: Back to Events can replay a toast; confirm the AI provider deletes photos before launch.

### Clean-up batch (1 Nov, afternoon): built, play-test unfinished
Saved before: **"Before clean-up batch"**. Two designers finished:
- **A:** notch gaps both 12 (upper curve 24, lower 32; dark plates moved too); new Try it on icon **ai_sparkle** 1280:1787 (no camera, open square + sparkle, optically centred); one shared **success-check** 1352:2798 on new **color/accent-strong** (#8A6E06 light, #D9B23C dark); 1% fills on Size guide "tap to close" and all 50 size-picker options.
- **B:** build picker on "A model like you" (variable try-on/build, default Even); one **try-on figure** 1345:59 replaces 7 copies and follows the build; ✕ on Photo not usable / Generation failed goes to the change room; key 1 opens those errors from preview / generating; 1% fills on 10 ✕ and back buttons; photo-screen toast 12 above the "Use a model instead" tap area (y 659).
- The page clean-up scan ran and found the file clean. The case-study log of the batch is done.

**Chrome play-test of the batch: passed** (1 Nov, later session):
- Notch with even gaps, in light and dark (the dark plate's notch matches the empty box). Undo after the last bottom, the last top and a fully emptied room.
- The new icon reads centred, in light and dark.
- The success ring on Order placed is round, darker gold and has no white box, in light and dark. Return started and Password changed share the component and weren't opened.
- Size guide: a tap above the sheet closes it. Tapping beside a size number works on the model screen and in Options (Make it fit and Product weren't tried).
- Build tiles: exactly one is selected, Even by default. Wider hips shows on generating, result and Generation failed. Sizes and build carry over between the model screen and Options.
- Key 1 opens Generation failed (from generating) and Photo not usable (from preview). "Change the model" returns to the model screen with the build kept. ✕ on both error screens goes to the change room with no old toast.
- The missing-piece toast sits just above "Use a model instead".
- Checkout: the back arrow works on Paying, Card declined and Payment failed.

**New bug found in that test:**
- **✕ swallowed after a removal:** after removing the only top, a ✕ on the only bottom about 4–5s later did nothing. The toast went away, but the bottom stayed, and a second ✕ after the wait worked. This is the "✕ a top, then ✕ the only bottom within 6s" case the reviewer flagged earlier; the watch window seems to block the second removal.
  - Not a bug: Undo tapped after the toast had timed out landed on the empty box and opened Events.
  - Key 1 on generating missed once when it was pressed late; it worked when pressed straight away (keyboard-only demo trigger).

**Icons and notch (1 Nov, evening): built and Chrome-tested, all pass.** Saved before: "Before icon line caps and outline stars".
- menu, search and Turn around ("360") now have round line ends. The masters for search and Turn around had been deleted and are restored on Components.
- ai_sparkle: the stars are empty outlines, and the small star is 40% bigger so its inside stays open.
- Notch: the inside curve is 36, concentric with the Try it on button; the outer turns are 24. The outline is one continuous dashed path. The 22 dark plates match and have their rounded corners back.
- The old notch pieces are still in the file at 0% opacity. They can be deleted now that Chrome has passed.
- New house rules: round icon line ends, and notch curves taken from the button.

**Reviewer follow-up batch (1 Nov, late): done.** Saved before: "Before reviewer follow-up batch".
- Chrome-tested and passed:
  - Try-On ✕ tap areas end at the screen edge, on whole pixels; back buttons on whole pixels.
  - The photo route always shows Even.
  - The success ring's dashes are even.
  - The last hand-drawn figure is now the shared figure.
  - The old notch pieces are deleted.
  - Checkout and Search clear the toast.
- "Undone!" after Options: better but not gone. It no longer replays in full, but it still shows during the slide back, then hides.
- The fix for the ignored second ✕ was **tried and reverted**. It left the room in a mixed layout with the wrong prices, so the old bug is back (still open). The designer's tip for a next try: put the layout change at the very end of the ✕'s actions.
- Watch: in the last Chrome round every transition looked slow, with faint copies of the previous layout for 2–4s. It may be the player in a long session. Recheck in a fresh browser.
- Not done: the play-tests for a double "On drag" on garments (drags can't be scripted) and for taps on garment corners.

**User feedback, 1 Nov (annotated screenshot, saved as `.claude/review-2026-11-01/user-feedback-annotated-2026-11-01.png`). Not built yet; questions asked first.**
1. **Beach day banner is "off".** Make guidelines for event banners (my read: the script title is much bigger than on Night out and Casual, runs to the banner edges and sits lower). Write banner rules (title size and safe area, position, padding, photo crop) and fix every banner against them.
2. **Empty-state line should have a bold word.** "No bottoms yet · Tap + to add bottoms from an event." The user underlined "add bottoms" and said "the ux-writer didn't do its job". The bold rule and the ux-writer's checks need fixing; it applies to "No tops yet" and the empty room too.
3. **Weird jump on VIEW.** Tapping VIEW in the "Added to change room" toast jumps oddly into the change room. In the screenshot, Checkout shows no price, a peek garment sits off-edge and a dark half circle shows at the left edge. Reproduce it in Chrome.
4. **Remove the Events intro line "Every top goes with every bottom."** and the empty space it leaves, so the Casual banner sits right under the top bar.
5. **Replace the silhouettes with photos**, like the Gender picker in Options ("more consistent and professional"). The arrows point at the build tiles on "A model like you" and the Like this / Not like this examples on Try it on.
6. **"Why is 'take' bolded?"** On Try it on: "Choose a full-body photo or **take** one". Under the current rule, words that only repeat the buttons below shouldn't be bold.

**User's answers (1 Nov):**
- Empty states bold the noun: **bottoms**, **tops**, **pieces**.
- Try it on bolds **full-body** only; "Choose" and "take" are unbolded.
- **No drawn silhouettes anywhere** ("I find them ugly"). Replace them with photos everywhere: the build tiles, the Like / Not like examples, and the Try-On stand-ins (generating, result, Looks good?, error screens).
- The photos are **AI-generated** to match the Gender picker: B&W, plain background, the same pose in 4 builds. The user reviews them before they go in.
- The bold rule in house-rules.md is rewritten to match. The old rule had told the writer to bold "Choose … or take", so the miss came from the rule, not only the writer.

**Photos (1 Nov), user's answers:**
- The drafts' style is approved.
- The photos follow the Options gender; women's is the default.
- Result screen is option (c): a real photo for the demo outfit (black tee + grey joggers), garment layering for everything else.
- Eight AI images were generated with Figma (AI credits on the file's plan). They're in the file as 1410:181, 1414:181, 1410:6863, 1414:182, 1410:6864, 1414:480, 1414:183 and 1414:184, with full-size copies in `.claude/review-2026-11-01/photo-drafts/` (the Figma links expire after 7 days).
- A designer is replacing every drawn silhouette with them.
- Bold audit (10 more lines): on hold. The user asked "why is it bolding full sentences and buttons". I found no full sentence or button bolded in the edited screens and asked them where they saw it.

### ▶ NOW (3 Nov): building the site (Claude is the programmer now)
- **User decisions (3 Nov):**
  - Start with GitHub; free hosting; a mock Try-On ("Mock result"); the core shopping flow first.
  - The portfolio site is coded like the apps; hosting is GitHub Pages with public repos; a free address for now (blend at <user>.github.io/blend/).
  - **Everything** goes into the public repo (case-study notes included; the photo drafts in .claude/review-* are still left out for size).
  - The user installs GitHub CLI; pending. Plain `winget` isn't found on this PC because the user PATH lost its WindowsApps entry, so use the full paths: `& "$env:LOCALAPPDATA\Microsoft\WindowsApps\winget.exe" install --id GitHub.cli -e`, then `& "C:\Program Files\GitHub CLI\gh.exe" auth login` (VS Code only sees the new PATH after a restart).
  - Figma's "Connect GitHub" (the Figma GitHub app, for Code Connect) isn't needed; maybe later for the case study.
  - Figma is locked: build without editing it (reads still work).
- **Answers to the pending list:**
  - The 15 defaults stay.
  - Welcome: "can you animate the logo on the welcome screen to go where the logo on the top bar is after the screen loads?" (built in code).
  - The Product brand line uses the 13px hint style.
  - Both badge halves at 99+ show a single "99+".
- **Done (Claude):**
  - react-router 8.5 + motion 14.9 installed; `base: '/blend/'`; .github/workflows/deploy.yml (Pages, with the 404.html copy).
  - index.html loads the Figma fonts.
  - The old UI moved to src/legacy/ (excluded from the build).
  - New: store (src/state/store.tsx), data (events.ts in Figma order, sizes.ts with the Figma size-system labels and size guide cm), lib (format, asset), ui (Icon with fallbacks for the Figma SVGs, primitives Cta/RoundButton/TopBar/Header), filtering.ts (matches the old Search counts), routes in App.tsx.
  - Placeholders for every screen. Build passes.
  - scripts/export-figma-assets.mjs written (needs a new Figma token: the old one expired on 3 Nov).
  - A secrets scan of all 170 repo files came back clean.
- **Built by three coding helpers (all done):**
  - Welcome / Events / ProductCard / Toast / Product;
  - BottomBar / ChangeRoom / Checkout / OrderPlaced;
  - SearchSheet / ChipBar / Try-On mock / Options.
- **Integrated by Claude (3 Nov):**
  - **Logo:** an inline `src/ui/Logo.tsx` built from Figma's paths, with primary letters, an on-primary outline (dark mode flips both) and always-white letters on photos. Its box is the letters only (46.46 × 15.6 at x 20, y 27.2). Welcome's logo is 3× that and glides at scale ⅓. The old file is in src/legacy/brand/.
  - **Toasts:** new kinds `emptied` (Options › Empty change room · Undo) and `checkout-empty`.
    - In the change room the pill rests at 128, 322 wide beside Try it on (full width when the room is empty), per Figma's toast instances. The pill sits 12 down in Figma's 70-tall toast frame and 10 up from its bottom.
    - Toasts hide while Try-On is open.
  - **Try-On:** now /change-room/try-on. The sheet is portalled over the mounted change room, #root is inert while it's open, and focus returns to Try it on.
  - **Other fixes:**
    - The filter dot is 10 × 10 at 10/11.
    - Events uses --bottom-bar-h.
    - The Header subtitle takes rich text and is 15px.
    - main.tsx now imports the global CSS **before** App, so component rules win (this fixed a stray focus ring in the search field).
    - Below 420px wide, the tab label shrinks (13–16px), so "CHANGE ROOM" fits beside the badge down to 360.
  - **Icons:** the 14 Figma icons, exported through the Figma MCP, are now in src/assets/icons (fills are currentColor).
- **QA (no Chrome extension):** headless Chrome over CDP, with the scripts in the session scratchpad.
  - Covered: Welcome, Events, add/undo, Change room, Try-On, search and filters, Product, Checkout → Order placed, Options, dark mode, 375 × 667 and a 1280 desktop.
  - No console errors; `npm run build` passes.
- **Still open:**
  - **Day off banner:** no photo yet. Figma's banner has the title baked in, so it needs the new Figma token (`npm run figma:assets`), which also brings full-size originals for all banners.
  - **Female model:** the white background is still on the photo (visible as a light block in dark-mode Options).
  - ~~"CHANGE ROOM" still gets cut on 320-wide phones.~~ Fixed (3 Nov, late morning): below 360 the label wraps to CHANGE / ROOM (NavSwitch.css).
- **Narrow-phone fixes (3 Nov, late morning), checked at 320–430 in Chrome, build passes:**
  - CHECKOUT clipped its total below ~375 ("ECKOUT 528.00 E"). The button is now a size container: below 209 wide the currency is hidden from view (still read out), below 171 the label is 13px, and under 360 the bottom bar's search / Turn around pills are 56 wide. The longest total (2,5xx.00) keeps at least 8 each side at every width.
- **Figma assets (3 Nov, ~11:30):** the new Figma token is in `.figma-token` (git-ignored; the user had put it in a file name, now removed). `npm run figma:assets` ran. Now wired:
  - **Banners:** Office hours had been showing the Day off garden photo (old `work.webp`); now each event uses its own Figma photo, and **Day off has its banner**. The old banner files are only used by src/legacy.
  - **Gender photos:** `public/gender/` (2×, transparent), so the **white box behind the female model is gone**; `mix-blend-mode: multiply` removed from Options.css.
  - **Try-On:** the demo person and the "not like this" example are the full-size Figma photos.
  - Removed 5 images nothing used (business-casual, demo-person, example-not-like, gender-women, gender-men).
- **Tab-switch jump (user, 3 Nov):** on desktop the page scrollbar came and went between Events (scrolls) and the change room (doesn't), shifting the column ~10px. Fixed with `scrollbar-gutter: stable` on html (base.css); positions now match on both tabs.
- **Logo on photos (user, 3 Nov): "isn't like it should be".** The code matches Figma exactly (Layer_1 export: same paths, white fill + white 1px outline, 15% shadow, at 20 / 27.2). Asked the user what should change.
- **Git:** first commit made (90tsky, noreply email). `gh repo create` was blocked by Claude Code's permission check (public repo); the user runs it or approves it.
- **Lost session (3 Nov):** clicking a Windows notification opened the session's *current* folder (e.g. Blend) in VS Code, which reloaded the window and dropped the chat. Fixed in D:\Kris Work\Claude\hooks\notify.ps1: the click now opens the folder the session started in (`CLAUDE_PROJECT_DIR`), so VS Code only brings the window forward. notify.log shows the click target on each line.
- **Next:** once `gh auth login` is done, set the repo-local git name and noreply email from `gh api user`, commit, create the public repo "blend", push, switch Pages to GitHub Actions, and check the deploy.

### ▶ (2 Nov, very late): handoff pass running; possible pivot raised
- **The user (latest):** "im having an idea that will change the apps core what if its not an brand but more like a social page for 2nd hand clothings with bidding ( i dont know if that changes the idea for events and changeroom want to explore this idea before handling it to the programer ?)". Claude answered with a view and questions; **the build plan is on hold** until the user decides.
- **Done this round:**
  - Switch-camera arrows redrawn thinner (1.14 line, like the timer), in component 1928:14947.
  - Tags on Product skipped for now (the user).
  - The user chose to stay a web app.
  - Tokens: design-tokens/figma-tokens.json + scripts/tokens-from-figma.mjs (`npm run tokens`) → src/styles/figma-tokens.css. The old tokens.css names now point at the Figma ones. index.html has data-theme="light" until dark mode is built in code. The build passes and the app renders.
  - Git: `git init -b main`, .gitignore extended (photo drafts in .claude/review-*/ and personal settings left out), 117 files staged. **No commit yet:** git has no name/email on this PC, so ask the user which name to use.
  - Events · bottoms: "+" and the search button now open Events · bottoms · search open, so the kept "bottoms + Casual" state is reachable.
- **Saved:** "Before handoff pass".
- **Handoff pass done:**
  - "Start here · handoff" 1950:1062 is now the first page: overview, flows as wired, number keys, sections, tokens; 179 links.
  - 29 screen notes.
  - 106 component descriptions and 279 Dev Mode notes (164 Prototype only, 63 Interaction, 25 Development, 27 Accessibility).
  - The parked "Try it on" in the two empty stage variants (723:3465, 723:3480) set to opacity 0.
  - Docs fixed (house-rules 203/12; PROGRAMMER-NOTES chip bar = sunken track; tags parked).
  - **Saved:** "Handoff pass done".
- **For the user's list (from the helpers):**
  - an old hidden count badge 532:9339 is still inside all 349 round buttons;
  - the menu button is spoken "Menu" in Figma but "Options" in the code (Claude would pick "Options");
  - two section names are out of date ("Shop · product, search, orders" has no search; "Shop · offline, sold out, first visit" has no first visit);
  - a loose "top bar" instance 1872:50987 sits in the Account section (probably the user's own source copy).
- **Second-hand + bidding idea (3 Nov):** moved to its own folder. The user: "move that last idea to its own folder we can think about it seperately". The folder is D:\Kris Work\Portfolio\Blend second-hand idea\ (IDEA.md: the user's words, what carries over, what breaks, 3 directions, 4 questions). It no longer blocks blend, so the build plan is back on.
- **Waiting on the user:** the git name for the first commit.

### ▶ (2 Nov, late night): chip bar A + knob switch built; design nearly done
- **Built and Chrome-checked:**
  - Chip bar A: sunken track, grey chips, raised +.
  - Knob-only switch: 203×48 knob, badge 12 from its edge.
  - The picked suggestion pill is grey.
  - New simple switch-camera icon 1928:14947.
  - Checkout starts in "init" 1932:1062, so screens open showing the right state.
  - Each bottom-bar version's cart label has its own name.
- **Saved:** "Chip bar A, knob-only switch, simple switch-camera icon".
- **The user asked:** what's left to design, and which tools to use for programming. Answered in chat: design is close to done; prep the handoff; keep React + TypeScript + Vite, add Motion, React Router, token sync from Figma variables, git/GitHub, Vercel/Netlify and a small try-on function.

### ▶ (2 Nov, night): colour switch, Events top, event pages archived, account top bars
- **User approvals:** "I like everything you pointed out in the search in events selection". Confirmed: E's six picks, the writer's search wording, and G's calls (48 tap areas around 40 pills, all 8 events in the sheet, the keyboard as a picture). The event-page shortcut is moot now.
- **Done (Chrome-checked):**
  - The badge content lost its visibility binding while the user recoloured it; re-bound to properties/added in all 7 states.
  - The search dot, the badge pill and the chip bar now use the toast's UNDO colour (color/primary + color/toast action 16%). The user likes it on the dot and badge but **not on the chip bar**, so a designer is exploring options on Explorations (running).
  - The count line ("8 events · 5 pieces") is hidden on the 8 filtered states.
  - Events top: on 12 Events screens the banner starts at y 0, and the fixed top bar has a shade, a white logo and the menu. Checked while scrolling: the logo always sits on the pinned banner.
  - Event pages: the 8 pages and their loading, offline and load-error states are on Archive (section 1899:28763). 88 banner taps and 28 event suggestions now do nothing; the 2 Night out notifications and "Bottoms, remove filter" go to Events. A scan finds nothing linking to them.
  - Account: the user's top bar (logo, menu hidden) copied to Sign in and 24 account states (25 in all). Welcome is skipped (it has the big logo).
- **Saved:** "Before Events banner to the top", then "Events banner to the top, event pages archived, account top bars".
- **Chip bar exploration:** section 1907:1221 (A sunken track, B floating chips, C outline, D brand tint). The user: "i like A the most too but i think it looks to much like the event-changeroom button but im starting to think the tick tack should be like this and the event-changeroom button should change". Switch options: section 1916:1368 (1 knob only, 2 tabs with a line, 3 grey pill). The user: "option 1 is greeeat! gj".
- **Saved:** "Before chip bar A and knob-only switch".
- **Building now (same designer):**
  - chip bar A: sunken track, UNDO-grey chips, raised white +, plus the typing bar;
  - the picked suggestion pill in UNDO grey (Claude's call, told the user);
  - nav switch Option 1: no track, a 48-tall white knob filling half, the badge 12 from the knob's edge.
  - Then Chrome play-test: knob slide, tabs, badge, filters, search sheet, dark mode, and the toast position if the bar height changes.

### ▶ (2 Nov, late evening): card + and Checkout smart-animate
- **User:** "take a look at the buttons D:\Kris Work\Portfolio\Videos\blend-notes as you can see from the video in this folder the animation of both buttons is instant and we need it to be smart animation on all interactions". In the clip, the card + flips to ✓ and back, and CHECKOUT flips grey ↔ black, both instantly.
- **Done (Chrome-checked, slowed to 2s to see the frames, then set back):**
  - add-toggle 325:7407 has a new "phase" setting (settled / from plus / from check, new variants 1863:1062/1067/1072/1077).
  - All 437 card + taps first switch to the same-looking twin, so the flip morphs in 0.2s ease-out. The logic is untouched (toast, badge, totals checked).
  - Undo is instant but correct. Ending the morph on a twin made Undo leave a stuck ✓, so it was reverted.
  - Checkout: the black/grey background moved into cart-label 810:124. "enter" now starts from the off look (paddingLeft 78, price at opacity 0), and a new "leave" 1857:1063 is used on the way out. Result: 0.3s slide-in with the price, 0.2s slide-out, no overlap. The cta underneath keeps the taps (CHECKOUT still opens Checkout).
  - House rule and programmer notes added.
- **Saved:** "Before smart-animate + and Checkout buttons", then "Card + and Checkout smart animate".
- **Note:** the Chrome window is in the background, so its timers are throttled. Animations look slower or late in my tests, but should be normal in a foreground window.

### ▶ (2 Nov, evening): search demo wired and Chrome-tested; collecting the end list
- **User (evening), verbatim:**
  - "i dont want the whole search to work just a simple demo to show the programer later"
  - "yea i think the programer could add event/clothing types/brands/colors into the tags himself (they could be shown on the product page if it will make a cool design choice)"
  - "also keep everything in for the case study and so that we can show it to the programer later"
- **Done:**
  - Search button (main + all screens) → Events · search open 1807:14046.
  - Tops/Bottoms suggestions → Events · tops 1814:18532 / · bottoms 1814:17548.
  - Change room "+ Add a top/bottom" and the + under "No tops/bottoms yet" → those states (0.2s fade).
  - Old Search pages → Archive section 1824:35609 (nothing links to them).
  - Chrome: search → Tops → ✕ works; change room + → Events · bottoms → + a bottom (1 · 1, 111.00) → ✕ works; "Add a bottom" card works; no "EUR ✕" flash.
- **Fixed on the way (all now house rules):**
  - Search taps ordered Navigate before the press Change to (37 buttons).
  - Doubled taps removed.
  - "tab" unbound on the 10 filter-on bars (the first-match variant bug).
  - Toast at y 676 on the filter screens.
  - Close search → Back.
  - Parked price chips at opacity 0.
  - The typing field's tap moved to its 48 bar.
  - The ✕ in the typing field → search open.
- **Every built state is kept**, including bomber, shorts, beach, wedding, no match, bottoms · search open 1820:17932 and bottoms + Casual 1820:19289.
- **New file PROGRAMMER-NOTES.md:** search-as-filter behaviour, the tags idea, what the demo can't do, spoken names, the split badge and the BottomBar.tsx pointer. Copy inventory and glossary updated.
- **Saved:** "Search demo states built, before rewiring", then "Search demo wired (search in Events)".
- **Reviewer's leftovers, skipped for the demo** (in the programmer notes where they matter): reset-scroll on opening search; a dark keyboard; the ✕ placement in the typing field; spoken names on the filter-on search button and the chip "Close" icons; a sheet-rise motion instead of the fade.
- **Running:** case-study log of this whole batch.
- **Next:** the user's end list (below), then close the Chrome tabs.

### ▶ (2 Nov, late afternoon): split badge building, search-in-Events being designed
- **User decisions:**
  - Count: "okay so I chose option A)", the split tops/bottoms badge (no total added to Checkout; Checkout already shows the price).
  - Search: "make it an event filter scrap the search menu and rework the search in events", and "I want to have the search moved to archive and rework the whole interraction". Start from the user’s own "A + C" frame 1755:21485 (a black chip bar above the nav switch with "Bottoms ✕"), with a dot on the search button instead of the black button (the user agreed). Show more chips ("ticktacks") and how adding one works.
  - The filter stays while browsing inside Events and clears with ✕ or on leaving the Events tab.
- **Saved:** "Before split badge and search rework".
- **Running:**
  - E designs "Search in Events" on Explorations (more chips, adding a chip through a bottom search field with suggestions, results grouped by event, no-results and first-visit states, the "+ Add a bottom/top" entry, and a replacement plan for the 7 Search pages). Show it to the user, then build and move Search to Archive.
  - F builds the split badge in the nav switch.
  - The design review, resumed after the session break.
- **Done since:**
  - Camera timer works in Chrome: "Try-On · camera · timer on" 1776:10762 is its own screen and the timer buttons navigate between the two. The real cause was the timer button’s own press feedback (its face’s Mouse down → pressed state) swallowing the tap; removed in the camera controls component 1734:16940. The countdown ticks (5 → 4 … → Looks good?). House rule added.
  - Welcome: "Continue as guest" moved up 18 (y 752) so it clears SIGN IN by 12; its "account deleted" pop-up moved with it (y 692).
  - Case-study log done (54 rows). Its questions for the end list: reasons for several fixes in the user’s words; is "Keep both" the event name in header and banner; who accepted card names cut after 2 lines; forum link (skip).
  - Product · size sold out: XS/S/L/XL now set the size and go Back to Product (they used to leave the shopper stuck on "sold out"). Chrome-tested. Still open: on "Product · notify me on" 1732:9058 the other sizes do nothing (Back would land on the sold-out screen); listed for the user.
  - Checkout · sold out checked: its rows and PAY total follow the change room, so "PAY 0.00 EUR" only shows when the frame is opened cold.
- **E done:** "Search in Events · 2026-11-02" 1784:211 on Explorations (rows 1–7, plan 1788:13579). E’s picks for the confirm list: same-kind chips widen, different kinds narrow; 3+ chips scroll with a fade (no "+3"); the filter survives Back from Product, Options and Checkout; Popular pieces open Product; the count is a line at the top of Events; "+" and the search button open the same search state.
- **Saved:** "Before search-in-Events build".
- **Running:** G builds it. Phase 1 = components only (chip, chip bar, suggestions sheet, keyboard). Phase 2 waits for F (bottom bar "filter on", 11 Events states, links, Search pages to Archive). The writer audits E’s wording in parallel.
- **F done, Chrome-tested (all pass):** the split badge "badge · split" 1793:295 in the nav switch 731:3705: + a top → T-shirt 1; + bottoms → 1 · 2 (Checkout 200.00); Undo → 1 · 1; ✕ the bottom → only T-shirt 1; ✕ the top → no badge, label centred; Change room key 1 → 7 · 5; Product → Add → View updates on landing; dark mode → light pill with dark glyphs. New text variables labels/tops / labels/bottoms, filled by the badge’s own 0.15s check. The old badge stays (349 copies in round buttons, the camera timer and Explorations). F’s question: 99+ · 99+ shortens the label to "CHANGE RO…"; accept, or a single "99+" in the coded app?
- **Design review of waves 1–2 done:** 1 must-fix, 4 should-fix, 1 nice-to-have. H is fixing them: the "No card yet" card at 43 tall → 60; shorts in the 56 list tiles; outline tick/cross icons → filled; busy states lock every tap; 13 frames moved into dated sections. Done by me:
  - The camera screens’ empty header title now reads "Take a photo" on all 3. The API couldn’t hide it: the title’s visibility getter errors.
  - Delete account?’s side-by-side buttons match Sign out? (added to the house-rule exception as a designer’s call).
  - Events · loading and Event · Casual · loading move on after 1.5s (Back to the loaded page). Chrome-tested.
- **Writer’s search wording done and sent to G:**
  - Tops before Bottoms.
  - ✓ as an icon.
  - Long queries and chips cut off with "…".
  - The no-results title wraps.
  - A new "no match for these filters" state: "Nothing for these filters yet" / "Remove a filter, or start from one of the **events** below.".
  - A tap on the dim closes search.
  - Spoken names ("Casual, add filter", "Search, 2 filters on", "Clear text").
  - "filter" added to the glossary (the user’s word). Copy-inventory rows go in once the Search pages are archived.
- **G phase 1 done, phase 2 partly:**
  - Components page, section 1803:441:
    - filter chip 1803:470
    - chip bar 1806:11153
    - chip bar · typing 1806:11154
    - suggestions sheet 1806:11272
    - keyboard 1803:471
    - icons add 1803:442 and check 1803:445
  - bottom-bar "filter on" 1807:10237.
  - Screens section 1807:14045: Events · search open 1807:14046, · first visit 1807:15023, · typing tee 1807:16000.
  - Nothing links to them yet; search still opens the old pages.
  - G’s calls (for the list): suggestion chips 48 tap around a 40 pill; the "tee" row 48 and round; all 8 events in the sheet; the keyboard is a picture (its return key can’t say "Search").
- **H done (review fixes):**
  - "No card yet" 1728:8230 is 60 tall (min height).
  - 24 shorts tiles now hold a 40 "shorts photo" frame with 8 all round, incl. the hidden g04/g05 Checkout rows. 31 jacket tiles were nudged ½px to centre.
  - New filled icon/tick 1807:13066 and icon/cross 1807:13069 replace 24 outline icons on Try-On · photo, preview, photo not usable, camera blocked and photo access blocked.
  - Busy screens: Google, Facebook and the links are off during the wait (Chrome-checked).
  - New dated sections: "Shop · checkout states (2026-11-02)" 1809:12756 and "Try-On · more error states (2026-11-02)" 1809:12757; the order states and Options states sections grew. All 17 links still work.
  - Follow-up done: build-tile's selected badge uses icon/tick 1812:15569 (Try-On · model like me). success-check 1352:2798 has a filled "check" 1812:15572, with the dashed ring kept as an outline (Order placed, Password changed, Return started). Every tick and cross is now filled. My calls (for the list): ← stays working on the sign-in busy screens (a cancel, unlike paying); "No card yet" keeps the 60 min height, no new copy.
- **SCOPE CHANGE (user, 2 Nov evening):** "i dont want the whole search to work just a simple demo to show the programer later". So search stays a demo: no more states, no more polish.
  - Building stops after J’s Events · bottoms and Events · tops.
  - The final wiring covers only the main path: search button → Events · search open; Categories Tops/Bottoms → those states; change room "+ Add a top/bottom" → Events · tops/bottoms. Then the old Search pages go to Archive (the user asked for that earlier).
  - The extra states already built (bomber, shorts, beach, wedding, no match) stay as they are.
- **G group A done:**
  - Events · tee 1812:15586, · bomber 1812:16608, · shorts 1812:17630, · beach 1812:18652, · wedding 1812:19697, · tee + bottoms · no match 1812:20722 (key 1 on tee).
  - "wedding" added to Recent.
  - Waiting on J’s frames: Categories Tops/Bottoms in the 3 search states, and ✕ tee on no-match → Events · bottoms.
  - Chrome-tested: Recent tee → Events · tee (chip, dot, "5 events · 4 pieces"); + on a card updates the badge; ✕ → plain Events with the tee kept; key 1 → no match; its card → search open; the dim closes search.
  - Fixed by me:
    - On the 6 filtered states the toast covered the chip bar, so it moved from y 732 to 676 (12 above the 184 bar). J was told.
    - "Close search" 1807:14940 on search open now goes Back, so it returns to the filtered state it came from (Chrome-checked from Events · tee).
- **Running now:**
  - G group A: Events · tee / bomber / shorts / beach / wedding, tee + bottoms · no match (key 1 on tee), and the search-open links. Event suggestions open the event page, a prototype shortcut.
  - J group B, new section below: Events · bottoms / tops / bottoms · search open / bottoms + Casual.
  - Reviewer: G’s components and the 3 states.
  - H: review fixes.
  - **Then:** the final rewiring (search button main component + 21 overrides; change room + → Events · bottoms/tops), the scan for zero links into Search, archive the 7 Search pages + 2 headers, the copy-inventory rows, Chrome play-test, case-study log.
- **Seen in Chrome, fix after G (change-room stage is locked):** opening Options from the change room with no bottom flashes the empty bottom price chip "EUR ✕" for about 0.3s as the screen pushes out. Cause: in the stage’s bottom=false variants (e.g. 723:3391) the bottom carousel’s chip I815:3946;965:4844 is parked off-stage at x 454, opacity 1, ready to slide in; during a Push the overflow past the screen edge shows. Fix: clip the stage variants at 430, or set that parked chip (and the top one in top=false variants) to opacity 0 like the other parked layers. Chrome-check the chip still slides in when a bottom is added.
- **Reviewer’s questions for the user’s list:**
  - did "bring the brand back small" mean the 13 hint style (it’s 15 body grey now);
  - My orders · running late’s card opens Track order · running late (kept, seems right);
  - Product · notify me on: the other sizes do nothing.
- **Search links to rewire (mapped 2 Nov):** the search button lives on the bottom bar’s "face" layers I723:3079;722:109 (Events side) and I723:3146;722:109 (change-room side), each overridden on 21 screens. Inside Search 604:1667 only: Enter → first visit 1732:9261, and the 5 recent rows → tee 604:1520, bomber 604:1578, shorts 604:1627, beach 611:2300, wedding 618:2257. Nothing in Components links to Search. The change room’s "+ Add" links don’t open Search yet.

### ▶ NOW (2 Nov, afternoon): the user answered the question list; answer builds running
**Answers (2 Nov, three rounds):**
- Try-On ✕ stays top-left. Brand label comes back small on Product’s details line. Event pages keep both names. Make it fit keeps the tighter spacing.
- Copy fixes: all four (CVC error names the field; Notifications say "Order #BL-…"; New password’s first label → "Password"; shorter My orders · empty line). DONE on Return started fades to Events. The Enter code line goes on every email. Build the My orders photo plate (new theme colour #f4efee / #cfc8c2).
- Flow fixes: all four (#BL-19302 opens returns-closed; drop Make it fit’s ←; grey out main buttons on error states; block leaving while paying). New frames: ALL groups (B6–B23). Shorts: a card variant per shorts photo. Sign-in: neither phone nor Apple for now (the user had asked whether phone sign-in is usual; Claude answered it’s unusual for an EU fashion shop).
**Dark mode fixed (user report, 2 Nov):** the bottom bar stayed light and the Try-On button text was barely visible.
- Cause: a known Figma player bug. After "Set variable mode", only screens already drawn get fully recoloured; screens drawn for the first time afterwards keep some fills (frames, button and bar backgrounds, some text) in light.
- Fix: every screen (72) has a 0.01s After delay: if options/appearance is "dark", theme light → dark. Chrome-tested: Try-On, A model like you, Card declined, the change room and Product all render dark correctly. House rule added (new screens must copy it).
- Ruled out on the way: explicit modes (none), the bindings (identical to working screens), covering layers, the toast, the transition type, re-applying dark on load.
- Versions: "Before dark-mode fix and answer builds", then "Before answer builds (dark-mode fix in)".
**Running now (scope-locked):** writer (4 copy fixes + Enter code line, plus draft copy for B6–B23); A (brand on Product details line, shorts card variants); B (photo plate colour + tiles, DONE → Events, #BL-19302 → returns closed, block leaving while paying); C (Make it fit without ←, greyed main buttons on error states, archive Enter code · unknown email). Next wave: the new frames B6–B23 from the writer’s drafts, split A (B8, B15), B (B6, B7, B10, B12, B19, B23), C (B11, B17, B18 account bits, B21), D (B9, B13, B14, B16, B18 loading/running late, B20, B22). Then Chrome round, design-reviewer, case-study log.
**Wave 1 of the answer builds: done.**
- Writer: the 4 copy fixes, plus the Enter code line on every email, as "we’ve sent a code" since the code is already sent there.
- A: the brand starts Product’s details line on all 21 variants; card layouts "shorts · g04" and "shorts · g05" are each centred.
- B: color/thumbnail plate (VariableID:1716:24829) on 101 tiles; DONE fades to Events; #BL-19302 opens returns-closed, and the old page is on Archive; ← and the menu are locked while paying.
- C: Make it fit has no ← (the header’s "none" variant now starts at x 44); main buttons are greyed on 12 error states; Enter code · unknown email is on Archive; Resend code on the code errors returns to a working Enter code.
- Docs updated: the copy inventory, the voice guide (order numbers, the Enter code line, prices over 1,000) and the house rules (brand, thumbnail plate, paying lock).
**Wave 2 running (the new frames B6–B23, from the writer’s drafts):**
- A: **frames done** in the section "Shop · offline, sold out, first visit" 1731:1647: B13 offline / load error (Events keys 2/3, Event · Casual keys 2/3, Product keys 2/3, a new status-block part); B8 sold out (Product key 1) and Notify me on (a new toast · notify part); B22 Search · first visit (Search key 1); the B15 long-name test sheet 1733:1868. B15 breaks: the Product header covers the photo with a 2-line name (coded app: content must follow the header height; today only Cropped Suede Trucker Jacket wraps, already handled); Return an item overflows (A is fixing it); the Checkout row is at its limit (B makes it grow); card names cut after 2 lines (accepted). Follow-ups **done**: the shorts backs are centred too (a new part, shorts photo 1734:17947; the old garment layer is hidden and unlinked in the two shorts layouts); Return an item wraps long names in a column (content · Return an item 1734:19652); the Casual offline and load-error states have no subtitle.
- B: **done**: the even 8 in 98 tiles. 12 frames: B6 sign in first (Checkout key 3); B7 nothing saved yet (key 4) with empty Delivery address and Payment method; B13 Checkout offline (key 5); B12 Checkout sold out (key 6); B23 Order #BL-20481 (its My orders card opens it; the hoodie matches the card); B10 return in progress (My orders key 2, Order #BL-19877 key 1); B18 running late (My orders key 3, Notifications key 2, Track order key 1). **Then done:** Go to events sets the Events tab; B19 (the pickers got "new option=shown" variants, hidden until SAVE; the new frames Delivery address · new address added 1734:19461 and Payment method · new card added 1734:19519, with Address saved / Card saved pop-ups; caveat: ← on Checkout steps back through the save screens); B12 Change room · sold out 1734:22073 (Change room key 2); Checkout item rows grow with long names (168 rows; today’s are unchanged).
- C: **done**: Options · guest (Options key 1); Delete account (last on Options) with a confirm dialog (copied from Sign out?, so it keeps the dim and outside-tap close) and an "Account deleted" pop-up on Welcome; busy buttons on the real taps for 1.5s (Signing in…, Creating account…, Sending code…, Saving…); field-error states (Sign in keys 4/5, Create account key 5, Forgot password key 1, Enter code keys 3/4/5, New password key 3); Resend code opens a 30s wait state everywhere; the limit message is grey hint text with CONTINUE still usable. To confirm: the busy states on the real buttons; Options · guest by key. To fix: on Welcome the "Continue as guest" tap area overlaps SIGN IN by 6px.
- D: **done**: Try-On · camera blocked (Try-On · photo key 1) and · photo access blocked (key 2); Try-On · camera 1734:18914 and · camera · countdown 1734:19021 (TAKE A PHOTO on Try-On · photo and on Photo not usable now open the camera; new parts: camera controls, camera countdown and 3 icons); Change room · many pieces with "3 of 7" / "2 of 5" (Change room key 1); Events · loading and Event · Casual · loading (key 1; a new skeleton · card). **Chrome:** the camera view and shutter work, but the timer toggle doesn’t fire (a nested press Change to swallows the tap); D is fixing it. D’s calls to confirm: OPEN SETTINGS acts as if access was turned on; ✕ on the camera goes back to Try-On · photo; "Use a model instead" stays on photo access blocked; typed sizes (shutter 72, countdown 96).
- **Saved:** "After answer builds (waves 1 and 2)". **Flow starts cleaned:** 4 duplicate "blend · main" starts (from copies of Events and a test frame) removed; only Events and Welcome start flows. House rule added.
- **Running:** design-reviewer on waves 1–2; case-study log of the dark fix and the answer builds; E on the user’s two explorations.
**The user’s new request (2 Nov, afternoon) — designer E exploring on the Explorations page:**
- "+ Add a top / bottom" in the change room should open Events with a search for tops/bottoms applied.
- 4 options for showing on the search button that a search/filter is applied.
- 4 options for an element showing how many tops and bottoms are added (like the count badge, but different), after some research.
- The flow change gets built after the user picks.
**Built with the writer’s picks (confirm at the end):**
1. B8 "Notify me" with a "Don’t notify me" toggle after the tap.
2. B12: the sold-out piece drops out of the total and Pay still works.
3. B7: Apple Pay still shows for a new account.
4. B19: new addresses take the street as their title (no name field).
5. B20: a 5-second camera timer.
6. B14: a "3 of 7" label by the dots.
7. B18: "Signing in…" (like "Paying…").
8. Prices over 1,000 read "1,204.00 EUR" (added to the voice guide).
9. A guest’s change room carries over when they sign in (as the approved copy promises).
**Reminder still open:** "remove the white from the female model" — the women-picked state now uses the cut-out; no white was visible at 4×; if the user still sees it, it’s theirs to remove by hand (Remove background needs them) or to point out.

### ▶ NOW (2 Nov, ~08:30): second parallel batch running
- L, Q and **M are done**. Saved and confirmed after them: **"Before forms, copy and motion follow-ups"** (the undo point for the batch below; "Before headers, motion and additions batch" is the one before L/Q/M).
- **M done (headers):**
  - header component 1596:6941 (back / close / none, subtitle on/off); back button 1596:6917 and close button 1596:6920 (fill-only arrow_back 1596:6906 and close 1596:6915, named "Back"/"Close").
  - On every screen with a title: title x 44 y 82, subtitle under it 8 below, content 24 below (y 165 / 183 / 139).
  - Product header shows the piece name (brand label and second name gone).
  - Try-On ✕ moved top-left (leading slot), menu hidden on all 7.
  - Options header inside the sticky header (padding 70/0, content 183).
  - Make it fit tightened (settings 12 apart, card → hint 4).
  - Size guide only got the close button.
  - All 84 back/✕ have one tap.
  - House rules updated (new "Headers" section).
  - Its undo list and play-test list are in this session's chat.
- **Done in this batch (2 Nov, morning):**
  - N (forms): 61 labels 8 above their fields on 20 form screens (placeholders moved into the labels; only "MM / YY" stays as a placeholder; "Expiry date" from the error copy), 12 between fields, pairs 197 + 197, hints and errors 8 under the field and lined up with the labels at x 12, one content column per form (x 12, 406, from y 165); A1 code boxes centred; A4 half-field errors full width on one line; A5 "sign in · tap" trimmed; A6 red outline fixed once in text-field 576:325; "continue" → "create account". Copy inventory updated.
  - Writer:
    - Search counts now say "4 / 3 / 2 / 0 pieces", on the result pages and in the recent searches.
    - Order page titles read "Order #BL-…".
    - All 84 headers were checked against the copy inventory.
    - It re-linked the Try-On generating title and the result subtitle to their wording variables; the header rebuild had cut those links, so the model route had lost its words.
    - The "Shop in" layer is renamed "Size system".
    - The copy inventory and the voice guide are updated.
  - T (Try-On · result):
    - The card starts 24 below the subtitle and is 16 shorter. The AI demo photo is cropped by a mask, not squashed.
    - The photo lines up with Dressing you…; the feet differ by about 2px, to check in Chrome.
    - "Try another outfit" slides down like the ✕.
  - R (list cards):
    - One look: 24 corners on radius/xl, card/padding 12, content at x 24, 8 between cards, 24 between groups, 8 from a label to its card.
    - On My orders, Notifications, the 3 order pages, Return an item and Checkout ×4.
    - The My orders card titles read "Order #BL-…".
    - Checkout's end of scroll is fixed: the last card ends 12 above the pay bar on all 4 screens.
    - Track order's timeline starts 24 below the map (was 28).
  - Motion: header layers are renamed per page ("header · <page>"), so on 34 links the header now slides in with its page. House rule updated.
- **Running:**
  - S (small fixes): Checkout pay bar 22 → 12 above PAY, Track order timeline gaps on the scale, Return started code box and returns-closed names on whole pixels.
  - case-study-writer: logging this batch (N, R, T, writer, motion, overlays).
  - Motion follow-ups:
    - Search results get their own header name.
    - Options' "content" layer is renamed.
    - Search · beach → Beach day slides as one page.
    - Match layers go on for Search → results, the bottom bar → Checkout, My orders → orders, Notifications → order, and orders → Return an item.
    - Now (N is done): Delivery address → New address and Payment method → New card.
  - design-reviewer: the M + L + Q batches.
- **Chrome play-test (2 Nov, ~09:15), saved before: "Before play-test and review fixes".**
  - Passed:
    - headers slide in with their page and the top bar stays still (Casual → Search, Search → tee, Search → Casual, Checkout → Delivery address → New address, Payment method → New card, Back mirrors);
    - Product header shows the piece name;
    - Size guide dims and closes;
    - Sign out? dims and closes on a tap outside;
    - toasts on Product (add / remove);
    - VIEW → change room (CHECKOUT 111.00 EUR);
    - Try-On rises with ✕ top-left and no menu;
    - Like this chips under the photos;
    - model route: "Dressing your model…", the bar fills (timeline motion plays), "An AI preview of a model like you in this outfit.";
    - result card lines up with Dressing you… (no visible jump);
    - Try another outfit slides down;
    - forms: labels, New address keys 1/2, New card key 2, no text shift on the red outline;
    - list cards;
    - Options sticky header;
    - dark mode (Options, New card).
  - Bugs found, being fixed:
    - the pop-ups block taps for ~3s (motion designer: make them in-screen toasts);
    - gender picker: clearing a selection (second tap) leaves the photo in colour, both after women → men → men (designer U);
    - "Wear it with" keeps the previous toast (motion designer).
  - From the design review (M + L + Q), being fixed by U:
    - Make it fit ← loops with Create account (now a real Back);
    - My orders ← after Return started DONE goes back to Return started (→ a fixed link to Options if that's the only way in);
    - Like this / Not like this chips 4 → 8 left padding;
    - Order #BL-19302 tiles on whole pixels.
  - Watch: the player is slow in a long session (slides take 1–2s, mid-slide frames look odd, e.g. My orders briefly drawn at Options' scroll position). Recheck in a fresh browser.
  - Toolbox: design-audit.js now treats a 1% fill as a fill (Figma stores it as 0.0099).
- **Fixes after the play-test (2 Nov, late morning), re-tested in Chrome and passed:**
  - Pop-ups are in-screen toasts (pop-up 1640:7114); TRY ANOTHER OUTFIT works while "Saved to your photos" shows. Old overlay frames on Archive.
  - "Wear it with" clears a showing toast (edge: a tap during the 250ms fade-in lets it finish).
  - Make it fit ← is a real Back (no loop).
  - Gender picker hint rebuilt on two prototype variables (logic/gender hint women / men): select, clear, women → men → men, hover/leave and a fast sweep all pass. The hint now appears instantly.
  - Like this / Not like this chips even (8 / 12); order-page tiles on whole pixels.
  - Women-picked state now uses the user’s cut-out (f8ac9d…) like every other state. No white was visible in either file at 4×, so the user’s "remove the white from the female model" may still be open: before/after frames on Explorations 1652:5159.
  - Still open (question): Return started’s DONE loops back through the return.
- **Final checks (2 Nov, midday):**
  - Final design review (all 72 frames): 0 must-fix. Today’s builds are consistent on every screen. Being fixed by U (last batch):
    - gender-picker grey layers get one name per side;
    - TAKE A PHOTO on Photo not usable → preview;
    - the #BL-20481 card opens Track order;
    - "Sign in" link size matches its sentence;
    - "mm / yy" layer renamed;
    - the header’s hidden template subtitle is emptied;
    - the shorts photo is re-cropped (Claude’s call: crop, not a new variant);
    - the Dressing you… pieces are centred (Claude’s call, house rule);
    - part-pixel garments in the tiles.
  - Picker knobs at 20 added to the typed exceptions.
  - ux-writer check of today’s text: fine, plus the copy bundle (question 12).
  - New missing frames from the review: B19 a saved address or card never appears (Save changes nothing; Checkout still shows Visa •••• 4242); B20 optional camera view for TAKE A PHOTO; B21 optional Resend code limit; B22 optional Search first visit with no recent searches; B23 optional order page for the on-its-way order #BL-20481.
  - Facts for the questions:
    - Brands still show inside piece names on event cards, Search results, Checkout rows, orders, Return an item and Notifications; not on Product or the small cards.
    - In every form error state the main button carries on as if fixed (wrong code → New password, wrong password → Events, card/address errors save).
- **Leftovers for a small follow-up designer (after the reviewer reports):**
  - Checkout's pay bar starts 22 above PAY (12 on its 3 states): make it 12.
  - Track order's timeline has inner gaps of 3 and 29: put them on the scale.
  - The Return started code box sits on half pixels.
  - The two-line names on Returns closed sit on half pixels.
  - Portfolio canvas states: the Change room frame shows the Events tab selected, and Checkout shows "Pay 0.00 EUR".
- **Declined, no question needed:** R suggested cutting the picker options' padding from 20 to 8 so picker text lines up with card text. The knobs are fully round, so text 8 from a round edge would sit in the curve.
- **Check in Chrome:** watch the feet in T's Dressing you… → result fade. If the 2px shows, make "figure (photo)" 1345:399 597 tall, like its outfit-fit layer.
- **Then:** Chrome round (M's list + L + Q + this batch) → design-reviewer full sweep of all frames → case-study log → ONE question list.
- **Chrome round checklist** (run when no builder is editing; fresh browser window, in front):
  - M: ← and just left of the title goes back (shop screens); Welcome → Sign in → ←; Forgot password / Enter code / New password / Make it fit / Create account ←; each Try-On ✕ (top-left) slides down to Change room, no old toast, no menu; Try it on again → missing-piece toast once; Product → "Wear it with" swap + Cropped Suede Trucker Jacket; Options scroll + Back; Size guide ✕; dark mode icons and subtitles.
  - Motion: event page → Search, Search → Casual, My orders → order, Checkout → paying, Options open/back (headers slide with their page); Product/Search slide; Try-On rises and ✕ slides down; "Try another outfit" slides down; Dressing you… bar fills and Paying… spinner turns (timeline motion plays?); badge pop; pop-ups at the bottom ~2.5s (do taps behind them still work?).
  - Q: Like this chips; Create account → Sign in link; Notifications · empty → GO TO EVENTS; keys 1–4 on Sign in / Create account / Forgot password / New password; Size guide tip + dim; Track order Back.
  - Overlays: Size guide and Sign out? dim; tap outside Sign out? closes it.
  - Forms/list cards/result: labels, field spacing, errors; list cards; Try-On result card lines up with generating (no jump in the reveal).
  - Older: gender taps (women → men → men → women; leave and return; Make it fit); VIEW/Add more; banners sticky; bold in dark mode; tap areas with no fill (card corners, beside a size number); "Change room emptied · Undo"; Turn around ×3 fast, Search, Back (bottom-bar 120ms press).

**QUESTIONS COLLECTED (bring at the end, don't ask before):**
1. The thumbnail photo plate on My orders: the mock-up is ready on Explorations, section "My orders thumbnails · photo plate · 2026-11-02" 1584:236 (Before/After, light and dark; screenshots in the designer's report in this session's tool-results). Building it needs ONE new theme colour (off-white #f4efee in light, today's light grey #cfc8c2 in dark), because color/photo plate is white in light mode. Keep (and OK the new colour) or leave as is.
2. Shorts on product cards are still ~3px off-centre (two shorts photos share one card variant): re-crop the g05 photo, or add a second shorts variant?
3. Dressing you… "outfit" pieces are left-aligned in their row (with only a top, it sits far left): centre them?
4. One shared small-card component for Search / Wear it with (needs rebuilding 69 cards' links): do it as its own step?
5. **New missing frames suggested by the sweep** (pick which to build), high first:
   - B6 Checkout · sign in first (a guest reaches a checkout with someone's saved address and card)
   - B7 Checkout · nothing saved yet (+ empty Delivery address / Payment method; Pay greyed until both are set)
   - B8 Product · size sold out + Notify me (Notifications promise "Back in your size", but nothing can be sold out)
   - B9 Try-On · camera blocked
   - B10 Return in progress on My orders / the order page
   - B11 Options · guest
   - B12 Piece sold out after adding it (chip + Checkout row)
   - B13 Offline / couldn't load (Events, event pages, Product, Pay)
   - B14 Change room · many pieces (the dots stop at 4)
   - B15 Long-name test frame
   - B16 Try-On · photo access blocked
   - B17 Delete account + confirm (app stores require it once there's sign-up)
   - B18 low: loading placeholders, "Signing you in…", more field errors, "Too many tries", "Running late"
6. The sweep's flow questions:
   - Should My orders open #BL-19302 as returns-closed by default (delivered 28 Sep) and demo returns on #BL-19877?
   - Drop Make it fit's back arrow (it returns to the Create account form after the account exists)?
   - Grey out Continue on Enter code · expired until a new code is sent?
   - Block leaving Checkout · paying (back/menu still work)?

7. (from designer M) **Brand label on Product:** the header now shows the piece name, and LOAM / VALE / SADDLE no longer shows anywhere on Product. Bring it back small (e.g. at the start of the details line)?
8. (M) **Try-On ✕ on the left:** it now sits top-left where back sits on every other screen (one place for "leave"). It's a slightly longer reach for the right thumb. Keep it there (recommended) or move it right?
9. (M) **Make it fit spacing:** to fit the header, settings went 16 → 12 apart and gender card → hint 8 → 4. Keep it, or let the settings scroll under a pinned button panel?
10. "If there’s an account for that email, we’ll send a code." as Enter code's default line for every email (see "Question to add" below).
12. (ux-writer check of today's text) **Copy fixes, approve as written?**
   - CVC error "Add the 3 digits on the back." → "Add the CVC, the 3 digits on the back." (it now runs full width under Expiry date; reverses a 1 Nov wording)
   - Notifications "#BL-20481 arrives Thursday." / "#BL-19877 was left at your door." → "Order #BL-…" (the last two order numbers without "Order")
   - New password's first label "New password" repeats the title → "Password" (or retitle the screen "Reset password")
   - My orders · empty line repeats its subtitle → "Your orders show up here once you **buy something**." (reverses a 1 Nov wording)
   - Recommended: yes to all, with "Password".
   - Not questions, for a last small fix: "Sign in" in "Already have an account? Sign in" is 15px next to a 13px sentence → match; the New card layer "mm / yy" → "expiry date"; the header component's hidden template subtitle → empty.
13. (designer U) **Return started's DONE loops** back through the return (DONE pushes My orders; its ← is a real Back). A: DONE does three Backs in one tap (needs a play-test; Figma may run only one). B: DONE fades to Events like the other ways back to the shop. Recommended: B.
11. (design review) **Event pages show the name twice:** "Casual" in the header and "CASUAL" in the banner right below it. Keep both (the header names the page for screen readers and matches every other page), or hide the header title on event pages and keep only ←?

**L done (motion):**
- Product (220 links) and Search slide like pages.
- Try-On is a sheet (8 open links rise; 7 ✕ slide down).
- The pop-ups are toast-style 406×48, 2.5s.
- The Dressing you… bar fills 10 → 95% and the Paying… spinner turns (timeline motion; check in Chrome that it plays).
- Badge +15%, no hold; "bump b" deleted.
- Flows are now "blend · main" + "blend · from sign in".

Follow-ups:
- "Try another outfit" on the result still fades. Make it slide down like the ✕ (it's part of "Try-On is a sheet"); do it in the motion follow-up after M.
- Reduced motion: for the coded app.

**Q done (additions):**
- Like this / Not like this chips under the photos.
- "Already have an account? Sign in" on Create account + 2 states.
- GO TO EVENTS on Notifications · empty; both empty states keep their subtitles.
- 7 new error frames in section 1598:24675, all on number keys:
  - Sign in · Google / Facebook failed (keys 2/3 on Sign in)
  - Create account · Google / Facebook failed (keys 3/4)
  - Enter code · unknown email (key 1 on Forgot password)
  - New password · don't match / too short (keys 1/2)
- Size guide: new tip, ends at 932, corners 32, handle removed (Figma can't drag-close an overlay).
- Track order DONE → Back; Create account back → a real Back.
- Photo not usable card 33 taller.
- build-tile photo corners 12 (concentric: 12 inside the 24 tile), whole pixels, renamed "figure (photo)".
- Resend code centred; g05 back view no longer overlaps the caption.

**Overlay dims: done 2 Nov ~08:45** in the Figma editor (these settings live on the overlay frame; the plugin API can only read them): Size guide 615:2240 and Sign out? 615:2410 dim black 40%; Sign out? closes on an outside tap. Rule added to the house rules.

**Question to add:** Enter code shows "If there’s an account for that email, we’ll send a code." only in the "unknown email" state. Best practice is to show it for every email, so the screen never reveals which emails have an account: make it the default line?

**Queued for the forms designer (N, after M)** from the sweep:
- A1: Enter code · wrong code / expired: the code boxes sit 9px off-centre (match Enter code: 292 wide at x 69).
- A3: put the account screens' content in a column on layout/margin.
- A4: errors under half-width fields run the full 406 width on one line.
- A6: the red error outline shouldn't shift the field text (in the field component).
- A5: trim "sign in · tap" 1285:10129 so it doesn't cover the Password field.
- For the writer: Search · wedding subtitle "No results" → "0 pieces" (with the approved "4 pieces" change).
- To verify in Chrome: B5 "Change room emptied · Undo" (built and tested on 1 Nov per the notes; the sweep found no toast on Options, so check it shows on the change room after emptying).

### ▶ APPROVED BUILD PLAN (user's answers, ~00:30)
- **Welcome:** keep the long copy (user: "Keep the long copy"), but body style 15px + "minimising" (writer W2, running). The promise line stays on the event pages / notification.
- **Open/close:** "Pages slide, Try-On is a sheet (Recommended)":
  - Product and Search slide in from the right 300ms ease-in-out with match layers, like event pages (~214 links into Product incl. inside the change-room components; Search's link is in bottom-bar)
  - Try-On rises from the bottom 300ms; its ✕ slides it down 250ms ease-in
  - the menu button is hidden on the 7 Try-On screens
- **Consistency (all four):**
  - one header layout + one shared header component (back / close / none): title → subtitle 8, subtitle → content 24, subtitle under the title
  - labels above form fields on the account and checkout forms; fields 12 apart; paired fields equal halves
  - one fill-only back and one close component with spoken names, replacing the 57 hand-made copies
  - Product header shows the piece name instead of "LOAM" 28px
- **Polish (all four):**
  - pop-ups (Saved / Code sent) at the bottom like toasts, ~2.5s
  - dim behind Sign out? and the Size guide + close on an outside tap + Size guide drag-to-close (or remove the handle)
  - waiting screens move: the Dressing you… bar fills over 2.5s, the Paying… spinner turns
  - calmer badge pop (+15% 100ms, settle 150–200ms, no hold; delete "bump b")
- **Card declined:** "this card" (W2). **Like this:** "Chip under the photo (Recommended)" (the photo ends 12 above the chip; Not like this matches).
- **Wording (all four):** Payment failed "nothing was charged" (W2); Make it fit "any time" (W2); Search "4 pieces"/"1 piece" and the order titles "Order #BL-…" (after K).
- **Additions (all four):**
  - Create account "Already have an account? Sign in"; Notifications · empty gets "Go to Events" + empty states keep their subtitles
  - missing error screens: New password ("Those passwords don’t match." / "Use at least **8 characters**."), Google/Facebook sign-in failed ("We couldn’t sign you in with Google. Try again, or use your email." + Facebook), Forgot password with an unknown email ("If there’s an account for that email, we’ll send a code.")
  - Photo not usable title "Not a full-body photo" (W2); a Size guide tip covering tops and bottoms (the sheet moves up ~36)
  - Track order's Done → Back; Create account's back → a real Back
- **Last answers (user):**
  - Sign out? keeps its side-by-side buttons (dialog exception, in the house rules).
  - Cards: 24 big / 16 small (rule in the house rules), so unify the mixed list cards (orders, notifications, return item) to 24 + card/padding.
  - Product-card tile gets 8 inner padding (given to K).
  - My orders thumbnails: "show me what the photoplate behind them looks like if i dont like it leave them as is". A mock-up is being made on Explorations; show it in the final question list.
- **For builder Q (layout follow-up from W2):** Try-On · photo not usable 1229:76: the new one-line title "Not a full-body photo" left the subtitle 37 below it (was 4). Move the subtitle up 33 and the photo card up (or let it grow 33), keeping the viewer gaps (12 to the privacy line, 8 to the button) and matching its siblings.
- W2 done: Welcome long copy in body 15px with "minimising"; card declined "this card"; payment failed "so **nothing was charged**" (hint styles, like card declined); Make it fit "**any time**"; "Not a full-body photo". Copy inventory and voice guide updated.
- **Status 2 Nov, night:**
  - J done (button clean-up).
  - P, W, V done.
  - K and W2 were cut off by a usage limit and have been resumed.
  - A full-frame sweep (inconsistencies on the 29 un-audited screens + missing frames) is running, read-only.
- **Order:** J + K finish → save a version → parallel builders: motion (L), headers/back/close/Product header/hide Try-On menu (M), additions + chip + Size guide + dims (Q) → then forms labels (N, after M) → Search counts + order titles (writer, after K) → Chrome round → design-reviewer → case-study log.

### ▶ WORK QUEUE (from the full review, being merged)
From the late-batch reviewer (items G already fixed are dropped):
- [fix] The Dressing you… progress track: with accent-strong on the muted track it's only 2.8:1. Track → color/placeholder (≈4.3:1).
- [check] Gender picker: the floor shadow is said to sit above the photo (would darken the shoes), so recheck the layer order after G's cut-out. The 4 "pressing" variants are unreachable: archive them. Optional: one photo component per gender so a future swap happens once.
- [fix] Try-On · photo: the "Like this" chip covers the example's shoes, which hides the "Head to toe" point. Move the crop up so the feet sit above the chip (or move the chips below).
- [fix] The "or" divider lines (1491:298 + 4) are the darkest hairline in the app (color/hint, a text colour). Make them softer: lower the line layer's opacity (not paint opacity), or a new color/divider (that needs the user's OK, since it's a new variable).
- [fix] social-button: Google/Facebook logos at different x (93 vs 84). Pin both logos at the same left inset; labels stay centred.
- [decide → recommend yes] Product card in dark mode: give "clothes-images" 8 padding so garments don't touch the light tile. This also centres the shorts (6px off now).
- [fix] Sign in: "Forgot password?" 14 below the field → 12 (and 16 after the error on wrong password: keep or make it 12).
- [nice] Build tiles are 95.5 wide (half pixels); the Even photo has corner 8 vs 16; the old name "figure (illustration)"; the product-card price row overflows its layout; Search tee/bomber/shorts cards are placed by hand, so reuse the grid.
- [nice] social-button is a copy of the cta secondary; rebuild it from the cta or give the cta an icon slot.
- [play-test] Gender taps (women → men → men again to clear → women; leave Options and come back; same on Make it fit), then remove the redundant 0.4s timers if it holds. Tap areas with no fill: card + corners, beside the selected gender photo, back arrows, close ✕.
- [older] Raw inner-light gradient stops on buttons and knobs; typed stops on the banner shades.
- Accepted: "Wider shoulders" wraps to 2 lines (agreed earlier); Photo not usable shows the zoomed "Like this" photo (the user chose to keep it).

From the ux-writer (writing / tone / bold):
- [ASK] The Welcome line 578:9428 is long marketing copy again ("Explore our carefully curated collection…", 16px with no style). It replaced the approved promise "Every top goes with every bottom." (15px body). The same copy appears in the user's old-design screenshot, so the user may have restored it on purpose. Ask before reverting.
- [bold] "At least **8 characters**" (Create account hint 1231:46 + email taken 1227:78); "We deliver anywhere in the **EU**." (New address 614:2147 + 2 states); "Your card details **stay encrypted**." (New card 614:2159 + 3 states).
- [fix] Card declined: "Your bank declined this card, so **nothing was charged**. Try another card." (it named Visa •••• 4242 whatever card was picked).
- [fix] Try-On result (model route) runtime text, set in the "Use this model" Set-variable action 1285:10217: "An AI preview of a model like you." (one line; the current text overflows into the card).
- [fix] Track order "Expected Thursday" → "Arrives Thursday".
- [fix] New password 578:9555: add the hint "At least **8 characters**".
- [decide] The same idea worded two ways: Make it fit "…**later** in Options" → "…**any time** in Options"; Payment failed "…you **haven’t been charged**…" → "Something went wrong, so **nothing was charged**. Try again in a moment."; Search "4 results" → "4 pieces"; order titles "#BL-…" → "Order #BL-…".
- [decide] Photo not usable title → "Not a full-body photo"; Size guide tip rewrite (grows to ~4 lines, the sheet moves up ~36).
- [decide] Next steps: Create account "Already have an account? Sign in"; Notifications empty gets a "Go to Events" button.
- [decide] Missing states: New password errors ("Those passwords don’t match." / "Use at least **8 characters**."); Google/Facebook sign-in failed ("We couldn’t sign you in with Google. Try again, or use your email."); Forgot password with an unknown email ("If there’s an account for that email, we’ll send a code.").
- [a11y] Spoken names for icon-only controls (back ×70, ✕, card + ×113, chip ✕, peeks, badge; "Close options" not "Menu"); "Change delivery address" / "Change payment method"; "Return <piece>"; a Size guide ✕ "Close size guide"; field labels above inputs (placeholder-only fields lose their name).
- [fix] Checkout · paying: the "Change" links look tappable but do nothing, so dim them while paying.
- [housekeeping] Layer names "Shop in" (Size guide) and "continue" (CREATE ACCOUNT button). The voice-and-words.md "Undecided" list was updated by the main chat (done).

From the screens reviewer (38 of 67 screens fully audited; the rest scanned):
- [must → fix] Search · beach: the "pieces" grid 611:2312 is pinned (fixed layer), so its third row can never be seen. Unpin it; only the top bar and toast stay fixed (like the event pages); bottom padding so the last row ends ≥12 above the screen bottom.
- [must → K] Order pages: the 4 "Return" links have 45×48 tap areas → hit areas ≥48 wide (sent to K).
- [should] List cards use two looks (24 vs 16 corners; padding 12 vs 20/16; order item content at x 24 vs "Delivered to" at 32; order cards use layout/margin as padding): one list-card look (24 on radius/xl + card/padding), ideally one shared card component. After K.
- [should → K] Small product cards on Search / Search · wedding / Product "Wear it with": one small card, photo corner 8, name + price everywhere (sent to K).
- [should → K] Picker knobs 16 inside a 24 picker with a 4 gap → concentric (sent to K).
- [should → Q] Size guide sheet: top corners 28 (typed) → 24/32 token; it ends at 934 → 932.
- [should → L] Pop-ups as toast states (406 wide, 48 tall, 12 above what's under them).
- [should → M] Titles 2px off (x 46 on Checkout screens + Track order; y 84 on the event pages) → x 44, y 82 (the header component will fix this).
- [should → Q] build-tile photos: corner 8 in the selected state vs 16 → 16 everywhere; inset 12.5 → whole pixels; names "figure (illustration)" → "figure (photo)". Keep the #020202 add fill (it's needed, see house rules).
- [play-test] The carousels' two "On drag" reactions are probably the left/right pair; swipe both ways to confirm.
- [nice → L] Prototype starting points: delete Flow 2 (Delivery address) and Flow 3 (Payment method) unless they're used for testing; name Flow 1.
- [done] The house rules' "Already known" list was trimmed (9 of 11 fixed); added the margin exception for the Search events row.
- [ASK] Sign out? is the only side-by-side pair, with 32 corners: keep it as the dialog exception or stack it? Small cards: keep 16 as a written "small card" rule? My orders thumbnails: white tiles blend into the white cards; how should they stand apart? The greyed "Change" links while paying are 2.2:1, which is fine for disabled.
- Not fully audited: Password changed, Payment method, New address, the pop-ups, Change room · portfolio, the empty states, the Sign in / Create account / Enter code error states, Checkout · payment failed, the New card / New address states, Search · bomber / shorts / wedding, the event pages Outdoors / Office hours / Day off / Maternity / Working out / Night out, Make it fit.

From the components reviewer:
- No cut-sided button is used on any live screen. The 14 cut variants (8 button-face 562:9348–9355 + 6 button) are used only by 6 archived Try-On buttons in change-room-stage2 641:21196. **Designer J is moving them to Archive › Old buttons** (as working sets), plus the unused round states, the currency prop rename, the section rename and the empty #020202 fill in try-on figure.
- The shared page-cleanup-scan.js line 36 was broken (a comment swallowed the code); fixed by the main chat, parses OK.
- "gender-button-for-mobile" is an old component from another library, used by 13 old gender buttons on Archive; it isn't on Components (the user saw it in the layer list at the top earlier, probably the Archive page). Keep it.
- [ASK, low] cta "secondary, disabled" is unused but was restyled by choice on 1 Nov; keep it. Later: merge cta and cart-label so the "Checkout + total" wording lives in one place.
- [play-test] 157 tap layers with no fill on Components (size pickers, try-on outfit fit, gender-button): add a 1% fill only where taps miss.

From the UX consistency critique:
- Being fixed by designer K: the Product garment off-centre (all 21 product-page variants), Search rows (Events row at 24 → 12, "Popular right now" short of the margin, small-card corners), order screens 24/20 → 24, Return an item spacing, pickers built at 382 and stretched to 406, half pixels.
- [after V] Headers built four ways: unify title → subtitle 8, subtitle → content 24, title at x 44. [DECIDE] Subtitle aligned under the title? One shared header component (back/close/none)?
- [after V/W] Forms: fields 10 apart on New password / New address / New card + states → 12; paired fields (City/Postcode, MM/YY/CVC) as equal 197 halves, 12 apart. [DECIDE] Labels above fields (like Options)?
- [DECIDE] Try-On: hide the menu button on Try-On so ✕ is the only exit (the motion fixes already fade the steps).
- [DECIDE] Overlays: the pop-ups (Saved / Code sent) at the bottom, 48 tall, like the toast; dim behind Sign out? and the Size guide, close on an outside tap; the Size guide drag handle needs drag-to-close or should go.
- [DECIDE] Empty states keep their subtitles; Notifications · empty gets "Go to Events" (fade).
- [fix, play-test] "Done" does three things: Track order's Done → Back. Create account's back is a fixed link to Welcome → Back.
- [DECIDE] Sign out? is the last side-by-side pair: stack it or keep it as the dialog exception. The Product header shows "LOAM" 28px above the 24px piece name. Options' four identical buttons: places as rows with an arrow? Back/close are 57 hand-made copies drawn as strokes → one back and one close component (fill-only icons). Small-card corner 16 as the rule?
- [after G] A model like you: the selected tile photo corner 8 vs 16, tiles 95.5 wide, photo 14.2 top vs 12.5 sides; Make it fit settings 16 apart vs 24 elsewhere; Make it fit Back returns to the Create account form; Try-On photo size jumps 382 → 286 between steps (the 60/60 was decided).
- [play-test] ~47 back/close tap areas with no fill (tap the far corner).
- [portfolio] Canvas states: Change room shows the Events tab selected; Checkout shows "Pay 0.00 EUR".
- Motion designer P **done**:
  - match layers on 14 links
  - "Go to events" fade
  - the 5 Try-On error links fade
  - keys on New card (1/2/3), New address (1/2) and Order #BL-19302 (1)
  - "Undone!" exit ease-in
  - the dead hidden Undo links removed
  - This reverses "New card, New address and Returns closed stay as reference frames, not wired" (a default, never confirmed).

From the figma-animator (motion):
- [fix] The top bar slides away and back on 28 links (decided 2026-10-31 that shared bars stay still). Turn on "match layers":
  - safe now: 14 links (Checkout ↔ Delivery address/Payment method, into Track order, Return an item → Return started → My orders, Paying… → Order placed)
  - needs a play-test: 14 links (Delivery address → New address, Payment method → New card, My orders/Notifications → orders → Return an item, Search → results); titles may morph, so rename them per screen if needed
  - the Checkout button's link lives in bottom-bar 494:242
  - "Go to events" on My orders · empty: fade 250ms like other returns to the shop
- [DECIDE → recommend a] Product and Search rise like sheets but show a ‹ back arrow (about 214 links into Product). Option a: slide in from the right 300ms ease-in-out with match layers, like event pages. Option b: keep them as sheets and swap ‹ for ✕/down arrow.
- [fix + DECIDE → recommend sheet] Try-On: the 5 error-screen links that slide should fade 250ms like the other steps. Open/close pair: Try-On rises from the bottom 300ms and ✕ slides it down 250ms (or keep the side entry and slide out right).
- [fix] 6 unreachable screens get keys (200ms fade): New card keys 1/2/3, New address keys 1/2, Order #BL-19302 key 1 (returns closed).
- [fix] "Undone!" exit curve: 200ms ease-in like the other toasts. Delete the hidden old Undo link inside "Undone!". Polish: Undo/View shrink as they fade when messages swap.
- [DECIDE → recommend yes] Count badge pop: +15% in 100ms then settle 150–200ms, no hold; delete "bump b".
- [DECIDE → recommend yes] The "Saved" / "Code sent" pop-ups hold about 2.5s (now 1.4s) and rise in like the toast.
- [DECIDE → recommend yes] Waiting screens move: the Dressing you… bar fills over the 2.5s; the Paying… spinner turns (~0.8s per turn). Build on Explorations first.
- [check after G] Gender picker: 383ms spring on hover/press feels laggy, so make the press hint ≤100ms and check nothing bounces; re-sync the build tiles. If "switch first, then save" holds, the size/size-system/currency/appearance pickers could slide 220ms instead of jumping.
- [play-test] Bottom-bar press uses a 120ms timed change back (house rules ban that), so tap Turn around ×3 fast, Search, Back. Undo after "Empty change room" may flash the big empty box (keep it near-zero size in 723:3346 / 723:3376).
- [rule] Write the photo-fade exception into house rules (Dressing you… → result fades one photo into another as the reveal).
- [app later] Reduced-motion fallbacks.

### ▶ ~23:50: designer G done, version saved
- Saved and confirmed: **"After gender picker, Make it fit, banners, sign-in, product cards"**. The earlier "Before gender picker resize and polish batch" never saved.
- Designer G:
  - the cut-out on all 14 gender photos; only the people turn grey
  - gender card 280 → 240
  - Make it fit buttons stacked (content ends 13 above START SHOPPING; every gap on the scale)
  - progress bar and Track order dot on accent-strong
  - the 2px Try-On gaps fixed
- Not logged yet: G, H (outlines, Search · beach), B (Add more), F (button pairs).

### ▶ ~23:30: full review in progress
- The user: "review all pages once more use all agents one should check the design file, one should check the writing/tone/ and bolding of the keywords. After that come up with a list with things that need to be done and start doing it". Also: clean up the cut-sided (edge-attached) button-face variants; the house rule says that style is retired.
- **Running (read-only):**
  - design-reviewer: Screens page
  - design-reviewer: Components, Archive and Explorations hygiene, plus the button-face retire/swap list
  - ux-writer: tone, terms, casing and bold across all screens
  - ux-ui-designer: UX consistency critique
  - figma-animator: motion/transition consistency critique
  - designer G is building (cut-out, shorter gender picker, Make it fit stacked, accent-strong fix, Try-On 2px gaps)
- **Then:**
  1. Claude saves a version itself (figma-save-version; the user: "you have a skill to save figma files why are you still asking me").
  2. Merge all findings into one work queue in this file.
  3. A designer does the button clean-up: swap instances to round variants, then archive the retired variants (move, never delete).
  4. Other fixes go to parallel designers with scope locks.
  5. A Chrome round.
- Feedback to remember: save versions yourself, don't ask the user; don't make extra work (the user: "just take cut-out needed · women’s and use that one … do i need to think on your behalf?").

### ▶ ~23:00: queue
- The user chose:
  - "Make it fit": **a shorter gender picker** (about 40px), so its buttons can stack like everywhere else.
  - **The darker brown (#7d5a4f, accent-strong)** for the Dressing you… progress bar 499:9382 and the Track order dot 579:10310.
  - **"Add more" gets the same fix as VIEW** (designer B, running).
  - **Remove the Night out / Beach day title outlines** and make **Search · beach full size** (designer H, running).
- **Waiting:** the user's Remove background on 588:136. Then one designer (G) does the cut-out copy to the 13 photos, the shorter gender picker, Make it fit stacked (START SHOPPING over SKIP FOR NOW, 12 gap), the accent-strong fix, and the 2px Try-On follow-ups from F (viewers 499:9416 and 1229:118 two shorter; the privacy lines 1233:63, 1233:87, 1229:103 back to 8/12).
- Done: button pairs at 12 on 12 screens (designer F); Create account subtitle "Your sizes and change room **stay saved**." and the CREATE ACCOUNT button.
- A version save at ~23:00 may not have gone through (the window resized and the tab was closed mid-save). Check that "Before gender picker resize and polish batch" is in the history; the last confirmed one is "Before button-pair sweep".

### ▶ ~22:30: waiting for the user's cut-out
- Designer A2 finished:
  - The brown rotating background is back (#cdb6af, ±91°, Gentle 0.383s) and no longer tints the people.
  - Accent is now color/accent #cdb6af in both modes, and accent-strong #7d5a4f light / #cdb6af dark. Old values: accent #ab8807 / #d9b23c, accent-strong #8a6e06 / #d9b23c.
  - Generation failed card ends 12 above Try again (photo cropped taller).
  - The natural "Like this" photos are swapped in.
  - Build tiles: gap 8, labels share a line, tiles 214 tall.
  - The half-grey-after-switch fix is in.
- **Blocked:** "Remove background" on the gender photo 588:136 ("cut-out needed · women's") triggered Figma's bot check in the automated browser, so Claude stopped. **The user does it by hand**, then designer A2 copies the cut-out to the other 13 photos (one shared image), limits the grey layer to the person, and renames the layers back to "Women's" / "Men's".
- To decide: the progress bar (Dressing you… 499:9382) and the Track order current-step dot 579:10310 fail contrast with the new light accent (1.7:1). Suggested fix: link them to color/accent-strong. The coded app's tokens.css line 14 still has #ab8807.
- House rule to update: the gender picker taps now switch the variant with Smart animate, then set the variable (it used to set the variable only). Needs a play-test; on 2026-10-31 a direct switch stopped responding.
- Designer D finished social sign-in. Designer E (product cards) is still running.

### ▶ ~21:40: VIEW fixed and Chrome-tested
- VIEW on the "Added" toast now opens the change room, which slides in already in its final layout: no fall-through, no jump. This closes the user's "weird jump when clicking VIEW". Designer B's fix: set the tab, then navigate, then clear the toast.
- Running: designer A2 (gender brown background, accent colour, Generation failed crop) and designer C (banner fixes), both started without a fresh save; they record undo values.

### ▶ Next builds, waiting for a saved version "After unified photo set" (Chrome closed ~21:10)
- **Designer A2 (photo / gender scope):**
  - Bring back the brown rotating background on the gender picker. The user: "you've removed the brown rotating background interaction and i really liked that". "Don't use the rotating animation" was meant for the build tiles only.
  - Generation failed: "crop the images so it fills the gap", i.e. a taller photo crop so the card reaches 12 above Try again, with even gaps.
  - **Accent colour:** "make the brown from the previous gender button be the accent color from now on". Find the brown in the old gender picker (Archive / version history); point color/accent (and accent-strong if text needs it, ≥4.5:1 / 3:1) at it. List every use first (success ring, gold captions, etc.) and check contrast in light and dark. A shared variable, so be careful.
- **Designer C (banners scope),** from the reviewer:
  - Re-link 17 scaled banner titles on the Search screens to the drop-shadow style (or accept the scaled shadow and add it to the rules).
  - Optically centre Working out (~3px left) and Day off (~2px left).
  - Reset the size/corner/clip overrides on the 8 Events banner copies.
  - Add an "Events after" copy to the strip 1411:6870.
  - Questions for the user: Search · beach banner is scaled to 89% (capitals 39, title 387 > 382); Night out and Beach day have thin white outlines that aren't in the rules (keep or remove?).
- **Designer B:** "Add more" on the single toasts has the same fall-through risk as VIEW; same fix? Ask the user.
- **Chrome round after that:** the VIEW retest (B's reordered steps), photos/gender/hover hints, banners scroll, bold in dark mode, tap areas with no fill (card + corners, back-arrow edges, the far edge of the nav switch).
- The user kept the "Like this" example as it blends into the white card, and the zoomed photo on Photo not usable.

### ▶ Chrome results (1 Nov, ~21:00)
- **VIEW: a new bug.** Tapping VIEW on the "Added" toast falls through and opens the product card under it (seen twice). UNDO on the same toast works. Designer B is fixing it (toast scope).
- **The tab doesn't jump:** opening the change room with the CHANGE ROOM tab while the toast is up lands in the final layout. So the old VIEW jump = make VIEW behave like the tab.
- **Second ✕: not reproduced.** With the second ✕ at about 3s and at 4.5s after the first, the room emptied correctly with the toast, both times. Likely fixed by today's toast changes. Status: watch, not confirmed fixed.
- **Events:** the intro line is gone, and Casual sits right under the top bar (seen).
- The window size changed mid-test (1427×840 → 1568×698); always re-screenshot before tapping.
- Not done yet: the banner scroll/sticky, bold in dark mode, photos (after designer A), and the 3-step ✕ diagnosis (moot unless it comes back).
- Copy inventory: the ux-writer audit found ~45 corrections; a helper is applying them to copy-inventory.md.

### ▶ Latest (1 Nov, ~20:30)
- **Done:**
  - All 13 bold fixes, applied and in copy-inventory and the house rule.
  - The case study is logged for the feedback batch. The bold fixes and Chrome results aren't logged yet.
- **Designer B changed nothing.** Chrome tests for the second ✕:
  1. 1 top + 1 bottom: ✕ the top, ✕ the bottom within 4s. Does the price become "EUR" and does the count drop?
  2. Same, but wait 7s before the second ✕ (the control).
  3. 1 top + 2 bottoms: ✕ the top, ✕ a bottom within 4s (no layout change). Does it slide?
  - Suspects: "Undo available" flipping off at step 0, or the visible toast changing at steps 38–42.
  - "Undone!" during the slide back: **the user chose (a), leave it** (a brief flash only within ~2s of Undo). Parked as accepted. Option (b), Back reopening the change room fresh, would break Back from Product.
  - Dark empty room passes (5.5:1). The carousel's own empty message on the garment backdrop is 3.56:1 in dark mode, but it only shows in the mixed-layout bug.
- **Still running:** designer A (unified photos, gender picker, archive, Generation failed gap) and the design-reviewer (banners, bold).

### ▶ Latest (1 Nov, ~19:40): unified photo set
- The user wants every photo in colour on one unified white background, matching soft shadows on every clickable photo, new gender-picker photos at the same size, unused images moved to the Archive page, a saved version first, and caution.
- The user's other photo notes:
  - Saturation on the build tiles: unselected at 0, a hint of colour on hover / tap-and-hold, full colour when selected. Copy the gender picker's interaction, without its rotating animation.
  - Watch the radius in the selected tile.
  - The edges must blend into the card white.
- **The final set is generated** (no baked shadow; the designer adds ONE shared soft shadow component, matched to the old B&W shadows, "not stronger but the same"):
  - gender pair 1447:73
  - women's lineup 1447:74
  - men's lineup 1447:75 (masculine Wider hips)
  - demos: women 1447:76, men 1447:77
  - like-this: women 1447:7039, men 1447:7040
  - not-like-this: women 1447:7041, men 1447:7042 (cluttered on purpose)
  - copies in `photo-drafts/final-set/`
- Everything older (1410:*, 1414:*, 1424:*, 1443:*) gets moved to the Archive page once the swap is done.
- A designer is building the saturation states, the radius/tick fix, the edge blending and the shared shadow, with the old crops as placeholders. Next: when it reports, save the version "Before unified photo set", then a designer swaps in the final set (incl. the gender picker on Options 498:9264) and moves the unused images to Archive. Then Chrome.
- **In the same swap batch:** remove the "Women's" / "Men's" labels from the gender picker (the user: "remove the text from here"). Then re-centre the photos in their halves with even margins, and keep a layer name / accessible label so the coded app can still name the buttons. Update copy-inventory.md afterwards.
- About 30 Figma AI images have been generated today in total.

### ▶ Resume here (1 Nov, ~18:45)
- **The photo-fix designer FINISHED before the restart** (no version was saved first; Chrome was down). **First thing after the restart: save a version "After photo fixes"** with figma-save-version, so there's a clean restore point.
- What it did:
  - The tiles and stand-ins use the base-layer lineups (women 1424:77, men 1424:74).
  - The demo photos are plain (1424:75 / 1424:76) and show on the model route only.
  - New component "try-on outfit fit" 1438:481 sizes the garments per build on the result.
  - Inner corners are card minus gap: 20 in Try-On cards (typed, no token), 8 in tiles.
  - The photos are centred: 60/60/12/12 on Dressing you…, the result and Generation failed (before: 50/73/4).
  - Fit check board: 1431:94. Undo values are in the designer's report (case-study log, once logged).
- Still open from it:
  - Trousers g01–g03 leave a grey strip at the hips on every build, clearly on Wider hips and Wider middle. Shorts show the leggings below, sleeveless g17 shows grey shoulders, and men's Wider middle shows a thin edge with g08 and g21.
  - Generation failed's card ends 26 above "Try again" (off the scale); the user's call.
  - The tap areas over the result garments are now see-through. Play-test that they still open Product.
- **Chrome:** the session lost its link to the extension (the extension itself was running). After the restart, check with tabs_context.
- **Then one Chrome round:**
  1. Banners: scroll Events, sticky/shrink, each event page, Search · beach, dark mode.
  2. Bold words in dark mode (change room empty states; Try it on "full-body").
  3. Photos: both genders, all 4 builds, photo vs model route, the demo outfit vs another outfit, corners and margins.
  4. VIEW tests:
     - add a tee, tap the tab while the toast is up
     - add a tee, wait until the toast is gone, then tap the tab
     - add a tee, tap VIEW
     - then decide the fix (if the tab jumps too, ask the user about turning off Match layers)
- **Waiting on the user:** where they saw "full sentences and buttons" in bold. The 10 bold-audit fixes are on hold until then.
- **Then:**
  - design-reviewer pass over the banners, the photos and the bold changes
  - case-study log of everything from the feedback batch (none of it is logged yet: banners, intro line, bold, photos, the VIEW finding, the new rules)

**Photo fixes (1 Nov, evening): images ready, build waiting for a saved version.** The user said "yes go ahead also check the radius and even up the margins" to:
1. new lineups in a light base layer, with the result garments scaled to each build
2. demo photos regenerated with a plain sleeve (no brand-like logo)
3. the demo photo on the model route only
4. dark-mode white backings left as they are
- New images:
  - women's lineup v3, 1424:77 (B&W, sneakers); use this one, not v2 (1424:73: colour, mixed footwear)
  - men's lineup v2, 1424:74
  - plain-sleeve demos: women 1424:75, men 1424:76
  - copies in photo-drafts/ (*-base-v2/v3, *-plain-v2)
- Plus: concentric radii in the Try-On cards, and even margins (the photos sat 37 from the left, 55 from the right and 2 from the top of their card).
- The radius and margins rules are added to the shared ux-ui-designer and design-reviewer playbooks and to house-rules.md.
- Chrome disconnected at about 18:20; no browser was connected after that.

**Banners and the intro line (1 Nov): built, not yet Chrome-tested.**
- The intro line is gone, and Casual now sits 12 under the top bar.
- All 8 banner titles share a capital height of 44, one baseline 32 from the bottom, and 24 side margins. Beach day went from 72 to 52.
- The rules are in house-rules.md under "Event banners". The before/after strip is on Explorations (1411:6870).
- Sticky/shrink couldn't be checked in Figma. Test it in Chrome.
- For the coded app later (on hold): OccasionSection.css, banner 150 → 160, shrunk 76 → 90, title baseline 32 from the bottom with 24 side padding, and the new per-font sizes.

**VIEW jump:** the designer found VIEW wired exactly like the tab; it changed nothing. Its theory: the room slides in with its old layout, then updates. Tests to run: tab right after adding (toast up), tab after the toast is gone, VIEW. If the tab jumps too, the fix is "Match layers" off on links into the change room, which is visible because the bars would slide; ask the user first. If only VIEW jumps, it's a small fix in the toast.

**VIEW jump, reproduced in Chrome:** VIEW slides the change room in, but it arrives in a different layout. The tee sits centred and full-width, the empty bottom box is narrower and Checkout has no price. About 0.3s later it all snaps into the normal layout. The Change room tab doesn't do this. Likely cause: VIEW opens the stage in another variant or state, and the open-time recalculation then snaps it into place.

**Earlier list (now handled, except where noted above):**
- Try-On ✕ tap areas run 5px past the screen edge, so only 43px is tappable, and they sit on half pixels (e.g. 499:9277).
- Photo route: generating and result show the last model build. Suggested fix: "use this photo" 545:9351 resets try-on/build to Even.
- Success ring: the dashes don't divide the circle evenly (gap 5.87 would fix it).
- One hand-drawn figure is left on Try-On · photo ("not like this", 1285:10261).
- Play-tests still to run: a double "On drag" on carousel garments, and taps on garment corners and the chip ✕ edge.
- Questions for the user: keep the build-tile style (16 corners, outline + tick)? Accept "Wider shoulders" wrapping to two lines?
- Open bug: a second ✕ within about 6s of a removal is ignored.
- Open bug: "Undone!" replays after Options. I tapped Undo, opened the menu about 2s later and tapped Back, and "Undone!" showed again. The P8 fix (the menu button clears the toast) doesn't cover this toast. (node list is in both designers' reports: change-room-stage 495:276, 516:9629, 1280:1787, 1352:2798 + 1352:2826/2850/2856, VariableID:1352:2797, 615:2241, 576:192, 576:273, 1345:30/59/81/330/331, 1229:80, 1229:116, toast 1280:8341).

**Optional, not asked for:** if Checkout content ever scrolls, bottom padding 130 on Card declined / Payment failed and 111 on Paying (today none of them scrolls).
