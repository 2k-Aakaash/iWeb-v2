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
];

export default function Dock() {
  return (
    <div className={`${styles.dock} glass`}>
      {apps.map((app) => (
        <a
          key={app.name}
          href={app.url}
          target="_blank"
          rel="noreferrer"
          className={styles.item}
          title={app.name}
        >
          <img
            src={`https://www.google.com/s2/favicons?domain=${app.domain}&sz=64`}
            alt={app.name}
            draggable={false}
          />
        </a>
      ))}

      {/* Add Button */}
      <button
        className={`${styles.item} ${styles.add}`}
        title="Add app"
        onClick={() => alert("Add app clicked (we can build this next)")}
      >
        +
      </button>
    </div>
  );
}
