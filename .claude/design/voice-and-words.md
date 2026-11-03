# blend voice and words

ux-writer follows this; the other helpers use the glossary words. Moved here from ux-writer on 2026-11-01. When CASE-STUDY-NOTES.md has a later dated decision, the notes win; update this file to match.

## blend's voice
- Friendly and direct, like a helpful shop assistant who doesn't oversell. "You" is the shopper, "we" is the shop. Use contractions.
- Short: titles usually 1 to 4 words, helper lines one short sentence. Say what happens next, not how the system works.
- Sentence case for new copy. Before writing into a Figma layer, check its text case: if the layer's setting makes it upper case, type sentence case; if it is typed in capitals with the setting on "as typed" (most buttons, like "ADD TO CART"), keep typing capitals so the look doesn't change. In Audit, report typed capitals once, as one row, not per button.
- Full stops on helper sentences only. None on titles, labels, buttons or toasts. Exclamation marks almost never ("Undone!" is the exception).
- British spelling (colour, centre, trousers). Prices like "42.00 EUR". Dates like "12 Oct", times like "Mon 12:40", sizes like "86 cm".
- Typography: curly apostrophes and quotes (’ “ ”), the single ellipsis character (…), and "·" to join two short parts ("Free delivery · arrives Thursday").
- No jargon the shopper wouldn't say (carousel, variant, component, toggle, SKU) in visible text. Accessibility names follow the standard patterns; "carousel" as a screen-reader role description is fine. No marketing fluff, no guilt about sustainability.
- Voice examples already in the Figma file, to match:
  - "Choose a full-body photo or take one, and we’ll dress you in your outfit."
  - "Your sizes and change room stay saved for next time."
  - "Light or dark, whichever is easier on your eyes."
  - "Nothing for “wedding” yet" / "Try another word, or start from one of the events below."

## Words we use (glossary)
| Concept | Use | Don't use | Notes |
|---|---|---|---|
| The product | blend (always lowercase) | Blended, Blend | |
| The bag | change room | bag, basket, wardrobe | The buy button reads "Checkout" + the total |
| One clothing item | piece | item, garment, product | "item" is fine in returns and order history. Events counts (search is a filter on Events since 2026-11-02): "5 events · 4 pieces", "1 event · 1 piece", never "results" (2026-11-02) |
| A chip that narrows Events (a typed word, Tops or Bottoms, or an event) | filter | tag, search result | The user's word ("make it an event filter", 2026-11-02). On screen only "Clear all" shows; spoken names say "filter" ("Bottoms, remove filter", "Casual, add filter", "Add a filter", "Clear all filters", "Search, 1 filter on"). "chip" is an internal word only |
| Two kinds | top, bottom | pants, shirt | Plural: tops, bottoms |
| A top + a bottom | outfit | fit, combination, look | |
| Groups to shop | event (the tab is Events) | collection | Figma copy uses event; the app lede and the notes say occasion, which is not a logged decision. "capsule" is not for UI labels; fine in the page description and the case study |
| Event names in Figma | Casual, Outdoors, Office hours, Day off, Maternity, Working out, Night out, Beach day | | Decided 2026-11-01 for Figma; the coded app still uses a different set (Casual, Outdoors, Work, Beach, Evening, Maternity, Business casual) and changes when the app is reworked |
| Putting a piece in | add | pick | "save" is fine for keeping settings, photos or addresses; just not for adding a piece |
| Taking it out | remove | delete | |
| Settings screen | Options | | The Figma name since 31 Oct; no logged rename yet. The app still says Settings, so propose it as an app change |
| Handedness | (none in Figma) | | Left-handed mode was removed from the prototype on 2026-11-01; it stays planned in the coded app, which says "Dominant hand" |
| Money | 42.00 EUR | €, Euro, BGN | |
| Every top × bottom | Closet | Total Fits | Coded app only |

**Already decided in CASE-STUDY-NOTES.md** (a change reverses a dated row, so say which): "Size system", not "Shop in"; the toasts "Added to change room · View" (with Undo), "Removed <piece> · Undo", "Undone!" and "That's your only top/bottom · Add more". The straight apostrophe in "That's" is typography, not wording: fixing it to ’ reverses nothing. The buy button reads "Checkout" + the total (2026-11-01). Order numbers read "Order #BL-…" in titles and notification lines (2026-11-02). Enter code says "If there’s an account for that email, we’ve sent a code." for every email; account screens never reveal which emails have an account (2026-11-02). Prices over 1,000 read "1,204.00 EUR" (comma for thousands).

**Decided 2026-11-01 (moved from the old "Undecided" list):**
- The promise line is "Every top goes with every bottom." (event-page subtitles, a notification). Welcome keeps its long line on purpose (the user: “Keep the long copy”), in the body style with British spelling; don’t flag it again.
- The rotate action is "Turn around"; Try-On is "Try it on" (button and screen title).
- Figma's 8 event names (above) with sentence-case banners (no title-case transform).
- event, not occasion; delivery, not shipping.
- The Try-On wait line: "This can take up to a minute."
- The "Make it fit" title stays.
- The gender photos have no captions; their spoken names are "Women’s" / "Men’s" (layer names / description, for the coded app).

**Undecided (don't pick one yourself; offer options and ask):** nothing open as of 2026-11-01. Grep CASE-STUDY-NOTES.md before treating anything as open; when the user settles a new question, move it into the glossary above.
