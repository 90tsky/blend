<!-- Snapshot of every string in Blend-remake, the coded app and the notes, collected 2026-10-31 and re-checked on the Screens page on 2026-11-01 (except the Try-On screens and the gender picker). It goes stale as the design changes: re-check the live file before relying on any line. -->

# blend · copy inventory (evidence for a "ux-writer" helper)

Collected 2026-10-31; Screens page re-checked 2026-11-01; all 84 header titles and subtitles re-checked 2026-11-02. Read-only while collecting: nothing in Figma or the project was changed.
Sources: Figma "Blend-remake" (bYTCLufBocYOUavvlHgAdy), pages Components 0:1 (202 text layers, 47 distinct strings) and Screens 257:2472 (2,291 text layers, 362 distinct strings), all hidden layers and variants included; Archive ignored. Coded app in src (+ index.html). Notes: CASE-STUDY-NOTES.md, NEXT-SESSION.md, .claude/agents/design-reviewer.md.

Legend for Figma "source":
- **layer** = plain text layer typed on a screen (edit it there, affects only that layer)
- **main** = text typed inside a main component/variant (edit once, every instance follows unless overridden)
- **inst** = text inside an instance (an override; editing it on a screen changes only that copy)
- **prop:label / prop:value** = text driven by a TEXT component property (edit per instance in the right panel)
- **var:NAME** = text bound to a STRING variable (the variable's value, often set by prototype reactions, is what shows)
- **UPPER / TITLE** = Figma text-case transform: what you type is not what renders
- **hidden** = at least one copy is hidden (state that appears at runtime)

---

## 1. Figma: STRING variables (collection "all" unless noted; modes light-mode / dark-mode identical unless noted)

| Variable | Value | Shows on screen as | Set by |
|---|---|---|---|
| properties/currency | EUR | the code after every price on Events cards (253 text layers), slot chip, cart label | currency-picker variants set "EUR" / "USD" / "GBP" (only the code changes, amounts don't) |
| labels/items | 0 | count badge on Change room tab (76 layers, mostly hidden) | add/remove logic |
| labels/total | 0.00 | price inside Add to cart (70 layers) | add/remove logic |
| labels/items seen, labels/total seen | 0 / 0.00 | not shown (animation bookkeeping) | |
| change room/top price, bottom price | "" | chip price in change room (70 layers) | carousel logic |
| labels/toast text | Removed Black Drawstring Shorts | the "Removed …" toast message (toast 745:3655 ×4 variants), up to 2 lines | **hard-coded in 238 prototype reactions on the Screens page**: every card "+"/✓ and every ✕ sets "Removed <name without brand>" (21 values, e.g. "Removed Grey Oversized Tee" ×16, "Removed Cropped Suede Trucker Jacket" ×8); 1 reaction sets "Change room emptied" |
| labels/toast message | That’s your only top | the "only one" toast (949:5088) | carousel reactions set "That’s your only top" ×2 / "That’s your only bottom" ×2 (curly apostrophe); 12 reactions set "Add pieces to check out" |
| labels/toast | hidden | not text: state machine (added in / removed in / undone / single in …) | many reactions |
| labels/address title / line | Home / ul. Shipka 34, 1504 Sofia | Checkout, Order detail "Delivered to" | address-picker sets Home/Work + "bul. Vitosha 89, 1463 Sofia" |
| labels/payment title / line | Visa •••• 4242 / Expires 08/28 | Checkout "Pay with", order detail | payment-picker sets Mastercard •••• 8810 / Expires 03/27, Apple Pay / Confirm with Face ID |
| labels/return item / price | LOAM Cocoa Oversized Tee / 39.00 EUR refund | Return an item (618:2350 price is bound) | "Return" taps on order detail set 4 item/price pairs, e.g. "289.00 EUR refund" |
| labels/badge | hidden | state only | |
| options/hand, options/appearance | right / light | state only (not shown as text) | |
| nav/tab, nav/product | events / g21 | state only | |
| profile/gender, top size, bottom size, size system, address, payment | none / M / M / EU / home / visa | state only | |
| profile/fit | Regular | not shown (Fit preference was removed 31 Oct; leftover variable) | |
| change room/* (top, bottom, spread, prev, next, seen…), undo/* | none, blank, add top… | state only (not shown) | |
| **size system** collection, modes EU / US / UK / Asia: sizes/top XS…XL, sizes/bottom XS…XL | top: 44/46/48/50/52 (EU), XS–XL (US), 34–42 (UK), S–XXL (Asia); bottom: 44–52 (EU), 28–36 (US, UK), S–XXL (Asia) | size-picker numbers (Options, Make it fit, Product, Size guide) | the size-system-picker switches the mode |

Try-On labels (2026-11-02): labels/try-on generating "Dressing you…" (Try-On · generating title), labels/try-on result "An AI preview of you in this outfit." (Try-On · result subtitle), labels/try-on back "Choose another photo" (the label property of generation failed button 1229:146; "Change the model" on the model route, which opens A model like you). "use this photo" 545:9351 sets these; "use this model" 1285:10217 sets "Dressing your model…", "An AI preview of a model like you in this outfit.", "Change the model". try-on/route and try-on/build are state only. The header rebuild on 2026-11-02 dropped the links on the title and subtitle; they were re-linked the same day.

Apart from the three Try-On labels above, no STRING variable holds button labels, titles or empty-state copy. Collections "prices" and "Collection" are empty.

---

## 2. Figma: text, grouped (Screens + Components)

### 2a. Shared UI chrome (components)
| String (as typed) | Renders as | Count | Where | Source | Example id |
|---|---|---|---|---|---|
| Events | EVENTS | not recounted (10 on Components) | button component default label (top-bar, bottom-bar, stage) | prop:label default "Events" on button 529:136, typed sentence case, UPPER, mostly hidden | 722:112 |
| Search / Turn around / Menu / Try it on | SEARCH / TURN AROUND / MENU / TRY IT ON | not recounted | names on the icon buttons: bottom-bar (Search, Turn around), top-bar (Menu), change-room-stage camera (Try it on) | prop:label, UPPER, hidden | I723:3079;722:112 |
| Events / Change room | EVENTS / CHANGE ROOM | not recounted (2 + 2 typed copies) | nav-switch 731:3705 (2 variants: tab) | main, UPPER, truncates at 1 line | 731:3668 |
| Checkout | CHECKOUT | not recounted (cta ×4, cart-label ×5 on Components) | bottom-bar; cta 494:162 default; cart-label 810:124 | prop:label "Checkout" (cta), main typed sentence case + UPPER (cart-label 810:105) | 810:105 |
| " " (single space) | – | 7 | cta label overridden to a space under the cart-label overlay (bottom-bar, Enter code) | prop:label | I517:9406;723:3080;494:161 |
| 0 | count | 76 | badge | var:labels/items | |
| 0.00 + EUR | price in Add to cart | 70 / 253 | cart-label states on/on 2 | var:labels/total + var:properties/currency | 494:158 |
| Added to change room | Added to change room | 37 (6 typed copies) | toast 745:3668, states hidden/added in/a/b/out | main, maxLines 1 | 745:3635 |
| View | VIEW | 37 (6 copies) | toast added states | main, UPPER | 745:3637 |
| Undo | UNDO | 12 copies | toast added + removed + undone states | main, UPPER | 827:3352 |
| Removed Black Drawstring Shorts | – | 4 copies | toast removed states | var:labels/toast text, maxLines 2 | 745:3655 |
| Undone! | Undone! | 4 copies | toast undone states | main, maxLines 1 | 827:3334 |
| That's your only top | – | 4 copies | toast single states | var:labels/toast message, maxLines 1 | 949:5088 |
| Add more | ADD MORE | 4 copies | toast single states | main, UPPER | 949:5094 |
| No tops yet | – | 97 on Screens (25 typed + 72 instance) | cr-garment · top 662:3179 {none}, carousel · top 516:9378 (instances), change-room-stage 495:276 (8 variants: 24 typed + 16 instance) | main, hidden in most | 641:21958, 723:3354, 1025:5001 |
| Tap + to add **tops** from an event. | – | 97 on Screens (25 typed + 72 instance); overrides not rechecked | same | main; bold noun since 2026-11-01 | 641:21959 |
| No bottoms yet | – | 97 on Screens (25 typed + 72 instance) | cr-garment · bottom 1007:4728 {none} + stage/carousel copies | main | 1007:4725 |
| Tap + to add **bottoms** from an event. | – | 97 on Screens (25 typed + 72 instance); how many are overridden not rechecked | same | main; bold noun since 2026-11-01 | 1007:4726 |
| Your change room is empty | – | 30 (24 typed + 6 instance) | change-room-stage 495:276 (8 variants, e.g. 1025:5005) | main, typed separately per variant | 1025:5159 |
| Tap + to add **pieces** from an event, then mix them here. | – | 30 (24 typed + 6 instance) | same | main; bold noun since 2026-11-01 | 1025:5160 |
| Add a top / Add a bottom | – | 65 / 65 (1 typed + 64 instance each) | cr-garment · top {add top} 963:5056 / bottom {add bottom} 963:5065 (add card at the end of a carousel) | main | 1007:4717 / 1007:4718 |
| 42.00 + EUR | – | 1 | slot chip 963:5087 (Components) | main + var | 963:5089 |
| Add to change room / Remove from change room | ADD TO CHANGE ROOM / REMOVE FROM CHANGE ROOM | not recounted | add-to-room 598:242 {added=false/true}, product-page | prop:label, typed sentence case, UPPER | 598:233 |

toast 745:3668 has 18 variants.

### 2b. Pickers and fields (Components page, variants identical text)
- appearance-switch 498:9258: "Light", "Dark"
- size-system-picker 602:515: "EU", "US", "UK", "Asia"
- currency-picker 730:3665: "EUR", "USD", "GBP" (description: sets properties/currency)
- size-picker · top 576:192 / · bottom 576:273: 44 46 48 50 52 (each bound to sizes/* variables, so they change with the size system)
- address-picker 613:526: "Home" / "ul. Shipka 34, 1504 Sofia", "Work" / "bul. Vitosha 89, 1463 Sofia"
- payment-picker 613:564: "Visa •••• 4242" / "Expires 08/28", "Mastercard •••• 8810" / "Expires 03/27", "Apple Pay" / "Confirm with Face ID"
- reason-picker 617:146: "Too small", "Too big", "Not like the photos", "Changed my mind"
- text-field 576:325: prop value default "Your name" (description: "placeholder dims it")
- currency 378:8661 (Property 1=1/0): "1" + "EUR" (legacy price unit used on Events cards: price layer "39.00" etc. + currency instance)
- gender picker: pictures only (layers "female", "male"), no visible words (to check after the photo work)

(to check after the photo work: build picker 1345:330 "Even", "Wider hips", "Wider shoulders", "Wider middle"; build-tile 1345:81; try-on outfit fit 1438:481 has 24 more copies of each tops/bottoms empty-state line)

### 2c. Event banners (Components page main components, used on Events, Search, event pages)
| Typed | Text case | Renders as | Font |
|---|---|---|---|
| Casual | none | Casual | Notable 63 |
| Outdoors | none | Outdoors | Alfa Slab One 56 |
| Office hours | none | Office hours | DM Serif Display 67 |
| Day off | none | Day off | Kranky 63 |
| Maternity | none | Maternity | Italiana 63 |
| Working out | none | Working out | Racing Sans One 65 |
| Night out | none | Night out | Monoton 54 |
| Beach day | none | Beach day | Pacifico 52 (sizes set by the Event banners rule, 2026-11-01) |
Event pages: every event page has a typed heading with the event name (Roboto Flex Bold 28, e.g. "Casual" 611:1664, "Night out" 611:2144) as well as the banner. Every event page subtitle: "6 pieces. Every top goes with every bottom." (8 typed copies, 611:1665; a 9th copy is a Notifications body).

### 2d. Product content
- Event-card product names: brand + name in one layer, e.g. "LOAM Black Drawstring Shorts" (12 typed copies), "LOAM Grey Oversized Tee" (11)… 21 products, each typed independently 3–12 times across Events, event pages, Search, Checkout, Order detail. Prices on cards are a number layer ("39.00", "42.00", "89.00"…) + the EUR instance (currency variable).
- Checkout/Search/product-page prices typed whole: "89.00 EUR" ×23 copies, "69.00 EUR" ×14, "119.00 EUR" ×12 … (no variable; a currency change won't reach them).
- product-page 598:1587 (21 variants g01–g21, one per product). Header title: the piece name in all 21 variants, no subtitle (2026-11-02; "Cropped Suede Trucker Jacket" wraps to 2 lines). Each variant typed separately: brand ("LOAM"/"VALE"/"SADDLE"; since 2026-11-02 it starts the details line, e.g. "LOAM · Organic cotton · Casual, Working out"), "Tap to turn around", name ("Cream Cargo Trousers"; now the header title, the second name under the photo was removed 2026-11-02), price ("89.00 EUR"), material + events line ("Organic cotton twill · Casual, Outdoors, Office hours"), "Size", "Size guide", "Wear it with", size numbers (bound), button "Add to change room" (prop, UPPER). "Tap to turn around", "Wear it with", "Size", "Size guide" ×21 independent copies. "Wear it with" now lists 3 product names per variant (2-line truncation, typed per variant, e.g. "Cream Cargo Trousers" ×14, "Heather Grey Joggers" ×12).
- Full material/event lines: Cream Cargo Trousers "Organic cotton twill · Casual, Outdoors, Office hours"; Heather Grey Joggers "Organic cotton fleece · Casual, Day off, Maternity, Working out"; Indigo Denim Cargo Trousers "Recycled denim · Outdoors, Office hours, Night out"; Black Drawstring Shorts "Organic cotton jersey · Day off, Maternity, Working out, Beach day"; Studded Suede Shorts "Deadstock suede · Night out, Beach day"; Grey Crewneck Sweatshirt "Organic cotton fleece · Office hours, Day off, Maternity, Working out"; Black Overshirt "Tencel twill · Office hours, Night out"; Cocoa Oversized Hoodie "Organic cotton fleece · Casual, Day off, Maternity"; Cropped Suede Trucker Jacket "Deadstock suede · Night out"; Cream Cropped Bomber "Recycled nylon · Day off"; Colour-Block Windbreaker / Olive Cropped Bomber "Recycled nylon · Outdoors"; Black Cropped Bomber "Recycled nylon · Office hours, Night out"; Cocoa Oversized Tee / White Patch Tee "Organic cotton · Casual, Beach day"; Cropped Leather Jacket "Vegetable-tanned leather · Office hours, Night out"; Suede Field Jacket "Deadstock suede · Outdoors"; White Ribbed Tank "Organic cotton rib · Working out, Beach day"; Grey Oversized Tee "Organic cotton · Day off, Maternity, Working out, Beach day"; Black Sleeve-Logo Tee "Organic cotton · Casual, Working out"; Quilted Liner Jacket "Recycled polyester fill · Outdoors, Maternity".

### 2e. Screens (plain text layers unless marked; buttons are cta instances with prop:label typed in sentence case and an UPPER text case, written below as they render)
**Options 498:9264**: "Options" (title) · "Name, gender, sizes, currency, appearance and account." (legend) · "Name" + field "Your name" · "Gender" · "**Optional.** We use it to fit the outfits to you." · "Size system" · "How sizes are labelled **everywhere** in blend." · "Top size" · "Bottom size" · "Currency" · "Prices are shown in this currency." · "Appearance" + Light/Dark · "**Light** or **dark**, whichever is easier on your eyes." · buttons EMPTY CHANGE ROOM, NOTIFICATIONS, MY ORDERS, SIGN OUT. (Gender label and helper: to check after the photo work)
**Sign out? 615:2410** (dialog): "Sign out?" · "Your sizes and change room **stay saved** for next time." · SIGN OUT, CANCEL.
**Try-On · photo 499:9246** (upload-first since 2026-11-01): "Try it on" · "Choose a **full-body** photo or take one, and we’ll dress you in your outfit." (bold moved to "full-body" on 2026-11-01) · examples "Like this" / "Not like this" · tips "Head to toe in the frame", "Just you, standing up", "Good light, plain background", "Fitted clothes, hands visible" · link "No full-body photo? Use a model instead" · CHOOSE A PHOTO, TAKE A PHOTO. (The outline and "Stand back so your whole body fits the outline" were removed.)
**Try-On · preview 499:9289**: "Looks good?" · "Use this photo, or choose another one." (no bold since 2026-11-01) · "Your photo" · USE THIS PHOTO, RETAKE.
**Try-On · model like me 1285:10136** (bold 2026-11-01): header "A model like you" · "Pick the build closest to yours. We’ll dress the model in your sizes." (2 lines; the wording from before the 2026-11-02 rebuild, kept by the 2026-11-01 audit) · "Only shapes the model. You can change it **any time**." · "Your **saved** sizes. Change them if they’re not right."
**Try-On · generating 499:9332**: "Dressing you…" (var labels/try-on generating; "Dressing your model…" on the model route) · "This can take up to a minute."
**Try-On · result 499:9383**: "Here’s your outfit" · "An AI preview of you in this outfit." (var labels/try-on result; model route: "An AI preview of a model like you in this outfit.") · "AI preview" (badge) · SAVE IMAGE, TRY ANOTHER OUTFIT.
**Try-On · photo not usable 1229:76**: "Not a full-body photo" · "Try a photo of you from head to toe." · **Try-On · generation failed 1229:112**: "That didn’t work" · "We couldn’t make your preview this time. Try again in a moment." · button "Choose another photo" (var labels/try-on back; "Change the model" on the model route).
**Pop-ups**: "Saved to your photos" 605:1709 · "New code sent" 605:1712.
**Welcome 578:9421**: "Explore our carefully curated collection of sustainable fashion pieces, designed to elevate your wardrobe while minimising your environmental impact." (578:9428, body 15px; long copy kept on purpose by the user, 2026-11-02) · SIGN IN, CREATE ACCOUNT · "Continue as guest".
**Sign in 578:9438**: "Sign in" · "Welcome back." · labels Email, Password above empty fields (they were placeholders until 2026-11-02) · "Forgot password?" · SIGN IN, CREATE ACCOUNT. Same header on Sign in · Google / Facebook sign-in failed 1598:24676 / 1598:24719 (2026-11-02).
**Social sign-in (since 2026-11-01)** on Sign in 578:9438, Sign in · wrong password 1227:47, Create account 578:9456, Create account · email taken 1227:66, Create account · password too short 1227:83: CONTINUE WITH GOOGLE · CONTINUE WITH FACEBOOK (social-button 1491:247 {brand=Google / Facebook}; typed "Continue with Google" / "Continue with Facebook", UPPER from the button style) · "or" (divider · or, hint style).
**Sign in · wrong password 1227:47**: error "That email and password don’t match. Try again or reset your password." (sample values "maya@example.com", "••••••••••").
**Create account 578:9456**: "Create account" · "Your sizes and change room **stay saved**." · labels Name, Email, Password above empty fields (placeholders until 2026-11-02) · hint "At least **8 characters**" (under Password) · "Already have an account? Sign in" (link, 2026-11-02) · CREATE ACCOUNT. (subtitle and button changed 2026-11-01) Same header on Create account · Google / Facebook sign-in failed 1598:24762 / 1598:24805 (2026-11-02).
**Create account · email taken 1227:66**: error "This email already has an account. **Sign in** instead?" (sample "Maya Petrova", "maya@example.com"). (subtitle and CREATE ACCOUNT button as on Create account)
**Create account · password too short 1227:83**: error "Use at least **8 characters**." (subtitle and CREATE ACCOUNT button as on Create account)
**Make it fit 578:9471**: "Make it fit" · "You can change all of this **any time** in Options." · Gender, Top size, Bottom size, Size system, Currency (same pickers as Options) · "**Optional.** We use it to fit the outfits to you." (under Gender; to check after the photo work) · START SHOPPING, SKIP FOR NOW.
**Forgot password 578:9525**: "Forgot password" · "Enter your email and we’ll send you a 4-digit code." · label Email above an empty field (placeholder until 2026-11-02) · SEND CODE.
**Enter code 578:9536**: "Enter the code" · "If there’s an account for that email, we’ve sent a code." (every email since 2026-11-02; was "We sent a 4-digit code to your email."; same subtitle on · wrong code 1227:99 and · expired 1227:116) · digits 4 7 1 · "Resend code" · CONTINUE. · Enter code · unknown email 1598:24848 moved to Archive on 2026-11-02 (the line now shows for every email)
**Enter code · wrong code 1227:99**: "That code doesn’t match. Check your email and try again." · **Enter code · expired 1227:116**: "This code has expired. Tap Resend code for a new one."
**New password 578:9555**: "New password" (title) · label "Password" (was "New password" until 2026-11-02; same on both states) · "Pick something you’ll remember." · hint "At least **8 characters**" (2026-11-02) · label "Repeat password" (labels above empty fields since 2026-11-02; they were placeholders) · SAVE PASSWORD. Same header on New password · passwords don’t match 1598:24873 ("Those passwords don’t match.") and · too short 1598:24892 ("Use at least **8 characters**.") (2026-11-02).
**Password changed 578:9568**: "Password changed" · "You can sign in with your new password now." · SIGN IN.
**Checkout 579:10097**: "Checkout" · "Everything in your change room." (no bold since 2026-11-01; same in Checkout · paying 1218:767, card declined 1218:921, payment failed 1218:1081) · item list (brand+name, "89.00 EUR"…) · "Deliver to" + Home/address (var) + "Change" · "**Free** delivery · arrives Thursday" · "Pay with" + Visa (var) + "Change" · PAY.
**Checkout · paying 1218:767**: button PAYING… · "Keep this screen open while we confirm your payment." · **Checkout · card declined 1218:921**: "Card declined" · "Your bank declined this card, so **nothing was charged**. Try another card." · CHANGE CARD, PAY · **Checkout · payment failed 1218:1081**: "Payment didn’t go through" · "Something went wrong, so **nothing was charged**. Try again in a moment." · TRY AGAIN, CHANGE CARD.
**Order placed 579:10250**: "Order placed" · "Order #BL-20481 is being packed. We’ll let you know when it’s on its way." · TRACK ORDER, KEEP SHOPPING.
**Track order 579:10280**: "Track order" · "Order #BL-20481 · arrives Thursday" · Ordered "Mon 12:40" · Packed "Tue 09:15" · On its way "Wed 16:02" · Delivered "Arrives Thursday" (was "Expected Thursday" until 2026-11-01) · DONE.
**Delivery address 614:2136**: "Delivery address" · "Where should we send your order?" · Home/Work pickers · ADD AN ADDRESS · DONE.
**New address 614:2142**: "New address" · "We deliver anywhere in the **EU**." · labels Full name, Street and number, City, Postcode, Phone number above empty fields (placeholders until 2026-11-02; City and Postcode in equal halves) · SAVE ADDRESS.
**New address · missing fields 1224:3564**: "Add your full name." · "Add your street and number." · "Add your city." · "Add your postcode." · "Add a phone number so the courier can reach you." · **New address · invalid postcode 1224:3604**: "That postcode doesn’t look right. Check it and try again." (sample values "Maya Petrova", "ul. Shipka 34", "Sofia", "150", "+359 88 123 4567").
**Payment method 614:2148**: "Payment method" · "How would you like to pay?" · payment pickers · ADD A CARD · DONE.
**New card 614:2154**: "New card" · "Your card details **stay encrypted**." · labels Card number, Expiry date, CVC, Name on card above the fields ("MM / YY" stays as the expiry placeholder; "Expiry date" takes its words from the error "Add the expiry date."; the others were placeholders until 2026-11-02) · SAVE CARD.
**New card · invalid number 1224:3459**: "That card number doesn’t look right. Check it against your card." · **New card · expired 1224:3493**: "This card has expired. Try another card." · **New card · missing fields 1224:3527**: "Add the card number." · "Add the expiry date." · "Add the CVC, the 3 digits on the back." (2026-11-02) · "Add the name on the card."
**Product 600:1436**: product-page instance (see 2d) + toast. Header title = the piece name (here "Black Sleeve-Logo Tee"), subtitle off (2026-11-02).
**Search pages (on Archive since 2026-11-02, replaced by search in Events below):** Search 604:1667 had "Search" · field "Search clothes, colours, brands, events" · "Recent searches" · "Popular right now"; Search · tee/bomber/shorts/beach/wedding had the counts and the wedding message now used on the Events states.
**Events · search open 1807:14046 (first visit 1807:15023)**: suggestion titles "Recent" (left out on a first visit) · tee, bomber, shorts, beach, wedding · "Categories" · Tops, Bottoms (always in this order) · "Events" + the 8 event names · "Popular pieces" · Cocoa Oversized Hoodie, Cropped Leather Jacket, Indigo Denim Cargo Trousers (open the piece, not a filter) · field placeholder "Search pieces or events". A suggestion that's already on shows a ✓ icon, not a typed ✓.
**Events · typing tee 1807:16000**: "Search “tee”" (query truncates) + "5 events · 4 pieces" · "Pieces" + matching piece names · "Events" + matching events.
**Events · tee / bomber / shorts / beach / tops / bottoms / bottoms + Casual**: no count line since the user removed it on 2026-11-02 (the "count" layers are hidden, not deleted). The count stays only in the typing row ("Search “tee”" + "5 events · 4 pieces"). Before that, the count line at the top read "<n> event(s) · <n> piece(s)": "5 events · 4 pieces", "4 events · 3 pieces", "5 events · 2 pieces", "1 event · 6 pieces", "8 events · 16 pieces", "8 events · 5 pieces", "1 event · 2 pieces"; singular "1 event", "1 piece"; a piece in two events counts once; never "results". Chip bar: chips show the word as typed ("tee") or the name ("Bottoms", "Casual") · "Clear all" from 2 chips on · "+".
**Events · wedding 1812:19697**: "Nothing for “wedding” yet" · "Try another word, or start from one of the **events** below." (word for word from the old Search · wedding; only "events" bold); no count line.
**Events · tee + bottoms · no match 1812:20722**: "Nothing for these filters yet" · "Remove a filter, or start from one of the **events** below." (only "events" bold).
**My orders 605:1638**: "My orders" · "Track a delivery or start a return." (prices not rechecked) · "Order #BL-20481" "On its way · arrives Thursday" "200.00 EUR" · "Order #BL-19877" "Delivered · 12 Oct" "84.00 EUR" · "Order #BL-19302" "Delivered · 28 Sep" "408.00 EUR" · TRACK ORDER. (card titles "#BL-…" until 2026-11-02)
**My orders · empty 1218:130**: "No orders yet" · "Your orders show up here once you **buy something**." (one line since 2026-11-02; was "When you **buy something**, you’ll track it and start returns here.") · GO TO EVENTS. Header as on My orders, subtitle on (2026-11-02).
**Order #BL-19877 / #BL-19302**: "Order #BL-19877" / "Order #BL-19302" (titles, "#BL-…" until 2026-11-02) · "Delivered · 12 Oct" · "Items" · name + "Size" 48 + "· 39.00 EUR" + "Return" · "Delivered to" · "Paid with" · "84.00 EUR · paid 10 Oct" / "408.00 EUR · paid 26 Sep".
**Order #BL-19302 · returns closed 1218:196**: same as Order #BL-19302, but "Returns closed 28 Oct" (×2) replaces "Return". Its text box is a fixed 128 wide since 2026-11-02, so longer wording wraps instead of growing.
**Return an item 618:2342**: "Return an item" · "**Free** returns within **30 days** of delivery." · item (var) · "39.00 EUR refund" (var) · "Why are you sending it back?" · reason picker · "Your refund goes back the way you paid, once the parcel reaches us." · START RETURN.
**Return started 618:2383**: "Return started" · "Drop it at any parcel locker within **30 days** of delivery. We’ll refund you once it reaches us." · "Return code" · "RT-58213" · "Enter it at the locker." · DONE.
**Size guide 615:2240**: "Size guide" · "Size system" + EU/US/UK/Asia · "Tops · chest" · "Bottoms · waist" · sizes 44–52 with cm ("86 cm", "92 cm"…) · "Not sure? Lay a well-fitting T-shirt flat, measure armpit to armpit and double it. For bottoms, measure across the waistband of trousers that fit and double it." (tip rewritten 2026-11-02 to cover tops and bottoms; row frame 615:2291 is named "Size system", was "Shop in" until 2026-11-02) (was: "Not sure? Lay a T-shirt that fits you well flat, measure from armpit to armpit and double it."
**Notifications 624:2368**: "Notifications" · "Orders, restocks and new events." · "New" · "Your order is on its way" "2 hours ago" "Order #BL-20481 arrives Thursday." (2026-11-02) · "Back in your size" "Yesterday" + product "VALE Olive Cropped Bomber" · "Earlier" · "New pieces for Night out" "3 days ago" "6 pieces. Every top goes with every bottom." · "Delivered" "12 Oct" "Order #BL-19877 was left at your door." (2026-11-02) · a hidden "Night out" layer
**Notifications · empty 1218:84**: "No notifications yet" · "**Order updates**, restocks in your size and new events show up here." · GO TO EVENTS (2026-11-02). Header as on Notifications, subtitle on (2026-11-02).
**Events 320:7350 / Change room 479:9125**: no copy of their own (Events has had no intro line since 2026-11-01); text comes from banners, cards, bars (EVENTS / CHANGE ROOM, CHECKOUT + total, hidden SEARCH, TURN AROUND, MENU; Change room also hidden TRY IT ON), stage and toast.
**Change room · portfolio 1194:9632**: same as Change room, plus a "2" count badge.

### 2f. Not in Figma as words
- No visible "Rotate", "Try-On" or "Closet" label. The icon buttons carry hidden names: "Turn around" (rotate), "Try it on" (camera), "Search", "Menu" (top bar). Product page says "Tap to turn around".
- Search in Events spoken names (2026-11-02): search button "Search"; with chips on "Search, 1 filter on" / "Search, 2 filters on" (the dot is visual only) · chip bar group "Filters" · each chip is one item "Bottoms, remove filter" · suggestion "Casual, add filter" (recent words too: "tee, add filter"); pieces read their name · "+" "Add a filter" · "Clear all" "Clear all filters" · field "Search pieces or events" · ✕ in the field "Clear text" · keyboard return key "Search" (the keyboard is a picture in Figma, so this is for the app) · count line read as "5 events, 4 pieces", announced when the chips change.
- Try-On · camera, · countdown, · timer on: header title "Take a photo" (2026-11-02; was an empty title).
- Icon-only tap layers on the Screens page (layer names): add (+) 111, tap 142, back 54, garment · prev 38, undo hotspot 17, remove (✕) 16, face 12, close 5, female/male 2+2, tap to close 1.
- Event banner title boxes match their capital height since 2026-11-01 (leading trim). Toast texts truncate: "Removed …" at 2 lines, the rest at 1 line.

---

## 3. Coded app (src, all user-facing strings)

Rendering note: `.pill` buttons are `text-transform: uppercase` (src/styles/base.css:69), so "Add to cart" renders ADD TO CART; occasion titles uppercase (OccasionSection.css:56) and picked counter uppercase (:77); toast buttons uppercase (Toast.css:31); outfit-card badge uppercase (sheets.css:98). `.round-btn` (Try-On, Closet, Rotate) is not transformed. Product names clamp to 2 lines (ProductCard.css:38); occasion titles don't wrap (OccasionSection.css:58).

| String | File:line | Kind |
|---|---|---|
| blend | index.html:8 | page title |
| blend: a capsule wardrobe shop where every piece goes with every other piece. Mix them in the change room before you buy. | index.html:7 | meta description |
| Main | components/BottomBar.tsx:10 | aria-label (nav) |
| Events | BottomBar.tsx:17 | tab (renders EVENTS) |
| Change room | BottomBar.tsx:24 | tab |
| `${n} pieces` | BottomBar.tsx:26 | aria-label on count badge, **no singular** ("1 pieces") |
| Add to cart | BottomBar.tsx:33 | button (opens checkout of everything), disabled when empty |
| `${total} EUR` | BottomBar.tsx:34 | price in button |
| `${name}, ${side} view` (e.g. "Black Overshirt, front view") | components/Garment.tsx:24 | alt (no brand) |
| blend, go to events | components/Header.tsx:9 | aria-label (logo) |
| "" | Header.tsx:10 | logo alt (decorative) |
| Settings | Header.tsx:12 | aria-label, icon-only gear |
| "" | components/OccasionSection.tsx:41 | banner photo alt |
| {occasion.title} | OccasionSection.tsx:44 | banner title (uppercase) |
| `1 top · 2 bottoms` | OccasionSection.tsx:49-51 | picked counter, pluralised |
| Removed from change room (+ Undo) | components/ProductCard.tsx:14 | toast (no piece name) |
| Added to change room (+ View) | ProductCard.tsx:17 | toast |
| {brand} {name} | ProductCard.tsx:28 | card name |
| `${price} EUR` | ProductCard.tsx:31 | price |
| Remove {name} from change room / Add {name} to change room | ProductCard.tsx:36 | aria-label (+/✓ icon button) |
| Close | components/Sheet.tsx:65 | aria-label (✕) |
| tops / bottoms | components/SlotCarousel.tsx:15 | labels |
| No tops yet / No bottoms yet | SlotCarousel.tsx:70 | empty state title |
| Add some from Events | SlotCarousel.tsx:71 | empty state hint (whole thing is a button to Events) |
| carousel / slide | SlotCarousel.tsx:85, :93 | aria-roledescription (read aloud) |
| `tops in your change room` | SlotCarousel.tsx:86 | aria-label |
| `1 of 3: Black Overshirt` | SlotCarousel.tsx:93 | slide aria-label |
| Previous top / Next top (bottom) | SlotCarousel.tsx:101, :104 | aria-label (chevrons) |
| Removed {name} (+ Undo) | components/SlotControl.tsx:73 | toast |
| Remove {name} from change room / Nothing to remove | SlotControl.tsx:76 | aria-label (✕) |
| {price} EUR | SlotControl.tsx:84-85 | price |
| – (en dash) | SlotControl.tsx:88 | empty price |
| {name} | SlotControl.tsx:61 | title tooltip on dots |
| Scroll through tops / Scroll through bottoms | SlotControl.tsx:101 | aria-label (slider) |
| Undo / View | components/Toast.tsx:27, :37 | toast buttons (uppercase); toast lasts 3.2 s (:11) |
| Change room / Change room controls | screens/ChangeRoomScreen.tsx:12, :18 | aria-labels |
| Try-On / Closet / Rotate | ChangeRoomScreen.tsx:23, :26, :29 | round buttons (Try-On disabled with no explanation when nothing shows) |
| Order placed | screens/CheckoutSheet.tsx:24 | sheet title |
| Thank you | CheckoutSheet.tsx:29 | |
| `{n} piece(s) for {total} EUR. This is a demo store, so no payment was taken and nothing will ship.` | CheckoutSheet.tsx:31 | |
| Done | CheckoutSheet.tsx:34 | button |
| Your cart | CheckoutSheet.tsx:45 | sheet title |
| `{n} piece(s) from your change room` | CheckoutSheet.tsx:46 | subtitle |
| Subtotal / Shipping / Free / Total | CheckoutSheet.tsx:51-55 | |
| Place order | CheckoutSheet.tsx:65 | button |
| Your cart is empty | CheckoutSheet.tsx:73 | empty title |
| Add pieces from Events to your change room, mix them, then come back here. | CheckoutSheet.tsx:74 | |
| These {n} pieces make **{x} outfits**. | CheckoutSheet.tsx:80 | only when >1 outfit |
| {material} | CheckoutSheet.tsx:93 | |
| Remove {name} | CheckoutSheet.tsx:96 | aria-label (removes from change room, no toast/undo) |
| `{n} top(s) × {n} bottom(s) = {n} outfit(s)` | screens/ClosetSheet.tsx:16 | subtitle |
| Every outfit your pieces can make | ClosetSheet.tsx:17 | subtitle (empty) |
| Closet | ClosetSheet.tsx:20 | sheet title |
| Your closet is empty / Add a top to start / Add a bottom to start | ClosetSheet.tsx:23 | empty title |
| Outfits appear here as soon as your change room has at least one top and one bottom. Every new piece multiplies what you can wear. | ClosetSheet.tsx:24 | |
| Browse events | ClosetSheet.tsx:32 | button |
| `{top} with {bottom}, {price} EUR, showing now` | ClosetSheet.tsx:48 | aria-label |
| Showing | ClosetSheet.tsx:55 | badge (uppercase) |
| Events | screens/EventsScreen.tsx:22 | aria-label |
| Dress for the day | EventsScreen.tsx:25 | h1 |
| Every piece in an occasion goes with every other piece. Add a few, then mix them in the change room. | EventsScreen.tsx:26 | lede |
| Closet / Rotate | EventsScreen.tsx:36, :39 | floating buttons |
| Left-handed / Right-handed | screens/SettingsSheet.tsx:6-7 | options |
| Settings | SettingsSheet.tsx:16 | sheet title |
| Dominant hand | SettingsSheet.tsx:19 | group title |
| Puts the change room controls on the side your thumb reaches. | SettingsSheet.tsx:21 | hint |
| Change room | SettingsSheet.tsx:46 | group title |
| Nothing in your change room yet. / `{n} piece(s) saved on this device.` | SettingsSheet.tsx:48 | hint |
| Empty change room | SettingsSheet.tsx:51 | button (no confirm, no undo) |
| We couldn't read that photo. Try a JPG or PNG. | screens/TryOnSheet.tsx:32 | error (straight apostrophe) |
| Virtual try-on isn’t switched on in this build yet. | TryOnSheet.tsx:43 | error (curly) |
| {err.message} / Something went wrong. | TryOnSheet.tsx:45 | error: shows raw server text or "Try-on failed (500)" from services/tryOn.ts:39 |
| Outfit to try on | TryOnSheet.tsx:51 | aria-label |
| {top} + {bottom} | TryOnSheet.tsx:58 | names line |
| Try-On / See this outfit on you | TryOnSheet.tsx:64 | sheet title/subtitle |
| Take a photo / Upload a photo | TryOnSheet.tsx:71, :76 | buttons |
| Full body, standing straight, arms slightly away from your sides / Plain background and even light work best / Your photo is only used to create this preview | TryOnSheet.tsx:81-83 | tips (no full stops) |
| Your photo | TryOnSheet.tsx:90 | alt |
| Generate try-on / Choose another photo | TryOnSheet.tsx:94, :97 | buttons |
| Dressing you up… this can take up to a minute. | TryOnSheet.tsx:110 | status |
| You wearing the selected outfit | TryOnSheet.tsx:117 | alt |
| blend-try-on.png | TryOnSheet.tsx:119 | download name |
| Save image / Try another photo | TryOnSheet.tsx:120, :123 | buttons |
| Coming soon / That didn’t work | TryOnSheet.tsx:133 | error title |
| Try again / Back | TryOnSheet.tsx:137, :141 | buttons |
| Virtual try-on is not connected yet / Could not read photo / Try-on failed ({status}) | services/tryOn.ts:5, :18, :39 | internal errors (the last one can reach the user) |

**Data** (src/data):
- occasions.ts:16-58 titles: Casual, Outdoors, Work, Beach, Evening, Maternity, Business casual (7). Figma has Casual, Outdoors, Office hours, Day off, Maternity, Working out, Night out, Beach day (8). public/events/sport.webp exists but is unused.
- products.ts:21-43: 21 products, brands LOAM / VALE / SADDLE, names and materials identical to Figma's product-page variants (e.g. g04 "Black Drawstring Shorts", "Organic cotton jersey"). Prices in whole EUR, formatted `toFixed(2)` (products.ts:52) + " EUR".

---

## 4. Wording decisions in the notes (quoted)

CASE-STUDY-NOTES.md decision log:
- 2026-10-20 | Name is **blend** | Logo was already right; "blended" was the old name (line 31)
- 2026-10-20 | Fictional labels (LOAM, VALE, SADDLE), names match the photos, prices in EUR only | Placeholder text didn't match the products, and currencies were mixed (EUR / Euro / BGN) (32)
- 2026-10-20 | "Total Fits" renamed **Closet**, shows every top x bottom combination with the maths ("3 tops x 2 bottoms = 6 outfits") (33)
- 2026-10-20 | Logo stays in the header; Closet, Settings, Try-On and Checkout open as sheets with a close button (34)
- 2026-10-20 | Handedness setting lives in Settings and mirrors the whole control rail (35)
- 2026-10-31 | Events / Change room tabs became one segmented switch, the same one used for Controls and Appearance (43)
- 2026-10-31 | Options header (title + legend) stays pinned while scrolling; the legend lists every setting (44)
- 2026-10-31 | Fit preference removed, Currency (EUR / USD / GBP) added in its place … prices aren't converted in the prototype, only the currency code changes (45)
- 2026-10-31 | Toasts: "Added to change room · View" after adding, "Removed <piece> · Undo" after removing (same look as the coded app) (53)
- 2026-10-31 | Setup ("Make it fit") asks for Currency instead of Fit; "Shop in" renamed "Size system" everywhere (71)
- 2026-10-31 | Occasion fonts: Outdoors → Alfa Slab One, Night out → Monoton, Beach day → Pacifico (72; 52 since 2026-11-01)
- 2026-10-31 | Toast fills its slot … Undo now confirms with "Undone!", and the Added toast has Undo next to View (74)
- 2026-10-31 | "Undone!" uses the same 48px pill as the Undo overlay (78)
- 2026-10-31 | Toasts stay about 2s longer: "Added" ~4.5s, "Removed … Undo" ~6s, "Undone!" 3.4s (101)
- 2026-10-31 | Swiping a carousel that holds only one piece shows a toast: "That's your only top" / "That's your only bottom" with an Add more button that switches to the Events tab (102)
- 2026-10-31 | … after the last piece an "Add a top / Add a bottom" card peeks in (tap opens Events). Price and remove moved into a compact chip (103)
- 2026-10-31 | Removing the last top or bottom grows the add card into the full empty box ("Your … carousel is empty") (113) (superseded 2026-11-01: "No tops yet" / "No bottoms yet")
- 2026-10-31 | Toasts slimmed to 40px … message text 14px (115)
- Idea section uses "any top works with any pair of **pants**" (6) and "tops on top, **pants** below" (9); "Closet. Shows every **combination**" (10).

NEXT-SESSION.md (last session 20 Oct, plus 31 Oct section):
- Events occasion list: "Casual, Outdoors, Work, Beach, Evening, Maternity, Business casual" (line 10)
- "Closet: every combination your pieces make (this used to be called "Total Fits")" (12)
- Decisions table: Name **blend** (27); Product cards "prices in **EUR only**" (28); "Handedness switch | Lives in Settings (gear icon in the header)" (31); "Back button | Replaced by the logo … close (✕) button" (32); ""Add to cart" | Buys everything in the change room (my default; you didn't object)" (33)
- "Try-On … shows **"Coming soon"** until an AI service is connected" (44)
- "An **intro line** at the top of Events: "Dress for the day"" (65, "Things I decided that you should double-check")
- 31 Oct: "Toasts verified … add → "Added to change room · View", ✓ or change room ✕ → "Removed … · Undo"" (92)

design-reviewer.md Content rules (current house rules): blend lowercase; prices "42.00 EUR", no €/$/USD/GBP outside the currency picker; fictional labels; "Size system" not "Shop in"; Make it fit asks for Currency; toast texts "Added to change room · View" (with Undo), "Removed <piece> · Undo", "Undone!", "That's your only top/bottom · Add more"; a dead end shows the next step; no debug leftovers (STRING-bound text showing runtime values).

---

## 5. Terminology map

| Concept | Figma | App | Notes | Conflict? |
|---|---|---|---|---|
| The bag | "change room" everywhere (tab, toasts, "Everything in your change room.", EMPTY CHANGE ROOM); buy button "CHECKOUT" + total | "Change room" + "Add to cart" + sheet "Your cart" / "Your cart is empty" | "Change room (the shopping bag)"; code says bag | Solved in Figma 2026-11-01 ("Checkout" + total); the app still says "Add to cart" / "Your cart". |
| Clothing unit | "piece(s)" (empty states, event subtitles, Search counts since 2026-11-02, "1 event · 6 pieces", "Pieces", notifications); "item" in "Return an item", "Items" | "piece(s)" everywhere incl. aria | "piece", "item" both | Mild: "item" only in returns/order detail. "garment" is internal only. |
| What you wear together | "outfit" (Try-On "your outfit", "Here’s your outfit", TRY ANOTHER OUTFIT) | "outfit(s)" (Closet, checkout note, Try-On) | "combination", "Total Fits" (retired), "outfits" | Solved: the result says "Here’s your outfit" (it said "Here’s your look"); "combination" only in notes. |
| Shop-by grouping | "Events" tab; "event" in copy ("pick tops from an event", "one of the events below", "new events") | "Events" tab, "Browse events", "Add some from Events", but lede says "**occasion**" | "occasion", "capsule", "event" | **Yes**: app lede "Every piece in an occasion…"; "capsule" only in meta description. |
| Event names | Casual, Outdoors, Office hours, Day off, Maternity, Working out, Night out, Beach day | Casual, Outdoors, Work, Beach, Evening, Maternity, Business casual | NEXT-SESSION lists the app set | **Yes**: different sets. |
| Clothing halves | top / bottom ("Top size", "Bottoms · waist") | top / bottom | "pants" in CASE-STUDY idea lines | Notes only; product names use "Trousers". |
| Adding | "Tap + to add …", "Add a top", "ADD TO CHANGE ROOM", "Added to…", "Add more" | "Add…", "Add a few, then mix them", "Add some from Events" | "add" | No (Figma); app wording differs. |
| Removing | "REMOVE FROM CHANGE ROOM", "Removed …", "EMPTY CHANGE ROOM" | "Remove …", "Removed from change room" / "Removed {name}", "Empty change room" | – | No "delete" anywhere. Removed-toast wording differs inside the app. |
| Settings | **Options** (screen, legend, "later in Options") | **Settings** (sheet, aria-label) | Settings (20 Oct), Options (31 Oct) | **Yes** |
| Handedness | none (left-handed mode removed from the prototype 2026-11-01) | "Dominant hand" Left-handed / Right-handed; "Puts the change room controls on the side your thumb reaches." | "Left/right-handed mode", "Controls" | App only: decided 2026-11-01 that it becomes "Controls on" / Left / Right. |
| Front/back flip | (icon only) "Tap to turn around" | "Rotate" | "Rotate … flips" | Yes |
| Try-On | title "Try it on"; buttons TAKE PHOTO / UPLOAD FROM GALLERY / USE THIS PHOTO / RETAKE / TRY ANOTHER OUTFIT; "AI preview" | "Try-On"; Take a photo / Upload a photo / Generate try-on / Choose another photo / Try another photo | "Try-On" | **Yes**: labels, and "Try-On" vs "try-on" vs "Try it on". |
| Delivery | "Free delivery", "Deliver to", "Delivery address" | "Shipping … Free", "nothing will ship" | – | Yes (shipping vs delivery) |
| Size system | "Size system" | – | "Size system" not "Shop in" | OK |
| Combinations view | none (Closet is app-only) | "Closet" | Closet = ex "Total Fits" | Gap |

---

## 6. Voice as it exists

- **Person**: second person to the shopper ("your change room", "Your sizes … stay saved"), "we" for the shop ("we’ll dress you in your outfit", "We deliver anywhere in the **EU**.", "We use it to fit the outfits to you.").
- **Formality**: friendly, plain, contractions (we’ll, you’re, Here’s, That’s, isn’t, didn’t). Occasional playfulness ("Dressing you…", "Undone!").
- **Length**: titles 1–3 words; helper lines one sentence, mostly under 12 words; the longest are the empty states and Return/Size-guide instructions (15–18 words).
- **Capitalisation**: titles and labels sentence case ("Make it fit", "Delivery address", "Size guide", "Top size"). Figma buttons typed in sentence case with an UPPER text case ("Checkout", "Skip for now"); toast chips and nav tabs typed in sentence case with an UPPER transform; event banners typed in sentence case with no transform. App types buttons in sentence case and uppercases with CSS.
- **Punctuation**: full stops on helper sentences, none on titles, labels or toasts (except "Undone!"); "·" middle dot as separator (Free delivery · arrives Thursday; Organic cotton · Casual, Working out; Delivered · 12 Oct; 84.00 EUR · paid 10 Oct); "…" single-character ellipsis; curly apostrophes and quotes in Figma copy (we’ll, “tee”) (That’s included); only the app's "We couldn't read that photo" is straight; question-mark titles ("Sign out?", "Looks good?", "Forgot password?"); "•••• 4242" for cards; "×" in the app's Closet maths; " + " joins outfit names.
- **Numbers and dates**: prices "42.00 EUR" (two decimals, space, ISO code after); refunds "39.00 EUR refund"; British day-month "12 Oct", weekday "Mon 12:40" (24-hour); "2 hours ago", "3 days ago"; "86 cm"; "4-digit code"; order ids "#BL-20481", "RT-58213".
- **Spelling**: British (colours, labelled, Colour-Block, Postcode, Trousers, centred in notes). No American spellings found in user-facing copy.

Best examples:
1. "Choose a full-body photo or take one, and we’ll dress you in your outfit." (Try-On · photo)
2. "If there’s an account for that email, we’ve sent a code." (Enter code)
3. "Your sizes and change room stay saved for next time." (Sign out?)
4. "Light or dark, whichever is easier on your eyes." (Options)
5. "Free delivery · arrives Thursday" (Checkout)
6. "Nothing for “wedding” yet" / "Try another word, or start from one of the events below." (Search · wedding)
7. "Outfits appear here as soon as your change room has at least one top and one bottom. Every new piece multiplies what you can wear." (app Closet)
8. "Removed Black Drawstring Shorts" + UNDO (toast)

---

## 7. Copy issues

1. **Bag vs cart.** The bag is the change room, but the buy button says "Add to cart"/"ADD TO CART" and the app's checkout is "Your cart". The button actually checks out everything (NEXT-SESSION 33). Figma's checkout page says "Checkout". Suggest one verb for the buy step (for example "Checkout · 200.00 EUR" or "Buy all") and keep "change room" as the only name for the bag. — fixed in Figma 2026-11-01 ("Checkout" + total); the app is still open.
2. **App ↔ Figma naming splits**: Settings vs Options; "Dominant hand · Left-handed/Right-handed" vs "Controls on · Left/Right"; "Rotate" vs "Tap to turn around"; Try-On button labels; "Shipping" vs "delivery"; event names (Work/Beach/Evening/Business casual vs Office hours/Beach day/Night out/Day off/Working out).
3. **Jargon "carousel"** in the most-seen empty states: "Your top carousel is empty" / "Your bottom carousel is empty" (Figma, 49 copies each). The app already says "No tops yet" + "Add some from Events". Also "Tap + to pick … then try them on together" says "pick" where everything else says "add". — fixed in Figma 2026-11-01: "No tops yet" / "Tap + to add **tops** from an event."
4. **Inconsistent capitalisation on event banners**: TITLE transform on 6 of 8 renders "Office Hours", "Day Off", "Night Out", but "Working out", "Beach day" stay sentence case; source text is mixed ("casual", "Office hours"); the app shows them all in CAPS; tags and search say "Office hours". — fixed in Figma 2026-11-01: all 8 in sentence case.
5. **Toast wording differs** between the app and Figma, and within the app: ProductCard removal says "Removed from change room" (no name), the change room says "Removed {name}"; the app's Added toast has View but no Undo; the app has no "Undone!" or "That's your only top/bottom". "That's" uses a straight apostrophe (the rest of Figma uses curly ones). — fixed in Figma 2026-11-01 (now "That’s").
6. **Truncation**: toasts are 1 line with an ellipsis. Beside the camera they're 322 wide, minus the Undo chip, which leaves roughly 220–230 px at 14px. "Removed Cropped Suede Trucker Jacket" (36 chars) and "Removed Indigo Denim Cargo Trousers" probably get cut off (estimate; check by playing it). The nav-switch labels also truncate at 1 line. Known: product-name boxes are fixed 23 tall on Events, so long names crowd them. In the app, card names clamp to 2 lines and banner titles never wrap. — fixed in Figma 2026-11-01: "Removed …" now wraps to 2 lines.
7. **The capsule promise is worded 5 ways**: "Every piece goes with every other piece." (Welcome), "Every piece in an occasion goes with every other piece." (app), "6 pieces. Every top goes with every bottom." (event pages), "6 pieces that all go together." (notification), meta "every piece goes with every other piece". Pick one canonical line. — fixed in Figma 2026-11-01: one line, "Every top goes with every bottom.", on Welcome, event pages and a notification; the app still differs.
8. **Missing and weak states**: Figma has no error copy for wrong password, wrong code, failed payment, failed Try-On, an empty My orders or empty Notifications, and the Checkout empty state has no message. — fixed in Figma 2026-11-01: Figma now has wrong password, wrong or expired code, card declined, payment failed, empty My orders and empty Notifications; Checkout with an empty change room shows the toast "Add pieces to check out"; Try-On parts to check after the photo work. App: the Try-On error can show raw server text ("Try-on failed (500)", services/tryOn.ts:39 → TryOnSheet.tsx:45); "Empty change room" has no confirm or undo; the Try-On button is disabled with no reason; removing from the cart sheet gives no toast or undo. Time expectations conflict: "This takes a few seconds." vs "this can take up to a minute."
9. **Accessibility copy**: BottomBar.tsx:26 aria-label `${n} pieces` reads "1 pieces"; aria-roledescription "carousel" is read aloud (SlotCarousel.tsx:85); alt text and aria-labels drop the brand ("Black Overshirt, front view"); "Nothing to remove" labels a disabled button. In Figma, every icon-only control (+ ×111, back ×54, ✕, camera/Try-On, rotate, options gear, gender pictures with no words) has no written label, so the app needs names for them. Gender is pictures only, with no text or "prefer not to say".
10. **Placeholder and leftover text**: the toast variable's default "Removed Black Drawstring Shorts"; the button component's default "EVENTS"; a single-space " " label on cta instances (7); "Your name" as both a label and a value; profile/fit = "Regular" is still a variable after Fit was removed; Bulgarian addresses ("ul. Shipka 34, 1504 Sofia") in an EU/EUR shop (fine, but say so); "Mon 12:40" etc. are hard-coded demo dates.
11. Minor: "Forgot password?" link vs "Forgot password" title; "Stand back so your whole body fits the outline" and the app's Try-On tips have no full stop while other helper lines do; "2 h ago" vs "3 days ago"; "#BL-20481 arrives Thursday." vs "arriving Thursday" vs "Arrives Thursday" (was "Expected Thursday" until 2026-11-01) ("2 h ago" and "arriving/Expected" fixed in Figma 2026-11-01; "Arrives Thursday" (was "Expected Thursday" until 2026-11-01) still on Track order); "Make it fit" is still a title after Fit was removed; "Try-On" vs "try-on" vs "Try it on".
12. The currency picker changes only the code: "42.00 USD" would show a EUR amount under a USD code. Typed "89.00 EUR" strings on Checkout, Search and the product page won't change at all. Known and accepted (notes line 45), but a writer should know.

---

## 8. What an edit touches (Figma)

| Kind of text | Examples | How to change it | Blast radius |
|---|---|---|---|
| Plain layer on a screen | All account, checkout, orders, search, notifications, Options, Try-On copy | Edit the text layer | That layer only. Some lines repeat on sibling screens as separate copies (e.g. "Size system" ×3, "6 pieces. Every top goes with every bottom." ×9 (8 event pages + Notifications), prices ×23) |
| Header title and subtitle | 84 instances of header 1596:6941 (named "header · <page>") | Edit the text on the screen's header instance; the "subtitle" property shows or hides the subtitle | That screen only. Try-On · generating's title and Try-On · result's subtitle follow STRING variables, so change the screen links that set them, not the layer. |
| TEXT component property | cta `label` (sentence case + UPPER: Sign in, Pay, Done, default "Checkout"); button `label` (default "Events"; also Search, Turn around, Menu, Try it on); text-field `value` (Email, Password, Your name, field placeholders) | Select the instance → right panel property | That instance; changing the default in the main component affects only instances that weren't overridden |
| Typed in main components, one per variant | toast (Added to change room ×6 variants, View ×6, Undo ×12, Undone! ×4, Add more ×4); nav-switch Events ×2 / Change room ×2 (2 variants); toast (18 variants); pickers; product-page (21 variants each typing "Tap to turn around", "Wear it with", "Size", "Size guide") | Edit in every variant of the component set (Screens page section 497:9233 or 615:2343; pickers on Components) | All instances, but every variant has its own copy: miss one and the state flickers between wordings |
| Empty-state copy | "No tops yet" / "Tap + to add **tops** from an event.", "No bottoms yet" / "Tap + to add **bottoms** from an event.", "Your change room is empty" / "Tap + to add **pieces** from an event, then mix them here." | 25 typed copies each for tops and bottoms (cr-garment · top/bottom {none} + 24 across the 8 change-room-stage variants), 24 for "Your change room is empty"; carousels and screens use instances | Must be edited in every typed copy; not linked |
| Bound to a STRING variable | "EUR" (properties/currency), badge count, cart total, chip prices, address/payment/return labels, toast message | The visible value comes from the variable, and **prototype reactions write the real values** | Editing the layer does nothing at runtime. Change the reactions: "Removed <name>" is written by 238 reactions (+1 "Change room emptied") on card +/✓ and ✕ buttons (21 strings); "That’s your only top/bottom" by 4 carousel reactions, "Add pieces to check out" by 12; address/payment/return text by the picker and Return reactions |
| Text-case transforms | UPPER: nav tabs, toast chips (View, Undo, Add more), button labels (Events, Search, Turn around, Menu, Try it on), cta and cart-label; TITLE: none | What you type isn't what renders; casing changes go in the text-case setting | – |
| Typed caps | none left on Screens (cta, cart-label and add-to-room are typed sentence case + UPPER) | – | – |
| Product data | Product names/prices on cards are typed separately in each card (3–12 copies per product); product-page variants per product | Edit every copy (no variables) | High |

Coded app: every string is in code (JSX or src/data). Occasion titles in src/data/occasions.ts; product names and materials in src/data/products.ts; toast text in ProductCard.tsx:14/17 and SlotControl.tsx:73; casing comes from CSS (base.css:69 etc.), so type sentence case.

---

## To check after the photo work (2026-11-01)

- Try-On · photo 499:9246, preview 499:9289, generating 499:9332 (wait line probably now "This can take up to a minute."), result 499:9383, model like me 1285:10136 (headers checked 2026-11-02)
- New error screens: photo not usable 1229:76, generation failed 1229:112 (headers checked 2026-11-02)
- Gender picker, and the Gender helper on Options and Make it fit
- Build picker 1345:330
- Try-on outfit fit 1438:481
- The Try-On variables
- Toasts "No bottom yet, so just the top" / "No top yet, so just the bottom"
