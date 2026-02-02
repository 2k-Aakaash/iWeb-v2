import {create} from "zustand"

export const useUIStore = create((set) => ({
  controlCenterOpen: false,
  unsplashOpen: false,
  openUnsplash: () => set({unsplashOpen: true}),
  closeUnsplash: () => set({unsplashOpen: false}),

  toggleControlCenter: () =>
    set((s) => ({controlCenterOpen: !s.controlCenterOpen})),
  closeControlCenter: () => set({controlCenterOpen: false}),

  wallpaper: "https://ik.imagekit.io/026k2i7ys/iWeb-v2-Background.jpg",
  setWallpaper: (url) => set({wallpaper: url}),
}))
