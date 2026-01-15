import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Switch from "@mui/material/Switch";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import AuthContext from "../auth/AuthContext";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTheme, useMediaQuery } from "@mui/material";

const Navbar = ({ toggleSidebar, toggleMode, mode }) => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate("/login");
  };

  return (
    <>
      <AppBar position="fixed" sx={{ height: isMobile ? 56 : 64 }}>
        <Toolbar>
          {user && user.role === "admin" && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleSidebar}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {isMobile
              ? "TSM POS"
              : `TSM POS SYSTEM | ${
                  user.role === "admin" ? "ADMIN PANEL" : "CASHIER PANEL"
                }`}
          </Typography>
          <IconButton color="inherit" onClick={toggleMode}>
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {!isMobile && (
            <Switch
              checked={mode === "dark"}
              onChange={toggleMode}
              color="default"
            />
          )}
          <Avatar
            sx={{
              ml: 2,
              cursor: "pointer",
              width: isMobile ? 40 : 32,
              height: isMobile ? 40 : 32,
            }}
            onClick={handleClick}
          >
            {user?.username?.[0]?.toUpperCase() || "N"}
          </Avatar>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;
