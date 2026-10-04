import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useCart } from "../context/CartContext";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await axiosClient.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load product details",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || "Product not found"}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/")}>
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            md: "repeat(2, minmax(0, 1fr))",
          },
          gap: { xs: 3, md: 5 },
          alignItems: "start",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Box
            component="img"
            src={product.image}
            alt={product.name}
            sx={{
              width: "100%",
              aspectRatio: "1 / 1",
              maxHeight: 450,
              objectFit: "cover",
              borderRadius: 2,
            }}
          />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {product.name}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
              mb: 2,
            }}
          >
            <Rating value={product.rating || 0} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary">
              ({product.numReviews || 0} customer reviews)
            </Typography>
          </Box>
          <Typography
            variant="h5"
            color="primary.main"
            fontWeight={700}
            sx={{ mb: 2 }}
          >
            ${Number(product.price).toFixed(2)}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {product.description}
          </Typography>
          <Typography
            variant="subtitle2"
            color={product.stock > 0 ? "success.main" : "error.main"}
            sx={{ mb: 3 }}
          >
            {product.stock > 0
              ? `In Stock (${product.stock} units available)`
              : "Out of Stock"}
          </Typography>

          {product.stock > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                mb: 3,
              }}
            >
              <TextField
                type="number"
                label="Quantity"
                size="small"
                inputProps={{ min: 1, max: product.stock }}
                value={qty}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) {
                    // Prevent entering less than 1 or more than available stock
                    setQty(Math.min(product.stock, Math.max(1, val)));
                  }
                }}
                sx={{
                  width: 100,
                  "& .MuiInputBase-root": { height: 48 },
                }}
              />
              <Button
                variant="contained"
                size="large"
                sx={{ height: 48 }}
                onClick={() => {
                  addToCart(product, qty);
                  navigate("/cart");
                }}
              >
                Add to Cart
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}
