import React, { createContext, useState, useMemo } from "react";
import { createTheme, ThemeProvider } from "@mui/material";

const ThemeContext = createContext();

export const ThemeProviderCustom = ({ children }) => {
  const [mode, setMode] = useState("light"); // default mode

  // toggle function
  const toggleMode = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));

  // create MUI theme based on mode
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                primary: { main: "#ef233c" },
                error: { main: "#ff001eff" },
                background: {
                  default: "#f9fafb",
                  paper: "#fff",
                },
                text: {
                  primary: "#111827",
                  secondary: "#6b7280",
                },
              }
            : {
                primary: { main: "#ef233c" },
                error: { main: "#ff001eff" },
                background: {
                  default: "#121212",
                  paper: "#1e1e1e",
                },
                text: {
                  primary: "#f9fafb",
                  secondary: "#9ca3af",
                },
              }),
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
