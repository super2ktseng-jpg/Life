// 14×20 pixel colour map — null = transparent
const _ = null
const k = '#1c0800' // outline
const o = '#d97706' // orange tabby
const d = '#92400e' // dark stripe
const w = '#fef3c7' // cream
const W = '#fffef0' // white paws/chest
const g = '#4ade80' // eye green
const P = '#052e16' // pupil
const n = '#fda4af' // nose pink

export const CAT_PIXELS = [
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_],  //  0
  [_,_,_,k,_,_,_,_,_,k,_,_,_,_],  //  1 ear tips
  [_,_,k,o,k,_,_,_,k,o,k,_,_,_],  //  2 ears outer
  [_,_,k,w,k,_,_,_,k,w,k,_,_,_],  //  3 ear inner
  [_,_,k,o,o,o,o,o,o,o,k,_,_,_],  //  4 top of head
  [_,k,o,d,o,o,o,o,o,d,o,k,_,_],  //  5 forehead stripes
  [_,k,o,o,o,o,o,o,o,o,o,k,_,_],  //  6 face
  [_,k,o,g,P,o,o,o,g,P,o,k,_,_],  //  7 eyes
  [_,k,o,o,o,o,o,o,o,o,o,k,_,_],  //  8 face
  [_,k,o,o,w,w,n,n,w,w,o,k,_,_],  //  9 muzzle + nose
  [_,_,k,o,o,o,o,o,o,o,k,_,_,_],  // 10 chin
  [_,k,o,W,W,o,o,o,W,W,o,k,_,_],  // 11 chest
  [_,k,o,W,W,W,o,W,W,W,o,k,_,_],  // 12 chest wide
  [_,k,o,d,o,W,W,W,W,d,o,k,_,_],  // 13 tummy stripe
  [_,k,o,o,o,o,o,o,o,o,o,k,_,_],  // 14 body
  [_,k,o,o,d,o,o,o,d,o,o,k,_,_],  // 15 body stripes
  [_,_,k,o,o,o,o,o,o,o,k,_,_,_],  // 16 body bottom
  [_,_,k,o,W,W,_,_,W,W,o,k,_,_],  // 17 front paws
  [_,_,k,W,W,W,_,_,W,W,W,k,_,_],  // 18 paws bottom
  [o,o,d,o,_,_,_,_,_,_,o,d,o,o],  // 19 tail wrapped
]

export const CAT_WIDTH  = 14
export const CAT_HEIGHT = 20
