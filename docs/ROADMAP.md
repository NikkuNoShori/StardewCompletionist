# Roadmap / Future Features

Planned or discussed work that is not yet built. Move items into the CHANGELOG
as they ship.

## Perfection tracker (dashboard)
A read-only rollup page that aggregates existing per-tracker progress into a single
"% to Perfection" view, mirroring the in-game Perfection Tracker. It should read the
existing store maps (no duplicate checkboxes) and link out to each detail page.

Perfection lines and their current status:
- Shipped, Monster Slayer, Stardrops, Cooking, Crafting, Fish, Golden Walnuts — already tracked.
- **Skill levels (Farmer Level)** — now tracked via the Skills tab (`skillLevels`).
- **Obelisks + Golden Clock** — not yet tracked (see below).
- **Great Friends (max hearts)** — only approximated by the Villagers gifting page; no heart-level tracking yet.

## Wizard Obelisks + Golden Clock
No tracking exists for the four Wizard-purchased obelisks (Water, Earth, Desert, Island)
or the Golden Clock. These are the remaining untracked Perfection lines. Likely a small
`buildings` data set surfaced on the Perfection dashboard.

## Import from Save File
Let players upload their Stardew Valley save file to auto-fill trackers.

- The app is a browser web app, so it **cannot** read the save from disk automatically —
  it requires a manual file picker (`<input type="file">`) and client-side XML parsing (`DOMParser`).
- A save contains skill levels, professions (as numeric IDs), cooking/crafting recipes,
  shipped items, museum donations, golden walnuts found, friendship hearts, stardrops,
  monster kills, etc. — so a single import could populate much of the app.
- Caveats: practical on PC only (console/mobile players can't easily export a save);
  save schema drifts between game versions (1.5 → 1.6), so the parser needs maintenance.
  Manual entry must remain as a fallback.

## Great Friends — heart levels
Optional: track per-villager heart levels (max = 10/8 hearts) so the "Great Friends"
Perfection line can be computed accurately, rather than approximated by the gifting page.
