import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import axiosClient from "../api/axiosClient";

const CATEGORIES = [
  "All",
  "Electronics",
  "Wearables",
  "Accessories",
  "Footwear",
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");

  // Read search query parameter from URL (?keyword=...)
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        // Build query with category and keyword parameters
        const params = new URLSearchParams();
        if (selectedCat !== "All") params.append("category", selectedCat);
        if (keyword) params.append("keyword", keyword);

        const queryString = params.toString() ? `?${params.toString()}` : "";
        const { data } = await axiosClient.get(`/products${queryString}`);
        setProducts(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCat, keyword]); // Re-fetch whenever selected category OR keyword changes

  return (
    <Container sx={{ py: { xs: 2.5, sm: 4 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {keyword ? `Search Results for "${keyword}"` : "Our Products"}
        </Typography>

        {keyword && (
          <Button
            size="small"
            onClick={() => navigate("/")}
            sx={{ mb: 1, textTransform: "none" }}
          >
            Clear Search Filter ✕
          </Button>
        )}

        <Typography variant="body2" color="text.secondary">
          Select from top quality verified items.
        </Typography>
      </Box>

      {/* Categories Bar */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ mb: 3, overflowX: "auto", pb: 1 }}
      >
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            clickable
            color={selectedCat === cat ? "primary" : "default"}
            onClick={() => setSelectedCat(cat)}
          />
        ))}
      </Stack>

      {/* Loading Spinner */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ py: 6, textAlign: "center" }}
        >
          No products matched your search.
        </Typography>
      )}

      {/* Dynamic Product Grid */}
      {!loading && !error && products.length > 0 && (
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {products.map((p) => (
            <Grid key={p._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <ProductCard product={p} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
