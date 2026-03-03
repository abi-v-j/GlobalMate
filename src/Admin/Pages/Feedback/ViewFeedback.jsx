import React, { useEffect, useMemo, useState } from "react";
import supabase from "../../../global/Supabase";
import {
  TextField,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

// Icons
import FeedbackRoundedIcon from "@mui/icons-material/FeedbackRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

// ── glass panel base style (same as above)
const glassPanel = {
  background:
    "linear-gradient(160deg, rgba(13,61,95,0.95) 0%, rgba(8,39,63,0.97) 100%)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: "24px",
  boxShadow:
    "0 24px 64px rgba(10,50,80,0.30), inset 0 1px 0 rgba(255,255,255,0.10)",
  backdropFilter: "blur(20px)",
  position: "relative",
  overflow: "hidden",
};

// ── ambient light blob
const AmbientBlob = ({ top, left, right, bottom, size = 200, opacity = 0.12 }) => (
  <div
    style={{
      position: "absolute",
      top,
      left,
      right,
      bottom,
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle, rgba(26,96,144,${opacity}) 0%, transparent 70%)`,
      filter: "blur(40px)",
      pointerEvents: "none",
      zIndex: 0,
    }}
  />
);

// ── row animation
const rowVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.985 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.05, duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, x: -18, scale: 0.97, transition: { duration: 0.22 } },
};

// ── small action icon button (same style)
const ActionBtn = ({ onClick, disabled, tooltip, color, bg, hoverBg, children }) => (
  <Tooltip title={tooltip} placement="top" arrow>
    <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.88 }}>
      <IconButton
        size="small"
        onClick={onClick}
        disabled={disabled}
        sx={{
          width: 30,
          height: 30,
          borderRadius: "10px",
          background: bg,
          border: `1px solid ${bg}`,
          "&:hover": { background: hoverBg },
          transition: "all 0.18s",
        }}
      >
        {disabled ? (
          <CircularProgress size={12} sx={{ color }} />
        ) : (
          React.cloneElement(children, { sx: { color, fontSize: 15 } })
        )}
      </IconButton>
    </motion.div>
  </Tooltip>
);

const ViewFeedback = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const [toast, setToast] = useState({ open: false, msg: "", type: "success" });
  const notify = (msg, type = "success") => setToast({ open: true, msg, type });

  // shared MUI TextField sx
  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "14px",
      background: "rgba(255,255,255,0.07)",
      color: "white",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 13.5,
      "& fieldset": { borderColor: "rgba(255,255,255,0.13)" },
      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.26)" },
      "&.Mui-focused fieldset": { borderColor: "rgba(255,255,255,0.42)" },
    },
    "& input::placeholder": { color: "rgba(255,255,255,0.28)", opacity: 1 },
  };

  // ── READ
  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tbl_feedback")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      notify(error.message || "Failed to load feedback", "error");
      setList([]);
    } else {
      setList(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── DELETE
  const handleDelete = async (id) => {
    setDeletingId(id);
    const { error } = await supabase.from("tbl_feedback").delete().eq("id", id);

    if (error) notify(error.message || "Delete failed", "error");
    else {
      notify("Deleted.", "info");
      await fetchData();
    }
    setDeletingId(null);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((r) => {
      const content = (r.feedback_content || "").toLowerCase();
      const student = String(r.student_id || "").toLowerCase();
      const date = String(r.feedback_date || "").toLowerCase();
      return content.includes(q) || student.includes(q) || date.includes(q);
    });
  }, [list, search]);

  return (
    <div
      style={{
        minHeight: "100%",
        padding: "32px 28px",
        display: "flex",
        flexDirection: "column",
        gap: 28,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* ── PAGE HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              background: "linear-gradient(135deg, #0d3d5f, #1a6090)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 22px rgba(10,50,80,0.28)",
            }}
          >
            <FeedbackRoundedIcon sx={{ color: "white", fontSize: 22 }} />
          </div>

          <div>
            <Typography
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 22,
                fontWeight: 700,
                color: "#0A3250",
                lineHeight: 1.2,
              }}
            >
              View Feedback
            </Typography>
            <Typography
              sx={{
                fontSize: 12.5,
                color: "rgba(10,50,80,0.48)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Browse and manage user feedback
            </Typography>
          </div>
        </div>

        <Chip
          label={`${list.length} Total`}
          sx={{
            background: "linear-gradient(135deg, #0d3d5f, #1a6090)",
            color: "white",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: 12,
            height: 30,
            boxShadow: "0 6px 18px rgba(10,50,80,0.22)",
          }}
        />
      </motion.div>

      {/* ── TABLE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        style={{ ...glassPanel }}
      >
        <AmbientBlob top={-50} right={-40} size={260} opacity={0.1} />
        <AmbientBlob bottom={-60} left={-30} size={220} opacity={0.08} />

        <div style={{ position: "relative", zIndex: 1, padding: "26px 22px" }}>
          {/* toolbar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <Typography
              sx={{
                color: "white",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              All Feedback
              <Typography
                component="span"
                sx={{
                  ml: 1.2,
                  fontSize: 12,
                  color: "rgba(255,255,255,0.32)",
                  fontWeight: 400,
                }}
              >
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </Typography>
            </Typography>

            <TextField
              size="small"
              placeholder="Search content / date / student…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon
                      sx={{ color: "rgba(255,255,255,0.32)", fontSize: 16 }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: 260,
                ...fieldSx,
                "& .MuiOutlinedInput-root": {
                  ...fieldSx["& .MuiOutlinedInput-root"],
                  height: 36,
                },
              }}
            />
          </div>

          {/* header bar */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "56px 1fr 140px 230px 90px",
              gap: 10,
              padding: "7px 12px",
              marginBottom: 6,
              borderRadius: 10,
              background: "rgba(255,255,255,0.05)",
              alignItems: "center",
            }}
          >
            {["#", "Content", "Date", "Student", "Action"].map((h, idx) => (
              <Typography
                key={h}
                sx={{
                  color: "rgba(255,255,255,0.32)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  textAlign: idx === 4 ? "center" : "left",
                }}
              >
                {h}
              </Typography>
            ))}
          </div>

          {/* rows */}
          <div
            className="custom-scroll"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              maxHeight: 440,
              overflowY: "auto",
            }}
          >
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "44px 0" }}>
                <CircularProgress size={26} sx={{ color: "rgba(255,255,255,0.32)" }} />
              </div>
            ) : filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "44px 0" }}>
                <Typography sx={{ color: "rgba(255,255,255,0.2)", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
                  {search ? "No results found" : "No feedback yet"}
                </Typography>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filtered.map((row, i) => (
                  <motion.div
                    key={row.id}
                    custom={i}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    style={{
                      display: "grid",
                      gridTemplateColumns: "56px 1fr 140px 230px 90px",
                      gap: 10,
                      alignItems: "center",
                      padding: "10px 12px",
                      borderRadius: 14,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      transition: "background 0.18s, border-color 0.18s",
                    }}
                    whileHover={{
                      background: "rgba(255,255,255,0.07)",
                      borderColor: "rgba(255,255,255,0.12)",
                      transition: { duration: 0.14 },
                    }}
                  >
                    {/* SL */}
                    <div
                      style={{
                        width: 34,
                        height: 28,
                        borderRadius: 10,
                        background: "rgba(255,255,255,0.07)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "rgba(255,255,255,0.38)",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {i + 1}
                      </Typography>
                    </div>

                    {/* Content */}
                    <Typography
                      sx={{
                        color: "white",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 13.5,
                        fontWeight: 500,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                      title={row.feedback_content || ""}
                    >
                      {row.feedback_content || "—"}
                    </Typography>

                    {/* Date */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <CalendarTodayRoundedIcon sx={{ color: "rgba(255,255,255,0.28)", fontSize: 16 }} />
                      <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: 12.5 }}>
                        {row.feedback_date || "—"}
                      </Typography>
                    </div>

                    {/* Student */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                      <PersonRoundedIcon sx={{ color: "rgba(255,255,255,0.28)", fontSize: 18 }} />
                      <Typography
                        sx={{
                          color: "rgba(255,255,255,0.60)",
                          fontSize: 12.5,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={String(row.student_id || "")}
                      >
                        {row.student_id ? String(row.student_id) : "—"}
                      </Typography>
                    </div>

                    {/* Action */}
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <ActionBtn
                        tooltip="Delete"
                        color="#f87171"
                        bg="rgba(248,113,113,0.10)"
                        hoverBg="rgba(248,113,113,0.22)"
                        onClick={() => handleDelete(row.id)}
                        disabled={deletingId === row.id}
                      >
                        <DeleteOutlineRoundedIcon />
                      </ActionBtn>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── TOAST */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={toast.type}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            borderRadius: "14px",
            boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
          }}
        >
          {toast.msg}
        </Alert>
      </Snackbar>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.22); }
      `}</style>
    </div>
  );
};

export default ViewFeedback;