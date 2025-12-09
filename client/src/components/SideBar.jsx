import React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Link } from "react-router-dom";

const sidebarWidth = 240;

const Sidebar = ({ open }) => {
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Users", icon: <PeopleIcon />, path: "/users" },
    { text: "Products", icon: <InventoryIcon />, path: "/products" },
    { text: "Categories", icon: <CategoryIcon />, path: "/categories" },
    { text: "Brands", icon: <BrandingWatermarkIcon />, path: "/brands" },
    { text: "Sales", icon: <AttachMoneyIcon />, path: "/sales" },
  ];

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        zIndex: 0,
        width: sidebarWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: sidebarWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <List sx={{ mt: 8 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text}>
            <ListItemButton component={Link} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
