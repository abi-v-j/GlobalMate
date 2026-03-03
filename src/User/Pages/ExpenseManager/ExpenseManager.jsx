// src/components/ExpenseManagerWorking.jsx
import React, { useEffect, useMemo, useRef, useState, memo, useCallback } from "react";
import supabase from "../../../global/Supabase";
import {
  TextField,
  Typography,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
  IconButton,
} from "@mui/material";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";

import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import CalculateRoundedIcon from "@mui/icons-material/CalculateRounded";
import CurrencyExchangeRoundedIcon from "@mui/icons-material/CurrencyExchangeRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

/* ═══════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════ */
const C = {
  bg0: "#0a0015",
  bg1: "#110022",
  bg2: "#1a0035",

  v900: "#1e0040",
  v800: "#2e0a5e",
  v700: "#4c1d95",
  v600: "#5b21b6",
  v500: "#6d28d9",
  v400: "#7c3aed",
  v300: "#8b5cf6",
  v200: "#a78bfa",
  v100: "#c4b5fd",
  v50: "#ede9fe",

  inc: "#10b981",
  incDim: "rgba(16,185,129,0.12)",
  incBorder: "rgba(16,185,129,0.25)",

  exp: "#f43f5e",
  expDim: "rgba(244,63,94,0.12)",
  expBorder: "rgba(244,63,94,0.25)",

  gold: "#f59e0b",
  goldDim: "rgba(245,158,11,0.12)",
  goldBorder: "rgba(245,158,11,0.25)",

  teal: "#06b6d4",
  tealDim: "rgba(6,182,212,0.12)",
  tealBorder: "rgba(6,182,212,0.25)",

  glass0: "rgba(255,255,255,0.025)",
  border0: "rgba(255,255,255,0.06)",
  border1: "rgba(255,255,255,0.11)",

  glow: "rgba(109,40,217,0.6)",
  glowS: "rgba(139,92,246,0.18)",
};

const NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Instrument+Serif:ital@0;1&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; }
  :root { color-scheme: dark; }
  ::-webkit-scrollbar { width:3px; height:3px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(139,92,246,0.3); border-radius:10px; }
  input[type="date"]::-webkit-calendar-picker-indicator {
    filter:invert(0.6) sepia(1) saturate(3) hue-rotate(220deg);
    cursor:pointer;
  }

  @keyframes bgDrift {
    0%  { transform:translate(0,0) scale(1) rotate(0deg); }
    33% { transform:translate(60px,-80px) scale(1.12) rotate(3deg); }
    66% { transform:translate(-40px,50px) scale(0.93) rotate(-2deg); }
    100%{ transform:translate(0,0) scale(1) rotate(0deg); }
  }
  @keyframes bgDrift2 {
    0%  { transform:translate(0,0) scale(1); }
    50% { transform:translate(-70px,40px) scale(1.15); }
    100% { transform:translate(0,0) scale(1); }
  }
  @keyframes shimmerFlow {
    0%   { background-position:-200% center; }
    100% { background-position:200% center; }
  }
  @keyframes pulseRing {
    0%   { box-shadow: 0 0 0 0 rgba(139,92,246,0.4); }
    70%  { box-shadow: 0 0 0 8px rgba(139,92,246,0); }
    100% { box-shadow: 0 0 0 0 rgba(139,92,246,0); }
  }

  .em-card {
    background: ${C.glass0};
    border: 1px solid ${C.border0};
    border-radius: 24px;
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    position: relative;
    overflow: hidden;
    transition: border-color 0.35s, box-shadow 0.35s, transform 0.35s;
    will-change: transform;
  }
  .em-card:hover {
    border-color: rgba(139,92,246,0.18);
    box-shadow: 0 0 0 1px rgba(139,92,246,0.1), 0 32px 70px rgba(0,0,0,0.45);
    transform: translateY(-1px);
  }
  .em-card::before {
    content:'';
    position:absolute;
    inset:0;
    background: linear-gradient(135deg, rgba(139,92,246,0.05) 0%, transparent 50%, rgba(109,40,217,0.05) 100%);
    pointer-events:none;
    border-radius:inherit;
  }
  .em-card::after {
    content:'';
    position:absolute;
    top:0; left:0; right:0;
    height:1px;
    background: linear-gradient(90deg, transparent, rgba(139,92,246,0.35), transparent);
    border-radius:inherit;
    pointer-events:none;
  }

  .em-row-item { transition: background 0.2s, border-color 0.2s; }
  .em-row-item:hover { background: rgba(255,255,255,0.04) !important; }
  .em-row-item:hover .em-row-actions { opacity:1 !important; transform:translateX(0) !important; }
  .em-row-actions { opacity:0; transform:translateX(6px); transition:all 0.2s; }

  .em-tag {
    display:inline-flex; align-items:center; gap:5px;
    padding:3px 10px 3px 7px;
    border-radius:20px;
    font-size:11px; font-weight:700;
    font-family:'Outfit',sans-serif;
    letter-spacing:0.04em;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px 10px 14px;
    border-radius: 14px;
    border: 1px solid rgba(139,92,246,0.25);
    background: rgba(139,92,246,0.08);
    color: rgba(196,181,253,0.85);
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.03em;
    cursor: pointer;
    transition: all 0.22s;
    text-decoration: none;
  }
  .back-btn:hover {
    background: rgba(139,92,246,0.18);
    border-color: rgba(139,92,246,0.45);
    color: #c4b5fd;
    transform: translateX(-2px);
    box-shadow: 0 4px 20px rgba(109,40,217,0.25);
  }
  .back-btn:active { transform: translateX(0) scale(0.97); }

  /* Custom Select */
  .cs-trigger {
    height: 44px;
    border-radius: 14px;
    background: rgba(255,255,255,0.04);
    border: 1.5px solid rgba(255,255,255,0.09);
    color: white;
    font-family: 'Outfit', sans-serif;
    font-size: 13.5px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    user-select: none;
    position: relative;
    width: 100%;
  }
  .cs-trigger:hover {
    border-color: rgba(139,92,246,0.4);
    background: rgba(139,92,246,0.06);
  }
  .cs-trigger.open {
    border-color: #8b5cf6;
    background: rgba(139,92,246,0.1);
    box-shadow: 0 0 0 3px rgba(139,92,246,0.12);
  }
  .cs-trigger.has-value { border-color: rgba(139,92,246,0.28); }

  .cs-dropdown {
    position: absolute;
    top: calc(100% + 6px);
    left: 0; right: 0;
    background: linear-gradient(145deg, #180030, #110022);
    border: 1px solid rgba(139,92,246,0.28);
    border-radius: 16px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.08), inset 0 1px 0 rgba(255,255,255,0.06);
    overflow: hidden;
    z-index: 9999;
    min-width: 100%;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }
  .cs-dropdown-inner {
    max-height: 220px;
    overflow-y: auto;
    padding: 6px;
  }
  .cs-dropdown-inner::-webkit-scrollbar { width: 3px; }
  .cs-dropdown-inner::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 10px; }
  .cs-option {
    padding: 10px 12px;
    border-radius: 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    color: rgba(255,255,255,0.75);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: background 0.15s, color 0.15s;
    font-weight: 500;
  }
  .cs-option:hover {
    background: rgba(139,92,246,0.18);
    color: white;
  }
  .cs-option.selected {
    background: rgba(139,92,246,0.25);
    color: white;
    font-weight: 700;
  }
  .cs-option-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
    opacity: 0.7;
  }
  .cs-check {
    margin-left: auto;
    width: 18px; height: 18px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    flex-shrink: 0;
  }
  .cs-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(139,92,246,0.15), transparent);
    margin: 4px 6px;
  }
  .cs-chevron {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), color 0.2s;
    flex-shrink: 0;
    color: rgba(196,181,253,0.5);
  }
  .cs-chevron.open { transform: rotate(180deg); color: #a78bfa; }
  .cs-placeholder { color: rgba(255,255,255,0.22); font-size: 13px; }
  .cs-value { color: white; font-weight: 600; font-size: 13.5px; }
  .cs-wrap { position: relative; width: 100%; }

  /* Op selector */
  .op-btn {
    width: 52px; height: 44px;
    border-radius: 14px;
    background: rgba(245,158,11,0.1);
    border: 1.5px solid rgba(245,158,11,0.25);
    color: #f59e0b;
    font-size: 20px; font-weight: 800;
    font-family: 'Outfit', sans-serif;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    position: relative;
    transition: all 0.2s;
  }
  .op-btn:hover { background: rgba(245,158,11,0.18); border-color: rgba(245,158,11,0.45); }
  .op-btn.open { background: rgba(245,158,11,0.22); border-color: #f59e0b; box-shadow: 0 0 0 3px rgba(245,158,11,0.15); }
  .op-dropdown {
    position: absolute;
    top: calc(100% + 6px);
    left: 50%; transform: translateX(-50%);
    background: linear-gradient(145deg, #180030, #110022);
    border: 1px solid rgba(245,158,11,0.28);
    border-radius: 14px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06);
    overflow: hidden;
    z-index: 9999;
    min-width: 60px;
    padding: 6px;
    backdrop-filter: blur(20px);
  }
  .op-item {
    width: 44px; height: 40px;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Outfit', sans-serif;
    font-size: 18px; font-weight: 800;
    color: rgba(255,255,255,0.7);
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .op-item:hover { background: rgba(245,158,11,0.2); color: #f59e0b; }
  .op-item.selected { background: rgba(245,158,11,0.25); color: #f59e0b; }

  .divider-line {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(139,92,246,0.15), transparent);
    margin: 4px 0 16px;
  }
`;

/* ✅ Inject GLOBAL_CSS only ONCE */
function useInjectGlobalCss(cssText) {
  useEffect(() => {
    const id = "expense-manager-global-css";
    let styleTag = document.getElementById(id);
    if (styleTag) return;

    styleTag = document.createElement("style");
    styleTag.id = id;
    styleTag.type = "text/css";
    styleTag.appendChild(document.createTextNode(cssText));
    document.head.appendChild(styleTag);

    return () => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    };
  }, [cssText]);
}

const Orb = ({ style }) => (
  <div
    style={{
      position: "absolute",
      borderRadius: "50%",
      filter: "blur(90px)",
      pointerEvents: "none",
      zIndex: 0,
      ...style,
    }}
  />
);

/* =========================
   FX HELPERS (Frankfurter -> open.er-api fallback)
========================= */
function numOrNaN(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

async function fetchJsonWithTimeout(url, ms = 8000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

// Provider 1: Frankfurter (supports many)
async function fetchFrankfurterCurrencies() {
  const json = await fetchJsonWithTimeout("https://api.frankfurter.app/currencies", 8000);
  if (!json || typeof json !== "object") throw new Error("Frankfurter currencies invalid");
  return json;
}

async function convertFrankfurter(amount, from, to) {
  if (!amount) throw new Error("No amount");
  if (!from || !to) throw new Error("Missing currency");

  const f = String(from).toUpperCase();
  const t = String(to).toUpperCase();
  if (f === t) return { value: Number(amount), rate: 1 };

  const url = `https://api.frankfurter.app/latest?amount=${encodeURIComponent(amount)}&from=${encodeURIComponent(
    f
  )}&to=${encodeURIComponent(t)}`;

  const json = await fetchJsonWithTimeout(url, 9000);
  const val = json?.rates?.[t];
  if (val == null) throw new Error("Frankfurter conversion missing result");
  const numericVal = Number(val);
  if (!Number.isFinite(numericVal)) throw new Error("Frankfurter conversion not numeric");

  const rate = numericVal / Number(amount);
  return { value: numericVal, rate };
}

// Provider 2: open.er-api fallback
async function convertOpenErApi(amount, from, to) {
  if (!amount) throw new Error("No amount");
  if (!from || !to) throw new Error("Missing currency");

  const f = String(from).toUpperCase();
  const t = String(to).toUpperCase();
  if (f === t) return { value: Number(amount), rate: 1 };

  const url = `https://open.er-api.com/v6/latest/${encodeURIComponent(f)}`;
  const json = await fetchJsonWithTimeout(url, 9000);
  const rates = json?.rates || json?.conversion_rates;
  const r = rates?.[t];
  if (r == null) throw new Error("Fallback conversion missing result");

  const rate = Number(r);
  if (!Number.isFinite(rate)) throw new Error("Fallback rate not numeric");

  const value = Number(amount) * rate;
  return { value, rate };
}

async function convertFx(amount, from, to) {
  try {
    return await convertFrankfurter(amount, from, to);
  } catch (e1) {
    try {
      return await convertOpenErApi(amount, from, to);
    } catch (e2) {
      const m1 = e1?.message || "Frankfurter failed";
      const m2 = e2?.message || "Fallback failed";
      throw new Error(`Currency API failed. Frankfurter: ${m1} | Fallback: ${m2}`);
    }
  }
}

/* =========================
   UI helpers
========================= */
const AnimNum = memo(function AnimNum({ value, prefix = "", color = "white" }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(value) || 0;
    if (end === 0) {
      setDisplay(0);
      return;
    }
    const dur = 650;
    const step = end / (dur / 16);
    const t = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplay(end);
        clearInterval(t);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(t);
  }, [value]);

  return (
    <span style={{ color, fontFamily: "'Outfit',sans-serif", fontWeight: 800 }}>
      {prefix}
      {Number(display || 0).toLocaleString()}
    </span>
  );
});

const KpiCard = memo(function KpiCard({ label, value, delta, color, icon, delay, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="em-card"
      style={{ padding: "22px 24px" }}
    >
      <Orb
        style={{
          top: -40,
          right: -40,
          width: 140,
          height: 140,
          background: `radial-gradient(circle,${color}28 0%,transparent 70%)`,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 13,
              background: `linear-gradient(135deg, ${color}25, ${color}12)`,
              border: `1px solid ${color}35`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 16px ${color}20`,
            }}
          >
            {React.cloneElement(icon, { sx: { color, fontSize: 20 } })}
          </div>
          {delta !== undefined && (
            <div
              className="em-tag"
              style={{
                background: `${color}18`,
                color,
                border: `1px solid ${color}30`,
                backdropFilter: "blur(8px)",
              }}
            >
              {delta >= 0 ? (
                <ArrowUpwardRoundedIcon style={{ fontSize: 10 }} />
              ) : (
                <ArrowDownwardRoundedIcon style={{ fontSize: 10 }} />
              )}
              {Math.abs(delta)}%
            </div>
          )}
        </div>
        <Typography
          sx={{
            color: "rgba(255,255,255,0.35)",
            fontFamily: "'Outfit',sans-serif",
            fontSize: 10,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            mb: 0.6,
            fontWeight: 600,
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Outfit',sans-serif",
            fontSize: 24,
            fontWeight: 800,
            color: "white",
            lineHeight: 1,
          }}
        >
          <AnimNum value={value} color="white" />
        </Typography>
        {subtitle && (
          <Typography
            sx={{
              color: "rgba(255,255,255,0.22)",
              fontFamily: "'Outfit',sans-serif",
              fontSize: 11,
              mt: 0.8,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </div>
    </motion.div>
  );
});

const Heading = memo(function Heading({ icon, title, count, color }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 13,
              background: `linear-gradient(135deg, ${color}20, ${color}08)`,
              border: `1px solid ${color}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 20px ${color}18`,
            }}
          >
            {React.cloneElement(icon, { sx: { color, fontSize: 20 } })}
          </div>
          <Typography
            sx={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 20,
              fontStyle: "italic",
              color: "white",
              lineHeight: 1.1,
            }}
          >
            {title}
          </Typography>
        </div>
        {count !== undefined && (
          <div
            className="em-tag"
            style={{
              background: `${color}12`,
              color: `${color}bb`,
              border: `1px solid ${color}22`,
            }}
          >
            {count} records
          </div>
        )}
      </div>
      <div className="divider-line" />
    </div>
  );
});

const THead = memo(function THead({ cols, labels }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: cols,
        padding: "7px 16px",
        marginBottom: 6,
        borderRadius: 10,
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {labels.map((h, i) => (
        <Typography
          key={h}
          sx={{
            color: "rgba(255,255,255,0.2)",
            fontFamily: "'Outfit',sans-serif",
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            textAlign: i === labels.length - 1 ? "center" : "left",
          }}
        >
          {h}
        </Typography>
      ))}
    </div>
  );
});

const Btn = memo(function Btn({ tip, color, onClick, isLoading, icon: Icon }) {
  return (
    <Tooltip title={tip} placement="top" arrow>
      <span>
        <motion.div whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }}>
          <IconButton
            size="small"
            onClick={onClick}
            disabled={isLoading}
            sx={{
              width: 30,
              height: 30,
              borderRadius: "10px",
              background: `${color}1a`,
              border: `1px solid ${color}30`,
              "&:hover": {
                background: `${color}2e`,
                borderColor: `${color}55`,
                boxShadow: `0 4px 12px ${color}25`,
              },
              transition: "all 0.18s",
            }}
          >
            {isLoading ? <CircularProgress size={11} sx={{ color }} /> : <Icon sx={{ color, fontSize: 14 }} />}
          </IconButton>
        </motion.div>
      </span>
    </Tooltip>
  );
});

/* ─── Custom Select ─────────────────────────── */
const CustomSelect = memo(function CustomSelect({ value, onChange, options, placeholder, accentColor }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => String(o.id) === String(value));

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const accent = accentColor || C.v300;

  return (
    <div className="cs-wrap" ref={ref}>
      <div
        className={`cs-trigger${open ? " open" : ""}${value ? " has-value" : ""}`}
        onClick={() => setOpen((v) => !v)}
        style={value ? { borderColor: `${accent}45` } : {}}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden", flex: 1, minWidth: 0 }}>
          {selected ? (
            <>
              <div className="cs-option-dot" style={{ background: accent }} />
              <span className="cs-value" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {selected.label}
              </span>
            </>
          ) : (
            <span className="cs-placeholder">{placeholder}</span>
          )}
        </div>
        <span className={`cs-chevron${open ? " open" : ""}`}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="cs-dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${accent}88, transparent)` }} />
            <div className="cs-dropdown-inner">
              {options.length === 0 && (
                <div
                  style={{
                    padding: "14px 12px",
                    textAlign: "center",
                    color: "rgba(255,255,255,0.25)",
                    fontSize: 12,
                    fontFamily: "'Outfit',sans-serif",
                  }}
                >
                  No options available
                </div>
              )}

              {options.map((opt, i) => {
                const isSelected = String(opt.id) === String(value);
                return (
                  <React.Fragment key={opt.id}>
                    {i > 0 && i % 7 === 0 && <div className="cs-divider" />}
                    <motion.div
                      className={`cs-option${isSelected ? " selected" : ""}`}
                      onClick={() => {
                        onChange(String(opt.id));
                        setOpen(false);
                      }}
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.12 }}
                    >
                      <div className="cs-option-dot" style={{ background: isSelected ? accent : "rgba(255,255,255,0.2)" }} />
                      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {opt.label}
                      </span>
                      {isSelected && (
                        <div className="cs-check" style={{ background: `${accent}25`, color: accent }}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5L4 7L8 3" stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                    </motion.div>
                  </React.Fragment>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

/* ─── Operator Select ─────────────────────────── */
const OpSelect = memo(function OpSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const ops = [
    { v: "+", label: "+" },
    { v: "-", label: "−" },
    { v: "*", label: "×" },
    { v: "/", label: "÷" },
  ];
  const current = ops.find((o) => o.v === value);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <motion.button
        className={`op-btn${open ? " open" : ""}`}
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
      >
        {current?.label}
      </motion.button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="op-dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
          >
            {ops.map((op) => (
              <div
                key={op.v}
                className={`op-item${value === op.v ? " selected" : ""}`}
                onClick={() => {
                  onChange(op.v);
                  setOpen(false);
                }}
              >
                {op.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

const ISX = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 14,
    background: "rgba(255,255,255,0.04)",
    color: "white",
    fontFamily: "'Outfit',sans-serif",
    fontSize: 13.5,
    height: 44,
    transition: "all 0.2s",
    "& fieldset": { borderColor: "rgba(255,255,255,0.09)", borderWidth: 1.5 },
    "&:hover fieldset": { borderColor: "rgba(139,92,246,0.4)" },
    "&.Mui-focused fieldset": { borderColor: C.v300, borderWidth: 1.5 },
    "&.Mui-focused": { background: "rgba(139,92,246,0.08)" },
  },
  "& input": { fontFamily: "'Outfit',sans-serif", fontSize: 13.5 },
  "& input::placeholder": { color: "rgba(255,255,255,0.2)", opacity: 1 },
};

/* ✅ Focus-safe / no layout-animations form */
const EntryForm = memo(function EntryForm({
  amtV,
  setAmtV,
  dateV,
  setDateV,
  selV,
  setSelV,
  opts,
  selPH,
  onSave,
  onCancel,
  isEdit,
  accentColor,
  maxDate,

  currencyV,
  setCurrencyV,
  currencyOpts,
  currencyPH = "Currency",
  currencyEnabled = false,

  saving = false,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: currencyEnabled ? "1fr 120px 1fr 1.2fr auto" : "1fr 1fr 1.2fr auto",
        gap: 8,
        padding: "14px 16px 16px",
        borderRadius: 18,
        background: `linear-gradient(135deg, ${accentColor}07 0%, rgba(255,255,255,0.02) 100%)`,
        border: `1px solid ${accentColor}16`,
        marginBottom: 16,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      <TextField
        value={amtV}
        onChange={(e) => setAmtV(e.target.value)}
        placeholder="0.00"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <span
                style={{
                  color: `${accentColor}99`,
                  fontSize: 14,
                  fontFamily: "'Outfit',sans-serif",
                  fontWeight: 700,
                }}
              >
                {currencyEnabled ? "" : "₹"}
              </span>
            </InputAdornment>
          ),
        }}
        sx={ISX}
      />

      {currencyEnabled && (
        <CustomSelect
          value={currencyV}
          onChange={setCurrencyV}
          options={currencyOpts}
          placeholder={currencyPH}
          accentColor={accentColor}
        />
      )}

      <TextField
        type="date"
        value={dateV}
        onChange={(e) => setDateV(e.target.value)}
        size="small"
        inputProps={{ max: maxDate }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CalendarTodayRoundedIcon sx={{ color: "rgba(255,255,255,0.22)", fontSize: 14 }} />
            </InputAdornment>
          ),
        }}
        sx={ISX}
      />

      <CustomSelect value={selV} onChange={setSelV} options={opts} placeholder={selPH} accentColor={accentColor} />

      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <motion.button
          type="button"
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.96 }}
          onClick={onSave}
          disabled={saving}
          style={{
            height: 44,
            padding: "0 18px",
            borderRadius: 13,
            border: `1px solid ${accentColor}50`,
            background: `linear-gradient(135deg, ${accentColor}dd, ${accentColor}99)`,
            boxShadow: `0 6px 24px ${accentColor}38, inset 0 1px 0 rgba(255,255,255,0.22)`,
            color: "white",
            fontFamily: "'Outfit',sans-serif",
            fontSize: 12.5,
            fontWeight: 700,
            cursor: saving ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
            flexShrink: 0,
            opacity: saving ? 0.8 : 1,
          }}
        >
          {saving ? (
            <>
              <CircularProgress size={14} sx={{ color: "white" }} />
              Saving...
            </>
          ) : isEdit ? (
            <>
              <CheckRoundedIcon style={{ fontSize: 14 }} />
              Update
            </>
          ) : (
            <>
              <AddRoundedIcon style={{ fontSize: 14 }} />
              Add
            </>
          )}
        </motion.button>

        <AnimatePresence initial={false}>
          {isEdit && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.9, width: 0 }}
              animate={{ opacity: 1, scale: 1, width: 34 }}
              exit={{ opacity: 0, scale: 0.9, width: 0 }}
              transition={{ duration: 0.16 }}
              onClick={onCancel}
              style={{
                height: 44,
                borderRadius: 13,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.45)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <CloseRoundedIcon style={{ fontSize: 16 }} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

const ExpenseManagerWorking = ({ onBack }) => {
  useInjectGlobalCss(GLOBAL_CSS);

  const uid = sessionStorage.getItem("uid") || "";
  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const isFutureDate = useCallback((d) => (d ? d > todayISO : false), [todayISO]);

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const [profile, setProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [sources, setSources] = useState([]);

  const [currencyMap, setCurrencyMap] = useState({});
  const [currencyOptions, setCurrencyOptions] = useState([
    { id: "INR", label: "INR — Indian Rupee" },
    { id: "USD", label: "USD — US Dollar" },
    { id: "EUR", label: "EUR — Euro" },
    { id: "GBP", label: "GBP — British Pound" },
    { id: "AED", label: "AED — UAE Dirham" },
  ]);
  const [currenciesReady, setCurrenciesReady] = useState(false);

  const categoryMap = useMemo(() => {
    const m = {};
    categories.forEach((c) => (m[c.id] = c.Category_name));
    return m;
  }, [categories]);

  const sourceMap = useMemo(() => {
    const m = {};
    sources.forEach((s) => (m[s.id] = s.incSource_name));
    return m;
  }, [sources]);

  // Expense
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCurrency, setExpenseCurrency] = useState("INR");
  const [expenseDate, setExpenseDate] = useState("");
  const [expenseCategoryId, setExpenseCategoryId] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [editExpenseId, setEditExpenseId] = useState(null);
  const [editExpenseAmount, setEditExpenseAmount] = useState("");
  const [editExpenseCurrency, setEditExpenseCurrency] = useState("INR");
  const [editExpenseDate, setEditExpenseDate] = useState("");
  const [editExpenseCategoryId, setEditExpenseCategoryId] = useState("");
  const [savingExpense, setSavingExpense] = useState(false);

  // Income
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeCurrency, setIncomeCurrency] = useState("INR");
  const [incomeDate, setIncomeDate] = useState("");
  const [incomeSourceId, setIncomeSourceId] = useState("");
  const [incomes, setIncomes] = useState([]);
  const [editIncomeId, setEditIncomeId] = useState(null);
  const [editIncomeAmount, setEditIncomeAmount] = useState("");
  const [editIncomeCurrency, setEditIncomeCurrency] = useState("INR");
  const [editIncomeDate, setEditIncomeDate] = useState("");
  const [editIncomeSourceId, setEditIncomeSourceId] = useState("");
  const [savingIncome, setSavingIncome] = useState(false);

  // Calculator
  const [calcA, setCalcA] = useState("");
  const [calcB, setCalcB] = useState("");
  const [calcOp, setCalcOp] = useState("+");
  const [calcResult, setCalcResult] = useState("");

  // Currency converter
  const [fromCur, setFromCur] = useState("USD");
  const [toCur, setToCur] = useState("INR");
  const [curAmt, setCurAmt] = useState("1");
  const [curResult, setCurResult] = useState("");
  const [curLoading, setCurLoading] = useState(false);

  const [toast, setToast] = useState({ open: false, msg: "", type: "success" });
  const notify = useCallback((msg, type = "success") => setToast({ open: true, msg, type }), []);

  // Totals: prefer *_amount_inr (your DB), fallback to *_amount
  const totalInc = useMemo(
    () => incomes.reduce((s, r) => s + Number(r.income_amount_inr ?? r.income_amount ?? 0), 0),
    [incomes]
  );
  const totalExp = useMemo(
    () => expenses.reduce((s, r) => s + Number(r.expense_amount_inr ?? r.expense_amount ?? 0), 0),
    [expenses]
  );
  const balance = totalInc - totalExp;

  const loadProfile = useCallback(async () => {
    if (!uid) return setProfile(null);
    const { data, error } = await supabase.from("tbl_student").select("*").eq("id", uid).single();
    if (error) return setProfile(null);
    setProfile(data);
  }, [uid]);

  const loadCategories = useCallback(async () => {
    const { data } = await supabase.from("tbl_expenseCategory").select("*").order("Category_name", { ascending: true });
    setCategories(data || []);
  }, []);

  const loadSources = useCallback(async () => {
    const { data } = await supabase.from("tbl_incSource").select("*").order("incSource_name", { ascending: true });
    setSources(data || []);
  }, []);

  const loadExpenses = useCallback(async () => {
    if (!uid) return setExpenses([]);
    const { data } = await supabase
      .from("tbl_expense")
      .select("*")
      .eq("student_id", uid)
      .order("id", { ascending: false });
    setExpenses(data || []);
  }, [uid]);

  const loadIncomes = useCallback(async () => {
    if (!uid) return setIncomes([]);
    const { data } = await supabase
      .from("tbl_income")
      .select("*")
      .eq("student_id", uid)
      .order("id", { ascending: false });
    setIncomes(data || []);
  }, [uid]);

  // ✅ Load currencies once + keep fallback list if fails
  const loadCurrencies = useCallback(async () => {
    try {
      const m = await fetchFrankfurterCurrencies();
      setCurrencyMap(m || {});
      const opts = Object.keys(m || {})
        .sort()
        .map((code) => ({ id: code, label: `${code} — ${m[code]}` }));
      if (opts.length) setCurrencyOptions(opts);
      setCurrenciesReady(true);
    } catch (e) {
      setCurrenciesReady(true);
    }
  }, []);

  useEffect(() => {
    loadProfile();
    loadCategories();
    loadSources();
    loadExpenses();
    loadIncomes();
    loadCurrencies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ✅ DB save helpers — EXACT columns as your tables */
  const insertIncome = useCallback(async (payload) => {
    return await supabase.from("tbl_income").insert([payload]);
  }, []);

  const updateIncomeRow = useCallback(async (id, payload) => {
    return await supabase.from("tbl_income").update(payload).eq("id", id);
  }, []);

  const insertExpense = useCallback(async (payload) => {
    return await supabase.from("tbl_expense").insert([payload]);
  }, []);

  const updateExpenseRow = useCallback(async (id, payload) => {
    return await supabase.from("tbl_expense").update(payload).eq("id", id);
  }, []);

  /* ✅ SAVE EXPENSE (stores ALL currency fields) */
  const saveExpense = useCallback(async () => {
    const amt = numOrNaN(expenseAmount);
    if (!expenseAmount || Number.isNaN(amt)) return notify("Enter valid expense amount", "error");
    if (!expenseDate) return notify("Select expense date", "error");
    if (isFutureDate(expenseDate)) return notify("Future dates not allowed", "error");
    if (!expenseCategoryId) return notify("Select category", "error");
    if (!expenseCurrency) return notify("Select currency", "error");

    setSavingExpense(true);
    try {
      const cur = String(expenseCurrency).toUpperCase();
      const fx = cur === "INR" ? { value: amt, rate: 1 } : await convertFx(amt, cur, "INR");

      const inrValue = Number(fx.value);

      const payload = {
        expense_amount: inrValue, // keep INR for totals (and for legacy)
        expense_amount_inr: inrValue,
        expense_date: expenseDate,
        category_id: Number(expenseCategoryId),
        student_id: uid,

        expense_currency: cur,
        expense_amount_original: Number(amt),
        exchange_rate_to_inr: Number(fx.rate),
        rate_date: expenseDate, // you can change to todayISO if you want
      };

      const { error } = await insertExpense(payload);
      if (error) return notify(error.message || "Insert failed", "error");

      setExpenseAmount("");
      setExpenseDate("");
      setExpenseCategoryId("");
      setExpenseCurrency("INR");
      notify("Expense saved! ✓");
      loadExpenses();
    } catch (e) {
      notify(e?.message || "Save error", "error");
    } finally {
      setSavingExpense(false);
    }
  }, [
    expenseAmount,
    expenseDate,
    expenseCategoryId,
    expenseCurrency,
    uid,
    insertExpense,
    loadExpenses,
    notify,
    isFutureDate,
  ]);

  const startEditExpense = useCallback((row) => {
    setEditExpenseId(row.id);
    const orig = row.expense_amount_original ?? row.expense_amount ?? "";
    setEditExpenseAmount(String(orig));
    setEditExpenseDate(row.expense_date || "");
    setEditExpenseCategoryId(String(row.category_id ?? ""));
    setEditExpenseCurrency(String(row.expense_currency || "INR"));
  }, []);

  const cancelEditExpense = useCallback(() => {
    setEditExpenseId(null);
    setEditExpenseAmount("");
    setEditExpenseDate("");
    setEditExpenseCategoryId("");
    setEditExpenseCurrency("INR");
  }, []);

  const updateExpense = useCallback(async () => {
    const amt = numOrNaN(editExpenseAmount);
    if (!editExpenseDate) return notify("Select expense date", "error");
    if (isFutureDate(editExpenseDate)) return notify("Future dates not allowed", "error");
    if (!editExpenseCategoryId) return notify("Select category", "error");
    if (!editExpenseCurrency) return notify("Select currency", "error");
    if (Number.isNaN(amt)) return notify("Enter valid amount", "error");

    setSavingExpense(true);
    try {
      const cur = String(editExpenseCurrency).toUpperCase();
      const fx = cur === "INR" ? { value: amt, rate: 1 } : await convertFx(amt, cur, "INR");

      const inrValue = Number(fx.value);

      const payload = {
        expense_amount: inrValue,
        expense_amount_inr: inrValue,
        expense_date: editExpenseDate,
        category_id: Number(editExpenseCategoryId),

        expense_currency: cur,
        expense_amount_original: Number(amt),
        exchange_rate_to_inr: Number(fx.rate),
        rate_date: editExpenseDate,
      };

      const { error } = await updateExpenseRow(editExpenseId, payload);
      if (error) return notify(error.message || "Update failed", "error");

      notify("Updated! ✓");
      cancelEditExpense();
      loadExpenses();
    } catch (e) {
      notify(e?.message || "Update error", "error");
    } finally {
      setSavingExpense(false);
    }
  }, [
    editExpenseAmount,
    editExpenseDate,
    editExpenseCategoryId,
    editExpenseCurrency,
    editExpenseId,
    updateExpenseRow,
    notify,
    cancelEditExpense,
    loadExpenses,
    isFutureDate,
  ]);

  const deleteExpense = useCallback(
    async (id) => {
      const ok = window.confirm("Delete this expense?");
      if (!ok) return;
      const { error } = await supabase.from("tbl_expense").delete().eq("id", id);
      if (error) return notify(error.message || "Delete failed", "error");
      notify("Removed", "info");
      loadExpenses();
    },
    [loadExpenses, notify]
  );

  /* ✅ SAVE INCOME (stores ALL currency fields) */
  const saveIncome = useCallback(async () => {
    const amt = numOrNaN(incomeAmount);
    if (!incomeAmount || Number.isNaN(amt)) return notify("Enter valid income amount", "error");
    if (!incomeDate) return notify("Select income date", "error");
    if (isFutureDate(incomeDate)) return notify("Future dates not allowed", "error");
    if (!incomeSourceId) return notify("Select income source", "error");
    if (!incomeCurrency) return notify("Select currency", "error");

    setSavingIncome(true);
    try {
      const cur = String(incomeCurrency).toUpperCase();
      const fx = cur === "INR" ? { value: amt, rate: 1 } : await convertFx(amt, cur, "INR");

      const inrValue = Number(fx.value);

      const payload = {
        income_amount: inrValue, // keep INR for totals (and for legacy)
        income_amount_inr: inrValue,
        income_date: incomeDate,
        incomeSource_id: Number(incomeSourceId),
        student_id: uid,

        income_currency: cur,
        income_amount_original: Number(amt),
        exchange_rate_to_inr: Number(fx.rate),
        rate_date: incomeDate,
      };

      const { error } = await insertIncome(payload);
      if (error) return notify(error.message || "Insert failed", "error");

      setIncomeAmount("");
      setIncomeDate("");
      setIncomeSourceId("");
      setIncomeCurrency("INR");
      notify("Income saved! ✓");
      loadIncomes();
    } catch (e) {
      notify(e?.message || "Save error", "error");
    } finally {
      setSavingIncome(false);
    }
  }, [
    incomeAmount,
    incomeDate,
    incomeSourceId,
    incomeCurrency,
    uid,
    insertIncome,
    loadIncomes,
    notify,
    isFutureDate,
  ]);

  const startEditIncome = useCallback((row) => {
    setEditIncomeId(row.id);
    const orig = row.income_amount_original ?? row.income_amount ?? "";
    setEditIncomeAmount(String(orig));
    setEditIncomeDate(row.income_date || "");
    setEditIncomeSourceId(String(row.incomeSource_id ?? ""));
    setEditIncomeCurrency(String(row.income_currency || "INR"));
  }, []);

  const cancelEditIncome = useCallback(() => {
    setEditIncomeId(null);
    setEditIncomeAmount("");
    setEditIncomeDate("");
    setEditIncomeSourceId("");
    setEditIncomeCurrency("INR");
  }, []);

  const updateIncome = useCallback(async () => {
    const amt = numOrNaN(editIncomeAmount);
    if (!editIncomeDate) return notify("Select income date", "error");
    if (isFutureDate(editIncomeDate)) return notify("Future dates not allowed", "error");
    if (!editIncomeSourceId) return notify("Select income source", "error");
    if (!editIncomeCurrency) return notify("Select currency", "error");
    if (Number.isNaN(amt)) return notify("Enter valid amount", "error");

    setSavingIncome(true);
    try {
      const cur = String(editIncomeCurrency).toUpperCase();
      const fx = cur === "INR" ? { value: amt, rate: 1 } : await convertFx(amt, cur, "INR");

      const inrValue = Number(fx.value);

      const payload = {
        income_amount: inrValue,
        income_amount_inr: inrValue,
        income_date: editIncomeDate,
        incomeSource_id: Number(editIncomeSourceId),

        income_currency: cur,
        income_amount_original: Number(amt),
        exchange_rate_to_inr: Number(fx.rate),
        rate_date: editIncomeDate,
      };

      const { error } = await updateIncomeRow(editIncomeId, payload);
      if (error) return notify(error.message || "Update failed", "error");

      notify("Updated! ✓");
      cancelEditIncome();
      loadIncomes();
    } catch (e) {
      notify(e?.message || "Update error", "error");
    } finally {
      setSavingIncome(false);
    }
  }, [
    editIncomeAmount,
    editIncomeDate,
    editIncomeSourceId,
    editIncomeCurrency,
    editIncomeId,
    updateIncomeRow,
    notify,
    cancelEditIncome,
    loadIncomes,
    isFutureDate,
  ]);

  const deleteIncome = useCallback(
    async (id) => {
      const ok = window.confirm("Delete this income?");
      if (!ok) return;
      const { error } = await supabase.from("tbl_income").delete().eq("id", id);
      if (error) return notify(error.message || "Delete failed", "error");
      notify("Removed", "info");
      loadIncomes();
    },
    [loadIncomes, notify]
  );

  const doCalc = useCallback(() => {
    const a = Number(calcA);
    const b = Number(calcB);
    if (Number.isNaN(a) || Number.isNaN(b)) return setCalcResult("Invalid");
    let r = 0;
    if (calcOp === "+") r = a + b;
    if (calcOp === "-") r = a - b;
    if (calcOp === "*") r = a * b;
    if (calcOp === "/") r = b === 0 ? "Infinity" : a / b;
    setCalcResult(String(r));
  }, [calcA, calcB, calcOp]);

  const convertCurrency = useCallback(async () => {
    const amt = numOrNaN(curAmt);
    if (!curAmt || Number.isNaN(amt)) return notify("Enter valid amount", "error");
    if (!fromCur || !toCur) return notify("Select currencies", "error");

    setCurLoading(true);
    setCurResult("");
    try {
      const fx = await convertFx(amt, fromCur, toCur);
      setCurResult(`${amt} ${String(fromCur).toUpperCase()} = ${fx.value} ${String(toCur).toUpperCase()}`);
    } catch (e) {
      notify(e?.message || "Conversion error", "error");
      setCurResult("Conversion error");
    } finally {
      setCurLoading(false);
    }
  }, [curAmt, fromCur, toCur, notify]);

  if (!uid) {
    return (
      <div style={{ padding: 20, color: "white", fontFamily: "'Outfit',sans-serif" }}>
        Not logged in (uid missing). Please login.
      </div>
    );
  }

  const savingsRate = totalInc > 0 ? Math.round(((totalInc - totalExp) / totalInc) * 100) : 0;

  const fmtMoney = (rowType, row) => {
    if (rowType === "income") {
      const ccy = row.income_currency;
      const orig = row.income_amount_original;
      if (ccy && orig != null) return `${ccy} ${Number(orig).toLocaleString()}`;
      const inr = Number(row.income_amount_inr ?? row.income_amount ?? 0);
      return `INR ₹${inr.toLocaleString()}`;
    }
    const ccy = row.expense_currency;
    const orig = row.expense_amount_original;
    if (ccy && orig != null) return `${ccy} ${Number(orig).toLocaleString()}`;
    const inr = Number(row.expense_amount_inr ?? row.expense_amount ?? 0);
    return `INR ₹${inr.toLocaleString()}`;
  };

  return (
    <>
      <MotionConfig reducedMotion="user">
        <div
          style={{
            minHeight: "100vh",
            width: "100%",
            background: `radial-gradient(ellipse 90% 70% at 50% -10%, rgba(109,40,217,0.38) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 90% 80%, rgba(91,33,182,0.2) 0%, transparent 50%),
            linear-gradient(170deg, ${C.bg0} 0%, ${C.bg1} 40%, ${C.bg2} 100%)`,
            fontFamily: "'Outfit',sans-serif",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Orb
            style={{
              top: "-15%",
              left: "-10%",
              width: 600,
              height: 600,
              background: `radial-gradient(circle, rgba(109,40,217,0.45) 0%, transparent 65%)`,
              animation: "bgDrift 28s ease-in-out infinite",
            }}
          />
          <Orb
            style={{
              bottom: "-10%",
              right: "-8%",
              width: 500,
              height: 500,
              background: `radial-gradient(circle, rgba(91,33,182,0.35) 0%, transparent 65%)`,
              animation: "bgDrift2 36s ease-in-out infinite",
            }}
          />
          <Orb
            style={{
              top: "40%",
              left: "45%",
              width: 400,
              height: 400,
              background: `radial-gradient(circle, rgba(76,29,149,0.2) 0%, transparent 65%)`,
              animation: "bgDrift 50s ease-in-out infinite reverse",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.025,
              backgroundImage: NOISE,
              backgroundRepeat: "repeat",
              backgroundSize: "200px",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              pointerEvents: "none",
              backgroundImage: `linear-gradient(rgba(139,92,246,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.035) 1px,transparent 1px)`,
              backgroundSize: "64px 64px",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              padding: "28px 40px 52px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{ marginBottom: 18 }}>
                <motion.button
                  className="back-btn"
                  type="button"
                  whileHover={{ x: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onBack ?? (() => window.history.back())}
                >
                  <ArrowBackRoundedIcon sx={{ fontSize: 17, color: C.v100 }} />
                  <span>Back</span>
                </motion.button>
              </div>

              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: C.v300,
                        boxShadow: `0 0 8px ${C.v300}`,
                        animation: "pulseRing 2.5s ease-in-out infinite",
                      }}
                    />
                    <Typography
                      sx={{
                        color: C.v200,
                        fontFamily: "'Outfit',sans-serif",
                        fontSize: 11,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        opacity: 0.7,
                        fontWeight: 600,
                      }}
                    >
                      Student Portal · Finance
                    </Typography>
                  </div>
                  <Typography
                    sx={{
                      fontFamily: "'Instrument Serif',serif",
                      fontSize: "clamp(28px,3.2vw,46px)",
                      fontStyle: "italic",
                      color: "white",
                      lineHeight: 1.1,
                    }}
                  >
                    Expense Manager
                  </Typography>
                </div>

                <div style={{ textAlign: "right" }}>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.18)",
                      fontFamily: "'Outfit',sans-serif",
                      fontSize: 12,
                    }}
                  >
                    {now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.1)",
                      fontFamily: "'Outfit',sans-serif",
                      fontSize: 11,
                      mt: 0.3,
                    }}
                  >
                    {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </Typography>
                </div>
              </div>
            </motion.div>

            {/* KPI */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
              <KpiCard
                label="Total Income (INR)"
                value={totalInc}
                color={C.inc}
                icon={<TrendingUpRoundedIcon />}
                delay={0.06}
                subtitle={`${incomes.length} transactions`}
              />
              <KpiCard
                label="Total Expense (INR)"
                value={totalExp}
                color={C.exp}
                icon={<TrendingDownRoundedIcon />}
                delay={0.1}
                subtitle={`${expenses.length} transactions`}
              />
              <KpiCard
                label="Net Balance (INR)"
                value={Math.abs(balance)}
                delta={balance >= 0 ? savingsRate : -Math.abs(savingsRate)}
                color={balance >= 0 ? C.v300 : C.gold}
                icon={<AccountBalanceWalletRoundedIcon />}
                delay={0.14}
                subtitle={balance >= 0 ? "Surplus" : "Deficit"}
              />
              <KpiCard
                label="Transactions"
                value={incomes.length + expenses.length}
                color={C.teal}
                icon={<BarChartRoundedIcon />}
                delay={0.18}
                subtitle="Total records"
              />
            </div>

            {/* Budget bar */}
            {totalInc > 0 && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0.96 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.22, duration: 0.45 }}
                className="em-card"
                style={{ padding: "16px 24px" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.5)",
                      fontFamily: "'Outfit',sans-serif",
                      fontSize: 11,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    Budget Health (INR)
                  </Typography>
                  <Typography sx={{ color: balance >= 0 ? C.inc : C.exp, fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 700 }}>
                    {`${Math.round((totalExp / totalInc) * 100)}% spent`}
                  </Typography>
                </div>
                <div style={{ height: 6, borderRadius: 10, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((totalExp / totalInc) * 100, 100)}%` }}
                    transition={{ delay: 0.35, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      height: "100%",
                      borderRadius: 10,
                      background:
                        totalExp / totalInc > 0.8 ? `linear-gradient(90deg, ${C.gold}, ${C.exp})` : `linear-gradient(90deg, ${C.v400}, ${C.inc})`,
                      boxShadow: `0 0 10px ${totalExp / totalInc > 0.8 ? C.exp : C.v300}50`,
                    }}
                  />
                </div>
              </motion.div>
            )}

            {/* Row 1: Profile | Calculator | Currency */}
            <div style={{ display: "grid", gridTemplateColumns: "0.85fr 1fr 1fr", gap: 16 }}>
              {/* Profile */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="em-card"
                style={{ padding: "24px" }}
              >
                <Orb style={{ top: -40, right: -40, width: 160, height: 160, background: `radial-gradient(circle,${C.v400}25,transparent 70%)` }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <Heading icon={<PersonRoundedIcon />} title="Profile" color={C.v200} />
                  {profile ? (
                    <>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          marginBottom: 18,
                          padding: "14px",
                          borderRadius: 18,
                          background: "rgba(139,92,246,0.07)",
                          border: "1px solid rgba(139,92,246,0.16)",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: `linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.03) 50%,transparent 100%)`,
                            backgroundSize: "200% 100%",
                            animation: "shimmerFlow 4s linear infinite",
                            pointerEvents: "none",
                          }}
                        />
                        {profile.student_photo ? (
                          <img
                            src={profile.student_photo}
                            alt=""
                            style={{
                              width: 56,
                              height: 56,
                              borderRadius: 16,
                              objectFit: "cover",
                              border: `2px solid ${C.v300}55`,
                              boxShadow: `0 8px 24px ${C.glow}`,
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 56,
                              height: 56,
                              borderRadius: 16,
                              background: `linear-gradient(135deg,${C.v500},${C.v700})`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              boxShadow: `0 8px 24px ${C.glow}`,
                            }}
                          >
                            <PersonRoundedIcon sx={{ color: "white", fontSize: 28 }} />
                          </div>
                        )}
                        <div>
                          <Typography
                            sx={{
                              color: "white",
                              fontFamily: "'Outfit',sans-serif",
                              fontSize: 15,
                              fontWeight: 700,
                              lineHeight: 1.2,
                            }}
                          >
                            {profile.student_name}
                          </Typography>
                          <div
                            className="em-tag"
                            style={{
                              marginTop: 5,
                              background: C.glowS,
                              color: C.v100,
                              border: `1px solid ${C.v300}30`,
                            }}
                          >
                            <AutoAwesomeRoundedIcon style={{ fontSize: 9 }} /> Student
                          </div>
                        </div>
                      </div>
                      {[
                        { icon: <EmailRoundedIcon sx={{ fontSize: 13 }} />, val: profile.student_email },
                        { icon: <PhoneRoundedIcon sx={{ fontSize: 13 }} />, val: profile.student_contact },
                        { icon: <HomeRoundedIcon sx={{ fontSize: 13 }} />, val: profile.student_address },
                        { icon: <PublicRoundedIcon sx={{ fontSize: 13 }} />, val: profile.student_country },
                      ]
                        .filter((r) => r.val)
                        .map((row, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              padding: "10px 0",
                              borderBottom: "1px solid rgba(255,255,255,0.04)",
                            }}
                          >
                            <span style={{ color: `${C.v200}55`, display: "flex", flexShrink: 0 }}>{row.icon}</span>
                            <Typography
                              sx={{
                                color: "rgba(255,255,255,0.5)",
                                fontFamily: "'Outfit',sans-serif",
                                fontSize: 12.5,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {row.val}
                            </Typography>
                          </div>
                        ))}
                    </>
                  ) : (
                    <div style={{ padding: "28px 0", textAlign: "center" }}>
                      <Typography sx={{ color: "rgba(255,255,255,0.15)", fontFamily: "'Outfit',sans-serif", fontSize: 13 }}>
                        Profile not loaded
                      </Typography>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Calculator */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.13, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="em-card"
                style={{ padding: "24px" }}
              >
                <Orb style={{ bottom: -40, left: -40, width: 180, height: 180, background: `radial-gradient(circle,${C.gold}20,transparent 70%)` }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <Heading icon={<CalculateRoundedIcon />} title="Calculator" color={C.gold} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 52px 1fr", gap: 8, alignItems: "center" }}>
                      <TextField
                        value={calcA}
                        onChange={(e) => setCalcA(e.target.value)}
                        placeholder="0"
                        size="small"
                        sx={ISX}
                        inputProps={{ style: { textAlign: "right", fontWeight: 700, fontSize: 15 } }}
                      />
                      <OpSelect value={calcOp} onChange={setCalcOp} />
                      <TextField
                        value={calcB}
                        onChange={(e) => setCalcB(e.target.value)}
                        placeholder="0"
                        size="small"
                        sx={ISX}
                        inputProps={{ style: { textAlign: "left", fontWeight: 700, fontSize: 15 } }}
                      />
                    </div>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={doCalc}
                      style={{
                        height: 44,
                        borderRadius: 14,
                        border: `1px solid ${C.gold}40`,
                        background: `linear-gradient(135deg,${C.gold}28,${C.gold}14)`,
                        boxShadow: `0 4px 20px ${C.gold}22`,
                        color: C.gold,
                        fontFamily: "'Outfit',sans-serif",
                        fontSize: 13,
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 7,
                      }}
                    >
                      <CalculateRoundedIcon style={{ fontSize: 17 }} /> Calculate
                    </motion.button>

                    <AnimatePresence initial={false}>
                      {calcResult !== "" && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.98, y: 6 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98, y: -6 }}
                          transition={{ duration: 0.16 }}
                          style={{
                            padding: "18px 20px",
                            borderRadius: 18,
                            background: `linear-gradient(135deg,${C.gold}12,${C.gold}06)`,
                            border: `1px solid ${C.gold}25`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04)`,
                          }}
                        >
                          <Typography
                            sx={{
                              color: "rgba(255,255,255,0.35)",
                              fontFamily: "'Outfit',sans-serif",
                              fontSize: 10.5,
                              letterSpacing: "0.14em",
                              textTransform: "uppercase",
                            }}
                          >
                            Result
                          </Typography>
                          <Typography
                            sx={{
                              color: C.gold,
                              fontFamily: "'Instrument Serif',serif",
                              fontSize: 36,
                              fontWeight: 400,
                              lineHeight: 1,
                            }}
                          >
                            {calcResult}
                          </Typography>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>

              {/* Currency */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="em-card"
                style={{ padding: "24px" }}
              >
                <Orb style={{ top: -20, right: -30, width: 170, height: 170, background: `radial-gradient(circle,${C.teal}22,transparent 70%)` }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <Heading icon={<CurrencyExchangeRoundedIcon />} title="Currency" color={C.teal} />

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <TextField
                      value={curAmt}
                      onChange={(e) => setCurAmt(e.target.value)}
                      placeholder="1.00"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <span style={{ color: "rgba(255,255,255,0.28)", fontSize: 13, fontFamily: "'Outfit',sans-serif" }}>
                              Amount
                            </span>
                          </InputAdornment>
                        ),
                      }}
                      sx={ISX}
                    />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 40px 1fr", gap: 8, alignItems: "center" }}>
                      <CustomSelect value={fromCur} onChange={setFromCur} options={currencyOptions} placeholder="From" accentColor={C.teal} />

                      <motion.div
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ rotate: 180 }}
                        transition={{ duration: 0.25 }}
                        style={{ display: "flex", justifyContent: "center", cursor: "pointer" }}
                        onClick={() => {
                          const t = fromCur;
                          setFromCur(toCur);
                          setToCur(t);
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 10,
                            background: `${C.teal}15`,
                            border: `1px solid ${C.teal}30`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <SwapHorizRoundedIcon sx={{ color: C.teal, fontSize: 18 }} />
                        </div>
                      </motion.div>

                      <CustomSelect value={toCur} onChange={setToCur} options={currencyOptions} placeholder="To" accentColor={C.teal} />
                    </div>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={convertCurrency}
                      disabled={curLoading}
                      style={{
                        height: 44,
                        borderRadius: 14,
                        border: `1px solid ${C.teal}40`,
                        background: `linear-gradient(135deg,${C.teal}28,${C.teal}14)`,
                        boxShadow: `0 4px 20px ${C.teal}22`,
                        color: C.teal,
                        fontFamily: "'Outfit',sans-serif",
                        fontSize: 13,
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 7,
                        opacity: curLoading ? 0.75 : 1,
                      }}
                    >
                      {curLoading ? (
                        <CircularProgress size={14} sx={{ color: C.teal }} />
                      ) : (
                        <>
                          <CurrencyExchangeRoundedIcon style={{ fontSize: 17 }} />
                          Convert
                        </>
                      )}
                    </motion.button>

                    <AnimatePresence initial={false}>
                      {curResult && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.98, y: 6 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.16 }}
                          style={{
                            padding: "16px 20px",
                            borderRadius: 18,
                            background: `linear-gradient(135deg,${C.teal}10,${C.teal}05)`,
                            border: `1px solid ${C.teal}25`,
                            textAlign: "center",
                            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04)`,
                          }}
                        >
                          <Typography
                            sx={{
                              color: "rgba(255,255,255,0.3)",
                              fontFamily: "'Outfit',sans-serif",
                              fontSize: 10.5,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              mb: 0.5,
                            }}
                          >
                            Result
                          </Typography>
                          <Typography sx={{ color: C.teal, fontFamily: "'Instrument Serif',serif", fontSize: 22, fontWeight: 400 }}>
                            {curResult}
                          </Typography>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Row 2: Income + Expense */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {/* Income */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="em-card"
                style={{ padding: "26px" }}
              >
                <Orb style={{ top: -50, right: -50, width: 240, height: 240, background: `radial-gradient(circle,${C.inc}16,transparent 65%)` }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <Heading icon={<TrendingUpRoundedIcon />} title="Income" count={incomes.length} color={C.inc} />

                  <EntryForm
                    amtV={editIncomeId ? editIncomeAmount : incomeAmount}
                    setAmtV={editIncomeId ? setEditIncomeAmount : setIncomeAmount}
                    currencyV={editIncomeId ? editIncomeCurrency : incomeCurrency}
                    setCurrencyV={editIncomeId ? setEditIncomeCurrency : setIncomeCurrency}
                    currencyOpts={currencyOptions}
                    currencyEnabled={currenciesReady}
                    dateV={editIncomeId ? editIncomeDate : incomeDate}
                    setDateV={editIncomeId ? setEditIncomeDate : setIncomeDate}
                    selV={editIncomeId ? editIncomeSourceId : incomeSourceId}
                    setSelV={editIncomeId ? setEditIncomeSourceId : setIncomeSourceId}
                    opts={sources.map((s) => ({ id: s.id, label: s.incSource_name }))}
                    selPH="Source"
                    onSave={editIncomeId ? updateIncome : saveIncome}
                    onCancel={cancelEditIncome}
                    isEdit={!!editIncomeId}
                    accentColor={C.inc}
                    maxDate={todayISO}
                    saving={savingIncome}
                  />

                  <THead cols="1.3fr 110px 1fr 1fr 68px" labels={["Amount", "Date", "Source", "Stored (INR)", ""]} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 280, overflowY: "auto", paddingRight: 2 }}>
                    <AnimatePresence initial={false}>
                      {incomes.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }} style={{ padding: "32px 0", textAlign: "center" }}>
                          <Typography sx={{ color: "rgba(255,255,255,0.12)", fontFamily: "'Outfit',sans-serif", fontSize: 13 }}>
                            No income records yet
                          </Typography>
                        </motion.div>
                      ) : (
                        incomes.map((row) => (
                          <motion.div
                            key={row.id}
                            className="em-row-item"
                            initial={false}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -12 }}
                            transition={{ duration: 0.14 }}
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1.3fr 110px 1fr 1fr 68px",
                              alignItems: "center",
                              padding: "11px 14px",
                              borderRadius: 14,
                              background: editIncomeId === row.id ? C.incDim : "rgba(255,255,255,0.022)",
                              border: `1px solid ${editIncomeId === row.id ? C.incBorder : "rgba(255,255,255,0.048)"}`,
                            }}
                          >
                            <Typography sx={{ color: C.inc, fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700 }}>
                              {fmtMoney("income", row)}
                            </Typography>
                            <Typography sx={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Outfit',sans-serif", fontSize: 12 }}>
                              {row.income_date}
                            </Typography>
                            <div>
                              <div className="em-tag" style={{ background: `${C.inc}10`, color: `${C.inc}bb`, border: `1px solid ${C.inc}20` }}>
                                {sourceMap[row.incomeSource_id] || "—"}
                              </div>
                            </div>
                            <Typography sx={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Outfit',sans-serif", fontSize: 12 }}>
                              ₹{Number(row.income_amount_inr ?? row.income_amount ?? 0).toLocaleString()}
                            </Typography>
                            <div className="em-row-actions" style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                              <Btn tip="Edit" color="#60a5fa" onClick={() => startEditIncome(row)} icon={EditRoundedIcon} />
                              <Btn tip="Delete" color={C.exp} onClick={() => deleteIncome(row.id)} icon={DeleteOutlineRoundedIcon} />
                            </div>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>

              {/* Expense */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.27, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="em-card"
                style={{ padding: "26px" }}
              >
                <Orb style={{ top: -50, left: -50, width: 240, height: 240, background: `radial-gradient(circle,${C.exp}13,transparent 65%)` }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <Heading icon={<TrendingDownRoundedIcon />} title="Expenses" count={expenses.length} color={C.exp} />

                  <EntryForm
                    amtV={editExpenseId ? editExpenseAmount : expenseAmount}
                    setAmtV={editExpenseId ? setEditExpenseAmount : setExpenseAmount}
                    currencyV={editExpenseId ? editExpenseCurrency : expenseCurrency}
                    setCurrencyV={editExpenseId ? setEditExpenseCurrency : setExpenseCurrency}
                    currencyOpts={currencyOptions}
                    currencyEnabled={currenciesReady}
                    dateV={editExpenseId ? editExpenseDate : expenseDate}
                    setDateV={editExpenseId ? setEditExpenseDate : setExpenseDate}
                    selV={editExpenseId ? editExpenseCategoryId : expenseCategoryId}
                    setSelV={editExpenseId ? setEditExpenseCategoryId : setExpenseCategoryId}
                    opts={categories.map((c) => ({ id: c.id, label: c.Category_name }))}
                    selPH="Category"
                    onSave={editExpenseId ? updateExpense : saveExpense}
                    onCancel={cancelEditExpense}
                    isEdit={!!editExpenseId}
                    accentColor={C.exp}
                    maxDate={todayISO}
                    saving={savingExpense}
                  />

                  <THead cols="1.3fr 110px 1fr 1fr 68px" labels={["Amount", "Date", "Category", "Stored (INR)", ""]} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 280, overflowY: "auto", paddingRight: 2 }}>
                    <AnimatePresence initial={false}>
                      {expenses.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }} style={{ padding: "32px 0", textAlign: "center" }}>
                          <Typography sx={{ color: "rgba(255,255,255,0.12)", fontFamily: "'Outfit',sans-serif", fontSize: 13 }}>
                            No expense records yet
                          </Typography>
                        </motion.div>
                      ) : (
                        expenses.map((row) => (
                          <motion.div
                            key={row.id}
                            className="em-row-item"
                            initial={false}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -12 }}
                            transition={{ duration: 0.14 }}
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1.3fr 110px 1fr 1fr 68px",
                              alignItems: "center",
                              padding: "11px 14px",
                              borderRadius: 14,
                              background: editExpenseId === row.id ? C.expDim : "rgba(255,255,255,0.022)",
                              border: `1px solid ${editExpenseId === row.id ? C.expBorder : "rgba(255,255,255,0.048)"}`,
                            }}
                          >
                            <Typography sx={{ color: C.exp, fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700 }}>
                              {fmtMoney("expense", row)}
                            </Typography>
                            <Typography sx={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Outfit',sans-serif", fontSize: 12 }}>
                              {row.expense_date}
                            </Typography>
                            <div>
                              <div className="em-tag" style={{ background: `${C.exp}10`, color: `${C.exp}bb`, border: `1px solid ${C.exp}20` }}>
                                {categoryMap[row.category_id] || "—"}
                              </div>
                            </div>
                            <Typography sx={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Outfit',sans-serif", fontSize: 12 }}>
                              ₹{Number(row.expense_amount_inr ?? row.expense_amount ?? 0).toLocaleString()}
                            </Typography>
                            <div className="em-row-actions" style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                              <Btn tip="Edit" color="#60a5fa" onClick={() => startEditExpense(row)} icon={EditRoundedIcon} />
                              <Btn tip="Delete" color={C.exp} onClick={() => deleteExpense(row.id)} icon={DeleteOutlineRoundedIcon} />
                            </div>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </div>

            <div style={{ opacity: 0.55, fontFamily: "'Outfit',sans-serif", fontSize: 12 }}>
              Note: Totals & KPIs are calculated in <b>INR</b>. Original currency is stored per entry.
            </div>
          </div>
        </div>

        <Snackbar
          open={toast.open}
          autoHideDuration={3500}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            severity={toast.type}
            onClose={() => setToast((t) => ({ ...t, open: false }))}
            sx={{
              fontFamily: "'Outfit',sans-serif",
              fontSize: 13.5,
              borderRadius: "16px",
              fontWeight: 600,
              boxShadow: "0 16px 40px rgba(0,0,0,0.35),0 0 0 1px rgba(255,255,255,0.07)",
            }}
          >
            {toast.msg}
          </Alert>
        </Snackbar>
      </MotionConfig>
    </>
  );
};

export default ExpenseManagerWorking;