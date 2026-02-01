import { Agent, setGlobalDispatcher } from "undici";

setGlobalDispatcher(
  new Agent({
    keepAliveTimeout: 1,
    keepAliveMaxTimeout: 1,
  })
);

/* -------------------- CONFIG -------------------- */

const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 15; // max requests per IP per hour
const PER_PAGE = 5; // photos per request

const VALID_TOPICS = new Set([
  "animals",
  "architecture-interior",
  "business-work",
  "current-events",
  "experimental",
  "film",
  "food-drink",
  "health",
  "nature",
  "people",
  "spirituality",
  "technology",
  "textures",
  "travel",
  "wallpapers",
]);

// Store per IP: { count, time, pagePerTopic: { topic: lastPage } }
const ipStore = new Map();

/* -------------------- HELPERS -------------------- */

function rateLimit(ip) {
  const now = Date.now();
  const record = ipStore.get(ip) || { count: 0, time: now, pagePerTopic: {} };

  if (now - record.time > RATE_LIMIT_WINDOW) {
    record.count = 0;
    record.time = now;
    record.pagePerTopic = {};
  }

  record.count += 1;
  ipStore.set(ip, record);

  return record.count <= RATE_LIMIT_MAX;
}

function getNextPage(ip, topic) {
  const record = ipStore.get(ip) || { count: 0, time: Date.now(), pagePerTopic: {} };
  let page = (record.pagePerTopic[topic] || 0) + 1;
  record.pagePerTopic[topic] = page;
  ipStore.set(ip, record);
  return page;
}

async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, options);
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 500 * 2 ** i));
    }
  }
}

export const config = { runtime: "nodejs" };

/* -------------------- HANDLER -------------------- */

export default async function handler(req, res) {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      "unknown";

    if (!rateLimit(ip)) {
      return res.status(429).json({
        error: "Rate limit exceeded",
        retryAfter: "1 hour",
      });
    }

    let topic = (req.query.topic || "nature").toLowerCase();
    if (!VALID_TOPICS.has(topic)) {
      topic = "nature";
    }

    // Determine page: explicit ?page param overrides auto-increment
    let page = req.query.page ? parseInt(req.query.page) : getNextPage(ip, topic);

    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      return res.status(500).json({ error: "Missing UNSPLASH_ACCESS_KEY" });
    }

    const url = new URL(`https://api.unsplash.com/topics/${topic}/photos`);
    url.searchParams.set("per_page", PER_PAGE);
    url.searchParams.set("orientation", "landscape");
    url.searchParams.set("page", page);

    const r = await fetchWithRetry(url.toString(), {
      cache: "no-store",
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        Accept: "application/json",
        "User-Agent": "newtab-wallpaper",
      },
    });

    if (!r.ok) {
      return res.status(r.status).json({ error: "Unsplash failed" });
    }

    const photos = await r.json();

    const cleaned = photos
      .map((p) => ({
        id: p.id,
        imageUrl: p?.urls?.full,
        blurHash: p?.blur_hash,
      }))
      .filter(p => p.imageUrl);

    // Prevent caching
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    return res.status(200).json(cleaned);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
}
