import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiGrid, FiUploadCloud, FiCheckSquare, FiTarget, FiBarChart2,
  FiUsers, FiFileText, FiSettings, FiSearch, FiBell, FiMoon,
  FiMenu, FiCheck, FiShield, FiArrowRight, FiEye, FiMoreVertical, FiFile,
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

const pipeline = [
  { title: "Resume Uploaded", desc: "File received successfully", state: "done" },
  { title: "Parsing Resume", desc: "Extracting text and structure", state: "current" },
  { title: "Extracting Skills", desc: "Identifying skills and keywords", state: "pending" },
  { title: "AI Analysis", desc: "Running intelligent analysis", state: "pending" },
  { title: "Ready for Screening", desc: "Resume is ready to review", state: "pending" },
];

const features = [
  { title: "AI Powered Parsing", desc: "Extracts text, experience and education automatically.", icon: FiFileText, color: "#8B5CF6" },
  { title: "Skill Extraction", desc: "Identifies skills, technologies and keywords instantly.", icon: FiTarget, color: "#00D9FF" },
  { title: "Smart Matching", desc: "Matches candidate profiles with job requirements.", icon: FiBarChart2, color: "#B8FF5A" },
  { title: "Secure & Private", desc: "Your data stays encrypted and fully confidential.", icon: FiShield, color: "#3DD68C" },
];

const recentUploads = [
  { file: "john_doe_resume.pdf", size: "2.4 MB", type: "PDF", candidate: "John Doe", date: "25 May 2026, 03:28 PM", status: "Parsing Resume", statusColor: "#00D9FF", progress: 30, barColor: "#00D9FF" },
  { file: "sarah_smith_resume.docx", size: "1.8 MB", type: "DOCX", candidate: "Sarah Smith", date: "25 May 2026, 02:15 PM", status: "Extracting Skills", statusColor: "#3DD68C", progress: 65, barColor: "#3DD68C" },
  { file: "michael_brown_resume.pdf", size: "2.1 MB", type: "PDF", candidate: "Michael Brown", date: "25 May 2026, 01:47 PM", status: "AI Analysis", statusColor: "#F5A524", progress: 80, barColor: "#F5A524" },
];

const SIDEBAR_W = 264;

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
      transition: transform .4s cubic-bezier(.2,.8,.2,1), box-shadow .4s, border-color .4s;
    }
    .nh-card:hover { transform: translateY(-5px); }

    @keyframes nh-float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
    @keyframes nh-grid   { 0%{background-position:0 0} 100%{background-position:46px 46px} }
    @keyframes nh-pulse  { 0%,100%{opacity:.25} 50%{opacity:.8} }
    @keyframes nh-rise   { 0%{opacity:0;transform:translateY(16px)} 100%{opacity:1;transform:translateY(0)} }
    @keyframes nh-drift  { 0%{transform:translate(0,0)} 50%{transform:translate(16px,-24px)} 100%{transform:translate(0,0)} }
    @keyframes nh-breathe{ 0%,100%{opacity:.55;transform:scale(1)} 50%{opacity:.85;transform:scale(1.06)} }
    @keyframes nh-glow   { 0%,100%{filter:drop-shadow(0 0 16px rgba(0,217,255,.22))} 50%{filter:drop-shadow(0 0 26px rgba(0,217,255,.4))} }
    @keyframes nh-cloud  { 0%,100%{transform:translateY(0);filter:drop-shadow(0 0 22px rgba(0,217,255,.35))}
                           50%{transform:translateY(-7px);filter:drop-shadow(0 0 34px rgba(184,255,90,.4))} }
    @keyframes nh-ring   { 0%{transform:scale(.85);opacity:.7} 100%{transform:scale(1.5);opacity:0} }
    @keyframes nh-spin   { 0%{transform:rotate(0)} 100%{transform:rotate(360deg)} }

    /* cinematic rotating border glow for the drop zone */
    @keyframes nh-borderspin { 0%{transform:rotate(0)} 100%{transform:rotate(360deg)} }
    @keyframes nh-wave {
      0%   { transform: translateX(0)   translateY(0); }
      50%  { transform: translateX(-24px) translateY(-8px); }
      100% { transform: translateX(0)   translateY(0); }
    }
    /* shine sweep for the browse button */
    @keyframes nh-shine { 0%{ left:-130%; } 60%,100%{ left:130%; } }
    /* gentle active pulse for progress nodes */
    @keyframes nh-nodepulse {
      0%,100% { box-shadow: 0 0 14px rgba(0,217,255,.4); }
      50%     { box-shadow: 0 0 24px rgba(0,217,255,.7); }
    }
    /* flowing energy on the active connector */
    @keyframes nh-flow { 0%{background-position:0 0} 100%{background-position:0 22px} }

    .nh-rise { animation: nh-rise .7s cubic-bezier(.2,.8,.2,1) both; }

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

    .nh-row { transition: background .3s ease, box-shadow .3s ease, transform .3s ease; }
    .nh-row:hover {
      background: rgba(0,217,255,.04);
      box-shadow: inset 0 0 0 1px rgba(0,217,255,.14), 0 0 18px rgba(0,217,255,.08);
    }

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

    /* browse button */
    .nh-browse {
      transition: transform .3s cubic-bezier(.2,.8,.2,1), box-shadow .3s ease, filter .3s ease;
    }
    .nh-browse:hover {
      transform: translateY(-2px) scale(1.04);
      box-shadow: 0 16px 34px rgba(0,217,255,.34), 0 0 30px rgba(184,255,90,.26);
      filter: brightness(1.1);
    }
    .nh-browse .nh-shine {
      position: absolute; top: 0; left: -130%;
      width: 55%; height: 100%;
      background: linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);
      transform: skewX(-20deg);
      pointer-events: none;
    }
    .nh-browse:hover .nh-shine { animation: nh-shine 1s ease forwards; }

    .nh-dropzone { transition: border-color .35s ease, box-shadow .35s ease, background .35s ease; }
    .nh-dropzone.drag {
      border-color: rgba(0,217,255,.7) !important;
      background: rgba(0,217,255,.05) !important;
      box-shadow: inset 0 0 60px rgba(0,217,255,.12), 0 0 48px rgba(0,217,255,.2);
    }

    .nh-overlay { display: none; }

    /* ---- Responsive grid breakpoints ---- */
    .nh-upload-grid {
      display: grid;
      gap: 22px;
      grid-template-columns: minmax(0,1fr) 340px;
    }
    .nh-feature-grid {
      display: grid;
      gap: 18px;
      grid-template-columns: repeat(4, minmax(0,1fr));
    }
    .nh-table-row {
      display: grid;
      gap: 14px;
      align-items: center;
      grid-template-columns: 2fr 1.2fr 1.6fr 1.2fr 1.4fr 92px;
    }

    @media (max-width: 1180px) {
      .nh-upload-grid { grid-template-columns: 1fr; }
      .nh-feature-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
    }

    @media (max-width: 1024px) {
      .nh-overlay { display: block; }
      .nh-table-cell-hide { display: none !important; }
      .nh-table-row { grid-template-columns: 2fr 1.4fr 1.4fr 80px; }
    }

    @media (max-width: 560px) {
      .nh-feature-grid { grid-template-columns: 1fr; }
      .nh-table-row { grid-template-columns: 2fr 1.3fr 70px; }
    }
  `}</style>
);

/* ============================ BACKGROUND ============================ */
function NeuralBackground() {
  const orb = (top, left, size, color, delay, dur = 24) => (
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
      <div style={{
        position: "absolute", inset: 0,
        background:
          "radial-gradient(circle at 50% 18%, rgba(0,217,255,.13), transparent 45%)," +
          "radial-gradient(circle at 92% 60%, rgba(184,255,90,.11), transparent 40%)," +
          "radial-gradient(circle at 8% 88%, rgba(139,92,246,.11), transparent 42%)," +
          "linear-gradient(180deg,#03070D 0%,#07111B 55%,#03070D 100%)",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "linear-gradient(rgba(0,217,255,.035) 1px,transparent 1px)," +
          "linear-gradient(90deg,rgba(0,217,255,.035) 1px,transparent 1px)",
        backgroundSize: "46px 46px",
        animation: "nh-grid 30s linear infinite",
        maskImage: "radial-gradient(ellipse 95% 80% at 55% 10%,#000,transparent 85%)",
        WebkitMaskImage: "radial-gradient(ellipse 95% 80% at 55% 10%,#000,transparent 85%)",
      }} />
      {orb("-150px", "52%", "580px", "#00D9FF", 0, 24)}
      {orb("34%", "-170px", "500px", "#8B5CF6", 4, 26)}
      {orb("60%", "76%", "460px", "#B8FF5A", 8, 28)}
      {Array.from({ length: 42 }).map((_, i) => {
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

/* ============================ SIDEBAR ============================ */
function SidebarBody({ active, setActive, onNavigate, navigate }) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 13, padding: "4px 8px 20px" }}>
        <div style={{
          position: "relative", flexShrink: 0,
          width: 54, height: 54, borderRadius: 16,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "linear-gradient(150deg,rgba(0,217,255,.16),rgba(139,92,246,.10))",
          border: "1px solid rgba(0,217,255,.25)",
          animation: "nh-glow 6s ease-in-out infinite",
        }}>
          <img src={logo} alt="NextHire AI" style={{
            width: 38, height: 38, borderRadius: 11, objectFit: "cover",
            filter: "drop-shadow(0 0 18px rgba(0,217,255,.25))",
            animation: "nh-float 5s ease-in-out infinite",
          }} />
        </div>
        <div>
          <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-.3px", lineHeight: 1.1 }}>
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
                padding: "10px 14px", borderRadius: 12, cursor: "pointer",
                border: "1px solid transparent", background: "transparent",
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

function Sidebar({ active, setActive, navigate, onClose }) {
  return (
    <aside className="nh-glass nh-scroll" style={{
      width: SIDEBAR_W, flexShrink: 0, height: "100vh",
      display: "flex", flexDirection: "column",
      borderRight: "1px solid rgba(0,217,255,.12)",
      padding: "22px 16px", overflowY: "auto",
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
        padding: "22px 16px", overflowY: "auto", overflowX: "hidden",
      }}>
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
      padding: "13px 28px",
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

      {/* Notification icon */}
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

      {/* Theme icon */}
      <button className="nh-iconbtn" style={{
        width: 42, height: 42, borderRadius: 12, cursor: "pointer", flexShrink: 0,
        background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)",
        color: "#9FB2C6", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <FiMoon size={17} />
      </button>

      {/* Compact avatar only (Admin User text/card removed) */}
      <div style={{
        width: 42, height: 42, borderRadius: 12, flexShrink: 0, cursor: "pointer",
        background: "linear-gradient(135deg,#00D9FF,#8B5CF6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, color: "#fff", fontSize: 15,
        boxShadow: "0 0 16px rgba(0,217,255,.28)",
        border: "1px solid rgba(255,255,255,.12)",
      }}>A</div>
    </header>
  );
}

/* ============================ DROP ZONE ============================ */
function DropZone() {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);

  return (
    <div
      className={`nh-dropzone nh-rise ${drag ? "drag" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); }}
      style={{
        position: "relative", overflow: "hidden",
        borderRadius: 26, padding: "50px 30px",
        minHeight: 372,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "linear-gradient(160deg,rgba(13,24,36,.7),rgba(7,17,27,.55))",
        border: "2px dashed rgba(0,217,255,.34)",
        boxShadow: "inset 0 0 60px rgba(0,217,255,.05)",
      }}>
      {/* cinematic rotating cyan/lime border glow */}
      <div style={{
        position: "absolute", inset: -1, borderRadius: 26,
        padding: 2, pointerEvents: "none",
        background: "conic-gradient(from 0deg, transparent 0deg, rgba(0,217,255,.55) 70deg, rgba(184,255,90,.55) 150deg, transparent 220deg, transparent 360deg)",
        WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor", maskComposite: "exclude",
        animation: "nh-borderspin 9s linear infinite",
        opacity: 0.7,
      }} />

      {/* gentle neural wave/mesh inside the box */}
      <div style={{
        position: "absolute", left: -40, right: -40, bottom: -10, height: 220,
        pointerEvents: "none", opacity: 0.55,
        animation: "nh-wave 12s ease-in-out infinite",
        background:
          "radial-gradient(ellipse 50% 90% at 18% 100%, rgba(0,217,255,.18), transparent 70%)," +
          "radial-gradient(ellipse 50% 90% at 55% 100%, rgba(139,92,246,.14), transparent 70%)," +
          "radial-gradient(ellipse 50% 90% at 88% 100%, rgba(184,255,90,.18), transparent 70%)",
      }} />
      {/* faint mesh grid inside */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.5,
        backgroundImage:
          "linear-gradient(rgba(0,217,255,.05) 1px,transparent 1px)," +
          "linear-gradient(90deg,rgba(0,217,255,.05) 1px,transparent 1px)",
        backgroundSize: "34px 34px",
        maskImage: "radial-gradient(ellipse 70% 70% at 50% 45%,#000,transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 45%,#000,transparent 80%)",
      }} />

      {/* soft drifting inner particles */}
      {Array.from({ length: 18 }).map((_, i) => {
        const c = ["#00D9FF", "#B8FF5A", "#8B5CF6"][i % 3];
        return (
          <div key={i} style={{
            position: "absolute",
            top: `${(i * 29) % 100}%`, left: `${(i * 41) % 100}%`,
            width: i % 5 === 0 ? 3 : 2, height: i % 5 === 0 ? 3 : 2,
            borderRadius: "50%",
            background: c, boxShadow: `0 0 7px ${c}`, opacity: 0.45,
            animation: `nh-pulse ${4 + (i % 5)}s ease-in-out ${i * 0.3}s infinite`,
          }} />
        );
      })}

      {/* glowing cloud icon */}
      <div style={{ position: "relative", marginBottom: 22 }}>
        <span style={{
          position: "absolute", inset: -14, borderRadius: "50%",
          border: "2px solid rgba(0,217,255,.35)",
          animation: "nh-ring 2.6s ease-out infinite",
        }} />
        <div style={{
          width: 94, height: 94, borderRadius: 24,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "linear-gradient(135deg,rgba(0,217,255,.16),rgba(184,255,90,.10))",
          border: "1px solid rgba(0,217,255,.3)",
          animation: "nh-cloud 4s ease-in-out infinite",
        }}>
          <FiUploadCloud size={45} color="#00D9FF" />
        </div>
      </div>

      <h2 style={{
        position: "relative", fontSize: 24, fontWeight: 700,
        margin: 0, letterSpacing: "-.4px", textAlign: "center",
      }}>
        Drag &amp; drop your resume here
      </h2>
      <div style={{ position: "relative", fontSize: 13, color: "#7C92A8", margin: "13px 0" }}>
        or
      </div>

      <input ref={inputRef} type="file" accept=".pdf,.docx" hidden />
      <button className="nh-browse" onClick={() => inputRef.current && inputRef.current.click()}
        style={{
          position: "relative", overflow: "hidden", cursor: "pointer",
          padding: "14px 38px", borderRadius: 13, border: "none",
          fontSize: 14.5, fontWeight: 700, color: "#03070D",
          background: "linear-gradient(100deg,#00D9FF,#B8FF5A)",
          boxShadow: "0 8px 22px rgba(0,217,255,.24)",
        }}>
        <span className="nh-shine" />
        <span style={{ position: "relative" }}>Browse Files</span>
      </button>

      <div style={{
        position: "relative", marginTop: 20, fontSize: 12.5, color: "#7C92A8",
      }}>
        Supported formats: PDF, DOCX&nbsp;&nbsp;|&nbsp;&nbsp;Max file size: 10MB
      </div>
    </div>
  );
}

/* ============================ PROGRESS PANEL ============================ */
function ProgressPanel() {
  return (
    <div className="nh-glass nh-rise" style={{
      borderRadius: 20, padding: 26,
      border: "1px solid rgba(255,255,255,.08)",
      animationDelay: ".1s", alignSelf: "start",
    }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 22px", letterSpacing: "-.2px" }}>
        Upload Progress
      </h3>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {pipeline.map((step, i) => {
          const last = i === pipeline.length - 1;
          const done = step.state === "done";
          const current = step.state === "current";
          return (
            <div key={step.title} style={{ display: "flex", gap: 14 }}>
              {/* node + connector */}
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                flexShrink: 0,
              }}>
                <div style={{
                  position: "relative",
                  width: 30, height: 30, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: done
                    ? "linear-gradient(135deg,#00D9FF,#0093C4)"
                    : "rgba(255,255,255,.03)",
                  border: `2px solid ${done || current ? "rgba(0,217,255,.6)" : "rgba(255,255,255,.12)"}`,
                  boxShadow: done ? "0 0 14px rgba(0,217,255,.4)" : "none",
                  animation: current ? "nh-nodepulse 2s ease-in-out infinite" : "none",
                }}>
                  {done && <FiCheck size={15} color="#03070D" strokeWidth={3} />}
                  {current && (
                    <>
                      <span style={{
                        position: "absolute", inset: -5, borderRadius: "50%",
                        border: "2px solid rgba(0,217,255,.45)",
                        animation: "nh-ring 1.8s ease-out infinite",
                      }} />
                      <span style={{
                        width: 14, height: 14, borderRadius: "50%",
                        border: "2px solid #00D9FF", borderTopColor: "transparent",
                        animation: "nh-spin 1s linear infinite",
                      }} />
                    </>
                  )}
                  {step.state === "pending" && (
                    <span style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: "#3A4A5C",
                    }} />
                  )}
                </div>
                {!last && (
                  <div style={{
                    width: 3, flex: 1, minHeight: 30, marginTop: 2, marginBottom: 2,
                    borderRadius: 3,
                    ...(done || current
                      ? {
                          backgroundImage:
                            "linear-gradient(180deg,rgba(0,217,255,.85),rgba(0,217,255,.15) 60%,rgba(0,217,255,.85))",
                          backgroundSize: "100% 22px",
                          boxShadow: "0 0 10px rgba(0,217,255,.4)",
                          animation: "nh-flow 1.4s linear infinite",
                        }
                      : { background: "rgba(255,255,255,.07)" }),
                  }} />
                )}
              </div>
              {/* text */}
              <div style={{ paddingBottom: last ? 0 : 18 }}>
                <div style={{
                  fontSize: 13.5, fontWeight: 600,
                  color: done || current ? "#E8EEF5" : "#6B7F94",
                }}>
                  {step.title}
                </div>
                <div style={{ fontSize: 11.5, color: "#7C92A8", marginTop: 2 }}>
                  {step.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================ FEATURE CARD ============================ */
function FeatureCard({ f, i }) {
  const Icon = f.icon;
  return (
    <div className="nh-glass nh-card nh-rise" style={{
      position: "relative", overflow: "hidden",
      borderRadius: 18, padding: 22, animationDelay: `${0.1 + i * 0.07}s`,
      border: "1px solid rgba(255,255,255,.08)", minWidth: 0,
      display: "flex", gap: 14, alignItems: "flex-start",
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${f.color}66`;
        e.currentTarget.style.boxShadow = `0 18px 38px rgba(0,0,0,.42),0 0 28px ${f.color}2E`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,.08)";
        e.currentTarget.style.boxShadow = "none";
      }}>
      <div style={{
        position: "absolute", top: -36, right: -36, width: 120, height: 120,
        background: `radial-gradient(circle,${f.color}1C,transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div style={{
        width: 46, height: 46, borderRadius: 13, flexShrink: 0,
        background: `linear-gradient(135deg,${f.color}28,${f.color}10)`,
        border: `1px solid ${f.color}40`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 18px ${f.color}24`,
      }}>
        <Icon size={21} color={f.color} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{f.title}</div>
        <div style={{ fontSize: 12, color: "#7C92A8", marginTop: 5, lineHeight: 1.55 }}>
          {f.desc}
        </div>
      </div>
    </div>
  );
}

/* ============================ FILE BADGE ============================ */
function FileBadge({ type }) {
  const isPdf = type === "PDF";
  const color = isPdf ? "#F5544A" : "#3B82F6";
  return (
    <div style={{
      width: 40, height: 40, borderRadius: 10, flexShrink: 0,
      background: `linear-gradient(135deg,${color}26,${color}10)`,
      border: `1px solid ${color}40`,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
    }}>
      <FiFile size={15} color={color} />
      <span style={{ fontSize: 7, fontWeight: 800, color, marginTop: 1, letterSpacing: ".3px" }}>
        {type}
      </span>
    </div>
  );
}

/* ============================ RECENT UPLOADS ============================ */
function RecentUploads() {
  return (
    <div className="nh-glass nh-rise" style={{
      borderRadius: 20, padding: 26,
      border: "1px solid rgba(255,255,255,.08)", animationDelay: ".2s",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 20, gap: 12,
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, letterSpacing: "-.2px" }}>
          Recent Uploads
        </h3>
        <button className="nh-glass" style={{
          display: "flex", alignItems: "center", gap: 7, cursor: "pointer",
          padding: "8px 14px", borderRadius: 10, fontSize: 12.5,
          color: "#9FB2C6", border: "1px solid rgba(255,255,255,.08)",
        }}>
          View All <FiArrowRight size={13} />
        </button>
      </div>

      {/* header */}
      <div className="nh-table-row" style={{
        padding: "0 10px 12px",
        borderBottom: "1px solid rgba(255,255,255,.06)",
        fontSize: 11.5, color: "#7C92A8", fontWeight: 600,
        textTransform: "uppercase", letterSpacing: ".4px",
      }}>
        <div>File Name</div>
        <div className="nh-table-cell-hide">Candidate</div>
        <div className="nh-table-cell-hide">Uploaded On</div>
        <div>Status</div>
        <div className="nh-table-cell-hide">Progress</div>
        <div style={{ textAlign: "right" }}>Actions</div>
      </div>

      {/* rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
        {recentUploads.map((u) => (
          <div key={u.file} className="nh-row nh-table-row" style={{
            padding: "14px 10px", borderRadius: 12,
          }}>
            {/* file */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
              <FileBadge type={u.type} />
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: 13, fontWeight: 600,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>{u.file}</div>
                <div style={{ fontSize: 11, color: "#7C92A8", marginTop: 1 }}>{u.size}</div>
              </div>
            </div>

            {/* candidate */}
            <div className="nh-table-cell-hide" style={{ fontSize: 13, color: "#C5D2DF" }}>
              {u.candidate}
            </div>

            {/* date */}
            <div className="nh-table-cell-hide" style={{ fontSize: 12.5, color: "#8FA3B8" }}>
              {u.date}
            </div>

            {/* status */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                background: u.statusColor, boxShadow: `0 0 8px ${u.statusColor}`,
              }} />
              <span style={{
                fontSize: 12.5, color: "#C5D2DF",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>{u.status}</span>
            </div>

            {/* progress */}
            <div className="nh-table-cell-hide" style={{
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{
                fontSize: 12.5, fontWeight: 700, color: u.barColor, width: 34, flexShrink: 0,
              }}>{u.progress}%</span>
              <div style={{
                flex: 1, height: 6, borderRadius: 5,
                background: "rgba(255,255,255,.06)", overflow: "hidden",
              }}>
                <div className="nh-bar-fill" style={{
                  width: `${u.progress}%`, height: "100%", borderRadius: 5,
                  background: `linear-gradient(90deg,${u.barColor},${u.barColor}AA)`,
                  boxShadow: `0 0 10px ${u.barColor}66`,
                }} />
              </div>
            </div>

            {/* actions */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 7,
            }}>
              <button className="nh-iconbtn" style={{
                width: 32, height: 32, borderRadius: 9, cursor: "pointer",
                background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)",
                color: "#9FB2C6", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <FiEye size={14} />
              </button>
              <button className="nh-iconbtn" style={{
                width: 32, height: 32, borderRadius: 9, cursor: "pointer",
                background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)",
                color: "#9FB2C6", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <FiMoreVertical size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================ UPLOAD PAGE ============================ */
export default function Upload() {
  const navigate = useNavigate();
  const [active, setActive] = useState("Upload Resumes");
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
            padding: "20px 34px 40px",
          }}>
            {/* Header */}
            <div className="nh-rise" style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "flex-start", gap: 16, flexWrap: "wrap", marginBottom: 22,
            }}>
              <div>
                <h1 style={{ fontSize: 30, fontWeight: 800, margin: 0, letterSpacing: "-.7px" }}>
                  Upload Resumes
                </h1>
                <p style={{ fontSize: 14, color: "#8FA3B8", margin: "6px 0 0" }}>
                  Upload candidate resumes and let AI extract insights, skills and match scores.
                </p>
              </div>
              <div className="nh-glass" style={{
                padding: "11px 16px", borderRadius: 12, fontSize: 12.5,
                color: "#9FB2C6", border: "1px solid rgba(255,255,255,.08)",
                whiteSpace: "nowrap",
              }}>
                Supported formats:{" "}
                <span style={{ color: "#B8FF5A", fontWeight: 600 }}>PDF, DOCX</span>
              </div>
            </div>

            {/* Upload + Progress */}
            <div className="nh-upload-grid" style={{ marginBottom: 22 }}>
              <DropZone />
              <ProgressPanel />
            </div>

            {/* Feature cards */}
            <div className="nh-feature-grid" style={{ marginBottom: 22 }}>
              {features.map((f, i) => <FeatureCard key={f.title} f={f} i={i} />)}
            </div>

            {/* Recent uploads */}
            <RecentUploads />

            {/* Workflow button to proceed to Results */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 28 }}>
              <button className="nh-btn-ghost" style={{
                padding: "12px 26px", borderRadius: 13, border: "1px solid rgba(255,255,255,.12)",
                background: "transparent", color: "#8FA3B8", fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(0,217,255,.06)";
                  e.currentTarget.style.borderColor = "rgba(0,217,255,.3)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,.12)";
                  e.currentTarget.style.color = "#8FA3B8";
                }}>Back</button>
              <button className="nh-btn-primary" style={{
                padding: "12px 26px", borderRadius: 13, border: "none",
                background: "linear-gradient(100deg,#00D9FF,#B8FF5A)", color: "#03070D",
                fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 8px 22px rgba(0,217,255,.24)", overflow: "hidden", position: "relative",
              }}
                onClick={() => navigate("/results")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 14px 30px rgba(0,217,255,.32), 0 0 26px rgba(184,255,90,.22)";
                }}  
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 22px rgba(0,217,255,.24)";
                }}>
                <span style={{ position: "relative" }}>Proceed to Results</span>
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}