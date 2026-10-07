// Translation mein {{field}} jaisi jagahen. t() ko yeh nishaan dete hain,
// phir unhi jagahon pe React ke styled hisse lagate hain (user ka text HTML nahi banta)
export const MARK = '\u0001'
const slot = (name: string) => `${MARK}${name}${MARK}`

export const SLOTS = {
  field: slot('field'),
  from: slot('from'),
  to: slot('to'),
  actor: slot('actor'),
  target: slot('target'),
  action: slot('action'),
}
