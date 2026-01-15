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
import AssessmentIcon from "@mui/icons-material/Assessment";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Link } from "react-router-dom";

const fullWidth = 240;
const collapsedWidth = 70;

const Sidebar = ({ open, setOpen, isMobile }) => {
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Users", icon: <PeopleIcon />, path: "/users" },
    { text: "Products", icon: <InventoryIcon />, path: "/products" },
    { text: "Categories", icon: <CategoryIcon />, path: "/categories" },
    { text: "Brands", icon: <BrandingWatermarkIcon />, path: "/brands" },
    { text: "Sales", icon: <AttachMoneyIcon />, path: "/sales" },
    { text: "Reports", icon: <AssessmentIcon />, path: "/reports" },
  ];

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        width: open ? fullWidth : collapsedWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? fullWidth : collapsedWidth,
          transition: "width 0.3s",
          overflowX: "hidden",
          boxSizing: "border-box",
          mt: 8,
        },
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text}>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, minHeight: 40, pl: 2 }}>
                {item.icon}
              </ListItemIcon>
              {open && <ListItemText primary={item.text} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
