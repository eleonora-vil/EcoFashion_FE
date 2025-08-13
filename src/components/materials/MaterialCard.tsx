import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  SwipeableDrawer,
  styled,
  Drawer,
  Avatar,
  AppBar,
  Breadcrumbs,
  Link,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  LinearProgress,
  Tooltip,
  Tabs,
  Tab,
} from "@mui/material";
import "./MaterialCard.css";
import {
  FavoriteBorderOutlined,
  LocalShipping,
  Recycling,
  Star,
  ArrowBackIos,
  ArrowForwardIos,
  FavoriteBorder,
  Info,
} from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import type { MaterialDetailDto } from "../../schemas/materialSchema";
import SustainabilityToolbar from "./SustainabilityToolbar";
import SustainabilityCompact from "./SustainabilityCompact";
import TransportInfo from "./TransportInfo";
import ProductionInfo from "./ProductionInfo";
import { getSustainabilityColor, getMaterialTypeColor } from "../../utils/themeColors";
import { materialService } from "../../services/api/materialService";
import { useCartStore } from "../../store/cartStore";
import { toast } from "react-toastify";

interface MaterialCardProps {
  material: MaterialDetailDto;
  type?: string;
  onSelect?: (material: MaterialDetailDto) => void;
}

// Component để hiển thị chi tiết chứng nhận
const CertificationDetails = ({ certificationDetails }: { certificationDetails: string }) => {
  const certifications = certificationDetails.split(',').map(c => c.trim());
  
  const getCertificationLink = (cert: string) => {
    const certMap: { [key: string]: string } = {
      'GOTS': 'https://global-standard.org/',
      'OEKO-TEX': 'https://www.oeko-tex.com/',
      'GRS': 'https://textileexchange.org/standards/grs/',
      'RWS': 'https://textileexchange.org/standards/rws/',
      'USDA': 'https://www.usda.gov/topics/organic',
      'EU Ecolabel': 'https://ec.europa.eu/environment/ecolabel/',
      'Soil Association': 'https://www.soilassociation.org/'
    };
    
    return certMap[cert] || null;
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {certificationDetails}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        Các tổ chức cấp chứng nhận:
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {certifications.map((cert, index) => {
          const link = getCertificationLink(cert);
          return link ? (
            <Link 
              key={index}
              href={link} 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ 
                fontSize: '0.75rem',
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              {cert}
            </Link>
          ) : (
            <Typography key={index} variant="caption" color="text.secondary">
              {cert}
            </Typography>
          );
        })}
      </Box>
    </Box>
  );
};

const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  type,
  onSelect,
}) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [relatedMaterials, setRelatedMaterials] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [quantityError, setQuantityError] = useState("");
  const addToCart = useCartStore((state) => state.addToCart);

  const getTypeColor = (typeName?: string) => {
    if (!typeName) return "#9e9e9e";
    return getMaterialTypeColor(typeName);
  };

  const getAvailabilityColor = (quantity: number) => {
    if (quantity === 0) return "error" as const;
    if (quantity <= 10) return "warning" as const;
    return "success" as const;
  };

  const getAvailabilityText = (quantity: number) => {
    if (quantity === 0) return "Hết hàng";
    if (quantity <= 10) return "Số lượng có hạn";
    return "Còn hàng";
  };

  const getQuantityDisplay = (quantity: number) => {
    if (quantity === 0) return "Hết hàng";
    return `${quantity.toLocaleString('vi-VN')} mét vuông`;
  };

  const getSustainabilityScore = () => {
    // Ưu tiên sử dụng sustainability score từ backend
    if (material.sustainabilityScore !== undefined && material.sustainabilityScore !== null) {
      return material.sustainabilityScore;
    }
    
    // Fallback: nếu không có sustainability score từ backend, trả về 0
    return 0;
  };

  const sustainabilityScore = getSustainabilityScore();
  
  // Lấy sustainability level và color từ backend
  const sustainabilityLevel = material.sustainabilityLevel || 
    (sustainabilityScore >= 80 ? "Xuất sắc" : 
     sustainabilityScore >= 60 ? "Tốt" : 
     sustainabilityScore >= 40 ? "Trung bình" : "Cần cải thiện");
  
  const sustainabilityColor = material.sustainabilityColor || getSustainabilityColor(sustainabilityScore);
  const mainImage = material.imageUrls && material.imageUrls.length > 0 ? material.imageUrls[0] : "/assets/default-material.jpg";

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(material);
    } else {
      // Navigate to detail page instead of opening drawer
      navigate(`/material/${material.materialId}`);
    }
  };

  const fetchRelatedMaterials = async () => {
    try {
      const allMaterials = await materialService.getAllMaterials();
      const related = allMaterials
        .filter(m => m.materialId !== material.materialId && m.materialTypeName === material.materialTypeName)
        .slice(0, 3);
      setRelatedMaterials(related);
    } catch (error) {
      console.error("Error fetching related materials:", error);
    }
  };

  // Image navigation
  const handlePrevImage = () => {
    const images = material?.imageUrls ?? [];
    if (!images || images.length === 0) return;
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    const images = material?.imageUrls ?? [];
    if (!images || images.length === 0) return;
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Tab handling
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!quantity || quantity <= 0) {
      setQuantityError("Vui lòng nhập số lượng hợp lệ!");
      return;
    }
    if (quantity > material.quantityAvailable) {
      setQuantityError(`Chỉ còn ${material.quantityAvailable} mét có sẵn!`);
      return;
    }
    
    setQuantityError("");
    addToCart({
      id: (material.materialId || 0).toString(),
      name: material.name,
      image: material.imageUrls?.[0] || "/assets/default-material.jpg",
      price: material.pricePerUnit * 1000,
      quantity: quantity,
      unit: "mét",
      type: "material"
    });
    
    // Show success message
    toast.success(`Đã thêm ${quantity} mét ${material.name} vào giỏ hàng!`);
  };

  return (
    <>
      <Card
        sx={{
          width: "95%",
          height: "95%",
          position: type === "special" ? "absolute" : "relative",
          overflow: "hidden",
          zIndex: 1,
          "&:hover": {
            transform: "translateY(-4px)",
            transition: "all 0.3s ease",
            boxShadow: 3,
          },
          "&:hover .hover-trigger:hover + .card-hover-content": {
            opacity: 1,
            transform: "translateY(0)",
          },
          borderRadius: "10px",
          cursor: "pointer",
        }}
        onClick={handleCardClick}
      >
        <Box
          sx={{
            top: 8,
            left: 8,
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Material Tag */}
          <Box
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              justifyContent: "space-between",
            }}
          >
            <Chip
              icon={<Recycling />}
              label={`${sustainabilityScore.toFixed(1)}% Bền vững`}
              size="small"
              sx={{
                backgroundColor: "rgba(200, 248, 217, 1)",
                color: "rgba(22, 103, 86, 1)",
                fontSize: "15px",
                paddingTop: 2,
                paddingBottom: 2,
              }}
            />
          </Box>
          {/* Favorite */}
          <IconButton
            className="favorite-button"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
              backgroundColor: "white",
            }}
            onClick={handleToggleFavorite}
          >
            <FavoriteBorderOutlined 
              sx={{
                color: isFavorite ? "#f44336" : grey[600],
              }}
            />
          </IconButton>
        </Box>
        {/* Material Image */}
        <CardMedia
          component="img"
          image={mainImage}
          alt={material.name || "Material"}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            cursor: "pointer",
          }}
          onClick={handleCardClick}
        />
        <Box
          className="hover-trigger"
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: "70%",
            width: "100%",
            zIndex: 2,
            marginTop: "auto",
            cursor: "pointer",
          }}
          onClick={handleCardClick}
        />
        {/* Content */}
        <CardContent
          className="card-hover-content"
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "auto",
            background: "rgba(255, 255, 255, 1)",
            opacity: 0,
            transition: "opacity 0.3s ease, transform 0.3s ease",
            zIndex: 2,
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 2,
            backgroundImage: `
          linear-gradient(0deg,
            transparent 24%,
            #e1e1e1 26%,
            #e1e1e1 26%,
            transparent 27%,
            transparent 74%,
            #e1e1e1 75%,
            #e1e1e1 76%,
            transparent 77%,
            transparent
          ),
          linear-gradient(90deg,
            transparent 24%,
            #e1e1e1 25%,
            #e1e1e1 26%,
            transparent 27%,
            transparent 74%,
            #e1e1e1 75%,
            #e1e1e1 76%,
            transparent 77%,
            transparent
          )
        `,
            backgroundSize: "55px 55px",
            pointerEvents: "none",
          }}
        >
          <Box
            sx={{
              width: "90%",
              height: "90%",
              margin: "auto",
              textAlign: "left",
            }}
          >
            <Box
              onClick={handleCardClick}
              sx={{ cursor: "pointer" }}
            >
              {/* Type and Supplier */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Chip
                  label={material.materialTypeName || "Unknown"}
                  size="small"
                  sx={{
                    bgcolor: getTypeColor(material.materialTypeName),
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    paddingTop: 2,
                    paddingBottom: 2,
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {material.supplier?.supplierName || "Unknown Supplier"}
                </Typography>
              </Box>
              {/* Material Name */}
              <Typography
                fontWeight="bold"
                sx={{
                  fontSize: "25px",
                  width: "100%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  color: "black",
                }}
              >
                {material.name || "Unnamed Material"}
              </Typography>
              {/* Rating */}
              {material.supplier?.rating && (
                <Box display="flex" alignItems="center">
                  <Rating
                    value={material.supplier.rating}
                    readOnly
                    size="small"
                  />
                  <Typography variant="body2" ml={1}>
                    ({material.supplier.reviewCount || 0})
                  </Typography>
                </Box>
              )}
              {/* Price */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "#4caf50",
                  fontSize: "1.5rem",
                  mb: 1,
                }}
              >
                {(material.pricePerUnit * 1000)?.toLocaleString('vi-VN')} ₫/mét
              </Typography>
              {/* Sustainability Score - Sử dụng component compact cho card */}
              <Box sx={{ mb: 1 }}>
                <SustainabilityCompact 
                  sustainabilityScore={sustainabilityScore}
                  sustainabilityLevel={material.sustainabilityLevel}
                  sustainabilityColor={material.sustainabilityColor}
                />
              </Box>
              {/* Availability */}
              <Box sx={{ margin: "10px 0" }}>
                <Chip
                  label={getAvailabilityText(material.quantityAvailable)}
                  size="small"
                  color={getAvailabilityColor(material.quantityAvailable)}
                  icon={<LocalShipping sx={{ fontSize: 16 }} />}
                />
              </Box>
              {/* Sustainability highlights */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                {material.sustainabilityCriteria && material.sustainabilityCriteria.length > 0 && (
                  <Chip
                    size="small"
                    label={`${material.sustainabilityCriteria.length} Criteria`}
                    variant="outlined"
                    sx={{ fontSize: "0.6rem", height: "20px" }}
                  />
                )}
                {material.benchmarks && material.benchmarks.length > 0 && (
                  <Chip
                    size="small"
                    label={`${material.benchmarks.length} Benchmarks`}
                    variant="outlined"
                    sx={{ fontSize: "0.6rem", height: "20px" }}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default MaterialCard;