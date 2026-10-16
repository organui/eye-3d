# Anatomy-tree registry integration

The anatomy panel uses the OrganUI registry item `anatomy-tree`, installed with the shadcn CLI. The installed source is tracked in version control; runtime and ordinary setup never contact a registry.

## Exact installation

Installed on 2026-10-16:

```sh
REGISTRY_URL=http://127.0.0.1:4413 bunx shadcn@4.21.0 add http://127.0.0.1:4413/anatomy-tree.json -y -o
```

The build sandbox's network policy blocked `organui.com` and `ui.shadcn.com`. The item was served from a local static server holding the registry built (`bun run build` in `packages/registry`) from OrganUI `master` at commit **42dc34f** (organui PR #12 merged), plus shadcn's `colors/neutral.json` fetched from the shadcn GitHub repository. With network access, the equivalent public command is `bunx shadcn@4.21.0 add https://organui.com/r/anatomy-tree.json -y -o`.

| Artifact                                     | SHA-256                                                            |
| -------------------------------------------- | ------------------------------------------------------------------ |
| Served `anatomy-tree.json`                   | `719c1547afb1453e809ee1b2fca0dc99858083aa3ff712477a493c77e8f5f389` |
| Tracked `src/components/ui/anatomy-tree.tsx` | `3d5554cdc179f1ad778fd6321cc1414c293c4cca0535efd9aab679c686893538` |

Both match the `heart-3d` install exactly. The item declares `@base-ui/react@^1.8.0`; the CLI wrote `^1.8.0` to `package.json` and it was restored to the exact `1.8.0` pin used across the explorers. The CLI removed the `"use client"` directive for this non-RSC Vite target (`components.json` sets `"rsc": false`); nothing else differs from the published source. The file is listed in `.prettierignore` and must not be hand-edited.

## API used

- `data`: four group rows (`selectable: false`), each with its structure leaves (`color` set to the structure's mesh colour);
- `selectedId` / `onSelectionChange`: the app's single controlled selection;
- `visibility` / `onVisibilityChange`: a map keyed by leaf IDs, where a missing entry means visible;
- `defaultExpandedIds`: all four groups;
- `label="Eye anatomy"` and `className="registry-tree"`.

## Application adapter

Scene-specific logic lives in `src/anatomy-adapter.ts`, built from `structures` and `groups` in `src/anatomy.ts`:

| Tree ID                     | Scene leaves (GLB `structureId`)                                                                                                         |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `group-wall-of-the-eyeball` | `cornea`, `sclera`, `choroid`, `retina`, `iris`                                                                                          |
| `group-inside-the-eyeball`  | `anterior-chamber`, `lens`, `suspensory-ligament`, `vitreous-body`                                                                       |
| `group-eye-muscles`         | `superior-rectus`, `inferior-rectus`, `medial-rectus`, `lateral-rectus`, `superior-oblique`, `inferior-oblique`, `levator-palpebrae`     |
| `group-nerve-and-eyelid`    | `optic-nerve`, `trochlea`, `lacrimal-gland`, `upper-tarsal-plate`, `lower-tarsal-plate`                                                  |

Groups are interface groupings and do not claim anatomical containment. Every leaf ID is exactly one application structure ID and one GLB node. `assertAnatomyMapping` runs at import and throws on missing, unknown, or duplicate leaves; `src/anatomy-adapter.test.ts` covers the adapter with `bun test`.

## Decisions

- **Group rows do not select.** The renderer's emphasis, the details card, and the selection chip all describe exactly one structure, so multi-structure selection would not fit cleanly. Group rows are `selectable: false`: clicking the label or pressing Enter expands or collapses them, they carry no `aria-selected`, and the selection is unchanged. They still toggle the visibility of all their structures (showing `Mixed` when partly hidden). `onSelectionChange` keeps only a one-line guard that ignores IDs that are not structures.
- **Colour swatches**: each structure row shows the component's swatch in the structure's mesh colour, restoring the colour dots of the hand-built list.
- **Visibility** stays the app's `hidden` set. Tree changes, the detail-card Hide/Show, Isolate, Restore all, the guided tour, and Reset all write that one set.
- **Reset** increments the tree's React `key`, remounting it to clear its internal search and expansion along with selection, visibility, tour, and camera.
- **Search** matches row labels only (the component's behaviour). The old list also matched source names and FMA identifiers; FMA IDs remain visible in the details card. Search is no longer cleared on 3D selection or tour steps, because the component does not expose its query; Reset clears it.
- **Hidden structures are not pickable.** `src/picking.ts` already ignores intersections with invisible meshes or their descendants, so hidden foreground anatomy neither selects itself nor blocks visible surfaces behind it. Hidden structures remain selectable through the tree.
- **Reveal**: the app's own scroll-into-view effect for selection changes was removed in favour of the component's reveal. One narrow effect remains: when the panel opens, the app scrolls an already-selected row into the tree's own scroll area. A selection made while the panel is closed happens while the tree is `display: none`, so the component's reveal has nothing to scroll then and does not run again on open. This effect only adjusts the tree's `scrollTop` and never moves the page.
- Shared explorer behaviour, as in `heart-3d`: the selected structure glows in its colour at 0.35 emissive with others ghosted; clicking a structure does not change the view label to "Custom view"; the panel is closed by default and opened from the header; focus moves into the panel and returns to the toggle on Escape/close; the chip name opens the panel; the toolbar order is view menu, zoom in, zoom out, reset. `src/framing.ts` is byte-identical to `heart-3d`'s.

## Theme setup

`src/styles.css` is `heart-3d`'s: Tailwind CSS 4 with shadcn tokens mapped to the explorers' warm neutral palette, global resets in `@layer base` after preflight, and unlayered `.registry-tree` rules that fit the component into the panel.

## Friction and observations

No registry defect blocked the integration and the component was not modified. Resolved by organui PR #12: group rows no longer need app-side handling of group selection callbacks (`selectable: false`), colour dots are available again (`color`), and remount/scroll workarounds for revealing a selection are no longer needed (built-in reveal).

1. The CLI loosened the exact dependency pin to `^1.8.0`; consumers with exact pins need to restore them.
2. Search and expansion are internal. Clearing them needs a remount (Reset does this). A selection hidden by an active search query is not revealed, because reveal only expands ancestors.
3. The search box has no placeholder or icon prop, so the visible label and the CSS search glyph carry that role.
4. Resolved upstream in organui PR #12 commit b8e6451: the built-in reveal now scrolls only the tree's own scrolling container, so a 3D pick on a phone no longer jumps the page down to the tree. On phones the panel sits below the model, so the revealed row is in view once the user scrolls to the panel.
5. Reveal runs only when `selectedId` changes, so a selection made while the tree is hidden is not scrolled into view when it is shown again (see Reveal above).

Screen-reader testing of the tree was not done.
