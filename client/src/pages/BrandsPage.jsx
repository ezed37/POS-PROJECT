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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import React, { useContext, useEffect, useState } from "react";
import {
  addBrand,
  deleteBrand,
  getAllBrand,
  updateBrand,
} from "../api/brandsApi";
import ThemeContext from "../theme/ThemeContext";

const headStyles = {
  fontWeight: "600",
  textTransform: "uppercase",
};

export default function BrandsPage() {
  const theme = useTheme();
  const { mode } = useContext(ThemeContext);

  //States
  const [alerts, setAlerts] = useState({
    open: false,
    type: "success",
    msg: "",
  });

  const [updateBrandDialogOpen, setupdateBrandDialogOpen] = useState(false);
  const [addBrandDialogOpen, setAddBrandDialogOpen] = useState(false);
  const [brand, setBrand] = useState([]);
  const [editBrand, seteditBrand] = useState({
    brand_id: "",
    brand_name: "",
    description: "",
  });
  const [newBrand, setnewBrand] = useState({
    brand_id: "",
    brand_name: "",
    description: "",
  });

  //Add brand
  const openAddbrandDialog = () => {
    setAddBrandDialogOpen(true);
  };

  const closeAddbrandDialog = () => {
    setAddBrandDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setnewBrand((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddbrand = async () => {
    if (!newBrand.brand_name || !newBrand.description) {
      setAlerts({
        open: true,
        type: "error",
        msg: "Some fields are empty!",
      });
      return;
    }
    try {
      const res = await addBrand(newBrand);
      setBrand((prev) => [...prev, res.data]);
      setAlerts({
        open: true,
        type: "success",
        msg: "Brand Added Successfull!",
      });
      setnewBrand({
        brand_id: "",
        brand_name: "",
        description: "",
      });
      setAddBrandDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  //Update brand
  const openUpdatebrandDialog = (brand) => {
    seteditBrand(brand);
    setupdateBrandDialogOpen(true);
  };

  const closeUpdatebrandDialog = () => {
    setupdateBrandDialogOpen(false);
  };

  const handleUpdatebrandSubmit = async () => {
    try {
      await updateBrand(editBrand._id, editBrand);
      setBrand((prev) =>
        prev.map((p) => (p._id === editBrand._id ? editBrand : p))
      );
      setAlerts({
        open: true,
        type: "success",
        msg: "Brand Updated Successfull!",
      });
      closeUpdatebrandDialog();
    } catch (error) {
      console.error(error);
    }
  };

  //Delete a brand
  const handleDeletebrand = async (brandId) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;

    try {
      await deleteBrand(brandId);
      setAlerts({
        open: true,
        type: "success",
        msg: "Brand Deleted Successfull!",
      });
      setBrand((prev) => prev.filter((p) => p._id !== brandId));
    } catch (err) {
      console.error("Error deleting brand:", err);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllBrand();
        setBrand(data.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {/* Update brand */}
      <Dialog
        open={updateBrandDialogOpen}
        onClose={closeUpdatebrandDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Update Brand</DialogTitle>

        <DialogContent sx={{ paddingTop: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} mt={2}>
              <TextField
                fullWidth
                label="Brand Name"
                value={editBrand.brand_name}
                onChange={(e) =>
                  seteditBrand({
                    ...editBrand,
                    brand_name: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} mt={2}>
              <TextField
                fullWidth
                label="Description"
                value={editBrand.description}
                onChange={(e) =>
                  seteditBrand({
                    ...editBrand,
                    description: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ padding: 2 }}>
          <Button variant="outlined" onClick={closeUpdatebrandDialog}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpdatebrandSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add new brand */}
      <Dialog
        open={addBrandDialogOpen}
        onClose={closeAddbrandDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Brand</DialogTitle>
        <DialogContent sx={{ paddingTop: 2 }}>
          <Grid container spacing={2}>
            <Grid mt={3}>
              <TextField
                fullWidth
                sx={{ maxWidth: 220 }}
                label="Brand Name"
                name="brand_name"
                value={newBrand.brand_name}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid mt={3}>
              <TextField
                fullWidth
                sx={{ maxWidth: 220 }}
                label="Description"
                name="description"
                value={newBrand.description}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ padding: 2 }}>
          <Button variant="outlined" onClick={closeAddbrandDialog}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddbrand}>
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
          <BrandingWatermarkIcon sx={{ fontSize: 36 }} />
          Brand Management
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
                  Add New Brand
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Create Brands of the products
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openAddbrandDialog}
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
                Create New Brand
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
                  <TableCell sx={headStyles}>Brand ID</TableCell>
                  <TableCell sx={headStyles}>Brand Name</TableCell>
                  <TableCell sx={headStyles}>Description</TableCell>
                  <TableCell sx={headStyles}>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {brand.map((brand) => (
                  <TableRow key={brand._id} hover>
                    <TableCell sx={{ fontSize: "0.8rem" }}>
                      {brand.brand_id}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.8rem" }}>
                      {brand.brand_name}
                    </TableCell>
                    <TableCell>{brand.description}</TableCell>
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
                          onClick={() => openUpdatebrandDialog(brand)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeletebrand(brand._id)}
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
    </>
  );
}
