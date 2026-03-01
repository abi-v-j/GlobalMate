// src/components/JobPortalWorking.jsx
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

import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import FeedbackRoundedIcon from "@mui/icons-material/FeedbackRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PendingRoundedIcon from "@mui/icons-material/PendingRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";

import NotesRoundedIcon from "@mui/icons-material/NotesRounded";


/* ═══════════════════════════════════════════
   DESIGN TOKENS — same palette as ExpenseManager
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

  blue: "#3b82f6",
  blueDim: "rgba(59,130,246,0.12)",
  blueBorder: "rgba(59,130,246,0.25)",

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

  .jp-card {
    background: ${C.glass0};
    border: 1px solid ${C.border0};
    border-radius: 24px;
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    position: relative;
    overflow: hidden;
    transition: border-color 0.35s, box-shadow 0.35s, transform 0.35s;
  }
  .jp-card:hover {
    border-color: rgba(139,92,246,0.18);
    box-shadow: 0 0 0 1px rgba(139,92,246,0.1), 0 32px 70px rgba(0,0,0,0.45);
    transform: translateY(-1px);
  }
  .jp-card::before {
    content:'';
    position:absolute; inset:0;
    background: linear-gradient(135deg, rgba(139,92,246,0.05) 0%, transparent 50%, rgba(109,40,217,0.05) 100%);
    pointer-events:none; border-radius:inherit;
  }
  .jp-card::after {
    content:'';
    position:absolute; top:0; left:0; right:0; height:1px;
    background: linear-gradient(90deg, transparent, rgba(139,92,246,0.35), transparent);
    border-radius:inherit; pointer-events:none;
  }

  /* Job card */
  .jp-job-card {
    background: rgba(255,255,255,0.022);
    border: 1px solid rgba(255,255,255,0.048);
    border-radius: 18px;
    padding: 18px 20px;
    transition: background 0.2s, border-color 0.2s, transform 0.25s, box-shadow 0.25s;
    cursor: default;
    position: relative;
    overflow: hidden;
  }
  .jp-job-card:hover {
    background: rgba(139,92,246,0.06);
    border-color: rgba(139,92,246,0.22);
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.3);
  }
  .jp-job-card::before {
    content:'';
    position: absolute; inset:0;
    background: linear-gradient(135deg, rgba(139,92,246,0.04), transparent);
    pointer-events: none;
  }

  .jp-tag {
    display:inline-flex; align-items:center; gap:5px;
    padding:3px 10px 3px 7px;
    border-radius:20px;
    font-size:11px; font-weight:700;
    font-family:'Outfit',sans-serif;
    letter-spacing:0.04em;
  }

  .jp-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(139,92,246,0.15), transparent);
    margin: 4px 0 16px;
  }

  /* Custom Select */
  .cs-trigger {
    height: 44px; border-radius: 14px;
    background: rgba(255,255,255,0.04);
    border: 1.5px solid rgba(255,255,255,0.09);
    color: white; font-family: 'Outfit', sans-serif; font-size: 13.5px;
    padding: 0 14px; display: flex; align-items: center;
    justify-content: space-between; gap: 8px;
    cursor: pointer; transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    user-select: none; position: relative; width: 100%; box-sizing: border-box;
  }
  .cs-trigger:hover { border-color: rgba(139,92,246,0.4); background: rgba(139,92,246,0.06); }
  .cs-trigger.open { border-color: #8b5cf6; background: rgba(139,92,246,0.1); box-shadow: 0 0 0 3px rgba(139,92,246,0.12); }
  .cs-trigger.has-value { border-color: rgba(139,92,246,0.28); }
  .cs-dropdown {
    position: absolute; top: calc(100% + 6px); left: 0; right: 0;
    background: linear-gradient(145deg, #180030, #110022);
    border: 1px solid rgba(139,92,246,0.28); border-radius: 16px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.08), inset 0 1px 0 rgba(255,255,255,0.06);
    overflow: hidden; z-index: 9999; min-width: 100%;
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  }
  .cs-dropdown-inner { max-height: 220px; overflow-y: auto; padding: 6px; }
  .cs-dropdown-inner::-webkit-scrollbar { width: 3px; }
  .cs-dropdown-inner::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 10px; }
  .cs-option {
    padding: 10px 12px; border-radius: 10px;
    font-family: 'Outfit', sans-serif; font-size: 13px;
    color: rgba(255,255,255,0.75); cursor: pointer;
    display: flex; align-items: center; gap: 10px;
    transition: background 0.15s, color 0.15s; font-weight: 500;
  }
  .cs-option:hover { background: rgba(139,92,246,0.18); color: white; }
  .cs-option.selected { background: rgba(139,92,246,0.25); color: white; font-weight: 700; }
  .cs-option-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; opacity: 0.7; }
  .cs-check {
    margin-left: auto; width: 18px; height: 18px; border-radius: 6px;
    display: flex; align-items: center; justify-content: center; font-size: 10px; flex-shrink: 0;
  }
  .cs-chevron { display: flex; align-items: center; justify-content: center; transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), color 0.2s; flex-shrink: 0; color: rgba(196,181,253,0.5); }
  .cs-chevron.open { transform: rotate(180deg); color: #a78bfa; }
  .cs-placeholder { color: rgba(255,255,255,0.22); font-size: 13px; }
  .cs-value { color: white; font-weight: 600; font-size: 13.5px; }
  .cs-wrap { position: relative; width: 100%; }

  .back-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px 10px 14px; border-radius: 14px;
    border: 1px solid rgba(139,92,246,0.25);
    background: rgba(139,92,246,0.08);
    color: rgba(196,181,253,0.85);
    font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600;
    letter-spacing: 0.03em; cursor: pointer; transition: all 0.22s; text-decoration: none;
  }
  .back-btn:hover { background: rgba(139,92,246,0.18); border-color: rgba(139,92,246,0.45); color: #c4b5fd; transform: translateX(-2px); box-shadow: 0 4px 20px rgba(109,40,217,0.25); }

  textarea.jp-textarea {
    width: 100%; background: rgba(255,255,255,0.04);
    border: 1.5px solid rgba(255,255,255,0.09); border-radius: 14px;
    color: white; font-family: 'Outfit', sans-serif; font-size: 13.5px;
    padding: 12px 14px; resize: vertical; min-height: 80px;
    outline: none; transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }
  textarea.jp-textarea::placeholder { color: rgba(255,255,255,0.2); }
  textarea.jp-textarea:hover { border-color: rgba(139,92,246,0.4); }
  textarea.jp-textarea:focus { border-color: #8b5cf6; background: rgba(139,92,246,0.08); box-shadow: 0 0 0 3px rgba(139,92,246,0.12); }

  .jp-row-item { transition: background 0.2s, border-color 0.2s; }
  .jp-row-item:hover { background: rgba(255,255,255,0.04) !important; }

  /* KPI */
  .kpi-inner { transition: transform 0.3s ease; }
  .kpi-inner:hover { transform: scale(1.01); }
`;

/* ─── Orb */
const Orb = ({ style }) => (
  <div style={{ position: "absolute", borderRadius: "50%", filter: "blur(90px)", pointerEvents: "none", zIndex: 0, ...style }} />
);

/* ─── Animated number */
const AnimNum = ({ value, color = "white" }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = Number(value) || 0;
    if (end === 0) { setDisplay(0); return; }
    const step = end / (700 / 16);
    const t = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(t); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [value]);
  return <span style={{ color, fontFamily: "'Outfit',sans-serif", fontWeight: 800 }}>{display.toLocaleString()}</span>;
};

/* ─── KPI Card */
const KpiCard = ({ label, value, color, icon, delay, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="jp-card kpi-inner"
    style={{ padding: "22px 24px" }}
  >
    <Orb style={{ top: -40, right: -40, width: 140, height: 140, background: `radial-gradient(circle,${color}28 0%,transparent 70%)` }} />
    <div style={{ position: "relative", zIndex: 1 }}>
      <div style={{
        width: 40, height: 40, borderRadius: 13,
        background: `linear-gradient(135deg, ${color}25, ${color}12)`,
        border: `1px solid ${color}35`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 4px 16px ${color}20`, marginBottom: 14,
      }}>
        {React.cloneElement(icon, { sx: { color, fontSize: 20 } })}
      </div>
      <Typography sx={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Outfit',sans-serif", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", mb: 0.6, fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography sx={{ fontFamily: "'Outfit',sans-serif", fontSize: 24, fontWeight: 800, color: "white", lineHeight: 1 }}>
        <AnimNum value={value} />
      </Typography>
      {subtitle && (
        <Typography sx={{ color: "rgba(255,255,255,0.22)", fontFamily: "'Outfit',sans-serif", fontSize: 11, mt: 0.8 }}>
          {subtitle}
        </Typography>
      )}
    </div>
  </motion.div>
);

/* ─── Section Heading */
const Heading = ({ icon, title, count, color }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 13,
          background: `linear-gradient(135deg, ${color}20, ${color}08)`,
          border: `1px solid ${color}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 4px 20px ${color}18`,
        }}>
          {React.cloneElement(icon, { sx: { color, fontSize: 20 } })}
        </div>
        <Typography sx={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, fontStyle: "italic", color: "white", lineHeight: 1.1 }}>
          {title}
        </Typography>
      </div>
      {count !== undefined && (
        <div className="jp-tag" style={{ background: `${color}12`, color: `${color}bb`, border: `1px solid ${color}22` }}>
          {count} records
        </div>
      )}
    </div>
    <div className="jp-divider" />
  </div>
);

/* ─── Custom Select */
const CustomSelect = ({ value, onChange, options, placeholder, accentColor }) => {
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);
  const selected = options.find((o) => String(o.id) === String(value));
  const accent = accentColor || C.v300;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
              <span className="cs-value" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selected.label}</span>
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
      <AnimatePresence>
        {open && (
          <motion.div
            className="cs-dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${accent}88, transparent)` }} />
            <div className="cs-dropdown-inner">
              {options.length === 0 && (
                <div style={{ padding: "14px 12px", textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: 12, fontFamily: "'Outfit',sans-serif" }}>No options</div>
              )}
              {options.map((opt, i) => {
                const isSelected = String(opt.id) === String(value);
                return (
                  <React.Fragment key={opt.id}>
                    {i > 0 && i % 5 === 0 && <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(139,92,246,0.15),transparent)", margin: "4px 6px" }} />}
                    <motion.div
                      className={`cs-option${isSelected ? " selected" : ""}`}
                      onClick={() => { onChange(String(opt.id)); setOpen(false); }}
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.12 }}
                    >
                      <div className="cs-option-dot" style={{ background: isSelected ? accent : "rgba(255,255,255,0.2)" }} />
                      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{opt.label}</span>
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
};

/* ─── ISX (TextField styles) */
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
  visible: (i) => ({ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] } }),
  exit: { opacity: 0, x: -12, scale: 0.97, transition: { duration: 0.18 } },
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const JobPortalWorking = ({ onBack }) => {
  const uid = sessionStorage.getItem("uid") || "";
  const today = () => new Date().toISOString().slice(0, 10);

  const [jobTypes, setJobTypes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState("");
  const [typeId, setTypeId] = useState("");
  const [status, setStatus] = useState("");

  const [complaintTitle, setComplaintTitle] = useState("");
  const [complaintContent, setComplaintContent] = useState("");
  const [complaints, setComplaints] = useState([]);

  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);

  const [loadingComplaint, setLoadingComplaint] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [toast, setToast] = useState({ open: false, msg: "", type: "success" });
  const notify = (msg, type = "success") => setToast({ open: true, msg, type });

  const jobTypeMap = useMemo(() => {
    const m = {};
    jobTypes.forEach((t) => (m[t.id] = t.jobType_name));
    return m;
  }, [jobTypes]);

  const loadJobTypes = async () => {
    const { data } = await supabase.from("tbl_jobType").select("*").order("jobType_name", { ascending: true });
    setJobTypes(data || []);
  };
  const loadJobs = async () => {
    setRefreshing(true);
    const { data } = await supabase.from("tbl_job").select("*").order("id", { ascending: false });
    setJobs(data || []);
    setRefreshing(false);
  };
  const loadComplaints = async () => {
    if (!uid) return setComplaints([]);
    const { data } = await supabase.from("tbl_complaint").select("*").eq("student_id", uid).order("id", { ascending: false });
    setComplaints(data || []);
  };
  const loadFeedbacks = async () => {
    if (!uid) return setFeedbacks([]);
    const { data } = await supabase.from("tbl_feedback").select("*").eq("student_id", uid).order("id", { ascending: false });
    setFeedbacks(data || []);
  };

  useEffect(() => {
    loadJobTypes(); loadJobs(); loadComplaints(); loadFeedbacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredJobs = useMemo(() => {
    const text = q.trim().toLowerCase();
    return (jobs || []).filter((j) => {
      const matchesText = !text ||
        (j.job_title || "").toLowerCase().includes(text) ||
        (j.job_companyName || "").toLowerCase().includes(text) ||
        (j.job_location || "").toLowerCase().includes(text) ||
        (j.job_description || "").toLowerCase().includes(text);
      const matchesType = !typeId || String(j.jobType_id) === String(typeId);
      const matchesStatus = status === "" ? true : String(j.job_status) === String(status);
      return matchesText && matchesType && matchesStatus;
    });
  }, [jobs, q, typeId, status]);

  const activeJobs = useMemo(() => jobs.filter((j) => String(j.job_status) === "1").length, [jobs]);
  const pendingComplaints = useMemo(() => complaints.filter((c) => String(c.complaint_status) === "0").length, [complaints]);

  const saveComplaint = async () => {
    if (!uid) return notify("Login required", "error");
    if (!complaintTitle.trim()) return notify("Enter complaint title", "error");
    if (!complaintContent.trim()) return notify("Enter complaint content", "error");
    setLoadingComplaint(true);
    const { error } = await supabase.from("tbl_complaint").insert([{
      complaint_title: complaintTitle.trim(),
      complaint_content: complaintContent.trim(),
      complaint_date: today(),
      complaint_status: 0,
      complaint_reply: "",
      student_id: uid,
    }]);
    setLoadingComplaint(false);
    if (error) return notify(error.message || "Failed", "error");
    setComplaintTitle(""); setComplaintContent("");
    notify("Complaint submitted! ✓");
    loadComplaints();
  };

  const saveFeedback = async () => {
    if (!uid) return notify("Login required", "error");
    if (!feedbackContent.trim()) return notify("Enter feedback", "error");
    setLoadingFeedback(true);
    const { error } = await supabase.from("tbl_feedback").insert([{
      feedback_content: feedbackContent.trim(),
      feedback_date: today(),
      student_id: uid,
    }]);
    setLoadingFeedback(false);
    if (error) return notify(error.message || "Failed", "error");
    setFeedbackContent("");
    notify("Feedback submitted! ✓");
    loadFeedbacks();
  };

  const statusLabel = (s) => String(s) === "1" ? "Active" : "Inactive";
  const complaintStatusLabel = (s) => String(s) === "0" ? "Pending" : "Resolved";

  if (!uid) return <div style={{ padding: 20, color: "white", fontFamily: "'Outfit',sans-serif" }}>Not logged in. Please login.</div>;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      <div style={{
        minHeight: "100vh", width: "100%",
        background: `radial-gradient(ellipse 90% 70% at 50% -10%, rgba(109,40,217,0.38) 0%, transparent 55%),
          radial-gradient(ellipse 50% 40% at 90% 80%, rgba(91,33,182,0.2) 0%, transparent 50%),
          linear-gradient(170deg, ${C.bg0} 0%, ${C.bg1} 40%, ${C.bg2} 100%)`,
        fontFamily: "'Outfit',sans-serif", position: "relative", overflow: "hidden",
      }}>
        <Orb style={{ top: "-15%", left: "-10%", width: 600, height: 600, background: `radial-gradient(circle, rgba(109,40,217,0.45) 0%, transparent 65%)`, animation: "bgDrift 28s ease-in-out infinite" }} />
        <Orb style={{ bottom: "-10%", right: "-8%", width: 500, height: 500, background: `radial-gradient(circle, rgba(91,33,182,0.35) 0%, transparent 65%)`, animation: "bgDrift2 36s ease-in-out infinite" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: NOISE, backgroundRepeat: "repeat", backgroundSize: "200px", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: `linear-gradient(rgba(139,92,246,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.035) 1px,transparent 1px)`, backgroundSize: "64px 64px" }} />

        <div style={{ position: "relative", zIndex: 1, padding: "28px 40px 52px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <div style={{ marginBottom: 18 }}>
              <motion.button className="back-btn" whileHover={{ x: -2 }} whileTap={{ scale: 0.97 }} onClick={onBack ?? (() => window.history.back())}>
                <ArrowBackRoundedIcon sx={{ fontSize: 17, color: C.v100 }} />
                <span>Back</span>
              </motion.button>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.v300, boxShadow: `0 0 8px ${C.v300}`, animation: "pulseRing 2.5s ease-in-out infinite" }} />
                  <Typography sx={{ color: C.v200, fontFamily: "'Outfit',sans-serif", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.7, fontWeight: 600 }}>
                    Student Portal · Careers
                  </Typography>
                </div>
                <Typography sx={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(28px,3.2vw,46px)", fontStyle: "italic", color: "white", lineHeight: 1.1 }}>
                  Job Portal
                </Typography>
              </div>
              <div style={{ textAlign: "right" }}>
                <Typography sx={{ color: "rgba(255,255,255,0.18)", fontFamily: "'Outfit',sans-serif", fontSize: 12 }}>
                  {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.1)", fontFamily: "'Outfit',sans-serif", fontSize: 11, mt: 0.3 }}>
                  {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </Typography>
              </div>
            </div>
          </motion.div>

          {/* KPI Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            <KpiCard label="Total Jobs" value={jobs.length} color={C.v300} icon={<WorkRoundedIcon />} delay={0.06} subtitle="All listings" />
            <KpiCard label="Active Jobs" value={activeJobs} color={C.inc} icon={<CheckCircleRoundedIcon />} delay={0.1} subtitle="Currently open" />
            <KpiCard label="My Complaints" value={complaints.length} color={C.exp} icon={<ReportProblemRoundedIcon />} delay={0.14} subtitle={`${pendingComplaints} pending`} />
            <KpiCard label="My Feedbacks" value={feedbacks.length} color={C.teal} icon={<FeedbackRoundedIcon />} delay={0.18} subtitle="Submitted" />
          </div>

          {/* Search + Filters Row */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="jp-card"
            style={{ padding: "22px 26px" }}
          >
            <Orb style={{ top: -40, right: -40, width: 200, height: 200, background: `radial-gradient(circle,${C.v400}18,transparent 70%)` }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 11, background: `${C.v300}18`, border: `1px solid ${C.v300}28`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FilterListRoundedIcon sx={{ color: C.v200, fontSize: 18 }} />
                  </div>
                  <Typography sx={{ fontFamily: "'Instrument Serif',serif", fontSize: 17, fontStyle: "italic", color: "white" }}>
                    Search & Filter
                  </Typography>
                </div>
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={loadJobs}
                  style={{
                    height: 36, padding: "0 14px", borderRadius: 11,
                    border: `1px solid ${C.v300}35`,
                    background: `${C.v300}15`,
                    color: C.v200, fontFamily: "'Outfit',sans-serif",
                    fontSize: 12, fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  {refreshing
                    ? <CircularProgress size={12} sx={{ color: C.v200 }} />
                    : <RefreshRoundedIcon style={{ fontSize: 15 }} />
                  }
                  Refresh
                </motion.button>
              </div>
              <div className="jp-divider" />

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
                <TextField
                  value={q} onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by title, company, location…" size="small"
                  InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon sx={{ color: "rgba(255,255,255,0.25)", fontSize: 18 }} /></InputAdornment> }}
                  sx={ISX}
                />
                <CustomSelect
                  value={typeId}
                  onChange={setTypeId}
                  options={[{ id: "", label: "All Types" }, ...jobTypes.map((t) => ({ id: t.id, label: t.jobType_name }))]}
                  placeholder="Job Type"
                  accentColor={C.v300}
                />
                <CustomSelect
                  value={status}
                  onChange={setStatus}
                  options={[
                    { id: "", label: "All Status" },
                    { id: "1", label: "Active" },
                    { id: "0", label: "Inactive" },
                  ]}
                  placeholder="Status"
                  accentColor={C.teal}
                />
              </div>
            </div>
          </motion.div>

          {/* Job List */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="jp-card"
            style={{ padding: "26px" }}
          >
            <Orb style={{ top: -60, left: -60, width: 280, height: 280, background: `radial-gradient(circle,${C.v500}18,transparent 65%)` }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <Heading icon={<WorkRoundedIcon />} title="Job Listings" count={filteredJobs.length} color={C.v300} />

              {/* Column headers */}
              <div style={{
                display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr 1fr 100px 90px 110px",
                padding: "7px 16px", marginBottom: 8, borderRadius: 10,
                background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.04)",
              }}>
                {["Title", "Company", "Description", "Location", "Date", "Status", "Type"].map((h) => (
                  <Typography key={h} sx={{ color: "rgba(255,255,255,0.2)", fontFamily: "'Outfit',sans-serif", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}>
                    {h}
                  </Typography>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 420, overflowY: "auto", paddingRight: 2 }}>
                <AnimatePresence mode="popLayout">
                  {filteredJobs.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "40px 0", textAlign: "center" }}>
                      <WorkRoundedIcon sx={{ color: "rgba(255,255,255,0.08)", fontSize: 40, mb: 1 }} />
                      <Typography sx={{ color: "rgba(255,255,255,0.15)", fontFamily: "'Outfit',sans-serif", fontSize: 13 }}>No jobs found</Typography>
                    </motion.div>
                  ) : (
                    filteredJobs.map((j, i) => {
                      const isActive = String(j.job_status) === "1";
                      return (
                        <motion.div
                          key={j.id}
                          custom={i}
                          variants={RV}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          layout
                          className="jp-job-card"
                          style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr 1fr 100px 90px 110px", alignItems: "center", gap: 4 }}
                        >
                          {/* Title */}
                          <div>
                            <Typography sx={{ color: "white", fontFamily: "'Outfit',sans-serif", fontSize: 13.5, fontWeight: 700, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {j.job_title}
                            </Typography>
                          </div>
                          {/* Company */}
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <BusinessRoundedIcon sx={{ color: `${C.v200}55`, fontSize: 13, flexShrink: 0 }} />
                            <Typography sx={{ color: "rgba(255,255,255,0.55)", fontFamily: "'Outfit',sans-serif", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {j.job_companyName}
                            </Typography>
                          </div>
                          {/* Description */}
                          <Typography sx={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Outfit',sans-serif", fontSize: 11.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {j.job_description || "—"}
                          </Typography>
                          {/* Location */}
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <LocationOnRoundedIcon sx={{ color: `${C.teal}66`, fontSize: 13, flexShrink: 0 }} />
                            <Typography sx={{ color: "rgba(255,255,255,0.45)", fontFamily: "'Outfit',sans-serif", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {j.job_location || "—"}
                            </Typography>
                          </div>
                          {/* Date */}
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <CalendarTodayRoundedIcon sx={{ color: "rgba(255,255,255,0.2)", fontSize: 11, flexShrink: 0 }} />
                            <Typography sx={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Outfit',sans-serif", fontSize: 11 }}>
                              {j.job_date || "—"}
                            </Typography>
                          </div>
                          {/* Status */}
                          <div>
                            <div className="jp-tag" style={{
                              background: isActive ? C.incDim : C.expDim,
                              color: isActive ? C.inc : C.exp,
                              border: `1px solid ${isActive ? C.incBorder : C.expBorder}`,
                            }}>
                              {isActive
                                ? <CheckCircleRoundedIcon style={{ fontSize: 9 }} />
                                : <PendingRoundedIcon style={{ fontSize: 9 }} />
                              }
                              {statusLabel(j.job_status)}
                            </div>
                          </div>
                          {/* Type */}
                          <div>
                            <div className="jp-tag" style={{ background: `${C.v300}12`, color: `${C.v200}bb`, border: `1px solid ${C.v300}20` }}>
                              {jobTypeMap[j.jobType_id] || "—"}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Complaint + Feedback Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

            {/* Complaint Section */}
            <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="jp-card" style={{ padding: "26px" }}>
              <Orb style={{ top: -50, right: -50, width: 220, height: 220, background: `radial-gradient(circle,${C.exp}14,transparent 65%)` }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <Heading icon={<ReportProblemRoundedIcon />} title="Complaints" count={complaints.length} color={C.exp} />

                {/* Add form */}
                <div style={{
                  padding: "14px 16px 16px", borderRadius: 18,
                  background: `linear-gradient(135deg, ${C.exp}07 0%, rgba(255,255,255,0.02) 100%)`,
                  border: `1px solid ${C.exp}16`, marginBottom: 16,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04)`,
                  display: "flex", flexDirection: "column", gap: 8,
                }}>
                  <TextField
                    value={complaintTitle} onChange={(e) => setComplaintTitle(e.target.value)}
                    placeholder="Complaint title…" size="small"
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon sx={{ color: "rgba(255,255,255,0.22)", fontSize: 16 }} /></InputAdornment> }}
                    sx={ISX}
                  />
                  <textarea
                    className="jp-textarea"
                    value={complaintContent}
                    onChange={(e) => setComplaintContent(e.target.value)}
                    placeholder="Describe your complaint in detail…"
                    style={{ minHeight: 72 }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
                    onClick={saveComplaint}
                    disabled={loadingComplaint}
                    style={{
                      height: 42, borderRadius: 13, border: `1px solid ${C.exp}50`,
                      background: `linear-gradient(135deg, ${C.exp}cc, ${C.exp}88)`,
                      boxShadow: `0 6px 20px ${C.exp}30, inset 0 1px 0 rgba(255,255,255,0.2)`,
                      color: "white", fontFamily: "'Outfit',sans-serif", fontSize: 12.5, fontWeight: 700,
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                      opacity: loadingComplaint ? 0.75 : 1,
                    }}
                  >
                    {loadingComplaint ? <CircularProgress size={13} sx={{ color: "white" }} /> : <><SendRoundedIcon style={{ fontSize: 14 }} />Submit Complaint</>}
                  </motion.button>
                </div>

                {/* Table headers */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 80px", padding: "7px 14px", borderRadius: 10, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.04)", marginBottom: 6 }}>
                  {["Title & Content", "Date", "Status"].map((h) => (
                    <Typography key={h} sx={{ color: "rgba(255,255,255,0.2)", fontFamily: "'Outfit',sans-serif", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                      {h}
                    </Typography>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 260, overflowY: "auto", paddingRight: 2 }}>
                  <AnimatePresence mode="popLayout">
                    {complaints.length === 0 ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "28px 0", textAlign: "center" }}>
                        <Typography sx={{ color: "rgba(255,255,255,0.12)", fontFamily: "'Outfit',sans-serif", fontSize: 13 }}>No complaints yet</Typography>
                      </motion.div>
                    ) : (
                      complaints.map((c, i) => {
                        const isPending = String(c.complaint_status) === "0";
                        return (
                          <motion.div key={c.id} custom={i} variants={RV} initial="hidden" animate="visible" exit="exit" layout
                            className="jp-row-item"
                            style={{
                              display: "grid", gridTemplateColumns: "1fr 90px 80px",
                              alignItems: "start", padding: "10px 14px", borderRadius: 13,
                              background: "rgba(255,255,255,0.022)",
                              border: "1px solid rgba(255,255,255,0.048)", gap: 8,
                            }}
                          >
                            <div>
                              <Typography sx={{ color: "white", fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>
                                {c.complaint_title}
                              </Typography>
                              <Typography sx={{ color: "rgba(255,255,255,0.38)", fontFamily: "'Outfit',sans-serif", fontSize: 11.5, mt: 0.3, lineHeight: 1.4 }}>
                                {c.complaint_content}
                              </Typography>
                              {c.complaint_reply && (
                                <div style={{ marginTop: 6, padding: "6px 10px", borderRadius: 8, background: `${C.inc}10`, border: `1px solid ${C.inc}18` }}>
                                  <Typography sx={{ color: C.inc, fontFamily: "'Outfit',sans-serif", fontSize: 11, fontWeight: 600 }}>
                                    Reply: {c.complaint_reply}
                                  </Typography>
                                </div>
                              )}
                            </div>
                            <Typography sx={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Outfit',sans-serif", fontSize: 11 }}>
                              {c.complaint_date || "—"}
                            </Typography>
                            <div>
                              <div className="jp-tag" style={{
                                background: isPending ? C.goldDim : C.incDim,
                                color: isPending ? C.gold : C.inc,
                                border: `1px solid ${isPending ? C.goldBorder : C.incBorder}`,
                              }}>
                                {isPending
                                  ? <PendingRoundedIcon style={{ fontSize: 9 }} />
                                  : <CheckCircleRoundedIcon style={{ fontSize: 9 }} />
                                }
                                {complaintStatusLabel(c.complaint_status)}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Feedback Section */}
            <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="jp-card" style={{ padding: "26px" }}>
              <Orb style={{ top: -50, left: -50, width: 220, height: 220, background: `radial-gradient(circle,${C.teal}14,transparent 65%)` }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <Heading icon={<FeedbackRoundedIcon />} title="Feedback" count={feedbacks.length} color={C.teal} />

                {/* Add form */}
                <div style={{
                  padding: "14px 16px 16px", borderRadius: 18,
                  background: `linear-gradient(135deg, ${C.teal}07 0%, rgba(255,255,255,0.02) 100%)`,
                  border: `1px solid ${C.teal}16`, marginBottom: 16,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04)`,
                  display: "flex", flexDirection: "column", gap: 8,
                }}>
                  <textarea
                    className="jp-textarea"
                    value={feedbackContent}
                    onChange={(e) => setFeedbackContent(e.target.value)}
                    placeholder="Share your feedback, suggestions, or experience…"
                    style={{ minHeight: 100 }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
                    onClick={saveFeedback}
                    disabled={loadingFeedback}
                    style={{
                      height: 42, borderRadius: 13, border: `1px solid ${C.teal}50`,
                      background: `linear-gradient(135deg, ${C.teal}cc, ${C.teal}88)`,
                      boxShadow: `0 6px 20px ${C.teal}30, inset 0 1px 0 rgba(255,255,255,0.2)`,
                      color: "white", fontFamily: "'Outfit',sans-serif", fontSize: 12.5, fontWeight: 700,
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                      opacity: loadingFeedback ? 0.75 : 1,
                    }}
                  >
                    {loadingFeedback ? <CircularProgress size={13} sx={{ color: "white" }} /> : <><SendRoundedIcon style={{ fontSize: 14 }} />Submit Feedback</>}
                  </motion.button>
                </div>

                {/* Table headers */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 100px", padding: "7px 14px", borderRadius: 10, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.04)", marginBottom: 6 }}>
                  {["Feedback", "Date"].map((h) => (
                    <Typography key={h} sx={{ color: "rgba(255,255,255,0.2)", fontFamily: "'Outfit',sans-serif", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                      {h}
                    </Typography>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 290, overflowY: "auto", paddingRight: 2 }}>
                  <AnimatePresence mode="popLayout">
                    {feedbacks.length === 0 ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "28px 0", textAlign: "center" }}>
                        <Typography sx={{ color: "rgba(255,255,255,0.12)", fontFamily: "'Outfit',sans-serif", fontSize: 13 }}>No feedbacks yet</Typography>
                      </motion.div>
                    ) : (
                      feedbacks.map((f, i) => (
                        <motion.div key={f.id} custom={i} variants={RV} initial="hidden" animate="visible" exit="exit" layout
                          className="jp-row-item"
                          style={{
                            display: "grid", gridTemplateColumns: "1fr 100px",
                            alignItems: "start", padding: "10px 14px", borderRadius: 13,
                            background: "rgba(255,255,255,0.022)",
                            border: "1px solid rgba(255,255,255,0.048)", gap: 8,
                          }}
                        >
                          <Typography sx={{ color: "rgba(255,255,255,0.65)", fontFamily: "'Outfit',sans-serif", fontSize: 12.5, lineHeight: 1.5 }}>
                            {f.feedback_content}
                          </Typography>
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <CalendarTodayRoundedIcon sx={{ color: "rgba(255,255,255,0.2)", fontSize: 11 }} />
                            <Typography sx={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Outfit',sans-serif", fontSize: 11 }}>
                              {f.feedback_date || "—"}
                            </Typography>
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

      <Snackbar open={toast.open} autoHideDuration={3500} onClose={() => setToast((t) => ({ ...t, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={toast.type} onClose={() => setToast((t) => ({ ...t, open: false }))} sx={{ fontFamily: "'Outfit',sans-serif", fontSize: 13.5, borderRadius: "16px", fontWeight: 600, boxShadow: "0 16px 40px rgba(0,0,0,0.35),0 0 0 1px rgba(255,255,255,0.07)" }}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default JobPortalWorking;