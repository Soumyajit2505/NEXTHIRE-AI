import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import logo from "../assets/images/logo.png";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        email: email.trim(),
        password,
      });

      const token = response.data?.access_token;

      if (!token) {
        setError("Login failed. Token not received.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.data?.user || null));

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Invalid email or password."
      );
      setLoading(false);
    }
  }

  // Floating particle positions for atmospheric depth
  const particles = [
    { t: "9%", l: "14%", s: 2.5, d: "0s" },
    { t: "18%", l: "84%", s: 2, d: "1.6s" },
    { t: "34%", l: "7%", s: 3, d: "3s" },
    { t: "47%", l: "92%", s: 2, d: "0.7s" },
    { t: "61%", l: "12%", s: 2.5, d: "2.4s" },
    { t: "72%", l: "88%", s: 2, d: "4s" },
    { t: "83%", l: "26%", s: 3, d: "1.1s" },
    { t: "88%", l: "66%", s: 2, d: "3.4s" },
    { t: "27%", l: "46%", s: 2, d: "2s" },
    { t: "55%", l: "70%", s: 2.5, d: "0.4s" },
    { t: "14%", l: "58%", s: 2, d: "3.8s" },
    { t: "78%", l: "48%", s: 2, d: "1.3s" },
  ];

  return (
    <div className="login-screen">
      <style>{`
        html, body, #root {
          height: 100%;
          margin: 0;
          padding: 0;
          background-color: #03070d;
        }

        *, *::before, *::after { box-sizing: border-box; }

        .login-screen {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          overflow-x: hidden;
          overflow-y: auto;
          color: #ffffff;
          background:
            radial-gradient(circle at 12% 38%, rgba(0, 217, 255, 0.16), transparent 34%),
            radial-gradient(circle at 88% 62%, rgba(184, 255, 90, 0.14), transparent 36%),
            linear-gradient(150deg, #03070d 0%, #07111b 48%, #04080c 100%);
          font-family: Inter, 'Segoe UI', system-ui, -apple-system, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* Layered neural grid */
        .login-screen::before {
          content: "";
          position: absolute;
          inset: -2px;
          background-image:
            linear-gradient(rgba(0,217,255,0.032) 1px, transparent 1px),
            linear-gradient(90deg, rgba(184,255,90,0.032) 1px, transparent 1px);
          background-size: 68px 68px, 68px 68px;
          opacity: 0.6;
          animation: gridMove 28s linear infinite;
          mask-image: radial-gradient(ellipse at center, black 35%, transparent 90%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 35%, transparent 90%);
        }

        /* Soft vignette for cinematic depth */
        .login-screen::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(ellipse at center, transparent 50%, rgba(3,7,13,0.82) 100%);
        }

        /* Atmospheric glow orbs behind the neural spheres */
        .orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .orb-left {
          width: 460px;
          height: 460px;
          left: -200px;
          top: 18%;
          background: radial-gradient(circle at 40% 40%, rgba(0,217,255,0.40), transparent 70%);
          filter: blur(70px);
          opacity: 0.55;
          animation: drift 22s ease-in-out infinite;
        }
        .orb-right {
          width: 440px;
          height: 440px;
          right: -190px;
          bottom: 12%;
          background: radial-gradient(circle at 40% 40%, rgba(184,255,90,0.32), transparent 70%);
          filter: blur(70px);
          opacity: 0.5;
          animation: drift 26s ease-in-out infinite reverse;
        }

        /* Giant neural spheres - SVG */
        .neural-sphere {
          position: absolute;
          z-index: 0;
          pointer-events: none;
        }
        .sphere-left {
          left: -230px;
          top: 50%;
          width: 620px;
          height: 620px;
          transform: translateY(-50%);
          opacity: 0.5;
          animation: sphereSpin 90s linear infinite, breathe 12s ease-in-out infinite;
        }
        .sphere-right {
          right: -230px;
          top: 50%;
          width: 560px;
          height: 560px;
          transform: translateY(-50%);
          opacity: 0.42;
          animation: sphereSpin 110s linear infinite reverse, breathe 14s ease-in-out infinite;
        }

        /* Full-canvas neural connection lines */
        .neural-lines {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }
        .neural-lines path {
          stroke-dasharray: 7 13;
          animation: dash 12s linear infinite;
        }

        /* Bottom flowing neural wave mesh */
        .wave-mesh {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 320px;
          z-index: 0;
          pointer-events: none;
          opacity: 0.7;
        }
        .wave-mesh path { animation: waveFlow 14s ease-in-out infinite; }

        /* Floating particles */
        .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(200, 240, 255, 0.9);
          z-index: 0;
          pointer-events: none;
          animation: particleFloat 7s ease-in-out infinite;
        }

        .login-card {
          position: relative;
          z-index: 2;
          width: min(92vw, 480px);
          padding: 1.4px;
          border-radius: 28px;
          background: linear-gradient(135deg, rgba(0,217,255,0.85), rgba(255,255,255,0.10) 50%, rgba(184,255,90,0.85));
          box-shadow:
            0 30px 80px rgba(0,0,0,0.65),
            0 0 40px rgba(0,217,255,0.12),
            0 0 50px rgba(184,255,90,0.10);
          animation: fadeIn 0.85s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .login-inner {
          border-radius: 26.6px;
          padding: 38px 40px 34px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.012)),
            rgba(6, 11, 18, 0.88);
          backdrop-filter: blur(26px);
          -webkit-backdrop-filter: blur(26px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.07);
        }

        /* Logo - no black square, soft glow halo */
        .logo-box {
          position: relative;
          width: 92px;
          height: 92px;
          margin: 0 auto 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo-box::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,217,255,0.28), rgba(184,255,90,0.14) 55%, transparent 72%);
          filter: blur(12px);
          animation: haloPulse 5s ease-in-out infinite;
        }
        .logo {
          position: relative;
          width: 76px;
          height: 76px;
          object-fit: contain;
          transform: scale(1.12);
          filter: drop-shadow(0 0 16px rgba(0,217,255,0.45)) drop-shadow(0 0 26px rgba(184,255,90,0.22));
          animation: floatLogo 5s ease-in-out infinite;
        }

        .title {
          font-size: clamp(30px, 5vw, 38px);
          font-weight: 700;
          line-height: 1.05;
          text-align: center;
          margin: 0;
          letter-spacing: -1px;
        }
        .title span {
          background: linear-gradient(90deg, #00d9ff, #b8ff5a);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .subtitle {
          margin: 9px 0 0;
          text-align: center;
          color: rgba(255,255,255,0.55);
          font-size: 13.5px;
          letter-spacing: 0.2px;
        }

        .divider {
          width: 110px;
          height: 1px;
          margin: 20px auto 24px;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, #00d9ff, #b8ff5a, transparent);
          animation: dividerPulse 4s ease-in-out infinite;
        }

        .field { margin-bottom: 17px; }

        .label {
          display: block;
          margin-bottom: 8px;
          font-size: 13.5px;
          font-weight: 500;
          color: rgba(255,255,255,0.82);
        }

        .input-box {
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 0 14px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.10);
          transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }
        .input-box:focus-within {
          border-color: rgba(0,217,255,0.5);
          background: rgba(255,255,255,0.045);
          box-shadow: 0 0 0 3px rgba(0,217,255,0.10);
        }
        .input-box.lime:focus-within {
          border-color: rgba(184,255,90,0.5);
          box-shadow: 0 0 0 3px rgba(184,255,90,0.10);
        }

        .icon-cyan { color: #00d9ff; display: flex; }
        .icon-lime { color: #b8ff5a; display: flex; }

        .input {
          flex: 1;
          min-width: 0;
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          font-size: 14px;
          font-family: inherit;
        }
        .input::placeholder { color: rgba(255,255,255,0.38); }

        .eye {
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.55);
          cursor: pointer;
          display: flex;
          padding: 4px;
          transition: color 0.2s ease;
        }
        .eye:hover { color: #00d9ff; }

        .row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 6px 0 22px;
          gap: 14px;
        }

        .check {
          display: flex;
          align-items: center;
          gap: 9px;
          color: rgba(255,255,255,0.68);
          font-size: 13.5px;
          cursor: pointer;
        }
        .check input {
          width: 16px;
          height: 16px;
          accent-color: #00d9ff;
          cursor: pointer;
        }

        .forgot {
          border: none;
          background: transparent;
          color: #2dd4bf;
          font-size: 13.5px;
          cursor: pointer;
          transition: color 0.2s ease;
          padding: 0;
        }
        .forgot:hover { color: #5eead4; }

        .login-btn {
          position: relative;
          width: 100%;
          height: 50px;
          border: none;
          border-radius: 13px;
          cursor: pointer;
          color: #04140f;
          font-size: 15.5px;
          font-weight: 600;
          font-family: inherit;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(90deg, #00d9ff, #b8ff5a);
          box-shadow: 0 8px 28px rgba(0,217,255,0.22);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 38px rgba(184,255,90,0.30);
        }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .login-btn .shine {
          position: absolute;
          top: 0;
          left: -120%;
          width: 55%;
          height: 100%;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.55), transparent);
          transform: skewX(-20deg);
        }
        .login-btn:hover:not(:disabled) .shine { animation: shine 0.9s ease; }

        .arrow { transition: transform 0.25s ease; display: flex; }
        .login-btn:hover:not(:disabled) .arrow { transform: translateX(3px); }

        .bottom {
          margin-top: 20px;
          text-align: center;
          color: rgba(255,255,255,0.45);
          font-size: 13.5px;
        }
        .bottom span { color: #2dd4bf; font-weight: 500; }

        .error {
          margin-bottom: 16px;
          padding: 11px 14px;
          border-radius: 11px;
          background: rgba(239,68,68,0.10);
          border: 1px solid rgba(248,113,113,0.30);
          color: #fecaca;
          font-size: 13px;
        }

        .spinner {
          width: 17px;
          height: 17px;
          border: 2px solid rgba(4,20,15,0.35);
          border-top-color: #04140f;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatLogo {
          0%, 100% { transform: translateY(0) scale(1.12); }
          50% { transform: translateY(-8px) scale(1.12); }
        }
        @keyframes haloPulse {
          0%, 100% { opacity: 0.55; transform: scale(0.96); }
          50% { opacity: 1; transform: scale(1.06); }
        }
        @keyframes gridMove {
          from { background-position: 0 0, 0 0; }
          to { background-position: 68px 68px, 68px 68px; }
        }
        @keyframes drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(34px, -28px); }
        }
        @keyframes sphereSpin {
          from { transform: translateY(-50%) rotate(0deg); }
          to { transform: translateY(-50%) rotate(360deg); }
        }
        @keyframes breathe {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(0,217,255,0.2)); }
          50% { filter: drop-shadow(0 0 22px rgba(0,217,255,0.35)); }
        }
        @keyframes dash { to { stroke-dashoffset: -260; } }
        @keyframes waveFlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0); opacity: 0.25; }
          50% { transform: translateY(-16px); opacity: 0.9; }
        }
        @keyframes dividerPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes shine { to { left: 130%; } }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 640px) {
          .login-screen { padding: 16px; }
          .login-inner { padding: 30px 24px 28px; }
          .row { flex-wrap: wrap; }
          .sphere-left { width: 420px; height: 420px; left: -240px; }
          .sphere-right { width: 380px; height: 380px; right: -240px; }
        }
      `}</style>

      {/* Atmospheric glow orbs */}
      <div className="orb orb-left" />
      <div className="orb orb-right" />

      {/* Left neural sphere - cyan digital globe with network nodes */}
      <svg
        className="neural-sphere sphere-left"
        viewBox="0 0 400 400"
        fill="none"
      >
        <circle cx="200" cy="200" r="150" stroke="rgba(0,217,255,0.30)" strokeWidth="1" />
        <circle cx="200" cy="200" r="110" stroke="rgba(0,217,255,0.20)" strokeWidth="1" />
        <ellipse cx="200" cy="200" rx="150" ry="56" stroke="rgba(0,217,255,0.22)" strokeWidth="1" />
        <ellipse cx="200" cy="200" rx="56" ry="150" stroke="rgba(0,217,255,0.22)" strokeWidth="1" />
        <ellipse cx="200" cy="200" rx="150" ry="110" stroke="rgba(0,217,255,0.16)" strokeWidth="1" />
        <line x1="200" y1="50" x2="312" y2="288" stroke="rgba(0,217,255,0.18)" strokeWidth="1" />
        <line x1="88" y1="288" x2="350" y2="200" stroke="rgba(0,217,255,0.14)" strokeWidth="1" />
        <line x1="50" y1="200" x2="288" y2="312" stroke="rgba(0,217,255,0.14)" strokeWidth="1" />
        <circle cx="200" cy="50" r="4" fill="rgba(0,217,255,0.8)" />
        <circle cx="312" cy="288" r="3.5" fill="rgba(0,217,255,0.7)" />
        <circle cx="88" cy="288" r="3" fill="rgba(0,217,255,0.6)" />
        <circle cx="350" cy="200" r="3.5" fill="rgba(184,255,90,0.7)" />
        <circle cx="50" cy="200" r="3" fill="rgba(0,217,255,0.6)" />
        <circle cx="288" cy="112" r="2.5" fill="rgba(0,217,255,0.6)" />
      </svg>

      {/* Right neural sphere - lime holographic node structure */}
      <svg
        className="neural-sphere sphere-right"
        viewBox="0 0 400 400"
        fill="none"
      >
        <circle cx="200" cy="200" r="150" stroke="rgba(184,255,90,0.26)" strokeWidth="1" />
        <circle cx="200" cy="200" r="100" stroke="rgba(184,255,90,0.18)" strokeWidth="1" />
        <ellipse cx="200" cy="200" rx="150" ry="60" stroke="rgba(184,255,90,0.20)" strokeWidth="1" />
        <ellipse cx="200" cy="200" rx="60" ry="150" stroke="rgba(184,255,90,0.20)" strokeWidth="1" />
        <ellipse cx="200" cy="200" rx="120" ry="150" stroke="rgba(184,255,90,0.14)" strokeWidth="1" />
        <line x1="200" y1="50" x2="80" y2="270" stroke="rgba(184,255,90,0.16)" strokeWidth="1" />
        <line x1="320" y1="270" x2="60" y2="180" stroke="rgba(184,255,90,0.13)" strokeWidth="1" />
        <line x1="200" y1="350" x2="330" y2="130" stroke="rgba(184,255,90,0.13)" strokeWidth="1" />
        <circle cx="200" cy="50" r="4" fill="rgba(184,255,90,0.8)" />
        <circle cx="80" cy="270" r="3.5" fill="rgba(184,255,90,0.7)" />
        <circle cx="320" cy="270" r="3" fill="rgba(184,255,90,0.6)" />
        <circle cx="60" cy="180" r="3.5" fill="rgba(0,217,255,0.6)" />
        <circle cx="330" cy="130" r="3" fill="rgba(184,255,90,0.6)" />
        <circle cx="200" cy="350" r="2.5" fill="rgba(184,255,90,0.6)" />
      </svg>

      {/* Neural connection lines across the canvas */}
      <svg
        className="neural-lines"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M-60 230 C 320 110, 640 360, 1500 190"
          stroke="rgba(0,217,255,0.16)"
          strokeWidth="1.1"
        />
        <path
          d="M-60 690 C 380 770, 760 510, 1500 730"
          stroke="rgba(184,255,90,0.13)"
          strokeWidth="1.1"
          style={{ animationDelay: "3s" }}
        />
        <path
          d="M-60 470 C 440 380, 920 570, 1500 440"
          stroke="rgba(0,217,255,0.09)"
          strokeWidth="1"
          style={{ animationDelay: "5.5s" }}
        />
      </svg>

      {/* Bottom flowing neural wave mesh */}
      <svg
        className="wave-mesh"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 200 C 240 120, 480 260, 720 190 C 960 120, 1200 240, 1440 170"
          stroke="rgba(0,217,255,0.20)"
          strokeWidth="1.4"
        />
        <path
          d="M0 240 C 260 170, 520 290, 760 220 C 1000 150, 1220 270, 1440 210"
          stroke="rgba(184,255,90,0.16)"
          strokeWidth="1.4"
          style={{ animationDelay: "2s" }}
        />
        <path
          d="M0 280 C 240 220, 540 320, 780 260 C 1020 200, 1240 300, 1440 250"
          stroke="rgba(0,217,255,0.12)"
          strokeWidth="1.2"
          style={{ animationDelay: "4s" }}
        />
      </svg>

      {/* Floating particles */}
      {particles.map((p, i) => (
        <span
          key={i}
          className="particle"
          style={{
            top: p.t,
            left: p.l,
            width: p.s,
            height: p.s,
            animationDelay: p.d,
          }}
        />
      ))}

      {/* Login card */}
      <div className="login-card">
        <div className="login-inner">
          <div className="logo-box">
            <img src={logo} alt="NextHire AI Logo" className="logo" />
          </div>

          <h1 className="title">
            NextHire <span>AI</span>
          </h1>

          <p className="subtitle">
            Intelligent Resume Screening &amp; Hiring System
          </p>

          <div className="divider" />

          <form onSubmit={handleSubmit}>
            {error && <div className="error">{error}</div>}

            <div className="field">
              <label className="label">Email</label>
              <div className="input-box">
                <span className="icon-cyan">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  className="input"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Password</label>
              <div className="input-box lime">
                <span className="icon-lime">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  className="input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="eye"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="row">
              <label className="check">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>

              <button type="button" className="forgot">
                Forgot password?
              </button>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              <span className="shine" />
              {loading ? (
                <span className="spinner" />
              ) : (
                <>
                  <span>Login</span>
                  <span className="arrow">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </>
              )}
            </button>
          </form>

          <p className="bottom">
            Don&apos;t have an account?{" "}
            <span>Contact your administrator</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;