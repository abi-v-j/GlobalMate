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
  MenuItem,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ToggleOnRoundedIcon from "@mui/icons-material/ToggleOnRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import NotesRoundedIcon from "@mui/icons-material/NotesRounded";

/* ─────────────────────────────
   SAME DESIGN SYSTEM AS YOUR ExpenseCategory
────────────────────────────── */
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

const AddJob = () => {
  const JOB_TABLE = "tbl_job";
  const TYPE_TABLE = "tbl_jobType";

  // create inputs
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobTypeId, setJobTypeId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [jobDate, setJobDate] = useState("");
  const [jobStatus, setJobStatus] = useState(1);

  // dropdown data
  const [jobTypes, setJobTypes] = useState([]);

  // list jobs
  const [jobs, setJobs] = useState([]);

  // edit
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editTypeId, setEditTypeId] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editStatus, setEditStatus] = useState(1);

  // UX
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ open: false, msg: "", type: "success" });
  const notify = (msg, type = "success") => setToast({ open: true, msg, type });

  // shared MUI field sx (same)
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

  /* ---------------- LOAD JOB TYPES ---------------- */
  const loadJobTypes = async () => {
    const { data, error } = await supabase
      .from(TYPE_TABLE)
      .select("*")
      .order("jobType_name", { ascending: true });

    if (!error) setJobTypes(data || []);
    else notify("Failed to load job types.", "error");
  };

  /* ---------------- LOAD JOBS ---------------- */
  const loadJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(JOB_TABLE)
      .select(
        `
        *,
        tbl_jobType:jobType_id ( id, jobType_name )
      `
      )
      .order("id", { ascending: false });

    if (!error) setJobs(data || []);
    else notify("Failed to load jobs.", "error");

    setLoading(false);
  };

  useEffect(() => {
    loadJobTypes();
    loadJobs();
  }, []);

  /* ---------------- CREATE / UPDATE ---------------- */
  const handleSave = async () => {
    const isEdit = !!editId;

    const title = isEdit ? editTitle : jobTitle;
    const desc = isEdit ? editDesc : jobDesc;
    const typeId = isEdit ? editTypeId : jobTypeId;
    const comp = isEdit ? editCompany : companyName;
    const loc = isEdit ? editLocation : location;
    const date = isEdit ? editDate : jobDate;
    const status = isEdit ? editStatus : jobStatus;

    if (!title.trim()) return notify("Enter job title.", "warning");
    if (!typeId) return notify("Select job type.", "warning");

    setSaving(true);

    if (isEdit) {
      const { error } = await supabase
        .from(JOB_TABLE)
        .update({
          job_title: title.trim(),
          job_description: (desc || "").trim(),
          jobType_id: Number(typeId),
          job_companyName: (comp || "").trim(),
          job_location: (loc || "").trim(),
          job_date: date || null,
          job_status: Number(status),
        })
        .eq("id", editId);

      if (!error) {
        notify("Job updated!");
        cancelEdit();
        await loadJobs();
      } else {
        notify("Update failed.", "error");
      }
    } else {
      const { error } = await supabase.from(JOB_TABLE).insert([
        {
          job_title: title.trim(),
          job_description: (desc || "").trim(),
          jobType_id: Number(typeId),
          job_companyName: (comp || "").trim(),
          job_location: (loc || "").trim(),
          job_date: date || null,
          job_status: Number(status),
        },
      ]);

      if (!error) {
        notify("Job saved!");
        setJobTitle("");
        setJobDesc("");
        setJobTypeId("");
        setCompanyName("");
        setLocation("");
        setJobDate("");
        setJobStatus(1);
        await loadJobs();
      } else {
        notify("Insert failed.", "error");
      }
    }

    setSaving(false);
  };

  /* ---------------- EDIT ---------------- */
  const startEdit = (row) => {
    setEditId(row.id);
    setEditTitle(row.job_title || "");
    setEditDesc(row.job_description || "");
    setEditTypeId(row.jobType_id ? String(row.jobType_id) : "");
    setEditCompany(row.job_companyName || "");
    setEditLocation(row.job_location || "");
    setEditDate(row.job_date || "");
    setEditStatus(row.job_status ?? 1);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
    setEditDesc("");
    setEditTypeId("");
    setEditCompany("");
    setEditLocation("");
    setEditDate("");
    setEditStatus(1);
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    setDeletingId(id);
    const { error } = await supabase.from(JOB_TABLE).delete().eq("id", id);

    if (!error) {
      notify("Deleted.", "info");
      await loadJobs();
    } else {
      notify("Delete failed.", "error");
    }
    setDeletingId(null);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return jobs;
    return jobs.filter((j) => {
      const typeName = j.tbl_jobType?.jobType_name || "";
      return (
        (j.job_title || "").toLowerCase().includes(q) ||
        (j.job_companyName || "").toLowerCase().includes(q) ||
        (j.job_location || "").toLowerCase().includes(q) ||
        (j.job_description || "").toLowerCase().includes(q) ||
        typeName.toLowerCase().includes(q)
      );
    });
  }, [jobs, search]);

  const isEditing = !!editId;

  const canSave = isEditing
    ? editTitle.trim() && editTypeId
    : jobTitle.trim() && jobTypeId;

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
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
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
              Job
            </Typography>
            <Typography
              sx={{
                fontSize: 12.5,
                color: "rgba(10,50,80,0.48)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Add, edit and manage job posts
            </Typography>
          </div>
        </div>

        <Chip
          label={`${jobs.length} Total`}
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

      {/* ── TWO-COLUMN BODY */}
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* ─── FORM CARD */}
        <motion.div
          initial={{ opacity: 0, x: -22 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          style={{ flex: "0 0 360px", ...glassPanel }}
        >
          <AmbientBlob top={-60} left={-40} size={220} />
          <AmbientBlob top={240} left={210} size={160} opacity={0.07} />

          <div style={{ position: "relative", zIndex: 1, padding: "26px 22px" }}>
            {/* form header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={isEditing ? "edit-icon" : "add-icon"}
                  initial={{ scale: 0.65, opacity: 0, rotate: -15 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.65, opacity: 0, rotate: 15 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 13,
                    flexShrink: 0,
                    background: isEditing ? "rgba(251,191,36,0.16)" : "rgba(255,255,255,0.12)",
                    border: `1px solid ${
                      isEditing ? "rgba(251,191,36,0.28)" : "rgba(255,255,255,0.18)"
                    }`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isEditing ? (
                    <EditRoundedIcon sx={{ color: "#fbbf24", fontSize: 20 }} />
                  ) : (
                    <AddRoundedIcon sx={{ color: "white", fontSize: 22 }} />
                  )}
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={isEditing ? "edit-text" : "add-text"}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.18 }}
                >
                  <Typography
                    sx={{
                      color: "white",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 700,
                      fontSize: 15,
                      lineHeight: 1.2,
                    }}
                  >
                    {isEditing ? "Edit Job" : "New Job"}
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.38)",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 11,
                    }}
                  >
                    {isEditing ? "Modify existing job post" : "Create a new job post"}
                  </Typography>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Fields */}
            <Typography
              sx={{
                color: "rgba(255,255,255,0.48)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10.5,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                mb: 1,
              }}
            >
              Job Title
            </Typography>
            <TextField
              value={isEditing ? editTitle : jobTitle}
              onChange={(e) => (isEditing ? setEditTitle(e.target.value) : setJobTitle(e.target.value))}
              placeholder="e.g. Frontend Developer"
              fullWidth
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeRoundedIcon sx={{ color: "rgba(255,255,255,0.32)", fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2.2, ...fieldSx }}
            />

            <Typography
              sx={{
                color: "rgba(255,255,255,0.48)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10.5,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                mb: 1,
              }}
            >
              Description
            </Typography>
            <TextField
              value={isEditing ? editDesc : jobDesc}
              onChange={(e) => (isEditing ? setEditDesc(e.target.value) : setJobDesc(e.target.value))}
              placeholder="Short description..."
              fullWidth
              multiline
              minRows={3}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1.2 }}>
                    <NotesRoundedIcon sx={{ color: "rgba(255,255,255,0.32)", fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2.2, ...fieldSx }}
            />

            <Typography
              sx={{
                color: "rgba(255,255,255,0.48)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10.5,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                mb: 1,
              }}
            >
              Job Type
            </Typography>
            <TextField
              select
              value={isEditing ? editTypeId : jobTypeId}
              onChange={(e) => (isEditing ? setEditTypeId(e.target.value) : setJobTypeId(e.target.value))}
              fullWidth
              sx={{ mb: 2.2, ...fieldSx }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <WorkRoundedIcon sx={{ color: "rgba(255,255,255,0.32)", fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="">-- Select --</MenuItem>
              {jobTypes.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.jobType_name}
                </MenuItem>
              ))}
            </TextField>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.48)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 10.5,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    mb: 1,
                  }}
                >
                  Company
                </Typography>
                <TextField
                  value={isEditing ? editCompany : companyName}
                  onChange={(e) =>
                    isEditing ? setEditCompany(e.target.value) : setCompanyName(e.target.value)
                  }
                  placeholder="Company name"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ApartmentRoundedIcon sx={{ color: "rgba(255,255,255,0.32)", fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 0, ...fieldSx }}
                />
              </div>

              <div>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.48)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 10.5,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    mb: 1,
                  }}
                >
                  Location
                </Typography>
                <TextField
                  value={isEditing ? editLocation : location}
                  onChange={(e) => (isEditing ? setEditLocation(e.target.value) : setLocation(e.target.value))}
                  placeholder="City / Remote"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PlaceRoundedIcon sx={{ color: "rgba(255,255,255,0.32)", fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 0, ...fieldSx }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
              <div>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.48)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 10.5,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    mb: 1,
                  }}
                >
                  Date
                </Typography>
                <TextField
                  type="date"
                  value={isEditing ? editDate : jobDate}
                  onChange={(e) => (isEditing ? setEditDate(e.target.value) : setJobDate(e.target.value))}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarMonthRoundedIcon
                          sx={{ color: "rgba(255,255,255,0.32)", fontSize: 18 }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    ...fieldSx,
                    "& input": { color: "white" },
                  }}
                />
              </div>

              <div>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.48)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 10.5,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    mb: 1,
                  }}
                >
                  Status
                </Typography>
                <TextField
                  select
                  value={isEditing ? editStatus : jobStatus}
                  onChange={(e) => (isEditing ? setEditStatus(e.target.value) : setJobStatus(e.target.value))}
                  fullWidth
                  sx={{ ...fieldSx }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ToggleOnRoundedIcon sx={{ color: "rgba(255,255,255,0.32)", fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value={1}>Active</MenuItem>
                  <MenuItem value={0}>Inactive</MenuItem>
                </TextField>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                disabled={saving || !canSave}
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 13,
                  cursor: "pointer",
                  border: `1px solid ${isEditing ? "rgba(251,191,36,0.28)" : "rgba(255,255,255,0.15)"}`,
                  background: isEditing
                    ? "linear-gradient(135deg, rgba(251,191,36,0.18), rgba(251,191,36,0.07))"
                    : "linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.06))",
                  color: isEditing ? "#fbbf24" : "white",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.12)",
                  opacity: saving || !canSave ? 0.45 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                {saving ? (
                  <CircularProgress size={15} sx={{ color: "inherit" }} />
                ) : isEditing ? (
                  <>
                    <CheckRoundedIcon style={{ fontSize: 16 }} /> Update
                  </>
                ) : (
                  <>
                    <AddRoundedIcon style={{ fontSize: 16 }} /> Save
                  </>
                )}
              </motion.button>

              <AnimatePresence>
                {isEditing && (
                  <motion.button
                    initial={{ opacity: 0, width: 0, scale: 0.8 }}
                    animate={{ opacity: 1, width: 44, scale: 1 }}
                    exit={{ opacity: 0, width: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    onClick={cancelEdit}
                    style={{
                      height: 44,
                      borderRadius: 13,
                      overflow: "hidden",
                      cursor: "pointer",
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.07)",
                      color: "rgba(255,255,255,0.55)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <CloseRoundedIcon style={{ fontSize: 18 }} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* ─── LIST CARD */}
        <motion.div
          initial={{ opacity: 0, x: 22 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          style={{ flex: 1, minWidth: 320, ...glassPanel }}
        >
          <AmbientBlob top={-40} right={-30} size={240} opacity={0.1} />

          <div style={{ position: "relative", zIndex: 1, padding: "26px 22px" }}>
            {/* toolbar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
                gap: 12,
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
                All Jobs
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
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon sx={{ color: "rgba(255,255,255,0.32)", fontSize: 16 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: 170,
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
                gridTemplateColumns: "44px 1.2fr 1fr 0.9fr 88px",
                padding: "7px 12px",
                marginBottom: 6,
                borderRadius: 10,
                background: "rgba(255,255,255,0.05)",
              }}
            >
              {["#", "Title", "Company / Type", "Location / Status", "Actions"].map((h, idx) => (
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
                gap: 5,
                maxHeight: 430,
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
                    {search ? "No results found" : "No jobs yet — add one!"}
                  </Typography>
                </motion.div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filtered.map((row, i) => {
                    const editingThis = editId === row.id;
                    const statusLabel = Number(row.job_status) === 1 ? "Active" : "Inactive";
                    const typeName = row.tbl_jobType?.jobType_name || "";
                    const company = row.job_companyName || "";

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
                          gridTemplateColumns: "44px 1.2fr 1fr 0.9fr 88px",
                          alignItems: "center",
                          padding: "10px 12px",
                          borderRadius: 14,
                          background: editingThis ? "rgba(251,191,36,0.08)" : "rgba(255,255,255,0.04)",
                          border: `1px solid ${
                            editingThis ? "rgba(251,191,36,0.20)" : "rgba(255,255,255,0.07)"
                          }`,
                          transition: "background 0.18s, border-color 0.18s",
                        }}
                        whileHover={
                          !editingThis
                            ? {
                                background: "rgba(255,255,255,0.07)",
                                borderColor: "rgba(255,255,255,0.12)",
                                transition: { duration: 0.14 },
                              }
                            : {}
                        }
                      >
                        {/* # */}
                        <div
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 8,
                            background: editingThis ? "rgba(251,191,36,0.14)" : "rgba(255,255,255,0.07)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: editingThis ? "#fbbf24" : "rgba(255,255,255,0.38)",
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: 11,
                              fontWeight: 700,
                            }}
                          >
                            {i + 1}
                          </Typography>
                        </div>

                        {/* Title + date */}
                        <div style={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              color: editingThis ? "#fbbf24" : "white",
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: 13.5,
                              fontWeight: editingThis ? 600 : 600,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              lineHeight: 1.2,
                            }}
                            title={row.job_title || ""}
                          >
                            {row.job_title}
                          </Typography>
                          <Typography
                            sx={{
                              color: "rgba(255,255,255,0.32)",
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: 11,
                              mt: 0.2,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={row.job_date || ""}
                          >
                            {row.job_date ? `Date: ${row.job_date}` : "Date: —"}
                          </Typography>
                        </div>

                        {/* Company / Type */}
                        <div style={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              color: "white",
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: 12.6,
                              fontWeight: 500,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={company}
                          >
                            {company || "—"}
                          </Typography>
                          <Typography
                            sx={{
                              color: "rgba(255,255,255,0.32)",
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: 11,
                              mt: 0.2,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={typeName}
                          >
                            {typeName ? `Type: ${typeName}` : "Type: —"}
                          </Typography>
                        </div>

                        {/* Location / Status */}
                        <div style={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              color: "white",
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: 12.6,
                              fontWeight: 500,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={row.job_location || ""}
                          >
                            {row.job_location || "—"}
                          </Typography>
                          <Typography
                            sx={{
                              color: Number(row.job_status) === 1 ? "rgba(110,231,183,0.85)" : "rgba(248,113,113,0.85)",
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: 11,
                              mt: 0.2,
                            }}
                          >
                            {statusLabel}
                          </Typography>
                        </div>

                        {/* actions */}
                        <div style={{ display: "flex", justifyContent: "center", gap: 5 }}>
                          <ActionBtn
                            tooltip="Edit"
                            color="#60a5fa"
                            bg="rgba(96,165,250,0.10)"
                            hoverBg="rgba(96,165,250,0.22)"
                            onClick={() => startEdit(row)}
                            disabled={false}
                          >
                            <EditRoundedIcon />
                          </ActionBtn>

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
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </div>
        </motion.div>
      </div>

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

export default AddJob;