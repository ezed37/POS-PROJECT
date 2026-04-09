import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ThemeContext from "../theme/ThemeContext";
import {
  addCustomer,
  deleteCustomer,
  getAllCustomers,
  updateCustomer,
} from "../api/customersApi.js";

import React, { useContext, useEffect, useState } from "react";

const headStyles = {
  fontWeight: "600",
  textTransform: "uppercase",
};

export default function CustomerPage() {
  const { mode } = useContext(ThemeContext);
  const theme = useTheme();

  //States
  const [alerts, setAlerts] = useState({
    open: false,
    type: "success",
    msg: "",
  });
  const [addCustomerDialogOpen, setAddCustomerDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    customer_name: "",
    phone_number: "",
    address: "",
    purchase_cost: 0,
  });
  const [customer, setCustomer] = useState([]);
  const [editCustomer, setEditCustomer] = useState([]);
  const [updateCustomerDialogOpen, setUpdateCustomerDialogOpen] =
    useState(false);

  //Add customer
  const openAddCustomerDialog = () => {
    setAddCustomerDialogOpen(true);
  };

  const closeAddCustomerDialog = () => {
    setAddCustomerDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.customer_name || !newCustomer.phone_number) {
      setAlerts({
        open: true,
        type: error,
        msg: "Some fields are empty",
      });
      return;
    }
    try {
      const res = await addCustomer(newCustomer);
      setCustomer((prev) => [...prev, res.data]);
      setAlerts({
        open: true,
        type: "success",
        msg: "Customer added successfull",
      });
      setNewCustomer({
        customer_name: "",
        phone_number: "",
        address: "",
        purchase_cost: 0,
      });
      setAddCustomerDialogOpen(false);
    } catch (error) {
      console.error(error.response?.data);
    }
  };

  //Retrieve customers
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllCustomers();
        setCustomer(data.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  //Delete customers
  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;

    try {
      await deleteCustomer(customerId);
      setAlerts({
        open: true,
        type: "success",
        msg: "Customer Deleted Successfull!",
      });
      setCustomer((prev) => prev.filter((c) => c._id !== customerId));
    } catch (err) {
      console.error("Error deleting customer:", err);
    }
  };

  //Update a customer
  const openUpdateCustomerDialog = (customer) => {
    setEditCustomer(customer);
    setUpdateCustomerDialogOpen(true);
  };

  const closeUpdateCustomerDialog = () => {
    setUpdateCustomerDialogOpen(false);
  };

  const handleUpdateCustomerSubmit = async () => {
    try {
      await updateCustomer(editCustomer._id, editCustomer);
      setCustomer((prev) =>
        prev.map((c) => (c._id === editCustomer._id ? editCustomer : c)),
      );
      setAlerts({
        open: true,
        type: "success",
        msg: "Customer Updated Successfull!",
      });
      closeUpdateCustomerDialog();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* Update a customer */}
      <Dialog
        open={updateCustomerDialogOpen}
        onClose={closeUpdateCustomerDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Update Customer</DialogTitle>

        <DialogContent sx={{ paddingTop: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} mt={2}>
              <TextField
                fullWidth
                label="Customer Name"
                value={editCustomer.customer_name}
                onChange={(e) =>
                  setEditCustomer({
                    ...editCustomer,
                    customer_name: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} mt={2}>
              <TextField
                fullWidth
                label="Phone Number"
                value={editCustomer.phone_number}
                onChange={(e) =>
                  setEditCustomer({
                    ...editCustomer,
                    phone_number: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} mt={2}>
              <TextField
                fullWidth
                label="Address"
                value={editCustomer.address}
                onChange={(e) =>
                  setEditCustomer({
                    ...editCustomer,
                    address: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} mt={2}>
              <TextField
                fullWidth
                label="Purchase Cost"
                value={editCustomer.purchase_cost}
                onChange={(e) =>
                  setEditCustomer({
                    ...editCustomer,
                    purchase_cost: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ padding: 2 }}>
          <Button variant="outlined" onClick={closeUpdateCustomerDialog}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpdateCustomerSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add new customer dialog */}
      <Dialog
        open={addCustomerDialogOpen}
        onClose={closeAddCustomerDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Customer</DialogTitle>
        <DialogContent sx={{ paddingTop: 2 }}>
          <Grid container spacing={2}>
            <Grid mt={3}>
              <TextField
                fullWidth
                sx={{ maxWidth: 220 }}
                label="Customer Name"
                name="customer_name"
                value={newCustomer.customer_name}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid mt={3}>
              <TextField
                fullWidth
                sx={{ maxWidth: 220 }}
                label="Phone Number"
                name="phone_number"
                value={newCustomer.phone_number}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid mt={3}>
              <TextField
                fullWidth
                sx={{ maxWidth: 220 }}
                label="Address"
                name="address"
                value={newCustomer.address}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid mt={3}>
              <TextField
                fullWidth
                sx={{ maxWidth: 220 }}
                label="Purchase Cost"
                name="purchase_cost"
                value={newCustomer.purchase_cost}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ padding: 2 }}>
          <Button variant="outlined" onClick={closeAddCustomerDialog}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddCustomer}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography
          variant="h4"
          fontWeight="700"
          gutterBottom
          color="primary"
          sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
        >
          <EmojiPeopleIcon sx={{ fontSize: 36 }} />
          Customer Management
        </Typography>

        <Fade in timeout={500}>
          <Card
            elevation={0}
            sx={{
              mb: 4,
              borderRadius: 3,
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: "common.white",
            }}
          >
            <CardContent
              sx={{
                p: 3,
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                  Add New Customer
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Create your regular customers
                </Typography>
              </Box>
              <Button
                autoFocus
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openAddCustomerDialog}
                sx={{
                  backgroundColor: "common.white",
                  color: "primary.main",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: mode === "light" ? "#f8f9fa" : "#333",
                    transform: "translateY(-2px)",
                    boxShadow: 4,
                  },
                  transition: "all 0.3s",
                }}
              >
                Create customer
              </Button>
            </CardContent>
          </Card>
        </Fade>

        <Paper elevation={4} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#2d2d2d" : "#f5f5f5",
                  }}
                >
                  <TableCell sx={headStyles}>Customer Name</TableCell>
                  <TableCell sx={headStyles}>Phone Number</TableCell>
                  <TableCell sx={headStyles}>Address</TableCell>
                  <TableCell sx={headStyles}>Purchase Cost</TableCell>
                  <TableCell sx={headStyles}></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {customer.map((customer) => (
                  <TableRow key={customer._id} hover>
                    <TableCell sx={{ fontSize: "0.8rem" }}>
                      {customer.customer_name}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.8rem" }}>
                      {customer.phone_number}
                    </TableCell>
                    <TableCell>{customer.address}</TableCell>
                    <TableCell>Rs. {customer.purchase_cost}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "center",
                        }}
                      >
                        <IconButton
                          color="primary"
                          onClick={() => openUpdateCustomerDialog(customer)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteCustomer(customer._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* Alerts */}
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
    </>
  );
}
