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
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Navbar from "../components/NavBar";
import ThemeContext from "../theme/ThemeContext";
import { useContext, useState } from "react";

export default function CashierPage() {
  const { toggleMode, mode } = useContext(ThemeContext);

  // Example state — replace with your actual cart logic (Zustand, Context, etc.)
  const [cartItems, setCartItems] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);

  // Mock regular items (in real app, fetch from database)
  const regularItems = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    price: 100 + i * 50, // example prices
  }));

  const handleAddItem = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, newQty) => {
    if (newQty < 1) return handleRemoveItem(id);
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = subtotal - discountAmount;

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#f5f7fa",
        overflow: "auto",
      }}
    >
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
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
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
                    {cartItems.length === 0 ? (
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
                      cartItems.map((item) => (
                        <TableRow key={item.id} hover>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="center">
                            <TextField
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.id,
                                  Number(e.target.value)
                                )
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
                            Rs. {(item.price * item.quantity).toFixed(2)}
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
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
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
                  <Typography fontWeight={600}>
                    Rs. {subtotal.toFixed(2)}
                  </Typography>
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
                    {discountPercent}% (Rs. {discountAmount.toFixed(2)})
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
                    Rs. {finalTotal.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6" fontWeight={600}>
                    Balance:
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="success.main"
                  >
                    Rs. {finalTotal.toFixed(2)}
                  </Typography>
                </Box>
              </Paper>

              <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={cartItems.length === 0}
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
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Regular Items
            </Typography>

            <Grid container spacing={2}>
              {regularItems.map((item) => (
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
                    }}
                    onClick={() => handleAddItem(item)}
                  >
                    <CardContent sx={{ py: 2.5, textAlign: "center" }}>
                      <Typography fontWeight={500}>{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rs. {item.price}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
