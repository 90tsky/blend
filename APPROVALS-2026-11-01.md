# blend · design pass: what needs your OK (1 Nov 2026)

> Note (main chat, 1 Nov): section 1 is out of date. After this list was written, the user saved the version "Before helpers 2026-11-01" by hand, and the 9 vetted fixes (T1–T4, C1–C5) are being applied separately.


Reply with the IDs you approve, for example "D2 A, D3 A, F1–F12". Nothing on this list has been changed yet, in Figma or in the app.

## 1. Done in this pass
**Nothing was changed in Figma.** The ux-ui-designer stopped before the first edit. The Figma connection can't save a named version, and the rule is no edits without one. All 9 vetted fixes are still ready to run, and every target was checked again in the live file and is unchanged. There's nothing to undo.
**To run them:** in Figma, go to File → Save to version history and save "Before ux-ui-designer: typography mixes (part 1/1)". Before the colour fixes, save "Before ux-ui-designer: colour mixes (part 1/1)". Then ask the main chat to run the pass again. To undo it later, use File → Show version history.
Approved but not built yet:
- **Type T1:** 8 labels on the Controls on and Appearance switches on [Options](https://www.figma.com/design/bYTCLufBocYOUavvlHgAdy/Blend-remake?node-id=498-9264) go from Medium 16 to 15, to match the picker labels (visible).
- **T2:** 2 pop-ups ('Saved to your photos', 'New code sent') go from 16 to 15, the toast size (visible).
- **T3:** 180 product-name and price layers are unlinked from the outside 'Product name' size variable (no visible change).
- **T4:** the 'casual' banner's line height is unlinked from the outside 'Large-2' variable (no visible change).
- **Colour C1:** 20 faded rows in three pickers (for example [Payment method](https://www.figma.com/design/bYTCLufBocYOUavvlHgAdy/Blend-remake?node-id=614-2148)) move off 55% layer opacity onto a theme colour.
- **C2–C5:** 8 secondary lines at 55% and 'Delivered' on [Track order](https://www.figma.com/design/bYTCLufBocYOUavvlHgAdy/Blend-remake?node-id=579-10280) at 50% move onto theme colours. The raw grey 'added' circle in add-toggle (769:105), which vanishes in dark mode, gets a theme colour. 7 thumbnails on [My orders](https://www.figma.com/design/bYTCLufBocYOUavvlHgAdy/Blend-remake?node-id=605-1638) move onto color/photo plate.
- **Held back:** C6, the logo colours. It would be a visible brand change on 35 screens, so it's now decision D21.
**Re-checks:** the ux-writer looked at the live file again: nothing changed, and nothing new is cut off or wraps. The design-reviewer's re-checks didn't run because there was nothing new to check. Nothing was broken by the pass, so the "Broken by the pass" section is left out. Once T1–T4 and C1–C5 run, the writer and the reviewer need one more look at the Options switch rows, the two pop-ups, the product names, the casual banner and every row marked type or colour.
**Merged and dropped:**
- 1 finding was dropped because it's already fixed: the top-bar menu button's double On click, on Events and Change room (both reviewers). It is still open on Options (F28).
- EV7 is the same as T4. OP4 went into D19. EV5 and EP3 went into D14.
- The writer merged 79 first-round tasks into 32. One of them, 'Place order' → 'Pay', was dropped because the app takes no payment.

## 3. Your decisions
**Terms**
- **D1 Settings vs Options.** The app says Settings; Figma and the glossary say Options. A · Options: app only (sheet title, menu name, 'Dominant hand' → 'Controls on', Left/Right). B · Settings: the Figma Options screen, the menu and the glossary. **Rec A**: Figma already says Options everywhere.
- **D2 Bag vs cart (buy button).** The change room is already the bag, but the button says ADD TO CART and the app opens 'Your cart'. A · CHECKOUT + total: 9 Figma label copies and the app button. B · BUY ALL: the same edits, but it reads like paying straight away. C · BUY THIS OUTFIT: buys only the pieces on show, which changes the prototype total, Checkout's 21 rows and the app's total and list, and it's tight with three-figure totals. **Rec A**: it names the screen it opens and keeps one container. (writer, design-reviewer)
- **D3 Two sets of event names.** Figma has 8 (Casual, Outdoors, Office hours, Day off, Maternity, Working out, Night out, Beach day). The app has 7 (Casual, Outdoors, Work, Beach, Evening, Maternity, Business casual). A · The app takes Figma's 8: rename 3, drop Business casual, add Day off (needs a banner image) and Working out. B · Figma takes the app's 7: 8 banners, the event pages, 21 product tags, Search and a notification change. C · A new set on both sides. **Rec A**: Figma is newer, and the app has two near-duplicates.
- **D4 Event vs occasion.** A · event: 1 app line. B · occasion: the Figma tab, about 165–245 empty-state copies, Search, Notifications and 4 app places. **Rec A**: it's the tab name in both.
- **D5 Name for the Rotate button.** A · Turn around: 2 app labels plus the button's spoken name in Figma (check that it fits the round button). B · Rotate: the 21 Figma hints become 'Tap to rotate'. C · Flip: both sides change. **Rec A**: it's already on the product page, and 'Rotate' can mean sideways.
- **D6 Try-On name.** A · 'Try it on': 2 app places plus the camera button's spoken name. B · 'Try-On': 1 Figma title. **Rec A**: it ends three different spellings.
- **D7 One promise line** (5 wordings today). A · 'Every top goes with every bottom.': Welcome, 1 notification, the app intro. B · 'Every piece goes with every other piece.': the 8 event pages, the notification and the app. C · 'Mix any top with any bottom.': all 5 places. **Rec A**: it's literally true and already used 8 times.
- **D8 Delivery vs shipping.** A · delivery: 2 app lines. B · shipping: 5 Figma layers. **Rec A**: British usage, and already on 13 Figma layers.
- **D9 Try-On wait line.** A · 'This can take up to a minute.': 1 Figma layer plus the app. B · 'This takes a few seconds.': app only. C · No time promise: both. **Rec A**: a real AI call can take tens of seconds.
- **D10 'Make it fit' title.** A · Keep it. B · 'Your sizes'. C · 'About you'. B and C change 1 layer each. **Rec A**: it's still true now that Fit is gone.
- **D11 Captions for the gender photos** (today there are no words). A · 'Women's' / 'Men's'. B · 'Women' / 'Men'. C · 'Female' / 'Male'. All three add 'Optional.' to the helper on both screens; no app change. **Rec A**: it says which cut you'll see, not who you are.

**Capitals**
- **D12 Capitals on buttons.** Capitals are made three ways today, and Options mixes capitalised buttons with sentence case. A · Keep typing capitals (no work). B · Keep the capital look, but type the labels in sentence case and let the Upper setting in the 'button' text style add the capitals: no visible change, about 9 main labels plus about 65 retyped, and it matches how the app does it. C · Drop capitals on buttons and toast chips (visible on every screen, and in the app). **Rec B**: one method, and Dev Mode hands over the same words the app uses.
- **D13 Banner title case.** A · Sentence case on all 8: 6 banners set to 'As typed', 3 retyped, and the app stops forcing capitals. B · Title Case on all 8: then the headings and tags disagree. C · All capitals: no app change. **Rec A**: it matches the headings, the tags and the notes. (writer, design-reviewer)

**Type** (held back by the type pass)
- **D14 Card price font.** 222 card prices use the 'price' style in Inter Bold 14, the only Inter in blend. A · Keep Inter. B · Change the 'price' style to Roboto Flex Bold 14: one edit that covers [Events](https://www.figma.com/design/bYTCLufBocYOUavvlHgAdy/Blend-remake?node-id=320-7350), the 8 event pages and 4 Search screens. C · Detach the 222 layers to the component's own look (222 edits). **Rec B**: one edit removes the only stray font. The small-card prices stay Bold 12 unless you say otherwise.
- **D15 Product-page price**, the only Medium price and the only 18. A · Keep it. B · Bold 16, like the totals on the buttons. C · Bold 18. **Rec B**: it joins the scale and matches the other prices.
- **D16 Checkout piece names** at 14, while every other list uses 16 ([Checkout](https://www.figma.com/design/bYTCLufBocYOUavvlHgAdy/Blend-remake?node-id=579-10097)). A · 16 on 21 layers: long names wrap to 2 lines and the rows still fit. B · Keep 14. **Rec A**: a piece then reads the same as on its order page.
- **D17 Welcome line** at 17, a size used nowhere else ([Welcome](https://www.figma.com/design/bYTCLufBocYOUavvlHgAdy/Blend-remake?node-id=578-9421)). A · 15, like the other 63 subtitles. B · Keep 17. **Rec A**: it's 2 px smaller and nothing else moves.
- **D18 Code sizes.** The digits on Enter the code are Bold 24 and the return code is Bold 28. A · Both 28. B · Both 24. C · Keep both. **Rec C**: the return code is the headline you show at the locker.
- **D19 Body and option-label sizes.** The reviewers would set the toast to 14, its chips to 12 and every option label to 16. The type plan keeps body text at 15, and T1 brings the switches down to 15. A · Follow the plan. B · The reviewers' sizes (17 picker labels to 16, which reverses T1). **Rec A**: 15 is already the body size and needs fewer edits.

**Colour** (held back by the colour pass)
- **D20 Contrast of the hint colour.** color/hint is about 4.3:1 on the page background, under the 4.5:1 that small text needs, on about 150–245 lines on every screen. It has the same value as color/outline. A · Make the color/hint variable darker (every screen; then check 'Tap to turn around' in dark mode). B · Keep it. **Rec A**: C2, C3, D26 and D27 all put more text on it.
- **D21 Logo colours** (C6: library 'black' and a raw white outline). A · color/primary fill with a color/on-primary outline: the logo flips in dark mode on 35 screens. B · color/scrim: no visible change, but the outline stays typed. C · Leave it. **Rec A**, after P12: the dark-mode logo is probably hard to see today.
- **D22 Night out and Beach day outline**, still on the old 'white' variable. A · Plain white, not linked (no visible change). B · Remove the outline (slightly thinner letters). C · Leave it. **Rec A**: it clears the last old colour without a visible change.
- **D23 Title and logo shadows**, set up two ways. A · Link the 2 top-bar logo shadows to 'drop-shadow' (no visible change). B · A, plus link Maternity, Working out and Night out (Night out's shadow gets shorter). C · Make every shadow typed. D · Leave them. **Rec A now, B after a side-by-side look.**
- **D24 Banner shade** (a library brown at the bottom). A · Bottom stop to color/scrim (barely visible). B · Leave it. C · All 3 stops on scrim, after a test. **Rec A**: the library colour goes with an almost invisible change.
- **D25 Inner sheen** on 51 buttons, knobs and chips, plus the newer slot chip. A · Keep them typed and note them as an exception. B · Link them to the nearest effect colours (a heavier sheen on every button). C · A new 'sheen' variable. **Rec A**: they're near-invisible, and B or C changes every button.
- **D26 Link colour** (two styles today). A · color/hint at full strength on all links. B · on-surface at 60%. C · on-surface, underlined. **Rec A**: one colour, and it improves along with D20.
- **D27 Placeholder colour.** Empty fields look filled in. A · Link the text-field value (576:326) to color/hint: one main-component change, 13+ fields follow. B · Leave it. **Rec A**: placeholders are hints. Please also confirm whether the Options name box is a text-field copy; the helpers disagree.
- **D28 Disabled ADD TO CART contrast**, about 3.3:1 in light and about 2:1 in dark. A · A new color/on-disabled variable for the label and price. B · Change the color/disabled value. C · Leave it (disabled buttons are exempt). **Rec A**: in dark mode the label nearly disappears on the most-seen button.
- **D29 Gender card background** (a library gradient, not visible). A · One new theme colour that's white in both modes. B · color/photo plate, which darkens in dark mode. C · Leave it. **Rec A**: it removes library colours with no visible change.

**Questions from the design critique**
- **D30 Banner fonts.** Night out (Monoton) runs almost edge to edge and reads 'NIGHTOUT'. Day off and Maternity look thin on busy photos. A · Keep them. B · Make Night out smaller and check the other two in dark mode. C · Swap the fonts. **Rec B**: it fixes the merged words.
- **D31 Getting around Events.** A · The 8 banners open their event pages. B · A, plus a row of event chips to jump between sections. C · Neither. **Rec A**: Search already opens these pages.
- **D32 One product-card component** (111 cards are separate frames today). A · Build it before F7 and F8. B · Keep the frames. **Rec A**: every card fix becomes one edit.
- **D33 'Casual' shown twice on event pages** (the small title and the hero). A · Keep both. B · Drop the small title. C · Drop the hero text. **Rec A**: the small title sits next to the back arrow and names the page for screen readers.
- **D34 Bottom bar on event pages.** A · Add it. B · Keep the pages without it (the change room is three taps away). **Rec A**: the change room is then one tap away.
- **D35 Match layers on the 18 links into event pages.** A · Yes, and check that the back arrow doesn't morph. B · No. **Rec A**: the bars stay still, as they do on Options.
- **D36 Event-page hero height.** A · 160, as on Events. B · 142, built as a proper variant. **Rec A**: the same banner everywhere.
- **D37 Change-room one-offs:** dashed boxes with 32 corners (cards use 24), light-grey + circles, and the chip price stacked above EUR. A · Keep all three and note them. B · Make them match the rest. **Rec A**: each has a reason.
- **D38 'Empty change room' on Options** has no confirm and no Undo. A · An Undo toast ('Change room emptied · Undo'). B · Ask first, like Sign out?. C · Also grey it out when the change room is empty. **Rec A**: quick, and it can be undone.
- **D39 Text styles for every text look** (none of the text on Options uses a style). A · Yes. B · No. **Rec A**: it stops mixes from coming back.
- **D40 Portfolio frame.** A · Add a Change room frame with CHANGE ROOM selected. B · No. **Rec A**: for the case study.

## 4. Fixes ready on your OK
**ux-ui-designer (Figma visual)**
- **F1** Must · 'pieces' grid on [Event · Casual](https://www.figma.com/design/bYTCLufBocYOUavvlHgAdy/Blend-remake?node-id=611-1660) and the other 7 event pages · it's pinned, so the third row (the only bottoms) can't be reached → set it to scroll with the page (confirm with P2).
- **F2** Must · Events, categories 378:9599 · it's fixed at 756 tall, so the last card row ends under the bottom bar (20 px clear where about 140 are needed) → let it hug its content and clear the bar.
- **F3** Must · [Change room](https://www.figma.com/design/bYTCLufBocYOUavvlHgAdy/Blend-remake?node-id=479-9125), carousel · bottom 516:9629 · it has two On clicks, and the first one opens Events on every tap → delete that one and reset the screen overrides (confirm with P1).
- **F4** Must · Currency picker on Options and [Make it fit](https://www.figma.com/design/bYTCLufBocYOUavvlHgAdy/Blend-remake?node-id=578-9471) · it isn't linked to its variable, and a 0.4 s timer resets it to EUR → link it, set the variable on tap, then delete the timers (P3).
- **F5** Must · Size pickers, size system, hand-switch and appearance-switch · a tap only does Change to, so a choice may not stick → add Set variable to the same tap. This also fixes Make it fit, Size guide and the product page (P4).
- **F6** Should · ADD TO CART when the change room is empty · a tap does nothing → add an else that shows a toast with the next step; the writer words it (P5).
- **F7** Should · Card price rows (48 on Events, 6 per event page) · the price sits 16 px left of the name → set left padding to space/32 (after D32).
- **F8** Should · Product names on every card · fixed at 23 tall, so about 20 names wrap into the price; no text style → after T3, add a 'product name' style (Bold 12, spacing 0) and a two-line box.
- **F9** Should · 8 event-page heroes · scaled to 88.8%, so the title shows at 56.86 → use fresh instances at 100%, 430 × 160 (after D36).
- **F10** Should · event-banner · Beach day · the tail of the 'y' is cut off at the bottom edge → bottom padding space/40 (say if you'd rather have a smaller size).
- **F11** Should · Icons in the bars, the chip and the add cards · the menu icon is stretched 137%, the others are 28 or 16 with different line weights → link them to size/icon (24); visibly 4 px smaller.
- **F12** Should · [toast](https://www.figma.com/design/bYTCLufBocYOUavvlHgAdy/Blend-remake?node-id=745-3668) · its top padding is typed in all 18 states, and it ends 10 px above the bar → link space/12 and space/32, and move the Events toast to y 732.
- **F13** Should · Toast 'Removed <piece>' beside the camera · 5 long names get cut off → let it wrap to 2 lines inside the pill (writer and reviewer; P11).
- **F14** Should · [slot chip](https://www.figma.com/design/bYTCLufBocYOUavvlHgAdy/Blend-remake?node-id=963-5087) · radius, height and padding are typed → radius/full, control/height, space/8.
- **F15** Should · cr-garment 'none' look · a dashed box shows inside the margin and over 'Add a bottom' → hide it (check that Try-On and Checkout don't use it).
- **F16** Should · 6 px gaps that aren't on the scale (empty-state title and hint, event-page headers) → auto layout with gap space/8 and space/4.
- **F17** Should · [gender-button](https://www.figma.com/design/bYTCLufBocYOUavvlHgAdy/Blend-remake?node-id=576-127) · built 382 wide and stretched to 406: the figures sit 12 px off centre and the right edge doesn't respond to taps → rebuild the 7 variants at 406 × 280.
- **F18** Should · 7 Options controls are built 382 wide but used at 406 → resize them to 406.
- **F19** Should · About 96 button and tab labels ([cta](https://www.figma.com/design/bYTCLufBocYOUavvlHgAdy/Blend-remake?node-id=494-162), [cart-label](https://www.figma.com/design/bYTCLufBocYOUavvlHgAdy/Blend-remake?node-id=810-124), nav-switch) · not linked to the 'button' style → link them (after D12).
- **F20** Should · [8 event banners](https://www.figma.com/design/bYTCLufBocYOUavvlHgAdy/Blend-remake?node-id=468-11155) · 6 use the Title Case setting → set them to 'As typed' (after D13; writer and reviewer).
- **F21** Should · 'EUR' in the chip, cta and cart-label · typed, so it stays EUR after you pick USD → link it to properties/currency.
- **F22** Should · Icon-only buttons · they have no spoken names, and 76 carry a hidden 'EVENTS' label → name them; the Rotate and camera names come after D5 and D6.
- **F23** Should · 'That's your only top' (the variable, about 8 reactions, 4 layers) · straight apostrophe → curly ’; then update the quote in the design-reviewer's rules.
- **F24** Should · [change-room-stage](https://www.figma.com/design/bYTCLufBocYOUavvlHgAdy/Blend-remake?node-id=495-276) · the empty-state lines are typed separately in 16 variants → make them one component, if the grow animation survives.
- **F25** Should · Gender photos on Options and Make it fit → add captions and the helper (after D11).
- **F26** Should · Missing states: no orders, no notifications, paying, payment failed, form errors, returns closed, sign-in and code errors, Try-On failed and a privacy line → new frames with the writer's draft copy.
- **F27** Should · Small cards on [Search](https://www.figma.com/design/bYTCLufBocYOUavvlHgAdy/Blend-remake?node-id=604-1667) and [Product](https://www.figma.com/design/bYTCLufBocYOUavvlHgAdy/Blend-remake?node-id=600-1436) show only a price, and Events has no intro → add piece names and an intro line (intro after D7).
- **F28** Should · Options top-bar menu button · it has two On clicks (Navigate and Back) → keep one.
- **F29** Nice · The 2 pop-ups lack the toast's inner light → reuse the toast component (after T2).
- **F30** Nice · The unused cta variant 'secondary, disabled' fades to 50% → match the primary disabled variant, or delete it.
- **F31** Nice · 5 older token leftovers → link them to tokens: top-bar nav paddings 11/11, typed grid gaps of 20, 4.08 photo corners, + circles sized from the 'all' collection, and a 22 px gap on Options.
- **F32** Nice · Tidy-ups: 48 inherited keyboard-flip shortcuts on garment pictures, 2 overrides on Events that match the component, 8 grids named 'Frame…' → remove, reset and rename.
- **F33** Nice · About 66 invisible tap areas use raw white at 1% → color/surface at 1%. The colour helper says leaving them is fine.

**ux-writer (Figma words)**
- **F34** Should · ADD TO CART in cart-label and the cta default → the D2 wording (after D2).
- **F35** Should · Change-room empty states (about 244–284 copies) → 'No tops yet' / 'Tap + to add tops from an event.' (the same for bottoms and the whole room). Easier after F24.
- **F36** Should · About 30 button labels → retype in sentence case, with no visible change (after F19 and D12).
- **F37** Should · [Return started](https://www.figma.com/design/bYTCLufBocYOUavvlHgAdy/Blend-remake?node-id=618-2383) and [Return an item](https://www.figma.com/design/bYTCLufBocYOUavvlHgAdy/Blend-remake?node-id=618-2342) · an unclear 30 days, two names for the drop-off place, and 'card' when Apple Pay was used → 4 rewrites.
- **F38** Nice · 'arriving' → 'arrives' (Track order, My orders); '2 h ago' → '2 hours ago' on [Notifications](https://www.figma.com/design/bYTCLufBocYOUavvlHgAdy/Blend-remake?node-id=624-2368); ADD AN ADDRESS; a My orders subtitle.
- **F39** Should · [Try-On · photo](https://www.figma.com/design/bYTCLufBocYOUavvlHgAdy/Blend-remake?node-id=499-9246), preview and result → TAKE A PHOTO, UPLOAD A PHOTO, CHOOSE ANOTHER PHOTO, 'Here's your outfit', plus a missing full stop.
- **F40** Should · Welcome line, notification 624:2407, Try-On wait line, Make it fit title (after D7, D9 and D10).

**Main chat (app code)**
- **F41** Buy button 'Add to cart' → the D2 wording (after D2). **F42** Should · Checkout sheet 'Your cart' → 'Checkout' / 'Your change room is empty'.
- **F43** 'Settings', 'Dominant hand', 'Left-handed' → Options, Controls on, Left/Right (after D1).
- **F44** The event list → Figma's 8 (after D3). **F45** Remove the forced capitals on banner titles (after D13).
- **F46** Events intro and page description (after D4 and D7). **F47** 'Try-On', 'Rotate' and the wait line (after D5, D6 and D9); 'Generate try-on' → 'Use this photo' can be done now.
- **F48** 'Shipping' → 'Delivery' (after D8). **F49** Should · Try-On errors show system text → one friendly error line.
- **F50** Should · Toasts don't follow the 31 Oct rules (no name on Removed, no Undo on Added, no 'Undone!', no 'only top' toast) → apply them.
- **F51** Should · Screen-reader problems ('1 pieces', a shared sheet title, disabled buttons with no reason) → fix the labels and add hints.

## 5. Needs a play-test (Chrome, in a window in front: background windows run at 1 frame per second)
- **P1** Change room with a bottom → tap the trousers without swiping. You should stay in the change room (F3).
- **P2** Search → Casual → scroll down. The Joggers and Cargo row should show and its + should work (F1).
- **P3** Make it fit → GBP → Events → menu → Options → back: still GBP? Then repeat with USD (F4).
- **P4** Options → Top size 44 → 52 → 44, Size system US → Asia, Left → Right, Dark → Light → leave and come back: did every choice stick (F5)?
- **P5** Empty change room → tap ADD TO CART: does anything respond (F6)?
- **P6** Tap just outside the drawn part of a card's +, the right end of CHANGE ROOM, the chip ✕, the space beside 52, a corner of the gender card and next to the back arrow.
- **P7** Change room with 2+ tops → tap just above and below the next-piece preview. It mustn't open Events.
- **P8** + on a card → leave Events before the toast ends → come back: no replay. Then check that Undo and View work, and repeat on an event page.
- **P9** ✕ a piece → Undo (the badge grows back, 'Undone!' stays about 3.4 s) → add another piece (the badge pops to 2).
- **P10** Swipe the top, the bottom and both previews both ways → Options → Controls on: Left → repeat.
- **P11** Add 3–4 pieces, including the Cropped Suede Trucker Jacket → read the buy button and the 'Removed…' toast; swipe a lone top; set the currency to USD and check the chips.
- **P12** Appearance: Dark → check the logo, the banners, the + circles, the disabled ADD TO CART, the gender card, black clothes in the change room, the placeholders and 'Tap to turn around'.