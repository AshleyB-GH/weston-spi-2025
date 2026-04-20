import { useState } from 'react';
import WestonSPI2025 from './WestonSPI2025';
import HIRA_DWA from './HIRA_DWA';

const NAV_STYLE = {
  display: 'flex',
  gap: 4,
  padding: '8px 16px',
  background: '#1e3a5f',
  borderBottom: '1px solid #2d527a',
};

function NavTab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 18px',
        borderRadius: 20,
        border: 'none',
        cursor: 'pointer',
        fontSize: 13,
        fontWeight: 600,
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        background: active ? '#ffffff' : 'transparent',
        color: active ? '#1e3a5f' : '#93c5fd',
        transition: 'background 0.15s, color 0.15s',
      }}
    >
      {label}
    </button>
  );
}

function App() {
  const [tab, setTab] = useState('spi');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={NAV_STYLE} className="no-print">
        <NavTab label="SPI Dashboard" active={tab === 'spi'} onClick={() => setTab('spi')} />
        <NavTab label="Risk Assessment (HIRA)" active={tab === 'hira'} onClick={() => setTab('hira')} />
      </nav>
      {tab === 'spi' ? <WestonSPI2025 /> : <HIRA_DWA />}
    </div>
  );
}

export default App;
