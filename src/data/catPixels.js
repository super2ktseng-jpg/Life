// 14×20 pixel colour map — null = transparent
// Cute sitting orange tabby: tall pointy ears, solid black eyes,
// cream inner ear, orange chin break between muzzle and chest bib
const _ = null
const k = '#1a1a1a'  // near-black outline
const o = '#e8920a'  // orange fur (main)
const d = '#b06000'  // dark orange/brown (stripes)
const w = '#ffffff'  // white (chest bib, muzzle, paw tips)
const n = '#f0a0b0'  // pink nose
const p = '#ffc8a0'  // cream/peach (inner ear — distinct from white muzzle)

export const CAT_PIXELS = [
  //   0  1  2  3  4  5  6  7  8  9 10 11 12 13
  [_,_,_,k,_,_,_,_,_,k,_,_,_,_],  //  0 ear tips — 1 px pointed each
  [_,_,k,k,k,_,_,_,k,k,k,_,_,_],  //  1 ear silhouette (3 px, widens)
  [_,k,o,p,k,_,_,_,k,p,o,k,_,_],  //  2 ear: orange outer + cream inner
  [_,k,o,p,k,_,_,_,k,p,o,k,_,_],  //  3 ear taller
  [k,o,o,o,o,o,o,o,o,o,o,o,k,_],  //  4 head top — ears blend into head
  [k,o,d,o,d,o,o,d,o,d,o,o,k,_],  //  5 forehead — 4 dark M-stripes
  [k,o,o,k,k,o,o,o,k,k,o,o,k,_],  //  6 EYES — solid 2×2 black at 3-4 & 8-9
  [k,o,o,k,k,o,o,o,k,k,o,o,k,_],  //  7 EYES — solid 2×2 (both rows same)
  [k,o,o,o,o,n,n,o,o,o,o,o,k,_],  //  8 nose (2-px pink at centre)
  [k,o,o,w,w,w,w,w,w,w,o,o,k,_],  //  9 white muzzle — 7 px
  [_,k,o,o,o,o,o,o,o,o,o,k,_,_],  // 10 ORANGE chin — break so it's not a hamster
  [_,k,o,o,w,w,w,w,w,o,o,k,_,_],  // 11 upper chest bib
  [_,k,o,d,o,w,w,w,o,d,o,k,_,_],  // 12 chest + dark flanks
  [_,k,o,o,d,o,w,o,d,o,o,k,_,_],  // 13 belly
  [_,k,o,d,o,d,o,d,o,d,o,k,_,_],  // 14 belly stripes — alternating
  [_,_,k,o,o,o,o,o,o,o,k,_,_,_],  // 15 lower body
  [_,_,k,o,w,w,_,w,w,o,k,_,_,_],  // 16 front paws showing
  [_,_,k,w,w,w,_,w,w,w,k,_,_,_],  // 17 paw tips — white
  [_,_,_,k,k,k,_,k,k,k,_,_,_,_],  // 18 bottom base
  [_,d,o,d,o,k,_,_,k,o,d,o,_,_],  // 19 tail — sway animation row
]

export const CAT_WIDTH  = 14
export const CAT_HEIGHT = 20
