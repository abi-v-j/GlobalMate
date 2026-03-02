// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../../global/Supabase";
import {
  TextField, Typography, InputAdornment,
  CircularProgress, Snackbar, Alert, Divider,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";

/* ── purple palette tokens */
const P = {
  900: "#3b0764",
  800: "#4c1d95",
  700: "#5b21b6",
  600: "#6d28d9",
  500: "#7c3aed",
  400: "#8b5cf6",
  300: "#a78bfa",
  200: "#c4b5fd",
  100: "#ede9fe",
  glow: "rgba(124,58,237,0.45)",
  glowSoft: "rgba(124,58,237,0.18)",
};

/* ── input style */
const mkSx = () => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    height: 52,
    transition: "all 0.22s",
    "&:hover": { background: "rgba(255,255,255,0.09)" },
    "& fieldset": { borderColor: "rgba(255,255,255,0.13)", borderWidth: 1.5 },
    "&:hover fieldset": { borderColor: "rgba(167,139,250,0.45)" },
    "&.Mui-focused fieldset": { borderColor: `${P[400]}`, borderWidth: 1.5 },
    "&.Mui-focused": { background: "rgba(124,58,237,0.08)" },
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

/* ── field label */
const FieldLabel = ({ icon, label, required, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}
  >
    <span style={{ color: P[300], display: "flex", opacity: 0.7 }}>{icon}</span>
    <Typography sx={{
      color: "rgba(255,255,255,0.52)", fontFamily: "'DM Sans', sans-serif",
      fontSize: 11, fontWeight: 700, letterSpacing: "0.11em", textTransform: "uppercase",
    }}>
      {label}{required && <span style={{ color: "#f87171", marginLeft: 3 }}>*</span>}
    </Typography>
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
      border: "1px solid rgba(167,139,250,0.12)",
    }}
  >
    <div style={{
      width: 32, height: 32, borderRadius: 10, flexShrink: 0,
      background: "rgba(124,58,237,0.18)", border: "1px solid rgba(167,139,250,0.22)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {icon}
    </div>
    <Typography sx={{ color: "rgba(255,255,255,0.52)", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
      {text}
    </Typography>
  </motion.div>
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roleHint, setRoleHint] = useState(null);
  const [toast, setToast] = useState({ open: false, msg: "", type: "success" });
  const navigate = useNavigate();

  const notify = (msg, type = "success") => setToast({ open: true, msg, type });
  const canLogin = email.trim() && password.trim();

  const handleLogin = async () => {
    if (loading) return;
    if (!canLogin) return notify("Enter email and password.", "warning");
    setLoading(true);
    setRoleHint(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const user = data.user;
      if (!user) throw new Error("No user returned");

      const { data: adminData, error: adminErr } = await supabase
        .from("tbl_admin").select("*").eq("id", user.id).single();
      if (!adminErr && adminData) {
        sessionStorage.setItem("aid", user.id);
        sessionStorage.setItem("role", "admin");
        setRoleHint("admin");
        notify("Admin login successful!", "success");
        navigate("/admin/dashboard");
        return;
      }

      const { data: studentData, error: studentErr } = await supabase
        .from("tbl_student").select("*").eq("id", user.id).single();
      if (!studentErr && studentData) {
        sessionStorage.setItem("uid", user.id);
        sessionStorage.setItem("role", "student");
        setRoleHint("student");
        notify("Student login successful!", "success");
        navigate("/user");
        return;
      }
      notify("User role not found.", "error");
    } catch (err) {
      notify(err.message || "Login failed.", "error");
    } finally {
      setLoading(false);
    }
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

        {/* ── deep blobs */}
        <Blob s={{ top: -140, left: -120, width: 520, height: 520, background: "radial-gradient(circle, rgba(109,40,217,0.55) 0%, transparent 65%)" }} />
        <Blob s={{ bottom: -100, right: -100, width: 460, height: 460, background: "radial-gradient(circle, rgba(91,33,182,0.48) 0%, transparent 65%)" }} />
        <Blob s={{ top: "35%", left: "42%", width: 380, height: 380, background: "radial-gradient(circle, rgba(124,58,237,0.28) 0%, transparent 65%)" }} />
        <Blob s={{ top: "60%", left: "18%", width: 280, height: 280, background: "radial-gradient(circle, rgba(76,29,149,0.35) 0%, transparent 65%)" }} />

        {/* ── grid overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(167,139,250,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.028) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />

        {/* ── diagonal accent stripe */}
        <div style={{
          position: "absolute", top: 0, left: "32%", width: 1, height: "100%",
          background: "linear-gradient(180deg, transparent, rgba(167,139,250,0.12) 30%, rgba(167,139,250,0.18) 60%, transparent)",
          transform: "skewX(-8deg)", transformOrigin: "top",
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* ════════════════ LEFT BRANDING PANEL ════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: 380, flexShrink: 0,
            borderRight: "1px solid rgba(167,139,250,0.10)",
            background: "linear-gradient(180deg, rgba(124,58,237,0.06) 0%, rgba(255,255,255,0.01) 100%)",
            backdropFilter: "blur(14px)",
            display: "flex", flexDirection: "column",
            padding: "52px 42px 44px",
            position: "relative", zIndex: 1,
          }}
        >
          {/* logo mark */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div style={{
              width: 66, height: 66, borderRadius: 22,
              background: `linear-gradient(135deg, ${P[500]}55 0%, ${P[700]}33 100%)`,
              border: `1.5px solid ${P[400]}55`,
              boxShadow: `0 16px 40px ${P.glow}, inset 0 1px 0 rgba(255,255,255,0.18)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 28, position: "relative",
            }}>
              <SchoolRoundedIcon sx={{ color: "white", fontSize: 30 }} />
              {/* glow ring */}
              <div style={{
                position: "absolute", inset: -4, borderRadius: 26,
                border: `1px solid ${P[400]}25`,
                boxShadow: `0 0 20px ${P.glowSoft}`,
              }} />
            </div>
          </motion.div>

          {/* brand */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
            <Typography sx={{
              fontFamily: "'Playfair Display', serif", fontSize: 12.5,
              color: P[300], letterSpacing: "0.24em", textTransform: "uppercase", mb: 1,
              opacity: 0.7,
            }}>
              GlobalMate
            </Typography>
            <Typography sx={{
              fontFamily: "'Playfair Display', serif", fontSize: 36,
              fontWeight: 900, color: "white", lineHeight: 1.08, mb: 2,
            }}>
              Welcome<br />Back
            </Typography>
            <Typography sx={{
              color: "rgba(255,255,255,0.38)", fontFamily: "'DM Sans', sans-serif",
              fontSize: 13.5, lineHeight: 1.75, maxWidth: 270,
            }}>
              Sign in to continue to your personal dashboard, track progress, and access all tools.
            </Typography>
          </motion.div>

          {/* features */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 32 }}>
            <Feature icon={<StarRoundedIcon sx={{ color: P[300], fontSize: 16 }} />} text="Access all course materials" delay={0.38} />
            <Feature icon={<TrendingUpRoundedIcon sx={{ color: P[300], fontSize: 16 }} />} text="Track your progress live" delay={0.44} />
            <Feature icon={<WorkRoundedIcon sx={{ color: P[300], fontSize: 16 }} />} text="Explore the job portal" delay={0.5} />
          </div>

          <div style={{ flex: 1 }} />

          {/* role hint card */}
          <AnimatePresence>
            {roleHint && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                style={{ marginBottom: 20 }}
              >
                <div style={{
                  padding: "14px 16px", borderRadius: 18,
                  background: roleHint === "admin"
                    ? "rgba(96,165,250,0.09)"
                    : `${P.glowSoft}`,
                  border: roleHint === "admin"
                    ? "1px solid rgba(96,165,250,0.22)"
                    : `1px solid ${P[400]}33`,
                  display: "flex", alignItems: "center", gap: 12,
                  boxShadow: roleHint === "admin"
                    ? "0 8px 24px rgba(96,165,250,0.12)"
                    : `0 8px 24px ${P.glowSoft}`,
                }}>
                  {roleHint === "admin"
                    ? <AdminPanelSettingsRoundedIcon sx={{ color: "#93c5fd", fontSize: 22 }} />
                    : <PersonRoundedIcon sx={{ color: P[300], fontSize: 22 }} />}
                  <div>
                    <Typography sx={{ color: "white", fontSize: 13.5, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
                      Logged in as {roleHint === "admin" ? "Admin" : "Student"}
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.38)", fontSize: 11.5, fontFamily: "'DM Sans',sans-serif" }}>
                      Redirecting to dashboard…
                    </Typography>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Divider sx={{ borderColor: "rgba(167,139,250,0.10)", mb: 2 }} />
          <Typography sx={{ color: "rgba(255,255,255,0.22)", fontSize: 12, lineHeight: 1.75, fontFamily: "'DM Sans',sans-serif" }}>
            💡 Use the email you registered with. If you haven't confirmed your email, check your inbox first.
          </Typography>
        </motion.div>

        {/* ════════════════ RIGHT FORM PANEL ════════════════ */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center",
          padding: "44px 60px", position: "relative", zIndex: 1, overflowY: "auto",
        }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: "100%", maxWidth: 480 }}
          >

            {/* form header */}
            <div style={{ marginBottom: 36 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.18 }}
                style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}
              >
                <div style={{
                  padding: "4px 12px", borderRadius: 30,
                  background: `${P.glowSoft}`,
                  border: `1px solid ${P[400]}30`,
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  <AutoAwesomeRoundedIcon sx={{ color: P[300], fontSize: 14 }} />
                  <Typography sx={{
                    color: P[300], fontFamily: "'DM Sans',sans-serif",
                    fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                  }}>
                    Secure Sign In
                  </Typography>
                </div>
              </motion.div>

              <Typography sx={{
                fontFamily: "'Playfair Display', serif", fontSize: 30,
                fontWeight: 800, color: "white", lineHeight: 1.15, mb: 1,
              }}>
                Login to your account
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.32)", fontFamily: "'DM Sans',sans-serif", fontSize: 13.5 }}>
                Enter your credentials to access your dashboard
              </Typography>
            </div>

            {/* ── email field */}
            <div style={{ marginBottom: 18 }}>
              <FieldLabel icon={<EmailRoundedIcon sx={{ fontSize: 14 }} />} label="Email Address" required delay={0.2} />
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
                <TextField
                  type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  fullWidth sx={mkSx()}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailRoundedIcon sx={{ color: P[300], fontSize: 18, opacity: 0.6 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>
            </div>

            {/* ── password field */}
            <div style={{ marginBottom: 10 }}>
              <FieldLabel icon={<LockRoundedIcon sx={{ fontSize: 14 }} />} label="Password" required delay={0.26} />
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
                <TextField
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  fullWidth sx={mkSx()}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockRoundedIcon sx={{ color: P[300], fontSize: 18, opacity: 0.6 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
                          style={{ cursor: "pointer", color: "rgba(255,255,255,0.3)", display: "flex" }}
                          onClick={() => setShowPwd(s => !s)}>
                          {showPwd
                            ? <VisibilityOffRoundedIcon sx={{ fontSize: 18, color: P[300], opacity: 0.6 }} />
                            : <VisibilityRoundedIcon sx={{ fontSize: 18, color: P[300], opacity: 0.6 }} />}
                        </motion.div>
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>
            </div>

            {/* forgot password */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.32 }}
              style={{ textAlign: "right", marginBottom: 28 }}>
              <motion.span
                whileHover={{ color: P[200] }}
                style={{ color: P[300], fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, cursor: "pointer", fontWeight: 600, transition: "color 0.2s" }}
              >
                Forgot password?
              </motion.span>
            </motion.div>

            {/* ── submit button */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}>
              <motion.button
                whileHover={!loading && canLogin ? { scale: 1.012, y: -2 } : {}}
                whileTap={!loading ? { scale: 0.982 } : {}}
                onClick={handleLogin}
                disabled={loading || !canLogin}
                style={{
                  width: "100%", height: 56, borderRadius: 18,
                  border: `1.5px solid ${P[400]}55`,
                  background: canLogin
                    ? `linear-gradient(135deg, ${P[600]} 0%, ${P[800]} 100%)`
                    : "rgba(255,255,255,0.06)",
                  color: "white", cursor: loading || !canLogin ? "not-allowed" : "pointer",
                  fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 700,
                  letterSpacing: "0.05em", textTransform: "uppercase",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  boxShadow: canLogin
                    ? `0 12px 36px ${P.glow}, inset 0 1px 0 rgba(255,255,255,0.18)`
                    : "none",
                  opacity: loading ? 0.72 : !canLogin ? 0.45 : 1,
                  transition: "all 0.25s",
                }}
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <CircularProgress size={20} sx={{ color: "white" }} />
                    </motion.div>
                  ) : (
                    <motion.div key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <LoginRoundedIcon style={{ fontSize: 22 }} />
                      Sign In
                      <ArrowForwardRoundedIcon style={{ fontSize: 18 }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>

            {/* divider */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(167,139,250,0.12)" }} />
              <Typography sx={{ color: "rgba(255,255,255,0.22)", fontFamily: "'DM Sans',sans-serif", fontSize: 12 }}>
                or
              </Typography>
              <div style={{ flex: 1, height: 1, background: "rgba(167,139,250,0.12)" }} />
            </motion.div>

            {/* sign up link */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.44 }}
              style={{ textAlign: "center" }}>
              <Typography sx={{ color: "rgba(255,255,255,0.28)", fontFamily: "'DM Sans',sans-serif", fontSize: 13.5 }}>
                Don't have an account?{" "}
                <motion.span
                  whileHover={{ color: P[200] }}
                  style={{ color: P[300], cursor: "pointer", fontWeight: 700, transition: "color 0.2s" }}
                  onClick={() => navigate("/userregistration")}
                >
                  Create one free →
                </motion.span>
              </Typography>
            </motion.div>

          </motion.div>
        </div>
      </div>

      {/* ── Toast */}
      <Snackbar open={toast.open} autoHideDuration={4000}
        onClose={() => setToast(t => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={toast.type} onClose={() => setToast(t => ({ ...t, open: false }))}
          sx={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, borderRadius: "14px", boxShadow: "0 12px 32px rgba(0,0,0,0.2)" }}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;