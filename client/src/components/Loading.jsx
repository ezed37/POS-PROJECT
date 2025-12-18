import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

export default function Loading() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
      }}
    >
      <CircularProgress size={40} sx={{ color: "#ef233c" }} />

      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          letterSpacing: "0.5px",
        }}
      >
        Please wait
      </Typography>
    </Box>
  );
}
