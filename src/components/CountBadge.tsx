// Chhota laal number: kitne kaam baqi hain (0 ho to kuch nahi)
function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null
  return (
    <span className="ms-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-semibold leading-none text-white">
      {count > 99 ? '99+' : count}
    </span>
  )
}

export default CountBadge
