import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");
        // Calls GET /api/orders/myorders (token is injected automatically by axiosClient)
        const { data } = await axiosClient.get("/orders/myorders");
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order history");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Container sx={{ py: 4 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            md: "minmax(0, 1fr) minmax(0, 2fr)",
          },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* User Profile Card */}
        <Box sx={{ minWidth: 0 }}>
          <Card sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              User Profile
            </Typography>
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="body1" sx={{ overflowWrap: "anywhere" }}>
              <strong>Name:</strong> {user?.name}
            </Typography>
            <Typography
              variant="body1"
              sx={{ mt: 1, overflowWrap: "anywhere" }}
            >
              <strong>Email:</strong> {user?.email}
            </Typography>
            <Typography
              variant="body1"
              sx={{ mt: 1, overflowWrap: "anywhere" }}
            >
              <strong>Role:</strong> {user?.role}
            </Typography>
          </Card>
        </Box>

        {/* My Orders Card */}
        <Box sx={{ minWidth: 0 }}>
          <Card sx={{ p: { xs: 2, sm: 3 }, minWidth: 0 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              My Orders
            </Typography>
            <Divider sx={{ my: 1.5 }} />

            {/* Loading Indicator */}
            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={32} />
              </Box>
            )}

            {/* Error Message */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Empty State */}
            {!loading && !error && orders.length === 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ py: 4, textAlign: "center" }}
              >
                You have not placed any orders yet.
              </Typography>
            )}

            {/* Orders Table */}
            {!loading && !error && orders.length > 0 && (
              <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
                <Table size="small" sx={{ minWidth: 520 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Payment</TableCell>
                      <TableCell>Delivery</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((ord) => (
                      <TableRow key={ord._id}>
                        <TableCell
                          sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}
                        >
                          {ord._id.slice(-8).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell fontWeight={600}>
                          ${Number(ord.totalPrice).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={ord.isPaid ? "Paid" : "Unpaid"}
                            color={ord.isPaid ? "success" : "error"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={ord.isDelivered ? "Delivered" : "In Transit"}
                            color={ord.isDelivered ? "success" : "default"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => navigate(`/order/${ord._id}`)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
