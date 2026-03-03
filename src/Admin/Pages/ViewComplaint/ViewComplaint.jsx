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
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import TitleRoundedIcon from "@mui/icons-material/TitleRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

// ── glass panel base style (same theme)
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

// ── small action icon button
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

const ViewComplaint = () => {
  // ✅ Change these names if your DB columns differ
  const TABLE = "tbl_complaint";
  const COL_TITLE = "complaint_title";
  const COL_CONTENT = "complaint_content";
  const COL_USER = "user_id"; // or student_id / uid etc.
  const COL_REPLY = "complaint_reply"; // column to store reply
  const COL_STATUS = "complaint_status"; // optional (0/1 or text)

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ open: false, msg: "", type: "success" });

  // reply editor
  const [replyId, setReplyId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [savingReply, setSavingReply] = useState(false);

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
    "& textarea::placeholder": { color: "rgba(255,255,255,0.28)", opacity: 1 },
  };

  // ── READ
  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      notify(error.message || "Failed to load complaints", "error");
      setList([]);
    } else {
      setList(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  // ── start/cancel reply
  const startReply = (row) => {
    setReplyId(row.id);
    setReplyText(row?.[COL_REPLY] || "");
  };

  const cancelReply = () => {
    setReplyId(null);
    setReplyText("");
  };

  // ── SAVE reply
  const saveReply = async () => {
    if (!replyId) return;
    if (!replyText.trim()) return notify("Type a reply first.", "warning");

    setSavingReply(true);

    // status is optional — remove if you don’t have the column
    const payload = {
      [COL_REPLY]: replyText.trim(),
      [COL_STATUS]: 1, // remove if you don't have reply_status
    };

    const { error } = await supabase.from(TABLE).update(payload).eq("id", replyId);

    if (error) notify(error.message || "Reply update failed", "error");
    else {
      notify("Reply saved!");
      cancelReply();
      await fetchData();
    }

    setSavingReply(false);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return list;

    return list.filter((r) => {
      const t = String(r?.[COL_TITLE] || "").toLowerCase();
      const c = String(r?.[COL_CONTENT] || "").toLowerCase();
      const u = String(r?.[COL_USER] || "").toLowerCase();
      const rep = String(r?.[COL_REPLY] || "").toLowerCase();
      return t.includes(q) || c.includes(q) || u.includes(q) || rep.includes(q);
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
            <ReportProblemRoundedIcon sx={{ color: "white", fontSize: 22 }} />
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
              View Complaints
            </Typography>
            <Typography
              sx={{
                fontSize: 12.5,
                color: "rgba(10,50,80,0.48)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Search, review and reply to complaints
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
              All Complaints
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
              placeholder="Search title / content / user…"
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
                width: 280,
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
              gridTemplateColumns: "60px 220px 1fr 240px 260px",
              gap: 10,
              padding: "7px 12px",
              marginBottom: 6,
              borderRadius: 10,
              background: "rgba(255,255,255,0.05)",
              alignItems: "center",
            }}
          >
            {["#", "Title", "Content", "User Details", "Reply"].map((h, idx) => (
              <Typography
                key={h}
                sx={{
                  color: "rgba(255,255,255,0.32)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  textAlign: idx === 4 ? "left" : "left",
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
              maxHeight: 520,
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
                  {search ? "No results found" : "No complaints yet"}
                </Typography>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filtered.map((row, i) => {
                  const isReplying = replyId === row.id;

                  return (
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
                        gridTemplateColumns: "60px 220px 1fr 240px 260px",
                        gap: 10,
                        alignItems: "stretch",
                        padding: "10px 12px",
                        borderRadius: 14,
                        background: isReplying ? "rgba(96,165,250,0.08)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${isReplying ? "rgba(96,165,250,0.20)" : "rgba(255,255,255,0.07)"}`,
                        transition: "background 0.18s, border-color 0.18s",
                      }}
                      whileHover={
                        !isReplying
                          ? {
                              background: "rgba(255,255,255,0.07)",
                              borderColor: "rgba(255,255,255,0.12)",
                              transition: { duration: 0.14 },
                            }
                          : {}
                      }
                    >
                      {/* SL */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
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
                      </div>

                      {/* Title */}
                      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <TitleRoundedIcon sx={{ color: "rgba(255,255,255,0.28)", fontSize: 18, mt: "2px" }} />
                        <Typography
                          sx={{
                            color: "white",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 13.5,
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={String(row?.[COL_TITLE] || "")}
                        >
                          {row?.[COL_TITLE] || "—"}
                        </Typography>
                      </div>

                      {/* Content */}
                      <div style={{ display: "flex", gap: 8, alignItems: "flex-start", minWidth: 0 }}>
                        <DescriptionRoundedIcon sx={{ color: "rgba(255,255,255,0.28)", fontSize: 18, mt: "2px" }} />
                        <Typography
                          sx={{
                            color: "rgba(255,255,255,0.82)",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 13,
                            fontWeight: 500,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                          }}
                          title={String(row?.[COL_CONTENT] || "")}
                        >
                          {row?.[COL_CONTENT] || "—"}
                        </Typography>
                      </div>

                      {/* User */}
                      <div style={{ display: "flex", gap: 8, alignItems: "flex-start", minWidth: 0 }}>
                        <PersonRoundedIcon sx={{ color: "rgba(255,255,255,0.28)", fontSize: 18, mt: "2px" }} />
                        <Typography
                          sx={{
                            color: "rgba(255,255,255,0.60)",
                            fontSize: 12.5,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={String(row?.[COL_USER] || "")}
                        >
                          {row?.[COL_USER] ? String(row?.[COL_USER]) : "—"}
                        </Typography>
                      </div>

                      {/* Reply */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {!isReplying ? (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                            <Typography
                              sx={{
                                color: row?.[COL_REPLY]
                                  ? "rgba(255,255,255,0.70)"
                                  : "rgba(255,255,255,0.30)",
                                fontSize: 12.5,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                flex: 1,
                              }}
                              title={String(row?.[COL_REPLY] || "")}
                            >
                              {row?.[COL_REPLY] ? String(row?.[COL_REPLY]) : "No reply yet"}
                            </Typography>

                            <ActionBtn
                              tooltip="Reply"
                              color="#60a5fa"
                              bg="rgba(96,165,250,0.10)"
                              hoverBg="rgba(96,165,250,0.22)"
                              onClick={() => startReply(row)}
                              disabled={false}
                            >
                              <ReplyRoundedIcon />
                            </ActionBtn>
                          </div>
                        ) : (
                          <>
                            <TextField
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Type reply…"
                              multiline
                              minRows={2}
                              sx={{
                                ...fieldSx,
                                "& .MuiOutlinedInput-root": {
                                  ...fieldSx["& .MuiOutlinedInput-root"],
                                  borderRadius: "14px",
                                  paddingTop: "10px",
                                },
                              }}
                            />

                            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                              <motion.button
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={saveReply}
                                disabled={savingReply || !replyText.trim()}
                                style={{
                                  height: 36,
                                  padding: "0 12px",
                                  borderRadius: 12,
                                  cursor: "pointer",
                                  border: "1px solid rgba(96,165,250,0.28)",
                                  background:
                                    "linear-gradient(135deg, rgba(96,165,250,0.18), rgba(96,165,250,0.07))",
                                  color: "#93c5fd",
                                  fontFamily: "'DM Sans', sans-serif",
                                  fontSize: 12,
                                  fontWeight: 800,
                                  letterSpacing: "0.05em",
                                  textTransform: "uppercase",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: 6,
                                  opacity: savingReply || !replyText.trim() ? 0.5 : 1,
                                }}
                              >
                                {savingReply ? (
                                  <CircularProgress size={14} sx={{ color: "inherit" }} />
                                ) : (
                                  <>
                                    <CheckRoundedIcon style={{ fontSize: 16 }} /> Save
                                  </>
                                )}
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={cancelReply}
                                style={{
                                  height: 36,
                                  width: 40,
                                  borderRadius: 12,
                                  cursor: "pointer",
                                  border: "1px solid rgba(255,255,255,0.12)",
                                  background: "rgba(255,255,255,0.07)",
                                  color: "rgba(255,255,255,0.55)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <CloseRoundedIcon style={{ fontSize: 18 }} />
                              </motion.button>
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
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

        /* responsive fallback */
        @media (max-width: 1100px) {
          .custom-scroll > div {
            grid-template-columns: 60px 220px 1fr 240px 260px !important;
          }
        }
        @media (max-width: 900px) {
          .header-grid {
            display: none !important;
          }
          .row-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewComplaint;