import { useState, useEffect, useRef } from "react";
import WestonSPI2025 from "./WestonSPI2025";
import HIRA_DWA from "./HIRA_DWA";

/* -------------------------------------------------
   Design System Constants
   ------------------------------------------------- */
const COLORS = {
  navy: "#1e3a5f",
  bg: "#f0f6ff",
  border: "#c7deff",
  lightBorder: "#e0e7ff",
  muted: "#5a7fa8",
  faint: "#94a3b8",
  white: "#ffffff",
  success: "#10b981",
  successBg: "#d1fae5",
  error: "#ef4444",
  errorBg: "#fee2e2",
  warning: "#f59e0b",
  warningBg: "#fef3c7",
  font: "'DM Sans', 'Segoe UI', sans-serif",
};

const NAV_STYLE = {
  display: "flex",
  gap: 4,
  padding: "8px 16px",
  background: COLORS.navy,
  borderBottom: `1px solid #2d527a`,
};

/* -------------------------------------------------
   NavTab component
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
        fontFamily: COLORS.font,
        background: active ? COLORS.white : "transparent",
        color: active ? COLORS.navy : "#93c5fd",
        transition: "background 0.15s, color 0.15s",
      }}
    >
      {label}
    </button>
  );
}

/* -------------------------------------------------
   FileUpload Component
   ------------------------------------------------- */
function FileUpload({ onFileLoaded }) {
  const [status, setStatus] = useState(null); // 'loading', 'success', 'error', null
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("loading");
    setMessage("");

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const content = ev.target?.result;
        if (typeof content !== "string") {
          throw new Error("File content is not readable as text");
        }

        const parsed = JSON.parse(content);
        
        // Basic validation
        if (!parsed || typeof parsed !== "object") {
          throw new Error("File must contain valid JSON object data");
        }

        onFileLoaded(parsed);
        setStatus("success");
        setMessage(`Successfully loaded: ${file.name}`);
        
        // Clear after 3 seconds
        setTimeout(() => setStatus(null), 3000);
      } catch (err) {
        setStatus("error");
        setMessage(
          err instanceof SyntaxError
            ? `Invalid JSON format: ${err.message}`
            : `Error: ${err instanceof Error ? err.message : "Unknown error"}`
        );
      }
    };

    reader.onerror = () => {
      setStatus("error");
      setMessage("Failed to read file. Please try again.");
    };

    reader.readAsText(file);

    // Reset input so same file can be uploaded again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div style={{
      background: COLORS.white,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 10,
      padding: "24px",
      marginBottom: "20px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    }}>
      <h3 style={{
        margin: "0 0 6px 0",
        fontSize: 16,
        fontWeight: 700,
        color: COLORS.navy,
        fontFamily: COLORS.font,
      }}>
        📁 Load Saved Data
      </h3>
      
      <p style={{
        margin: "0 0 16px 0",
        fontSize: 13,
        color: COLORS.muted,
        fontFamily: COLORS.font,
        lineHeight: 1.5,
      }}>
        Import a previously saved JSON file to restore your assessment or dashboard data.
      </p>

      {/* File Input Container */}
      <div style={{
        position: "relative",
        marginBottom: "12px",
      }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          disabled={status === "loading"}
          style={{
            position: "absolute",
            opacity: 0,
            width: 0,
            height: 0,
            cursor: "pointer",
          }}
        />
        <label
          onClick={() => fileInputRef.current?.click()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 16px",
            borderRadius: 6,
            border: `2px dashed ${COLORS.border}`,
            background: COLORS.bg,
            color: COLORS.navy,
            fontWeight: 600,
            fontSize: 13,
            fontFamily: COLORS.font,
            cursor: status === "loading" ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            opacity: status === "loading" ? 0.6 : 1,
          }}
          onMouseOver={(e) => {
            if (status !== "loading") {
              e.currentTarget.style.borderColor = COLORS.navy;
              e.currentTarget.style.background = "#e0e7ff";
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = COLORS.border;
            e.currentTarget.style.background = COLORS.bg;
          }}
        >
          <span>{status === "loading" ? "⏳ Loading..." : "📤 Choose JSON File"}</span>
        </label>
      </div>

      {/* Status Message */}
      {status && (
        <div style={{
          padding: "10px 12px",
          borderRadius: 6,
          fontSize: 12,
          fontFamily: COLORS.font,
          border: `1px solid ${
            status === "success" ? "#6ee7b7" :
            status === "error" ? "#fca5a5" : COLORS.border
          }`,
          background:
            status === "success" ? COLORS.successBg :
            status === "error" ? COLORS.errorBg : COLORS.bg,
          color:
            status === "success" ? "#047857" :
            status === "error" ? "#991b1b" : COLORS.muted,
        }}>
          {status === "success" && "✓ "}
          {status === "error" && "✕ "}
          {status === "loading" && "⏳ "}
          {message}
        </div>
      )}

      <p style={{
        margin: "12px 0 0 0",
        fontSize: 12,
        color: COLORS.faint,
        fontFamily: COLORS.font,
        fontStyle: "italic",
      }}>
        Supported format: <code style={{ fontFamily: "monospace", background: COLORS.bg, padding: "2px 6px", borderRadius: 3 }}>.json</code>
      </p>
    </div>
  );
}

/* -------------------------------------------------
   Main App component
   ------------------------------------------------- */
function App() {
  /* ---------- 1️⃣ Tab state ---------- */
  const [tab, setTab] = useState("spi");

  /* ---------- 2️⃣ App data state ---------- */
  const [appData, setAppData] = useState(() => {
    try {
      const raw = window.localStorage.getItem("myAppData");
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.warn("Could not parse saved JSON", e);
      return {};
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

  /* ---------- 4️⃣ File upload handler ---------- */
  const handleFileLoaded = (parsedData) => {
    setAppData(parsedData);
  };

  /* ---------- 5️⃣ Render ---------- */
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: COLORS.bg }}>
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

      {/* File Upload Section */}
      <div style={{
        padding: "24px",
        maxWidth: "800px",
        margin: "0 auto",
        width: "100%",
      }} className="no-print">
        <FileUpload onFileLoaded={handleFileLoaded} />
      </div>

      {/* Tab Content */}
      {tab === "spi" ? <WestonSPI2025 appData={appData} /> : <HIRA_DWA appData={appData} />}
    </div>
  );
}

export default App;