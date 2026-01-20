import { Box, Tab, Tabs, Typography, Paper } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import React from "react";
import DailyReport from "../components/reports/DailyReport";
import MonthlyReport from "../components/reports/MonthlyReport";
import OtherReport from "../components/reports/OtherReport";

export default function ReportPage() {
  const [value, setValue] = React.useState("dailysales");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          fontWeight="700"
          color="primary"
          sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
        >
          <AssessmentIcon sx={{ fontSize: 36 }} />
          Reports
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          View sales and performance reports
        </Typography>
      </Box>

      {/* MAIN CONTENT */}
      <Paper
        sx={{
          p: 2,
          borderRadius: 3,
          backgroundColor: "background.paper",
        }}
      >
        {/* TABS */}
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{
            mb: 3,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
            },
          }}
        >
          <Tab value="dailysales" label="Daily Sales" />
          <Tab value="monthlysales" label="Monthly Sales" />
          <Tab value="other" label="Other Reports" />
        </Tabs>

        {/* TAB CONTENT */}
        <Box>
          {value === "dailysales" && <DailyReport />}
          {value === "monthlysales" && <MonthlyReport />}
          {value === "other" && <OtherReport />}
        </Box>
      </Paper>
    </Box>
  );
}
