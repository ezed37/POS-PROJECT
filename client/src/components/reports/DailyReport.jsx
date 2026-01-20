import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getAllSales } from "../../api/salesApi";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";

//Columns for Daily Sales Report Table
const d_columns = [
  { id: "no", label: "No." },
  { id: "item", label: "Item Name" },
  { id: "unit_cost", label: "Unit Cost (Rs)" },
  { id: "unit_sell", label: "Unit Sell (Rs)" },
  { id: "sold_units", label: "Sold Units" },
  { id: "tot_cost", label: "Total Cost (Rs)" },
  { id: "tot_sell", label: "Total Sell (Rs)" },
  { id: "rev_item", label: "Rev. Per Item (Rs)" },
];

export default function DailyReport() {
  const theme = useTheme();

  const [salesData, setSalesData] = useState([]);

  //Load the sales data
  useEffect(() => {
    async function getSalesData() {
      try {
        const data = await getAllSales();
        setSalesData(data);
      } catch (error) {
        console.error(error);
      }
    }
    getSalesData();
  }, []);

  //Filter current day sales
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const todaySales = salesData?.filter((sales) => {
    const salesD = new Date(sales.createdAt);
    return salesD >= startOfDay && salesD <= endOfDay;
  });

  //Count total selling items for each item in the day
  const dayItemSummery = {};

  todaySales.forEach((sale) => {
    sale.items.forEach((item) => {
      const productId = item.product_id;

      if (!dayItemSummery[productId]) {
        dayItemSummery[productId] = {
          productId: productId,
          productName: item.product_name,
          totalQty: 0,
          costPrice: item.cost_price,
          sellPrice: item.selling_price,
          revPerProd: (item.selling_price - item.cost_price).toFixed(2),
          totCost: (item.cost_price * item.qty).toFixed(2),
          totSell: (item.selling_price * item.qty).toFixed(2),
          totRev: (item.selling_price - item.cost_price) * item.qty,
        };
      }
      dayItemSummery[productId].totalQty += item.qty;
    });
  });

  const subRevenue = Object.values(dayItemSummery).reduce(
    (sum, item) => sum + item.totRev,
    0,
  );

  //Convert to dayItemSummery to an array
  const dayItemSummeryArray = Object.values(dayItemSummery);

  //Export table data to a pdf
  const exportToPDF = () => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text(`Daily Sales Report - ${formattedDate}`, 14, 15);

    const tableColumn = [
      "No",
      "Item Name",
      "Unit Cost",
      "Unit Sell",
      "Sold Units",
      "Total Cost",
      "Total Sell",
      "Revenue",
    ];

    const tableRows = [];

    dayItemSummeryArray.forEach((item, index) => {
      tableRows.push([
        index + 1,
        item.productName,
        item.costPrice,
        item.sellPrice,
        item.totalQty,
        item.totCost,
        item.totSell,
        item.totRev.toFixed(2),
      ]);
    });

    tableRows.push(["", "", "", "", "", "", "Total", subRevenue.toFixed(2)]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save(`daily_sales_report_${formattedDate}.pdf`);
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: theme.shadows[3],
        p: 2,
        borderTop: `5px solid ${theme.palette.primary.main}`,
      }}
    >
      <TableContainer sx={{ maxHeight: 500, overflow: "auto" }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {d_columns.map((heading) => (
                <TableCell
                  key={heading.id}
                  sx={{
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  {heading.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {dayItemSummeryArray.map((item, index) => (
              <TableRow
                key={item.productId}
                hover
                sx={{
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.productName}</TableCell>
                <TableCell>{item.costPrice}</TableCell>
                <TableCell>{item.sellPrice}</TableCell>
                <TableCell>{item.totalQty}</TableCell>
                <TableCell>{item.totCost}</TableCell>
                <TableCell>{item.totSell}</TableCell>
                <TableCell
                  sx={{ fontWeight: 600, color: theme.palette.primary.main }}
                >
                  {item.totRev.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}

            <TableRow
              sx={{
                backgroundColor: theme.palette.action.selected,
              }}
            >
              <TableCell colSpan={7} align="right" sx={{ fontWeight: 700 }}>
                Total Revenue Today
              </TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: "1rem" }}>
                {subRevenue.toFixed(2) || 0}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ pt: 2, mb: 2, textAlign: "right" }}>
        <Button onClick={exportToPDF}>Export to PDF</Button>
      </Box>
    </Box>
  );
}
