import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { getAllSales, deleteSale } from "../api/salesApi.js";
import { useEffect, useState } from "react";

const headStyles = {
  fontWeight: "600",
  textTransform: "uppercase",
};

export default function SalesPage() {
  const theme = useTheme();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [alerts, setAlerts] = useState(false);
  const [saleData, setSalesData] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewSale, setViewSale] = useState(null);

  useEffect(() => {
    async function fetchSalesData() {
      try {
        const data = await getAllSales();
        setSalesData(data);
        setFilteredSales(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchSalesData();
  }, []);

  function handleFilterByDate(selectedDate) {
    if (!selectedDate) {
      setFilteredSales(saleData);
      return;
    }

    const filtered = saleData.filter((s) => {
      const saleDate = new Date(s.createdAt).toISOString().split("T")[0];
      return saleDate === selectedDate;
    });

    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredSales(filtered);
  }

  const openViewDialog = async (s) => {
    setViewDialogOpen(true);
  };

  const closeViewDialog = () => {
    setViewDialogOpen(false);
  };

  const handleDeleteSale = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;

    try {
      await deleteSale(id);
      const updatedSales = saleData.filter((s) => s._id !== id);
      setSalesData(updatedSales);
      setFilteredSales(updatedSales);
    } catch (err) {
      console.error("Error deleting sale:", err);
    }
  };

  //Find qty of product each sale
  const totalQty = saleData.map((sale) =>
    sale.items.reduce((sum, item) => sum + item.qty, 0)
  );

  //Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  //Handle rows per page change
  const handleRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "background.default",
        minHeight: "100vh",
      }}
    >
      {/* View sale details dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={closeViewDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle fontWeight={"bold"}>Invoice</DialogTitle>

        {viewSale?.items?.length > 0 && (
          <Grid container spacing={1} marginBottom={2} ml={2}>
            <Grid item xs={12} size={12}>
              <Typography fontSize={14}>
                <span style={{ fontWeight: "bold" }}>Invoice No.</span>{" "}
                {viewSale?.reference}
              </Typography>
            </Grid>

            <Grid item xs={6} size={8}>
              <Typography fontSize={14}>
                <span style={{ fontWeight: "bold" }}>Date :</span>{" "}
                {new Date(viewSale.createdAt).toLocaleDateString("en-GB", {
                  timeZone: "Asia/Colombo",
                })}
              </Typography>
            </Grid>

            <Grid item xs={6} size={4}>
              <Typography fontSize={14}>
                <span style={{ fontWeight: "bold" }}>Time :</span>{" "}
                {new Date(viewSale.createdAt).toLocaleTimeString("en-GB", {
                  timeZone: "Asia/Colombo",
                })}
              </Typography>
            </Grid>

            <Grid item xs={12} size={8}>
              <Typography fontSize={14}>
                <span style={{ fontWeight: "bold" }}>Cust. Name:</span>{" "}
                {viewSale?.customer_name || "N/A"}
              </Typography>
            </Grid>

            <Grid item xs={12} size={4}>
              <Typography fontSize={14}>
                <span style={{ fontWeight: "bold" }}>User Name:</span>{" "}
                {viewSale?.user_name || "N/A"}
              </Typography>
            </Grid>

            <Grid item xs={12} size={8}>
              <Typography fontSize={14}>
                <span style={{ fontWeight: "bold" }}>Items Qty:</span>{" "}
                {viewSale?.items?.length || 0}
              </Typography>
            </Grid>

            <Grid item xs={12} size={4}>
              <Typography fontSize={14}>
                <span style={{ fontWeight: "bold" }}>Payment Method:</span>{" "}
                {viewSale?.payment_type || "N/A"}
              </Typography>
            </Grid>
          </Grid>
        )}

        <DialogContent dividers>
          <Divider sx={{ marginBottom: 2 }} />
          {/* Items Table */}
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Item</b>
                </TableCell>
                <TableCell align="center">
                  <b>Qty</b>
                </TableCell>
                <TableCell align="center">
                  <b>Unit Price</b>
                </TableCell>
                <TableCell align="center">
                  <b>Total</b>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {viewSale?.items?.length > 0 &&
                viewSale.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.product_name}</TableCell>
                    <TableCell align="center">{item.qty}</TableCell>
                    <TableCell align="center">{item.selling_price}</TableCell>
                    <TableCell align="center">
                      {item.qty * item.selling_price}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />

          {viewSale && (
            <Table size="small" sx={{ mt: 2, borderCollapse: "collapse" }}>
              <TableBody>
                {/* Sub Total */}
                <TableRow sx={{ border: 0 }}>
                  <TableCell sx={{ border: 0 }} />
                  <TableCell sx={{ border: 0 }}>
                    <Typography fontWeight="bold">Total (Rs.)</Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ border: 0 }}>
                    <Typography>{viewSale.sub_total || 0}</Typography>
                  </TableCell>
                  <TableCell sx={{ border: 0 }} />
                </TableRow>

                {/* Discount */}
                <TableRow sx={{ border: 0 }}>
                  <TableCell sx={{ border: 0 }} />
                  <TableCell sx={{ border: 0 }}>
                    <Typography>Discount (%)</Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ border: 0 }}>
                    <Typography>{viewSale.discount || 0}</Typography>
                  </TableCell>
                  <TableCell sx={{ border: 0 }} />
                </TableRow>

                {/* Final Total */}
                <TableRow sx={{ border: 0 }}>
                  <TableCell sx={{ border: 0 }} />
                  <TableCell sx={{ border: 0 }}>
                    <Typography fontWeight="bold">Final Total (Rs.)</Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ border: 0 }}>
                    <Typography fontWeight="bold">
                      {viewSale.final_total || 0}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ border: 0 }} />
                </TableRow>
              </TableBody>
            </Table>
          )}
        </DialogContent>

        <DialogActions>
          <Button variant="contained" onClick={closeViewDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          fontWeight="700"
          color="primary"
          sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
        >
          <ShoppingCartCheckoutIcon sx={{ fontSize: 36 }} />
          Sales Management
        </Typography>

        <TextField
          type="date"
          variant="outlined"
          size="small"
          onChange={(e) => handleFilterByDate(e.target.value)}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor:
                theme.palette.mode === "dark" ? "#1a1a1a" : "#fff",
            },
          }}
        />

        <Paper elevation={4} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#2d2d2d" : "#f5f5f5",
                  }}
                >
                  <TableCell sx={headStyles}>Invoice No.</TableCell>
                  <TableCell sx={headStyles}>Date</TableCell>
                  <TableCell sx={headStyles}>Sold Item Count</TableCell>
                  <TableCell sx={headStyles}>Payment Type</TableCell>
                  <TableCell sx={headStyles}>Final Total</TableCell>
                  <TableCell sx={headStyles}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSales
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((s, index) => (
                    <TableRow
                      key={s._id}
                      hover
                      sx={{
                        backgroundColor:
                          index % 2 === 0
                            ? "rgba(255,255,255,0.03)"
                            : "transparent",
                      }}
                    >
                      <TableCell
                        sx={{ fontSize: "0.85rem", padding: "10px 14px" }}
                      >
                        {s.reference}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: "0.85rem", padding: "10px 14px" }}
                      >
                        {new Date(s.createdAt).toISOString().split("T")[0]}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: "0.85rem", padding: "10px 14px" }}
                      >
                        {s?.items?.length || 0}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: "0.85rem", padding: "10px 14px" }}
                      >
                        {s.payment_type}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: "0.85rem", padding: "10px 14px" }}
                      >
                        {s.final_total}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: "0.85rem", padding: "10px 14px" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: 0,
                            justifyContent: "center",
                          }}
                        >
                          <IconButton
                            color="primary"
                            onClick={() => {
                              setViewSale(s);
                              openViewDialog();
                            }}
                          >
                            <RemoveRedEyeIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteSale(s._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filteredSales.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPage}
              rowsPerPageOptions={[10, 15, 20]}
            />
          </TableContainer>
        </Paper>
      </Box>

      {/* Snackbar for Alert */}
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
