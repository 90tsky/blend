# blend

A capsule wardrobe shop: every piece in an occasion goes with every other piece. Add pieces from **Events**, then mix them in the **Change Room** before you buy.

## Run it

```bash
npm install      # first time only
npm run dev      # opens on http://localhost:5173 (and on your phone via the Network URL it prints, same Wi-Fi)
```

## Where things live

| What | File |
|---|---|
| Product names, brands, prices | `src/data/products.ts` |
| Occasions (which pieces, banner, title font) | `src/data/occasions.ts` |
| Colours, fonts, shadows (design tokens) | `src/styles/tokens.css` |
| Events tab | `src/screens/EventsScreen.tsx` |
| Change room | `src/screens/ChangeRoomScreen.tsx` |
| Closet, Settings, Try-On, Checkout | `src/screens/*Sheet.tsx` |

## Updating images from Figma

Garment photos, occasion banners and the logo are exported from the Figma file:

```bash
npm run figma:export
```

Needs a Figma personal access token (read-only) saved in `.figma-token`.

## Not done yet

- Virtual try-on needs a backend at `/api/try-on` and an AI provider (the screen shows "Coming soon" until then).
- Checkout is a demo: no payment is taken.
