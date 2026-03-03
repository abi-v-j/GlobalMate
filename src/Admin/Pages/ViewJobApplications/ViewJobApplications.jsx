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
  Avatar,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

// Icons
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

// ── glass panel base style
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

const statusMeta = (v) => {
  const n = Number(v);
  if (n === 1)
    return {
      label: "Approved",
      color: "#34d399",
      bg: "rgba(52,211,153,0.12)",
      border: "rgba(52,211,153,0.22)",
    };
  if (n === 2)
    return {
      label: "Rejected",
      color: "#fb7185",
      bg: "rgba(251,113,133,0.12)",
      border: "rgba(251,113,133,0.22)",
    };
  return {
    label: "Pending",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.12)",
    border: "rgba(251,191,36,0.22)",
  };
};

const ViewJobApplications = () => {
  const [apps, setApps] = useState([]);
  const [studentsById, setStudentsById] = useState({});
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

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

  // ── READ applications + related students
  const fetchData = async () => {
    setLoading(true);

    // 1) load applications
    const { data: appData, error: appErr } = await supabase
      .from("tbl_application")
      .select("*")
      .order("id", { ascending: false });

    if (appErr) {
      notify(appErr.message || "Failed to load applications", "error");
      setApps([]);
      setStudentsById({});
      setLoading(false);
      return;
    }

    const safeApps = appData || [];
    setApps(safeApps);

    // 2) load students for the student_id list
    const studentIds = Array.from(
      new Set(safeApps.map((a) => a.student_id).filter(Boolean))
    );

    if (studentIds.length === 0) {
      setStudentsById({});
      setLoading(false);
      return;
    }

    const { data: stuData, error: stuErr } = await supabase
      .from("tbl_student")
      .select("id, student_name, student_email, student_contact, student_photo")
      .in("id", studentIds);

    if (stuErr) {
      // even if students fail, still show applications
      notify(stuErr.message || "Failed to load student details", "warning");
      setStudentsById({});
      setLoading(false);
      return;
    }

    const map = {};
    (stuData || []).forEach((s) => {
      map[String(s.id)] = s;
    });
    setStudentsById(map);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── UPDATE status
  const updateStatus = async (id, statusVal) => {
    setUpdatingId(id);
    const { error } = await supabase
      .from("tbl_application")
      .update({ application_status: statusVal })
      .eq("id", id);

    if (error) notify(error.message || "Update failed", "error");
    else {
      notify(statusVal === 1 ? "Approved!" : "Rejected!", "success");
      await fetchData();
    }
    setUpdatingId(null);
  };

  // ── Filter
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return apps;

    return apps.filter((a) => {
      const s = studentsById[String(a.student_id)] || {};
      const name = String(s.student_name || "").toLowerCase();
      const email = String(s.student_email || "").toLowerCase();
      const contact = String(s.student_contact || "").toLowerCase();

      const jobId = String(a.job_id ?? "").toLowerCase();
      const date = String(a.application_date ?? "").toLowerCase();
      const status = statusMeta(a.application_status).label.toLowerCase();

      return (
        name.includes(q) ||
        email.includes(q) ||
        contact.includes(q) ||
        jobId.includes(q) ||
        date.includes(q) ||
        status.includes(q)
      );
    });
  }, [apps, studentsById, search]);

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
            <WorkRoundedIcon sx={{ color: "white", fontSize: 22 }} />
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
              Job Applications
            </Typography>
            <Typography
              sx={{
                fontSize: 12.5,
                color: "rgba(10,50,80,0.48)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              View applicant details and update status
            </Typography>
          </div>
        </div>

        <Chip
          label={`${apps.length} Total`}
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
              Applications
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
              placeholder="Search name/email/job/status…"
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
              gridTemplateColumns: "56px 320px 120px 140px 130px 170px",
              gap: 10,
              padding: "7px 12px",
              marginBottom: 6,
              borderRadius: 10,
              background: "rgba(255,255,255,0.05)",
              alignItems: "center",
            }}
          >
            {["#", "Student", "Job ID", "Date", "Status", "Actions"].map((h, idx) => (
              <Typography
                key={h}
                sx={{
                  color: "rgba(255,255,255,0.32)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  textAlign: idx === 5 ? "center" : "left",
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ textAlign: "center", padding: "44px 0" }}
              >
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.2)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                  }}
                >
                  {search ? "No results found" : "No applications yet"}
                </Typography>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filtered.map((row, i) => {
                  const s = studentsById[String(row.student_id)] || null;
                  const st = statusMeta(row.application_status);
                  const isUpdating = updatingId === row.id;

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
                        gridTemplateColumns: "56px 320px 120px 140px 130px 170px",
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
                      <div style={{ display: "flex", justifyContent: "center" }}>
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

                      {/* Student block */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                        <Avatar
                          src={s?.student_photo || ""}
                          sx={{
                            width: 34,
                            height: 34,
                            borderRadius: 12,
                            background: "rgba(255,255,255,0.12)",
                          }}
                        >
                          <PersonRoundedIcon sx={{ color: "rgba(255,255,255,0.55)" }} />
                        </Avatar>

                        <div style={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              color: "white",
                              fontSize: 13.5,
                              fontWeight: 700,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={s?.student_name || ""}
                          >
                            {s?.student_name || "Unknown Student"}
                          </Typography>

                          <Typography
                            sx={{
                              color: "rgba(255,255,255,0.45)",
                              fontSize: 12,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={s?.student_email || ""}
                          >
                            {s?.student_email || "—"}
                          </Typography>

                          <Typography
                            sx={{
                              color: "rgba(255,255,255,0.35)",
                              fontSize: 11.5,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              marginTop: 0.2,
                            }}
                            title={s?.student_contact ? String(s.student_contact) : ""}
                          >
                            <InfoRoundedIcon sx={{ fontSize: 14, color: "rgba(255,255,255,0.28)" }} />
                            {s?.student_contact ? String(s.student_contact) : "No contact"}
                          </Typography>
                        </div>
                      </div>

                      {/* Job ID */}
                      <Typography
                        sx={{
                          color: "rgba(255,255,255,0.82)",
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {row.job_id ?? "—"}
                      </Typography>

                      {/* Date */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <CalendarTodayRoundedIcon
                          sx={{ color: "rgba(255,255,255,0.28)", fontSize: 16 }}
                        />
                        <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: 12.5 }}>
                          {row.application_date || "—"}
                        </Typography>
                      </div>

                      {/* Status pill */}
                      <div>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "6px 10px",
                            borderRadius: 999,
                            background: st.bg,
                            border: `1px solid ${st.border}`,
                          }}
                        >
                          <Typography sx={{ color: st.color, fontSize: 12, fontWeight: 800 }}>
                            {st.label}
                          </Typography>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
                        <ActionBtn
                          tooltip="Approve"
                          color="#34d399"
                          bg="rgba(52,211,153,0.10)"
                          hoverBg="rgba(52,211,153,0.22)"
                          onClick={() => updateStatus(row.id, 1)}
                          disabled={isUpdating}
                        >
                          <CheckRoundedIcon />
                        </ActionBtn>

                        <ActionBtn
                          tooltip="Reject"
                          color="#fb7185"
                          bg="rgba(251,113,133,0.10)"
                          hoverBg="rgba(251,113,133,0.22)"
                          onClick={() => updateStatus(row.id, 2)}
                          disabled={isUpdating}
                        >
                          <CloseRoundedIcon />
                        </ActionBtn>
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

        @media (max-width: 1100px) {
          .hide-md { display: none; }
        }
      `}</style>
    </div>
  );
};

export default ViewJobApplications;