import React, { useState } from "react";
import axios from "axios";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  Link,
  Grid,
  ThemeProvider,
  createTheme,
  Alert,
  Snackbar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { red } from "@mui/material/colors";
import Visibility from "@mui/icons-material/Visibility";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../auth/AuthContext";
import ThemeContext from "../theme/ThemeContext";

export default function LoginPage() {
  const { toggleMode, mode } = useContext(ThemeContext);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  //Themese
  const theme = createTheme({
    palette: {
      mode: mode,
      primary: {
        main: "#ef233c",
      },
      error: red,
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Username and password cannot be empty.");
      handleOpen();
      return;
    }

    setError("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/login`,
        {
          username,
          password,
        }
      );
      login(res.data.token);
      navigate("/");
    } catch (error) {
      setError("Invalid Username or Password!");
      console.error({ message: "Invalid username or password!" });
      handleOpen();
    }
  };

  const handleReset = () => {
    setUsername("");
    setPassword("");
    setShowPassword(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //Test

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 1300,
          bgcolor: "background.paper",
          borderRadius: "50%",
          boxShadow: 3,
        }}
      >
        <IconButton onClick={toggleMode} color="inherit" size="large">
          {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Box>

      <Snackbar
        open={open}
        autoHideDuration={1000}
        onClose={handleClose}
        message={error}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h4" fontWeight="500">
            Sign In
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, mb: 3 }}
          >
            Welcome back. Please enter your credentials.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />

            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ py: 1.5 }}
                >
                  Sign In
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={handleReset}
                  sx={{ py: 1.5 }}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 8, mb: 4 }}
        >
          © {new Date().getFullYear()} Z Dev. All rights reserved.
        </Typography>
      </Container>
    </Container>
  );
}
