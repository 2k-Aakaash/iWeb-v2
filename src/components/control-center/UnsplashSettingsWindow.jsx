import { useEffect, useMemo, useState } from "react";
import { X, WifiOff, RefreshCcw, Settings2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import styles from "./unsplash-settings-window.module.css";

const REFRESH_OPTIONS = [
  { label: "Twice a day", value: "twice_daily", hours: 12 },
  { label: "Daily", value: "daily", hours: 24 },
  { label: "Weekly", value: "weekly", hours: 24 * 7 },
];

const TOPICS = [
  "SwitzerLand",
  "Architecture & Interiors",
  "Business & Work",
  "Current Events",
  "Experimental",
  "Film",
  "Food & Drink",
  "Health & Wellness",
  "Nature",
  "People",
  "Spirituality",
  "Technology",
  "Textures",
  "Travel",
  "Wallpapers",
];

export default function UnsplashSettingsWindow({
  open,
  onClose,
  onApply,
  initialTopic = "Nature",
  initialRefresh = "daily",
}) {
  // Load saved values from localStorage if they exist
  const savedTopic = typeof window !== "undefined" ? localStorage.getItem("unsplashTopic") : null;
  const savedRefresh = typeof window !== "undefined" ? localStorage.getItem("unsplashRefresh") : null;

  const [topic, setTopic] = useState(
    typeof window !== "undefined" ? localStorage.getItem("unsplashTopic") || initialTopic : initialTopic
  );
  const [refresh, setRefresh] = useState(
    typeof window !== "undefined" ? localStorage.getItem("unsplashRefresh") || initialRefresh : initialRefresh
  );
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);

  // Keep track of online/offline
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

  // Reset topic & refresh when window opens
  useEffect(() => {
    if (open) {
      // Only reset if no topic in state (first open)
      setTopic(prev => prev || savedTopic || initialTopic);
      setRefresh(prev => prev || savedRefresh || initialRefresh);
    }
  }, [open, initialTopic, initialRefresh, savedTopic, savedRefresh]);


  // Save to localStorage whenever user changes topic or refresh
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("unsplashTopic", topic);
      localStorage.setItem("unsplashRefresh", refresh);
    }
  }, [topic, refresh]);

  const refreshLabel = useMemo(
    () => REFRESH_OPTIONS.find((r) => r.value === refresh)?.label ?? "Daily",
    [refresh]
  );

  if (!open) return null;

  return (
      <div
        className={styles.overlay}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
      <div className={`${styles.window} ${styles.liquidGlass}`}
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
                  <Select value={topic} onValueChange={setTopic}>
                    <SelectTrigger className={styles.selectTrigger}>
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>

                    <SelectContent position="popper" className={styles.selectContent}>
                      {TOPICS.map((t) => (
                        <SelectItem key={t} value={t} className={styles.selectItem}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Refresh frequency</label>
                  <Select value={refresh} onValueChange={setRefresh}>
                    <SelectTrigger className={styles.selectTrigger}>
                      <SelectValue placeholder="Select refresh frequency" />
                    </SelectTrigger>

                    <SelectContent position="popper" className={styles.selectContent}>
                      {REFRESH_OPTIONS.map((r) => (
                        <SelectItem key={r.value} value={r.value} className={styles.selectItem}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
