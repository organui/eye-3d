export type Group =
  'Wall of the eyeball' | 'Inside the eyeball' | 'Eye muscles' | 'Nerve and eyelid'

export type Structure = {
  id: string
  /** Primary FMA concept shown in the details card. */
  fma: string
  name: string
  sourceName: string
  group: Group
  /** Source concepts and their BodyParts3D 4.3 element files, merged into one mesh. */
  parts: { fma: string; elements: string[] }[]
  color: string
  description: string
  note: string
}

export const anatomySource =
  'https://www.nei.nih.gov/learn-about-eye-health/healthy-vision/how-eyes-work'
export const structures: Structure[] = [
  {
    id: 'cornea',
    fma: 'FMA58239',
    name: 'Cornea',
    sourceName: 'Right cornea',
    group: 'Wall of the eyeball',
    parts: [{ fma: 'FMA58239', elements: ['FJ1340'] }],
    color: '#a9c4cf',
    description:
      'The clear, curved front window of the eye. It lets light in and does most of the focusing.',
    note: 'Shown tinted so it stays visible; the living cornea is transparent.',
  },
  {
    id: 'sclera',
    fma: 'FMA58271',
    name: 'Sclera',
    sourceName: 'Right sclera',
    group: 'Wall of the eyeball',
    parts: [{ fma: 'FMA58271', elements: ['FJ1368'] }],
    color: '#e6ddcf',
    description:
      'The tough white outer coat of the eyeball. It protects the eye and anchors the eye muscles.',
    note: 'Hide the sclera to see the choroid and retina beneath it.',
  },
  {
    id: 'choroid',
    fma: 'FMA58299',
    name: 'Choroid',
    sourceName: 'Right choroid',
    group: 'Wall of the eyeball',
    parts: [{ fma: 'FMA58299', elements: ['FJ1336', 'FJ1337'] }],
    color: '#9a6a5c',
    description:
      'A layer rich in blood vessels between the sclera and the retina that nourishes the outer retina.',
    note: 'The source supplies the choroid as two pieces; they are selected together.',
  },
  {
    id: 'retina',
    fma: 'FMA58607',
    name: 'Retina',
    sourceName: 'Optic part of right retina',
    group: 'Wall of the eyeball',
    parts: [{ fma: 'FMA58607', elements: ['FJ1367'] }],
    color: '#d49a7c',
    description:
      'The light-sensitive lining at the back of the eye. It turns light into signals sent along the optic nerve.',
    note: 'Only the light-sensing (optic) part is modelled. Isolate it to see its cup shape.',
  },
  {
    id: 'iris',
    fma: 'FMA58236',
    name: 'Iris',
    sourceName: 'Right iris',
    group: 'Wall of the eyeball',
    parts: [{ fma: 'FMA58236', elements: ['FJ1348'] }],
    color: '#6f8f7a',
    description:
      'The coloured ring behind the cornea. Its muscles change the size of the pupil to control how much light enters.',
    note: 'Its colour here is illustrative. The opening in the middle is the pupil.',
  },
  {
    id: 'anterior-chamber',
    fma: 'FMA58081',
    name: 'Anterior chamber',
    sourceName: 'Anterior chamber of right eyeball',
    group: 'Inside the eyeball',
    parts: [{ fma: 'FMA58081', elements: ['FJ1332'] }],
    color: '#b9d3d8',
    description:
      'The fluid-filled space between the cornea and the iris. Its clear fluid, the aqueous humour, keeps the eye’s shape.',
    note: 'Shown as a solid surface representing the space, not tissue.',
  },
  {
    id: 'lens',
    fma: 'FMA58242',
    name: 'Lens',
    sourceName: 'Right lens',
    group: 'Inside the eyeball',
    parts: [{ fma: 'FMA58242', elements: ['FJ1356'] }],
    color: '#e0c98f',
    description:
      'A clear, flexible structure behind the iris that fine-tunes focus for near and far objects.',
    note: 'Shown tinted so it stays visible; the living lens is transparent.',
  },
  {
    id: 'suspensory-ligament',
    fma: 'FMA58839',
    name: 'Suspensory ligament of lens',
    sourceName: 'Suspensory ligament of right lens',
    group: 'Inside the eyeball',
    parts: [{ fma: 'FMA58839', elements: ['FJ1371'] }],
    color: '#c7b28a',
    description:
      'Fine fibres that hold the lens in place. Changes in their tension let the lens change shape to focus.',
    note: 'The ciliary body these fibres attach to is not included in the source selection.',
  },
  {
    id: 'vitreous-body',
    fma: 'FMA58828',
    name: 'Vitreous body',
    sourceName: 'Right vitreous body',
    group: 'Inside the eyeball',
    parts: [{ fma: 'FMA58828', elements: ['FJ1382'] }],
    color: '#c9dbd5',
    description:
      'The clear gel that fills the large space behind the lens and helps hold the eye’s shape.',
    note: 'Shown tinted so it stays visible; the living vitreous is transparent.',
  },
  {
    id: 'superior-rectus',
    fma: 'FMA49044',
    name: 'Superior rectus',
    sourceName: 'Right superior rectus',
    group: 'Eye muscles',
    parts: [{ fma: 'FMA49044', elements: ['FJ1374'] }],
    color: '#b5675d',
    description: 'One of the six muscles that move the eye. It mainly turns the eye upward.',
    note: 'Best seen from the superior view.',
  },
  {
    id: 'inferior-rectus',
    fma: 'FMA49046',
    name: 'Inferior rectus',
    sourceName: 'Right inferior rectus',
    group: 'Eye muscles',
    parts: [{ fma: 'FMA49046', elements: ['FJ1346'] }],
    color: '#a85f58',
    description: 'One of the six muscles that move the eye. It mainly turns the eye downward.',
    note: 'It runs beneath the eyeball; rotate the model to look from below.',
  },
  {
    id: 'medial-rectus',
    fma: 'FMA49056',
    name: 'Medial rectus',
    sourceName: 'Right medial rectus',
    group: 'Eye muscles',
    parts: [{ fma: 'FMA49056', elements: ['FJ1359'] }],
    color: '#bd7363',
    description:
      'One of the six muscles that move the eye. It turns the eye inward, toward the nose.',
    note: 'It lies on the nose side of this right eye.',
  },
  {
    id: 'lateral-rectus',
    fma: 'FMA49054',
    name: 'Lateral rectus',
    sourceName: 'Right lateral rectus',
    group: 'Eye muscles',
    parts: [{ fma: 'FMA49054', elements: ['FJ1355'] }],
    color: '#c27b69',
    description:
      'One of the six muscles that move the eye. It turns the eye outward, away from the nose.',
    note: 'Best seen from the lateral view.',
  },
  {
    id: 'superior-oblique',
    fma: 'FMA49052',
    name: 'Superior oblique',
    sourceName: 'Right superior oblique',
    group: 'Eye muscles',
    parts: [{ fma: 'FMA49052', elements: ['FJ1373'] }],
    color: '#c98872',
    description:
      'An eye muscle whose tendon passes through a small pulley, the trochlea, before reaching the eyeball. It mainly rotates the eye and helps it look down and out.',
    note: 'Follow it forward to the trochlea near the top inner corner of the eye.',
  },
  {
    id: 'inferior-oblique',
    fma: 'FMA49050',
    name: 'Inferior oblique',
    sourceName: 'Right inferior oblique',
    group: 'Eye muscles',
    parts: [{ fma: 'FMA49050', elements: ['FJ1345'] }],
    color: '#b0705f',
    description:
      'An eye muscle that wraps under the eyeball from the front. It mainly rotates the eye and helps it look up and out.',
    note: 'It is the only eye muscle here that does not start at the back of the orbit.',
  },
  {
    id: 'levator-palpebrae',
    fma: 'FMA49048',
    name: 'Levator palpebrae superioris',
    sourceName: 'Right levator palpebrae superioris',
    group: 'Eye muscles',
    parts: [
      { fma: 'FMA49048', elements: ['FJ1357'] },
      { fma: 'FMA54159', elements: ['FJ1343'] },
    ],
    color: '#d0977d',
    description: 'The muscle that raises the upper eyelid. It does not move the eyeball.',
    note: 'Its tendon (a separate source concept) is included in the same selection.',
  },
  {
    id: 'optic-nerve',
    fma: 'FMA50875',
    name: 'Optic nerve',
    sourceName: 'Right optic nerve',
    group: 'Nerve and eyelid',
    parts: [{ fma: 'FMA50875', elements: ['FJ7501'] }],
    color: '#e3c66f',
    description: 'Carries visual signals from the retina to the brain.',
    note: 'Shown up to where it leaves the model; the optic chiasm and brain are omitted.',
  },
  {
    id: 'trochlea',
    fma: 'FMA49067',
    name: 'Trochlea',
    sourceName: 'Trochlea of right superior oblique',
    group: 'Nerve and eyelid',
    parts: [{ fma: 'FMA49067', elements: ['FJ1380'] }],
    color: '#d9d2bf',
    description:
      'A small loop of cartilage that acts as a pulley for the tendon of the superior oblique muscle.',
    note: 'The surrounding orbital bone is not included.',
  },
  {
    id: 'lacrimal-gland',
    fma: 'FMA59102',
    name: 'Lacrimal gland',
    sourceName: 'Right lacrimal gland',
    group: 'Nerve and eyelid',
    parts: [{ fma: 'FMA59102', elements: ['FJ1350'] }],
    color: '#9fb6c7',
    description: 'Makes the watery part of tears, which keep the front of the eye moist and clean.',
    note: 'It sits above and to the outer side of the eyeball. The tear drainage ducts are omitted.',
  },
  {
    id: 'upper-tarsal-plate',
    fma: 'FMA59091',
    name: 'Upper tarsal plate',
    sourceName: 'Tarsal plate of right upper eyelid',
    group: 'Nerve and eyelid',
    parts: [{ fma: 'FMA59091', elements: ['FJ1375'] }],
    color: '#d6b3a3',
    description:
      'A firm plate of dense connective tissue that stiffens and shapes the upper eyelid.',
    note: 'Only the tarsal plate is modelled; eyelid skin and muscle are omitted.',
  },
  {
    id: 'lower-tarsal-plate',
    fma: 'FMA59089',
    name: 'Lower tarsal plate',
    sourceName: 'Tarsal plate of right lower eyelid',
    group: 'Nerve and eyelid',
    parts: [{ fma: 'FMA59089', elements: ['FJ1379'] }],
    color: '#cfa999',
    description: 'A firm plate of dense connective tissue that supports the lower eyelid.',
    note: 'Only the tarsal plate is modelled; eyelid skin and muscle are omitted.',
  },
]
export const groups = [
  'Wall of the eyeball',
  'Inside the eyeball',
  'Eye muscles',
  'Nerve and eyelid',
] as const satisfies readonly Group[]
export const byId = Object.fromEntries(structures.map((s) => [s.id, s]))
export type View = 'Anterior' | 'Lateral' | 'Superior'
export const tour: { id: string; title: string; text: string; view: View; isolate?: boolean }[] = [
  {
    id: 'cornea',
    title: 'Where light comes in',
    text: 'Start at the cornea, the clear front window of the eye. The iris and pupil sit just behind it.',
    view: 'Anterior',
  },
  {
    id: 'lens',
    title: 'Fine focus',
    text: 'The lens is isolated here. It sits behind the iris and is held by the suspensory ligament. Restore all to see it in place.',
    view: 'Lateral',
    isolate: true,
  },
  {
    id: 'retina',
    title: 'Where seeing starts',
    text: 'The retina lines the back of the eye. Hide the sclera and choroid to see it, or rotate to follow it to the optic nerve.',
    view: 'Lateral',
  },
  {
    id: 'superior-rectus',
    title: 'Six muscles move the eye',
    text: 'From above you can see the rectus muscles running back from the eyeball to the rear of the orbit.',
    view: 'Superior',
  },
  {
    id: 'optic-nerve',
    title: 'Off to the brain',
    text: 'The optic nerve leaves the back of the eye and carries visual signals toward the brain.',
    view: 'Superior',
  },
]

export type Emphasis = 'normal' | 'selected' | 'ghosted'
// With nothing selected every structure keeps its own color. A selection
// keeps its structure solid and ghosts the rest so it stays visible even
// when it sits behind or inside other geometry (lens, retina, vitreous).
export function emphasis(id: string, selected: string | null): Emphasis {
  if (!selected) return 'normal'
  return id === selected ? 'selected' : 'ghosted'
}
