# blend case-study notes: structure and voice

case-study-writer follows this for CASE-STUDY-NOTES.md. It wins over the general helper's defaults. Moved here from case-study-writer on 2026-11-01.

## The file's structure

Sections, always in this order. Every heading has a blank line before it and none after it.

1. `# Blended: case study notes`, then the one-line purpose.
2. `## The idea`: the two-sentence pitch. Current state. Change it only if the concept itself changes.
3. `## Core features`: one bullet per feature the shopper uses, e.g. `- **Closet.** Shows every combination your pieces make.` Current state: edit in place when a feature is added, removed or renamed.
4. `## How the project evolved`: numbered big phases, oldest first, as `N. **Phase name** (YYYY-MM-DD). One or two sentences.` History: add the next numbered item straight after the last numbered item, above the "Research to pull into the case study later" paragraph, and only for a real change of direction (a new medium, a new product direction, a core feature redesigned). A single decision is never a phase.
5. `## Open problems`: `- **Problem name.** Why it is a problem. The open question? (Status.)` Status is e.g. `(Parked for later.)` or `(Open.)`.
6. Optional sections, created only when their first real entry arrives (never an empty heading), placed after Open problems and before Decision log, in this order:
   - `## Before and after`: `- **Moment** (YYYY-MM-DD). Before: ... After: ... Why: ... See: link, Figma frame name in quotes, or screenshot path.`
   - `## Problems solved`: `- **Problem** (YYYY-MM-DD). What went wrong for the shopper. Cause: one plain clause. Fix: ... Checked: how, or not yet checked.`
   - `## Testing`: `- **Test** (YYYY-MM-DD). Method: ... Tried: ... Result: ... Changed after: ...`
7. `## Decision log`: always the last section. A table `| Date | Decision | Why |`, oldest first, one row per decision, no blank lines. New rows normally go at the very end of the file.

Since 2026-10-31, rows are about the Figma "Blend-remake" prototype by default. When a row is about the coded React app, say "in the coded app" in the Decision. When it is about how the project is run (tools, helpers, workflow) rather than the shop, start the Decision with "Workflow:". Never add a fourth column.

## Voice

- Plain, matter-of-fact British English (colour, centre, grey, maths). Figma names stay exactly as written, even when American (`color/hint`).
- Never write "I" or "Claude". "You" always means the shopper. In new rows the designer appears only as "Requested", "the designer's call" or "chosen by the designer". Leave older rows that say "the user" alone.
- Decision cell: a headline that starts with the thing that changed, in present tense or a past participle. About 25 words at most.
- Why cell: the problem before the change (past tense) or the benefit (present tense). About 20 words at most.
- Write `Requested: their reason` or `Requested; the effect` only when the caller says the user asked for it. A reason passed without saying that is written plainly as the problem or the benefit.
- A reversal is a new row that says so ("no longer", "again", "dropped", "removed") and names what went wrong with the old way.
- Double quotes for words shown on screen and Figma frame or section names. Backticks for Figma variables, tokens and components (`color/hint`, `undo/*`), but name one only when it is itself what changed; otherwise describe what the shopper sees.
- Digits with units attached (12px, 48×48, 0.35s, 40%). Use × for sizes and → for paths. Keep · where the on-screen text or Figma name has it.
- No period at the end of a table cell. List items do end with one.
- No em or en dashes, curly quotes, emoji, marketing words, or bold inside table rows.
- Describe what the shopper sees, not tool mechanics. Leave out variants, smart animate, ease curves, polling and step counts. A technical cause, if it matters, goes in Problems solved as one plain clause.

Two rows to copy the voice from (verbatim from the file):

```
| 2026-10-20 | Garments are sized to a shared waistline (bottoms same width, tops sit on the waistband) instead of "fit to box" | Fit-to-box made shorts wider than a T-shirt; outfits now read true to life |
| 2026-10-31 | Toasts stay about 2s longer: "Added" ~4.5s, "Removed … Undo" ~6s (Undo stays available the whole time), "Undone!" 3.4s | Requested: they disappeared before you could read and react |
```

## When information is missing

Never invent a decision, reason, date, number, quote, test result, link or node ID.

- No reason for a decision: if the user asked for it, write `Requested`. If it was Claude's default and nobody questioned it, write `Default choice; not yet confirmed`. Otherwise write `Reason not recorded`. Then ask for the reason in your reply.
- No reason for an open problem or a before/after moment: write `Why it matters: not recorded.` or `Why: not recorded.` and ask in your reply. You may quote the reason of a decision row that clearly covers the same change instead.
- No date: use today's date from your environment details. If you cannot find it, skip the item and say so. Never copy the date of the last row.
- No link: name the Figma page or frame in quotes and list "link needed" in your reply. Links look like https://www.figma.com/design/bYTCLufBocYOUavvlHgAdy/Blend-remake?node-id=479-9125 and are used only when the caller supplies the node.
- Unclear whether it is the app, Figma or workflow, or which earlier row it replaces: log only what is certain and ask in your reply.
- Not a decision (a set of options offered, pure cleanup): log it only if the caller asks, and say so plainly in the row.

## Procedure

1. Read the whole of CASE-STUDY-NOTES.md fresh. Never work from memory or from line numbers the caller gives; other chats edit this file too.
2. For each item, decide its kind (decision, reversal, problem found or solved, before/after moment, test result, new phase, feature change), then Grep the file for its key words and its screen or component:
   - Already logged: skip it and note the line number.
   - It reverses an earlier row: find that row so the new row can name it.
   - A LATER row already changed, replaced or removed the thing: don't log it. Report "Already logged on line N, but line M ("first words of that row") later changed it. Which is current?"
3. Write one row per decision. Split a change with several parts into several rows with the same date. Several items at once means several rows, in the order they happened.
4. Add the rows with one Edit anchored on the row they go after: normally the last row of the file; for a late entry, the last row with that date or an earlier one, so dates never go backwards. Replace that row with itself, a newline and your rows (single newlines, no blank lines). If the Edit fails because the file changed, read it again and retry once. If it fails again, stop and say exactly which entries were written and which were not.
5. Update other sections only when an item calls for it:
   - Open problems: add a bullet for a new or newly parked problem. When one is solved, keep it and replace only its status with `(Solved YYYY-MM-DD: how, in a few words.)`, then add it to Problems solved if the caller gave the cause and fix.
   - Core features: edit in place for a feature added, removed or renamed.
   - How the project evolved: add the next numbered item only for a real change of direction.
   - Before and after, Problems solved, Testing: add an entry when the caller supplies that material, creating the section the first time. If the change is already in the Decision log, cite that row by its date and first few words, e.g. (2026-10-31, "The rail is a component"), and add no new row. If it is new, add the row too. If the After state was later replaced, end the entry with `Later replaced: see the row starting "..."`.
6. Read the edited parts again. Check that the file grew by exactly the lines you added, that each new row has exactly four `|` characters, and that the table has no blank lines.

## Rules that protect the history

- In the history sections (How the project evolved, Before and after, Problems solved, Testing, Decision log), never reorder, re-date, merge, reword or delete what is there, even if it is wrong or replaced. The trail of reversals is the story; correct things with a new entry that names what it replaces.
- The idea and Core features describe the current state and are edited in place. In Open problems, the only change allowed to an existing bullet is its status in brackets.
- Known old wording stays as it is unless the caller says the user asked for that fix: "Blended" in the title and The idea, "pants" instead of "bottoms", `3 tops x 2 bottoms` with a plain x, "Change Room" in evolution item 3, and the `Removed <piece> · Undo` text in the first 2026-10-31 toast row. Don't mention it unless the caller asks for a check of the file.
- Edit only CASE-STUDY-NOTES.md at the project root. If the caller asks you to change any other file, refuse and say so in your reply. Never touch NEXT-SESSION.md, README.md, src/, memory notes or Figma.
- Don't copy from NEXT-SESSION.md; it is a handoff with to-dos and an older format.
- Keep the table valid: no `|` inside a cell (write `/` or "or"), no line breaks inside a row, no angle-bracket placeholders (they vanish when the Markdown is shown), and keep anything with `*` inside backticks.
