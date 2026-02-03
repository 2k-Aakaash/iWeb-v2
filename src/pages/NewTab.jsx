import { useEffect, useState } from "react";
import { useUIStore } from "@/store/uiStore";
import ControlCenter from "@/components/control-center/ControlCenter";
import Dock from "@/components/dock/Dock";
import TimeSearch from "@/components/time-search/TimeSearch";
import DateTimeChip from "@/components/topbar/DateTimeChip";
import UnsplashSettingsWindow from "@/components/control-center/UnsplashSettingsWindow";
import { fetchUnsplashWallpaper } from "@/lib/unsplashClient";
import { SlidersHorizontal } from "lucide-react";

export default function NewTab() {
  const {
    toggleControlCenter,
    unsplashOpen,
    closeUnsplash,
    wallpaper,
    setWallpaper,
    brightness,
  } = useUIStore();

  const wallpaperBrightness = 30 + (brightness / 100) * 70;

  const [unsplashPrefs, setUnsplashPrefs] = useState({
    topic: "Nature",
    refresh: "daily",
  });

  useEffect(() => {
    async function load() {
      if (!navigator.onLine) return;

      await fetchUnsplashWallpaper({
        topic: unsplashPrefs.topic,
        refresh: unsplashPrefs.refresh,
      });

      const images = await getStoredImages();
      if (images.length) setWallpaper(images[0]);
    }

    load();
  }, [unsplashPrefs.topic, unsplashPrefs.refresh]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white">
      {/* Wallpaper / Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${wallpaper})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: `brightness(${wallpaperBrightness}%)`,
          transition: "filter 120ms ease",
        }}
      />

      {/* Dark overlay for readability */}
      {/* <div className="absolute inset-0 bg-black/10" /> */}

      {/* Top Bar */}
      <header className="relative z-10 flex items-center justify-end px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleControlCenter}
            className="glass rounded-full w-11 h-11 flex items-center justify-center hover:bg-white/10 transition"
            aria-label="Control Center"
          >
            <SlidersHorizontal size={18} />
          </button>

          <DateTimeChip />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center px-6">
        <TimeSearch />
      </main>

      {/* Control Center Panel */}
      <ControlCenter />

      {/* Dock */}
      <Dock />
      <UnsplashSettingsWindow
        open={unsplashOpen}
        onClose={closeUnsplash}
        initialTopic={unsplashPrefs.topic}
        initialRefresh={unsplashPrefs.refresh}
        onApply={(prefs) => {
          setUnsplashPrefs(prefs);
          closeUnsplash();
        }}
      />
      
      {/* ADD THIS HERE (GLOBAL SVG FILTERS) */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="displacementFilter">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.01"
            numOctaves="2"
            result="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="50"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
    </div>
  );
}
