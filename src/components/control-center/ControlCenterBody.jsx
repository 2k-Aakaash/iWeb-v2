import { useEffect, useState } from "react";
import {
  Moon,
  Sun,
  Wifi,
  Bluetooth,
  Volume2,
  Image,
  Music2,
  Settings,
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from "lucide-react";

import styles from "./control-center.module.css";
import { useUIStore } from "@/store/uiStore";

function ToggleButton({ active, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`${styles.ccBtn} ${active ? styles.active : ""}`}
      type="button"
    >
      <Icon size={18} />
    </button>
  );
}

export default function ControlCenterBody() {
  const { setWallpaper } = useUIStore();
const { openUnsplash } = useUIStore();

  const [toggles, setToggles] = useState({
    night: false,
    wifi: true,
    bluetooth: false,
    unsplash: false,
    mute: false,
    focus: false,
    music: false,
  });

  const [media, setMedia] = useState({
    title: "Nothing playing",
    artist: "",
    artwork: "",
    playing: false,
  });

  const [unsplashOpen, setUnsplashOpen] = useState(false);

  const [unsplashPrefs, setUnsplashPrefs] = useState({
  topic: "Nature",
  refresh: "daily",
});

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    const update = () => {
      const md = navigator.mediaSession.metadata;
      setMedia((prev) => ({
        ...prev,
        title: md?.title || "Nothing playing",
        artist: md?.artist || "",
        artwork: md?.artwork?.[md.artwork.length - 1]?.src || prev.artwork || "",
      }));
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const playPause = () => {
    if (media.playing) {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "MediaPause" }));
      setMedia((m) => ({ ...m, playing: false }));
    } else {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "MediaPlay" }));
      setMedia((m) => ({ ...m, playing: true }));
    }
  };

  const next = () => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "MediaTrackNext" }));
  };

  const prev = () => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "MediaTrackPrevious" })
    );
  };

  const wallpapers = [
    "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?q=80&w=2400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2400&auto=format&fit=crop",
  ];

  const changeWallpaper = () => {
    const random = wallpapers[Math.floor(Math.random() * wallpapers.length)];
    setWallpaper(random);
  };

  return (
    <div className={styles.inner}>
      {/* 3-column Tahoe grid */}
      <div className={styles.tahoeGrid}>
        {/* Column 1 */}
        <div className={styles.btnCol}>
          <ToggleButton
            active={toggles.night}
            icon={Moon}
            onClick={() => setToggles((t) => ({ ...t, night: !t.night }))}
          />
          <ToggleButton
            active={toggles.bluetooth}
            icon={Bluetooth}
            onClick={() => setToggles((t) => ({ ...t, bluetooth: !t.bluetooth }))}
          />
        <ToggleButton
            active={false}
            icon={Volume2}
            onClick={openUnsplash}
        />
        </div>

        {/* Column 2 */}
        <div className={styles.btnCol}>
          <ToggleButton
            active={toggles.wifi}
            icon={Wifi}
            onClick={() => setToggles((t) => ({ ...t, wifi: !t.wifi }))}
          />
          <ToggleButton
            active={toggles.focus}
            icon={Sun}
            onClick={() => setToggles((t) => ({ ...t, focus: !t.focus }))}
          />
          <button
            className={styles.ccBtn}
            onClick={changeWallpaper}
            type="button"
            title="Change wallpaper"
          >
            <Image size={18} />
          </button>
        </div>

        {/* Column 3 (2 rows) */}
        <div className={styles.rightCol}>
          {/* Row 1 = Media Square */}
          <div className={styles.mediaSquare}>
            <div className={styles.mediaTop}>
              <div className={styles.art}>
                {media.artwork ? (
                  <img src={media.artwork} alt="" />
                ) : (
                  <div className={styles.artFallback} />
                )}
              </div>

              <div className={styles.track}>
                <div className={styles.title}>{media.title}</div>
                <div className={styles.artist}>{media.artist || " "}</div>
              </div>
            </div>

            <div className={styles.mediaControls}>
              <button onClick={prev} className={styles.mediaBtn} type="button">
                <SkipBack size={16} />
              </button>

              <button onClick={playPause} className={styles.mediaBtn} type="button">
                {media.playing ? <Pause size={16} /> : <Play size={16} />}
              </button>

              <button onClick={next} className={styles.mediaBtn} type="button">
                <SkipForward size={16} />
              </button>
            </div>
          </div>

          {/* Row 2 = Horizontal pill */}
      <button className={styles.bigPill} type="button">
        <Moon size={20} />
      </button>
        </div>
      </div>

      {/* Full width settings */}
      <button className={styles.settings} type="button">
        <Settings size={20} />
        Settings
      </button>
    </div>
  );
  
}
