// 14×20 pixel colour map — null = transparent
// Reference: cute orange tabby, black eyes with sparkle, white chest
const _ = null
const k = '#1a0a00'  // black outline
const o = '#e8920a'  // orange fur (main)
const d = '#b06000'  // dark orange/brown (stripes)
const w = '#ffffff'  // white (chest bib, inner ear, muzzle, paw tips)
const n = '#f0a0b0'  // pink nose

export const CAT_PIXELS = [
  //   0  1  2  3  4  5  6  7  8  9 10 11 12 13
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_],  //  0 blank
  [_,_,_,k,k,_,_,_,k,k,_,_,_,_],  //  1 ear tips — dark 2px each
  [_,_,k,o,w,k,_,_,k,w,o,k,_,_],  //  2 ear: orange outer + white inner
  [_,_,k,o,w,k,_,_,k,w,o,k,_,_],  //  3 ear taller (same)
  [_,k,o,o,k,o,d,o,k,o,o,k,_,_],  //  4 head top: ear joins + center dark
  [k,o,o,d,o,d,o,d,o,d,o,o,k,_],  //  5 forehead — 4 dark stripes (wide cheeks)
  [k,o,o,w,k,o,o,o,k,w,o,o,k,_],  //  6 UPPER EYE — white sparkle + dark edge
  [k,o,o,k,k,o,o,o,k,k,o,o,k,_],  //  7 LOWER EYE — solid black 2×2
  [k,o,o,o,o,n,n,o,o,o,o,o,k,_],  //  8 nose (2-px pink) + wide cheeks
  [k,o,o,w,w,w,w,w,w,w,o,o,k,_],  //  9 white muzzle — wide 7-px
  [_,k,o,w,w,w,w,w,w,w,o,k,_,_],  // 10 chin — white
  [_,k,d,o,w,w,w,w,w,o,d,k,_,_],  // 11 upper chest — dark flanks
  [_,k,o,o,w,w,w,w,w,o,o,k,_,_],  // 12 chest bib
  [_,k,o,d,o,w,w,w,o,d,o,k,_,_],  // 13 chest + stripe
  [_,k,o,o,d,o,w,o,d,o,o,k,_,_],  // 14 belly join
  [_,k,o,d,o,d,o,d,o,d,o,k,_,_],  // 15 belly stripes — alternating
  [_,_,k,o,o,o,o,o,o,o,k,_,_,_],  // 16 body base
  [_,_,k,o,w,w,_,w,w,o,k,_,_,_],  // 17 front paws showing
  [_,_,k,w,w,w,_,w,w,w,k,_,_,_],  // 18 paw tips — white
  [_,d,o,d,o,k,_,_,k,o,d,o,_,_],  // 19 tail — stripe alternation
]

export const CAT_WIDTH  = 14
export const CAT_HEIGHT = 20
