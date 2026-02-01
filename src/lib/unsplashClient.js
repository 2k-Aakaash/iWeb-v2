import { preloadImages } from "./preloadImages";
import { saveImages, setMeta, getMeta } from "./indexedDb";

const MAX_IMAGES = 5;

const TOPIC_SLUGS = {
  "Animals": "animals",
  "Architecture & Interiors": "architecture-interior",
  "Business & Work": "business-work",
  "Current Events": "current-events",
  "Experimental": "experimental",
  "Film": "film",
  "Food & Drink": "food-drink",
  "Health & Wellness": "health",
  "Nature": "nature",
  "People": "people",
  "Spirituality": "spirituality",
  "Technology": "technology",
  "Textures": "textures",
  "Travel": "travel",
  "Wallpapers": "wallpapers",
};

function refreshToMs(refresh) {
  if (refresh === "twice_daily") return 12 * 60 * 60 * 1000;
  if (refresh === "weekly") return 7 * 24 * 60 * 60 * 1000;
  return 24 * 60 * 60 * 1000;
}

export async function fetchUnsplashWallpaper({ topic, refresh }) {
  const slug = TOPIC_SLUGS[topic] ?? "nature";

  const lastFetch = await getMeta("lastFetch");
  const cooldown = refreshToMs(refresh);

  if (lastFetch && Date.now() - lastFetch < cooldown) {
    return { fromCache: true };
  }

  const r = await fetch(`/api/unsplash?topic=${slug}`);
  if (!r.ok) throw new Error("Unsplash fetch failed");

  const photos = await r.json();

  const urls = photos
    .map((p) => p?.imageUrl || p?.urls?.full)
    .filter(Boolean)
    .slice(0, MAX_IMAGES);

  await saveImages(urls);
  await setMeta("lastFetch", Date.now());

  preloadImages(urls); // ✅ now valid

  return { fromCache: false };
}
