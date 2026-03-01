// ─── SideBar.jsx ────────────────────────────────────────────
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, Typography, Divider, Tooltip } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import FeedbackRoundedIcon from "@mui/icons-material/FeedbackRounded";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import ThumbDownAltRoundedIcon from "@mui/icons-material/ThumbDownAltRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";

const NAV_ITEMS = [
  { label: "Dashboard",        sub: "Overview & stats",     icon: DashboardRoundedIcon,            path: "/admin/dashboard",     badge: null },
  { label: "Expense Category", sub: "Manage expenses",      icon: AttachMoneyRoundedIcon,          path: "/admin/expcategory",   badge: null },
  { label: "Income Source",    sub: "Track income",         icon: AccountBalanceWalletRoundedIcon, path: "/admin/incsource",     badge: null },
  { label: "Add Job",          sub: "Post new openings",    icon: AddCircleOutlineRoundedIcon,     path: "/admin/addjob",        badge: null },
  { label: "Job Type",         sub: "Categorize roles",     icon: WorkRoundedIcon,                 path: "/admin/jobtype",       badge: null },
  { label: "View Feedback",    sub: "User responses",       icon: FeedbackRoundedIcon,             path: "/admin/feedback",      badge: 4 },
  { label: "Reply",            sub: "Send responses",       icon: ReplyRoundedIcon,                path: "/admin/reply",         badge: null },
  { label: "View Complaint",   sub: "Resolve issues",       icon: ThumbDownAltRoundedIcon,         path: "/admin/viewcomplaint", badge: 2 },
];

// ── single nav row
const NavItem = ({ item, index, isActive }) => {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  const showActiveBg = isActive;
  const showHoverBg = !isActive && hovered;

  return (
    <motion.div
      initial={{ opacity: 0, x: 22 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.045 * index, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={item.path} style={{ textDecoration: "none" }}>
        <motion.div
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          whileTap={{ scale: 0.975 }}
          style={{ position: "relative" }}
        >
          {/* active bg pill */}
          <AnimatePresence>
            {showActiveBg && (
              <motion.div
                key="active-bg"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 16,
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.06) 100%)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.12)",
                }}
              />
            )}
          </AnimatePresence>

          {/* hover bg pill — only when NOT active */}
          <AnimatePresence>
            {showHoverBg && (
              <motion.div
                key="hover-bg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              />
            )}
          </AnimatePresence>

          {/* ✅ FIXED active white line (inside padding + not clipped) */}
          {isActive && (
            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "absolute",
                left:0,                 // ✅ move inside
                top: "30%",
                transform: "translateY(-50%)",
                transformOrigin: "center",
                width: 4,
                height: 30,               // ✅ fixed height looks perfect
                borderRadius: 999,        // ✅ pill shape
                background: "rgba(255,255,255,0.92)",
                boxShadow: "0 0 14px rgba(255,255,255,0.35)",
                zIndex: 2,
              }}
            />
          )}

          {/* content row */}
          <Box
            sx={{
              position: "relative",
              zIndex: 3,
              display: "flex",
              alignItems: "center",
              gap: 1.4,
              px: 1.6,
              py: 1.05,
              borderRadius: 16,
              cursor: "pointer",
            }}
          >
            {/* icon container */}
            <motion.div
              animate={{ scale: isActive ? 1.06 : hovered ? 1.03 : 1 }}
              transition={{ duration: 0.22 }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "13px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  background: isActive
                    ? "linear-gradient(135deg, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.10) 100%)"
                    : "rgba(255,255,255,0.07)",
                  border: isActive
                    ? "1px solid rgba(255,255,255,0.22)"
                    : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: isActive
                    ? "0 6px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.18)"
                    : "none",
                  transition: "all 0.22s ease",
                }}
              >
                <Icon
                  sx={{
                    color: isActive ? "white" : "rgba(255,255,255,0.65)",
                    fontSize: 19,
                    transition: "color 0.2s",
                  }}
                />
              </Box>
            </motion.div>

            {/* text */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  color: isActive ? "white" : "rgba(255,255,255,0.76)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13.5,
                  fontWeight: isActive ? 750 : 520,
                  letterSpacing: "0.01em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  lineHeight: 1.2,
                }}
              >
                {item.label}
              </Typography>
              <Typography
                sx={{
                  fontSize: 11,
                  color: isActive ? "rgba(255,255,255,0.52)" : "rgba(255,255,255,0.32)",
                  fontFamily: "'DM Sans', sans-serif",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  mt: 0.1,
                }}
              >
                {item.sub}
              </Typography>
            </Box>

            {/* badge or arrow */}
            {item.badge ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.05 * index + 0.3, type: "spring", stiffness: 400 }}
              >
                <Box
                  sx={{
                    minWidth: 20,
                    height: 20,
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #ef4444, #dc2626)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 0.6,
                    boxShadow: "0 4px 10px rgba(239,68,68,0.4)",
                  }}
                >
                  <Typography
                    sx={{
                      color: "white",
                      fontSize: 10,
                      fontWeight: 900,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {item.badge}
                  </Typography>
                </Box>
              </motion.div>
            ) : (
              <motion.div
                animate={{ x: hovered ? 2 : 0, opacity: hovered ? 1 : 0 }}
                transition={{ duration: 0.18 }}
              >
                <KeyboardArrowRightRoundedIcon sx={{ color: "rgba(255,255,255,0.4)", fontSize: 16 }} />
              </motion.div>
            )}
          </Box>
        </motion.div>
      </Link>
    </motion.div>
  );
};

// ── section divider label
const SectionLabel = ({ label, delay }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay, duration: 0.4 }}>
    <Typography
      sx={{
        px: 2.2,
        pt: 1.25,
        pb: 0.55,
        fontSize: 10,
        color: "rgba(255,255,255,0.28)",
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        fontWeight: 700,
      }}
    >
      {label}
    </Typography>
  </motion.div>
);

// ── main sidebar
const SideBar = () => {
  const location = useLocation();

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: 272,
        height: "calc(100vh - 200px)", // ✅ reduced height
        position: "sticky",
        top: 0,                      // ✅ under navbar
        marginRight: 16,
        marginTop: 12,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",

        borderRadius: 26,              // ✅ added border radius
        background: "linear-gradient(160deg, #0d3d5f 0%, #082740 55%, #061e30 100%)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 22px 70px rgba(10,50,80,0.25)",
      }}
    >
      {/* ambient light blobs */}
      <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <Box
          sx={{
            position: "absolute",
            top: -60,
            left: -40,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(26,96,144,0.45) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 60,
            right: -60,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(10,50,80,0.5) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </Box>

      {/* noise grain */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* HEADER */}
      <Box sx={{ px: 2.4, pt: 2.4, pb: 1.6, position: "relative", zIndex: 1, flexShrink: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "16px",
              background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.06) 100%)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 36px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
              flexShrink: 0,
            }}
          >
            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 900, color: "white" }}>
              G
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 750, color: "white", lineHeight: 1.15 }}>
              GlobalMate
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, mt: 0.25 }}>
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#4ade80",
                  boxShadow: "0 0 6px #4ade80",
                }}
              />
              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10.5,
                  color: "rgba(255,255,255,0.45)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Admin Panel · Online
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: 2, position: "relative", zIndex: 1, flexShrink: 0 }}>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
      </Box>

      {/* SCROLL AREA */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          position: "relative",
          zIndex: 1,
          "&::-webkit-scrollbar": { width: 4 },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255,255,255,0.12)",
            borderRadius: 10,
            "&:hover": { background: "rgba(255,255,255,0.22)" },
          },
        }}
      >
        <SectionLabel label="Main Menu" delay={0.1} />

        <Box sx={{ px: 1.2, display: "flex", flexDirection: "column", gap: 0.5 }}>
          {NAV_ITEMS.slice(0, 5).map((item, i) => (
            <NavItem key={item.path} item={item} index={i} isActive={location.pathname === item.path} />
          ))}
        </Box>

        <SectionLabel label="Support" delay={0.35} />

        <Box sx={{ px: 1.2, display: "flex", flexDirection: "column", gap: 0.5 }}>
          {NAV_ITEMS.slice(5).map((item, i) => (
            <NavItem key={item.path} item={item} index={i + 5} isActive={location.pathname === item.path} />
          ))}
        </Box>

        <Box sx={{ height: 10 }} />
      </Box>

      {/* FOOTER */}
      <Box sx={{ position: "relative", zIndex: 1, flexShrink: 0 }}>
        <Box sx={{ px: 2, pb: 0.5 }}>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
        </Box>

        <Box
          sx={{
            mx: 1.6,
            my: 1.2,
            p: 1.3,
            borderRadius: "18px",
            background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.10)",
            display: "flex",
            alignItems: "center",
            gap: 1.2,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "12px",
              background: "linear-gradient(135deg, rgba(255,255,255,0.30), rgba(255,255,255,0.10))",
              border: "1px solid rgba(255,255,255,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Typography sx={{ color: "white", fontWeight: 800, fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
              A
            </Typography>
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ color: "white", fontSize: 13, fontWeight: 750, fontFamily: "'DM Sans', sans-serif" }}>
              Admin
            </Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.45)",
                fontSize: 11,
                fontFamily: "'DM Sans', sans-serif",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              admin@globalmate.com
            </Typography>
          </Box>

          <Tooltip title="Logout" placement="top" arrow>
            <motion.div whileHover={{ scale: 1.12, rotate: 4 }} whileTap={{ scale: 0.92 }}>
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(255,255,255,0.10)",
                  "&:hover": { background: "rgba(239,68,68,0.2)", borderColor: "rgba(239,68,68,0.4)" },
                  transition: "all 0.2s",
                }}
              >
                <LogoutRoundedIcon sx={{ color: "rgba(255,255,255,0.55)", fontSize: 15 }} />
              </Box>
            </motion.div>
          </Tooltip>
        </Box>
      </Box>
    </motion.div>
  );
};

export default SideBar;