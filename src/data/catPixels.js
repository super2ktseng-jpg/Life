// 14×20 pixel colour map — null = transparent
const _ = null
const k = '#1a0a00'  // deep outline
const o = '#d97706'  // orange tabby base
const d = '#92400e'  // dark tabby stripe
const b = '#b45309'  // mid-tone stripe
const w = '#fef3c7'  // inner-ear cream
const W = '#fffef0'  // white chest / paws
const g = '#6ee7b7'  // iris (bright teal-green)
const P = '#052e16'  // pupil (deep green-black)
const H = '#d1fae5'  // eye sparkle highlight
const n = '#fb7185'  // nose
const c = '#fcd34d'  // chin / muzzle cream

export const CAT_PIXELS = [
  //   0  1  2  3  4  5  6  7  8  9 10 11 12 13
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_],  //  0 blank
  [_,_,_,k,_,_,_,_,_,k,_,_,_,_],  //  1 ear tips
  [_,_,k,o,k,_,_,_,k,o,k,_,_,_],  //  2 ear outer
  [_,_,k,w,k,_,_,_,k,w,k,_,_,_],  //  3 ear inner cream
  [_,_,k,o,o,k,k,o,o,o,k,_,_,_],  //  4 head top, ears join
  [_,k,d,b,d,o,o,o,d,b,d,k,_,_],  //  5 forehead M-stripe — 3 peaks (tiger mark)
  [_,k,o,d,b,o,o,o,b,d,o,k,_,_],  //  6 temple shadow stripes
  [_,k,o,H,g,P,o,o,H,g,o,k,_,_],  //  7 eyes — sparkle+iris+pupil
  [_,k,o,o,o,o,o,o,o,o,o,k,_,_],  //  8 cheek
  [_,k,c,c,c,n,n,c,c,c,o,k,_,_],  //  9 muzzle cream + 2-px nose
  [_,_,k,o,c,c,c,c,c,o,k,_,_,_],  // 10 chin / lower muzzle
  [_,k,d,W,W,W,o,W,W,W,d,k,_,_],  // 11 upper chest — dark flanks (tabby)
  [_,k,o,W,W,W,W,W,W,W,o,k,_,_],  // 12 chest wide bib
  [_,k,d,o,d,W,W,W,d,o,d,k,_,_],  // 13 flank double-stripe
  [_,k,b,d,o,o,W,o,o,d,b,k,_,_],  // 14 belly centre line
  [_,k,d,b,d,b,o,b,d,b,d,k,_,_],  // 15 belly stripes — alternating deep/mid
  [_,_,k,o,o,o,o,o,o,o,k,_,_,_],  // 16 body base
  [_,_,k,o,W,W,_,W,W,o,k,_,_,_],  // 17 front paws showing
  [_,_,k,W,W,W,_,W,W,W,k,_,_,_],  // 18 paw pads
  [_,d,o,d,o,k,_,_,k,o,d,o,_,_],  // 19 tail — stronger stripe alternation
]

export const CAT_WIDTH  = 14
export const CAT_HEIGHT = 20
