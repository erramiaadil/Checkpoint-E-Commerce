import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Rating,
  Box,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        transition: "transform 0.2s",
        "&:hover": { transform: { sm: "translateY(-4px)" }, boxShadow: 4 },
      }}
    >
      <CardMedia
        component="img"
        image={product.image}
        alt={product.name}
        sx={{ height: 190, objectFit: "cover", cursor: "pointer" }}
        onClick={() => navigate(`/product/${product._id}`)}
      />
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          noWrap
          title={product.name}
          sx={{ cursor: "pointer" }}
          onClick={() => navigate(`/product/${product._id}`)}
        >
          {product.name}
        </Typography>

        <Box display="flex" alignItems="center" my={0.5}>
          <Rating
            value={product.rating || 0}
            precision={0.5}
            size="small"
            readOnly
          />
          <Typography variant="caption" color="text.secondary" ml={0.5}>
            ({product.numReviews || 0})
          </Typography>
        </Box>

        <Typography variant="h6" color="primary.main" fontWeight={700}>
          ${Number(product.price).toFixed(2)}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddShoppingCartIcon />}
          onClick={() => addToCart(product, 1)}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
}
