import React, { useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Pagination,
  Select,
  MenuItem,
  Card,
  Chip,
  IconButton,
  Link,
  CardContent,
  Rating,
} from "@mui/material";
import FashionCard from "../fashion/FashionCard";
import type { Fashion } from "../../types/Fashion";
import type { Design } from "../../services/api/designService";
import { EcoIcon } from "../../assets/icons/icon";
import { FavoriteBorderOutlined } from "@mui/icons-material";

interface ProductsSectionProps {
  products: Design[];
  id?: any;
  type?: string;

  onProductSelect?: (product: Design) => void;
  onAddToCart?: (product: Design) => void;
  onToggleFavorite?: (product: Design) => void;
  onViewMore?: () => void;
  showViewMore?: boolean;
  //Pagination
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

const DesignsSection: React.FC<ProductsSectionProps> = ({
  products,
  id,
  type,
  currentPage,
  pageSize,
  onProductSelect,
  onAddToCart,
  onToggleFavorite,
  onViewMore,
  totalPages,
  // showViewMore = true,
}) => {
  if (!products) {
    return (
      <Container maxWidth="lg">
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
  // //Pagination
  // const productsPerPage = 12; // 9 rows * 4 per row
  const [page, setPage] = useState(currentPage);

  const getCategoryColor = (category: Design["designTypeName"]) => {
    const colors = {
      Áo: "#2196f3",
      Quần: "#ff9800",
      Đầm: "#4caf50",
      Váy: "#9c27b0",
    };
    return colors[category] || "#9e9e9e";
  };

  const handlePageScrollChange = (id: string, value: number) => {
    setPage(value);

    const element = document.getElementById(id);
    const navbarHeight =
      document.querySelector(".MuiAppBar-root")?.clientHeight || 0;

    if (element) {
      const y =
        element.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };
  return (
    <Box sx={{ width: "100%", textAlign: "center" }}>
      <Grid container spacing={2}>
        {/* {paginatedProducts.map((product) => ( */}
        {products.map((product) => (
          <Grid key={product.designId} size={3}>
            <FashionCard
              product={product}
              type={type}
              onSelect={onProductSelect}
              onAddToCart={onAddToCart}
              onToggleFavorite={onToggleFavorite}
            />
          </Grid>
        ))}
      </Grid>
      {/* <Box mt={4}>
        <Pagination
          count={pageSize}
          page={currentPage}
          variant="outlined"
          shape="rounded"
          onChange={(e, value) => {
            if (id) handlePageScrollChange(id, value);
          }}
          color="primary"
          size="large"
        />
      </Box> */}
    </Box>
  );
};

export default DesignsSection;
