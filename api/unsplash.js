import {Agent, setGlobalDispatcher} from "undici"

// ✅ Fix ECONNRESET in serverless by disabling keep-alive socket reuse
setGlobalDispatcher(
  new Agent({
    keepAliveTimeout: 1,
    keepAliveMaxTimeout: 1,
  }),
)

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function fetchWithRetry(url, options, retries = 4) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15000) // 15s

      const r = await fetch(url, {
        ...options,
        signal: controller.signal,
      })

      clearTimeout(timeout)
      return r
    } catch (err) {
      const code = err?.cause?.code

      console.error("fetch attempt failed", {
        attempt: i + 1,
        url,
        message: err?.message,
        name: err?.name,
        code,
        cause: err?.cause,
      })

      // retry only for network-type errors
      const retryable = ["ECONNRESET", "ETIMEDOUT", "EAI_AGAIN", "ENOTFOUND"]
      if (!retryable.includes(code)) throw err

      if (i === retries - 1) throw err

      // exponential backoff + jitter
      const base = 700 * 2 ** i
      const jitter = Math.floor(Math.random() * 250)
      await sleep(base + jitter)
    }
  }
}

export const config = {runtime: "nodejs"} // ✅ important for Next.js pages/api

export default async function handler(req, res) {
  debugger
  try {
    const topic = (req.query.topic || "nature").toString()
    const page = parseInt(req.query.page || "1", 10)
    const perPage = Math.min(parseInt(req.query.per_page || "30", 10), 30)

    const w = parseInt(req.query.w || "2400", 10)
    const h = parseInt(req.query.h || "1600", 10)
    const q = parseInt(req.query.q || "80", 10)

    // ⚠️ TEMP ONLY — regenerate this key if exposed publicly
    const accessKey = "2Gg8E0uAsZaezTwITe22DPn0WfDz_GQYRrj4iEgZ7mo"

    if (!accessKey) {
      return res.status(500).json({error: "Missing UNSPLASH_ACCESS_KEY"})
    }

    const url = new URL("https://api.unsplash.com/search/photos")
    url.searchParams.set("query", topic)
    url.searchParams.set("page", String(page))
    url.searchParams.set("per_page", String(perPage))
    url.searchParams.set("orientation", "landscape")
    url.searchParams.set("content_filter", "high")

    const r = await fetchWithRetry(url.toString(), {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        "Accept-Version": "v1",
        Accept: "application/json",
        "User-Agent": "my-app (test)", // ✅ important
      },
    })

    if (!r.ok) {
      const text = await r.text()
      return res.status(r.status).json({
        error: "Unsplash request failed",
        status: r.status,
        details: text,
      })
    }

    const data = await r.json()
    const results = data?.results || []

    if (!results.length) {
      return res.status(404).json({error: "No photos found"})
    }

    // pick random photo
    const photo = results[Math.floor(Math.random() * results.length)]

    const raw = photo?.urls?.raw
    if (!raw) {
      return res.status(500).json({
        error: "Invalid Unsplash response: no raw url",
      })
    }

    // ✅ safer way to append params
    const image = new URL(raw)
    image.searchParams.set("w", String(w))
    image.searchParams.set("h", String(h))
    image.searchParams.set("q", String(q))
    image.searchParams.set("fit", "crop")
    image.searchParams.set("auto", "format")

    return res.status(200).json({
      id: photo.id,
      topic,
      imageUrl: image.toString(),
      author: photo.user?.name || "",
      authorUrl: photo.user?.links?.html || "",
      unsplashUrl: photo.links?.html || "",
    })
  } catch (err) {
    console.error("handler error", err, err?.cause)

    return res.status(500).json({
      error: "Server error",
      message: err?.message || String(err),
      cause: err?.cause ? String(err.cause) : undefined,
    })
  }
}
