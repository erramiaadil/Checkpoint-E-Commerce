import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const SearchContainer = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  width: "100%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  },
}));

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?keyword=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <AppBar position="sticky" elevation={1}>
        <Toolbar
          sx={{ justifyContent: "space-between", px: { xs: 1.5, sm: 3 } }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", flexWrap: "nowrap" }}
          >
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 1, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <StorefrontIcon sx={{ mr: 1, flexShrink: 0 }} />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              MERN SHOP
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{ display: { xs: "none", md: "block" }, width: "380px", mx: 2 }}
          >
            <SearchContainer>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchContainer>
          </Box>

          <Box display="flex" alignItems="center" gap={{ xs: 0.5, sm: 1.5 }}>
            {user?.role === "admin" && (
              <Button
                color="inherit"
                component={Link}
                to="/admin"
                sx={{ display: { xs: "none", md: "inline-flex" } }}
              >
                Dashboard
              </Button>
            )}

            {user ? (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/profile"
                  sx={{ display: { xs: "none", md: "inline-flex" } }}
                >
                  Profile
                </Button>
                <IconButton
                  color="inherit"
                  onClick={logout}
                  sx={{ display: { xs: "none", md: "inline-flex" } }}
                >
                  <LogoutIcon />
                </IconButton>
              </>
            ) : (
              <Button
                color="inherit"
                component={Link}
                to="/login"
                sx={{ display: { xs: "none", md: "inline-flex" } }}
              >
                Login
              </Button>
            )}

            <IconButton color="inherit" component={Link} to="/cart">
              <Badge badgeContent={totalItems} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>

        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{ display: { xs: "block", md: "none" }, px: 2, pb: 1.5 }}
        >
          <SearchContainer>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
        </Box>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        <Box
          sx={{ width: 260, pt: 2 }}
          role="presentation"
          onClick={() => setMobileOpen(false)}
        >
          <Box px={2.5} pb={1.5} display="flex" alignItems="center" gap={1}>
            <StorefrontIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
              MERN SHOP
            </Typography>
          </Box>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/">
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            {user?.role === "admin" && (
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/admin">
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Admin Dashboard" />
                </ListItemButton>
              </ListItem>
            )}
            {user ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/profile">
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={logout}>
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/login">
                  <ListItemText primary="Login" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
