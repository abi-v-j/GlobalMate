// src/components/ExpenseManagerWorking.jsx
import React, { useEffect, useMemo, useState } from "react";
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
import { motion, AnimatePresence } from "framer-motion";

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
    100%{ transform:translate(0,0) scale(1); }
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
  @keyframes floatUp {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-4px); }
  }
  @keyframes gradientShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
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

  .kpi-card-inner { transition: transform 0.3s ease; }
  .kpi-card-inner:hover { transform: scale(1.01); }

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
    box-sizing: border-box;
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

const AnimNum = ({ value, prefix = "₹", color = "white" }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = Number(value) || 0;
    if (end === 0) {
      setDisplay(0);
      return;
    }
    const dur = 700;
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
      {display.toLocaleString()}
    </span>
  );
};

const KpiCard = ({ label, value, delta, color, icon, delay, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="em-card kpi-card-inner"
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

const Heading = ({ icon, title, count, color }) => (
  <div style={{ marginBottom: 18 }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
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

const THead = ({ cols, labels }) => (
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

const Btn = ({ tip, color, onClick, isLoading, icon: Icon }) => (
  <Tooltip title={tip} placement="top" arrow>
    <span>
      <motion.div whileHover={{ scale: 1.18 }} whileTap={{ scale: 0.86 }}>
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
          {isLoading ? (
            <CircularProgress size={11} sx={{ color }} />
          ) : (
            <Icon sx={{ color, fontSize: 14 }} />
          )}
        </IconButton>
      </motion.div>
    </span>
  </Tooltip>
);

/* ─── Custom Select ─────────────────────────── */
const CustomSelect = ({ value, onChange, options, placeholder, accentColor }) => {
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            overflow: "hidden",
            flex: 1,
            minWidth: 0,
          }}
        >
          {selected ? (
            <>
              <div className="cs-option-dot" style={{ background: accent }} />
              <span
                className="cs-value"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {selected.label}
              </span>
            </>
          ) : (
            <span className="cs-placeholder">{placeholder}</span>
          )}
        </div>
        <span className={`cs-chevron${open ? " open" : ""}`}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 5L7 9L11 5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="cs-dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              style={{
                height: 2,
                background: `linear-gradient(90deg, transparent, ${accent}88, transparent)`,
              }}
            />
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
                    {i > 0 && i % 5 === 0 && <div className="cs-divider" />}
                    <motion.div
                      className={`cs-option${isSelected ? " selected" : ""}`}
                      onClick={() => {
                        onChange(String(opt.id));
                        setOpen(false);
                      }}
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.12 }}
                    >
                      <div
                        className="cs-option-dot"
                        style={{
                          background: isSelected ? accent : "rgba(255,255,255,0.2)",
                        }}
                      />
                      <span
                        style={{
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {opt.label}
                      </span>
                      {isSelected && (
                        <div
                          className="cs-check"
                          style={{ background: `${accent}25`, color: accent }}
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path
                              d="M2 5L4 7L8 3"
                              stroke={accent}
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
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
};

/* ─── Operator Select ─────────────────────────── */
const OpSelect = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);
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
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
      >
        {current?.label}
      </motion.button>
      <AnimatePresence>
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
};

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

const RV = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.03, duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, x: -16, scale: 0.97, transition: { duration: 0.18 } },
};

/* ✅ MOVED OUTSIDE to prevent input losing focus */
const EntryForm = ({
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
}) => (
  <motion.div
    layout
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1.2fr auto",
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
              ₹
            </span>
          </InputAdornment>
        ),
      }}
      sx={ISX}
    />

    <TextField
      type="date"
      value={dateV}
      onChange={(e) => setDateV(e.target.value)}
      size="small"
      inputProps={{ max: maxDate }} /* ✅ prevent future date */
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <CalendarTodayRoundedIcon
              sx={{ color: "rgba(255,255,255,0.22)", fontSize: 14 }}
            />
          </InputAdornment>
        ),
      }}
      sx={ISX}
    />

    <CustomSelect
      value={selV}
      onChange={setSelV}
      options={opts}
      placeholder={selPH}
      accentColor={accentColor}
    />

    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <motion.button
        whileHover={{ scale: 1.04, y: -1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSave}
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
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 5,
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {isEdit ? (
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

      <AnimatePresence>
        {isEdit && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7, width: 0 }}
            animate={{ opacity: 1, scale: 1, width: 34 }}
            exit={{ opacity: 0, scale: 0.7, width: 0 }}
            transition={{ duration: 0.18 }}
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
  </motion.div>
);

const ExpenseManagerWorking = ({ onBack }) => {
  const uid = sessionStorage.getItem("uid") || "";

  const todayISO = useMemo(
    () => new Date().toISOString().slice(0, 10),
    []
  );

  const isFutureDate = (d) => {
    if (!d) return false;
    // date input gives YYYY-MM-DD, so string compare works
    return d > todayISO;
  };

  const [profile, setProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [sources, setSources] = useState([]);

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

  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [expenseCategoryId, setExpenseCategoryId] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [editExpenseId, setEditExpenseId] = useState(null);
  const [editExpenseAmount, setEditExpenseAmount] = useState("");
  const [editExpenseDate, setEditExpenseDate] = useState("");
  const [editExpenseCategoryId, setEditExpenseCategoryId] = useState("");

  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeDate, setIncomeDate] = useState("");
  const [incomeSourceId, setIncomeSourceId] = useState("");
  const [incomes, setIncomes] = useState([]);
  const [editIncomeId, setEditIncomeId] = useState(null);
  const [editIncomeAmount, setEditIncomeAmount] = useState("");
  const [editIncomeDate, setEditIncomeDate] = useState("");
  const [editIncomeSourceId, setEditIncomeSourceId] = useState("");

  const [calcA, setCalcA] = useState("");
  const [calcB, setCalcB] = useState("");
  const [calcOp, setCalcOp] = useState("+");
  const [calcResult, setCalcResult] = useState("");

  const [fromCur, setFromCur] = useState("USD");
  const [toCur, setToCur] = useState("INR");
  const [curAmt, setCurAmt] = useState("1");
  const [curResult, setCurResult] = useState("");
  const [curLoading, setCurLoading] = useState(false);

  const [toast, setToast] = useState({ open: false, msg: "", type: "success" });
  const notify = (msg, type = "success") => setToast({ open: true, msg, type });

  const totalInc = useMemo(
    () => incomes.reduce((s, r) => s + Number(r.income_amount || 0), 0),
    [incomes]
  );
  const totalExp = useMemo(
    () => expenses.reduce((s, r) => s + Number(r.expense_amount || 0), 0),
    [expenses]
  );
  const balance = totalInc - totalExp;

  const loadProfile = async () => {
    if (!uid) return setProfile(null);
    const { data, error } = await supabase
      .from("tbl_student")
      .select("*")
      .eq("id", uid)
      .single();
    if (error) return setProfile(null);
    setProfile(data);
  };
  const loadCategories = async () => {
    const { data } = await supabase
      .from("tbl_expenseCategory")
      .select("*")
      .order("Category_name", { ascending: true });
    setCategories(data || []);
  };
  const loadSources = async () => {
    const { data } = await supabase
      .from("tbl_incSource")
      .select("*")
      .order("incSource_name", { ascending: true });
    setSources(data || []);
  };
  const loadExpenses = async () => {
    if (!uid) return setExpenses([]);
    const { data } = await supabase
      .from("tbl_expense")
      .select("*")
      .eq("student_id", uid)
      .order("id", { ascending: false });
    setExpenses(data || []);
  };
  const loadIncomes = async () => {
    if (!uid) return setIncomes([]);
    const { data } = await supabase
      .from("tbl_income")
      .select("*")
      .eq("student_id", uid)
      .order("id", { ascending: false });
    setIncomes(data || []);
  };

  useEffect(() => {
    loadProfile();
    loadCategories();
    loadSources();
    loadExpenses();
    loadIncomes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveExpense = async () => {
    if (!expenseAmount) return notify("Enter expense amount", "error");
    if (!expenseDate) return notify("Select expense date", "error");
    if (isFutureDate(expenseDate)) return notify("Future dates not allowed", "error");
    if (!expenseCategoryId) return notify("Select category", "error");

    const { error } = await supabase.from("tbl_expense").insert([
      {
        expense_amount: Number(expenseAmount),
        expense_date: expenseDate,
        category_id: Number(expenseCategoryId),
        student_id: uid,
      },
    ]);
    if (error) return notify(error.message || "Insert failed", "error");
    setExpenseAmount("");
    setExpenseDate("");
    setExpenseCategoryId("");
    notify("Expense saved! ✓");
    loadExpenses();
  };

  const startEditExpense = (row) => {
    setEditExpenseId(row.id);
    setEditExpenseAmount(String(row.expense_amount ?? ""));
    setEditExpenseDate(row.expense_date || "");
    setEditExpenseCategoryId(String(row.category_id ?? ""));
  };

  const cancelEditExpense = () => {
    setEditExpenseId(null);
    setEditExpenseAmount("");
    setEditExpenseDate("");
    setEditExpenseCategoryId("");
  };

  const updateExpense = async () => {
    if (!editExpenseDate) return notify("Select expense date", "error");
    if (isFutureDate(editExpenseDate)) return notify("Future dates not allowed", "error");

    const { error } = await supabase
      .from("tbl_expense")
      .update({
        expense_amount: Number(editExpenseAmount),
        expense_date: editExpenseDate,
        category_id: Number(editExpenseCategoryId),
      })
      .eq("id", editExpenseId);

    if (error) return notify(error.message || "Update failed", "error");
    notify("Updated! ✓");
    cancelEditExpense();
    loadExpenses();
  };

  const deleteExpense = async (id) => {
    const ok = window.confirm("Delete this expense?");
    if (!ok) return;
    const { error } = await supabase.from("tbl_expense").delete().eq("id", id);
    if (error) return notify(error.message || "Delete failed", "error");
    notify("Removed", "info");
    loadExpenses();
  };

  const saveIncome = async () => {
    if (!incomeAmount) return notify("Enter income amount", "error");
    if (!incomeDate) return notify("Select income date", "error");
    if (isFutureDate(incomeDate)) return notify("Future dates not allowed", "error");
    if (!incomeSourceId) return notify("Select income source", "error");

    const { error } = await supabase.from("tbl_income").insert([
      {
        income_amount: Number(incomeAmount),
        income_date: incomeDate,
        incomeSource_id: Number(incomeSourceId),
        student_id: uid,
      },
    ]);

    if (error) return notify(error.message || "Insert failed", "error");
    setIncomeAmount("");
    setIncomeDate("");
    setIncomeSourceId("");
    notify("Income saved! ✓");
    loadIncomes();
  };

  const startEditIncome = (row) => {
    setEditIncomeId(row.id);
    setEditIncomeAmount(String(row.income_amount ?? ""));
    setEditIncomeDate(row.income_date || "");
    setEditIncomeSourceId(String(row.incomeSource_id ?? ""));
  };

  const cancelEditIncome = () => {
    setEditIncomeId(null);
    setEditIncomeAmount("");
    setEditIncomeDate("");
    setEditIncomeSourceId("");
  };

  const updateIncome = async () => {
    if (!editIncomeDate) return notify("Select income date", "error");
    if (isFutureDate(editIncomeDate)) return notify("Future dates not allowed", "error");

    const { error } = await supabase
      .from("tbl_income")
      .update({
        income_amount: Number(editIncomeAmount),
        income_date: editIncomeDate,
        incomeSource_id: Number(editIncomeSourceId),
      })
      .eq("id", editIncomeId);

    if (error) return notify(error.message || "Update failed", "error");
    notify("Updated! ✓");
    cancelEditIncome();
    loadIncomes();
  };

  const deleteIncome = async (id) => {
    const ok = window.confirm("Delete this income?");
    if (!ok) return;
    const { error } = await supabase.from("tbl_income").delete().eq("id", id);
    if (error) return notify(error.message || "Delete failed", "error");
    notify("Removed", "info");
    loadIncomes();
  };

  const doCalc = () => {
    const a = Number(calcA),
      b = Number(calcB);
    if (Number.isNaN(a) || Number.isNaN(b)) return setCalcResult("Invalid");
    let r = 0;
    if (calcOp === "+") r = a + b;
    if (calcOp === "-") r = a - b;
    if (calcOp === "*") r = a * b;
    if (calcOp === "/") r = b === 0 ? "Infinity" : a / b;
    setCalcResult(String(r));
  };

  const convertCurrency = async () => {
    if (!curAmt) return notify("Enter amount", "error");
    setCurLoading(true);
    setCurResult("");
    try {
      const url = `https://api.frankfurter.app/latest?amount=${encodeURIComponent(
        curAmt
      )}&from=${encodeURIComponent(fromCur)}&to=${encodeURIComponent(toCur)}`;
      const res = await fetch(url);
      const json = await res.json();
      const val = json?.rates?.[toCur];
      setCurResult(
        val == null ? "Conversion failed" : `${curAmt} ${fromCur} = ${val} ${toCur}`
      );
    } catch {
      setCurResult("Conversion error");
    } finally {
      setCurLoading(false);
    }
  };

  if (!uid) {
    return (
      <div style={{ padding: 20, color: "white", fontFamily: "'Outfit',sans-serif" }}>
        Not logged in (uid missing). Please login.
      </div>
    );
  }

  const savingsRate =
    totalInc > 0 ? Math.round(((totalInc - totalExp) / totalInc) * 100) : 0;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

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
          {/* Header with Back Button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ marginBottom: 18 }}>
              <motion.button
                className="back-btn"
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
                  {new Date().toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.1)",
                    fontFamily: "'Outfit',sans-serif",
                    fontSize: 11,
                    mt: 0.3,
                  }}
                >
                  {new Date().toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </div>
            </div>
          </motion.div>

          {/* KPI row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            <KpiCard
              label="Total Income"
              value={totalInc}
              color={C.inc}
              icon={<TrendingUpRoundedIcon />}
              delay={0.06}
              subtitle={`${incomes.length} transactions`}
            />
            <KpiCard
              label="Total Expense"
              value={totalExp}
              color={C.exp}
              icon={<TrendingDownRoundedIcon />}
              delay={0.1}
              subtitle={`${expenses.length} transactions`}
            />
            <KpiCard
              label="Net Balance"
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

          {/* Progress bar for budget health */}
          {totalInc > 0 && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0.95 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
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
                  Budget Health
                </Typography>
                <Typography
                  sx={{
                    color: balance >= 0 ? C.inc : C.exp,
                    fontFamily: "'Outfit',sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {totalInc > 0 ? `${Math.round((totalExp / totalInc) * 100)}% spent` : "No income"}
                </Typography>
              </div>
              <div style={{ height: 6, borderRadius: 10, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((totalExp / totalInc) * 100, 100)}%` }}
                  transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    height: "100%",
                    borderRadius: 10,
                    background:
                      totalExp / totalInc > 0.8
                        ? `linear-gradient(90deg, ${C.gold}, ${C.exp})`
                        : `linear-gradient(90deg, ${C.v400}, ${C.inc})`,
                    boxShadow: `0 0 10px ${totalExp / totalInc > 0.8 ? C.exp : C.v300}50`,
                  }}
                />
              </div>
            </motion.div>
          )}

          {/* Row 1: Profile | Calculator | Currency */}
          <div style={{ display: "grid", gridTemplateColumns: "0.85fr 1fr 1fr", gap: 16 }}>
            {/* Profile card */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
                    <Typography
                      sx={{
                        color: "rgba(255,255,255,0.15)",
                        fontFamily: "'Outfit',sans-serif",
                        fontSize: 13,
                      }}
                    >
                      Profile not loaded
                    </Typography>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Calculator card */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.13, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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

                  <AnimatePresence>
                    {calcResult !== "" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -6 }}
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

            {/* Currency card */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
                          <span
                            style={{
                              color: "rgba(255,255,255,0.28)",
                              fontSize: 13,
                              fontFamily: "'Outfit',sans-serif",
                            }}
                          >
                            Amount
                          </span>
                        </InputAdornment>
                      ),
                    }}
                    sx={ISX}
                  />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 40px 1fr", gap: 8, alignItems: "center" }}>
                    <TextField
                      value={fromCur}
                      onChange={(e) => setFromCur(e.target.value.toUpperCase())}
                      placeholder="USD"
                      size="small"
                      sx={ISX}
                      inputProps={{
                        style: { textAlign: "center", fontWeight: 800, fontSize: 15, letterSpacing: "0.1em" },
                      }}
                    />
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ rotate: 180 }}
                      transition={{ duration: 0.3 }}
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
                    <TextField
                      value={toCur}
                      onChange={(e) => setToCur(e.target.value.toUpperCase())}
                      placeholder="INR"
                      size="small"
                      sx={ISX}
                      inputProps={{
                        style: { textAlign: "center", fontWeight: 800, fontSize: 15, letterSpacing: "0.1em" },
                      }}
                    />
                  </div>

                  <motion.button
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

                  <AnimatePresence>
                    {curResult && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
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
                        <Typography
                          sx={{
                            color: C.teal,
                            fontFamily: "'Instrument Serif',serif",
                            fontSize: 22,
                            fontWeight: 400,
                          }}
                        >
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
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="em-card"
              style={{ padding: "26px" }}
            >
              <Orb style={{ top: -50, right: -50, width: 240, height: 240, background: `radial-gradient(circle,${C.inc}16,transparent 65%)` }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <Heading icon={<TrendingUpRoundedIcon />} title="Income" count={incomes.length} color={C.inc} />

                <EntryForm
                  amtV={editIncomeId ? editIncomeAmount : incomeAmount}
                  setAmtV={editIncomeId ? setEditIncomeAmount : setIncomeAmount}
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
                  maxDate={todayISO} /* ✅ */
                />

                <THead cols="1fr 100px 1fr 68px" labels={["Amount", "Date", "Source", ""]} />
                <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 280, overflowY: "auto", paddingRight: 2 }}>
                  <AnimatePresence mode="popLayout">
                    {incomes.length === 0 ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "32px 0", textAlign: "center" }}>
                        <Typography sx={{ color: "rgba(255,255,255,0.12)", fontFamily: "'Outfit',sans-serif", fontSize: 13 }}>
                          No income records yet
                        </Typography>
                      </motion.div>
                    ) : (
                      incomes.map((row, i) => (
                        <motion.div
                          key={row.id}
                          custom={i}
                          variants={RV}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          layout
                          className="em-row-item"
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 100px 1fr 68px",
                            alignItems: "center",
                            padding: "11px 14px",
                            borderRadius: 14,
                            background: editIncomeId === row.id ? C.incDim : "rgba(255,255,255,0.022)",
                            border: `1px solid ${editIncomeId === row.id ? C.incBorder : "rgba(255,255,255,0.048)"}`,
                          }}
                        >
                          <Typography sx={{ color: C.inc, fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700 }}>
                            ₹{Number(row.income_amount).toLocaleString()}
                          </Typography>
                          <Typography sx={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Outfit',sans-serif", fontSize: 12 }}>
                            {row.income_date}
                          </Typography>
                          <div>
                            <div className="em-tag" style={{ background: `${C.inc}10`, color: `${C.inc}bb`, border: `1px solid ${C.inc}20` }}>
                              {sourceMap[row.incomeSource_id] || "—"}
                            </div>
                          </div>
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
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.27, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="em-card"
              style={{ padding: "26px" }}
            >
              <Orb style={{ top: -50, left: -50, width: 240, height: 240, background: `radial-gradient(circle,${C.exp}13,transparent 65%)` }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <Heading icon={<TrendingDownRoundedIcon />} title="Expenses" count={expenses.length} color={C.exp} />

                <EntryForm
                  amtV={editExpenseId ? editExpenseAmount : expenseAmount}
                  setAmtV={editExpenseId ? setEditExpenseAmount : setExpenseAmount}
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
                  maxDate={todayISO} /* ✅ */
                />

                <THead cols="1fr 100px 1fr 68px" labels={["Amount", "Date", "Category", ""]} />
                <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 280, overflowY: "auto", paddingRight: 2 }}>
                  <AnimatePresence mode="popLayout">
                    {expenses.length === 0 ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "32px 0", textAlign: "center" }}>
                        <Typography sx={{ color: "rgba(255,255,255,0.12)", fontFamily: "'Outfit',sans-serif", fontSize: 13 }}>
                          No expense records yet
                        </Typography>
                      </motion.div>
                    ) : (
                      expenses.map((row, i) => (
                        <motion.div
                          key={row.id}
                          custom={i}
                          variants={RV}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          layout
                          className="em-row-item"
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 100px 1fr 68px",
                            alignItems: "center",
                            padding: "11px 14px",
                            borderRadius: 14,
                            background: editExpenseId === row.id ? C.expDim : "rgba(255,255,255,0.022)",
                            border: `1px solid ${editExpenseId === row.id ? C.expBorder : "rgba(255,255,255,0.048)"}`,
                          }}
                        >
                          <Typography sx={{ color: C.exp, fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700 }}>
                            ₹{Number(row.expense_amount).toLocaleString()}
                          </Typography>
                          <Typography sx={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Outfit',sans-serif", fontSize: 12 }}>
                            {row.expense_date}
                          </Typography>
                          <div>
                            <div className="em-tag" style={{ background: `${C.exp}10`, color: `${C.exp}bb`, border: `1px solid ${C.exp}20` }}>
                              {categoryMap[row.category_id] || "—"}
                            </div>
                          </div>
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
            boxShadow:
              "0 16px 40px rgba(0,0,0,0.35),0 0 0 1px rgba(255,255,255,0.07)",
          }}
        >
          {toast.msg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ExpenseManagerWorking;