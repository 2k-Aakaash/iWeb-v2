import {create} from "zustand"

const BRIGHTNESS_KEY = "iweb_brightness"

export const useUIStore = create((set) => ({
  controlCenterOpen: false,
  unsplashOpen: false,
  openUnsplash: () => set({unsplashOpen: true}),
  closeUnsplash: () => set({unsplashOpen: false}),

  toggleControlCenter: () =>
    set((s) => ({controlCenterOpen: !s.controlCenterOpen})),
  closeControlCenter: () => set({controlCenterOpen: false}),

  // wallpaper: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?q=80&w=2400&auto=format&fit=crop",
  wallpaper: "https://ik.imagekit.io/026k2i7ys/iWeb-v2-Background.jpg",
  setWallpaper: (url) => set({wallpaper: url}),

  brightness: (() => {
    const saved = localStorage.getItem(BRIGHTNESS_KEY)
    const num = saved !== null ? Number(saved) : 70
    return Number.isFinite(num) ? num : 70
  })(),

  setBrightness: (value) => {
    const v = Math.max(0, Math.min(100, value)) // clamp
    localStorage.setItem(BRIGHTNESS_KEY, String(v))
    set({brightness: v})
  },
}))
