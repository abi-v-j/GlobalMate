import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import NavBar from "../../Components/NavBar/Navbar";
import SideBar from "../../Components/SideBar/SideBar";
import AdminRouter from "../../../Routers/AdminRouter";

export const AdminHomePage = () => (
  <Box
    sx={{
      height: "100vh",
      background:
        "radial-gradient(1100px 500px at 20% 0%, rgba(10,50,80,0.12), transparent 55%)," +
        "linear-gradient(135deg, #f3f7fb 0%, #dfeaf2 100%)",
      overflow: "hidden",
      fontFamily: "'DM Sans', sans-serif",
    }}
  >
    {/* ✅ Single container for perfect alignment */}
    <Box sx={{ px: { xs: 2, md: 3 }, pt: { xs: 2, md: 3 }, height: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
      <NavBar />

      <Box sx={{ flex: 1, display: "flex", gap: 2, overflow: "hidden" }}>
        {/* MAIN */}
        <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            style={{ height: "93%", display: "flex" }}
          >
            <Box
              sx={{
                flex: 1,
                borderRadius: "22px",
                background: "rgba(255,255,255,0.72)",
                backdropFilter: "blur(18px)",
                border: "1px solid rgba(255,255,255,0.9)",
                boxShadow: "0 18px 60px rgba(10,50,80,0.12)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* ✅ Content header (adds premium feel) */}
              <Box
                sx={{
                  px: 3,
                  py: 2,
                  borderBottom: "1px solid rgba(10,50,80,0.06)",
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: 16, color: "#0a3250" }}>
                    Admin Dashboard
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "rgba(10,50,80,0.55)", mt: 0.3 }}>
                    Home / Admin / Dashboard
                  </Typography>
                </Box>

                {/* right small status */}
                <Box
                  sx={{
                    fontSize: 12,
                    px: 1.2,
                    py: 0.6,
                    borderRadius: 99,
                    background: "rgba(10,50,80,0.06)",
                    color: "rgba(10,50,80,0.7)",
                  }}
                >
                  Live Mode
                </Box>
              </Box>

              {/* ✅ Routes scroll here */}
              <Box
                sx={{
                  flex: 1,
                  p: 2.5,
                  overflow: "auto",
                  "&::-webkit-scrollbar": { width: 8 },
                  "&::-webkit-scrollbar-thumb": {
                    background: "rgba(10,50,80,0.18)",
                    borderRadius: 10,
                  },
                }}
              >
                <AdminRouter />
              </Box>
            </Box>
          </motion.div>
        </Box>

        {/* SIDEBAR */}
        <SideBar />
      </Box>
    </Box>
  </Box>
);

export default AdminHomePage;