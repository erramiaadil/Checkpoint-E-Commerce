import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [delivering, setDelivering] = useState(false);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axiosClient.get(`/orders/${id}`);
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleDeliverOrder = async () => {
    try {
      setDelivering(true);
      const { data } = await axiosClient.put(`/orders/${order._id}/deliver`);
      setOrder(data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update delivery status");
    } finally {
      setDelivering(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || "Order not found"}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(isAdmin ? "/admin" : "/profile")}
        >
          {isAdmin ? "Back to Dashboard" : "Back to Orders"}
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: { xs: 2.5, sm: 4 } }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(isAdmin ? "/admin" : "/profile")}
        sx={{ mb: 3 }}
      >
        {isAdmin ? "Back to Admin Dashboard" : "Back to My Orders"}
      </Button>

      {/* Header */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Order #{order._id.slice(-8).toUpperCase()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
            {new Date(order.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </Box>

        {isAdmin && (
          <Chip
            label="Admin Viewing Mode"
            color="secondary"
            sx={{ fontWeight: 600 }}
          />
        )}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            md: "minmax(0, 2fr) minmax(280px, 1fr)",
          },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* Left column: Shipping, Payment, and Items */}
        <Box sx={{ minWidth: 0 }}>
          <Stack spacing={3}>
            {/* Customer & Shipping Details */}
            <Card sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Customer & Shipping
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="body1" sx={{ overflowWrap: "anywhere" }}>
                <strong>Recipient Name:</strong>{" "}
                {order.user?.name || "Customer"}
              </Typography>
              <Typography
                variant="body1"
                sx={{ mt: 0.5, overflowWrap: "anywhere" }}
              >
                <strong>Email:</strong> {order.user?.email || "N/A"}
              </Typography>
              <Typography
                variant="body1"
                sx={{ mt: 0.5, overflowWrap: "anywhere" }}
              >
                <strong>Shipping Address:</strong>{" "}
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Chip
                  label={order.isDelivered ? "Delivered" : "Delivery Pending"}
                  color={order.isDelivered ? "success" : "default"}
                  size="small"
                />
                {order.isDelivered && order.deliveredAt && (
                  <Typography variant="caption" color="text.secondary">
                    Delivered on{" "}
                    {new Date(order.deliveredAt).toLocaleDateString()}
                  </Typography>
                )}
              </Box>
            </Card>

            {/* Payment Method */}
            <Card sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Payment Information
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="body1">
                <strong>Selected Method:</strong> {order.paymentMethod}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip
                  label={order.isPaid ? "Paid" : "Payment Pending"}
                  color={order.isPaid ? "success" : "warning"}
                  size="small"
                />
              </Box>
            </Card>

            {/* Purchased Items Snapshot */}
            <Card sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Purchased Items ({order.orderItems.length})
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Stack spacing={2}>
                {order.orderItems.map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: { xs: "wrap", sm: "nowrap" },
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        minWidth: 0,
                        flex: "1 1 220px",
                      }}
                    >
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.name}
                        sx={{
                          width: 55,
                          height: 55,
                          borderRadius: 1,
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        component={Link}
                        to={`/product/${item.product}`}
                        sx={{
                          textDecoration: "none",
                          color: "inherit",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {item.name}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ ml: { xs: 8, sm: 0 }, overflowWrap: "anywhere" }}
                    >
                      {item.qty} × ${item.price.toFixed(2)} = $
                      {(item.qty * item.price).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Card>
          </Stack>
        </Box>

        {/* Right column: Order Summary & Admin Actions */}
        <Box sx={{ minWidth: 0 }}>
          <Card sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 1.5 }} />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography color="text.secondary" sx={{ minWidth: 0 }}>
                Items Subtotal
              </Typography>
              <Typography fontWeight={600}>
                ${order.itemsPrice.toFixed(2)}
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography color="text.secondary">Shipping Fee</Typography>
              <Typography fontWeight={600} color="success.main">
                {order.shippingPrice === 0
                  ? "Free"
                  : `$${order.shippingPrice.toFixed(2)}`}
              </Typography>
            </Box>

            <Divider sx={{ my: 1.5 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: isAdmin ? 3 : 0,
              }}
            >
              <Typography variant="h6" fontWeight={700}>
                Total
              </Typography>
              <Typography variant="h6" fontWeight={700} color="primary.main">
                ${order.totalPrice.toFixed(2)}
              </Typography>
            </Box>

            {/* Admin Action: Mark as Delivered button */}
            {isAdmin && !order.isDelivered && (
              <Button
                variant="contained"
                color="success"
                fullWidth
                size="large"
                startIcon={<CheckCircleOutlinedIcon />}
                disabled={delivering}
                onClick={handleDeliverOrder}
              >
                {delivering ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Mark as Delivered"
                )}
              </Button>
            )}

            {isAdmin && order.isDelivered && (
              <Alert severity="success" sx={{ mt: 1 }}>
                This order has been fulfilled.
              </Alert>
            )}
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
