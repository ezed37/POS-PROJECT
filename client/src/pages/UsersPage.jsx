import { useEffect, useState, useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Avatar,
  Stack,
  InputAdornment,
  Fade,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";
import { addUser, deleteUser, getUsers, updateUser } from "../api/usersApi";
import ThemeContext from "../theme/ThemeContext";

function UsersPage() {
  const { mode } = useContext(ThemeContext);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [alerts, setAlerts] = useState({
    open: false,
    type: "success",
    msg: "",
  });

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "cashier",
  });

  const [editUser, setEditUser] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "cashier",
    password: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getUsers();
        setUsers(data.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      (u.firstName?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (u.email?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async () => {
    try {
      const response = await addUser(newUser);
      setUsers((prev) => [...prev, response.data]);
      setNewUser({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "cashier",
      });
      setAddUserDialogOpen(false);
      setAlerts({
        open: true,
        type: "success",
        msg: "User added successfully!",
      });
    } catch (err) {
      console.error("Error adding user:", err);
      setAlerts({ open: true, type: "error", msg: "Failed to add user!" });
    }
  };

  const handleDelete = async (userId) => {
    const userToDelete = users.find((u) => u._id === userId);
    const adminCount = users.filter((u) => u.role === "admin").length;

    if (userToDelete.role === "admin" && adminCount === 1) {
      setAlerts({
        open: true,
        type: "error",
        msg: "Cannot delete the last admin user!",
      });
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      setAlerts({
        open: true,
        type: "success",
        msg: "User deleted successfully!",
      });
    } catch (err) {
      console.error("Error deleting user:", err);
      setAlerts({ open: true, type: "error", msg: "Failed to delete user!" });
    }
  };

  const openUpdateDialog = (user) => {
    setEditUser({ ...user, password: "" });
    setUpdateDialogOpen(true);
  };

  const closeUpdateDialog = () => setUpdateDialogOpen(false);

  const handleUpdateSubmit = async () => {
    try {
      await updateUser(editUser._id, editUser);
      setUsers((prev) =>
        prev.map((u) => (u._id === editUser._id ? editUser : u))
      );
      setAlerts({
        open: true,
        type: "success",
        msg: "User updated successfully!",
      });
      closeUpdateDialog();
    } catch (err) {
      console.error(err);
      setAlerts({ open: true, type: "error", msg: "Failed to update user!" });
    }
  };

  const openAddDialog = () => setAddUserDialogOpen(true);
  const closeAddDialog = () => setAddUserDialogOpen(false);

  const getRoleColor = (role) => (role === "admin" ? "error" : "primary");
  const getInitials = (firstName, lastName) =>
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "background.default",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          color="primary"
          sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
        >
          <PersonIcon sx={{ fontSize: 36 }} />
          Users Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your team members and their access levels
        </Typography>
      </Box>

      {/* Action Card */}
      <Fade in timeout={500}>
        <Card
          elevation={0}
          sx={{
            mb: 4,
            borderRadius: 3,
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: "common.white",
          }}
        >
          <CardContent
            sx={{
              p: 3,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                Add New Team Member
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Create user accounts for cashiers and administrators
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openAddDialog}
              sx={{
                backgroundColor: "common.white",
                color: "primary.main",
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: mode === "light" ? "#f8f9fa" : "#333",
                  transform: "translateY(-2px)",
                  boxShadow: 4,
                },
                transition: "all 0.3s",
              }}
            >
              Add User
            </Button>
          </CardContent>
        </Card>
      </Fade>

      {/* Search and Table */}
      <Fade in timeout={700}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Box sx={{ p: 3, backgroundColor: "background.paper" }}>
            <TextField
              placeholder="Search by name or email..."
              variant="outlined"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: "action.hover",
                  "&:hover": {
                    backgroundColor: "action.selected",
                  },
                },
              }}
            />
          </Box>

          <Divider />

          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {["User", "Email", "Phone", "Role", "Actions"].map(
                    (header) => (
                      <TableCell
                        key={header}
                        sx={{
                          fontWeight: 700,
                          backgroundColor: "action.hover",
                          color: "text.primary",
                        }}
                      >
                        {header}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user._id}
                    hover
                    sx={{
                      "&:hover": { backgroundColor: "action.hover" },
                      transition: "all 0.2s",
                    }}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor:
                              getRoleColor(user.role) === "error"
                                ? "error.main"
                                : "primary.main",
                            fontWeight: 600,
                          }}
                        >
                          {getInitials(user.firstName, user.lastName)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight={600}>
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            @{user.username || "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="body2">{user.email}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <PhoneIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {user.phone || "N/A"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role.toUpperCase()}
                        color={getRoleColor(user.role)}
                        size="small"
                        sx={{ fontWeight: 600, borderRadius: 1.5 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => openUpdateDialog(user)}
                          sx={{
                            "&:hover": { backgroundColor: "action.hover" },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDelete(user._id)}
                          sx={{
                            "&:hover": { backgroundColor: "action.hover" },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredUsers.length === 0 && (
            <Box sx={{ p: 6, textAlign: "center" }}>
              <PersonIcon
                sx={{ fontSize: 64, color: "action.disabled", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                No users found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search criteria
              </Typography>
            </Box>
          )}
        </Paper>
      </Fade>

      <Snackbar
        open={alerts.open}
        autoHideDuration={4000}
        onClose={() => setAlerts({ ...alerts, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setAlerts({ ...alerts, open: false })}
          severity={alerts.type}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {alerts.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default UsersPage;
