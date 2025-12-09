import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Switch from "@mui/material/Switch";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const Navbar = ({ toggleSidebar, toggleMode, mode }) => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          POS SYSTEM | ADMIN PANEL
        </Typography>
        <IconButton color="inherit" onClick={toggleMode}>
          {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <Switch
          checked={mode === "dark"}
          onChange={toggleMode}
          color="default"
        />
        <Avatar alt="User Avatar" src="" sx={{ ml: 2 }} />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
