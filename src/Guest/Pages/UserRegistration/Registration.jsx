import React, { useState, useRef } from "react";
import supabase from "../../../global/Supabase";
import {
  TextField, Typography, InputAdornment,
  CircularProgress, Snackbar, Alert, LinearProgress,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import HowToRegRoundedIcon from "@mui/icons-material/HowToRegRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";

/* ── purple palette */
const P = {
  900: "#3b0764", 800: "#4c1d95", 700: "#5b21b6",
  600: "#6d28d9", 500: "#7c3aed", 400: "#8b5cf6",
  300: "#a78bfa", 200: "#c4b5fd",
  glow: "rgba(124,58,237,0.45)",
  glowSoft: "rgba(124,58,237,0.18)",
};

/* ── password strength */
const getStrength = (p) => {
  if (!p) return 0;
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
};
const SL = ["", "Weak", "Fair", "Good", "Strong"];
const SC = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"];

/* ── input style */
const mkSx = () => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    background: "rgba(255,255,255,0.055)",
    color: "white",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14, height: 52,
    transition: "all 0.22s",
    "&:hover": { background: "rgba(255,255,255,0.085)" },
    "& fieldset": { borderColor: "rgba(255,255,255,0.13)", borderWidth: 1.5 },
    "&:hover fieldset": { borderColor: `${P[300]}55` },
    "&.Mui-focused fieldset": { borderColor: P[400], borderWidth: 1.5 },
    "&.Mui-focused": { background: `${P.glowSoft}` },
  },
  "& input": { fontFamily: "'DM Sans', sans-serif", fontSize: 14 },
  "& input::placeholder": { color: "rgba(255,255,255,0.22)", opacity: 1 },
  "& input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 100px #2e1065 inset",
    WebkitTextFillColor: "white",
  },
});

/* ── blob */
const Blob = ({ s }) => (
  <div style={{ position: "absolute", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none", zIndex: 0, ...s }} />
);

/* ── field wrapper */
const FField = ({ label, required, icon, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    style={{ display: "flex", flexDirection: "column", gap: 7 }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ color: P[300], display: "flex", opacity: 0.7 }}>{icon}</span>
      <Typography sx={{
        color: "rgba(255,255,255,0.52)", fontFamily: "'DM Sans', sans-serif",
        fontSize: 11, fontWeight: 700, letterSpacing: "0.11em", textTransform: "uppercase",
      }}>
        {label}{required && <span style={{ color: "#f87171", marginLeft: 3 }}>*</span>}
      </Typography>
    </div>
    {children}
  </motion.div>
);

/* ── section divider */
const SectionLabel = ({ label, delay }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay, duration: 0.3 }}
    style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}
  >
    <Typography sx={{
      color: P[300], fontFamily: "'DM Sans',sans-serif", opacity: 0.5,
      fontSize: 10, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", whiteSpace: "nowrap",
    }}>
      {label}
    </Typography>
    <div style={{ flex: 1, height: 1, background: `${P[400]}22` }} />
  </motion.div>
);

/* ── step indicator */
const Step = ({ n, label, done, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.38 }}
    style={{ display: "flex", alignItems: "center", gap: 11 }}
  >
    <div style={{
      width: 28, height: 28, borderRadius: 10, flexShrink: 0,
      background: done ? "rgba(34,197,94,0.16)" : `${P.glowSoft}`,
      border: `1.5px solid ${done ? "rgba(34,197,94,0.42)" : `${P[400]}33`}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: done ? "0 0 12px rgba(34,197,94,0.2)" : `0 0 8px ${P.glowSoft}`,
      transition: "all 0.32s",
    }}>
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="c" initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 400 }}>
            <CheckCircleRoundedIcon sx={{ color: "#22c55e", fontSize: 16 }} />
          </motion.div>
        ) : (
          <motion.div key="n" initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <Typography sx={{ color: P[300], fontSize: 11, fontWeight: 800, fontFamily: "'DM Sans',sans-serif", lineHeight: 1 }}>
              {n}
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    <Typography sx={{
      fontFamily: "'DM Sans', sans-serif", fontSize: 13,
      color: done ? "rgba(255,255,255,0.78)" : "rgba(255,255,255,0.35)",
      fontWeight: done ? 600 : 400, transition: "all 0.3s",
    }}>{label}</Typography>
  </motion.div>
);

/* ── feature pill */
const Feature = ({ icon, text, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -14 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.38 }}
    style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "11px 15px", borderRadius: 14,
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${P[400]}18`,
    }}
  >
    <div style={{
      width: 30, height: 30, borderRadius: 10, flexShrink: 0,
      background: P.glowSoft, border: `1px solid ${P[400]}28`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {icon}
    </div>
    <Typography sx={{ color: "rgba(255,255,255,0.52)", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
      {text}
    </Typography>
  </motion.div>
);

/* ════ MAIN COMPONENT ════ */
const Registration = () => {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", contact: "", address: "", country: "" });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [toast, setToast] = useState({ open: false, msg: "", type: "success" });
  const [done, setDone] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const notify = (msg, type = "success") => setToast({ open: true, msg, type });
  const strength = getStrength(form.password);
  const filled = [form.fullName, form.email, form.password, form.contact].filter(Boolean).length;
  const progress = (filled / 4) * 100;

  const applyPhoto = (file) => {
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    applyPhoto(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (loading) return;
    if (!form.fullName || !form.email || !form.password || !form.contact) {
      notify("Please fill all required fields.", "error"); return;
    }
    setLoading(true);
    try {
      let photoURL = null;
      if (photoFile) {
        const fn = `${Date.now()}_${photoFile.name}`;
        const { data, error } = await supabase.storage.from("userFiles").upload(fn, photoFile);
        if (error) throw error;
        photoURL = supabase.storage.from("userFiles").getPublicUrl(data.path).data.publicUrl;
      }
      const { data: auth, error: signErr } = await supabase.auth.signUp({ email: form.email, password: form.password });
      if (signErr) throw signErr;
      const { error: dbErr } = await supabase.from("tbl_student").insert([{
        id: auth.user.id, student_name: form.fullName, student_email: form.email,
        student_contact: Number(form.contact), student_address: form.address,
        student_country: form.country, student_photo: photoURL,
      }]);
      if (dbErr) throw dbErr;
      setDone(true);
      notify("Check your email for the confirmation link!", "success");
    } catch (err) { notify(err.message, "error"); }
    finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=Playfair+Display:wght@700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(167,139,250,0.2); border-radius: 10px; }
      `}</style>

      <div style={{
        minHeight: "100vh", width: "100%",
        background: "linear-gradient(140deg, #1a0533 0%, #2e1065 45%, #1e0a4a 100%)",
        display: "flex", fontFamily: "'DM Sans', sans-serif",
        position: "relative", overflow: "hidden",
      }}>

        {/* blobs */}
        <Blob s={{ top: -140, left: -120, width: 520, height: 520, background: `radial-gradient(circle, ${P[600]}55 0%, transparent 65%)` }} />
        <Blob s={{ bottom: -100, right: -100, width: 460, height: 460, background: `radial-gradient(circle, ${P[700]}48 0%, transparent 65%)` }} />
        <Blob s={{ top: "40%", left: "38%", width: 380, height: 380, background: `radial-gradient(circle, ${P[500]}28 0%, transparent 65%)` }} />
        <Blob s={{ top: "65%", left: "16%", width: 260, height: 260, background: `radial-gradient(circle, ${P[800]}35 0%, transparent 65%)` }} />

        {/* grid overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage: `linear-gradient(${P[300]}08 1px, transparent 1px), linear-gradient(90deg, ${P[300]}08 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }} />

        {/* diagonal accent */}
        <div style={{
          position: "absolute", top: 0, left: "32%", width: 1, height: "100%",
          background: `linear-gradient(180deg, transparent, ${P[400]}18 30%, ${P[400]}22 60%, transparent)`,
          transform: "skewX(-8deg)", transformOrigin: "top",
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* ════ LEFT PANEL ════ */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: 370, flexShrink: 0,
            borderRight: `1px solid ${P[400]}15`,
            background: `linear-gradient(180deg, ${P[500]}08 0%, rgba(255,255,255,0.01) 100%)`,
            backdropFilter: "blur(14px)",
            display: "flex", flexDirection: "column",
            padding: "52px 42px 44px",
            position: "relative", zIndex: 1,
          }}
        >
          {/* logo */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div style={{
              width: 66, height: 66, borderRadius: 22, marginBottom: 28, position: "relative",
              background: `linear-gradient(135deg, ${P[500]}55 0%, ${P[700]}33 100%)`,
              border: `1.5px solid ${P[400]}55`,
              boxShadow: `0 16px 40px ${P.glow}, inset 0 1px 0 rgba(255,255,255,0.18)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <SchoolRoundedIcon sx={{ color: "white", fontSize: 30 }} />
              <div style={{ position: "absolute", inset: -4, borderRadius: 26, border: `1px solid ${P[400]}22`, boxShadow: `0 0 20px ${P.glowSoft}` }} />
            </div>
          </motion.div>

          {/* brand */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: 12.5, color: P[300], letterSpacing: "0.24em", textTransform: "uppercase", mb: 1, opacity: 0.7 }}>
              GlobalMate
            </Typography>
            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 900, color: "white", lineHeight: 1.08, mb: 2 }}>
              Student<br />Registration
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.38)", fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, lineHeight: 1.75, maxWidth: 270 }}>
              Join thousands of students building their future. Create your account and unlock all features today.
            </Typography>
          </motion.div>

          {/* features */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 28 }}>
            <Feature icon={<StarRoundedIcon sx={{ color: P[300], fontSize: 15 }} />} text="Access all course materials" delay={0.38} />
            <Feature icon={<TrendingUpRoundedIcon sx={{ color: P[300], fontSize: 15 }} />} text="Connect with global peers" delay={0.44} />
            <Feature icon={<WorkRoundedIcon sx={{ color: P[300], fontSize: 15 }} />} text="Track your progress live" delay={0.5} />
          </div>

          <div style={{ flex: 1 }} />

          {/* progress + steps */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <Typography sx={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans',sans-serif", fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Completion
              </Typography>
              <Typography sx={{ color: progress === 100 ? "#22c55e" : P[300], fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 800, transition: "color 0.3s" }}>
                {Math.round(progress)}%
              </Typography>
            </div>
            <LinearProgress variant="determinate" value={progress} sx={{
              borderRadius: 10, height: 5,
              background: `${P[400]}20`,
              "& .MuiLinearProgress-bar": { borderRadius: 10, background: `linear-gradient(90deg, ${P[500]} 0%, ${P[300]} 100%)` },
            }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 11, marginTop: 22 }}>
              {[
                { label: "Personal Info", done: !!form.fullName },
                { label: "Email & Password", done: !!(form.email && form.password) },
                { label: "Contact Details", done: !!form.contact },
                { label: "Profile Photo", done: !!photoFile },
              ].map((s, i) => (
                <Step key={s.label} n={i + 1} label={s.label} done={s.done} delay={0.58 + i * 0.06} />
              ))}
            </div>
          </motion.div>

          {/* photo preview */}
          <AnimatePresence>
            {photoPreview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.82, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.82 }}
                transition={{ duration: 0.3 }}
                style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 14 }}
              >
                <img src={photoPreview} alt="preview" style={{
                  width: 54, height: 54, borderRadius: 18, objectFit: "cover",
                  border: `2px solid ${P[400]}55`,
                  boxShadow: `0 10px 28px ${P.glow}`,
                }} />
                <div>
                  <Typography sx={{ color: "white", fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, fontWeight: 600 }}>
                    {photoFile?.name?.length > 22 ? photoFile.name.slice(0, 22) + "…" : photoFile?.name}
                  </Typography>
                  <Typography sx={{ color: P[300], fontFamily: "'DM Sans',sans-serif", fontSize: 11, opacity: 0.7 }}>
                    {(photoFile?.size / 1024).toFixed(1)} KB · Ready ✓
                  </Typography>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ════ RIGHT FORM PANEL ════ */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center",
          padding: "44px 60px", position: "relative", zIndex: 1, overflowY: "auto",
        }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: "100%", maxWidth: 640 }}
          >
            {/* header */}
            <div style={{ marginBottom: 32 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.16 }}
                style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}
              >
                <div style={{
                  padding: "4px 12px", borderRadius: 30,
                  background: P.glowSoft, border: `1px solid ${P[400]}30`,
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  <AutoAwesomeRoundedIcon sx={{ color: P[300], fontSize: 13 }} />
                  <Typography sx={{ color: P[300], fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    New Account
                  </Typography>
                </div>
              </motion.div>

              <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 800, color: "white", lineHeight: 1.2 }}>
                Fill in your details
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.32)", fontFamily: "'DM Sans',sans-serif", fontSize: 13, mt: 0.8 }}>
                Fields marked with <span style={{ color: "#f87171" }}>*</span> are required
              </Typography>
            </div>

            {/* ── Personal */}
            <SectionLabel label="Personal Information" delay={0.18} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <FField label="Full Name" required icon={<PersonRoundedIcon sx={{ fontSize: 14 }} />} delay={0.2}>
                <TextField value={form.fullName} onChange={set("fullName")} placeholder="John Doe" fullWidth sx={mkSx()} />
              </FField>
              <FField label="Email Address" required icon={<EmailRoundedIcon sx={{ fontSize: 14 }} />} delay={0.24}>
                <TextField type="email" value={form.email} onChange={set("email")} placeholder="john@example.com" fullWidth sx={mkSx()} />
              </FField>
            </div>

            {/* ── Security */}
            <SectionLabel label="Security" delay={0.26} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <FField label="Password" required icon={<LockRoundedIcon sx={{ fontSize: 14 }} />} delay={0.28}>
                <TextField
                  type={showPwd ? "text" : "password"}
                  value={form.password} onChange={set("password")}
                  placeholder="Min 8 characters" fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
                          style={{ cursor: "pointer", display: "flex" }}
                          onClick={() => setShowPwd(s => !s)}>
                          {showPwd
                            ? <VisibilityOffRoundedIcon sx={{ fontSize: 18, color: P[300], opacity: 0.7 }} />
                            : <VisibilityRoundedIcon sx={{ fontSize: 18, color: P[300], opacity: 0.7 }} />}
                        </motion.div>
                      </InputAdornment>
                    ),
                  }}
                  sx={mkSx()}
                />
                <AnimatePresence>
                  {form.password && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
                      <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                        {[1,2,3,4].map(n => (
                          <motion.div key={n}
                            animate={{ background: n <= strength ? SC[strength] : `${P[400]}22` }}
                            transition={{ duration: 0.3 }}
                            style={{ flex: 1, height: 3.5, borderRadius: 4 }}
                          />
                        ))}
                      </div>
                      <Typography sx={{ color: SC[strength], fontFamily: "'DM Sans',sans-serif", fontSize: 10.5, mt: 0.6, fontWeight: 700 }}>
                        {SL[strength]} password
                      </Typography>
                    </motion.div>
                  )}
                </AnimatePresence>
              </FField>

              <FField label="Contact Number" required icon={<PhoneRoundedIcon sx={{ fontSize: 14 }} />} delay={0.32}>
                <TextField value={form.contact} onChange={set("contact")} placeholder="+91 98765 43210" fullWidth sx={mkSx()} />
              </FField>
            </div>

            {/* ── Location */}
            <SectionLabel label="Location" delay={0.34} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <FField label="Address" icon={<HomeRoundedIcon sx={{ fontSize: 14 }} />} delay={0.36}>
                <TextField value={form.address} onChange={set("address")} placeholder="123 Main Street" fullWidth sx={mkSx()} />
              </FField>
              <FField label="Country" icon={<PublicRoundedIcon sx={{ fontSize: 14 }} />} delay={0.4}>
                <TextField value={form.country} onChange={set("country")} placeholder="India" fullWidth sx={mkSx()} />
              </FField>
            </div>

            {/* ── Photo */}
            <SectionLabel label="Profile Photo" delay={0.42} />
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }} style={{ marginBottom: 28 }}>
              <input ref={fileRef} type="file" accept="image/*" onChange={e => applyPhoto(e.target.files[0])} style={{ display: "none" }} />
              <motion.div
                onClick={() => fileRef.current.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                animate={{
                  borderColor: dragOver ? P[300] : photoFile ? "rgba(34,197,94,0.45)" : `${P[400]}25`,
                  background: dragOver ? P.glowSoft : photoFile ? "rgba(34,197,94,0.05)" : `${P[500]}08`,
                }}
                transition={{ duration: 0.18 }}
                style={{
                  borderRadius: 18, border: `1.5px dashed ${P[400]}25`,
                  padding: "22px 24px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 16,
                }}
              >
                <motion.div
                  animate={{ scale: dragOver ? 1.12 : 1 }}
                  style={{
                    width: 50, height: 50, borderRadius: 16, flexShrink: 0,
                    background: photoFile ? "rgba(34,197,94,0.14)" : P.glowSoft,
                    border: `1.5px solid ${photoFile ? "rgba(34,197,94,0.3)" : `${P[400]}33`}`,
                    display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
                  }}
                >
                  {photoPreview
                    ? <img src={photoPreview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <CloudUploadRoundedIcon sx={{ color: P[300], fontSize: 22, opacity: 0.8 }} />}
                </motion.div>

                <div style={{ flex: 1 }}>
                  <Typography sx={{ color: "rgba(255,255,255,0.75)", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>
                    {photoFile ? photoFile.name : dragOver ? "Drop it here!" : "Drag & drop or click to upload"}
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.28)", fontFamily: "'DM Sans',sans-serif", fontSize: 12, mt: 0.4 }}>
                    {photoFile ? `${(photoFile.size / 1024).toFixed(1)} KB · ${photoFile.type}` : "PNG or JPG — up to 10 MB"}
                  </Typography>
                </div>

                <AnimatePresence>
                  {photoFile && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <CheckCircleRoundedIcon sx={{ color: "#22c55e", fontSize: 24 }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {/* ── Submit */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <motion.button
                whileHover={!loading && !done ? { scale: 1.012, y: -2 } : {}}
                whileTap={!loading ? { scale: 0.982 } : {}}
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: "100%", height: 56, borderRadius: 18, cursor: loading ? "not-allowed" : "pointer",
                  border: `1.5px solid ${done ? "rgba(34,197,94,0.4)" : `${P[400]}55`}`,
                  background: done
                    ? "linear-gradient(135deg, rgba(34,197,94,0.22), rgba(34,197,94,0.08))"
                    : `linear-gradient(135deg, ${P[600]} 0%, ${P[800]} 100%)`,
                  color: "white",
                  fontFamily: "'DM Sans',sans-serif", fontSize: 14.5, fontWeight: 700,
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  boxShadow: done
                    ? "0 0 30px rgba(34,197,94,0.18), inset 0 1px 0 rgba(255,255,255,0.14)"
                    : `0 12px 36px ${P.glow}, inset 0 1px 0 rgba(255,255,255,0.18)`,
                  opacity: loading ? 0.72 : 1,
                  transition: "all 0.25s",
                }}
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <CircularProgress size={20} sx={{ color: "white" }} />
                    </motion.div>
                  ) : done ? (
                    <motion.div key="d" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <CheckCircleRoundedIcon style={{ fontSize: 22 }} /> Account Created!
                    </motion.div>
                  ) : (
                    <motion.div key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <HowToRegRoundedIcon style={{ fontSize: 22 }} /> Create My Account
                      <ArrowForwardRoundedIcon style={{ fontSize: 18 }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
                <div style={{ flex: 1, height: 1, background: `${P[400]}18` }} />
                <Typography sx={{ color: "rgba(255,255,255,0.2)", fontFamily: "'DM Sans',sans-serif", fontSize: 12 }}>or</Typography>
                <div style={{ flex: 1, height: 1, background: `${P[400]}18` }} />
              </div>

              <Typography sx={{ textAlign: "center", color: "rgba(255,255,255,0.28)", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
                Already have an account?{" "}
                <Link to="/" style={{ textDecoration: "none" }}>
                  <motion.span
                    whileHover={{ color: P[200] }}
                    style={{ color: P[300], cursor: "pointer", fontWeight: 700, transition: "color 0.2s" }}
                  >
                    Sign in here →
                  </motion.span>
                </Link>
              </Typography>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast(t => ({ ...t, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={toast.type} onClose={() => setToast(t => ({ ...t, open: false }))}
          sx={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, borderRadius: "14px", boxShadow: "0 12px 32px rgba(0,0,0,0.2)" }}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Registration;