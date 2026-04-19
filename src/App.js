import { useState, useEffect } from "react";
import WestonSPI2025 from "./WestonSPI2025";
import HIRA_DWA from "./HIRA_DWA";

/* -------------------------------------------------
   Navigation button style (unchanged)
   ------------------------------------------------- */
const NAV_STYLE = {
  display: "flex",
  gap: 4,
  padding: "8px 16px",
  background: "#1e3a5f",
  borderBottom: "1px solid #2d527a",
};

/* -------------------------------------------------
   NavTab component (unchanged)
   ------------------------------------------------- */
function NavTab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 18px",
        borderRadius: 20,
        border: "none",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 600,
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        background: active ? "#ffffff" : "transparent",
        color: active ? "#1e3a5f" : "#93c5fd",
        transition: "background 0.15s, color 0.15s",
      }}
    >
      {label}
    </button>
  );
}

/* -------------------------------------------------
   Main App component
   ------------------------------------------------- */
function App() {
  /* ---------- 1️⃣ Tab state (your original) ---------- */
  const [tab, setTab] = useState("spi");

  /* ---------- 2️⃣ App data state (for JSON persistence) ---------- */
  const [appData, setAppData] = useState(() => {
    try {
      const raw = window.localStorage.getItem("myAppData");
      return raw ? JSON.parse(raw) : { /* your default shape */ };
    } catch (e) {
      console.warn("Could not parse saved JSON", e);
      return { /* fallback/default shape */ };
    }
  });

  /* ---------- 3️⃣ Persist appData to localStorage ---------- */
  useEffect(() => {
    try {
      window.localStorage.setItem("myAppData", JSON.stringify(appData));
    } catch (e) {
      console.error("Failed to write to localStorage", e);
    }
  }, [appData]);

  /* ---------- 4️⃣ File‑upload handler ---------- */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        setAppData(parsed); // replace state with file contents
      } catch (err) {
        alert("Invalid JSON file – please check the contents.");
      }
    };
    reader.onerror = () => alert("Failed to read the file.");
    reader.readAsText(file);
  };

  /* ---------- 5️⃣ Render ---------- */
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navigation bar */}
      <nav style={NAV_STYLE} className="no-print">
        <NavTab
          label="SPI Dashboard"
          active={tab === "spi"}
          onClick={() => setTab("spi")}
        />
        <NavTab
          label="Risk Assessment (HIRA)"
          active={tab === "hira"}
          onClick={() => setTab("hira")}
        />
      </nav>

      {/* File‑upload UI (placed above the tab content) */}
      <div style={{ margin: "2rem" }}>
        <h2>Load saved JSON</h2>
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          style={{ marginBottom: "1rem" }}
        />
        <p>
          Pick a {@code .json} file you previously saved (e.g., via a download
          button) and the app will reload its state.
        </p>
      </div>

      {/* Tab‑dependent content */}
      {tab === "spi" ? <WestonSPI2025 /> : <HIRA_DWA />}
    </div>
  );
}

export default App;