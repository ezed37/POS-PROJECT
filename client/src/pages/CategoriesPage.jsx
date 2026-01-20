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
import CategoryIcon from "@mui/icons-material/Category";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useContext, useEffect, useState } from "react";
import {
  addCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "../api/categoriesApi";
import ThemeContext from "../theme/ThemeContext";

const headStyles = {
  fontWeight: "600",
  textTransform: "uppercase",
};

export default function CategoriesPage() {
  const { mode } = useContext(ThemeContext);
  const theme = useTheme();

  //States
  const [alerts, setAlerts] = useState({
    open: false,
    type: "success",
    msg: "",
  });

  const [updateCategoryDialogOpen, setUpdateCategoryDialogOpen] =
    useState(false);
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] = useState(false);
  const [category, setCategory] = useState([]);
  const [editCategory, setEditCategory] = useState({
    category_id: "",
    category_name: "",
    description: "",
  });
  const [newCategory, setNewCategory] = useState({
    category_id: "",
    category_name: "",
    description: "",
  });

  //Add category
  const openAddCategoryDialog = () => {
    setAddCategoryDialogOpen(true);
  };

  const closeAddCategoryDialog = () => {
    setAddCategoryDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCategory = async () => {
    if (!newCategory.category_name || !newCategory.description) {
      setAlerts({
        open: true,
        type: "error",
        msg: "Some fields are empty!",
      });
      return;
    }
    try {
      const res = await addCategory(newCategory);
      setCategory((prev) => [...prev, res.data]);
      setAlerts({
        open: true,
        type: "success",
        msg: "Category Added Successfull!",
      });
      setNewCategory({
        category_id: "",
        category_name: "",
        description: "",
      });
      setAddCategoryDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  //Update category
  const openUpdateCategoryDialog = (category) => {
    setEditCategory(category);
    setUpdateCategoryDialogOpen(true);
  };

  const closeUpdateCategoryDialog = () => {
    setUpdateCategoryDialogOpen(false);
  };

  const handleUpdateCategorySubmit = async () => {
    try {
      await updateCategory(editCategory._id, editCategory);
      setCategory((prev) =>
        prev.map((p) => (p._id === editCategory._id ? editCategory : p)),
      );
      setAlerts({
        open: true,
        type: "success",
        msg: "Category Updated Successfull!",
      });
      closeUpdateCategoryDialog();
    } catch (error) {
      console.error(error);
    }
  };

  //Delete a category
  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      await deleteCategory(categoryId);
      setAlerts({
        open: true,
        type: "success",
        msg: "Category Deleted Successfull!",
      });
      setCategory((prev) => prev.filter((p) => p._id !== categoryId));
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllCategory();
        setCategory(data.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {/*Update category dialog */}
      <Dialog
        open={updateCategoryDialogOpen}
        onClose={closeUpdateCategoryDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Update Category</DialogTitle>

        <DialogContent sx={{ paddingTop: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} mt={2}>
              <TextField
                fullWidth
                label="Category Name"
                value={editCategory.category_name}
                onChange={(e) =>
                  setEditCategory({
                    ...editCategory,
                    category_name: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} mt={2}>
              <TextField
                fullWidth
                label="Description"
                value={editCategory.description}
                onChange={(e) =>
                  setEditCategory({
                    ...editCategory,
                    description: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ padding: 2 }}>
          <Button variant="outlined" onClick={closeUpdateCategoryDialog}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpdateCategorySubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/*Add a category dialog */}
      <Dialog
        open={addCategoryDialogOpen}
        onClose={closeAddCategoryDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent sx={{ paddingTop: 2 }}>
          <Grid container spacing={2}>
            <Grid mt={3}>
              <TextField
                fullWidth
                sx={{ maxWidth: 220 }}
                label="Category Name"
                name="category_name"
                value={newCategory.category_name}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid mt={3}>
              <TextField
                fullWidth
                sx={{ maxWidth: 220 }}
                label="Description"
                name="description"
                value={newCategory.description}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ padding: 2 }}>
          <Button variant="outlined" onClick={closeAddCategoryDialog}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddCategory}>
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
          <CategoryIcon sx={{ fontSize: 36 }} />
          Category Management
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
                  Add New Category
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Create categories of the products
                </Typography>
              </Box>
              <Button
                autoFocus
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openAddCategoryDialog}
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
                Create New Category
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
                  <TableCell sx={headStyles}>Category ID</TableCell>
                  <TableCell sx={headStyles}>Category Name</TableCell>
                  <TableCell sx={headStyles}>Description</TableCell>
                  <TableCell sx={headStyles}>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {category.map((category) => (
                  <TableRow key={category._id} hover>
                    <TableCell sx={{ fontSize: "0.8rem" }}>
                      {category.category_id}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.8rem" }}>
                      {category.category_name}
                    </TableCell>
                    <TableCell>{category.description}</TableCell>
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
                          onClick={() => openUpdateCategoryDialog(category)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteCategory(category._id)}
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
