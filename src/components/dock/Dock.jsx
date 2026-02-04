import { useRef } from "react";
import styles from "./dock.module.css";

const apps = [
  { name: "Reddit", url: "https://reddit.com", domain: "reddit.com" },
  { name: "ChatGPT", url: "https://chat.openai.com", domain: "openai.com" },
  { name: "YouTube", url: "https://youtube.com", domain: "youtube.com" },
  { name: "WhatsApp", url: "https://web.whatsapp.com", domain: "whatsapp.com" },
  { name: "Apple", url: "https://apple.com", domain: "apple.com" },
  { name: "Spotify", url: "https://spotify.com", domain: "spotify.com" },
  { name: "Amazon", url: "https://amazon.com", domain: "amazon.com" },
  { name: "Pinterest", url: "https://pinterest.com", domain: "pinterest.com" },
  { name: "Calendar", url: "https://calendar.google.com", domain: "calendar.google.com" },
  { name: "GitHub", url: "https://github.com", domain: "github.com" },
  { name: "Maps", url: "https://maps.google.com", domain: "maps.google.com" },
  { name: "Netflix", url: "https://netflix.com", domain: "netflix.com" },
  { name: "Steam", url: "https://store.steampowered.com", domain: "steampowered.com" },
  { name: "Discord", url: "https://discord.com/app", domain: "discord.com" },
  { name: "Xbox", url: "https://xbox.com", domain: "xbox.com" },
  { name: "Dropbox", url: "https://dropbox.com", domain: "dropbox.com" },
  { name: "Meet", url: "https://meet.google.com/zjy-wagt-cay", domain: "meet.google.com" },
  { name: "Zoho People", url: "https://people.zoho.in/", domain: "people.zoho.in" },
  { name: "Vercel", url: "https://vercel.com", domain: "vercel.com" },
  { name: "Netlify", url: "https://netlify.com", domain: "netlify.com" },
  { name: "Valorant", url: "https://playvalorant.com", domain: "playvalorant.com" },
  { name: "Epic Games", url: "https://epicgames.com", domain: "epicgames.com" },
  { name: "Realme", url: "https://realme.com", domain: "realme.com" },

];

const maxAdditionalSize = 5;

const scaleValue = (value, from, to) => {
  const scale = (to[1] - to[0]) / (from[1] - from[0]);
  const capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
  return Math.floor(capped * scale + to[0]);
};

export default function Dock() {
  const dockRef = useRef(null);

  const handleAppHover = (ev) => {
    if (!dockRef.current) return;

    const mousePosition = ev.clientX;
    const rect = ev.currentTarget.getBoundingClientRect();
    const cursorDistance = (mousePosition - rect.left) / rect.width;

    const offsetPixels = scaleValue(
      cursorDistance,
      [0, 1],
      [maxAdditionalSize * -1, maxAdditionalSize]
    );

    dockRef.current.style.setProperty("--dock-offset-left", `${offsetPixels * -1}px`);
    dockRef.current.style.setProperty("--dock-offset-right", `${offsetPixels}px`);
  };

  return (
    <nav ref={dockRef} className={styles.dock}>
      <ul className={styles.list}>
        {apps.map((app) => (
          <li
            key={app.name}
            className={styles.app}
            onMouseMove={handleAppHover}
          >
            <a
              href={app.url}
              target="_blank"
              rel="noreferrer"
              className={styles.link}
              title={app.name}
            >
              <img
                src={`https://www.google.com/s2/favicons?sz=256&domain_url=https://${app.domain}`}
                onError={(e) => (e.currentTarget.src = "/icons/default.png")}
                alt={app.name}
                draggable={false}
              />
              <span className={`${styles.tooltip} ${styles.liquidBtn}`}>{app.name}</span>
            </a>
          </li>
        ))}

        {/* Add Button */}
        <li className={`${styles.app} ${styles.add}`} onMouseMove={handleAppHover}>
          <button
            type="button"
            className={styles.addBtn}
            title="Add app"
            onClick={() => alert("Add app clicked (we can build this next)")}
          >
            +
            <span className={`${styles.tooltip} ${styles.liquidBtn}`}>Add app</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
