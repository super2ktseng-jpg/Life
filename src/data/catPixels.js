// 16×22 pixel colour map — null = transparent
// Reference: cute sitting orange tabby with big pointy ears,
// sparkle eyes, heart muzzle, cream inner ear, white chest bib, white paws
const _ = null
const k = '#1a1a1a'  // near-black outline
const o = '#e8920a'  // orange fur (main)
const d = '#b06000'  // dark orange/brown (stripes)
const w = '#ffffff'  // white (muzzle, chest bib, paw tips)
const n = '#f0a0b0'  // pink nose
const p = '#ffc8a0'  // cream/peach inner ear

export const CAT_PIXELS = [
  //   0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15
  [_,_,_,k,k,_,_,_,_,k,k,_,_,_,_,_],  //  0 ear tips — 2 px each
  [_,_,k,o,o,k,_,_,k,o,o,k,_,_,_,_],  //  1 ears (outline at 2&5 and 8&11)
  [_,k,o,o,p,k,_,_,k,p,o,o,k,_,_,_],  //  2 ear wider + cream inner
  [_,k,o,o,p,k,_,_,k,p,o,o,k,_,_,_],  //  3 ear taller (same)
  [k,o,o,o,o,o,o,o,o,o,o,o,o,k,_,_],  //  4 head top — outline at 0 & 13
  [k,o,o,d,o,d,o,d,o,d,o,o,o,k,_,_],  //  5 forehead — 4 dark M-stripes
  [k,o,o,w,k,o,o,o,o,k,w,o,o,k,_,_],  //  6 UPPER EYE — sparkle at outer corner
  [k,o,o,k,k,o,o,o,o,k,k,o,o,k,_,_],  //  7 LOWER EYE — solid 2×2 black
  [k,o,o,o,o,o,n,n,o,o,o,o,o,k,_,_],  //  8 nose (2-px pink, centred at 6-7)
  [k,o,w,w,w,w,w,w,w,w,w,o,o,k,_,_],  //  9 white muzzle — 9 px wide
  [_,k,o,w,w,w,w,w,w,w,o,o,k,_,_,_],  // 10 chin white
  [_,k,o,o,o,o,o,o,o,o,o,o,k,_,_,_],  // 11 ORANGE neck — breaks muzzle/chest
  [_,k,o,o,w,w,w,w,w,o,o,o,k,_,_,_],  // 12 upper chest bib (5 px white)
  [_,k,o,d,o,w,w,w,o,d,o,o,k,_,_,_],  // 13 chest + dark flanks
  [_,k,o,o,d,o,w,o,d,o,o,o,k,_,_,_],  // 14 belly
  [_,k,o,d,o,d,o,d,o,d,o,o,k,_,_,_],  // 15 belly stripes — alternating
  [_,_,k,o,o,o,o,o,o,o,o,k,_,_,_,_],  // 16 lower body (outline at 2 & 11)
  [_,_,k,o,o,o,o,o,o,o,o,k,_,_,_,_],  // 17 lower body 2
  [_,_,k,o,w,w,_,_,w,w,o,k,_,_,_,_],  // 18 front paws showing
  [_,_,k,w,w,w,_,_,w,w,w,k,_,_,_,_],  // 19 paw tips — white
  [_,_,_,k,k,k,_,_,k,k,k,_,_,_,_,_],  // 20 bottom base
  [_,d,o,d,o,k,_,_,_,k,o,d,o,_,_,_],  // 21 tail — sway animation row
]

export const CAT_WIDTH  = 16
export const CAT_HEIGHT = 22
