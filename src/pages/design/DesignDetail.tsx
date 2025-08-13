import {
  AppBar,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import Tab from "@mui/material/Tab";

import {
  AddToCart,
  ArrowBackIcon,
  ArrowForwardIcon,
} from "../../assets/icons/icon";
import React, { useEffect, useState } from "react";
import { data, useNavigate, useParams } from "react-router-dom";
// Icon
import StarIcon from "@mui/icons-material/Star";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { EcoIcon } from "../../assets/icons/icon";
import ManIcon from "@mui/icons-material/Man";
import WomanIcon from "@mui/icons-material/Woman";
//Certificate
import GRS from "../../assets/pictures/certificate/global-recycled-standard-(grs).webp";
import OEKO from "../../assets/pictures/certificate/image-removebg-preview-70.png";

//example
import Banner from "../../assets/pictures/detail/detail.jpg";

//example
import ao_linen from "../../assets/pictures/example/ao-linen.webp";
import chan_vay_dap from "../../assets/pictures/example/chan-vay-dap.webp";
import dam_con_trung from "../../assets/pictures/example/dam-con-trung.webp";
import type { Fashion } from "../../types/Fashion";
import FashionsSection from "../../components/fashion/FashionsSection";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import DesignService, {
  Design,
  Feature,
} from "../../services/api/designService";
import { toast } from "react-toastify";

const reviews = [
  {
    name: "Sarah M.",
    date: "May 10, 2025",
    rating: 5,
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
  },
  {
    name: "Michael T.",
    date: "April 28, 2025",
    rating: 5,
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
  },
  {
    name: "Jessica L.",
    date: "April 15, 2025",
    rating: 4,
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
  },
  // Add more reviews as needed
];

const ratingData = [
  { star: 5, value: 85 },
  { star: 4, value: 10 },
  { star: 3, value: 3 },
  { star: 2, value: 1 },
  { star: 1, value: 1 },
];

export default function DesignDetail() {
  const { id } = useParams(); // lấy id từ URL
  // const product = products.find((p) => p.id === Number(id));
  //Design Detail Data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [designDetail, setDesignDetail] = useState<Design | null>(null);
  const [relatedDesign, setRelatedDesign] = useState<Design[]>([]);
  //Size
  const [size, setSize] = useState("M");

  //Change Image
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    const images = designDetail.imageUrls ?? [];
    if (!images || images.length === 0) return;

    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const handleNext = () => {
    const images = designDetail.imageUrls ?? [];
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  //Change Tab
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const materialColors = [
    "success.main",
    "error.main",
    "primary.main",
    "warning.main",
    "info.main",
    "secondary.main",
  ];

  const formatPriceVND = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  //Impact Data
  const [wasteDiverted, setWasteDiverted] = useState(0);
  const [carbonFootprint, setCarbonFootprint] = useState(0);
  const [waterUsed, setWaterUsed] = useState(0);

  useEffect(() => {
    if (!id) return;
    const fetchDesigner = async () => {
      try {
        setLoading(true);
        const data = await DesignService.getDesignDetailById(Number(id));
        let totalWasteDiverted = 0;
        let totalWaterUsed = 0;
        let totalCarbonFootprint = 0;
        data.materials.forEach((material) => {
          totalWasteDiverted +=
            material.wasteDiverted * (material.persentageUsed / 100);
          totalWaterUsed +=
            material.waterUsage *
            (material.persentageUsed / 100) *
            material.meterUsed;
          totalCarbonFootprint +=
            material.carbonFootprint *
            (material.persentageUsed / 100) *
            material.meterUsed;
        });
        setWasteDiverted(Math.ceil(totalWasteDiverted));
        setCarbonFootprint(Math.ceil(totalCarbonFootprint));
        setWaterUsed(Math.ceil(totalWaterUsed));
        const relatedData =
          await DesignService.getAllDesignByDesignerPagination(
            data.designer.designerId,
            currentPage,
            pageSize
          );
        setDesignDetail(data);
        setRelatedDesign(relatedData);
      } catch (err: any) {
        const msg = err.message || "Không thể tải thông tin nhà thiết kế.";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchDesigner();
  }, [id]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [designDetail]);

  // if (!designDetail) {
  //   return (
  //     <Box sx={{ p: 4 }}>
  //       <Typography color="error">Không tìm thấy sản phẩm.</Typography>
  //     </Box>
  //   );
  // }
  //Open popup
  const [open, setOpen] = useState(false);
  if (loading) return <div className="designer-loading">Đang tải...</div>;
  if (error || !designDetail)
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Không tìm thấy sản phẩm.</Typography>
      </Box>
    );
  const materialData = designDetail.materials.map((mat) => ({
    label: mat.materialName,
    value: Math.round(mat.persentageUsed),
  }));
  //Render Feature
  const renderFeatures = (feature?: Feature | null) => {
    if (!feature) {
      return (
        <ListItem>
          <ListItemIcon sx={{ minWidth: "30px", color: "gray" }}>
            <EcoIcon />
          </ListItemIcon>
          <ListItemText primary="Chưa cập nhật thông tin nổi bật" />
        </ListItem>
      );
    }

    const items = [];

    if (feature.reduceWaste) {
      items.push("Giảm rác thải ra môi trường");
    }
    if (feature.lowImpactDyes) {
      items.push("Thuốc nhuộm và quy trình ít tác động đến môi trường");
    }
    if (feature.durable) {
      items.push("Kết cấu bền chắc sử dụng lâu dài");
    }
    if (feature.ethicallyManufactured) {
      items.push("Quy trình sản xuất có trách nhiệm");
    }

    if (items.length === 0) {
      return (
        <ListItem>
          <ListItemIcon sx={{ minWidth: "30px", color: "gray" }}>
            <EcoIcon />
          </ListItemIcon>
          <ListItemText primary="Không có thông tin nổi bật" />
        </ListItem>
      );
    }

    return items.map((text, idx) => (
      <ListItem key={idx}>
        <ListItemIcon sx={{ minWidth: "30px", color: "green" }}>
          <EcoIcon />
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItem>
    ));
  };

  //Chart
  const sizeChart = {
    width: 180,
    height: 200,
  };
  const valueFormatter = (item: { value: number }) => `${item.value}%`;
  const data = { data: materialData, valueFormatter };

  return (
    <Box
      sx={{
        mx: "auto",
        width: "100%",
        backgroundImage: `url(${Banner})`,
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "white",
          borderBottom: "1px solid black",
          borderTop: "1px solid black",
        }}
      >
        <Breadcrumbs
          separator="›"
          aria-label="breadcrumb"
          sx={{ paddingLeft: 2 }}
        >
          <Link underline="hover" color="inherit" href="/">
            Trang chủ
          </Link>
          <Link underline="hover" color="inherit" href="/fashion">
            Thời Trang
          </Link>
          <Typography color="text.primary">{designDetail.name}</Typography>
        </Breadcrumbs>
      </AppBar>

      <Box sx={{ mx: "auto", width: "70%", bgcolor: "#fff" }}>
        {/* Chi Tiết Sản Phẩm */}
        <Box sx={{ py: 2, px: 4, display: "flex" }}>
          {/* Right: Image */}
          <Grid
            sx={{
              width: "50%",
              marginRight: "50px",
            }}
          >
            {/* Main Image with Arrows */}
            <Box sx={{ position: "relative", marginBottom: 2 }}>
              <Box
                component="img"
                src={designDetail.imageUrls?.[currentIndex] ?? ""}
                alt={designDetail.name}
                sx={{
                  width: "100%",
                  height: "80vh",
                  borderRadius: 2,
                  objectFit: "cover",
                }}
              />
              <IconButton
                onClick={handlePrev}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: -10,
                  transform: "translateY(-50%)",
                  backgroundColor: "white",
                  boxShadow: 1,
                }}
              >
                <ArrowBackIosIcon fontSize="small" />
              </IconButton>
              <IconButton
                onClick={handleNext}
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: -10,
                  transform: "translateY(-50%)",
                  backgroundColor: "white",
                  boxShadow: 1,
                }}
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              {designDetail.imageUrls?.slice(0, 3).map((img, index) => (
                <Box
                  key={index}
                  component="img"
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => setCurrentIndex(index)}
                  sx={{
                    width: "30%",
                    height: "60px",
                    objectFit: "cover",
                    borderRadius: 1,
                    cursor: "pointer",
                    border:
                      index === currentIndex
                        ? "2px solid #1976d2"
                        : "1px solid #ccc",
                  }}
                />
              ))}
            </Box>
          </Grid>

          {/* Right: Product Info */}
          <Grid sx={{ width: "50%" }}>
            <Box sx={{ display: "flex", marginBottom: "10px", width: "100%" }}>
              <Box
                sx={{ display: "flex", flexDirection: "column", width: "100%" }}
              >
                <Typography
                  sx={{
                    fontSize: "30px",
                    margin: "auto 0",
                    width: "100%",
                    fontWeight: "bold",
                  }}
                >
                  {designDetail.name}
                </Typography>
                <Box
                  sx={{ width: "30%", display: "flex", alignItems: "center" }}
                >
                  <Rating
                    name="text-feedback"
                    value={designDetail.productScore}
                    readOnly
                    precision={0.5}
                    emptyIcon={
                      <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                    }
                  />
                  <Box sx={{ ml: 2, fontSize: "20px" }}>
                    {designDetail.productScore}
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  width: "30%",
                  margin: "auto",
                  display: "flex", // Dùng flex
                  justifyContent: "flex-end", // Đẩy nội dung sang phải
                }}
              >
                <IconButton>
                  <FavoriteBorderIcon sx={{ fontSize: "35px" }} />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ display: "flex", width: "100%" }}>
              <Box sx={{ display: "flex", width: "100%" }}>
                <Typography sx={{ margin: "auto 0", fontSize: "20px" }}>
                  Mã Sản Phẩm:
                </Typography>
                <Typography
                  sx={{
                    margin: "auto 0",
                    fontSize: "20px",
                    fontWeight: "bold",
                    paddingLeft: "20px",
                  }}
                >
                  P00{designDetail.designId}
                </Typography>
              </Box>
              <Chip
                icon={<EcoIcon />}
                label={`${designDetail.recycledPercentage}% Bền Vững`}
                size="small"
                sx={{
                  backgroundColor: "rgba(200, 248, 217, 1)",
                  color: "rgba(22, 103, 86, 1)",
                  fontSize: "15px",
                  marginLeft: "auto",
                  fontWeight: "bold",
                }}
              />
            </Box>
            <Box sx={{ display: "flex", width: "100%" }}>
              <Typography
                sx={{ margin: "auto 0", fontSize: "20px", marginRight: "10px" }}
              >
                Giá:
              </Typography>
              {/* {!product.price.original && ( */}
              <Typography
                component="div"
                sx={{
                  fontWeight: "bold",
                  margin: "auto 0",
                  fontSize: "20px",
                }}
              >
                {formatPriceVND(designDetail.salePrice)}
              </Typography>
              {/* )} */}
              {/* {product.price.original && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    component="div"
                    sx={{ fontWeight: "bold", fontSize: "30px" }}
                  >
                    {formatPrice(product.price)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      textDecoration: "line-through",
                      color: "text.secondary",
                      fontSize: "25px",
                      marginLeft: "5px",
                    }}
                  >
                    {formatOriginalPrice(product.price)}
                  </Typography>
                  {product.discountPercentage &&
                    product.discountPercentage > 0 && (
                      <Chip
                        label={`-${product.discountPercentage}%`}
                        size="small"
                        sx={{
                          bgcolor: "#f44336",
                          color: "white",
                          fontWeight: "bold",
                          marginLeft: "5px",
                        }}
                      />
                    )}
                </Box>
              )} */}
            </Box>

            {/* Material */}
            <Box
              sx={{ display: "flex", width: "100%", flexDirection: "column" }}
            >
              <Typography sx={{ margin: "auto 0", fontSize: "20px" }}>
                Chất Liệu:
              </Typography>
              {/* <Box
                sx={{
                  width: "100%",
                }}
              >
                {product.materials.map((mat, index) => (
                  <Box
                    key={mat.name}
                    sx={{
                      width: `${mat.percentageUse}%`,
                      borderColor:
                        materialColors[index % materialColors.length],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: materialColors[index % materialColors.length],
                      fontSize: 20,
                      padding: 2,
                      fontWeight: "bold",
                      flex: 1,
                    }}
                  >
                    {mat.name}: {mat.percentageUse}%
                  </Box>
                ))}
              </Box> */}
              <PieChart
                series={[
                  {
                    arcLabel: (item) => `${item.value}%`,
                    arcLabelMinAngle: 35,
                    arcLabelRadius: "60%",
                    ...data,
                  },
                ]}
                sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                    fontWeight: "bold",
                  },
                }}
                {...sizeChart}
              />
            </Box>

            {/* Color */}
            <Box>
              <Typography sx={{ margin: "auto 0", fontSize: "25px" }}>
                Màu sắc:
              </Typography>
              {/* Replace with mapped color swatches */}
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                {["#c9bfb3", "#c4c0b9", "#a09c92"].map((color) => (
                  <Box
                    key={color}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: color,
                      border: "1px solid #ccc",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Size selector */}
            <Box sx={{ mt: 2, width: "100%" }}>
              <Typography sx={{ margin: "auto 0", fontSize: "25px" }}>
                Size:
              </Typography>
              <Box sx={{ display: "flex" }}>
                <ToggleButtonGroup
                  value={size}
                  exclusive
                  onChange={(e, newSize) => setSize(newSize)}
                  size="large"
                  sx={{ mt: 1 }}
                >
                  <ToggleButton value="S">S</ToggleButton>
                  <ToggleButton value="M">M</ToggleButton>
                  <ToggleButton value="L">L</ToggleButton>
                </ToggleButtonGroup>
                <Link
                  sx={{
                    margin: "auto 0",
                    marginLeft: "auto",
                    cursor: "pointer",
                  }}
                  onClick={() => setOpen(true)}
                >
                  Hướng dẫn chọn size
                </Link>
                <Dialog
                  open={open}
                  onClose={() => setOpen(false)}
                  maxWidth="lg"
                  fullWidth
                >
                  <DialogTitle sx={{ fontWeight: "bold" }}>
                    Hướng dẫn chọn size
                  </DialogTitle>
                  <DialogContent dividers>
                    <Typography sx={{ mb: 2, fontSize: "20px" }}>
                      Dùng thước dây để lấy số đo 3 vòng: ngực - eo - mông rồi
                      đối chiếu với bảng số đo bên dưới để chọn kích cỡ.
                    </Typography>

                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        {/* Bảng nữ */}
                        <Typography variant="subtitle1" fontWeight="bold">
                          Bảng size nữ
                        </Typography>
                        <WomanIcon sx={{ color: "red", fontSize: "30px" }} />
                      </Box>
                      <TableContainer component={Paper} sx={{ mb: 3 }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                Ký hiệu / Thông số (cm)
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                XS
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                S
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                M
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                L
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                XL
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                XXL
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                NGỰC
                              </TableCell>
                              <TableCell>76 - 80</TableCell>
                              <TableCell>82 - 86</TableCell>
                              <TableCell>88 - 92</TableCell>
                              <TableCell>94 - 97</TableCell>
                              <TableCell>100 - 103</TableCell>
                              <TableCell>106 - 109</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                EO
                              </TableCell>
                              <TableCell>62 - 66</TableCell>
                              <TableCell>68 - 72</TableCell>
                              <TableCell>74 - 78</TableCell>
                              <TableCell>92 - 96</TableCell>
                              <TableCell>98 - 102</TableCell>
                              <TableCell>104 - 108</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                MÔNG
                              </TableCell>
                              <TableCell>80 - 84</TableCell>
                              <TableCell>86 - 90</TableCell>
                              <TableCell>92 - 96</TableCell>
                              <TableCell>98 - 102</TableCell>
                              <TableCell>104 - 108</TableCell>
                              <TableCell>110 - 114</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>

                      {/* Bảng nam */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        {/* Bảng nữ */}
                        <Typography variant="subtitle1" fontWeight="bold">
                          Bảng size nam
                        </Typography>
                        <ManIcon sx={{ color: "blue", fontSize: "30px" }} />
                      </Box>
                      <TableContainer component={Paper}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                Ký hiệu / Thông số (cm)
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                XS
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                S
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                M
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                L
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                XL
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                XXL
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                NGỰC
                              </TableCell>
                              <TableCell>88 - 92</TableCell>
                              <TableCell>94 - 98</TableCell>
                              <TableCell>100 - 104</TableCell>
                              <TableCell>106 - 110</TableCell>
                              <TableCell>112 - 116</TableCell>
                              <TableCell>118 - 122</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                EO
                              </TableCell>
                              <TableCell>73 - 77</TableCell>
                              <TableCell>79 - 83</TableCell>
                              <TableCell>85 - 89</TableCell>
                              <TableCell>91 - 95</TableCell>
                              <TableCell>97 - 101</TableCell>
                              <TableCell>103 - 107</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                MÔNG
                              </TableCell>
                              <TableCell>88 - 94</TableCell>
                              <TableCell>96 - 99</TableCell>
                              <TableCell>101 - 103</TableCell>
                              <TableCell>105 - 107</TableCell>
                              <TableCell>109 - 113</TableCell>
                              <TableCell>115 - 119</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </DialogContent>
                </Dialog>
              </Box>
            </Box>

            {/* Số Lượng */}
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Typography sx={{ margin: "auto 0", fontSize: "25px" }}>
                Số Lượng:
              </Typography>
              <Button variant="outlined">-</Button>
              <Typography variant="h6">1</Typography>
              <Button variant="outlined">+</Button>
            </Box>

            {/* Buttons */}
            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              <Button variant="contained" color="success">
                Thêm vào giỏ
              </Button>
              <Button variant="outlined">Mua ngay</Button>
            </Box>
          </Grid>
        </Box>

        {/* Author Info */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            margin: "auto",
            borderTop: "1px solid black",
            borderBottom: "1px solid black",
            padding: 2,
          }}
        >
          <Grid
            sx={{
              width: "30%",
              margin: "10px",
              borderRight: "1px solid black",
              display: "flex",
            }}
          >
            <IconButton
              disableRipple
              // href={`/explore/designers/${designDetail.designer.designerId}`}
              href={`/brand/${designDetail.designer.designerId}`}
              sx={{ textDecoration: "none" }}
            >
              <Avatar
                src={designDetail.designer.avatarUrl || undefined}
                sx={{ margin: "auto 10px", height: "80px", width: "80px" }}
              >
                {!designDetail.designer.avatarUrl &&
                  designDetail.designer.designerName?.[0]}
              </Avatar>
            </IconButton>
            <Box
              sx={{
                margin: "auto ",
                width: "100%",
                overflow: "hidden",
              }}
            >
              <Link
                // href={`/explore/designers/${designDetail.designer.designerId}`}
                href={`/brand/${designDetail.designer.designerId}`}
                sx={{ textDecoration: "none", color: "black" }}
              >
                <Typography
                  sx={{
                    width: "100%",
                    fontSize: "25px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {designDetail.designer.designerName}
                </Typography>{" "}
              </Link>
              <Typography sx={{ width: "100%", fontSize: "15px" }}>
                Online 3 phút trước
              </Typography>
            </Box>
          </Grid>
          <Grid
            sx={{
              width: "70%",
              paddingLeft: 5,
              paddingRight: 5,
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid size={6}>
                  <Box sx={{ display: "flex", width: "100%" }}>
                    <Typography sx={{ marginRight: "auto" }}>
                      Đánh Giá:
                    </Typography>
                    <Typography>80k</Typography>
                  </Box>
                </Grid>
                <Grid size={6}>
                  <Box sx={{ display: "flex", width: "100%" }}>
                    <Typography sx={{ marginRight: "auto" }}>
                      Tham Gia:
                    </Typography>
                    <Typography>4 năm trước</Typography>
                  </Box>
                </Grid>
                <Grid size={6}>
                  <Box sx={{ display: "flex", width: "100%" }}>
                    <Typography sx={{ marginRight: "auto" }}>
                      Sản Phẩm:
                    </Typography>
                    <Typography>800</Typography>
                  </Box>
                </Grid>
                <Grid size={6}>
                  <Box sx={{ display: "flex", width: "100%" }}>
                    <Typography sx={{ marginRight: "auto" }}>
                      Người Theo Dõi:
                    </Typography>
                    <Typography>100k</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Box>

        {/* Thông Tin Mô Tả */}
        <Box
          sx={{
            width: "100%",
            borderBottom: "1px solid black",
            paddingBottom: "30px",
          }}
        >
          {/* Tabs */}
          <Box
            sx={{
              width: "100%",
              background: "rgba(241, 245, 249, 1)",
              margin: "30px auto",
              display: "flex",
            }}
          >
            <Tabs
              value={tabIndex}
              onChange={handleChange}
              textColor="primary"
              sx={{
                width: "100%",
                margin: "auto",
              }}
            >
              <Tab
                label="Chi Tiết Sản Phẩm"
                sx={{
                  flex: 1,
                  "&.Mui-selected": {
                    color: "primary", // Màu khi được chọn
                    fontWeight: "bold", // Tuỳ chọn: in đậm
                  },
                }}
              />
              <Tab
                label="Tính Bền Vững"
                sx={{
                  flex: 1,
                  "&.Mui-selected": {
                    color: "primary", // Màu khi được chọn
                    fontWeight: "bold", // Tuỳ chọn: in đậm
                  },
                }}
              />
              <Tab
                label="Đánh Giá"
                sx={{
                  flex: 1,
                  "&.Mui-selected": {
                    color: "primary", // Màu khi được chọn
                    fontWeight: "bold", // Tuỳ chọn: in đậm
                  },
                }}
              />
              <Tab label="Vận Chuyển Và Hoàn Tiền" sx={{ flex: 1 }} />
            </Tabs>
          </Box>

          {/* Tab Content */}
          {/* Tab Chi tiết Sản Phẩm */}
          {tabIndex === 0 && (
            <Box sx={{ display: "flex", padding: 4, paddingTop: 0 }}>
              {/* Mô Tả */}
              <Grid flex={1}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Mô Tả
                </Typography>
                <Typography
                  component="div"
                  sx={{ whiteSpace: "pre-line", fontSize: "15px" }}
                >
                  {designDetail.description}
                </Typography>
              </Grid>

              {/* Đặc điểm và Bảo quản */}
              <Grid flex={1}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Đặc điểm
                </Typography>
                <List dense>{renderFeatures(designDetail.feature)}</List>

                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mt: 2 }}
                >
                  Hướng Dẫn Bảo Quản
                </Typography>
                <Typography variant="body2">
                  {designDetail.careInstructions}
                </Typography>
              </Grid>
            </Box>
          )}
          {/* Tab Tính Bền Vững  */}
          {tabIndex === 1 && (
            <Box sx={{ width: "100%" }}>
              <Box
                sx={{
                  backgroundColor: "rgba(240, 253, 244, 1)",
                  borderRadius: 2,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 200,
                }}
              >
                {/* Title */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: 2,
                  }}
                >
                  <EcoIcon />
                  <Typography variant="h6" fontWeight="bold">
                    Tác Động Môi Trường
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "80%",
                    margin: "auto",
                    display: "flex",
                    padding: "30px",
                    alignItems: "stretch",
                  }}
                >
                  {/*  Water Saved */}
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#fff",
                      borderRadius: 2,
                      boxShadow: 1,
                      flex: 1,
                      margin: "0 10px",
                      height: "100%",
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      Tiết kiệm nước
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary">
                      {waterUsed} L
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Thấp hơn so với quy trình sản xuất thông thường
                    </Typography>
                  </Box>

                  {/* CO₂ Reduced */}
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#fff",
                      borderRadius: 2,
                      boxShadow: 1,
                      flex: 1,
                      margin: "0 10px",
                      height: "100%",
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      Giảm khí CO₂
                    </Typography>
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      color="success.main"
                    >
                      {carbonFootprint} Kg
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Thấp hơn so với phương pháp sản xuất thông thường.
                    </Typography>
                  </Box>

                  {/* Waste Diverted */}
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#fff",
                      borderRadius: 2,
                      boxShadow: 1,
                      flex: 1,
                      margin: "0 10px",
                      height: "100%",
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      Rác Thải Chuyển Hướng
                    </Typography>
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      color="success.main"
                    >
                      {wasteDiverted} %
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rác thải dệt may đã tránh được khỏi bãi rác
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  margin: "auto",
                  padding: 3,
                }}
              >
                {/* Mô Tả */}
                <TableContainer component={Paper} sx={{ width: "100%" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Tên Nguyên Liệu
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Mô Tả Nguyên Liệu
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Chứng Chỉ
                          </Typography>
                        </TableCell>
                        {/* <TableCell>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Ảnh Chứng Chỉ
                          </Typography>
                        </TableCell> */}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {designDetail.materials.map((mat, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              <Link
                                href={`/material/${mat.materialId}`}
                                underline="hover"
                                sx={{ fontWeight: "bold", fontSize: "14px" }}
                              >
                                {mat.materialName}
                              </Link>
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{ whiteSpace: "pre-line" }}
                              component="div"
                            >
                              {mat.materialDescription}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "bold" }}
                              component="div"
                            >
                              {mat.certificationDetails}
                            </Typography>
                          </TableCell>
                          {/* <TableCell>
                            <img
                              src={GRS}
                              alt="Material Certificate"
                              style={{
                                height: "100px",
                                width: "90px",
                                background: "white",
                              }}
                            />
                          </TableCell> */}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          )}
          {/* Tab Đánh Giá */}
          {tabIndex === 2 && (
            <Box sx={{ width: "100%", display: "flex" }}>
              {/* Left: Rating Summary */}
              <Grid sx={{ width: "30%" }}>
                <Box sx={{ p: 2, border: "1px solid #eee", borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Đánh Giá
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Box
                      sx={{ width: 200, display: "flex", alignItems: "center" }}
                    >
                      <Rating
                        name="text-feedback"
                        value={designDetail.productScore}
                        readOnly
                        precision={0.5}
                        emptyIcon={
                          <StarIcon
                            style={{ opacity: 0.55 }}
                            fontSize="inherit"
                          />
                        }
                      />
                      <Box sx={{ ml: 2, fontSize: "20px" }}>
                        {designDetail.productScore}
                      </Box>
                    </Box>
                  </Box>
                  {ratingData.map((item) => (
                    <Box
                      key={item.star}
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <Typography sx={{ width: 40 }}>
                        {item.star} star
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={item.value}
                        sx={{
                          flex: 1,
                          height: 10,
                          borderRadius: 5,
                          mx: 1,
                          backgroundColor: "#e5e7eb",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "#facc15",
                          },
                        }}
                      />
                      <Typography sx={{ width: 30 }}>{item.value}%</Typography>
                    </Box>
                  ))}
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 2,
                      backgroundColor: "#22c55e",
                      "&:hover": { backgroundColor: "#16a34a" },
                    }}
                  >
                    Viết Đánh Giá
                  </Button>
                </Box>
              </Grid>

              {/* Right: Scrollable Reviews */}
              <Grid sx={{ width: "70%" }}>
                <Box
                  sx={{
                    maxHeight: 400,
                    overflowY: "auto",
                    p: 2,
                    border: "1px solid #eee",
                    borderRadius: 2,
                  }}
                >
                  {reviews.map((review, index) => (
                    <Box key={index} mb={2}>
                      <Typography fontWeight="bold">{review.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {review.date}
                      </Typography>
                      <Box
                        sx={{
                          width: 200,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Rating
                          name="text-feedback"
                          value={review.rating}
                          readOnly
                          precision={0.5}
                          emptyIcon={
                            <StarIcon
                              style={{ opacity: 0.55 }}
                              fontSize="inherit"
                            />
                          }
                        />
                        <Box sx={{ ml: 2, fontSize: "20px" }}>
                          {review.rating}
                        </Box>
                      </Box>
                      <Typography>{review.comment}</Typography>
                      {index < reviews.length - 1 && (
                        <Divider sx={{ mt: 2, mb: 2 }} />
                      )}
                    </Box>
                  ))}
                </Box>
              </Grid>
            </Box>
          )}
          {/* Tab Vận Chuyển*/}
          {tabIndex === 3 && (
            <Box sx={{ display: "flex", padding: 4, paddingTop: 0, gap: 3 }}>
              {/* Mô Tả */}
              <Grid sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Hành Trình Nguyên Liệu
                </Typography>
                <Typography
                  component="div"
                  sx={{ whiteSpace: "pre-line", fontSize: "15px" }}
                >
                  Chúng tôi giao hàng bằng các phương thức vận chuyển trung hòa
                  carbon khi có thể.
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  Thời Gian Giao Hàng Dự Kiến
                </Typography>
                <Typography
                  component="div"
                  sx={{ whiteSpace: "pre-line", fontSize: "15px" }}
                >
                  - Hà Nội: 5–7 ngày làm việc.
                  {"\n"}- Thành phố Hồ Chí Minh: 3–5 ngày làm việc.
                  {"\n"}- Vũng Tàu: 3-5 ngày làm việc.
                  {"\n"}- Nha Trang: 3-5 ngày làm việc
                </Typography>
              </Grid>

              {/* Đặc điểm và Bảo quản */}
              <Grid sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Trả Hàng & Đổi Hàng
                </Typography>
                <Typography
                  component="div"
                  sx={{ whiteSpace: "pre-line", fontSize: "15px" }}
                >
                  Chúng tôi muốn bạn hoàn toàn hài lòng với sản phẩm của mình.
                  Nếu bạn không hài lòng với đơn hàng, chúng tôi chấp nhận trả
                  hàng trong vòng 30 ngày kể từ ngày giao hàng.
                </Typography>

                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mt: 2 }}
                >
                  Chính Sách Trả Hàng
                </Typography>
                <List>
                  <ListItem>
                    Sản phẩm phải chưa qua sử dụng, chưa giặt và còn nguyên
                    trạng với nhãn mác đầy đủ
                  </ListItem>
                  <ListItem>
                    Chi phí vận chuyển trả hàng do khách hàng chịu trách nhiệm
                  </ListItem>
                  <ListItem>
                    Hoàn tiền sẽ được thực hiện qua phương thức thanh toán ban
                    đầu
                  </ListItem>
                  <ListItem>
                    Có thể đổi hàng với kích cỡ hoặc màu sắc khác
                  </ListItem>
                </List>
                <Typography fontWeight="bold" sx={{ mt: 2 }}>
                  Chú ý: Chính sách trả hàng của chúng tôi hỗ trợ tính bền vững
                  bằng cách giảm thiểu việc vận chuyển không cần thiết và rác
                  thải.
                </Typography>
              </Grid>
            </Box>
          )}
        </Box>

        {/* Related Products */}
        <FashionsSection
          products={relatedDesign}
          title="SẢN PHẨM LIÊN QUAN"
          onViewMore={() => `/brand/${designDetail.designer.designerId}`}
        />
      </Box>
    </Box>
  );
}
