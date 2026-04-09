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
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import { Link } from "react-router-dom";
import { Toolbar } from "@mui/material";

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
    { text: "Customers", icon: <EmojiPeopleIcon />, path: "/customers" },
  ];

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        width: isMobile ? fullWidth : open ? fullWidth : collapsedWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isMobile ? fullWidth : open ? fullWidth : collapsedWidth,
          transition: "width 0.3s",
          overflowX: "hidden",
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  justifyContent: "center",
                  pl: open ? 2 : 0,
                }}
              >
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
