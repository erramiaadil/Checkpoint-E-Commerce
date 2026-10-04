import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQty, totalPrice } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Your shopping cart is empty.
        </Typography>
        <Button variant="contained" component={Link} to="/" sx={{ mt: 2 }}>
          Discover Products
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Shopping Cart
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            md: "minmax(0, 2fr) minmax(260px, 1fr)",
          },
          gap: { xs: 2, md: 4 },
          alignItems: "start",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Stack spacing={2}>
            {cart.map((item) => (
              <Card
                key={item._id}
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1, sm: 2 },
                  minWidth: 0,
                }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.name}
                  sx={{
                    width: { xs: 64, sm: 80 },
                    height: { xs: 64, sm: 80 },
                    borderRadius: 1,
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="subtitle1" fontWeight={600} noWrap>
                    {item.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="primary.main"
                    fontWeight={700}
                  >
                    ${item.price.toFixed(2)}
                  </Typography>
                </Box>
                <TextField
                  type="number"
                  size="small"
                  inputProps={{ min: 1, max: 99 }}
                  value={item.qty}
                  onChange={(e) =>
                    updateQty(
                      item._id,
                      Math.max(1, parseInt(e.target.value) || 1),
                    )
                  }
                  sx={{ width: 70, flexShrink: 0 }}
                />
                <IconButton
                  color="error"
                  sx={{ flexShrink: 0 }}
                  onClick={() => removeFromCart(item._id)}
                >
                  <DeleteOutlinedIcon />
                </IconButton>
              </Card>
            ))}
          </Stack>
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 1.5 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography color="text.secondary">Subtotal</Typography>
              <Typography fontWeight={600}>${totalPrice.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography color="text.secondary">Shipping</Typography>
              <Typography fontWeight={600} color="success.main">
                Free
              </Typography>
            </Box>
            <Divider sx={{ my: 1.5 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              <Typography variant="h6" fontWeight={700}>
                Total
              </Typography>
              <Typography variant="h6" color="primary.main" fontWeight={700}>
                ${totalPrice.toFixed(2)}
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </Button>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
