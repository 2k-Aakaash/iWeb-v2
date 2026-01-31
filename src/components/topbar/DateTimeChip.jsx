import { useEffect, useMemo, useState } from "react";

function formatDayDate(date) {
  // Tahoe style like: "Wednesday, Jan 21"
  return date.toLocaleDateString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export default function DateTimeChip() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(id);
  }, []);

  const text = useMemo(() => formatDayDate(now), [now]);

  return (
    <div className="glass rounded-full px-4 py-2 text-sm font-medium text-white/90 select-none">
      {text}
    </div>
  );
}
