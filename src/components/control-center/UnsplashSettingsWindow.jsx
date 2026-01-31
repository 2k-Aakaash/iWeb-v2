import { useEffect, useMemo, useState } from "react";
import { X, WifiOff, RefreshCcw, Settings2 } from "lucide-react";
import styles from "./unsplash-settings-window.module.css";

const REFRESH_OPTIONS = [
  { label: "Twice a day", value: "twice_daily", hours: 12 },
  { label: "Daily", value: "daily", hours: 24 },
  { label: "Weekly", value: "weekly", hours: 24 * 7 },
];

const TOPICS = [
  "Abstract",
  "Aerial",
  "Anime",
  "Architecture",
  "Art",
  "Autumn",
  "Beach",
  "Bokeh",
  "Cars",
  "City",
  "Clouds",
  "Cyberpunk",
  "Dark",
  "Desert",
  "Minimal",
  "Dogs",
  "Cats",
  "Earth",
  "Flowers",
  "Fog",
  "Forest",
  "Galaxy",
  "Gradient",
  "Green",
  "Ice",
  "Jungle",
  "Lake",
  "Landscape",
  "Light",
  "Macro",
  "Mountains",
  "Nature",
  "Neon",
  "Night Sky",
  "Ocean",
  "Pastel",
  "Patterns",
  "Rain",
  "Retro",
  "Rivers",
  "Roads",
  "Rocks",
  "Snow",
  "Space",
  "Spring",
  "Street",
  "Sunset",
  "Technology",
  "Textures",
  "Waterfalls",
  "Winter",
];

export default function UnsplashSettingsWindow({
  open,
  onClose,
  onApply,
  initialTopic = "Nature",
  initialRefresh = "daily",
}) {
  const [topic, setTopic] = useState(initialTopic);
  const [refresh, setRefresh] = useState(initialRefresh);
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setTopic(initialTopic);
      setRefresh(initialRefresh);
    }
  }, [open, initialTopic, initialRefresh]);

  const refreshLabel = useMemo(
    () => REFRESH_OPTIONS.find((r) => r.value === refresh)?.label ?? "Daily",
    [refresh]
  );

  if (!open) return null;

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div
        className={styles.window}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.icon}>
              <Settings2 size={18} />
            </div>
            <div>
              <div className={styles.title}>Unsplash Settings</div>
              <div className={styles.subtitle}>
                {online ? `Online • Refresh: ${refreshLabel}` : "Offline"}
              </div>
            </div>
          </div>

          <button className={styles.closeBtn} type="button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {!online ? (
            <div className={styles.offlineBox}>
              <WifiOff size={18} />
              <span>Please turn on the internet</span>
            </div>
          ) : (
            <>
              <div className={styles.section}>
                <div className={styles.sectionTitle}>User preferences</div>

                <div className={styles.field}>
                  <label className={styles.label}>Topic</label>
                  <select
                    className={styles.select}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  >
                    {TOPICS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Refresh frequency</label>
                  <select
                    className={styles.select}
                    value={refresh}
                    onChange={(e) => setRefresh(e.target.value)}
                  >
                    {REFRESH_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.section}>
                <div className={styles.sectionTitle}>Actions</div>

                <button
                  className={styles.actionBtn}
                  type="button"
                  onClick={() => onApply?.({ topic, refresh })}
                >
                  <RefreshCcw size={16} />
                  Apply & Fetch wallpapers
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
