import React, { useEffect, useState } from "react";
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

import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SourceRoundedIcon from "@mui/icons-material/SourceRounded";

// ── glass panel base style (same as your ExpenseCategory)
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

// ── row animation (same feel)
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

const IncomeSource = () => {
  const TABLE = "tbl_incSource";
  const COL = "incSource_name"; // ensure this matches DB column

  const [value, setValue] = useState("");
  const [rows, setRows] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ open: false, msg: "", type: "success" });

  const notify = (msg, type = "success") => setToast({ open: true, msg, type });

  /* ── READ */
  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("id", { ascending: false });

    if (!error) setRows(data || []);
    else notify("Load failed.", "error");

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  /* ── CREATE / UPDATE */
  const handleSave = async () => {
    if (editId) {
      if (!editName.trim()) return;

      setSaving(true);
      const { error } = await supabase
        .from(TABLE)
        .update({ [COL]: editName.trim() })
        .eq("id", editId);

      if (!error) {
        notify("Income source updated!");
        cancelEdit();
        await load();
      } else {
        notify("Update failed.", "error");
      }
      setSaving(false);
    } else {
      if (!value.trim()) return;

      setSaving(true);
      const { error } = await supabase.from(TABLE).insert([{ [COL]: value.trim() }]);

      if (!error) {
        notify("Income source saved!");
        setValue("");
        await load();
      } else {
        notify("Insert failed.", "error");
      }
      setSaving(false);
    }
  };

  /* ── EDIT helpers */
  const startEdit = (row) => {
    setEditId(row.id);
    setEditName(row[COL] || "");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
  };

  /* ── DELETE */
  const handleDelete = async (id) => {
    setDeletingId(id);
    const { error } = await supabase.from(TABLE).delete().eq("id", id);

    if (!error) {
      notify("Deleted.", "info");
      await load();
    } else {
      notify("Delete failed.", "error");
    }
    setDeletingId(null);
  };

  const filtered = rows.filter((r) =>
    (r[COL] || "").toLowerCase().includes(search.toLowerCase())
  );

  // shared TextField sx (same as your ExpenseCategory)
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
            <AccountBalanceWalletRoundedIcon sx={{ color: "white", fontSize: 22 }} />
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
              Income Source
            </Typography>
            <Typography
              sx={{
                fontSize: 12.5,
                color: "rgba(10,50,80,0.48)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Create, edit and manage income sources
            </Typography>
          </div>
        </div>

        <Chip
          label={`${rows.length} Total`}
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
        {/* ─── ADD / EDIT FORM CARD */}
        <motion.div
          initial={{ opacity: 0, x: -22 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          style={{ flex: "0 0 300px", ...glassPanel }}
        >
          <AmbientBlob top={-60} left={-40} size={220} />
          <AmbientBlob top={210} left={180} size={160} opacity={0.07} />

          <div style={{ position: "relative", zIndex: 1, padding: "26px 22px" }}>
            {/* form header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={editId ? "edit-icon" : "add-icon"}
                  initial={{ scale: 0.65, opacity: 0, rotate: -15 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.65, opacity: 0, rotate: 15 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 13,
                    flexShrink: 0,
                    background: editId ? "rgba(251,191,36,0.16)" : "rgba(255,255,255,0.12)",
                    border: `1px solid ${
                      editId ? "rgba(251,191,36,0.28)" : "rgba(255,255,255,0.18)"
                    }`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {editId ? (
                    <EditRoundedIcon sx={{ color: "#fbbf24", fontSize: 20 }} />
                  ) : (
                    <AddRoundedIcon sx={{ color: "white", fontSize: 22 }} />
                  )}
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={editId ? "edit-text" : "add-text"}
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
                    {editId ? "Edit Income Source" : "New Income Source"}
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.38)",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 11,
                    }}
                  >
                    {editId ? "Modify existing entry" : "Add a new income source"}
                  </Typography>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* label */}
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
              Income Source Name
            </Typography>

            {/* input */}
            <TextField
              value={editId ? editName : value}
              variant="outlined"
              placeholder={editId ? "Edit income source…" : "e.g. Salary, Freelance…"}
              onChange={(e) => (editId ? setEditName(e.target.value) : setValue(e.target.value))}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SourceRoundedIcon sx={{ color: "rgba(255,255,255,0.32)", fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2.5, ...fieldSx }}
            />

            {/* action row */}
            <div style={{ display: "flex", gap: 8 }}>
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                disabled={saving || (editId ? !editName.trim() : !value.trim())}
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 13,
                  cursor: "pointer",
                  border: `1px solid ${
                    editId ? "rgba(251,191,36,0.28)" : "rgba(255,255,255,0.15)"
                  }`,
                  background: editId
                    ? "linear-gradient(135deg, rgba(251,191,36,0.18), rgba(251,191,36,0.07))"
                    : "linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.06))",
                  color: editId ? "#fbbf24" : "white",
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
                  opacity:
                    (editId ? !editName.trim() : !value.trim()) || saving ? 0.45 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                {saving ? (
                  <CircularProgress size={15} sx={{ color: "inherit" }} />
                ) : editId ? (
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
                {editId && (
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

        {/* ─── TABLE CARD */}
        <motion.div
          initial={{ opacity: 0, x: 22 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          style={{ flex: 1, minWidth: 300, ...glassPanel }}
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
                All Income Sources
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
                  width: 150,
                  ...fieldSx,
                  "& .MuiOutlinedInput-root": { ...fieldSx["& .MuiOutlinedInput-root"], height: 36 },
                }}
              />
            </div>

            {/* header bar */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "44px 1fr 80px",
                padding: "7px 12px",
                marginBottom: 6,
                borderRadius: 10,
                background: "rgba(255,255,255,0.05)",
              }}
            >
              {["#", "Income Source Name", "Actions"].map((h, idx) => (
                <Typography
                  key={h}
                  sx={{
                    color: "rgba(255,255,255,0.32)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.13em",
                    textTransform: "uppercase",
                    textAlign: idx === 2 ? "center" : "left",
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
                maxHeight: 400,
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
                    {search ? "No results found" : "No income sources yet — add one!"}
                  </Typography>
                </motion.div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filtered.map((row, i) => {
                    const isEditing = editId === row.id;

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
                          gridTemplateColumns: "44px 1fr 80px",
                          alignItems: "center",
                          padding: "10px 12px",
                          borderRadius: 14,
                          background: isEditing ? "rgba(251,191,36,0.08)" : "rgba(255,255,255,0.04)",
                          border: `1px solid ${
                            isEditing ? "rgba(251,191,36,0.20)" : "rgba(255,255,255,0.07)"
                          }`,
                          transition: "background 0.18s, border-color 0.18s",
                        }}
                        whileHover={
                          !isEditing
                            ? {
                                background: "rgba(255,255,255,0.07)",
                                borderColor: "rgba(255,255,255,0.12)",
                                transition: { duration: 0.14 },
                              }
                            : {}
                        }
                      >
                        {/* serial */}
                        <div
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 8,
                            background: isEditing ? "rgba(251,191,36,0.14)" : "rgba(255,255,255,0.07)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: isEditing ? "#fbbf24" : "rgba(255,255,255,0.38)",
                              fontFamily: "'DM Sans', sans-serif",
                              fontSize: 11,
                              fontWeight: 700,
                            }}
                          >
                            {i + 1}
                          </Typography>
                        </div>

                        {/* name */}
                        <Typography
                          sx={{
                            color: isEditing ? "#fbbf24" : "white",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: 13.5,
                            fontWeight: isEditing ? 600 : 500,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            transition: "color 0.18s",
                          }}
                        >
                          {row[COL]}
                        </Typography>

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

export default IncomeSource;