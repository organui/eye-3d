# Model provenance, preparation, and review

## Source and license

The runtime model is a curated subset of **BodyParts3D / Anatomography 4.3** (object set 4.3, ontology tree FMA3.0): 23 original OBJ element files of the **right eye and orbit**, retrieved on **2026-10-16**. Every selected OBJ header reports compatibility version 4.3.

The original project states that users may copy, modify, and disseminate both contour data and rendered images under **[CC BY-SA 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en)** ([legal code](https://creativecommons.org/licenses/by-sa/2.1/jp/legalcode)). See the [original license notice](https://lifesciencedb.jp/bp3d/info/index.html#License); an inert [snapshot](model-source/original-license.html.txt) is preserved. That license governs `public/models/eye.glb`, the manifest's model data, and screenshots of the model, separately from the MIT application code.

Required credit: **BodyParts3D / Anatomography, © The Database Center for Life Science (DBCLS).** Adapted by OrganUI as described below. No endorsement by DBCLS or the mirror author is implied. The same notice ships with the app in [`public/models/LICENSE.txt`](../public/models/LICENSE.txt) and appears in its "About this model" dialog.

**Why not CC BY 4.0?** The [LSDB archive license](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html) (updated 2025-02-27, [snapshot](model-source/archive-license.html.txt)) grants CC BY 4.0 for the archive's **4.0** release, which `heart-3d` uses. These assets are **4.3** files from the original service's data set, so this repository follows the original share-alike notice, as `lungs-3d` and `pancreas-3d` do. We do not extend the archive's 4.0 grant to 4.3 assets.

## Retrieval and exact pinning

This build environment could not reach `dbarchive.biosciencedbc.jp` or `lifesciencedb.jp`. The geometry was therefore taken from the public [olivercase/body_parts_3d_api](https://github.com/olivercase/body_parts_3d_api) mirror, pinned at commit `fd527e6f4daf732fd814314d9257df5877b844bc`, the same mirror and commit `lungs-3d` uses.

- **Every OBJ is verified against the SHA-256 in its pinned Git LFS pointer** before conversion. [model-inputs.json](../scripts/model-inputs.json) records each download URL, byte length, SHA-256, LFS pointer URL, and mirror path.
- Each file's embedded `File ID`, `Concept ID`, and `Compatibility version : 4.3` headers must match the expected element and concept.
- Each element must be listed for its concept in the official version-stamped 4.3 concept-to-element table, [FMA2Obj-4.3.tsv](model-source/FMA2Obj-4.3.tsv) (SHA-256 `c3d16c891016da13447de2fc3241d05d92e8f9dc460e363233c03f420b935d4f`, byte-identical to the copy preserved in `lungs-3d`, originally from `https://lifesciencedb.jp/bp3d/get-info.cgi?version=4.3&cmd=concept-objfiles-list`).
- Every element has exactly one runtime owner; unused or missing inputs fail the build.

The runtime [manifest](../public/models/manifest.json) adds per-element source names, mirror paths, counts, dropped faces, raw bounds, the transform, and the output checksum. Runtime setup never contacts the mirror.

## Selection

| Group | Structure | Concept(s) | Element(s) |
| --- | --- | --- | --- |
| Wall of the eyeball | Cornea | FMA58239 | FJ1340 |
| | Sclera | FMA58271 | FJ1368 |
| | Choroid | FMA58299 | FJ1336, FJ1337 |
| | Retina (optic part) | FMA58607 | FJ1367 |
| | Iris | FMA58236 | FJ1348 |
| Inside the eyeball | Anterior chamber | FMA58081 | FJ1332 |
| | Lens | FMA58242 | FJ1356 |
| | Suspensory ligament of lens | FMA58839 | FJ1371 |
| | Vitreous body | FMA58828 | FJ1382 |
| Eye muscles | Superior, inferior, medial, lateral rectus | FMA49044, FMA49046, FMA49056, FMA49054 | FJ1374, FJ1346, FJ1359, FJ1355 |
| | Superior and inferior oblique | FMA49052, FMA49050 | FJ1373, FJ1345 |
| | Levator palpebrae superioris, with its tendon | FMA49048 + FMA54159 | FJ1357 + FJ1343 |
| Nerve and eyelid | Optic nerve | FMA50875 | FJ7501 |
| | Trochlea of superior oblique | FMA49067 | FJ1380 |
| | Lacrimal gland | FMA59102 | FJ1350 |
| | Upper and lower tarsal plates | FMA59091, FMA59089 | FJ1375, FJ1379 |

The exact rows are in [selected-mappings.tsv](model-source/selected-mappings.tsv). Groups are interface groupings, not anatomical containment claims (the iris is part of the uvea, not the eyeball's outer wall, but sits with the wall layers in the panel).

Decisions and limitations:

- **One eye.** Only the right eye is included, matching how the heart explorer shows one organ. The mirror also has the left eye.
- **Detached fragments removed.** Four source files (cornea, sclera, choroid FJ1337, suspensory ligament) each carry a tiny disconnected fragment lying at the left eye's position, roughly 50–75 mm away. Faces whose vertices all lie at source x > 0 mm (the patient's left of the midline) are dropped: **36 faces in total**, counted per element in the manifest. Nothing else is removed.
- **Choroid** is two source pieces of one concept and is selected as one structure.
- **Levator palpebrae superioris** merges the muscle and its separately mapped tendon.
- **Omitted:** the ciliary body, posterior chamber, orbital bones and fat, conjunctiva, eyelid skin and muscle, tear drainage ducts, ciliary nerves and ganglion, vessels, the optic chiasm, and the left eye. Check ligaments are omitted.
- Clear media (cornea, lens, vitreous, anterior chamber) are tinted so they can be seen. Colors are illustrative.
- The source represents one adult reference model. Its release notes warn that concepts and geometry can contain errors.

## Preparation

```sh
bun install --frozen-lockfile
bun run prepare:model
bun run verify:model
```

The script downloads pinned inputs only when `.asset-cache/objs/` lacks them, verifies hashes, headers, and the official mapping, then:

1. Parses OBJ vertices and faces and triangulates polygons with a fan, keeping source topology.
2. Drops the detached fragments described above.
3. Centers the selection on its bounding box, maps `(x, y, z)` to `(x, z, −y)` (Z-up to Y-up; anterior faces +Z), and scales millimetres by `0.1`. This is an arbitrary display scale, not a calibration.
4. Recomputes vertex normals and assigns illustrative colors. No sculpting, decimation, or invented geometry.
5. Merges elements within each structure into one indexed mesh, storing the structure ID and FMA ID on each GLB node.
6. Writes the GLB (about 3.9 MB, 155,152 triangles) and the manifest.

`bun run verify:model` independently decodes the GLB, checks its checksum, every structure/FMA pair, finite geometry, and valid indices.

## Anatomy text and review

Descriptions are original, deliberately general summaries. The in-app reference link points to the US National Eye Institute's guide to [how the eyes work](https://www.nei.nih.gov/learn-about-eye-health/healthy-vision/how-eyes-work); that page could not be fetched from the build environment, so the text was **not** re-checked against it on this date.

Completed: source identifier and header checks, mesh inspection, and interface verification in desktop and mobile Chromium viewports. **Not completed: review by a clinical anatomy expert or any clinical validation.** The app, README, and model dialog disclose this. This is an educational interface demonstration, not a diagnostic tool or a simulation of vision.
