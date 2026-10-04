import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useCart } from "../context/CartContext";

const steps = ["Shipping Address", "Payment Method", "Review & Place Order"];

export default function CheckoutPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [shipping, setShipping] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("Stripe");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleNext = async () => {
    setError("");

    // Step 0 validation: Ensure all fields are filled
    if (activeStep === 0) {
      if (
        !shipping.address.trim() ||
        !shipping.city.trim() ||
        !shipping.postalCode.trim() ||
        !shipping.country.trim()
      ) {
        setError(
          "Please fill out all shipping address fields before proceeding.",
        );
        return;
      }
    }

    // Last Step: Send Order to Backend
    if (activeStep === steps.length - 1) {
      if (cart.length === 0) {
        setError("Your cart is empty. Add products before placing an order.");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const orderData = {
          orderItems: cart,
          shippingAddress: shipping,
          paymentMethod,
          itemsPrice: totalPrice,
          shippingPrice: 0.0,
          totalPrice: totalPrice,
        };

        // 1. Capture the response properly
        const response = await axiosClient.post("/orders", orderData);
        const createdOrder = response.data;

        // 2. Clear the cart
        clearCart();

        // 3. Safely navigate to the receipt or profile
        if (createdOrder && createdOrder._id) {
          navigate(`/order/${createdOrder._id}`);
        } else {
          navigate("/profile");
        }
      } catch (err) {
        console.error("Checkout submission error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to place order. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card sx={{ p: { xs: 2, sm: 4 }, minWidth: 0 }}>
        <Stepper
          activeStep={activeStep}
          orientation={isSmallScreen ? "vertical" : "horizontal"}
          alternativeLabel={!isSmallScreen}
          sx={{ mb: { xs: 3, sm: 4 } }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Step 1: Shipping Details */}
        {activeStep === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Shipping Details
            </Typography>
            <TextField
              label="Street Address"
              fullWidth
              required
              disabled={loading}
              value={shipping.address}
              onChange={(e) =>
                setShipping({ ...shipping, address: e.target.value })
              }
            />
            <TextField
              label="City"
              fullWidth
              required
              disabled={loading}
              value={shipping.city}
              onChange={(e) =>
                setShipping({ ...shipping, city: e.target.value })
              }
            />
            <TextField
              label="Postal Code"
              fullWidth
              required
              disabled={loading}
              value={shipping.postalCode}
              onChange={(e) =>
                setShipping({ ...shipping, postalCode: e.target.value })
              }
            />
            <TextField
              label="Country"
              fullWidth
              required
              disabled={loading}
              value={shipping.country}
              onChange={(e) =>
                setShipping({ ...shipping, country: e.target.value })
              }
            />
          </Box>
        )}

        {/* Step 2: Payment Method */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Select Payment Method
            </Typography>
            <FormControl>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  value="Stripe"
                  control={<Radio />}
                  label="Credit or Debit Card (via Stripe)"
                />
                <FormControlLabel
                  value="PayPal"
                  control={<Radio />}
                  label="PayPal"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        )}

        {/* Step 3: Review Order */}
        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Confirm Order Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Deliver to:</strong> {shipping.address}, {shipping.city},{" "}
              {shipping.postalCode}, {shipping.country}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              <strong>Payment:</strong> {paymentMethod}
            </Typography>
            <Typography
              variant="h6"
              color="primary.main"
              fontWeight={700}
              sx={{ mt: 2 }}
            >
              Total: ${totalPrice.toFixed(2)} ({cart.length} items)
            </Typography>
          </Box>
        )}

        {/* Navigation Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            mt: { xs: 3, sm: 4 },
          }}
        >
          <Button
            disabled={activeStep === 0 || loading}
            sx={{ flex: { xs: 1, sm: "initial" } }}
            onClick={() => {
              setError("");
              setActiveStep((prev) => prev - 1);
            }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            disabled={loading}
            onClick={handleNext}
            sx={{ flex: { xs: 1, sm: "initial" } }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : activeStep === steps.length - 1 ? (
              "Place Order"
            ) : (
              "Continue"
            )}
          </Button>
        </Box>
      </Card>
    </Container>
  );
}
