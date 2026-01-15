import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Box from "@mui/material/Box";
import Navbar from "../components/NavBar";
import Sidebar from "../components/SideBar";
import DashboardPage from "./DashboardPage.jsx";
import { useContext, useEffect } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import ThemeContext from "../theme/ThemeContext.jsx";
import AuthContext from "../auth/AuthContext.jsx";
import UsersPage from "./UsersPage.jsx";
import ProductsPage from "./ProductsPage.jsx";
import CategoriesPage from "./CategoriesPage.jsx";
import BrandsPage from "./BrandsPage.jsx";
import SalesPage from "./SalesPage.jsx";

const drawerWidth = 240;
const collapsedWidth = 70;

export default function AdminPage() {
  const { user } = useContext(AuthContext);
  const { toggleMode, mode } = useContext(ThemeContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "background.default",
        color: "text.primary",
        minHeight: "100vh",
      }}
    >
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        isMobile={isMobile}
      />
      <Box
        sx={{
          flexGrow: 1,
          transition: "margin-left 0.3s",
          marginLeft: isMobile
            ? 0
            : sidebarOpen
            ? `${drawerWidth}px`
            : `${collapsedWidth}px`,
        }}
      >
        <Navbar
          toggleSidebar={toggleSidebar}
          toggleMode={toggleMode}
          mode={mode}
        />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
          <Routes>
            {user ? (
              <>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/brands" element={<BrandsPage />} />
                <Route path="/sales" element={<SalesPage />} />
              </>
            ) : (
              <Route path="/*" element={<Login />} />
            )}
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}
