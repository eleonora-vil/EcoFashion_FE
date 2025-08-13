import React, { useRef, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Grid,
  CircularProgress,
  Chip,
} from "@mui/material";
import MaterialCard from "./MaterialCard";
import type { MaterialDetailDto } from "../../schemas/materialSchema";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

interface MaterialsSectionProps {
  materials: MaterialDetailDto[];
  title?: string;
  type?: string;
  onMaterialSelect?: (material: MaterialDetailDto) => void;
  onViewMore?: () => void;
  loading?: boolean;
  error?: string | null;
  showViewMore?: boolean;
}

const MaterialsSection: React.FC<MaterialsSectionProps> = ({
  materials,
  title,
  type,
  onMaterialSelect,
  onViewMore,
  loading = false,
  error = null,
  // showViewMore = true,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 4;

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + 1, Math.max(0, materials.length - visibleCount))
    );
  };

  const visibleMaterials = materials.slice(startIndex, startIndex + visibleCount);

  if (loading) {
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
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
            bgcolor: "#ffebee",
            borderRadius: 2,
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" color="error">
            Lỗi: {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  if (materials.length === 0) {
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
            bgcolor: "#e8f5e8",
            borderRadius: 2,
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Đang cập nhật nguyên liệu...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        marginBottom: "30px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        width: "90%",
        margin: "auto",
        paddingTop: 2,
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
            disabled={startIndex + visibleCount >= materials.length}
          >
            <ArrowForward sx={{ fontSize: "40px" }} />
          </IconButton>
        </Box>
      </Box>
      
      {/* Sustainability Stats removed as requested */}
      
      <Box sx={{ width: "100%", gap: 2 }}>
        <Grid container spacing={2}>
          {visibleMaterials.map((material) => (
            <Grid key={material.materialId} size={3}>
              {type === "special" ? (
                <div className="card">
                  <MaterialCard
                    material={material}
                    type={type}
                    onSelect={onMaterialSelect}
                  />
                </div>
              ) : (
                <MaterialCard
                  material={material}
                  type={type}
                  onSelect={onMaterialSelect}
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
          onClick={onViewMore}
          sx={{
            color: "rgba(22, 163, 74, 1)",
            borderColor: "rgba(22, 163, 74, 1)",
            fontWeight: "bold",
          }}
        >
          XEM THÊM NGUYÊN LIỆU
        </Button>
      </Box>
    </Box>
  );
};

export default MaterialsSection; 