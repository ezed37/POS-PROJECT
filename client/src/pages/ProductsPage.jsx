import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
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
import { useEffect, useRef, useState } from "react";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../api/productsApi";
import { getAllCategory } from "../api/categoriesApi";
import { getAllBrand } from "../api/brandsApi";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function ProductsPage() {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const [newProduct, setNewProduct] = useState({
    product_id: "",
    barcode: "",
    product_name: "",
    category_id: "",
    brand_id: "",
    regular_item: false,
    unit: "pkt",
    stock_qty: 0,
    cost_price: 0,
    actual_price: 0,
    selling_price: 0,
  });

  const [editProduct, setEditProduct] = useState({});

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "product_id",
    order: "asc",
  });

  //const searchInputRef = useRef(null);

  // Filtering & Sorting
  const filteredAndSortedProducts = [...products]
    .filter(
      (p) =>
        p.product_name?.toLowerCase().includes(search.toLowerCase()) ||
        p.barcode?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const field = sortConfig.field;
      const order = sortConfig.order === "asc" ? 1 : -1;

      if (field === "stock_qty") {
        return order * (a.stock_qty - b.stock_qty);
      }
      if (field === "product_id") {
        return order * a.product_id.localeCompare(b.product_id);
      }
      return 0;
    });

  const requestSort = (field) => {
    setSortConfig((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const loadCategoriesAndBrands = async () => {
    const [catRes, brandRes] = await Promise.all([
      getAllCategory(),
      getAllBrand(),
    ]);
    setCategories(catRes.data);
    setBrands(brandRes.data);
  };

  const openAddDialog = async () => {
    await loadCategoriesAndBrands();
    setAddDialogOpen(true);
    //setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  const openUpdateDialog = async (product) => {
    await loadCategoriesAndBrands();
    setEditProduct(product);
    setUpdateDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async () => {
    if (
      !newProduct.product_name ||
      !newProduct.category_id ||
      !newProduct.brand_id ||
      newProduct.cost_price <= 0 ||
      newProduct.actual_price <= 0 ||
      newProduct.selling_price <= 0
    ) {
      alert("Please fill all required fields with valid values.");
      return;
    }

    try {
      const res = await addProduct(newProduct);
      setProducts((prev) => [...prev, res.data]);
      setAddDialogOpen(false);
      setNewProduct({
        product_id: "",
        barcode: "",
        product_name: "",
        category_id: "",
        brand_id: "",
        regular_item: false,
        unit: "pkt",
        stock_qty: 0,
        cost_price: 0,
        actual_price: 0,
        selling_price: 0,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      await updateProduct(editProduct._id, editProduct);
      setProducts((prev) =>
        prev.map((p) => (p._id === editProduct._id ? editProduct : p))
      );
      setUpdateDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  useEffect(() => {
    getAllProducts().then((res) => setProducts(res.data));
  }, []);

  const FormTextField = ({
    label,
    name,
    value,
    onChange,
    select,
    children,
    ...props
  }) => (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      select={select}
      fullWidth
      variant="outlined"
      size="small"
      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
      {...props}
    >
      {children}
    </TextField>
  );

  return (
    <>
      {/* Add Product Dialog */}
      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>
          Add New Product
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid sx={{ minWidth: 230 }}>
              <TextField
                //inputRef={searchInputRef}
                fullWidth
                label="Barcode"
                name="barcode"
                value={newProduct.barcode}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, barcode: e.target.value })
                }
              />
            </Grid>
            <Grid sx={{ minWidth: 230 }}>
              <TextField
                fullWidth
                label="Product Name *"
                name="product_name"
                value={newProduct.product_name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, product_name: e.target.value })
                }
              />
            </Grid>

            <Grid sx={{ minWidth: 230 }}>
              <TextField
                fullWidth
                select
                label="Category *"
                name="category_id"
                value={newProduct.category_id}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category_id: e.target.value })
                }
              >
                {categories.map((c) => (
                  <MenuItem key={c.category_id} value={c.category_id}>
                    {c.category_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid sx={{ minWidth: 230 }}>
              <TextField
                fullWidth
                select
                label="Brand *"
                name="brand_id"
                value={newProduct.brand_id}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, brand_id: e.target.value })
                }
              >
                {brands.map((b) => (
                  <MenuItem key={b.brand_id} value={b.brand_id}>
                    {b.brand_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid sx={{ minWidth: 230 }}>
              <TextField
                fullWidth
                select
                label="Regular Item"
                name="regular_item"
                value={newProduct.regular_item}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    regular_item: e.target.value === true,
                  })
                }
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </TextField>
            </Grid>

            <Grid sx={{ minWidth: 230 }}>
              <TextField
                fullWidth
                select
                label="Unit"
                name="unit"
                value={newProduct.unit}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, unit: e.target.value })
                }
              >
                <MenuItem value="pkt">Packet</MenuItem>
                <MenuItem value="weight">Weight</MenuItem>
                <MenuItem value="length">Length</MenuItem>
              </TextField>
            </Grid>

            {["stock_qty", "cost_price", "actual_price", "selling_price"].map(
              (field) => (
                <Grid key={field} xs={12} sm={6} sx={{ minWidth: 230 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label={
                      field === "stock_qty"
                        ? "Stock Quantity"
                        : field === "cost_price"
                        ? "Cost Price (Rs.) *"
                        : field === "actual_price"
                        ? "Actual Price (Rs.) *"
                        : "Selling Price (Rs.) *"
                    }
                    name={field}
                    value={newProduct[field]}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        [field]: e.target.value,
                      })
                    }
                  />
                </Grid>
              )
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button onClick={() => setAddDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleAddProduct} variant="contained">
            Add Product
          </Button>
        </DialogActions>
      </Dialog>

      {/* Main Page */}
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Product Management
        </Typography>

        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <TextField
              placeholder="Search by name or barcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
              sx={{ width: { xs: "100%", sm: 320 } }}
            />

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openAddDialog}
              size="large"
              sx={{ borderRadius: 2, px: 4, py: 1.5 }}
            >
              New Product
            </Button>
          </CardContent>
        </Card>

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
                  <TableCell sx={{ fontWeight: 600 }}>
                    Product ID
                    <IconButton
                      size="small"
                      onClick={() => requestSort("product_id")}
                    >
                      {sortConfig.field === "product_id" &&
                      sortConfig.order === "asc"
                        ? "↑"
                        : "↓"}
                    </IconButton>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    Stock Qty
                    <IconButton
                      size="small"
                      onClick={() => requestSort("stock_qty")}
                    >
                      {sortConfig.field === "stock_qty" &&
                      sortConfig.order === "asc"
                        ? "↑"
                        : "↓"}
                    </IconButton>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Cost Price</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actual Price</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Selling Price</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredAndSortedProducts.map((product) => (
                  <TableRow
                    key={product._id}
                    hover
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <TableCell>{product.product_id}</TableCell>
                    <TableCell>{product.product_name}</TableCell>
                    <TableCell>{product.stock_qty}</TableCell>
                    <TableCell>
                      {Number(product.cost_price).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {Number(product.actual_price).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {Number(product.selling_price).toFixed(2)}
                    </TableCell>
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
                          onClick={() => openUpdateDialog(product)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(product._id)}
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
    </>
  );
}

export default ProductsPage;
