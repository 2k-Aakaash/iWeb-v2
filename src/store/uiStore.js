import {create} from "zustand"

export const useUIStore = create((set) => ({
  controlCenterOpen: false,
  unsplashOpen: false,
  openUnsplash: () => set({unsplashOpen: true}),
  closeUnsplash: () => set({unsplashOpen: false}),

  toggleControlCenter: () =>
    set((s) => ({controlCenterOpen: !s.controlCenterOpen})),
  closeControlCenter: () => set({controlCenterOpen: false}),

  wallpaper:
    "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?q=80&w=2400&auto=format&fit=crop",
  setWallpaper: (url) => set({wallpaper: url}),
}))
