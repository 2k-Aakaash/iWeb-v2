export async function fetchUnsplashWallpaper({
  topic,
  w = 2400,
  h = 1600,
  q = 80,
}) {
  const params = new URLSearchParams({
    topic,
    w: String(w),
    h: String(h),
    q: String(q),
  })

  const r = await fetch(`/api/unsplash?${params.toString()}`)

  if (!r.ok) {
    throw new Error("Unsplash fetch failed")
  }

  return await r.json()
}
