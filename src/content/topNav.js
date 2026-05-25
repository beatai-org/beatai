// Top navigation is a thin manual list. Each entry is a *reference* —
//
//   { kind: 'book',       id }         → label/href looked up from BOOKS
//   { kind: 'collection', id }         → label/href looked up from COLLECTIONS
//   { kind: 'route',      label, href }→ static label + href (use for pages
//                                        that aren't books/collections, e.g.
//                                        the /ai-insights archive feed)
//
// Order in this array == display order in the nav. Adding/removing an entry
// is the only thing you need to touch when changing the top nav.

export const TOP_NAV = Object.freeze([
  { kind: 'route',      label: 'AI 前沿学习',   href: '/ai-insights' },
  { kind: 'book',       id: 'rust-course' },
  { kind: 'collection', id: 'learn-ai' },
  { kind: 'collection', id: 'mba' }
]);
