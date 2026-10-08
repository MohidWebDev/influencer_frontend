// Public profile lists Vercel CDN pe thodi der cache hoti hain (mehmanon ke liye tez).
// Login user (khaas kar admin) ko hamesha taaza data chahiye: un ki request pe "_fresh"
// lagta hai, jis se CDN bypass ho kar seedha server se jawab aata hai
let bypassCdn = false

export function setBypassCdn(value: boolean) {
  bypassCdn = value
}

export function freshParams(): Record<string, string> {
  return bypassCdn ? { _fresh: String(Date.now()) } : {}
}
