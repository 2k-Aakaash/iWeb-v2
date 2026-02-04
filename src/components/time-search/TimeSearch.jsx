import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import styles from "./time-search.module.css";

function formatTime(date) {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function TimeSearch() {
  const [now, setNow] = useState(() => new Date());
  const [value, setValue] = useState("");

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeText = useMemo(() => formatTime(now), [now]);

  const onSubmit = (e) => {
    e.preventDefault();
    const query = value.trim();
    if (!query) return;

    const isUrl =
      query.includes(".") &&
      !query.includes(" ") &&
      !query.startsWith("http://") &&
      !query.startsWith("https://");

    const finalUrl = query.startsWith("http")
      ? query
      : isUrl
        ? `https://${query}`
        : `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    window.location.href = finalUrl;
  };

  return (
  <div className={styles.wrapper}>
    {/* Liquid Glass Time */}
    <div className={styles.timeGlass}>
      <div className={styles.time} data-time={timeText}>
        {timeText}
      </div>
    </div>

    {/* Search */}
    <form className={styles.search} onSubmit={onSubmit}>
      <Search size={20} className={styles.icon} />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={styles.input}
        placeholder="What’s on your mind?"
        autoComplete="off"
        spellCheck={false}
      />
    </form>
  </div>
);
}
