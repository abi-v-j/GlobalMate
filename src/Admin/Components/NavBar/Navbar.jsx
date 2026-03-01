import { Box } from "@mui/material";
import { motion } from "framer-motion";

const NavBar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: "100%" }}
    >
      <Box
        sx={{
          borderRadius: "20px",
          background: "linear-gradient(135deg, #0A3250 0%, #1a6090 60%, #0d4a70 100%)",
          p: { xs: "18px 18px", md: "22px 28px" },   // ✅ reduced padding
          mx: { xs: 1.5, md: 2 },                    // ✅ reduced margin
          mt: { xs: 1.5, md: 2 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 20px 60px rgba(10,50,80,0.25)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <Box sx={{ position: "absolute", top: -30, right: 80, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <Box sx={{ position: "absolute", bottom: -40, right: 20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

        {/* left title */}
        <Box>
          <Box
            component="h1"
            sx={{
              m: 0,
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(26px, 3vw, 44px)",
              fontWeight: 800,
              color: "white",
              letterSpacing: "0.02em",
              lineHeight: 1.15,
            }}
          >
            GlobalMate
          </Box>
          <Box
            component="p"
            sx={{
              m: 0,
              mt: 0.5,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12.5,
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Administration Console
          </Box>
        </Box>

        {/* right live */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, zIndex: 1 }}>
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80" }}
          />
          <Box component="span" sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
            Live
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default NavBar;