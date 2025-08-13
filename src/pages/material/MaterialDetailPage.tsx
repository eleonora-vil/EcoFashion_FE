import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Rating,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Breadcrumbs,
  Link,
  TextField,
  Alert,
  Dialog,
  DialogContent,
} from "@mui/material";
import {
  FavoriteBorder,
  LocalShipping,
  ArrowBackIos,
  ArrowForwardIos,
  ShoppingCart,
  ZoomIn,
  ZoomOut,
  Close,
} from "@mui/icons-material";
import { materialService } from "../../services/api/materialService";
import { useCartStore } from "../../store/cartStore";
import { toast } from "react-toastify";
import SustainabilityToolbar from "../../components/materials/SustainabilityToolbar";
import SustainabilityCompact from "../../components/materials/SustainabilityCompact";
import ProductionInfo from "../../components/materials/ProductionInfo";
import {
  getSustainabilityColor,
  getMaterialTypeColor,
} from "../../utils/themeColors";
import type { MaterialDetailResponse, MaterialDetailDto, MaterialSustainabilityReport } from "../../schemas/materialSchema";

// Constants
const PRICE_MULTIPLIER = 1000; // Convert from backend unit to VND

// Component để hiển thị chi tiết chứng nhận
const CertificationDetails = ({
  certificationDetails,
}: {
  certificationDetails: string;
}) => {
  if (!certificationDetails) {
    return (
      <Typography variant="body2" color="text.secondary">
        Chưa có thông tin chứng nhận
      </Typography>
    );
  }

  const certifications = certificationDetails
    .split(",")
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  if (certifications.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        {certificationDetails}
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {certificationDetails}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mb: 1 }}
      >
        Các tổ chức cấp chứng nhận:
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {certifications.map((cert, index) => (
          <Typography key={index} variant="caption" color="text.secondary">
            {cert}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

const MaterialDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [material, setMaterial] = useState<MaterialDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [quantityError, setQuantityError] = useState("");
  const [relatedMaterials, setRelatedMaterials] = useState<MaterialDetailDto[]>(
    []
  );
  const [sustainabilityReport, setSustainabilityReport] = useState<MaterialSustainabilityReport | null>(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1.5);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  // Hover magnifier state
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [hovering, setHovering] = useState(false);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const lensSize = 120; // px
  const hoverZoom = 2.2; // scale for preview box

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchMaterial = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const materialData = await materialService.getMaterialById(
          parseInt(id)
        );
        setMaterial(materialData);

        // Fetch sustainability report
        try {
          const sustainabilityData = await materialService.getMaterialSustainability(parseInt(id));
          setSustainabilityReport(sustainabilityData);
        } catch (err) {
          console.error("Error fetching sustainability report:", err);
          // Continue without sustainability report
        }

        // Fetch related materials
        const allMaterials = await materialService.getAllMaterials();
        const related = allMaterials
          .filter(
            (m) =>
              m.materialId !== materialData.materialId &&
              m.materialTypeName === materialData.materialTypeName &&
              m.materialTypeName != null
          )
          .slice(0, 3);
        setRelatedMaterials(related);
      } catch (err) {
        setError("Không thể tải thông tin nguyên liệu");
        console.error("Error fetching material:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [id]);

  const getTypeColor = (typeName?: string) => {
    if (!typeName) return "#9e9e9e";
    return getMaterialTypeColor(typeName);
  };

    const getSustainabilityScore = () => {
    if (
      material?.sustainabilityScore !== undefined &&
      material.sustainabilityScore !== null
    ) {
      return material.sustainabilityScore;
    }
  
    // Fallback: nếu không có sustainability score từ backend, trả về 0
    // vì recycled percentage không còn là tiêu chí đánh giá chính
    return 0;
  };

  const handlePrevImage = () => {
    if (!material?.imageUrls || material.imageUrls.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? material.imageUrls.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!material?.imageUrls || material.imageUrls.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === material.imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const openZoom = () => {
    setZoomScale(1.5);
    setOffset({ x: 0, y: 0 });
    setZoomOpen(true);
  };
  const onMouseDown = (e: React.MouseEvent) => { setDragging(true); setLastPos({ x: e.clientX, y: e.clientY }); };
  const onMouseMove = (e: React.MouseEvent) => { if (!dragging) return; const dx = e.clientX - lastPos.x; const dy = e.clientY - lastPos.y; setOffset(o => ({ x: o.x + dx, y: o.y + dy })); setLastPos({ x: e.clientX, y: e.clientY }); };
  const onMouseUp = () => setDragging(false);
  const onWheel = (e: React.WheelEvent) => { e.preventDefault(); const delta = e.deltaY < 0 ? 0.1 : -0.1; setZoomScale(z => Math.min(4, Math.max(1, z + delta))); };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleAddToCart = () => {
    if (!material) return;

    if (!quantity || quantity <= 0) {
      setQuantityError("Vui lòng nhập số lượng hợp lệ!");
      return;
    }
    if (quantity > (material.quantityAvailable || 0)) {
      setQuantityError(
        `Chỉ còn ${material.quantityAvailable || 0} mét có sẵn!`
      );
      return;
    }

    setQuantityError("");
    addToCart({
      id: (material.materialId || 0).toString(),
      name: material.name || "Nguyên liệu",
      image: material.imageUrls?.[0] || "",
      price: (material.pricePerUnit || 0) * PRICE_MULTIPLIER,
      quantity: quantity,
      unit: "mét",
      type: "material",
      sellerId: material.supplier?.supplierId || "unknown",
      sellerName: material.supplier?.supplierName || "Nhà cung cấp",
    });

    toast.success(
      `Đã thêm ${quantity} mét ${
        material.name || "Nguyên liệu"
      } vào giỏ hàng! 💡 Kiểm tra số lượng trong giỏ hàng.`
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography>Đang tải...</Typography>
      </Box>
    );
  }

  if (error || !material) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography color="error">
          {error || "Không tìm thấy nguyên liệu"}
        </Typography>
      </Box>
    );
  }

  const sustainabilityScore = getSustainabilityScore();
  const sustainabilityLevel =
    material.sustainabilityLevel ||
    (sustainabilityScore >= 80
      ? "Xuất sắc"
      : sustainabilityScore >= 60
      ? "Tốt"
      : sustainabilityScore >= 40
      ? "Trung bình"
      : "Cần cải thiện");

  const sustainabilityColor =
    material.sustainabilityColor || getSustainabilityColor(sustainabilityScore);
  const mainImage =
    material.imageUrls && material.imageUrls.length > 0
      ? material.imageUrls[0]
      : "";

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "white",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/">
              Trang chủ
            </Link>
            <Link underline="hover" color="inherit" href="/materials">
              Nguyên liệu
            </Link>
            <Typography color="text.primary">
              {material.name || "Nguyên liệu"}
            </Typography>
          </Breadcrumbs>
        </Box>
      </AppBar>

      <Box
        sx={{ mx: "auto", width: "100%", bgcolor: "#fff", minHeight: "100vh" }}
      >
        {/* Main Content */}
        <Box
          sx={{
            py: 3,
            px: 4,
            display: "flex",
            gap: 4,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* Left: Images */}
          <Box sx={{ width: { xs: "100%", md: "50%" } }}>
            {/* Main Image with Navigation */}
            <Box sx={{ position: "relative", mb: 2 }}>
              <Box
                component="img"
                ref={imgRef}
                src={
                  material.imageUrls && material.imageUrls.length > 0
                    ? material.imageUrls[currentImageIndex] || mainImage
                    : mainImage
                }
                alt={material.name || "Material"}
                sx={{
                  width: "100%",
                  height: { xs: "300px", md: "60vh" },
                  borderRadius: 2,
                  objectFit: "cover",
                  cursor: "zoom-in",
                }}
                onClick={openZoom}
                onMouseEnter={(e) => {
                  setHovering(true);
                  const rect = (e.currentTarget as HTMLImageElement).getBoundingClientRect();
                  setImgSize({ w: rect.width, h: rect.height });
                }}
                onMouseMove={(e) => {
                  if (!imgRef.current) return;
                  const rect = imgRef.current.getBoundingClientRect();
                  let x = e.clientX - rect.left;
                  let y = e.clientY - rect.top;
                  // clamp within image
                  x = Math.max(0, Math.min(rect.width, x));
                  y = Math.max(0, Math.min(rect.height, y));
                  setHoverPos({ x, y });
                }}
                onMouseLeave={() => setHovering(false)}
              />
              {/* Lens overlay */}
              {hovering && (
                <Box
                  sx={{
                    position: "absolute",
                    top: Math.max(0, Math.min(imgSize.h - lensSize, hoverPos.y - lensSize / 2)),
                    left: Math.max(0, Math.min(imgSize.w - lensSize, hoverPos.x - lensSize / 2)),
                    width: lensSize,
                    height: lensSize,
                    border: "2px solid rgba(255,255,255,0.9)",
                    borderRadius: 1,
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.15)",
                    pointerEvents: "none",
                  }}
                />
              )}
              {/* Preview box (magnifier) */}
              {hovering && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 12,
                    left: "calc(100% + 16px)",
                    width: 320,
                    height: 320,
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                    backgroundColor: "#fff",
                    backgroundImage: `url(${material.imageUrls && material.imageUrls.length > 0 ? material.imageUrls[currentImageIndex] || mainImage : mainImage})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: `${imgSize.w * hoverZoom}px ${imgSize.h * hoverZoom}px`,
                    backgroundPosition: `${(hoverPos.x / imgSize.w) * 100}% ${(hoverPos.y / imgSize.h) * 100}%`,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    zIndex: 1300,
                    pointerEvents: "none",
                  }}
                />
              )}
              {material.imageUrls &&
                material.imageUrls.length > 1 &&
                material.imageUrls.length > 0 && (
                  <>
                    <IconButton
                      onClick={handlePrevImage}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: 8,
                        transform: "translateY(-50%)",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 1)",
                        },
                      }}
                    >
                      <ArrowBackIos fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={handleNextImage}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        right: 8,
                        transform: "translateY(-50%)",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 1)",
                        },
                      }}
                    >
                      <ArrowForwardIos fontSize="small" />
                    </IconButton>
                  </>
                )}
            </Box>

            {/* Thumbnail Images */}
            {material.imageUrls &&
              material.imageUrls.length > 1 &&
              material.imageUrls.length > 0 && (
                <Box sx={{ display: "flex", gap: 1 }}>
                  {material.imageUrls.slice(0, 4).map((img, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      onClick={() => setCurrentImageIndex(index)}
                      sx={{
                        width: "23%",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: 1,
                        cursor: "pointer",
                        border:
                          index === currentImageIndex
                            ? "2px solid #1976d2"
                            : "1px solid #ccc",
                      }}
                    />
                  ))}
                </Box>
              )}
          </Box>

          {/* Right: Material Info */}
          <Box sx={{ width: { xs: "100%", md: "50%" } }}>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                  {material.name || "Nguyên liệu"}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Mã: M{(material.materialId || 0)?.toString().padStart(3, "0")}
                </Typography>
                <Chip
                  label={material.materialTypeName || "Chưa phân loại"}
                  color="primary"
                  size="small"
                  sx={{ mb: 1 }}
                />
              </Box>
              <IconButton onClick={() => setIsFavorite(!isFavorite)}>
                <FavoriteBorder
                  sx={{
                    fontSize: 28,
                    color: isFavorite ? "#f44336" : "inherit",
                  }}
                />
              </IconButton>
            </Box>

            {/* Supplier Info */}
            <Box sx={{ mb: 3, p: 2, bgcolor: "#f8f9fa", borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                Nhà cung cấp
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={material.supplier?.avatarUrl}
                  sx={{ width: 50, height: 50 }}
                >
                  {material.supplier?.supplierName?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {material.supplier?.supplierName}
                  </Typography>
                  {material.supplier?.rating && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Rating
                        value={material.supplier.rating}
                        readOnly
                        size="small"
                      />
                      <Typography variant="body2">
                        ({material.supplier.reviewCount || 0} đánh giá)
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Price and Availability */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h4"
                color="primary"
                fontWeight="bold"
                sx={{ mb: 1 }}
              >
                {(
                  (material.pricePerUnit || 0) * PRICE_MULTIPLIER
                )?.toLocaleString("vi-VN")}{" "}
                ₫/mét
              </Typography>
              <Chip
                label={
                  (material.quantityAvailable || 0) > 0
                    ? "Còn hàng"
                    : "Hết hàng"
                }
                color={
                  (material.quantityAvailable || 0) > 0 ? "success" : "error"
                }
                icon={<LocalShipping />}
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                Còn lại:{" "}
                {(material.quantityAvailable || 0).toLocaleString("vi-VN")} mét
              </Typography>
            </Box>

            {/* Sustainability Score */}
            <Box sx={{ mb: 3, p: 2, bgcolor: "#e8f5e8", borderRadius: 2 }}>
              <SustainabilityToolbar
                sustainabilityScore={sustainabilityScore}
                sustainabilityLevel={material.sustainabilityLevel}
                sustainabilityColor={material.sustainabilityColor}
                showDetails={false}
              />
            </Box>

            {/* Add to Cart Section */}
            <Box sx={{ mb: 3, p: 2, bgcolor: "#f8f9fa", borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Thêm vào giỏ hàng
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 2, display: "block" }}
              >
                💡 Gợi ý: Nhập số lượng mét cần mua
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 2, display: "block" }}
              >
                📐 Phân loại kích cỡ (ước tính khổ vải 1.4m): 1m ≈ (1 × 1.4m), 2m ≈ (2 × 1.4m), 3m ≈ (3 × 1.4m)
              </Typography>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <TextField
                  type="number"
                  label="Số lượng (mét)"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  inputProps={{ min: 1, max: material.quantityAvailable || 0 }}
                  sx={{ width: 150 }}
                />
                <Typography variant="body2" color="text.secondary">
                  / {(material.quantityAvailable || 0).toLocaleString("vi-VN")}{" "}
                  mét có sẵn
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 1 }}
                >
                  💡 Ví dụ: Nhập 10 = 10 mét vải
                </Typography>
              </Box>

              {quantityError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {quantityError}
                </Alert>
              )}

              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={(material.quantityAvailable || 0) === 0}
                fullWidth
              >
                Thêm vào giỏ hàng
              </Button>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                fullWidth
                disabled={(material.quantityAvailable || 0) === 0}
              >
                Liên hệ nhà cung cấp
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() =>
                  navigate(
                    `/supplier/${
                      material.supplier?.supplierId || 0
                    }`
                  )
                }
              >
                Xem hồ sơ
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Tabs Section */}
        <Box sx={{ borderTop: "1px solid #e0e0e0" }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTab-root": {
                fontWeight: "bold",
              },
            }}
          >
            <Tab label="Thông tin chi tiết" />
            <Tab label="Tính bền vững" />
            <Tab label="Đánh giá" />
            <Tab label="Tài liệu" />
          </Tabs>

          {/* Tab Content */}
          <Box sx={{ p: 4 }}>
            {/* Tab 1: Thông số kỹ thuật */}
            {tabIndex === 0 && (
              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                  Thông số kỹ thuật
                </Typography>

                <List>
                  <ListItem>
                    <ListItemText
                      primary="Điểm bền vững tổng hợp"
                      secondary={`${sustainabilityScore.toFixed(1)}% (dựa trên 5 tiêu chí, mỗi tiêu chí 20% trọng số)`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Cách tính điểm"
                      secondary="Carbon (20%) + Water (20%) + Waste (20%) + Certification (20%) + Transport (20%) = 100%"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Số lượng có sẵn"
                      secondary={`${(
                        material.quantityAvailable || 0
                      ).toLocaleString("vi-VN")} mét`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Giá trên đơn vị"
                      secondary={`${(
                        (material.pricePerUnit || 0) * PRICE_MULTIPLIER
                      )?.toLocaleString("vi-VN")} ₫/mét`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Tổng giá trị kho"
                      secondary={`${(
                        (material.quantityAvailable || 0) *
                        (material.pricePerUnit || 0) *
                        PRICE_MULTIPLIER
                      ).toLocaleString("vi-VN")} ₫`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Ngày tạo"
                      secondary={
                        material.createdAt
                          ? new Date(material.createdAt).toLocaleDateString(
                              "vi-VN"
                            )
                          : "Chưa có thông tin"
                      }
                    />
                  </ListItem>

                  {/* Thông tin sản xuất */}
                  {(material.productionCountry ||
                    material.productionRegion ||
                    material.manufacturingProcess) && (
                    <ListItem
                      sx={{ flexDirection: "column", alignItems: "flex-start" }}
                    >
                      <ListItemText primary="Thông tin sản xuất" />
                      <Box sx={{ mt: 1, ml: 2, width: "100%" }}>
                        <ProductionInfo
                          country={material.productionCountry}
                          region={material.productionRegion}
                          process={material.manufacturingProcess}
                          showDescription={true}
                        />
                      </Box>
                    </ListItem>
                  )}



                  {/* Chứng nhận bền vững */}
                  {material.certificationDetails && (
                    <ListItem
                      sx={{ flexDirection: "column", alignItems: "flex-start" }}
                    >
                      <ListItemText primary="Chứng nhận bền vững" />
                      <Box sx={{ mt: 1, ml: 2, width: "100%" }}>
                        <CertificationDetails
                          certificationDetails={material.certificationDetails}
                        />
                      </Box>
                    </ListItem>
                  )}

                  
                </List>
              </Box>
            )}

            {/* Tab 2: Tính bền vững */}
            {tabIndex === 1 && (
              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                  Thông tin bền vững
                </Typography>

                                 {/* Tổng quan điểm bền vững */}
                 <Box sx={{ mb: 4, p: 3, bgcolor: "#f8f9fa", borderRadius: 2 }}>
                   <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                     Tổng quan điểm bền vững
                   </Typography>
                   <SustainabilityToolbar
                     sustainabilityScore={sustainabilityScore}
                     sustainabilityLevel={material.sustainabilityLevel}
                     sustainabilityColor={material.sustainabilityColor}
                     showDetails={true}
                   />
                 </Box>



                                 {/* Benchmarks Section */}
                 {material?.benchmarks && material.benchmarks.length > 0 ? (
                   <>
                     <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                       So sánh với chuẩn ngành
                     </Typography>
                    
                    <Grid container spacing={3}>
                      {/* Display regular benchmarks */}
                      {material.benchmarks
                        .filter(benchmark => benchmark.criteriaId !== 5) // Keep filter for now, we'll add Transport separately
                        .map((benchmark, index) => (
                          <Grid key={index}>
                        <Card>
                          <CardContent>
                                                                                                                   <Typography
                                   variant="h6"
                                   fontWeight="bold"
                                   sx={{ mb: 2 }}
                                 >
                                   {benchmark.sustainabilityCriteria?.name ||
                                     `Tiêu chí ${index + 1}`}
                                 </Typography>

                                                         {/* Điểm đạt được */}
                             {(() => {
                               const criterionName = benchmark.sustainabilityCriteria?.name;
                               if (!criterionName || !sustainabilityReport?.criterionDetails) return null;
                               
                               const criterionDetail = sustainabilityReport.criterionDetails.find(
                                 detail => detail.criterionName === criterionName
                               );
                               
                               if (!criterionDetail) return null;
                               
                               const score = criterionDetail.score;
                               const bgColor = score >= 80 ? 'green' : score >= 60 ? '#FFD700' : score >= 40 ? 'orange' : 'red';
                               
                               return (
                                 <Box
                                   sx={{
                                     display: "flex",
                                     justifyContent: "space-between",
                                     mb: 1,
                                   }}
                                 >
                                   <Typography variant="body2">
                                     Điểm đạt được:
                                   </Typography>
                                   <Typography variant="body2" fontWeight="bold" sx={{ color: bgColor }}>
                                     {score.toFixed(1)}%
                                   </Typography>
                                 </Box>
                               );
                             })()}

                             {/* Giá trị chuẩn */}
                             <Box
                               sx={{
                                 display: "flex",
                                 justifyContent: "space-between",
                                 mb: 1,
                               }}
                             >
                               <Typography variant="body2">
                                 Giá trị chuẩn:
                               </Typography>
                               <Typography variant="body2" fontWeight="bold">
                                 {benchmark.criteriaId === 4
                                   ? benchmark.value >= 1
                                     ? "Có"
                                     : "Không"
                                   : `${benchmark.value} ${
                                       benchmark.sustainabilityCriteria?.unit ||
                                       ""
                                     }`}
                               </Typography>
                             </Box>

                            {/* Giá trị thực tế */}
                            {benchmark.actualValue !== null &&
                              benchmark.actualValue !== undefined && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 1,
                                  }}
                                >
                                  <Typography variant="body2">
                                    Giá trị thực tế:
                                  </Typography>
                                  <Typography variant="body2" fontWeight="bold">
                                    {benchmark.criteriaId === 4
                                      ? benchmark.actualValue >= 1
                                        ? "Có"
                                        : "Không"
                                      : `${benchmark.actualValue} ${
                                          benchmark.sustainabilityCriteria
                                            ?.unit || ""
                                        }`}
                                  </Typography>
                                </Box>
                              )}

                                                         {/* So sánh cải thiện */}
                             {benchmark.improvementPercentage !== null &&
                               benchmark.improvementPercentage !== undefined && (
                                 <Box
                                   sx={{
                                     display: "flex",
                                     justifyContent: "space-between",
                                     mb: 1,
                                   }}
                                 >
                                   <Typography variant="body2">
                                     Cải thiện:
                                   </Typography>
                                   <Typography
                                     variant="body2"
                                     fontWeight="bold"
                                     color={
                                       benchmark.improvementColor === "success"
                                         ? "success.main"
                                         : benchmark.improvementColor === "error"
                                         ? "error.main"
                                         : "warning.main"
                                     }
                                   >
                                     {benchmark.criteriaId === 4
                                       ? `(${benchmark.improvementStatus})`
                                       : `${
                                           benchmark.improvementPercentage > 0
                                             ? "+"
                                             : ""
                                         }${benchmark.improvementPercentage.toFixed(
                                           1
                                         )}% (${benchmark.improvementStatus})`}
                                   </Typography>
                                 </Box>
                               )}

                            {/* Loại vật liệu */}
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                              }}
                            >
                              <Typography variant="body2">
                                Loại vật liệu:
                              </Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {benchmark.materialType?.typeName ||
                                  "Chưa có thông tin"}
                              </Typography>
                            </Box>

                            {/* Tiêu chí ID */}
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography variant="body2">
                                Tiêu chí ID:
                              </Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {benchmark.criteriaId}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                    
                    {/* Transport Information from Sustainability Report */}
                    {sustainabilityReport?.criterionDetails && material?.transportDistance && material?.transportMethod && (
                      <>
                        {(() => {
                          const transportDetail = sustainabilityReport.criterionDetails.find(
                            detail => detail.criterionName === 'Transport'
                          );
                          if (!transportDetail) return null;
                          
                          return (
                            <Grid>
                              <Card>
                                <CardContent>
                                                                                                                                           <Typography
                                       variant="h6"
                                       fontWeight="bold"
                                       sx={{ mb: 2 }}
                                     >
                                       Transport
                                     </Typography>

                                  

                                                                     {/* Điểm đạt được */}
                                   <Box
                                     sx={{
                                       display: "flex",
                                       justifyContent: "space-between",
                                       mb: 1,
                                     }}
                                   >
                                     <Typography variant="body2">
                                       Điểm đạt được:
                                     </Typography>
                                     <Typography variant="body2" fontWeight="bold" sx={{ 
                                       color: transportDetail.score >= 80 ? 'green' : transportDetail.score >= 60 ? '#FFD700' : transportDetail.score >= 40 ? 'orange' : 'red' 
                                     }}>
                                       {transportDetail.score.toFixed(1)}%
                                     </Typography>
                                   </Box>

                                   {/* Distance */}
                                   <Box
                                     sx={{
                                       display: "flex",
                                       justifyContent: "space-between",
                                       mb: 1,
                                     }}
                                   >
                                     <Typography variant="body2">
                                       Khoảng cách:
                                     </Typography>
                                     <Typography variant="body2" fontWeight="bold">
                                       {material.transportDistance.toLocaleString('vi-VN')} km
                                     </Typography>
                                   </Box>

                                  {/* Method */}
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      mb: 1,
                                    }}
                                  >
                                    <Typography variant="body2">
                                      Phương thức:
                                    </Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                      {material.transportMethod}
                                    </Typography>
                                  </Box>

                                                                                                                                           {/* Status */}
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mb: 1,
                                      }}
                                    >
                                      <Typography variant="body2">
                                        Trạng thái:
                                      </Typography>
                                      <Typography variant="body2" fontWeight="bold" color="success.main">
                                        {transportDetail.status}
                                      </Typography>
                                    </Box>

                                    {/* Loại vật liệu */}
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mb: 1,
                                      }}
                                    >
                                      <Typography variant="body2">
                                        Loại vật liệu:
                                      </Typography>
                                      <Typography variant="body2" fontWeight="bold">
                                        {material.materialTypeName || "Chưa có thông tin"}
                                      </Typography>
                                    </Box>

                                    {/* Tiêu chí ID */}
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <Typography variant="body2">
                                        Tiêu chí ID:
                                      </Typography>
                                      <Typography variant="body2" fontWeight="bold">
                                        5
                                      </Typography>
                                    </Box>
                                   
                                 </CardContent>
                               </Card>
                             </Grid>
                          );
                        })()}
                      </>
                                         )}
                   </Grid>

                   {/* Thông tin tổng quan về benchmark */}
                   <Box sx={{ mt: 4, p: 2, bgcolor: "#e3f2fd", borderRadius: 2 }}>
                     <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                       ℹ️ Thông tin về benchmark
                     </Typography>
                     <Typography variant="body2" color="text.secondary">
                       Hệ thống so sánh hiệu suất của nguyên liệu với chuẩn ngành cho từng tiêu chí. 
                       Điểm sustainability tổng hợp được tính dựa trên 5 tiêu chí với trọng số 20% mỗi tiêu chí.
                     </Typography>
                   </Box>
                   
                   {/* Tổng kết tính toán điểm */}
                   {sustainabilityReport?.criterionDetails && (
                     <Box sx={{ mt: 3, p: 2, bgcolor: "#fff3cd", borderRadius: 2, border: "1px solid #ffeaa7" }}>
                       <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "#856404" }}>
                         📊 Tổng kết tính toán điểm Sustainability
                       </Typography>
                       <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 2 }}>
                         {sustainabilityReport.criterionDetails.map((detail, index) => (
                           <Box key={index} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1, bgcolor: "#fff", borderRadius: 1 }}>
                             <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                               {detail.criterionName}:
                             </Typography>
                             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                               <Typography variant="body2" sx={{ color: detail.score >= 80 ? 'green' : detail.score >= 60 ? 'orange' : 'red', fontWeight: "bold" }}>
                                 {detail.score.toFixed(1)}%
                               </Typography>
                               <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                 × 20% = {(detail.score * 0.2).toFixed(1)}%
                               </Typography>
                             </Box>
                           </Box>
                         ))}
                       </Box>
                       <Typography variant="body2" sx={{ mt: 2, fontWeight: "bold", color: "#856404" }}>
                         Tổng điểm: {sustainabilityReport.overallSustainabilityScore}% 
                         ({sustainabilityReport.criterionDetails.reduce((sum, detail) => sum + (detail.score * 0.2), 0).toFixed(1)}%)
                       </Typography>
                     </Box>
                   )}

                   {/* Cách tính điểm Transport */}
                   {sustainabilityReport?.criterionDetails && (
                     <Box sx={{ mt: 3, p: 2, bgcolor: "#f3e5f5", borderRadius: 2, border: "1px solid #e1bee7" }}>
                       <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: "#6a1b9a" }}>
                         🚚 Cách tính điểm Transport
                       </Typography>
                                               <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          <strong>Logic tính điểm Transport (20% của tổng điểm sustainability):</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                           Khoảng cách địa lý và phương thức vận chuyển được chia thành 2 phần:
                        </Typography>
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 2 }}>
                          <Box sx={{ p: 1, bgcolor: "#fff", borderRadius: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
                              📏 Bước 1: Tính điểm khoảng cách (15% tổng điểm)
                            </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                               • ≤100km: 100%<br/>
                               • 100-500km: 90%<br/>
                               • 500-1000km: 80%<br/>
                               • 1000-2000km: 60%<br/>
                               • 2000-5000km: 40%<br/>
                               • trên 5000km: 20%
                             </Typography>
                          </Box>
                          <Box sx={{ p: 1, bgcolor: "#fff", borderRadius: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
                              🚢 Bước 2: Tính điểm phương thức (5% tổng điểm)
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              • Sea (Đường biển): 80% (ít carbon nhất)<br/>
                              • Rail (Đường sắt): 90% (hiệu quả cao)<br/>
                              • Land (Đường bộ): 70% (trung bình)<br/>
                              • Air (Đường hàng không): 30% (nhiều carbon nhất)
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 2, color: "#6a1b9a", fontStyle: "italic" }}>
                          <strong>Công thức:</strong> Transport Score = (Khoảng cách × 15%) + (Phương thức × 5%)
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, color: "#6a1b9a" }}>
                          <strong>Ví dụ:</strong> 800km (80% × 15% = 12%) + Sea (80% × 5% = 4%) = 16%
                        </Typography>
                     </Box>
                   )}
                     </>
                   ) : (
                     <Typography variant="body2" color="text.secondary">
                       Chưa có thông tin benchmark.
                     </Typography>
                   )}
              </Box>
            )}

            {/* Tab 3: Đánh giá */}
            {tabIndex === 2 && (
              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                  Đánh giá từ khách hàng
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Chưa có đánh giá cho nguyên liệu này.
                </Typography>
              </Box>
            )}

            {/* Tab 4: Tài liệu */}
            {tabIndex === 3 && (
              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                  Tài liệu liên quan
                </Typography>
                {material.documentationUrl ? (
                  <Button
                    variant="contained"
                    href={material.documentationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Xem tài liệu kỹ thuật
                  </Button>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Chưa có tài liệu đính kèm.
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Box>

        {/* Related Materials */}
        {relatedMaterials.length > 0 && (
          <Box sx={{ p: 4, borderTop: "1px solid #e0e0e0" }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
              Nguyên liệu tương tự
            </Typography>
            <Grid container spacing={3}>
              {relatedMaterials.map((relatedMaterial) => (
                <Grid key={relatedMaterial.materialId || 0}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      transition: "transform 0.2s",
                      "&:hover": { transform: "translateY(-4px)" },
                    }}
                    onClick={() =>
                      navigate(`/material/${relatedMaterial.materialId || 0}`)
                    }
                  >
                    <CardContent>
                      <Box
                        component="img"
                        src={
                          relatedMaterial.imageUrls &&
                          relatedMaterial.imageUrls.length > 0
                            ? relatedMaterial.imageUrls[0]
                            : ""
                        }
                        alt={relatedMaterial.name || "Material"}
                        sx={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                          borderRadius: 1,
                          mb: 2,
                        }}
                      />
                      <Typography variant="h6" fontWeight="bold" noWrap>
                        {relatedMaterial.name || "Nguyên liệu"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {relatedMaterial.supplier?.supplierName ||
                          "Chưa có thông tin"}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="primary"
                        fontWeight="bold"
                      >
                        {(
                          (relatedMaterial.pricePerUnit || 0) * PRICE_MULTIPLIER
                        )?.toLocaleString("vi-VN")}{" "}
                        ₫/mét
                      </Typography>
                      <Chip
                        label={`${(relatedMaterial.sustainabilityScore || 0).toFixed(0)}% Sustainability`}
                        size="small"
                        color="success"
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
      <Dialog open={zoomOpen} onClose={() => setZoomOpen(false)} fullWidth maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1, borderBottom: "1px solid #eee" }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton onClick={() => setZoomScale(z => Math.min(4, z + 0.2))} aria-label="Phóng to"><ZoomIn /></IconButton>
            <IconButton onClick={() => setZoomScale(z => Math.max(1, z - 0.2))} aria-label="Thu nhỏ"><ZoomOut /></IconButton>
          </Box>
          <IconButton onClick={() => setZoomOpen(false)} aria-label="Đóng"><Close /></IconButton>
        </Box>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ position: "relative", overflow: "hidden", cursor: dragging ? "grabbing" : "grab", height: { xs: "70vh", md: "80vh" } }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onWheel={onWheel}
          >
            <Box
              component="img"
              src={material.imageUrls && material.imageUrls.length > 0 ? material.imageUrls[currentImageIndex] || mainImage : mainImage}
              alt={material.name || "Material"}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${zoomScale})`,
                transformOrigin: "center center",
                userSelect: "none",
                pointerEvents: "none",
                maxWidth: "none",
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MaterialDetailPage;
