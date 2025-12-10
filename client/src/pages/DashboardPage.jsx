import React from "react";
import { Box, Grid, Typography, Paper, useTheme } from "@mui/material";
import { ShoppingCart, AttachMoney, TrendingUp } from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        display: "flex",
        alignItems: "center",
        gap: 2,
        borderRadius: 2,
        bgcolor: "background.paper",
        color: "text.primary",
      }}
    >
      <Box
        sx={{
          backgroundColor: iconBg,
          color: iconColor,
          borderRadius: "50%",
          p: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon fontSize="large" />
      </Box>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h6" fontWeight="bold">
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>
    </Paper>
  );
};

const Dashboard = ({ chartData }) => {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: "100vh", px: 2, bgcolor: "background.default" }}>
      <Box maxWidth="1200px" mx="auto">
        {/* Header */}
        <Box mb={8}>
          <Typography
            variant="h3"
            fontWeight="700"
            color="primary"
            sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
          >
            Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" mt={1}>
            Monitor your sales performance in real-time
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3} mb={8}>
          {/* Today's Metrics */}
          <Grid sx={{ xs: 12, md: 6, lg: 4, minWidth: 320 }}>
            <StatCard
              title="Today Sale Count"
              value="Total Transaction"
              subtitle="Total transactions today"
              icon={ShoppingCart}
              iconColor={theme.palette.error.main}
              iconBg={`${theme.palette.error.main}20`}
            />
          </Grid>

          <Grid sx={{ xs: 12, md: 6, lg: 4, minWidth: 320 }}>
            <StatCard
              title="Today Sales"
              value="Today Sales"
              subtitle="Total sales amount"
              icon={AttachMoney}
              iconColor={theme.palette.error.main}
              iconBg={`${theme.palette.error.main}20`}
            />
          </Grid>

          <Grid sx={{ xs: 12, md: 6, lg: 4, minWidth: 320 }}>
            <StatCard
              title="Today Revenue"
              value="Today Revenue"
              subtitle="Net revenue today"
              icon={TrendingUp}
              iconColor={theme.palette.error.main}
              iconBg={`${theme.palette.error.main}20`}
            />
          </Grid>

          {/* Monthly Metrics */}
          <Grid sx={{ xs: 12, md: 6, lg: 4, minWidth: 320 }}>
            <StatCard
              title="Monthly Sale Count"
              value="Sale Count"
              subtitle="Total transactions this month"
              icon={ShoppingCart}
              iconColor={theme.palette.success.main}
              iconBg={`${theme.palette.success.main}20`}
            />
          </Grid>

          <Grid sx={{ xs: 12, md: 6, lg: 4, minWidth: 320 }}>
            <StatCard
              title="Monthly Sales"
              value="Monthly Sales"
              subtitle="Total sales this month"
              icon={AttachMoney}
              iconColor={theme.palette.success.main}
              iconBg={`${theme.palette.success.main}20`}
            />
          </Grid>

          <Grid sx={{ xs: 12, md: 6, lg: 4, minWidth: 320 }}>
            <StatCard
              title="Monthly Revenue"
              value="Monthly Revenue"
              subtitle="Net revenue this month"
              icon={TrendingUp}
              iconColor={theme.palette.success.main}
              iconBg={`${theme.palette.success.main}20`}
            />
          </Grid>
        </Grid>

        {/* Line Chart */}
        <Paper
          elevation={3}
          sx={{ p: 4, borderRadius: 2, bgcolor: "background.paper" }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            mb={3}
            color="text.primary"
          >
            Weekly Sales & Revenue Trend
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.palette.divider}
              />
              <XAxis dataKey="day" stroke={theme.palette.text.secondary} />
              <YAxis yAxisId="left" stroke={theme.palette.text.secondary} />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke={theme.palette.text.secondary}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 8,
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: 20,
                  color: theme.palette.text.primary,
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sales"
                stroke={theme.palette.error.main}
                strokeWidth={3}
                name="Sales ($)"
                dot={{ fill: theme.palette.error.main, r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke={theme.palette.success.main}
                strokeWidth={3}
                name="Revenue ($)"
                dot={{ fill: theme.palette.success.main, r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;
