import React, { useEffect, useState } from "react";
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
import { getAllSales } from "../api/salesApi";

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

  const [now, setNow] = useState(new Date());
  const [saleData, setSaleData] = useState([]);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch sales data
  useEffect(() => {
    async function fetchSalesData() {
      try {
        const data = await getAllSales();
        setSaleData(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchSalesData();
  }, []);

  //Get current day/month
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  //Filter day sales
  const todayItems = saleData.filter((items) => {
    const date = new Date(items.createdAt);
    return (
      date.getDate() === currentDay &&
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    );
  });

  //Calculate net sales for current day
  const totalDaySale = todayItems.reduce((sum, item) => {
    return sum + item.final_total;
  }, 0);

  //Calculate net cost for current day
  const totalDayCost = todayItems.reduce((sum, item) => {
    return sum + item.final_cost;
  }, 0);

  //Calculate total month revenue
  const totalDayRevenue = totalDaySale - totalDayCost;

  //Filter month sales
  const monthItems = saleData.filter((items) => {
    const date = new Date(items.createdAt);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  });

  //Calculate net sales for current month
  const totalMonthSale = monthItems.reduce((sum, item) => {
    return sum + item.final_total;
  }, 0);

  //Calculate net cost for current month
  const totalMonthCost = monthItems.reduce((sum, item) => {
    return sum + item.final_cost;
  }, 0);

  //Calculate total month revenue
  const totalMonthRevenue = totalMonthSale - totalMonthCost;

  //Calculate last 30 days sales and revenue

  //Find last 30 days
  const last30Days = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d;
  });

  //Find last 30 days sales
  const last30DaysSales = last30Days.map((day) => {
    const dateStr = day.toLocaleDateString();
    const total = saleData
      .filter((s) => new Date(s.createdAt).toLocaleDateString() === dateStr)
      .reduce((acc, s) => acc + s.final_total, 0);
    return { date: dateStr, sales: total };
  });

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
          <Typography variant="subtitle1" mb={4} sx={{ fontWeight: "bold" }}>
            {now.toLocaleDateString()} | {now.toLocaleTimeString()}
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3} mb={8}>
          {/* Today's Metrics */}
          <Grid sx={{ xs: 12, md: 6, lg: 4, minWidth: 320 }}>
            <StatCard
              title="Today Sale Count"
              value={todayItems?.length || 0}
              subtitle="Total transactions today"
              icon={ShoppingCart}
              iconColor={theme.palette.error.main}
              iconBg={`${theme.palette.error.main}20`}
            />
          </Grid>

          <Grid sx={{ xs: 12, md: 6, lg: 4, minWidth: 320 }}>
            <StatCard
              title="Today Sales"
              value={`Rs. ${totalDaySale}`}
              subtitle="Total sales amount"
              icon={AttachMoney}
              iconColor={theme.palette.error.main}
              iconBg={`${theme.palette.error.main}20`}
            />
          </Grid>

          <Grid sx={{ xs: 12, md: 6, lg: 4, minWidth: 320 }}>
            <StatCard
              title="Today Revenue"
              value={`Rs. ${totalDayRevenue.toFixed(2)}`}
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
              value={monthItems?.length || 0}
              subtitle="Total transactions this month"
              icon={ShoppingCart}
              iconColor={theme.palette.success.main}
              iconBg={`${theme.palette.success.main}20`}
            />
          </Grid>

          <Grid sx={{ xs: 12, md: 6, lg: 4, minWidth: 320 }}>
            <StatCard
              title="Monthly Sales"
              value={`Rs. ${totalMonthSale}`}
              subtitle="Total sales this month"
              icon={AttachMoney}
              iconColor={theme.palette.success.main}
              iconBg={`${theme.palette.success.main}20`}
            />
          </Grid>

          <Grid sx={{ xs: 12, md: 6, lg: 4, minWidth: 320 }}>
            <StatCard
              title="Monthly Revenue"
              value={`Rs. ${totalMonthRevenue.toFixed(2)}`}
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
            Last 30 Day Sales
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={last30DaysSales}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.palette.divider}
              />
              <XAxis
                dataKey="date"
                fontSize={10}
                stroke={theme.palette.text.secondary}
              />
              <YAxis fontSize={10} stroke={theme.palette.text.secondary} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                stroke={theme.palette.error.main}
                strokeWidth={3}
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
