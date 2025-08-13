import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import ProductCard from "./ProductCard";
import type { Product } from "../../types/Product";

interface ProductsSectionProps {
  products: Product[];
  title?: string;
  onProductSelect?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  onViewMore?: () => void;
  showViewMore?: boolean;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({
  products,
  title = "SẢN PHẨM",
  onProductSelect,
  onAddToCart,
  onToggleFavorite,
  onViewMore,
  showViewMore = true,
}) => {
  if (products.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          fontWeight="bold"
          sx={{ mb: 3 }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            height: 200,
            bgcolor: "#f0f8f0",
            borderRadius: 2,
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Đang cập nhật sản phẩm...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mb: 6 }}>
      <Typography variant="h4" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
        {title}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
            lg: "1fr 1fr 1fr 1fr",
          },
          gap: 3,
          mb: 3,
        }}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onProductSelect}
            onAddToCart={onAddToCart}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </Box>

      {showViewMore && (
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="outlined"
            size="large"
            onClick={onViewMore}
            sx={{ color: "#4caf50", borderColor: "#4caf50" }}
          >
            XEM THÊM SẢN PHẨM
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default ProductsSection;
