import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Box,
  Rating,
  IconButton,
  Button,
} from "@mui/material";
import {
  FavoriteBorder,
  LocalShipping,
  Recycling,
  ShoppingCart,
} from "@mui/icons-material";
import type { Product } from "../../types/Product";

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  onToggleFavorite,
}) => {
  const getCategoryColor = (category: Product["category"]) => {
    const colors = {
      clothing: "#2196f3",
      accessories: "#ff9800",
      footwear: "#4caf50",
      bags: "#9c27b0",
      home: "#607d8b",
    };
    return colors[category] || "#9e9e9e";
  };

  const getAvailabilityColor = (availability: Product["availability"]) => {
    const colors = {
      "in-stock": "success" as const,
      limited: "warning" as const,
      "pre-order": "info" as const,
      "out-of-stock": "error" as const,
    };
    return colors[availability];
  };

  const getAvailabilityText = (availability: Product["availability"]) => {
    const texts = {
      "in-stock": "Còn hàng",
      limited: "Số lượng có hạn",
      "pre-order": "Đặt trước",
      "out-of-stock": "Hết hàng",
    };
    return texts[availability];
  };

  const getSustainabilityScore = (
    sustainability: Product["sustainability"]
  ) => {
    let score = 0;

    // Carbon footprint score
    const carbonScores = {
      "very-low": 5,
      low: 4,
      medium: 3,
      high: 2,
      negative: 1,
    };
    score += carbonScores[sustainability.carbonFootprint] * 2;

    // Water usage score
    const waterScores = { "very-low": 4, low: 3, medium: 2, high: 1 };
    score += waterScores[sustainability.waterUsage] * 1.5;

    // Other factors
    if (sustainability.ethicalManufacturing) score += 3;
    if (sustainability.recyclable) score += 2;
    score += sustainability.durabilityRating * 0.5;

    return Math.min(Math.round(score / 4), 5); // Scale to 1-5
  };

  const formatPrice = (price: Product["price"]) => {
    const formatted = new Intl.NumberFormat("vi-VN").format(price.current);
    return `${formatted}₫`;
  };

  const formatOriginalPrice = (price: Product["price"]) => {
    if (!price.original) return null;
    const formatted = new Intl.NumberFormat("vi-VN").format(price.original);
    return `${formatted}₫`;
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart && product.availability !== "out-of-stock") {
      onAddToCart(product);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(product);
    }
  };

  const sustainabilityScore = getSustainabilityScore(product.sustainability);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
        },
        position: "relative",
      }}
      onClick={handleCardClick}
    >
      {/* Badges */}
      <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 1 }}>
        {product.isNew && !product.isBestSeller && (
          <Chip
            label="MỚI"
            size="small"
            sx={{
              bgcolor: "#e91e63",
              color: "white",
              fontWeight: "bold",
              display: "block",
            }}
          />
        )}
        {product.isBestSeller && !product.isNew && (
          <Chip
            label="BÁN CHẠY"
            size="small"
            sx={{
              mb: 0.5,
              bgcolor: "#ff9800",
              color: "white",
              fontWeight: "bold",
              display: "block",
            }}
          />
        )}
        {product.discountPercentage && product.discountPercentage > 0 && (
          <Chip
            label={`-${product.discountPercentage}%`}
            size="small"
            sx={{
              bgcolor: "#f44336",
              color: "white",
              fontWeight: "bold",
              display: "block",
            }}
          />
        )}
      </Box>

      {/* Favorite Button */}
      <IconButton
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 1,
          bgcolor: "rgba(255, 255, 255, 0.9)",
          "&:hover": { bgcolor: "rgba(255, 255, 255, 1)" },
        }}
        onClick={handleToggleFavorite}
      >
        <FavoriteBorder />
      </IconButton>

      <CardMedia
        component="img"
        height="240"
        image={product.image}
        alt={product.name}
        sx={{ objectFit: "cover" }}
      />

      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        {/* Category and Brand */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Chip
            label={product.category.toUpperCase()}
            size="small"
            sx={{
              bgcolor: getCategoryColor(product.category),
              color: "white",
              fontWeight: "bold",
              fontSize: "0.7rem",
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {product.brand}
          </Typography>
        </Box>

        {/* Product Name */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            mb: 1,
            fontWeight: "bold",
            fontSize: "1rem",
            lineHeight: 1.3,
            minHeight: "2.6rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.name}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Rating
            value={product.rating.average}
            precision={0.1}
            size="small"
            readOnly
          />
          <Typography variant="caption" sx={{ ml: 1, color: "text.secondary" }}>
            ({product.rating.count})
          </Typography>
        </Box>

        {/* Price */}
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", color: "#2e7d32" }}
          >
            {formatPrice(product.price)}
          </Typography>
          {product.price.original && (
            <Typography
              variant="body2"
              sx={{
                textDecoration: "line-through",
                color: "text.secondary",
                fontSize: "0.875rem",
              }}
            >
              {formatOriginalPrice(product.price)}
            </Typography>
          )}
        </Box>

        {/* Sustainability Score */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Recycling sx={{ fontSize: 16, color: "#4caf50", mr: 0.5 }} />
          <Rating
            value={sustainabilityScore}
            max={5}
            size="small"
            readOnly
            sx={{
              "& .MuiRating-iconFilled": { color: "#4caf50" },
              "& .MuiRating-iconEmpty": { color: "#e0e0e0" },
            }}
          />
          <Typography
            variant="caption"
            sx={{ ml: 0.5, color: "text.secondary" }}
          >
            Eco {sustainabilityScore}/5
          </Typography>
        </Box>

        {/* Materials */}
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: "bold" }}
          >
            Nguyên liệu:
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            {product.sustainability.materials.slice(0, 2).join(", ")}
            {product.sustainability.materials.length > 2 && "..."}
          </Typography>
        </Box>

        {/* Availability */}
        <Box sx={{ mb: 2 }}>
          <Chip
            label={getAvailabilityText(product.availability)}
            size="small"
            color={getAvailabilityColor(product.availability)}
            icon={<LocalShipping sx={{ fontSize: 16 }} />}
          />
        </Box>

        {/* Add to Cart Button */}
        <Button
          variant="contained"
          fullWidth
          startIcon={<ShoppingCart />}
          onClick={handleAddToCart}
          disabled={product.availability === "out-of-stock"}
          sx={{
            mt: "auto",
            bgcolor: "#2e7d32",
            "&:hover": { bgcolor: "#1b5e20" },
            "&:disabled": { bgcolor: "#bdbdbd" },
          }}
        >
          {product.availability === "out-of-stock"
            ? "Hết hàng"
            : product.availability === "pre-order"
            ? "Đặt trước"
            : "Thêm vào giỏ"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
