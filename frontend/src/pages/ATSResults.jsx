import React, { useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import {
  FiGrid, FiUploadCloud, FiCheckSquare, FiTarget, FiBarChart2,
  FiUsers, FiFileText, FiSettings, FiSearch, FiBell, FiMoon,
  FiMenu, FiCheck, FiX, FiDownload, FiArrowRight, FiMail,
  FiPhone, FiBriefcase, FiCpu, FiStar, FiInfo, FiCalendar,
  FiUser, FiClock, FiAward,
} from "react-icons/fi";
import logo from "../assets/images/logo.png";

/* ============================ BACKEND SHAPED DATA ============================ */
const atsResult = {
  candidate_id: 11,
  job_id: 7,
  candidate_name: "John Doe",
  candidate_role: "AI Engineer",
  candidate_email: "john.doe@email.com",
  candidate_phone: "+91 98765 43210",
  job_title: "AI Engineer",
  job_code: "JD-2026-AI-101",
  department: "Engineering",
  experience_level: "Mid Level (2-4 Years)",
  ats_score: 87,
  semantic_score: 91,
  hybrid_score: 89,
  final_ranking_score: 88,
  match_level: "Strong Match",
  matched_skills:
    "Python, Machine Learning, SQL, FastAPI, AI/ML, Pandas, NumPy, Scikit-learn, Deep Learning, TensorFlow",
  missing_skills: "Docker, Kubernetes, AWS, CI/CD",
  recommendation:
    "John demonstrates strong skills in backend development, machine learning and AI engineering. His technical expertise aligns very well with the job requirements. He will be a valuable addition to the team.",
};

const analysisMeta = {
  analysis_date: "25 May 2026, 03:35 PM",
  candidate_code: "CAND-2026-1257",
  analysis_engine: "NextHire AI ATS Engine v2.1",
  processing_time: "2.34 seconds",
};

const keyStrengths = [
  "Strong programming and backend development skills",
  "Good knowledge of Machine Learning and AI concepts",
  "Experience with modern frameworks and tools",
  "Problem solving and analytical thinking abilities",
];

/* ============================ HELPERS ============================ */
function splitSkills(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((s) => String(s).trim()).filter(Boolean);
  }
  return String(value)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function getScoreLabel(score) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Average";
  return "Low";
}

function getMatchLevelColor(level) {
  const l = String(level || "").toLowerCase();
  if (l.includes("strong")) return "#B8FF5A";
  if (l.includes("good") || l.includes("moderate")) return "#00D9FF";
  if (l.includes("partial") || l.includes("weak")) return "#F5A524";
  return "#FF4D6D";
}

/* ============================ DERIVED VALUES ============================ */
const matchedSkillsArr = splitSkills(atsResult.matched_skills);
const missingSkillsArr = splitSkills(atsResult.missing_skills);

const scoreCards = [
  { title: "ATS Score", value: atsResult.ats_score, desc: "Great match with the job requirements" },
  { title: "Semantic Score", value: atsResult.semantic_score, desc: "Strong semantic similarity with job description" },
  { title: "Hybrid Score", value: atsResult.hybrid_score, desc: "Combined ATS and Semantic intelligence score" },
  { title: "Final Ranking Score", value: atsResult.final_ranking_score, desc: "Final weighted score for candidate ranking" },
];

const skillAnalysis = [
  { name: "Matched Skills", value: 10, color: "#3DD68C" },
  { name: "Partially Matched", value: 3, color: "#F5A524" },
  { name: "Missing Skills", value: 2, color: "#FF4D6D" },
  { name: "Additional Skills", value: 1, color: "#8B5CF6" },
];
const totalSkillsAnalyzed = skillAnalysis.reduce((a, b) => a + b.value, 0);

const navItems = [
  { name: "Dashboard", icon: FiGrid },
  { name: "Upload Resumes", icon: FiUploadCloud },
  { name: "Screening Results", icon: FiCheckSquare },
  { name: "ATS Results", icon: FiTarget },
  { name: "Rankings", icon: FiBarChart2 },
  { name: "Applicants", icon: FiUsers },
  { name: "Reports", icon: FiFileText },
  { name: "Settings", icon: FiSettings },
];

const SIDEBAR_W = 252;

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
    @keyframes nh-dash  { 0%{ stroke-dashoffset: var(--full); } }
    @keyframes nh-nodepulse {
      0%,100% { opacity:.4; } 50%{ opacity:1; }
    }

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

    .nh-pill {
      transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease, background .25s ease;
    }
    .nh-pill:hover { transform: translateY(-2px); }

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

    .nh-ring-fill {
      stroke-dasharray: var(--full);
      stroke-dashoffset: var(--off);
      transition: stroke-dashoffset 1.3s cubic-bezier(.2,.8,.2,1);
    }

    .nh-overlay { display: none; }

    /* ---- Responsive layout ---- */
    .nh-summary-grid {
      display: grid; gap: 16px;
      grid-template-columns: 1.5fr 1.4fr 1.1fr;
    }
    .nh-body-grid {
      display: grid; gap: 16px;
      grid-template-columns: minmax(0,2.05fr) minmax(0,1fr);
      align-items: start;
    }
    .nh-score-grid {
      display: grid; gap: 16px;
      grid-template-columns: repeat(4, minmax(0,1fr));
    }
    .nh-mid-grid {
      display: grid; gap: 16px;
      grid-template-columns: 1.2fr 1fr;
    }
    .nh-meta-grid {
      display: grid; gap: 16px;
      grid-template-columns: repeat(4, minmax(0,1fr));
    }

    @media (max-width: 1280px) {
      .nh-summary-grid { grid-template-columns: 1fr 1fr; }
      .nh-summary-match { grid-column: 1 / -1; }
      .nh-body-grid { grid-template-columns: 1fr; }
      .nh-score-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
      .nh-meta-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
    }
    @media (max-width: 1024px) {
      .nh-overlay { display: block; }
    }
    @media (max-width: 720px) {
      .nh-summary-grid { grid-template-columns: 1fr; }
      .nh-score-grid { grid-template-columns: 1fr; }
      .nh-mid-grid { grid-template-columns: 1fr; }
      .nh-meta-grid { grid-template-columns: 1fr; }
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
      {orb("62%", "78%", "440px", "#B8FF5A", 8, 28)}
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
function SidebarBody({ active, setActive, onNavigate }) {
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
              onClick={() => { setActive(it.name); onNavigate && onNavigate(); }}
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

function Sidebar({ active, setActive, onClose }) {
  return (
    <aside className="nh-glass nh-scroll" style={{
      width: SIDEBAR_W, flexShrink: 0, height: "100vh",
      display: "flex", flexDirection: "column",
      borderRight: "1px solid rgba(0,217,255,.12)",
      padding: "20px 14px", overflowY: "auto",
      zIndex: 40, position: "fixed", left: 0, top: 0,
    }}>
      <SidebarBody active={active} setActive={setActive} onNavigate={onClose} />
    </aside>
  );
}

function DesktopSidebarSlot({ active, setActive }) {
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
          <SidebarBody active={active} setActive={setActive} />
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

/* ============================ SUMMARY ROW ============================ */
function SummaryRow() {
  const matchColor = getMatchLevelColor(atsResult.match_level);
  return (
    <div className="nh-summary-grid nh-rise" style={{ marginBottom: 16 }}>
      {/* Candidate */}
      <div className="nh-glass" style={{
        borderRadius: 18, padding: 20, border: "1px solid rgba(255,255,255,.08)",
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <div style={{
          width: 70, height: 70, borderRadius: "50%", flexShrink: 0, padding: 3,
          background: "linear-gradient(135deg,#00D9FF,#B8FF5A)",
          boxShadow: "0 0 22px rgba(0,217,255,.3)",
        }}>
          <div style={{
            width: "100%", height: "100%", borderRadius: "50%",
            border: "3px solid #03070D",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg,rgba(0,217,255,.22),rgba(139,92,246,.18))",
            fontSize: 22, fontWeight: 800, color: "#E8EEF5",
          }}>
            {atsResult.candidate_name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
          </div>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: 11, color: "#7C92A8", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: ".4px",
          }}>Candidate</div>
          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 3, letterSpacing: "-.3px" }}>
            {atsResult.candidate_name}
          </div>
          <div style={{ fontSize: 12, color: "#00D9FF", fontWeight: 500, marginTop: 1 }}>
            {atsResult.candidate_role}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 9 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11.5, color: "#9FB2C6" }}>
              <FiMail size={12} color="#00D9FF" /> {atsResult.candidate_email}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11.5, color: "#9FB2C6" }}>
              <FiPhone size={12} color="#00D9FF" /> {atsResult.candidate_phone}
            </span>
          </div>
        </div>
      </div>

      {/* Job */}
      <div className="nh-glass" style={{
        borderRadius: 18, padding: 20, border: "1px solid rgba(255,255,255,.08)",
      }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 14px",
        }}>
          <div style={{ display: "flex", gap: 11 }}>
            <SectionIcon icon={FiBriefcase} color="#B8FF5A" />
            <div>
              <div style={{ fontSize: 10.5, color: "#7C92A8", fontWeight: 600,
                textTransform: "uppercase", letterSpacing: ".4px" }}>Job Position</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 4 }}>
                {atsResult.job_title}
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10.5, color: "#7C92A8", fontWeight: 600,
              textTransform: "uppercase", letterSpacing: ".4px" }}>Job ID</div>
            <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 4, color: "#C5D2DF" }}>
              {atsResult.job_code}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10.5, color: "#7C92A8", fontWeight: 600,
              textTransform: "uppercase", letterSpacing: ".4px" }}>Department</div>
            <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 4, color: "#C5D2DF" }}>
              {atsResult.department}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10.5, color: "#7C92A8", fontWeight: 600,
              textTransform: "uppercase", letterSpacing: ".4px" }}>Experience Level</div>
            <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 4, color: "#C5D2DF" }}>
              {atsResult.experience_level}
            </div>
          </div>
        </div>
      </div>

      {/* Match level */}
      <div className="nh-glass nh-summary-match" style={{
        borderRadius: 18, padding: 20, border: `1px solid ${matchColor}33`,
        display: "flex", alignItems: "center", gap: 16,
        boxShadow: `inset 0 0 30px ${matchColor}0F`,
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: `radial-gradient(circle,${matchColor}22,transparent 72%)`,
          border: `2px solid ${matchColor}66`,
          boxShadow: `0 0 22px ${matchColor}33`,
        }}>
          <FiStar size={26} color={matchColor} fill={matchColor} />
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#7C92A8", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: ".4px" }}>Overall Match Level</div>
          <div style={{ fontSize: 19, fontWeight: 800, color: matchColor, marginTop: 3 }}>
            {atsResult.match_level}
          </div>
          <div style={{ fontSize: 11.5, color: "#9FB2C6", marginTop: 5, lineHeight: 1.5 }}>
            Excellent match with the job requirements and role expectations.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================ SCORE RING CARD ============================ */
function ScoreCard({ card, index }) {
  const R = 52;
  const C = 2 * Math.PI * R;
  const off = C - (card.value / 100) * C;
  const gid = `grad-${index}`;
  return (
    <div className="nh-glass nh-card" style={{
      borderRadius: 18, padding: "18px 16px 16px",
      border: "1px solid rgba(255,255,255,.08)",
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 6, marginBottom: 12,
      }}>
        <span style={{ fontSize: 13.5, fontWeight: 700 }}>{card.title}</span>
        <FiInfo size={12} color="#5C7185" />
      </div>

      <div style={{ position: "relative", width: 132, height: 132 }}>
        <svg width="132" height="132" viewBox="0 0 132 132">
          <defs>
            <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D9FF" />
              <stop offset="100%" stopColor="#B8FF5A" />
            </linearGradient>
          </defs>
          <circle cx="66" cy="66" r={R} fill="none"
            stroke="rgba(255,255,255,.07)" strokeWidth="9" />
          <circle cx="66" cy="66" r={R} fill="none"
            className="nh-ring-fill"
            stroke={`url(#${gid})`} strokeWidth="9" strokeLinecap="round"
            transform="rotate(-90 66 66)"
            style={{ "--full": C, "--off": off }} />
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 27, fontWeight: 800, letterSpacing: "-.5px" }}>
            {card.value}%
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#B8FF5A", marginTop: 1 }}>
            {getScoreLabel(card.value)}
          </span>
        </div>
      </div>

      {index === 0 && (
        <div style={{
          width: "100%", display: "flex", justifyContent: "space-between",
          fontSize: 9.5, color: "#5C7185", marginTop: 8, padding: "0 8px",
        }}>
          <span>0%</span><span>100%</span>
        </div>
      )}

      <p style={{
        fontSize: 11, color: "#7C92A8", textAlign: "center",
        margin: index === 0 ? "8px 0 0" : "14px 0 0", lineHeight: 1.5,
      }}>
        {card.desc}
      </p>
    </div>
  );
}

/* ============================ AI RECOMMENDATION ============================ */
function AIRecommendation() {
  const matchColor = getMatchLevelColor(atsResult.match_level);
  return (
    <div className="nh-glass nh-card" style={{
      position: "relative", overflow: "hidden",
      borderRadius: 18, padding: 20, border: "1px solid rgba(255,255,255,.08)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <SectionIcon icon={FiCpu} color="#00D9FF" />
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>AI Recommendation</h3>
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        {/* neural brain visual */}
        <div style={{
          position: "relative", width: 130, height: 130, flexShrink: 0,
        }}>
          <div style={{
            position: "absolute", inset: 14, borderRadius: "50%",
            background: "radial-gradient(circle,rgba(0,217,255,.22),transparent 70%)",
            filter: "blur(6px)",
          }} />
          <svg viewBox="0 0 130 130" width="130" height="130"
            style={{ animation: "nh-spinslow 70s linear infinite" }}>
            {(() => {
              const nodes = [
                [65, 28], [88, 40], [98, 64], [86, 90], [62, 100],
                [38, 92], [28, 66], [38, 40], [56, 56], [74, 60],
                [66, 76], [52, 44],
              ];
              const links = [
                [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7],
                [7, 0], [8, 9], [9, 10], [10, 8], [8, 11], [11, 7],
                [9, 1], [10, 3], [8, 6],
              ];
              return (
                <>
                  {links.map(([a, b], i) => (
                    <line key={`l${i}`}
                      x1={nodes[a][0]} y1={nodes[a][1]}
                      x2={nodes[b][0]} y2={nodes[b][1]}
                      stroke="#00D9FF" strokeWidth="0.7" opacity="0.4" />
                  ))}
                  {nodes.map(([x, y], i) => (
                    <circle key={`n${i}`} cx={x} cy={y} r={i % 3 === 0 ? 3 : 2}
                      fill={i % 2 === 0 ? "#00D9FF" : "#B8FF5A"}
                      style={{
                        animation: `nh-nodepulse ${2.4 + (i % 4) * 0.5}s ease-in-out ${i * 0.2}s infinite`,
                      }} />
                  ))}
                </>
              );
            })()}
          </svg>
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 15.5, fontWeight: 800, color: matchColor }}>
            {atsResult.match_level}
          </div>
          <p style={{
            fontSize: 11.8, color: "#9FB2C6", lineHeight: 1.6, margin: "7px 0 0",
          }}>
            {atsResult.recommendation}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================ SKILL ANALYSIS ============================ */
function SkillAnalysis() {
  return (
    <div className="nh-glass nh-card" style={{
      borderRadius: 18, padding: 20, border: "1px solid rgba(255,255,255,.08)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <SectionIcon icon={FiBarChart2} color="#00D9FF" />
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Skill Analysis</h3>
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        {/* donut */}
        <div style={{ width: 130, height: 130, flexShrink: 0, position: "relative" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={skillAnalysis} dataKey="value" nameKey="name"
                cx="50%" cy="50%" innerRadius={36} outerRadius={58}
                paddingAngle={2} stroke="none">
                {skillAnalysis.map((s, i) => (
                  <Cell key={i} fill={s.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* legend */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9 }}>
          {skillAnalysis.map((s) => {
            const pct = Math.round((s.value / totalSkillsAnalyzed) * 100);
            return (
              <div key={s.name} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    width: 9, height: 9, borderRadius: "50%",
                    background: s.color, boxShadow: `0 0 6px ${s.color}`,
                  }} />
                  <span style={{ fontSize: 12, color: "#C5D2DF" }}>{s.name}</span>
                </span>
                <span style={{ fontSize: 11.5, color: "#9FB2C6" }}>
                  <span style={{ fontWeight: 700, color: "#E8EEF5" }}>{s.value}</span>{" "}
                  ({pct}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginTop: 14, paddingTop: 13, borderTop: "1px solid rgba(255,255,255,.06)",
      }}>
        <span style={{ fontSize: 12, color: "#7C92A8" }}>Total Skills Analyzed</span>
        <span style={{ fontSize: 16, fontWeight: 800, color: "#00D9FF" }}>
          {totalSkillsAnalyzed}
        </span>
      </div>
    </div>
  );
}

/* ============================ MATCHED SKILLS ============================ */
function MatchedSkills() {
  return (
    <div className="nh-glass nh-card" style={{
      borderRadius: 18, padding: 20, border: "1px solid rgba(255,255,255,.08)",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 999, flexShrink: 0,
            background: "linear-gradient(135deg,#3DD68C,#1FA968)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 12px rgba(61,214,140,.4)",
          }}>
            <FiCheck size={14} color="#03070D" strokeWidth={3} />
          </div>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Matched Skills</h3>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {matchedSkillsArr.map((s) => (
          <span key={s} className="nh-pill" style={{
            fontSize: 11.5, fontWeight: 500, color: "#C5D2DF",
            padding: "6px 12px", borderRadius: 999,
            background: "rgba(0,217,255,.06)",
            border: "1px solid rgba(0,217,255,.3)",
          }}>{s}</span>
        ))}
      </div>

      <div style={{ textAlign: "right", marginTop: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: "#B8FF5A" }}>
          {matchedSkillsArr.length}
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#7C92A8" }}>
          {" / "}{matchedSkillsArr.length + missingSkillsArr.length - 2}
        </span>
      </div>
    </div>
  );
}

/* ============================ MISSING SKILLS ============================ */
function MissingSkills() {
  return (
    <div className="nh-glass nh-card" style={{
      borderRadius: 18, padding: 20, border: "1px solid rgba(255,255,255,.08)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 999, flexShrink: 0,
          background: "linear-gradient(135deg,#FF4D6D,#C9304B)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 12px rgba(255,77,109,.4)",
        }}>
          <FiX size={14} color="#03070D" strokeWidth={3} />
        </div>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Missing Skills</h3>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {missingSkillsArr.map((s) => (
          <span key={s} className="nh-pill" style={{
            fontSize: 11.5, fontWeight: 500, color: "#FF8FA3",
            padding: "6px 12px", borderRadius: 999,
            background: "rgba(255,77,109,.07)",
            border: "1px solid rgba(255,77,109,.34)",
          }}>{s}</span>
        ))}
      </div>

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginTop: 13, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,.06)",
      }}>
        <span style={{ fontSize: 12, color: "#7C92A8" }}>Total Missing</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: "#FF4D6D" }}>
          {missingSkillsArr.length}
        </span>
      </div>
    </div>
  );
}

/* ============================ KEY STRENGTHS ============================ */
function KeyStrengths() {
  return (
    <div className="nh-glass nh-card" style={{
      borderRadius: 18, padding: 20, border: "1px solid rgba(255,255,255,.08)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <SectionIcon icon={FiAward} color="#B8FF5A" />
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Key Strengths</h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        {keyStrengths.map((s) => (
          <div key={s} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{
              width: 19, height: 19, borderRadius: "50%", flexShrink: 0, marginTop: 1,
              background: "rgba(61,214,140,.12)", border: "1px solid rgba(61,214,140,.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <FiCheck size={11} color="#3DD68C" strokeWidth={3} />
            </span>
            <span style={{ fontSize: 12, color: "#C5D2DF", lineHeight: 1.5 }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================ METADATA ROW ============================ */
function MetadataRow() {
  const items = [
    { label: "Analysis Date", value: analysisMeta.analysis_date, icon: FiCalendar },
    { label: "Candidate ID", value: analysisMeta.candidate_code, icon: FiUser },
    { label: "Analysis Engine", value: analysisMeta.analysis_engine, icon: FiCpu, accent: "#00D9FF" },
    { label: "Processing Time", value: analysisMeta.processing_time, icon: FiClock },
  ];
  return (
    <div className="nh-glass nh-rise" style={{
      borderRadius: 18, padding: "16px 22px", marginTop: 16,
      border: "1px solid rgba(255,255,255,.08)",
    }}>
      <div className="nh-meta-grid">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                background: "rgba(0,217,255,.07)", border: "1px solid rgba(0,217,255,.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={16} color="#00D9FF" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 10.5, color: "#7C92A8", fontWeight: 600,
                  textTransform: "uppercase", letterSpacing: ".4px" }}>
                  {it.label}
                </div>
                <div style={{
                  fontSize: 12.5, fontWeight: 600, marginTop: 3,
                  color: it.accent || "#C5D2DF",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {it.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================ ATS RESULTS PAGE ============================ */
export default function ATSResults() {
  const [active, setActive] = useState("ATS Results");
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
          <DesktopSidebarSlot active={active} setActive={setActive} />
        </div>

        {sidebarOpen && (
          <>
            <div className="nh-overlay" onClick={() => setSidebarOpen(false)}
              style={{
                position: "fixed", inset: 0, zIndex: 35,
                background: "rgba(0,0,0,.55)", backdropFilter: "blur(2px)",
              }} />
            <Sidebar active={active} setActive={setActive}
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
                  ATS Analysis Results
                </h1>
                <p style={{ fontSize: 13, color: "#8FA3B8", margin: "5px 0 0" }}>
                  AI powered evaluation of candidate match with job requirements.
                </p>
              </div>

              <div style={{ display: "flex", gap: 11, flexWrap: "wrap" }}>
                <button className="nh-btn-ghost nh-glass" style={{
                  display: "flex", alignItems: "center", gap: 9, cursor: "pointer",
                  padding: "10px 16px", borderRadius: 11, fontSize: 12.5, fontWeight: 600,
                  color: "#C5D2DF", border: "1px solid rgba(255,255,255,.1)",
                }}>
                  <FiDownload size={14} />
                  Download Analysis Report
                </button>
                <button className="nh-btn-primary" style={{
                  display: "flex", alignItems: "center", gap: 9, cursor: "pointer",
                  padding: "10px 18px", borderRadius: 11, border: "none",
                  fontSize: 12.5, fontWeight: 700, color: "#03070D",
                  background: "linear-gradient(100deg,#00D9FF,#B8FF5A)",
                  boxShadow: "0 8px 22px rgba(0,217,255,.24)",
                }}>
                  <span className="nh-shine" />
                  <span style={{ position: "relative", display: "flex",
                    alignItems: "center", gap: 9 }}>
                    Proceed to Ranking <FiArrowRight size={14} />
                  </span>
                </button>
              </div>
            </div>

            {/* Summary row */}
            <SummaryRow />

            {/* Body: left scores + mid panels, right skills */}
            <div className="nh-body-grid">
              {/* LEFT */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="nh-score-grid">
                  {scoreCards.map((c, i) => (
                    <ScoreCard key={c.title} card={c} index={i} />
                  ))}
                </div>
                <div className="nh-mid-grid">
                  <AIRecommendation />
                  <SkillAnalysis />
                </div>
              </div>

              {/* RIGHT */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <MatchedSkills />
                <MissingSkills />
                <KeyStrengths />
              </div>
            </div>

            {/* Metadata row */}
            <MetadataRow />
          </main>
        </div>
      </div>
    </div>
  );
}