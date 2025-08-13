import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
} from "@mui/icons-material";
import { Box, IconButton, Link, Typography } from "@mui/material";

function FooterInfo() {
  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(145deg, #141e30, #243b55)",
        color: "#ffffff",
        py: 4,
        px: { xs: 2, md: 8 },
        mt: 0,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 4,
          justifyContent: "space-between",
        }}
      >
        {/* About Us */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Eco Fashion - Sustainable fashion platform
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
            Thời trang bền vững cho tương lai tốt đẹp hơn. Kết nối các nhà thiết
            kế, nhà cung cấp và người tiêu dùng có ý thức.
          </Typography>
        </Box>

        {/* Quick Links */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Quick Links
          </Typography>
          <Box component="ul" sx={{ listStyle: "none", p: 0 }}>
            {["Home", "Our Story", "Contact Us", "Register"].map((text) => (
              <li key={text}>
                <Link
                  href={`/${text.replace(" ", "").toLowerCase()}`}
                  color="inherit"
                  underline="hover"
                  sx={{
                    display: "inline-block",
                    transition: "color 0.3s",
                    "&:hover": {
                      color: "#90caf9",
                    },
                  }}
                >
                  {text}
                </Link>
              </li>
            ))}
          </Box>
        </Box>

        {/* Contact Info */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Contact Us
          </Typography>
          <Typography variant="body2">
            123 Ecofashion Lane, Green City, Country
          </Typography>
          <Typography variant="body2">Phone: +123 456 7890</Typography>
          <Typography variant="body2">Email: info@ecofashion.com</Typography>
        </Box>
      </Box>

      {/* Social Media Icons */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Follow us on:
        </Typography>
        {[
          { icon: <Facebook />, href: "https://facebook.com" },
          { icon: <Twitter />, href: "https://twitter.com" },
          { icon: <Instagram />, href: "https://instagram.com" },
          { icon: <LinkedIn />, href: "https://linkedin.com" },
          { icon: <Email />, href: "mailto:info@ecofashion.com" },
        ].map(({ icon, href }, index) => (
          <IconButton
            key={index}
            href={href}
            target="_blank"
            sx={{
              color: "#ffffff",
              transition: "transform 0.3s, color 0.3s",
              "&:hover": {
                color: "#90caf9",
                transform: "scale(1.2)",
              },
            }}
          >
            {icon}
          </IconButton>
        ))}
      </Box>

      {/* Copyright */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography variant="caption" display="block" sx={{ color: "#cccccc" }}>
          &copy; {new Date().getFullYear()} Sustainable Fashion. All rights
          reserved.
        </Typography>
      </Box>
    </Box>
  );
}

export default FooterInfo;
