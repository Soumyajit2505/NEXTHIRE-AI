import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";
import {
  FiGrid, FiUploadCloud, FiCheckSquare, FiTarget, FiBarChart2,
  FiUsers, FiFileText, FiSettings, FiSearch, FiBell, FiMoon,
  FiChevronDown, FiTrendingUp, FiBriefcase,
  FiUserCheck, FiStar, FiXCircle, FiCode, FiServer,
  FiLayers, FiBarChart, FiEdit3, FiMenu,
} from "react-icons/fi";
import logo from "../assets/images/logo.png";

/* ============================ DATA ============================ */
const navItems = [
  { name: "Dashboard", icon: FiGrid, path: "/dashboard" },
  { name: "Upload Resumes", icon: FiUploadCloud, path: "/upload" },
  { name: "Screening Results", icon: FiCheckSquare, path: "/results" },
  { name: "ATS Results", icon: FiTarget, path: "/ats-results" },
  { name: "Rankings", icon: FiBarChart2, path: "/ranking" },
  { name: "Applicants", icon: FiUsers, path: "/results" },
  { name: "Reports", icon: FiFileText, path: "/ranking" },
  { name: "Settings", icon: FiSettings, path: "/dashboard" },
];

const spark = (seed) =>
  Array.from({ length: 12 }, (_, i) => ({
    v: 20 + Math.round(Math.abs(Math.sin(i * 0.7 + seed) * 40) + i * 2.5),
  }));

const stats = [
  { label: "Total Applicants", value: "12,458", growth: "+18.6%", note: "from last month", icon: FiUsers, color: "#00D9FF", data: spark(1) },
  { label: "Screened Today", value: "342", growth: "+12.4%", note: "from yesterday", icon: FiFileText, color: "#3DD68C", data: spark(2) },
  { label: "Qualified Candidates", value: "1,248", growth: "+8.7%", note: "from last month", icon: FiUserCheck, color: "#B8FF5A", data: spark(3) },
  { label: "Jobs Posted", value: "28", growth: "+5.2%", note: "from last month", icon: FiBriefcase, color: "#8B5CF6", data: spark(4) },
];

const overview = [
  { d: "May 1", v: 320 }, { d: "May 5", v: 410 }, { d: "May 8", v: 480 },
  { d: "May 11", v: 560 }, { d: "May 15", v: 892 }, { d: "May 19", v: 720 },
  { d: "May 22", v: 840 }, { d: "May 26", v: 760 }, { d: "May 29", v: 1080 },
];

const statusData = [
  { name: "Screened", value: 5248, pct: "42%", color: "#00D9FF" },
  { name: "Shortlisted", value: 3246, pct: "26%", color: "#3DD68C" },
  { name: "Rejected", value: 2458, pct: "20%", color: "#F5A524" },
  { name: "Pending", value: 1506, pct: "12%", color: "#8B5CF6" },
];

const activity = [
  { title: "New resume uploaded", sub: "Frontend Developer.pdf", time: "2m ago", icon: FiUploadCloud, color: "#00D9FF" },
  { title: "Resume screened", sub: "Data Scientist.pdf", time: "15m ago", icon: FiCheckSquare, color: "#3DD68C" },
  { title: "Candidate shortlisted", sub: "UI/UX Designer.pdf", time: "32m ago", icon: FiStar, color: "#B8FF5A" },
  { title: "Candidate rejected", sub: "Backend Developer.pdf", time: "1h ago", icon: FiXCircle, color: "#8B5CF6" },
  { title: "New resume uploaded", sub: "ML Engineer.pdf", time: "2h ago", icon: FiUploadCloud, color: "#00D9FF" },
];

const skills = [
  { name: "JavaScript", pct: 85, color: "#00D9FF" },
  { name: "React", pct: 72, color: "#3DD68C" },
  { name: "Python", pct: 65, color: "#B8FF5A" },
  { name: "Node.js", pct: 48, color: "#8B5CF6" },
  { name: "SQL", pct: 40, color: "#6366F1" },
];

const roles = [
  { name: "Frontend Developer", count: "2,548", icon: FiCode },
  { name: "Backend Developer", count: "1,842", icon: FiServer },
  { name: "Full Stack Developer", count: "1,536", icon: FiLayers },
  { name: "Data Scientist", count: "1,248", icon: FiBarChart },
  { name: "UI/UX Designer", count: "942", icon: FiEdit3 },
];

const quickActions = [
  { title: "Upload Resumes", sub: "Add new resumes", icon: FiUploadCloud, color: "#00D9FF" },
  { title: "Screen Resumes", sub: "Start screening", icon: FiUsers, color: "#3DD68C" },
  { title: "View Rankings", sub: "See top candidates", icon: FiBarChart2, color: "#B8FF5A" },
  { title: "Generate Report", sub: "Download reports", icon: FiFileText, color: "#8B5CF6" },
];

const SIDEBAR_W = 264;

/* ============================ STYLES ============================ */
const Styles = () => (
  <style>{`
    .nh-root, .nh-root * { box-sizing: border-box; }

    /* Force the app to ignore any parent max-width / centering from index.css */
    .nh-root {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      font-family: 'Sora','Outfit',ui-sans-serif,system-ui,sans-serif;
      background: #03070D;
      color: #E8EEF5;
      overflow: hidden;
      -webkit-font-smoothing: antialiased;
    }

    .nh-glass {
      background: linear-gradient(160deg,rgba(13,24,36,.82),rgba(7,17,27,.6));
      border: 1px solid rgba(255,255,255,.07);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
    }

    .nh-card {
      transition: transform .4s cubic-bezier(.2,.8,.2,1), box-shadow .4s, border-color .4s;
    }
    .nh-card:hover { transform: translateY(-4px); }

    @keyframes nh-float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
    @keyframes nh-grid   { 0%{background-position:0 0} 100%{background-position:46px 46px} }
    @keyframes nh-pulse  { 0%,100%{opacity:.25} 50%{opacity:.8} }
    @keyframes nh-rise   { 0%{opacity:0;transform:translateY(16px)} 100%{opacity:1;transform:translateY(0)} }
    @keyframes nh-drift  { 0%{transform:translate(0,0)} 50%{transform:translate(16px,-24px)} 100%{transform:translate(0,0)} }
    @keyframes nh-breathe{ 0%,100%{opacity:.55;transform:scale(1)} 50%{opacity:.85;transform:scale(1.06)} }
    @keyframes nh-glow   { 0%,100%{filter:drop-shadow(0 0 16px rgba(0,217,255,.22))} 50%{filter:drop-shadow(0 0 26px rgba(0,217,255,.4))} }

    .nh-rise { animation: nh-rise .7s cubic-bezier(.2,.8,.2,1) both; }

    /* Sidebar nav links: premium translateX + glow on hover */
    .nh-navlink {
      transition: background .3s ease, color .3s ease, transform .3s ease,
                  box-shadow .3s ease, border-color .3s ease;
    }
    .nh-navlink:hover {
      background: rgba(0,217,255,.06);
      color: #fff;
      transform: translateX(4px);
    }
    .nh-navlink:hover .nh-ico { color: #00D9FF; }

    .nh-active {
      background: linear-gradient(90deg,rgba(0,217,255,.12),rgba(184,255,90,.08)) !important;
      border: 1px solid rgba(0,217,255,.28) !important;
      box-shadow: 0 0 20px rgba(0,217,255,.14), inset 0 0 16px rgba(0,217,255,.05);
    }
    .nh-active:hover { transform: translateX(4px); }

    /* Generic soft hover row (activity, roles) */
    .nh-row { transition: background .3s ease, transform .3s ease; }
    .nh-row:hover { background: rgba(255,255,255,.03); transform: translateX(3px); }

    /* Navbar icon buttons */
    .nh-iconbtn {
      transition: background .3s ease, color .3s ease, box-shadow .3s ease, border-color .3s ease;
    }
    .nh-iconbtn:hover {
      background: rgba(0,217,255,.07);
      color: #fff;
      border-color: rgba(0,217,255,.28);
      box-shadow: 0 0 16px rgba(0,217,255,.16);
    }

    .nh-search {
      transition: border-color .3s ease, box-shadow .3s ease, background .3s ease;
    }
    .nh-search:focus-within {
      border-color: rgba(0,217,255,.55) !important;
      background: rgba(7,17,27,.85) !important;
      box-shadow: 0 0 0 3px rgba(0,217,255,.10), 0 0 26px rgba(0,217,255,.16);
    }

    .nh-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
    .nh-scroll::-webkit-scrollbar-thumb { background: rgba(0,217,255,.22); border-radius: 8px; }
    .nh-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0,217,255,.38); }
    .nh-scroll::-webkit-scrollbar-track { background: transparent; }

    .nh-bar-fill { transition: width 1.2s cubic-bezier(.2,.8,.2,1); }

    .nh-overlay { display: none; }

    /* ---- Responsive grid breakpoints ---- */
    .nh-stats {
      display: grid;
      gap: 20px;
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    .nh-charts {
      display: grid;
      gap: 20px;
      grid-template-columns: minmax(0,2fr) minmax(0,1.15fr) minmax(0,1.3fr);
    }
    .nh-bottom {
      display: grid;
      gap: 20px;
      grid-template-columns: minmax(0,1.1fr) minmax(0,1fr) minmax(0,1.4fr);
    }

    /* Laptops / smaller desktops (<= 1366px) */
    @media (max-width: 1366px) {
      .nh-charts { grid-template-columns: minmax(0,1.6fr) minmax(0,1fr); }
      .nh-charts > :nth-child(3) { grid-column: 1 / -1; }
      .nh-bottom { grid-template-columns: minmax(0,1fr) minmax(0,1fr); }
      .nh-bottom > :nth-child(3) { grid-column: 1 / -1; }
    }

    /* Tablets */
    @media (max-width: 1024px) {
      .nh-stats  { grid-template-columns: repeat(2, minmax(0,1fr)); }
      .nh-charts { grid-template-columns: 1fr; }
      .nh-charts > :nth-child(3) { grid-column: auto; }
      .nh-bottom { grid-template-columns: 1fr; }
      .nh-bottom > :nth-child(3) { grid-column: auto; }
      .nh-overlay { display: block; }
    }

    /* Mobile */
    @media (max-width: 560px) {
      .nh-stats { grid-template-columns: 1fr; }
    }
  `}</style>
);

/* ============================ BACKGROUND ============================ */
function NeuralBackground() {
  const orb = (top, left, size, color, delay, dur = 22) => (
    <div style={{
      position: "absolute", top, left, width: size, height: size,
      background: `radial-gradient(circle,${color}38,transparent 70%)`,
      filter: "blur(70px)", borderRadius: "50%",
      animation: `nh-drift ${dur}s ease-in-out ${delay}s infinite`,
    }} />
  );
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 0,
      pointerEvents: "none", overflow: "hidden",
    }}>
      {/* Layered cinematic depth gradients */}
      <div style={{
        position: "absolute", inset: 0,
        background:
          "radial-gradient(circle at 50% 18%, rgba(0,217,255,.12), transparent 45%)," +
          "radial-gradient(circle at 92% 60%, rgba(184,255,90,.10), transparent 40%)," +
          "radial-gradient(circle at 8% 88%, rgba(139,92,246,.10), transparent 42%)," +
          "linear-gradient(180deg,#03070D 0%,#07111B 55%,#03070D 100%)",
      }} />

      {/* Animated neural grid (very soft, 0.03) */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "linear-gradient(rgba(0,217,255,.03) 1px,transparent 1px)," +
          "linear-gradient(90deg,rgba(0,217,255,.03) 1px,transparent 1px)",
        backgroundSize: "46px 46px",
        animation: "nh-grid 30s linear infinite",
        maskImage: "radial-gradient(ellipse 95% 80% at 55% 10%,#000,transparent 85%)",
        WebkitMaskImage: "radial-gradient(ellipse 95% 80% at 55% 10%,#000,transparent 85%)",
      }} />

      {/* Floating glow orbs */}
      {orb("-150px", "52%", "580px", "#00D9FF", 0, 24)}
      {orb("34%", "-170px", "500px", "#8B5CF6", 4, 26)}
      {orb("60%", "76%", "460px", "#B8FF5A", 8, 28)}

      {/* Tiny floating star particles */}
      {Array.from({ length: 38 }).map((_, i) => {
        const c = ["#00D9FF", "#B8FF5A", "#8B5CF6", "#FFFFFF"][i % 4];
        const size = i % 7 === 0 ? 3 : 2;
        return (
          <div key={i} style={{
            position: "absolute",
            top: `${(i * 37) % 100}%`, left: `${(i * 53) % 100}%`,
            width: size, height: size, borderRadius: "50%",
            background: c, boxShadow: `0 0 7px ${c}`,
            opacity: 0.45,
            animation: `nh-pulse ${4 + (i % 6)}s ease-in-out ${i * 0.28}s infinite`,
          }} />
        );
      })}
    </div>
  );
}

/* ============================ SIDEBAR (shared body) ============================ */
function SidebarBody({ active, setActive, navigate, onNavigate }) {
  return (
    <>
      {/* Brand / Logo section */}
      <div style={{
        display: "flex", alignItems: "center", gap: 13,
        padding: "6px 8px 24px",
      }}>
        <div style={{
          position: "relative", flexShrink: 0,
          width: 56, height: 56, borderRadius: 16,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "linear-gradient(150deg,rgba(0,217,255,.16),rgba(139,92,246,.10))",
          border: "1px solid rgba(0,217,255,.25)",
          animation: "nh-glow 6s ease-in-out infinite",
        }}>
          <img src={logo} alt="NextHire AI" style={{
            width: 40, height: 40, borderRadius: 11, objectFit: "cover",
            filter: "drop-shadow(0 0 18px rgba(0,217,255,.25))",
            animation: "nh-float 5s ease-in-out infinite",
          }} />
        </div>
        <div>
          <div style={{
            fontSize: 19, fontWeight: 800, letterSpacing: "-.3px", lineHeight: 1.1,
          }}>
            NextHire <span style={{ color: "#00D9FF" }}>AI</span>
          </div>
          <div style={{
            fontSize: 10.5, color: "#5C7185", fontWeight: 500,
            letterSpacing: ".4px", marginTop: 3, textTransform: "uppercase",
          }}>
            Intelligent Hiring
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        {navItems.map((it) => {
          const on = active === it.name;
          const Icon = it.icon;
          return (
            <button key={it.name}
              onClick={() => { setActive(it.name); navigate(it.path); if (onNavigate) onNavigate(); }}
              className={`nh-navlink ${on ? "nh-active" : ""}`}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 14px", borderRadius: 13, cursor: "pointer",
                border: "1px solid transparent",
                background: "transparent",
                color: on ? "#fff" : "#8FA3B8", fontSize: 14,
                fontWeight: on ? 600 : 500, textAlign: "left", width: "100%",
              }}>
              <Icon className="nh-ico" size={18}
                style={{ color: on ? "#00D9FF" : "#7C92A8" }} />
              {it.name}
            </button>
          );
        })}
      </nav>
    </>
  );
}

/* Floating drawer sidebar (tablet / mobile) */
function Sidebar({ active, setActive, navigate, onClose }) {
  return (
    <aside className="nh-glass nh-scroll" style={{
      width: SIDEBAR_W, flexShrink: 0, height: "100vh",
      display: "flex", flexDirection: "column",
      borderRight: "1px solid rgba(0,217,255,.12)",
      padding: "24px 16px", overflowY: "auto",
      zIndex: 40, position: "fixed", left: 0, top: 0,
    }}>
      <SidebarBody active={active} setActive={setActive} navigate={navigate} onNavigate={onClose} />
    </aside>
  );
}

/* Desktop sidebar: always visible >=1025px, hidden on tablet/mobile. */
function DesktopSidebarSlot({ active, setActive, navigate }) {
  return (
    <>
      <style>{`
        .nh-desktop-sidebar { display: block; }
        @media (max-width: 1024px) { .nh-desktop-sidebar { display: none; } }
      `}</style>
      <aside className="nh-glass nh-scroll" style={{
        position: "relative",
        width: SIDEBAR_W, flexShrink: 0, height: "100vh",
        display: "flex", flexDirection: "column",
        borderRight: "1px solid rgba(0,217,255,.12)",
        padding: "24px 16px", overflowY: "auto",
        overflowX: "hidden",
      }}>
        {/* Neural gradient overlay inside the sidebar */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background:
            "radial-gradient(circle at 30% 0%, rgba(0,217,255,.10), transparent 55%)," +
            "radial-gradient(circle at 80% 100%, rgba(139,92,246,.08), transparent 55%)",
        }} />
        <div style={{ position: "relative", zIndex: 1, display: "flex",
          flexDirection: "column", flex: 1 }}>
          <SidebarBody active={active} setActive={setActive} navigate={navigate} />
        </div>
      </aside>
    </>
  );
}

/* ============================ NAVBAR ============================ */
function Navbar({ toggleSidebar }) {
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 20,
      display: "flex", alignItems: "center", gap: 14,
      padding: "14px 28px",
      background: "rgba(3,7,13,.75)",
      borderBottom: "1px solid rgba(255,255,255,.06)",
      backdropFilter: "blur(18px)",
      WebkitBackdropFilter: "blur(18px)",
      flexShrink: 0,
    }}>
      <button onClick={toggleSidebar} className="nh-iconbtn" style={{
        width: 40, height: 40, borderRadius: 11, cursor: "pointer", flexShrink: 0,
        background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)",
        color: "#8FA3B8", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <FiMenu size={18} />
      </button>

      <div className="nh-search" style={{
        flex: 1, maxWidth: 470, minWidth: 0,
        display: "flex", alignItems: "center", gap: 10,
        padding: "11px 15px", borderRadius: 13,
        background: "rgba(7,17,27,.7)", border: "1px solid rgba(255,255,255,.07)",
      }}>
        <FiSearch size={16} color="#7C92A8" style={{ flexShrink: 0 }} />
        <input placeholder="Search anything..." style={{
          flex: 1, minWidth: 0, background: "transparent", border: "none",
          outline: "none", color: "#E8EEF5", fontSize: 13.5,
        }} />
        <span style={{
          fontSize: 11, color: "#7C92A8", padding: "3px 8px", borderRadius: 6,
          background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)",
          whiteSpace: "nowrap", flexShrink: 0,
        }}>Ctrl + K</span>
      </div>

      <div style={{ flex: 1 }} />

      <button className="nh-iconbtn" style={{
        position: "relative", width: 42, height: 42, borderRadius: 12,
        cursor: "pointer", flexShrink: 0,
        background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)",
        color: "#9FB2C6", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <FiBell size={17} />
        <span style={{
          position: "absolute", top: 8, right: 9, width: 7, height: 7,
          borderRadius: "50%", background: "#00D9FF", boxShadow: "0 0 8px #00D9FF",
          animation: "nh-breathe 3s ease-in-out infinite",
        }} />
      </button>

      <button className="nh-iconbtn" style={{
        width: 42, height: 42, borderRadius: 12, cursor: "pointer", flexShrink: 0,
        background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)",
        color: "#9FB2C6", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <FiMoon size={17} />
      </button>

      <div className="nh-glass" style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "6px 13px 6px 7px", borderRadius: 13, cursor: "pointer", flexShrink: 0,
      }}>
        <div style={{
          width: 35, height: 35, borderRadius: 10,
          background: "linear-gradient(135deg,#00D9FF,#8B5CF6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, color: "#fff", fontSize: 14,
        }}>A</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Admin User</div>
          <div style={{ fontSize: 11, color: "#7C92A8" }}>Administrator</div>
        </div>
        <FiChevronDown size={15} color="#7C92A8" />
      </div>
    </header>
  );
}

/* ============================ STAT CARD ============================ */
function StatCard({ s, i }) {
  const Icon = s.icon;
  return (
    <div className="nh-glass nh-card nh-rise" style={{
      position: "relative", overflow: "hidden",
      borderRadius: 20, padding: 28, animationDelay: `${i * 0.08}s`,
      border: "1px solid rgba(255,255,255,.08)", minWidth: 0,
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(0,217,255,.3)";
        e.currentTarget.style.boxShadow = `0 18px 44px rgba(0,0,0,.42),0 0 30px ${s.color}26`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,.08)";
        e.currentTarget.style.boxShadow = "none";
      }}>
      {/* soft corner glow */}
      <div style={{
        position: "absolute", top: -40, right: -40, width: 140, height: 140,
        background: `radial-gradient(circle,${s.color}1F,transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div style={{ position: "relative", display: "flex", gap: 14 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14, flexShrink: 0,
          background: `linear-gradient(135deg,${s.color}28,${s.color}10)`,
          border: `1px solid ${s.color}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 20px ${s.color}24`,
        }}>
          <Icon size={22} color={s.color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, color: "#8FA3B8", fontWeight: 500 }}>{s.label}</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4, letterSpacing: "-.6px" }}>{s.value}</div>
        </div>
        <div style={{ width: 80, height: 46, marginTop: 2, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={s.data}>
              <defs>
                <linearGradient id={`sg${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={s.color} strokeWidth={2.5}
                fill={`url(#sg${i})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 6, marginTop: 16 }}>
        <FiTrendingUp size={13} color="#3DD68C" />
        <span style={{ fontSize: 12.5, color: "#3DD68C", fontWeight: 600 }}>{s.growth}</span>
        <span style={{ fontSize: 12, color: "#7C92A8" }}>{s.note}</span>
      </div>
    </div>
  );
}

/* ============================ CHART CARD ============================ */
function ChartCard({ title, children, action, delay, glow }) {
  return (
    <div className="nh-glass nh-rise" style={{
      position: "relative", overflow: "hidden",
      borderRadius: 20, padding: 26, animationDelay: `${delay}s`,
      border: "1px solid rgba(255,255,255,.08)", minWidth: 0,
    }}>
      {glow && (
        <div style={{
          position: "absolute", bottom: -80, left: "30%", width: 280, height: 200,
          background: `radial-gradient(ellipse,${glow}1A,transparent 70%)`,
          pointerEvents: "none",
        }} />
      )}
      <div style={{
        position: "relative", display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 20, gap: 12,
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, letterSpacing: "-.2px" }}>{title}</h3>
        {action}
      </div>
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
}

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="nh-glass" style={{
      padding: "10px 14px", borderRadius: 11, border: "1px solid rgba(0,217,255,.3)",
      boxShadow: "0 8px 26px rgba(0,0,0,.55)",
    }}>
      <div style={{ fontSize: 11, color: "#7C92A8" }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#00D9FF" }}>
        {payload[0].value}{" "}
        <span style={{ fontSize: 11, color: "#8FA3B8", fontWeight: 400 }}>Applicants</span>
      </div>
    </div>
  );
};

/* ============================ ACTIVITY CARD ============================ */
function ActivityCard({ a }) {
  return (
    <div className="nh-row" style={{
      display: "flex", alignItems: "center", gap: 13, padding: "12px 12px",
      borderRadius: 13, cursor: "pointer",
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 11, flexShrink: 0,
        background: `linear-gradient(135deg,${a.color}28,${a.color}0D)`,
        border: `1px solid ${a.color}38`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 14px ${a.color}1F`,
      }}>
        <a.icon size={17} color={a.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{a.title}</div>
        <div style={{
          fontSize: 12, color: "#7C92A8", marginTop: 1,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>{a.sub}</div>
      </div>
      <span style={{ fontSize: 11.5, color: "#6B7F94", whiteSpace: "nowrap" }}>{a.time}</span>
    </div>
  );
}

/* ============================ DASHBOARD ============================ */
export default function Dashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="nh-root">
      <Styles />
      <NeuralBackground />

      {/* App shell: sidebar + main, fills the full fixed root */}
      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", width: "100%", height: "100%",
      }}>
        {/* Static sidebar slot (desktop). On tablet/mobile it floats. */}
        <div className="nh-desktop-sidebar" style={{ flexShrink: 0 }}>
          <DesktopSidebarSlot active={active} setActive={setActive} navigate={navigate} />
        </div>

        {/* Mobile / tablet drawer */}
        {sidebarOpen && (
          <>
            <div className="nh-overlay" onClick={() => setSidebarOpen(false)}
              style={{
                position: "fixed", inset: 0, zIndex: 35,
                background: "rgba(0,0,0,.55)", backdropFilter: "blur(2px)",
              }} />
            <Sidebar active={active} setActive={setActive} navigate={navigate}
              onClose={() => setSidebarOpen(false)} />
          </>
        )}

        {/* Main column takes ALL remaining width */}
        <div style={{
          flex: 1, minWidth: 0,
          display: "flex", flexDirection: "column", height: "100%",
        }}>
          <Navbar toggleSidebar={() => setSidebarOpen((o) => !o)} />

          <main className="nh-scroll" style={{
            flex: 1, overflowY: "auto", overflowX: "hidden",
            padding: "30px 34px 44px",
          }}>
            {/* Welcome */}
            <div className="nh-rise" style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 31, fontWeight: 800, margin: 0, letterSpacing: "-.7px" }}>
                Dashboard
              </h1>
              <p style={{ fontSize: 14, color: "#8FA3B8", margin: "7px 0 0" }}>
                Welcome back, Admin! Here's what's happening today.
              </p>
            </div>

            {/* Stats */}
            <div className="nh-stats" style={{ marginBottom: 24 }}>
              {stats.map((s, i) => <StatCard key={s.label} s={s} i={i} />)}
            </div>

            {/* Charts row */}
            <div className="nh-charts" style={{ marginBottom: 24 }}>
              <ChartCard title="Applicants Overview" delay={0.1} glow="#00D9FF"
                action={
                  <div className="nh-glass" style={{
                    display: "flex", alignItems: "center", gap: 7, padding: "8px 13px",
                    borderRadius: 10, fontSize: 12.5, color: "#9FB2C6", cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}>
                    This Month <FiChevronDown size={13} />
                  </div>
                }>
                <div style={{ height: 286, width: "100%" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={overview} margin={{ left: -18, right: 6, top: 6 }}>
                      <defs>
                        <linearGradient id="ovStroke" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#00D9FF" />
                          <stop offset="100%" stopColor="#B8FF5A" />
                        </linearGradient>
                        <linearGradient id="ovFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00D9FF" stopOpacity={0.34} />
                          <stop offset="100%" stopColor="#B8FF5A" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,.05)" vertical={false} />
                      <XAxis dataKey="d" stroke="#5C7185" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis stroke="#5C7185" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#00D9FF", strokeDasharray: "4 4" }} />
                      <Area type="monotone" dataKey="v" stroke="url(#ovStroke)" strokeWidth={4}
                        fill="url(#ovFill)" dot={false}
                        activeDot={{ r: 6, fill: "#00D9FF", stroke: "#03070D", strokeWidth: 3 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              <ChartCard title="Application Status" delay={0.18} glow="#8B5CF6">
                <div style={{
                  display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
                }}>
                  <div style={{ width: 164, height: 204, position: "relative", flexShrink: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={statusData} dataKey="value" innerRadius={58} outerRadius={84}
                          paddingAngle={3} stroke="none">
                          {statusData.map((e) => <Cell key={e.name} fill={e.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{
                      position: "absolute", inset: 0, display: "flex",
                      flexDirection: "column", alignItems: "center", justifyContent: "center",
                    }}>
                      <div style={{ fontSize: 22, fontWeight: 700 }}>12,458</div>
                      <div style={{ fontSize: 11, color: "#7C92A8" }}>Total</div>
                    </div>
                  </div>
                  <div style={{
                    flex: 1, minWidth: 130,
                    display: "flex", flexDirection: "column", gap: 13,
                  }}>
                    {statusData.map((e) => (
                      <div key={e.name} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <span style={{
                          width: 9, height: 9, borderRadius: "50%", background: e.color,
                          boxShadow: `0 0 8px ${e.color}`, flexShrink: 0,
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 600 }}>{e.name}</div>
                          <div style={{ fontSize: 11.5, color: "#7C92A8" }}>
                            {e.value.toLocaleString()} ({e.pct})
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ChartCard>

              <ChartCard title="Recent Activity" delay={0.26}
                action={
                  <span style={{
                    fontSize: 12.5, color: "#00D9FF", cursor: "pointer", fontWeight: 500,
                  }}>
                    View All
                  </span>
                }>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {activity.map((a, i) => <ActivityCard key={i} a={a} />)}
                </div>
              </ChartCard>
            </div>

            {/* Bottom analytics */}
            <div className="nh-bottom">
              <ChartCard title="Top Skills" delay={0.1}>
                <div style={{ display: "flex", flexDirection: "column", gap: 17 }}>
                  {skills.map((s) => (
                    <div key={s.name}>
                      <div style={{
                        display: "flex", justifyContent: "space-between", marginBottom: 8,
                      }}>
                        <span style={{ fontSize: 13, color: "#C5D2DF" }}>{s.name}</span>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{s.pct}%</span>
                      </div>
                      <div style={{
                        height: 7, borderRadius: 6,
                        background: "rgba(255,255,255,.05)", overflow: "hidden",
                      }}>
                        <div className="nh-bar-fill" style={{
                          width: `${s.pct}%`, height: "100%", borderRadius: 6,
                          background: `linear-gradient(90deg,${s.color},${s.color}AA)`,
                          boxShadow: `0 0 12px ${s.color}77`,
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </ChartCard>

              <ChartCard title="Top Job Roles" delay={0.18}>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {roles.map((r) => (
                    <div key={r.name} className="nh-row" style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "11px 12px",
                      borderRadius: 12, cursor: "pointer",
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                        background: "rgba(0,217,255,.08)", border: "1px solid rgba(0,217,255,.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <r.icon size={15} color="#00D9FF" />
                      </div>
                      <span style={{
                        flex: 1, fontSize: 13, color: "#C5D2DF", minWidth: 0,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>{r.name}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#B8FF5A" }}>{r.count}</span>
                    </div>
                  ))}
                </div>
              </ChartCard>

              <ChartCard title="Quick Actions" delay={0.26}>
                <div style={{
                  display: "grid", gap: 14,
                  gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))",
                }}>
                  {quickActions.map((q) => {
                    const navigationMap = {
                      "Upload Resumes": "/upload",
                      "Screen Resumes": "/results",
                      "View Rankings": "/ranking",
                      "Generate Report": "/dashboard",
                    };
                    return (
                    <button key={q.title} className="nh-card" style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                      padding: "22px 12px", borderRadius: 16, cursor: "pointer",
                      background: `linear-gradient(160deg,${q.color}14,rgba(7,17,27,.6))`,
                      border: `1px solid ${q.color}30`, color: "#E8EEF5",
                    }}
                      onClick={() => navigate(navigationMap[q.title] || "/dashboard")}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = `${q.color}88`;
                        e.currentTarget.style.boxShadow = `0 16px 34px rgba(0,0,0,.42),0 0 24px ${q.color}33`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = `${q.color}30`;
                        e.currentTarget.style.boxShadow = "none";
                      }}>
                      <div style={{
                        width: 46, height: 46, borderRadius: 13,
                        background: `linear-gradient(135deg,${q.color}2E,${q.color}10)`,
                        border: `1px solid ${q.color}45`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: `0 0 18px ${q.color}33`,
                      }}>
                        <q.icon size={20} color={q.color} />
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{q.title}</div>
                      <div style={{ fontSize: 11, color: "#7C92A8" }}>{q.sub}</div>
                    </button>
                    );
                  })}
                </div>
              </ChartCard>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}