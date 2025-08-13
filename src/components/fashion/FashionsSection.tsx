import React, { useRef, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Grid,
} from "@mui/material";
import "./FashionCard.css";
import FashionCard from "./FashionCard";
import type { Fashion } from "../../types/Fashion";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Design } from "../../services/api/designService";
import { href, useNavigate, useNavigation } from "react-router-dom";
interface ProductsSectionProps {
  products: Design[];
  title?: string;
  type?: string;
  onProductSelect?: (product: Design) => void;
  onAddToCart?: (product: Design) => void;
  onToggleFavorite?: (product: Design) => void;
  onViewMore?: () => string;
  showViewMore?: boolean;
}

const FashionsSection: React.FC<ProductsSectionProps> = ({
  products,
  title,
  type,
  onProductSelect,
  onAddToCart,
  onToggleFavorite,
  onViewMore,
  // showViewMore = true,
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
  //Change image
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 4;

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + 1, Math.max(0, products.length - visibleCount))
    );
  };

  const visibleProducts = products.slice(startIndex, startIndex + visibleCount);

  const navigate = useNavigate();
  return (
    <Box
      sx={{
        marginBottom: "30px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        margin: "auto",
        padding: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h2" fontWeight="bold">
          {title}
        </Typography>
        <Box>
          <IconButton onClick={handlePrev} disabled={startIndex === 0}>
            <ArrowBack sx={{ fontSize: "40px" }} />
          </IconButton>
          <IconButton
            onClick={handleNext}
            disabled={startIndex + visibleCount >= products.length}
          >
            <ArrowForward sx={{ fontSize: "40px" }} />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ width: "100%", gap: 2 }}>
        <Grid container spacing={2}>
          {visibleProducts.map((product) => (
            <Grid key={product.designId} size={3}>
              {type === "special" ? (
                <div className="design-card">
                  <FashionCard
                    product={product}
                    type={type}
                    onSelect={onProductSelect}
                    onAddToCart={onAddToCart}
                    onToggleFavorite={onToggleFavorite}
                  />
                </div>
              ) : (
                <FashionCard
                  product={product}
                  type={type}
                  onSelect={onProductSelect}
                  onAddToCart={onAddToCart}
                  onToggleFavorite={onToggleFavorite}
                />
              )}
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ textAlign: "center", paddingTop: 2, paddingBottom: 2 }}>
          <Button
          variant="outlined"
          size="large"
            onClick={() => onViewMore ? navigate(onViewMore()) : navigate('/fashion')}
          sx={{
            color: "rgba(22, 163, 74, 1)",
            borderColor: "rgba(22, 163, 74, 1)",
            fontWeight: "bold",
          }}
        >
          XEM THÊM SẢN PHẨM
        </Button>
      </Box>
    </Box>
  );
};

export default FashionsSection;
