import { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Navbar from "../components/NavBar";
import ThemeContext from "../theme/ThemeContext";
import { getAllProducts } from "../api/productsApi";
import useCart from "../hooks/useCart";

const stock_threshold = 10;

export default function CashierPage() {
  const { toggleMode, mode } = useContext(ThemeContext);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchedItem, setSearchedItem] = useState([]);
  const [addItemDialog, setAddItemDialog] = useState(false);
  const [dialogItem, setDialogItem] = useState(null);
  const [dialogQty, setDialogQty] = useState(0);
  const [alerts, setAlerts] = useState({
    open: false,
    type: "success",
    msg: "",
  });

  //Cart
  const {
    addItem,
    cart,
    removeItem,
    updateQty,
    subtotal,
    finalTotal,
    discount,
    setDiscount,
  } = useCart([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await getAllProducts();
      const allProducts = res.data || [];
      setProducts(allProducts);
    };

    fetchProducts();
  }, []);

  //Find regular items
  const regularProducts = products
    .filter((item) => item.regular_item)
    .map((item) => ({
      ...item,
      product_name: item.product_name,
      selling_price: item.selling_price,
    }));

  //Handle search on barcode
  const handleFormInput = () => {
    const item = products.find((i) => i.barcode && i.barcode === search.trim());
    if (!item) {
      setAlerts({
        open: true,
        type: "error",
        msg: "Product not found!",
      });
    } else {
      handleAddItem(item);
    }
  };

  //Handle add item dialog
  const handleAddItem = (item) => {
    if (item.stock_qty > stock_threshold) {
      setDialogItem(item);
      setDialogQty(0);
      setAddItemDialog(true);
    } else if (item.stock_qty > 0) {
      setAlerts({
        open: true,
        type: "warning",
        msg: "Low stock!",
      });
      setDialogItem(item);
      setDialogQty(0);
      setAddItemDialog(true);
    } else {
      setAlerts({
        open: true,
        type: "error",
        msg: "Insufficient stock!",
      });
    }
  };

  const confirmAddItem = () => {
    if (!dialogItem) return;
    if (dialogQty === 0) {
      setAlerts({
        open: true,
        type: "error",
        msg: "Quantity must greater than 0",
      });
    } else {
      addItem(dialogItem, dialogQty);
      setDialogItem(null);
      setAddItemDialog(false);
    }
  };

  //Handle cart items deletion
  const handleRemoveItem = (id) => {
    removeItem(id);
  };

  //TEST
  console.log(cart);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#f5f7fa",
        overflow: "auto",
      }}
    >
      {/* DIALOGS */}

      {/* ADD ITEMS DIALOG */}
      <Dialog open={addItemDialog} onClose={() => setAddItemDialog(false)}>
        <DialogTitle>Add Item</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>{dialogItem?.product_name}</Typography>
          <TextField
            fullWidth
            type="number"
            autoFocus
            value={dialogQty}
            onChange={(e) => setDialogQty(Number(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                confirmAddItem();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddItemDialog(false)}>Cancel</Button>
          <Button onClick={confirmAddItem}>Add</Button>
        </DialogActions>
      </Dialog>

      <Navbar toggleMode={toggleMode} mode={mode} />

      <Grid
        container
        spacing={3}
        sx={{ maxWidth: "1400px", px: { xs: 2, md: 3 }, py: 3, mt: 8, ml: 10 }}
      >
        {/* CART COLUMN */}
        <Grid item xs={12} lg={8} minWidth={"800px"}>
          <Paper
            elevation={3}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              border: "1px solid #e0e0e0",
            }}
          >
            <Box sx={{ p: 3 }}>
              <TextField
                fullWidth
                size="medium"
                placeholder="Search Items or Scan Barcode"
                value={search}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFormInput()}
              />

              <Typography variant="h5" fontWeight={600} gutterBottom>
                Shopping Cart
              </Typography>

              <TableContainer sx={{ maxHeight: 400, mb: 3 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          bgcolor: "#018790",
                          color: "white",
                          fontWeight: 600,
                        }}
                      >
                        Item
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          bgcolor: "#018790",
                          color: "white",
                          fontWeight: 600,
                        }}
                      >
                        Quantity
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          bgcolor: "#018790",
                          color: "white",
                          fontWeight: 600,
                        }}
                      >
                        Total (Rs.)
                      </TableCell>
                      <TableCell align="center" sx={{ bgcolor: "#018790" }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cart.length === 0 || 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          align="center"
                          sx={{ py: 4, color: "#666" }}
                        >
                          <Typography>No items in cart</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      cart.map((item) => (
                        <TableRow key={item.id} hover>
                          <TableCell>{item.product_name}</TableCell>
                          <TableCell align="center">
                            <TextField
                              type="number"
                              value={item.qty}
                              onChange={(e) =>
                                updateQty(item.id, Number(e.target.value))
                              }
                              inputProps={{
                                min: 1,
                                style: { textAlign: "center" },
                              }}
                              sx={{ width: 80 }}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            Rs. {(item.selling_price * item.qty).toFixed(2)}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              color="error"
                              size="small"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Divider sx={{ my: 3 }} />

              <TextField
                fullWidth
                label="Discount %"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                inputProps={{ min: 0, max: 100 }}
                sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />

              <Paper variant="outlined" sx={{ p: 3, bgcolor: "#f8f9fa" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1.5,
                  }}
                >
                  <Typography color="text.secondary">Subtotal:</Typography>
                  <Typography fontWeight={600}>Rs. {subtotal}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1.5,
                  }}
                >
                  <Typography color="text.secondary">Discount:</Typography>
                  <Typography color="error" fontWeight={600}>
                    {discount} %
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight={600}>
                    Final Total:
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="#018790">
                    Rs. {finalTotal}
                  </Typography>
                </Box>
              </Paper>

              <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={cart.length === 0}
                sx={{
                  mt: 4,
                  py: 1.8,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  bgcolor: "#2e7d32",
                  "&:hover": { bgcolor: "#1b5e20" },
                }}
              >
                Complete Sale
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* REGULAR ITEMS COLUMN */}
        <Grid item xs={12} lg={4} maxWidth={"500px"}>
          <Paper
            elevation={3}
            sx={{ borderRadius: 3, p: 3, height: "fit-content" }}
          >
            <Typography
              sx={{ mb: 3 }}
              variant="h5"
              fontWeight={600}
              gutterBottom
            >
              Regular Items
            </Typography>

            <Grid container spacing={2}>
              {regularProducts.map((item) => (
                <Grid item xs={6} sm={4} key={item.id}>
                  <Card
                    variant="outlined"
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 4,
                      },
                      minWidth: 130,
                    }}
                    onClick={() => handleAddItem(item)}
                  >
                    <CardContent sx={{ py: 1, textAlign: "center" }}>
                      <Typography fontWeight={500}>
                        {item.product_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rs. {item.selling_price}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

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
