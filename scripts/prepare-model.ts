import { mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { Document, NodeIO } from '@gltf-transform/core'
import { BufferGeometry, Float32BufferAttribute, Color } from 'three'
import inputs from './model-inputs.json'
import { structures } from '../src/anatomy'

const sha = (data: Uint8Array) => createHash('sha256').update(data).digest('hex')
const MAPPING_SHA = 'c3d16c891016da13447de2fc3241d05d92e8f9dc460e363233c03f420b935d4f'
// The selection is the right eye, which lies at negative source x (+x is the
// patient's left). A few source files carry tiny detached fragments at the
// left eye's position; faces lying wholly at x > 0 are dropped, nothing else.
const MIDLINE_X = 0

await mkdir('.asset-cache/objs', { recursive: true })
await mkdir('public/models', { recursive: true })
for (const input of inputs.objects) {
  const file = Bun.file(`.asset-cache/objs/${input.file}`)
  if (!(await file.exists())) {
    console.log(`Downloading ${input.id}…`)
    const response = await fetch(input.url)
    if (!response.ok) throw new Error(`${input.id}: HTTP ${response.status}`)
    await Bun.write(file, response)
  }
  if (sha(new Uint8Array(await file.arrayBuffer())) !== input.sha256)
    throw new Error(
      `Checksum mismatch: ${input.id}. Refusing changed upstream data; review it before updating the pin.`,
    )
}

const texts = new Map<string, string>()
for (const input of inputs.objects)
  texts.set(input.id, await Bun.file(`.asset-cache/objs/${input.file}`).text())

const mapBytes = new Uint8Array(await Bun.file('docs/model-source/FMA2Obj-4.3.tsv').arrayBuffer())
if (sha(mapBytes) !== MAPPING_SHA) throw new Error('Official 4.3 concept mapping changed')
const mappings = new TextDecoder()
  .decode(mapBytes)
  .split(/\r?\n/)
  .filter((l) => l && !l.startsWith('#'))
  .map((l) => l.split('\t'))
const mapped = (fma: string) =>
  new Set(mappings.filter((r) => r[0] === fma).flatMap((r) => r[2].split('+')))

const doc = new Document()
doc.getRoot().getAsset().copyright =
  'BodyParts3D / Anatomography, © The Database Center for Life Science (DBCLS), CC BY-SA 2.1 Japan'
const scene = doc.createScene('OrganUI Eye — BodyParts3D 4.3')
const buffer = doc.createBuffer()
const used = new Set<string>()
const min = [Infinity, Infinity, Infinity],
  max = [-Infinity, -Infinity, -Infinity]
const prepared = structures.map((structure) => {
  const positions: number[] = [],
    indices: number[] = []
  const sources = structure.parts.flatMap(({ fma, elements }) => {
    const official = mapped(fma)
    return elements.map((id) => {
      if (used.has(id)) throw new Error(`Duplicate ownership: ${id}`)
      used.add(id)
      if (!official.has(id)) throw new Error(`${id} is not mapped to ${fma} in the 4.3 table`)
      const input = inputs.objects.find((i) => i.id === id)
      if (!input) throw new Error(`Missing pinned input: ${id}`)
      const text = texts.get(id)!
      const header = (name: string) => text.match(new RegExp(`^# ${name} : (.+)$`, 'm'))?.[1].trim()
      if (
        header('File ID') !== id ||
        header('Concept ID') !== fma ||
        header('Compatibility version') !== '4.3'
      )
        throw new Error(`Header mismatch: ${id}`)
      const vertices: number[][] = []
      const faces: number[][] = []
      for (const line of text.split(/\r?\n/)) {
        const tokens = line.trim().split(/\s+/)
        if (tokens[0] === 'v') {
          const v = tokens.slice(1, 4).map(Number)
          if (v.length !== 3 || !v.every(Number.isFinite)) throw new Error(`Invalid vertex: ${id}`)
          vertices.push(v)
        } else if (tokens[0] === 'f') {
          faces.push(
            tokens.slice(1).map((t) => {
              const i = Number(t.split('/')[0])
              return i > 0 ? i - 1 : vertices.length + i
            }),
          )
        }
      }
      const kept = faces.filter((face) => face.some((i) => vertices[i][0] <= MIDLINE_X))
      const remap = new Map<number, number>()
      const offset = positions.length / 3
      let triangles = 0
      for (const face of kept) {
        const local = face.map((i) => {
          if (!remap.has(i)) {
            remap.set(i, offset + remap.size)
            const v = vertices[i]
            v.forEach((p, k) => {
              min[k] = Math.min(min[k], p)
              max[k] = Math.max(max[k], p)
            })
            positions.push(...v)
          }
          return remap.get(i)!
        })
        for (let i = 1; i < local.length - 1; i++) {
          indices.push(local[0], local[i], local[i + 1])
          triangles++
        }
      }
      return {
        element: id,
        fma,
        sourceName: header('English name'),
        mirrorPath: input.mirrorPath,
        sha256: input.sha256,
        bytes: input.bytes,
        sourceVertices: vertices.length,
        sourceFaces: faces.length,
        droppedDetachedFaces: faces.length - kept.length,
        vertices: remap.size,
        triangles,
      }
    })
  })
  return { structure, positions, indices, sources }
})
const unused = inputs.objects.filter((i) => !used.has(i.id))
if (unused.length) throw new Error(`Unused inputs: ${unused.map((i) => i.id).join(', ')}`)

const center = min.map((v, i) => (v + max[i]) / 2)
// Millimetres to display units: the eye is about ten times smaller than the
// heart, so it gets a larger uniform factor. No anatomical reshaping.
const scale = 0.1
for (const { structure, positions, indices } of prepared) {
  const transformed = new Float32Array(positions.length)
  for (let i = 0; i < positions.length; i += 3) {
    transformed[i] = (positions[i] - center[0]) * scale
    transformed[i + 1] = (positions[i + 2] - center[2]) * scale
    transformed[i + 2] = -(positions[i + 1] - center[1]) * scale
  }
  const geometry = new BufferGeometry()
    .setAttribute('position', new Float32BufferAttribute(transformed, 3))
    .setIndex(indices)
  geometry.computeVertexNormals()
  const color = new Color(structure.color)
  const material = doc
    .createMaterial(structure.id)
    .setBaseColorFactor([color.r, color.g, color.b, 1])
    .setRoughnessFactor(0.65)
    .setMetallicFactor(0)
    .setDoubleSided(true)
  const primitive = doc
    .createPrimitive()
    .setAttribute(
      'POSITION',
      doc.createAccessor().setType('VEC3').setArray(transformed).setBuffer(buffer),
    )
    .setAttribute(
      'NORMAL',
      doc
        .createAccessor()
        .setType('VEC3')
        .setArray(new Float32Array(geometry.getAttribute('normal').array))
        .setBuffer(buffer),
    )
    .setIndices(
      doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(indices)).setBuffer(buffer),
    )
    .setMaterial(material)
  const mesh = doc.createMesh(structure.id).addPrimitive(primitive)
  scene.addChild(
    doc
      .createNode(structure.id)
      .setMesh(mesh)
      .setExtras({ structureId: structure.id, fma: structure.fma }),
  )
  geometry.dispose()
}
const runtime = await new NodeIO().writeBinary(doc)
await Bun.write('public/models/eye.glb', runtime)
const manifest = {
  dataset: 'BodyParts3D / Anatomography',
  version: '4.3',
  variant: 'Object set 4.3, FMA3.0 tree; right eye and orbital structures',
  retrieved: '2026-10-16',
  license: 'CC-BY-SA-2.1-JP',
  licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en',
  licenseStatement: 'https://lifesciencedb.jp/bp3d/info/index.html#License',
  credit: doc.getRoot().getAsset().copyright,
  mirror: { url: inputs.mirror, commit: inputs.mirrorCommit },
  mapping: { file: 'docs/model-source/FMA2Obj-4.3.tsv', sha256: MAPPING_SHA },
  transform: {
    sourceBoundsMm: { min, max },
    centerMm: center,
    scale,
    axes: '[x, z, -y]',
    droppedFaces: `faces with every vertex at source x > ${MIDLINE_X} mm (detached fragments at the left eye)`,
  },
  runtime: { file: 'eye.glb', bytes: runtime.byteLength, sha256: sha(runtime) },
  structures: prepared.map(({ structure, sources }) => ({
    id: structure.id,
    fma: structure.fma,
    sourceName: structure.sourceName,
    sources,
  })),
}
await Bun.write('public/models/manifest.json', JSON.stringify(manifest, null, 2) + '\n')
await Bun.write(
  'docs/model-source/selected-mappings.tsv',
  'structure\tconcept id\telement file id\tsource name\n' +
    prepared
      .flatMap(({ structure, sources }) =>
        sources.map((s) => [structure.id, s.fma, s.element, s.sourceName].join('\t')),
      )
      .join('\n') +
    '\n',
)
const dropped = prepared.flatMap((p) => p.sources).reduce((n, s) => n + s.droppedDetachedFaces, 0)
console.log(
  `Prepared ${structures.length} structures, ${used.size} source meshes, ${dropped} detached faces dropped, ${runtime.byteLength} bytes. SHA-256 ${sha(runtime)}`,
)
