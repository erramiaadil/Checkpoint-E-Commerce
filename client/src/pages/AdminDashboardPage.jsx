import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const CATEGORIES = [
  "Electronics",
  "Wearables",
  "Accessories",
  "Footwear",
  "Fashion",
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0); // 0 = Inventory, 1 = Orders
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create Product Dialog State
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState("");
  const [newProductData, setNewProductData] = useState({
    name: "",
    price: "",
    category: "Electronics",
    stock: "",
    description: "",
    image: "",
  });

  // Edit Product Dialog State
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    price: "",
    category: "Electronics",
    stock: "",
    description: "",
    image: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const [productsRes, ordersRes] = await Promise.all([
        axiosClient.get("/products"),
        axiosClient.get("/orders"),
      ]);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Delete product action
  const handleDeleteProduct = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this product?",
      )
    ) {
      return;
    }
    try {
      await axiosClient.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  // Open Edit Modal with pre-filled values
  const handleOpenEditModal = (product) => {
    setEditingId(product._id);
    setEditFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      description: product.description,
      image: product.image,
    });
    setEditError("");
    setOpenEditDialog(true);
  };

  // Submit Edit form
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setEditError("");

    try {
      setEditSubmitting(true);
      const payload = {
        ...editFormData,
        price: Number(editFormData.price),
        stock: Number(editFormData.stock),
      };

      const { data } = await axiosClient.put(`/products/${editingId}`, payload);
      // Update state in place
      setProducts((prev) => prev.map((p) => (p._id === editingId ? data : p)));
      setOpenEditDialog(false);
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to update product");
    } finally {
      setEditSubmitting(false);
    }
  };

  // Deliver order action
  const handleDeliverOrder = async (orderId) => {
    try {
      const { data } = await axiosClient.put(`/orders/${orderId}/deliver`);
      setOrders((prev) =>
        prev.map((ord) => (ord._id === orderId ? data : ord)),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update order status");
    }
  };

  // Submit Create form
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setCreateError("");

    if (
      !newProductData.name ||
      !newProductData.price ||
      !newProductData.stock ||
      !newProductData.image
    ) {
      setCreateError("Please fill out all required fields.");
      return;
    }

    try {
      setCreateSubmitting(true);
      const payload = {
        ...newProductData,
        price: Number(newProductData.price),
        stock: Number(newProductData.stock),
      };

      const { data } = await axiosClient.post("/products", payload);
      setProducts((prev) => [data, ...prev]);
      setOpenCreateDialog(false);
      setNewProductData({
        name: "",
        price: "",
        category: "Electronics",
        stock: "",
        description: "",
        image: "",
      });
    } catch (err) {
      setCreateError(err.response?.data?.message || "Failed to create product");
    } finally {
      setCreateSubmitting(false);
    }
  };

  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);
  const pendingDeliveries = orders.filter((o) => !o.isDelivered).length;

  return (
    <Container sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Admin Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateDialog(true)}
          sx={{ alignSelf: { xs: "flex-start", sm: "auto" } }}
        >
          Add Product
        </Button>
      </Box>

      {/* Overview Stat Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            sm: "repeat(3, minmax(0, 1fr))",
          },
          gap: 3,
          mb: 4,
        }}
      >
        <Card sx={{ p: 2.5, textAlign: "center" }}>
          <Typography color="text.secondary">Total Revenue</Typography>
          <Typography variant="h5" fontWeight={700} color="primary.main">
            $
            {totalRevenue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </Typography>
        </Card>
        <Card sx={{ p: 2.5, textAlign: "center" }}>
          <Typography color="text.secondary">Total Orders</Typography>
          <Typography variant="h5" fontWeight={700}>
            {orders.length}
          </Typography>
        </Card>
        <Card sx={{ p: 2.5, textAlign: "center" }}>
          <Typography color="text.secondary">Pending Deliveries</Typography>
          <Typography
            variant="h5"
            fontWeight={700}
            color={pendingDeliveries > 0 ? "warning.main" : "success.main"}
          >
            {pendingDeliveries}
          </Typography>
        </Card>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={currentTab} onChange={(e, val) => setCurrentTab(val)}>
          <Tab
            label={`Inventory (${products.length})`}
            sx={{ fontWeight: 600 }}
          />
          <Tab
            label={`Customer Orders (${orders.length})`}
            sx={{ fontWeight: 600 }}
          />
        </Tabs>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* TAB 0: INVENTORY TABLE */}
          {currentTab === 0 && (
            <Card sx={{ p: { xs: 2, sm: 3 }, minWidth: 0 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Manage Inventory
              </Typography>
              <Box sx={{ width: "100%", overflowX: "auto" }}>
                <Table size="small" sx={{ minWidth: 620 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Stock</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((p) => (
                      <TableRow key={p._id} hover>
                        <TableCell
                          sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}
                        >
                          {p._id.slice(-6).toUpperCase()}
                        </TableCell>
                        <TableCell fontWeight={600}>{p.name}</TableCell>
                        <TableCell>${Number(p.price).toFixed(2)}</TableCell>
                        <TableCell>{p.category}</TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color={p.stock > 0 ? "success.main" : "error.main"}
                          >
                            {p.stock}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: 0.5,
                            }}
                          >
                            {/* Edit Button */}
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleOpenEditModal(p)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            {/* Delete Button */}
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDeleteProduct(p._id)}
                            >
                              <DeleteOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Card>
          )}

          {/* TAB 1: CUSTOMER ORDERS TABLE */}
          {currentTab === 1 && (
            <Card sx={{ p: { xs: 2, sm: 3 }, minWidth: 0 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Customer Orders & Fulfillment
              </Typography>
              <Box sx={{ width: "100%", overflowX: "auto" }}>
                <Table size="small" sx={{ minWidth: 700 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Delivery</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((ord) => (
                      <TableRow key={ord._id} hover>
                        <TableCell>
                          <Typography
                            component={Link}
                            to={`/order/${ord._id}`}
                            variant="body2"
                            sx={{
                              fontFamily: "monospace",
                              fontWeight: 700,
                              color: "primary.main",
                              textDecoration: "none",
                              "&:hover": { textDecoration: "underline" },
                            }}
                          >
                            #{ord._id.slice(-6).toUpperCase()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {ord.user?.name || "Customer"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {ord.user?.email || "No email"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell fontWeight={600}>
                          ${Number(ord.totalPrice).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={ord.isDelivered ? "Delivered" : "Processing"}
                            color={ord.isDelivered ? "success" : "warning"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: 1,
                            }}
                          >
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<VisibilityIcon />}
                              onClick={() => navigate(`/order/${ord._id}`)}
                            >
                              View
                            </Button>
                            {!ord.isDelivered && (
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                startIcon={<CheckCircleOutlinedIcon />}
                                onClick={() => handleDeliverOrder(ord._id)}
                              >
                                Deliver
                              </Button>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Card>
          )}
        </>
      )}

      {/* CREATE PRODUCT MODAL */}
      <Dialog
        open={openCreateDialog}
        onClose={() => !createSubmitting && setOpenCreateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle fontWeight={700}>Add New Product</DialogTitle>
        <Box component="form" onSubmit={handleCreateProduct}>
          <DialogContent dividers>
            {createError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {createError}
              </Alert>
            )}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Product Name"
                required
                fullWidth
                value={newProductData.name}
                onChange={(e) =>
                  setNewProductData({ ...newProductData, name: e.target.value })
                }
              />
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <TextField
                  label="Price ($)"
                  type="number"
                  required
                  fullWidth
                  inputProps={{ min: 0, step: "0.01" }}
                  value={newProductData.price}
                  onChange={(e) =>
                    setNewProductData({
                      ...newProductData,
                      price: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Stock Units"
                  type="number"
                  required
                  fullWidth
                  inputProps={{ min: 0 }}
                  value={newProductData.stock}
                  onChange={(e) =>
                    setNewProductData({
                      ...newProductData,
                      stock: e.target.value,
                    })
                  }
                />
              </Box>
              <TextField
                select
                label="Category"
                fullWidth
                value={newProductData.category}
                onChange={(e) =>
                  setNewProductData({
                    ...newProductData,
                    category: e.target.value,
                  })
                }
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Image URL"
                required
                fullWidth
                value={newProductData.image}
                onChange={(e) =>
                  setNewProductData({
                    ...newProductData,
                    image: e.target.value,
                  })
                }
              />
              <TextField
                label="Description"
                multiline
                rows={3}
                fullWidth
                value={newProductData.description}
                onChange={(e) =>
                  setNewProductData({
                    ...newProductData,
                    description: e.target.value,
                  })
                }
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              disabled={createSubmitting}
              onClick={() => setOpenCreateDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createSubmitting}
            >
              {createSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Save Product"
              )}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* EDIT PRODUCT MODAL */}
      <Dialog
        open={openEditDialog}
        onClose={() => !editSubmitting && setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle fontWeight={700}>Edit Product</DialogTitle>
        <Box component="form" onSubmit={handleUpdateProduct}>
          <DialogContent dividers>
            {editError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {editError}
              </Alert>
            )}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Product Name"
                required
                fullWidth
                value={editFormData.name}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, name: e.target.value })
                }
              />
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <TextField
                  label="Price ($)"
                  type="number"
                  required
                  fullWidth
                  inputProps={{ min: 0, step: "0.01" }}
                  value={editFormData.price}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, price: e.target.value })
                  }
                />
                <TextField
                  label="Stock Units"
                  type="number"
                  required
                  fullWidth
                  inputProps={{ min: 0 }}
                  value={editFormData.stock}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, stock: e.target.value })
                  }
                />
              </Box>
              <TextField
                select
                label="Category"
                fullWidth
                value={editFormData.category}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, category: e.target.value })
                }
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Image URL"
                required
                fullWidth
                value={editFormData.image}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, image: e.target.value })
                }
              />
              <TextField
                label="Description"
                multiline
                rows={3}
                fullWidth
                value={editFormData.description}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    description: e.target.value,
                  })
                }
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              disabled={editSubmitting}
              onClick={() => setOpenEditDialog(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={editSubmitting}>
              {editSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Update Product"
              )}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Container>
  );
}
