import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Typography } from "@mui/material";
import supabase from "../../../global/Supabase";

import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";

/* ── purple tokens */
const P = {
  900: "#1e0040",
  800: "#3b0764",
  700: "#4c1d95",
  600: "#5b21b6",
  500: "#6d28d9",
  400: "#7c3aed",
  300: "#8b5cf6",
  200: "#a78bfa",
  100: "#c4b5fd",
  50: "#ede9fe",
  glow: "rgba(109,40,217,0.55)",
  glowMid: "rgba(124,58,237,0.28)",
  glowSoft: "rgba(139,92,246,0.15)",
};

/* ── decorative blob */
const Blob = ({ s }) => (
  <div
    style={{
      position: "absolute",
      borderRadius: "50%",
      filter: "blur(80px)",
      pointerEvents: "none",
      ...s,
    }}
  />
);

/* ── floating orb keyframes */
const orbKf = `
  @keyframes orbFloat {
    0%   { transform: translate(0, 0) scale(1); }
    33%  { transform: translate(40px, -60px) scale(1.08); }
    66%  { transform: translate(-30px, 40px) scale(0.95); }
    100% { transform: translate(0, 0) scale(1); }
  }
  @keyframes orbFloat2 {
    0%   { transform: translate(0, 0) scale(1); }
    50%  { transform: translate(-50px, 30px) scale(1.1); }
    100% { transform: translate(0, 0) scale(1); }
  }
  @keyframes particleDrift {
    0%   { transform: translateY(0) translateX(0); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 0.6; }
    100% { transform: translateY(-100vh) translateX(40px); opacity: 0; }
  }
`;

/* ── stat card */
const StatCard = ({ icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    style={{
      padding: "16px 20px",
      borderRadius: 18,
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.09)",
      display: "flex",
      alignItems: "center",
      gap: 14,
      backdropFilter: "blur(10px)",
    }}
  >
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 13,
        background: `${color}22`,
        border: `1px solid ${color}44`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </div>
    <div>
      <Typography
        sx={{
          color: "rgba(255,255,255,0.4)",
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          color: "white",
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 16,
          fontWeight: 800,
          lineHeight: 1.2,
        }}
      >
        {value}
      </Typography>
    </div>
  </motion.div>
);

/* ── feature card */
const FeatureCard = ({ to, icon, title, subtitle, tag, image, accent, index }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: 0.2 + index * 0.12,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: 28,
        overflow: "hidden",
        height: 320,
        cursor: "pointer",
      }}
    >
      <Link to={to} style={{ textDecoration: "none", display: "block", height: "100%" }}>
        {/* image */}
        <motion.div
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "absolute", inset: 0 }}
        >
          <img src={image} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>

        {/* overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(160deg, ${accent}cc 0%, ${P[900]}ee 100%)`,
          }}
        />

        {/* content */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "28px 30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* top row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <motion.div
              animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? 5 : 0 }}
              transition={{ duration: 0.3 }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.20)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 8px 24px ${accent}44`,
              }}
            >
              {icon}
            </motion.div>

            <div
              style={{
                padding: "5px 12px",
                borderRadius: 30,
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.16)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {tag}
              </Typography>
            </div>
          </div>

          {/* bottom row */}
          <div>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.5)",
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 11.5,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                mb: 0.6,
              }}
            >
              {subtitle}
            </Typography>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 28,
                  fontWeight: 800,
                  color: "white",
                  lineHeight: 1.1,
                }}
              >
                {title}
              </Typography>

              <motion.div
                animate={{ x: hovered ? 6 : 0, opacity: hovered ? 1 : 0.5 }}
                transition={{ duration: 0.25 }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 13,
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ArrowForwardRoundedIcon sx={{ color: "white", fontSize: 20 }} />
              </motion.div>
            </div>

            <motion.div
              animate={{ width: hovered ? "100%" : "0%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                height: 2,
                marginTop: 14,
                borderRadius: 2,
                background: `linear-gradient(90deg, ${P[200]}, white)`,
                width: "0%",
              }}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

/* ══════════════════════════════════════ */
const UserDashboard = () => {
  const uid = sessionStorage.getItem("uid") || "";

  const [time, setTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");

  // ✅ real money data
  const [balance, setBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  // format INR
  const money = (n) =>
    Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

  // Try with student_uid, if column not exists then fallback to student_id
  const fetchRowsByUid = async (table, amountCol) => {
    let res = await supabase.from(table).select(amountCol).eq("student_uid", uid);
    if (res.error && String(res.error.message || "").toLowerCase().includes("student_uid")) {
      res = await supabase.from(table).select(amountCol).eq("student_id", uid);
    }
    return res;
  };

  const loadBalance = async () => {
    if (!uid) return;

    const incRes = await fetchRowsByUid("tbl_income", "income_amount");
    const expRes = await fetchRowsByUid("tbl_expense", "expense_amount");

    if (incRes.error) console.error("Income error:", incRes.error);
    if (expRes.error) console.error("Expense error:", expRes.error);

    const incTotal = (incRes.data || []).reduce(
      (sum, r) => sum + Number(r.income_amount || 0),
      0
    );

    const expTotal = (expRes.data || []).reduce(
      (sum, r) => sum + Number(r.expense_amount || 0),
      0
    );

    setTotalIncome(incTotal);
    setTotalExpense(expTotal);
    setBalance(incTotal - expTotal);
  };

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening");

    const t = setInterval(() => setTime(new Date()), 1000);

    loadBalance(); // ✅ load real balance on open

    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const timeStr = time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const dateStr = time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; }
        ${orbKf}
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          background: `linear-gradient(145deg, ${P[900]} 0%, #2d0070 35%, ${P[800]} 70%, #0d001f 100%)`,
          fontFamily: "'DM Sans', sans-serif",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* blobs */}
        <Blob
          s={{
            top: -160,
            left: -120,
            width: 560,
            height: 560,
            background: `radial-gradient(circle, ${P[500]}55 0%, transparent 65%)`,
            animation: "orbFloat 25s ease-in-out infinite",
            zIndex: 0,
          }}
        />
        <Blob
          s={{
            bottom: -100,
            right: -80,
            width: 480,
            height: 480,
            background: `radial-gradient(circle, ${P[600]}44 0%, transparent 65%)`,
            animation: "orbFloat2 32s ease-in-out infinite",
            zIndex: 0,
          }}
        />
        <Blob
          s={{
            top: "45%",
            left: "50%",
            width: 400,
            height: 400,
            background: `radial-gradient(circle, ${P[700]}30 0%, transparent 65%)`,
            animation: "orbFloat 40s ease-in-out infinite reverse",
            zIndex: 0,
          }}
        />

        {/* grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            backgroundImage: `linear-gradient(${P[200]}06 1px, transparent 1px), linear-gradient(90deg, ${P[200]}06 1px, transparent 1px)`,
            backgroundSize: "56px 56px",
          }}
        />

        {/* floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              zIndex: 0,
              pointerEvents: "none",
              left: `${10 + i * 11}%`,
              bottom: 0,
              width: i % 2 === 0 ? 6 : 4,
              height: i % 2 === 0 ? 6 : 4,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${P[100]}, ${P[300]}88)`,
              animation: `particleDrift ${10 + i * 2.5}s ease-in-out infinite`,
              animationDelay: `${i * 1.8}s`,
            }}
          />
        ))}

        {/* NAVBAR */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 48px 0",
          }}
        >
          {/* brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <motion.div
              whileHover={{ rotate: 10, scale: 1.08 }}
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                background: `linear-gradient(135deg, ${P[400]}77, ${P[600]}55)`,
                border: `1.5px solid ${P[300]}44`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 8px 24px ${P.glow}`,
              }}
            >
              <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 900, color: "white" }}>
                G
              </Typography>
            </motion.div>
            <div>
              <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 800, color: "white", lineHeight: 1 }}>
                GlobalMate
              </Typography>
              <Typography
                sx={{
                  color: P[200],
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 10.5,
                  opacity: 0.6,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Student Portal
              </Typography>
            </div>
          </div>

          {/* time/date */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={{ textAlign: "center" }}>
            <Typography sx={{ fontFamily: "'DM Sans',sans-serif", fontSize: 22, fontWeight: 800, color: "white", letterSpacing: "0.04em", lineHeight: 1 }}>
              {timeStr}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans',sans-serif", fontSize: 11.5 }}>
              {dateStr}
            </Typography>
          </motion.div>

          {/* actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              style={{
                position: "relative",
                width: 40,
                height: 40,
                borderRadius: 13,
                background: "rgba(255,255,255,0.07)",
                border: `1px solid ${P[300]}22`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <NotificationsNoneRoundedIcon sx={{ fontSize: 20, color: P[200] }} />
              <div
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography sx={{ color: "white", fontSize: 9, fontWeight: 800, fontFamily: "'DM Sans',sans-serif" }}>
                  3
                </Typography>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "6px 14px 6px 6px",
                borderRadius: 50,
                background: "rgba(255,255,255,0.07)",
                border: `1px solid ${P[300]}22`,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${P[400]}, ${P[600]})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PersonRoundedIcon sx={{ color: "white", fontSize: 18 }} />
              </div>
              <Typography sx={{ color: "rgba(255,255,255,0.75)", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600 }}>
                Student
              </Typography>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.92 }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 13,
                background: "rgba(255,255,255,0.07)",
                border: `1px solid ${P[300]}22`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={() => {
                sessionStorage.clear();
                window.location.href = "/";
              }}
            >
              <LogoutRoundedIcon sx={{ fontSize: 18, color: "rgba(255,255,255,0.5)" }} />
            </motion.div>
          </div>
        </motion.nav>

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.5 }}
          style={{ position: "relative", zIndex: 2, padding: "40px 48px 0" }}
        >
          <Typography sx={{ color: P[200], fontFamily: "'DM Sans',sans-serif", fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.7, mb: 0.6 }}>
            ✦ {greeting}
          </Typography>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <Typography sx={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px, 3.5vw, 46px)", fontWeight: 900, color: "white", lineHeight: 1.1 }}>
              Your Dashboard
            </Typography>

            {/* ✅ REAL STATS */}
            <div style={{ display: "flex", gap: 12 }}>
              <StatCard
                icon={<AccountBalanceWalletRoundedIcon sx={{ color: P[200], fontSize: 20 }} />}
                label="Balance"
                value={`₹${money(balance)}`}
                color={P[300]}
                delay={0.35}
              />
              <StatCard
                icon={<TrendingUpRoundedIcon sx={{ color: "#22c55e", fontSize: 20 }} />}
                label="Income"
                value={`₹${money(totalIncome)}`}
                color="#22c55e"
                delay={0.42}
              />
              <StatCard
                icon={<TrendingUpRoundedIcon sx={{ color: "#ef4444", fontSize: 20 }} />}
                label="Expense"
                value={`₹${money(totalExpense)}`}
                color="#ef4444"
                delay={0.49}
              />
            </div>
          </div>
        </motion.div>

        {/* MAIN GRID */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "grid",
            gridTemplateColumns: "1.45fr 0.55fr",
            gap: 20,
            padding: "28px 48px 48px",
            flex: 1,
          }}
        >
          <FeatureCard
            to="/user/expensemanager"
            icon={<AttachMoneyRoundedIcon sx={{ color: "white", fontSize: 24 }} />}
            title="Expense Manager"
            subtitle="Finance & budgeting"
            tag="Track Now"
            image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80"
            accent={P[500]}
            index={0}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <FeatureCard
              to="/user/jobportal"
              icon={<WorkRoundedIcon sx={{ color: "white", fontSize: 24 }} />}
              title="Job Portal"
              subtitle="Career opportunities"
              tag="Explore"
              image="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=80"
              accent={P[600]}
              index={1}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.45 }}
              style={{
                flex: 1,
                borderRadius: 28,
                padding: "24px 26px",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${P[300]}18`,
                backdropFilter: "blur(12px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Blob
                s={{
                  top: -40,
                  right: -40,
                  width: 150,
                  height: 150,
                  background: `radial-gradient(circle, ${P[500]}28, transparent 70%)`,
                  zIndex: 0,
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <Typography sx={{ color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif", fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", mb: 1 }}>
                  Quick tip
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.72)", fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, lineHeight: 1.65 }}>
                  Track your expenses daily to stay on top of your budget and hit your saving goals faster.
                </Typography>
              </div>

              <div style={{ position: "relative", zIndex: 1, marginTop: 16 }}>
                <div style={{ height: 3, borderRadius: 4, background: `${P[400]}22`, overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "68%" }}
                    transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: "100%", borderRadius: 4, background: `linear-gradient(90deg, ${P[400]}, ${P[200]})` }}
                  />
                </div>
                <Typography sx={{ color: "rgba(255,255,255,0.28)", fontFamily: "'DM Sans',sans-serif", fontSize: 10.5, mt: 0.8 }}>
                  68% of monthly budget used
                </Typography>
              </div>

              {/* optional refresh button */}
              <div style={{ position: "relative", zIndex: 1, marginTop: 10 }}>
                <button
                  onClick={loadBalance}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 14,
                    border: `1px solid ${P[300]}22`,
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.8)",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Refresh Balance
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;