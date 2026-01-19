import { Box, Button, Typography } from "@mui/material";
import axios from "axios";

export default function ReportPage() {
  const handleDailySales = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/reports`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const file = new Blob([response.data], {
        type: "application/pdf",
      });

      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank");
    } catch (error) {
      console.error("PDF generation failed", error);
    }
  };

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h4">Reports</Typography>
      <Button variant="contained" onClick={handleDailySales}>
        Print Daily Sales Report
      </Button>
    </Box>
  );
}
