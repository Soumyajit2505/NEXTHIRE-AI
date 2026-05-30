import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiGrid, FiUploadCloud, FiCheckSquare, FiTarget, FiBarChart2,
  FiUsers, FiFileText, FiSettings, FiSearch, FiBell, FiMoon,
  FiMenu, FiCheck, FiDownload, FiArrowRight, FiFile, FiMail,
  FiPhone, FiMapPin, FiLinkedin, FiGithub, FiCpu, FiCode,
  FiBookOpen, FiBriefcase, FiAward, FiClock, FiGlobe,
} from "react-icons/fi";
import logo from "../assets/images/logo.png";

/* ============================ DATA ============================ */
const navItems = [
  { name: "Dashboard", icon: FiGrid, path: "/dashboard" },
  { name: "Upload Resumes", icon: FiUploadCloud, path: "/upload" },
  { name: "Screening Results", icon: FiCheckSquare, path: "/results" },
  { name: "ATS Results", icon: FiTarget, path: "/ats-results" },
  { name: "Rankings", icon: FiBarChart2, path: "/ranking" },
  { name: "Applicants", icon: FiUsers, path: "/dashboard" },
  { name: "Reports", icon: FiFileText, path: "/dashboard" },
  { name: "Settings", icon: FiSettings, path: "/dashboard" },
];

const tabs = ["Overview", "Skills", "Education", "Experience", "Projects", "Certifications"];

const skills = [
  "Python", "Machine Learning", "Deep Learning", "FastAPI", "SQL",
  "PostgreSQL", "React", "JavaScript", "TensorFlow", "Pandas",
  "NumPy", "Scikit-learn", "Git", "Docker",
];

const matchIndicators = [
  { label: "Skills Extracted", value: 92, icon: FiCode },
  { label: "Projects Found", value: 88, icon: FiFileText },
  { label: "Experience Extracted", value: 90, icon: FiBriefcase },
  { label: "Education Extracted", value: 95, icon: FiBookOpen },
  { label: "Profile Completeness", value: 91, icon: FiUsers },
];

const documentInsights = [
  { label: "Pages Detected", value: "2", icon: FiFileText, valueColor: "#E8EEF5" },
  { label: "Language", value: "English", icon: FiGlobe, valueColor: "#B8FF5A" },
  { label: "File Type", value: "PDF", icon: FiFile, valueColor: "#00D9FF" },
  { label: "Parsing Engine", value: "NextHire AI Parser v2.1", icon: FiCpu, valueColor: "#00D9FF" },
];

const SIDEBAR_W = 248;

/* ============================ STYLES ============================ */
const Styles = () => (
  <style>{`
    .nh-root, .nh-root * { box-sizing: border-box; }

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
      transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s, border-color .35s;
    }
    .nh-card:hover {
      transform: translateY(-3px);
      border-color: rgba(0,217,255,.22);
      box-shadow: 0 16px 36px rgba(0,0,0,.4), 0 0 22px rgba(0,217,255,.1);
    }

    @keyframes nh-float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
    @keyframes nh-grid   { 0%{background-position:0 0} 100%{background-position:46px 46px} }
    @keyframes nh-pulse  { 0%,100%{opacity:.25} 50%{opacity:.8} }
    @keyframes nh-rise   { 0%{opacity:0;transform:translateY(14px)} 100%{opacity:1;transform:translateY(0)} }
    @keyframes nh-drift  { 0%{transform:translate(0,0)} 50%{transform:translate(16px,-24px)} 100%{transform:translate(0,0)} }
    @keyframes nh-breathe{ 0%,100%{opacity:.55;transform:scale(1)} 50%{opacity:.85;transform:scale(1.06)} }
    @keyframes nh-glow   { 0%,100%{filter:drop-shadow(0 0 16px rgba(0,217,255,.22))} 50%{filter:drop-shadow(0 0 26px rgba(0,217,255,.4))} }
    @keyframes nh-spinslow { 0%{transform:rotate(0)} 100%{transform:rotate(360deg)} }
    @keyframes nh-wave {
      0%   { transform: translateX(0) translateY(0); }
      50%  { transform: translateX(-22px) translateY(-8px); }
      100% { transform: translateX(0) translateY(0); }
    }
    @keyframes nh-shine { 0%{ left:-130%; } 60%,100%{ left:130%; } }

    .nh-rise { animation: nh-rise .6s cubic-bezier(.2,.8,.2,1) both; }

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

    .nh-bar-fill { transition: width 1.1s cubic-bezier(.2,.8,.2,1); }

    .nh-tab {
      position: relative;
      transition: color .25s ease;
      cursor: pointer;
      background: transparent;
      border: none;
      padding: 0 0 10px;
      font-family: inherit;
    }
    .nh-tab-underline {
      position: absolute; left: 0; right: 0; bottom: -1px; height: 2px;
      border-radius: 2px;
      background: linear-gradient(90deg,#00D9FF,#B8FF5A);
      box-shadow: 0 0 10px rgba(0,217,255,.5);
    }

    .nh-pill {
      transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease, background .25s ease;
    }
    .nh-pill:hover {
      transform: translateY(-2px);
      border-color: rgba(0,217,255,.5);
      background: rgba(0,217,255,.09);
      box-shadow: 0 0 14px rgba(0,217,255,.22);
    }

    /* gradient buttons */
    .nh-btn-primary {
      position: relative; overflow: hidden;
      transition: transform .3s cubic-bezier(.2,.8,.2,1), box-shadow .3s ease, filter .3s ease;
    }
    .nh-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 30px rgba(0,217,255,.32), 0 0 26px rgba(184,255,90,.22);
      filter: brightness(1.08);
    }
    .nh-btn-primary .nh-shine {
      position: absolute; top: 0; left: -130%;
      width: 55%; height: 100%;
      background: linear-gradient(100deg,transparent,rgba(255,255,255,.5),transparent);
      transform: skewX(-20deg); pointer-events: none;
    }
    .nh-btn-primary:hover .nh-shine { animation: nh-shine 1s ease forwards; }

    .nh-btn-ghost {
      transition: background .3s ease, border-color .3s ease, box-shadow .3s ease, transform .3s ease;
    }
    .nh-btn-ghost:hover {
      transform: translateY(-2px);
      border-color: rgba(0,217,255,.32);
      background: rgba(0,217,255,.06);
      box-shadow: 0 0 16px rgba(0,217,255,.14);
    }

    .nh-overlay { display: none; }

    /* ---- Responsive layout ---- */
    .nh-main-grid {
      display: grid;
      gap: 18px;
      grid-template-columns: 0.9fr 1.8fr 1.1fr;
      align-items: start;
    }
    .nh-fileinfo {
      display: grid;
      gap: 18px;
      align-items: center;
      grid-template-columns: auto 1fr 1fr auto;
    }
    .nh-right-col {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    @media (max-width: 1280px) {
      .nh-main-grid { grid-template-columns: 0.95fr 1.7fr; }
      .nh-right-col { grid-column: 1 / -1; display: grid;
        grid-template-columns: repeat(2, minmax(0,1fr)); gap: 18px; }
    }
    @media (max-width: 1024px) {
      .nh-overlay { display: block; }
      .nh-main-grid { grid-template-columns: 1fr; }
      .nh-right-col { grid-template-columns: 1fr; display: flex; }
      .nh-fileinfo { grid-template-columns: auto 1fr; }
      .nh-fileinfo-hide { display: none !important; }
    }
    @media (max-width: 560px) {
      .nh-fileinfo { grid-template-columns: 1fr; }
    }
  `}</style>
);

/* ============================ BACKGROUND ============================ */
function NeuralBackground() {
  const orb = (top, left, size, color, delay, dur = 24) => (
    <div style={{
      position: "absolute", top, left, width: size, height: size,
      background: `radial-gradient(circle,${color}33,transparent 70%)`,
      filter: "blur(70px)", borderRadius: "50%",
      animation: `nh-drift ${dur}s ease-in-out ${delay}s infinite`,
    }} />
  );
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 0,
      pointerEvents: "none", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background:
          "radial-gradient(circle at 50% 12%, rgba(0,217,255,.12), transparent 46%)," +
          "radial-gradient(circle at 94% 60%, rgba(184,255,90,.10), transparent 42%)," +
          "radial-gradient(circle at 4% 88%, rgba(139,92,246,.11), transparent 44%)," +
          "linear-gradient(180deg,#03070D 0%,#07111B 55%,#03070D 100%)",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "linear-gradient(rgba(0,217,255,.03) 1px,transparent 1px)," +
          "linear-gradient(90deg,rgba(0,217,255,.03) 1px,transparent 1px)",
        backgroundSize: "46px 46px",
        animation: "nh-grid 30s linear infinite",
        maskImage: "radial-gradient(ellipse 100% 90% at 55% 12%,#000,transparent 88%)",
        WebkitMaskImage: "radial-gradient(ellipse 100% 90% at 55% 12%,#000,transparent 88%)",
      }} />
      {orb("-150px", "50%", "560px", "#00D9FF", 0, 24)}
      {orb("34%", "-170px", "480px", "#8B5CF6", 4, 26)}
      {orb("60%", "78%", "440px", "#B8FF5A", 8, 28)}
      {Array.from({ length: 38 }).map((_, i) => {
        const c = ["#00D9FF", "#B8FF5A", "#8B5CF6", "#FFFFFF"][i % 4];
        const size = i % 7 === 0 ? 3 : 2;
        return (
          <div key={i} style={{
            position: "absolute",
            top: `${(i * 37) % 100}%`, left: `${(i * 53) % 100}%`,
            width: size, height: size, borderRadius: "50%",
            background: c, boxShadow: `0 0 7px ${c}`,
            opacity: 0.42,
            animation: `nh-pulse ${4 + (i % 6)}s ease-in-out ${i * 0.28}s infinite`,
          }} />
        );
      })}
    </div>
  );
}

/* ============================ SIDEBAR ============================ */
function SidebarBody({ active, setActive, onNavigate, navigate }) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 8px 18px" }}>
        <div style={{
          position: "relative", flexShrink: 0,
          width: 50, height: 50, borderRadius: 14,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "linear-gradient(150deg,rgba(0,217,255,.16),rgba(139,92,246,.10))",
          border: "1px solid rgba(0,217,255,.25)",
          animation: "nh-glow 6s ease-in-out infinite",
        }}>
          <img src={logo} alt="NextHire AI" style={{
            width: 34, height: 34, borderRadius: 10, objectFit: "cover",
            filter: "drop-shadow(0 0 18px rgba(0,217,255,.25))",
            animation: "nh-float 5s ease-in-out infinite",
          }} />
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-.3px", lineHeight: 1.1 }}>
            NextHire <span style={{ color: "#00D9FF" }}>AI</span>
          </div>
          <div style={{
            fontSize: 10, color: "#5C7185", fontWeight: 500,
            letterSpacing: ".4px", marginTop: 3, textTransform: "uppercase",
          }}>
            Intelligent Hiring
          </div>
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {navItems.map((it) => {
          const on = active === it.name;
          const Icon = it.icon;
          return (
            <button key={it.name}
              onClick={() => { setActive(it.name); navigate(it.path); if (onNavigate) onNavigate(); }}
              className={`nh-navlink ${on ? "nh-active" : ""}`}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 13px", borderRadius: 12, cursor: "pointer",
                border: "1px solid transparent", background: "transparent",
                color: on ? "#fff" : "#8FA3B8", fontSize: 13.5,
                fontWeight: on ? 600 : 500, textAlign: "left", width: "100%",
              }}>
              <Icon className="nh-ico" size={17}
                style={{ color: on ? "#00D9FF" : "#7C92A8" }} />
              {it.name}
            </button>
          );
        })}
      </nav>

      {/* bottom bot card */}
      <div className="nh-glass" style={{
        marginTop: 12, borderRadius: 15, padding: "12px 12px",
        border: "1px solid rgba(0,217,255,.16)",
        display: "flex", alignItems: "center", gap: 11,
        boxShadow: "0 0 22px rgba(0,217,255,.08)",
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "linear-gradient(135deg,rgba(0,217,255,.2),rgba(139,92,246,.14))",
          border: "1px solid rgba(0,217,255,.3)",
          animation: "nh-float 5s ease-in-out infinite",
        }}>
          <FiCpu size={17} color="#00D9FF" />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700 }}>NextHire AI</div>
          <div style={{ fontSize: 10.5, color: "#7C92A8", marginTop: 2, lineHeight: 1.4 }}>
            making hiring smarter with AI
          </div>
        </div>
      </div>
    </>
  );
}

function Sidebar({ active, setActive, navigate, onClose }) {
  return (
    <aside className="nh-glass nh-scroll" style={{
      width: SIDEBAR_W, flexShrink: 0, height: "100vh",
      display: "flex", flexDirection: "column",
      borderRight: "1px solid rgba(0,217,255,.12)",
      padding: "20px 14px", overflowY: "auto",
      zIndex: 40, position: "fixed", left: 0, top: 0,
    }}>
      <SidebarBody active={active} setActive={setActive} navigate={navigate} onNavigate={onClose} />
    </aside>
  );
}

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
        padding: "20px 14px", overflowY: "auto", overflowX: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background:
            "radial-gradient(circle at 30% 0%, rgba(0,217,255,.10), transparent 55%)," +
            "radial-gradient(circle at 80% 100%, rgba(139,92,246,.08), transparent 55%)",
        }} />
        {/* faint neural wave near bottom of sidebar */}
        <div style={{
          position: "absolute", left: -30, right: -30, bottom: 64, height: 190,
          pointerEvents: "none", opacity: 0.5,
          animation: "nh-wave 14s ease-in-out infinite",
          background:
            "radial-gradient(ellipse 60% 80% at 30% 100%, rgba(0,217,255,.16), transparent 70%)," +
            "radial-gradient(ellipse 60% 80% at 80% 100%, rgba(139,92,246,.12), transparent 70%)",
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
      padding: "12px 28px",
      background: "rgba(3,7,13,.75)",
      borderBottom: "1px solid rgba(255,255,255,.06)",
      backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
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
        padding: "10px 15px", borderRadius: 13,
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
        position: "relative", width: 40, height: 40, borderRadius: 12,
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
        width: 40, height: 40, borderRadius: 12, cursor: "pointer", flexShrink: 0,
        background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)",
        color: "#9FB2C6", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <FiMoon size={17} />
      </button>

      <div style={{
        width: 40, height: 40, borderRadius: 12, flexShrink: 0, cursor: "pointer",
        background: "linear-gradient(135deg,#00D9FF,#8B5CF6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, color: "#fff", fontSize: 15,
        boxShadow: "0 0 16px rgba(0,217,255,.28)",
        border: "1px solid rgba(255,255,255,.12)",
      }}>A</div>
    </header>
  );
}

/* ============================ SECTION ICON ============================ */
function SectionIcon({ icon: Icon, color = "#00D9FF" }) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
      background: `linear-gradient(135deg,${color}26,${color}0D)`,
      border: `1px solid ${color}38`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Icon size={14} color={color} />
    </div>
  );
}

/* ============================ FILE INFO BAR ============================ */
function FileInfoBar() {
  return (
    <div className="nh-glass nh-rise" style={{
      borderRadius: 18, padding: "15px 22px", marginBottom: 18,
      border: "1px solid rgba(255,255,255,.08)",
    }}>
      <div className="nh-fileinfo">
        {/* file icon + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 12, flexShrink: 0,
            background: "linear-gradient(135deg,rgba(0,217,255,.18),rgba(0,217,255,.06))",
            border: "1px solid rgba(0,217,255,.32)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <FiFileText size={20} color="#00D9FF" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14.5, fontWeight: 700 }}>john_doe_resume.pdf</span>
              <span style={{
                fontSize: 9.5, fontWeight: 800, letterSpacing: ".4px",
                padding: "3px 7px", borderRadius: 6, color: "#B8FF5A",
                background: "rgba(184,255,90,.12)", border: "1px solid rgba(184,255,90,.3)",
              }}>PDF</span>
            </div>
            <div style={{ fontSize: 11.5, color: "#7C92A8", marginTop: 3 }}>2.4 MB</div>
          </div>
        </div>

        {/* uploaded on */}
        <div className="nh-fileinfo-hide">
          <div style={{
            fontSize: 10.5, color: "#7C92A8", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: ".4px",
          }}>Uploaded On</div>
          <div style={{ fontSize: 13, color: "#C5D2DF", marginTop: 4 }}>
            25 May 2026, 03:28 PM
          </div>
        </div>

        {/* parsed on */}
        <div className="nh-fileinfo-hide">
          <div style={{
            fontSize: 10.5, color: "#7C92A8", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: ".4px",
          }}>Parsed On</div>
          <div style={{ fontSize: 13, color: "#C5D2DF", marginTop: 4 }}>
            25 May 2026, 03:30 PM
          </div>
        </div>

        {/* status badge */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8, justifySelf: "end",
          padding: "8px 14px", borderRadius: 10, whiteSpace: "nowrap",
          background: "rgba(61,214,140,.1)", border: "1px solid rgba(61,214,140,.3)",
        }}>
          <span style={{
            width: 17, height: 17, borderRadius: "50%",
            background: "linear-gradient(135deg,#3DD68C,#1FA968)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 10px rgba(61,214,140,.5)",
          }}>
            <FiCheck size={10} color="#03070D" strokeWidth={3} />
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#3DD68C" }}>
            Parsing Completed
          </span>
        </div>
      </div>
    </div>
  );
}

/* ============================ CANDIDATE PROFILE ============================ */
function ContactRow({ icon: Icon, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 27, height: 27, borderRadius: 8, flexShrink: 0,
        background: "rgba(0,217,255,.07)", border: "1px solid rgba(0,217,255,.16)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={12.5} color="#00D9FF" />
      </div>
      <span style={{
        fontSize: 12, color: "#C5D2DF", overflow: "hidden",
        textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>{text}</span>
    </div>
  );
}

function CandidateProfile() {
  return (
    <div className="nh-glass nh-card nh-rise" style={{
      borderRadius: 20, padding: 20, border: "1px solid rgba(255,255,255,.08)",
    }}>
      <h3 style={{ fontSize: 14.5, fontWeight: 700, margin: "0 0 16px", letterSpacing: "-.2px" }}>
        Candidate Profile
      </h3>

      {/* avatar */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        <div style={{
          position: "relative", width: 94, height: 94, borderRadius: "50%",
          padding: 3,
          background: "linear-gradient(135deg,#00D9FF,#B8FF5A)",
          boxShadow: "0 0 24px rgba(0,217,255,.3)",
        }}>
          <div style={{
            width: "100%", height: "100%", borderRadius: "50%",
            background: "#0A1622", overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "3px solid #03070D",
          }}>
            <div style={{
              width: "100%", height: "100%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "linear-gradient(135deg,rgba(0,217,255,.22),rgba(139,92,246,.18))",
              fontSize: 30, fontWeight: 800, color: "#E8EEF5",
            }}>JD</div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-.4px" }}>John Doe</div>
        <div style={{ fontSize: 12.5, color: "#00D9FF", marginTop: 3, fontWeight: 500 }}>
          AI Engineer
        </div>
      </div>

      {/* contact list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        <ContactRow icon={FiMail} text="johndoe@email.com" />
        <ContactRow icon={FiPhone} text="+91 98765 43210" />
        <ContactRow icon={FiMapPin} text="Bangalore, India" />
        <ContactRow icon={FiLinkedin} text="linkedin.com/in/johndoe" />
        <ContactRow icon={FiGithub} text="github.com/johndoe" />
      </div>

      {/* total experience */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 14px", borderRadius: 13,
        background: "rgba(184,255,90,.05)", border: "1px solid rgba(184,255,90,.18)",
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: "linear-gradient(135deg,rgba(184,255,90,.2),rgba(184,255,90,.06))",
          border: "1px solid rgba(184,255,90,.34)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <FiClock size={16} color="#B8FF5A" />
        </div>
        <div>
          <div style={{ fontSize: 11.5, color: "#7C92A8" }}>Total Experience</div>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: "#B8FF5A", marginTop: 2 }}>
            2.5 Years
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================ EXTRACTED INFORMATION ============================ */
function ExtractedInformation() {
  const [tab, setTab] = useState("Overview");

  return (
    <div className="nh-glass nh-rise" style={{
      borderRadius: 20, padding: 20, border: "1px solid rgba(255,255,255,.08)",
      animationDelay: ".06s",
    }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 15 }}>
        <SectionIcon icon={FiCpu} />
        <h3 style={{ fontSize: 14.5, fontWeight: 700, margin: 0, letterSpacing: "-.2px" }}>
          Extracted Information
        </h3>
      </div>

      {/* tabs */}
      <div style={{
        display: "flex", gap: 24, flexWrap: "wrap",
        borderBottom: "1px solid rgba(255,255,255,.07)", marginBottom: 18,
      }}>
        {tabs.map((t) => {
          const on = tab === t;
          return (
            <button key={t} className="nh-tab" onClick={() => setTab(t)}
              style={{
                fontSize: 13, fontWeight: on ? 700 : 500,
                color: on ? "#fff" : "#7C92A8",
              }}>
              {t}
              {on && <span className="nh-tab-underline" />}
            </button>
          );
        })}
      </div>

      {tab === "Overview" && <OverviewContent />}
      {tab === "Skills" && <SkillsBlock standalone />}
      {tab === "Education" && <EducationBlock standalone />}
      {tab === "Experience" && <ExperienceBlock standalone />}
      {tab === "Projects" && <EmptyTab label="Projects" />}
      {tab === "Certifications" && <EmptyTab label="Certifications" />}
    </div>
  );
}

function OverviewContent() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Professional Summary */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 11 }}>
          <SectionIcon icon={FiFileText} color="#00D9FF" />
          <h4 style={{ fontSize: 13.5, fontWeight: 700, margin: 0 }}>Professional Summary</h4>
        </div>
        <p style={{
          fontSize: 12.5, color: "#9FB2C6", lineHeight: 1.65, margin: 0,
        }}>
          AI Engineer with strong background in machine learning, backend development
          and data analysis. Skilled in building AI powered applications and working
          with modern technologies to solve real world problems.
        </p>
      </div>

      <SkillsBlock />
      <EducationBlock />
      <ExperienceBlock />
    </div>
  );
}

function SkillsBlock({ standalone }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 11 }}>
        <SectionIcon icon={FiCode} color="#00D9FF" />
        <h4 style={{ fontSize: 13.5, fontWeight: 700, margin: 0 }}>Skills</h4>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {skills.map((s) => (
          <span key={s} className="nh-pill" style={{
            fontSize: 11.5, fontWeight: 500, color: "#C5D2DF",
            padding: "6px 12px", borderRadius: 999, cursor: "default",
            background: "rgba(0,217,255,.05)",
            border: "1px solid rgba(0,217,255,.22)",
          }}>{s}</span>
        ))}
      </div>
      {standalone && (
        <p style={{ fontSize: 11.5, color: "#7C92A8", marginTop: 12 }}>
          14 skills extracted from the resume across AI, backend and data domains.
        </p>
      )}
    </div>
  );
}

function EducationBlock() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 11 }}>
        <SectionIcon icon={FiBookOpen} color="#B8FF5A" />
        <h4 style={{ fontSize: 13.5, fontWeight: 700, margin: 0 }}>Education</h4>
      </div>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", gap: 14,
      }}>
        <div>
          <div style={{ fontSize: 12.8, fontWeight: 600, color: "#E8EEF5" }}>
            Bachelor of Technology in Computer Engineering
          </div>
          <div style={{ fontSize: 11.8, color: "#7C92A8", marginTop: 3 }}>
            Madanapalle Institute of Technology &amp; Science, Andhra Pradesh
          </div>
        </div>
        <span style={{
          fontSize: 11.8, fontWeight: 600, color: "#B8FF5A",
          whiteSpace: "nowrap", flexShrink: 0,
        }}>2023 - 2027</span>
      </div>
    </div>
  );
}

function ExperienceBlock() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 11 }}>
        <SectionIcon icon={FiBriefcase} color="#00D9FF" />
        <h4 style={{ fontSize: 13.5, fontWeight: 700, margin: 0 }}>Experience</h4>
      </div>
      <div style={{ display: "flex", gap: 13 }}>
        {/* timeline rail */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
          <span style={{
            width: 11, height: 11, borderRadius: "50%", marginTop: 3,
            background: "linear-gradient(135deg,#00D9FF,#0093C4)",
            boxShadow: "0 0 10px rgba(0,217,255,.5)",
          }} />
          <div style={{
            width: 2, flex: 1, marginTop: 4,
            background: "linear-gradient(180deg,rgba(0,217,255,.45),transparent)",
          }} />
        </div>
        <div style={{
          flex: 1, display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", gap: 14,
        }}>
          <div>
            <div style={{ fontSize: 12.8, fontWeight: 600, color: "#E8EEF5" }}>
              AI Engineer Intern
            </div>
            <div style={{ fontSize: 11.8, color: "#7C92A8", marginTop: 3 }}>
              Pratinik INFOTECH
            </div>
          </div>
          <span style={{
            fontSize: 11.8, fontWeight: 600, color: "#00D9FF",
            whiteSpace: "nowrap", flexShrink: 0,
          }}>Jan 2025 - Apr 2025</span>
        </div>
      </div>
    </div>
  );
}

function EmptyTab({ label }) {
  return (
    <div style={{
      padding: "38px 20px", textAlign: "center",
      color: "#7C92A8", fontSize: 12.5,
    }}>
      <div style={{
        width: 46, height: 46, borderRadius: 13, margin: "0 auto 12px",
        background: "rgba(0,217,255,.06)", border: "1px solid rgba(0,217,255,.18)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <FiAward size={21} color="#00D9FF" />
      </div>
      {label} details will appear here once extracted.
    </div>
  );
}

/* ============================ AI RESUME SUMMARY ============================ */
function AISummary() {
  return (
    <div className="nh-glass nh-card nh-rise" style={{
      position: "relative", overflow: "hidden",
      borderRadius: 20, padding: 20, border: "1px solid rgba(255,255,255,.08)",
      animationDelay: ".1s",
    }}>
      {/* neural glow illustration */}
      <div style={{
        position: "absolute", top: -18, right: -26, width: 180, height: 180,
        pointerEvents: "none", opacity: 0.85,
      }}>
        <div style={{
          position: "absolute", inset: 36, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(184,255,90,.22),transparent 70%)",
          filter: "blur(8px)",
        }} />
        <svg viewBox="0 0 120 120" width="180" height="180"
          style={{ animation: "nh-spinslow 60s linear infinite" }}>
          {[
            [60, 30], [80, 45], [88, 68], [72, 86], [48, 88],
            [32, 70], [30, 46], [50, 52], [66, 60], [58, 74],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.6 : 1.8}
              fill={i % 2 === 0 ? "#00D9FF" : "#B8FF5A"} opacity="0.9" />
          ))}
          {[
            [60, 30, 80, 45], [80, 45, 88, 68], [88, 68, 72, 86],
            [72, 86, 48, 88], [48, 88, 32, 70], [32, 70, 30, 46],
            [30, 46, 60, 30], [50, 52, 66, 60], [66, 60, 58, 74],
            [58, 74, 50, 52], [50, 52, 30, 46], [66, 60, 80, 45],
          ].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#00D9FF" strokeWidth="0.6" opacity="0.4" />
          ))}
        </svg>
      </div>

      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <SectionIcon icon={FiCpu} color="#00D9FF" />
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>AI Resume Summary</h3>
      </div>
      <p style={{
        position: "relative", fontSize: 12, color: "#9FB2C6",
        lineHeight: 1.65, margin: 0, maxWidth: "84%",
      }}>
        John is an AI Engineer with a strong foundation in machine learning, backend
        development and data analysis. He has hands on experience in building AI powered
        applications using Python, FastAPI and modern ML frameworks. His projects
        demonstrate problem solving ability and end to end development skills.
      </p>
    </div>
  );
}

/* ============================ MATCH INDICATORS ============================ */
function MatchIndicators() {
  return (
    <div className="nh-glass nh-card nh-rise" style={{
      borderRadius: 20, padding: 20, border: "1px solid rgba(255,255,255,.08)",
      animationDelay: ".14s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 15 }}>
        <SectionIcon icon={FiBarChart2} color="#00D9FF" />
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Resume Match Indicators</h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        {matchIndicators.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label}>
              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between", marginBottom: 6,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <Icon size={13.5} color="#00D9FF" />
                  <span style={{ fontSize: 12, color: "#C5D2DF" }}>{m.label}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#B8FF5A" }}>
                  {m.value}%
                </span>
              </div>
              <div style={{
                height: 6, borderRadius: 5,
                background: "rgba(255,255,255,.06)", overflow: "hidden",
              }}>
                <div className="nh-bar-fill" style={{
                  width: `${m.value}%`, height: "100%", borderRadius: 5,
                  background: "linear-gradient(90deg,#00D9FF,#B8FF5A)",
                  boxShadow: "0 0 10px rgba(0,217,255,.45)",
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================ DOCUMENT INSIGHTS ============================ */
function DocumentInsights() {
  return (
    <div className="nh-glass nh-card nh-rise" style={{
      borderRadius: 20, padding: 20, border: "1px solid rgba(255,255,255,.08)",
      animationDelay: ".18s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 13 }}>
        <SectionIcon icon={FiFileText} color="#00D9FF" />
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Document Insights</h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {documentInsights.map((d, i) => {
          const Icon = d.icon;
          const last = i === documentInsights.length - 1;
          return (
            <div key={d.label} style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: last ? "none" : "1px solid rgba(255,255,255,.05)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Icon size={13.5} color="#7C92A8" />
                <span style={{ fontSize: 12, color: "#9FB2C6" }}>{d.label}</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: d.valueColor }}>
                {d.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================ RESULTS PAGE ============================ */
export default function Results() {
  const navigate = useNavigate();
  const [active, setActive] = useState("Screening Results");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="nh-root">
      <Styles />
      <NeuralBackground />

      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", width: "100%", height: "100%",
      }}>
        <div className="nh-desktop-sidebar" style={{ flexShrink: 0 }}>
          <DesktopSidebarSlot active={active} setActive={setActive} navigate={navigate} />
        </div>

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

        <div style={{
          flex: 1, minWidth: 0,
          display: "flex", flexDirection: "column", height: "100%",
        }}>
          <Navbar toggleSidebar={() => setSidebarOpen((o) => !o)} />

          <main className="nh-scroll" style={{
            flex: 1, overflowY: "auto", overflowX: "hidden",
            padding: "18px 28px 28px",
          }}>
            {/* Header */}
            <div className="nh-rise" style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 16,
            }}>
              <div>
                <h1 style={{ fontSize: 25, fontWeight: 800, margin: 0, letterSpacing: "-.6px" }}>
                  Resume Analysis Results
                </h1>
                <p style={{ fontSize: 13, color: "#8FA3B8", margin: "5px 0 0" }}>
                  AI has successfully parsed and extracted information from the resume.
                </p>
              </div>

              <div style={{ display: "flex", gap: 11, flexWrap: "wrap" }}>
                <button className="nh-btn-ghost nh-glass" style={{
                  display: "flex", alignItems: "center", gap: 9, cursor: "pointer",
                  padding: "10px 16px", borderRadius: 11, fontSize: 12.5, fontWeight: 600,
                  color: "#C5D2DF", border: "1px solid rgba(255,255,255,.1)",
                }}>
                  <FiDownload size={14} />
                  Download Parsed Data
                </button>
                <button className="nh-btn-primary" style={{
                  display: "flex", alignItems: "center", gap: 9, cursor: "pointer",
                  padding: "10px 18px", borderRadius: 11, border: "none",
                  fontSize: 12.5, fontWeight: 700, color: "#03070D",
                  background: "linear-gradient(100deg,#00D9FF,#B8FF5A)",
                  boxShadow: "0 8px 22px rgba(0,217,255,.24)",
                }} onClick={() => navigate("/ats-results")}>
                  <span className="nh-shine" />
                  <span style={{ position: "relative", display: "flex",
                    alignItems: "center", gap: 9 }}>
                    Proceed to ATS Analysis <FiArrowRight size={14} />
                  </span>
                </button>
              </div>
            </div>

            {/* File info bar */}
            <FileInfoBar />

            {/* Three column layout */}
            <div className="nh-main-grid">
              <CandidateProfile />
              <ExtractedInformation />
              <div className="nh-right-col">
                <AISummary />
                <MatchIndicators />
                <DocumentInsights />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}