import { Box, Container, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#fff",
        borderTop: "1px solid #e0e0e0",
        py: 4,
        mt: "auto",
      }}
    >
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}>
            <Typography variant="h6" fontWeight={700} color="primary">
              MERN SHOP
            </Typography>
            <Typography variant="body2" color="text.secondary">
              High quality products built with the MERN stack.
            </Typography>
          </Box>
          <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "right" } }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} MERN Shop. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
