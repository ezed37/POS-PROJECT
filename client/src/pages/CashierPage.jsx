import { useContext, useEffect, useRef, useState } from "react";
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
import { getAllProducts, updateProductBulk } from "../api/productsApi";
import useCart from "../hooks/useCart";
import { printReceipt } from "../utils/receiptPrinters";
import { addSale } from "../api/salesApi";
import AuthContext from "../auth/AuthContext";
import { focusSearchInput } from "../services/focusHelper";
import { useShortcuts } from "../hooks/useShortcuts";

const STOCK_THRESHOLD = 10;

export default function CashierPage() {
  const { toggleMode, mode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const searchRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [addItemDialog, setAddItemDialog] = useState(false);
  const [completeSaleDialog, setCompleteSaleDialog] = useState(false);
  const [customerCash, setCustomerCash] = useState("");
  const [balance, setBalance] = useState(null);
  const [dialogItem, setDialogItem] = useState(null);
  const [dialogQty, setDialogQty] = useState(0);
  const [alerts, setAlerts] = useState({
    open: false,
    type: "success",
    msg: "",
  });

  const {
    addItem,
    cart,
    removeItem,
    updateQty,
    subtotal,
    finalTotal,
    discount,
    setDiscount,
    clearCart,
    costSubtotal,
    customerTotalProfit,
  } = useCart([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await getAllProducts();
      setProducts(res.data || []);
    };
    fetchProducts();
  }, []);

  const regularProducts = products.filter((p) => p.regular_item);

  const handleFormInput = () => {
    const found = products.find((p) => p.barcode === search.trim());
    if (!found) {
      setAlerts({ open: true, type: "error", msg: "Product not found!" });
    } else {
      handleAddItem(found);
    }
  };

  const handleAddItem = (product) => {
    if (product.stock_qty > STOCK_THRESHOLD) {
      setDialogItem(product);
      setDialogQty(0);
      setAddItemDialog(true);
    } else if (product.stock_qty > 0) {
      setAlerts({ open: true, type: "warning", msg: "Low stock!" });
      setDialogItem(product);
      setDialogQty(0);
      setAddItemDialog(true);
    } else {
      setAlerts({ open: true, type: "error", msg: "Insufficient stock!" });
    }
  };

  const confirmAddItem = () => {
    if (!dialogItem) return;
    if (dialogQty === 0) {
      setAlerts({
        open: true,
        type: "error",
        msg: "Quantity must be greater than 0",
      });
    } else {
      addItem(dialogItem, dialogQty);
      setDialogItem(null);
      setAddItemDialog(false);

      setSearch("");
      focusSearchInput(searchRef);
    }
  };

  const handleRemoveItem = (id) => {
    removeItem(id);
    focusSearchInput(searchRef);
  };
  const completeSale = () => setCompleteSaleDialog(true);

  const finishSale = () => {
    const cash = Number(customerCash);
    if (isNaN(cash) || cash < finalTotal) {
      setAlerts({
        open: true,
        type: "error",
        msg: "Customer cash is insufficient!",
      });
      return;
    }
    const bal = cash - finalTotal;
    setBalance(bal);

    handleSaleData();
    setTimeout(() => {
      printReceipt({
        cart: [...cart],
        subtotal,
        discount,
        finalTotal,
        customerCash: cash,
        balance: bal,
        customerTotalProfit,
      });
      handleUpdateStock();
      clearCart();
      setDiscount(0);
      setCustomerCash("");
      setBalance(null);
      setSearch("");
      focusSearchInput(searchRef);
      setCompleteSaleDialog(false);
    }, 500);
  };

  const handleUpdateStock = async () => {
    try {
      const updates = cart.map((p) => ({
        product_id: p._id,
        stock_qty: p.qty,
      }));
      await updateProductBulk(updates);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaleData = async () => {
    const itemsData = cart.map((p) => ({
      product_id: p._id,
      product_name: p.product_name,
      qty: p.qty,
      cost_price: p.cost_price,
      selling_price: p.selling_price,
    }));

    const salesData = {
      user_name: user.username,
      reference: "INV-" + Date.now(),
      sub_total: subtotal,
      discount: discount,
      final_total: finalTotal,
      final_cost: costSubtotal,
      items: itemsData,
    };

    await addSale(salesData);
  };

  //Close add item dilog
  const addItemDialogClose = () => {
    setAddItemDialog(false);
    setSearch("");
    focusSearchInput(searchRef);
  };

  //Handle a NEW SALE
  const handNewSale = () => {
    if (
      window.confirm("Are you sure want to clear cart & start a new sale? ")
    ) {
      clearCart();
      setDiscount(0);
      setCustomerCash("");
      setBalance(null);
      setSearch("");
      focusSearchInput(searchRef);
    }
  };

  //Using shortcuts
  useShortcuts({ ctrl: true, key: "z" }, () => {
    if (cart.length !== 0) completeSale();
  });

  useShortcuts({ ctrl: true, key: "/" }, () => handNewSale());

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "background.default",
        overflow: "auto",
      }}
    >
      <Navbar toggleMode={toggleMode} mode={mode} />

      {/* Add Item Dialog */}
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
            onKeyDown={(e) => e.key === "Enter" && confirmAddItem()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => addItemDialogClose()}>Cancel</Button>
          <Button onClick={confirmAddItem}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Complete Sale Dialog */}
      <Dialog
        open={completeSaleDialog}
        onClose={() => setCompleteSaleDialog(false)}
      >
        <DialogTitle>Complete Payment</DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Total Payable: Rs. {finalTotal}
          </Typography>
          <TextField
            autoFocus
            label="Cash from the customer"
            fullWidth
            type="number"
            value={customerCash}
            onChange={(e) => setCustomerCash(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && finishSale()}
            sx={{ mb: 2 }}
          />
          {balance !== null && (
            <Typography variant="h6" sx={{ color: "success.main" }}>
              Balance: Rs. {balance.toFixed(2)}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompleteSaleDialog(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={finishSale}>
            Confirm Sale
          </Button>
        </DialogActions>
      </Dialog>

      <Grid
        container
        spacing={3}
        sx={{
          maxWidth: 1400,
          minHeight: "80vh",
          px: { xs: 2, md: 3 },
          py: 3,
          mt: 8,
          ml: 10,
        }}
      >
        {/* Cart Column */}
        <Grid sx={{ minWidth: 800, xs: 12, lg: 8 }}>
          <Paper
            elevation={3}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              border: 1,
              borderColor: "divider",
            }}
          >
            <Box sx={{ p: 2, flexShrink: 0 }}>
              <Box
                sx={{ display: "flex", gap: 1, mb: 2, alignItems: "center" }}
              >
                <TextField
                  autoFocus
                  placeholder="Scan Barcode > > >"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFormInput()}
                  inputRef={searchRef}
                  size="small"
                  sx={{
                    flex: 1,
                    "& .MuiOutlinedInput-root": { borderRadius: 1.5 },
                  }}
                />
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handNewSale}
                  size="small"
                  sx={{
                    whiteSpace: "nowrap",
                    py: 0.5,
                    px: 1.5,
                  }}
                >
                  NEW SALE
                </Button>
              </Box>

              <TableContainer sx={{ flex: 1, maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      {["Item", "Quantity", "Total", ""].map((header, idx) => (
                        <TableCell
                          key={idx}
                          align={
                            idx === 1 ? "center" : idx === 2 ? "right" : "left"
                          }
                          sx={{
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            fontWeight: 600,
                            py: 0.8,
                          }}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cart.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          align="center"
                          sx={{
                            py: 2,
                            color: "text.secondary",
                          }}
                        >
                          No items in cart
                        </TableCell>
                      </TableRow>
                    ) : (
                      cart.map((p) => (
                        <TableRow key={p._id} hover>
                          <TableCell>{p.product_name}</TableCell>
                          <TableCell align="center">
                            <TextField
                              type="number"
                              value={p.qty}
                              onChange={(e) =>
                                updateQty(p._id, Number(e.target.value))
                              }
                              inputProps={{
                                min: 1,
                                style: {
                                  textAlign: "center",
                                  padding: "4px 6px",
                                  fontSize: "0.8rem",
                                },
                              }}
                              sx={{ width: 80 }}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            Rs. {(p.selling_price * p.qty).toFixed(2)}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              color="error"
                              size="small"
                              onClick={() => handleRemoveItem(p._id)}
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

              <Divider sx={{ my: 1 }} />

              <Box sx={{ p: 2, flexShrink: 0 }}>
                <TextField
                  fullWidth
                  label="Discount %"
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  inputProps={{ min: 0, max: 100 }}
                  size="small"
                  sx={{
                    mb: 1,
                    "& .MuiOutlinedInput-root": { borderRadius: 1.5 },
                  }}
                />
                <Paper variant="outlined" sx={{ p: 1.5, mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography color="text.secondary" variant="body2">
                      Subtotal:
                    </Typography>
                    <Typography fontWeight={600} variant="body2">
                      Rs. {subtotal}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography color="text.secondary" variant="body2">
                      Discount:
                    </Typography>
                    <Typography color="error" fontWeight={600} variant="body2">
                      {discount} %
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      Final Total:
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      color="primary.main"
                    >
                      Rs. {finalTotal}
                    </Typography>
                  </Box>
                </Paper>

                <Button
                  variant="contained"
                  size="small"
                  fullWidth
                  disabled={cart.length === 0}
                  sx={{ py: 1, fontWeight: 600 }}
                  onClick={completeSale}
                >
                  Complete Sale
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Regular Items Column */}
        <Grid sx={{ maxWidth: 500, xs: 12, lg: 4 }}>
          <Paper elevation={3} sx={{ borderRadius: 3, p: 3 }}>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
              Regular Items
            </Typography>
            <Grid container spacing={2}>
              {regularProducts.map((p) => (
                <Grid sx={{ xs: 6, sm: 4 }} key={p._id}>
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
                      bgcolor: "background.paper",
                    }}
                    onClick={() => handleAddItem(p)}
                  >
                    <CardContent sx={{ py: 1, textAlign: "center" }}>
                      <Typography fontWeight={500}>{p.product_name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rs. {p.selling_price}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

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
