// "Kam animation" chuni ho to seedha upar, warna aaraam se
export function smoothScrollTop() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
}
