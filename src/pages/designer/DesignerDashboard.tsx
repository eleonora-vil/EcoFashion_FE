import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  Grid,
  IconButton,
  Link,
  MenuItem,
  Rating,
  Select,
  Stack,
  styled,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import StarIcon from "@mui/icons-material/Star";
import GroupIcon from "@mui/icons-material/Group";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import DesignServicesOutlinedIcon from "@mui/icons-material/DesignServicesOutlined";
import AddIcon from "@mui/icons-material/Add";
import {
  DressIcon,
  EcoIcon,
  ShirtIcon,
  SkirtIcon,
  TrouserIcon,
} from "../../assets/icons/icon";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AirIcon from "@mui/icons-material/Air";
import CompostIcon from "@mui/icons-material/Compost";
import CloseIcon from "@mui/icons-material/Close";

//Chart
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import DesignService, {
  Design,
  StoredMaterial,
} from "../../services/api/designService";
import { toast } from "react-toastify";
import { useAuthStore } from "../../store/authStore";

// Register chart components
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend
);

export default function DesignerDashBoard() {
  window.scrollTo(0, 0);
  const stats = [
    {
      title: "Tổng Sản Phẩm",
      value: "24",
      subtitle: "3 sản phẩm mới tháng này",
      icon: <LocalMallOutlinedIcon />,
      color: "success.main",
    },
    {
      title: "Tổng Doanh Thu",
      value: "3.800.000đ",
      subtitle: "Tăng 12%",
      icon: <TrendingUpIcon />,
      color: "info.main",
    },
    {
      title: "Đánh Giá Trung Bình",
      value: "24",
      subtitle: "3 sản phẩm mới tháng này",
      icon: <StarIcon />,
      color: "warning.main",
    },
    {
      title: "Cộng Đồng",
      value: "156",
      subtitle: "12 lượt theo dõi mới",
      icon: <GroupIcon />,
      color: "secondary.main",
    },
  ];

  const fashion_stats = [
    {
      title: "Tổng Thiết Kế",
      value: "24",
      subtitle: "Tất Cả Các Loại Thiết Kế",
      icon: <LocalMallOutlinedIcon />,
      color: "success.main",
    },
    {
      title: "Doanh Thu",
      value: "3.800.000đ",
      subtitle: "Tổng Số Tiền Đã Thu",
      icon: <TrendingUpIcon />,
      color: "info.main",
    },
    {
      title: "Thiết Kế Sắp Hết",
      value: "24",
      subtitle: "Thiết Kế Cần Thêm Hàng",
      icon: <StarIcon />,
      color: "warning.main",
    },
    {
      title: "Tiết Kiếm Nước",
      value: "24",
      subtitle: "Lít / Tổng Tất Cả Sản Phẩm",
      icon: <WaterDropIcon />,
      color: "rgba(22, 163, 74, 1)",
    },
    {
      title: "Giảm Khí CO2",
      value: "18",
      subtitle: "Kg / Tổng Tất Cả Sản Phẩm",
      icon: <AirIcon />,
      color: "rgba(22, 163, 74, 1)",
    },
    {
      title: "Giảm Lượng Rác Thải",
      value: "32",
      subtitle: "Tấn / Tổng Tất Cả Sản Phẩm",
      icon: <CompostIcon />,
      color: "rgba(22, 163, 74, 1)",
    },
  ];

  const messages = [
    {
      sender: "EcoTextiles",
      timeSend: "2 giờ trước",
      content: "Báo giá cho denim tái chế",
    },
    {
      sender: "GreenFabrics",
      timeSend: "5 giờ trước",
      content: "Có vải cotton hữu cơ mới",
    },
    {
      sender: "ReThread",
      timeSend: "6 giờ trước",
      content: "Xác nhận đơn hàng #RT-7842",
    },
  ];

  const orders = [
    {
      orderId: "ORD-01",
      product: "Áo Khoác Denim Tái Chế",
      status: 1, //1: Đang Vận Chuyển, 2: Chưa Xử Lý, 3: Đã Giao Hàng
    },
    {
      orderId: "ORD-02",
      product: "Túi Tote Tái Chế (2 cái)",
      status: 2, //1: Đang Vận Chuyển, 2: Chưa Xử Lý, 3: Đã Giao Hàng
    },
    {
      orderId: "ORD-03",
      product: "Khăn Choàng Thân Với Môi Trường",
      status: 3, //1: Đang Vận Chuyển, 2: Chưa Xử Lý, 3: Đã Giao Hàng
    },
  ];

  //Design Data
  const [designs, setDesigns] = useState<Design[]>([]);
  //Material Data
  const [storedMaterial, setStoredMaterial] = useState<StoredMaterial[]>([]);
  //Loading
  const [loading, setLoading] = useState(true);
  //Error
  const [error, setError] = useState<string | null>(null);
  // Zustand stores
  const { getDesignerId } = useAuthStore();
  useEffect(() => {
    loadDesigners();
  }, []);
  const loadDesigners = async () => {
    try {
      setLoading(true);
      setError(null);
      const designData = await DesignService.getAllDesignByDesigner(
        getDesignerId()
      );
      setDesigns(designData);

      const materialData = await DesignService.getStoredMaterial(
        getDesignerId()
      );
      setStoredMaterial(materialData);
      console.log("Stored Material: ", materialData);
    } catch (error: any) {
      const errorMessage =
        error.message || "Không thể tải danh sách nhà thiết kế";
      setError(errorMessage);
      toast.error(errorMessage, { position: "bottom-center" });
    } finally {
      setLoading(false);
    }
  };

  const yearData = [
    { label: "Jan", revenue: 64854, cost: 32652 },
    { label: "Feb", revenue: 54628, cost: 42393 },
    { label: "Mar", revenue: 117238, cost: 50262 },
    { label: "Apr", revenue: 82830, cost: 64731 },
    { label: "May", revenue: 91208, cost: 41893 },
    { label: "Jun", revenue: 103609, cost: 83809 },
    { label: "Jul", revenue: 90974, cost: 44772 },
    { label: "Aug", revenue: 82919, cost: 37590 },
    { label: "Sep", revenue: 62407, cost: 43349 },
    { label: "Oct", revenue: 82528, cost: 45324 },
    { label: "Nov", revenue: 56979, cost: 47978 },
    { label: "Dec", revenue: 87436, cost: 39175 },
  ];

  const weekData = [
    { label: "Mon", revenue: 12000, cost: 5000 },
    { label: "Tue", revenue: 9000, cost: 4500 },
    { label: "Wed", revenue: 15000, cost: 6000 },
    { label: "Thu", revenue: 11000, cost: 4000 },
    { label: "Fri", revenue: 16000, cost: 7000 },
    { label: "Sat", revenue: 18000, cost: 8000 },
    { label: "Sun", revenue: 10000, cost: 3000 },
  ];

  const monthData = [
    { label: "Week 1", revenue: 50000, cost: 23000 },
    { label: "Week 2", revenue: 62000, cost: 27000 },
    { label: "Week 3", revenue: 58000, cost: 24000 },
    { label: "Week 4", revenue: 60000, cost: 25000 },
  ];

  const [range, setRange] = useState("year");

  const getCurrentData = () => {
    if (range === "week") return weekData;
    if (range === "month") return monthData;
    return yearData;
  };
  const chartData = getCurrentData();

  const { user } = useAuthStore();
  //Change Tabs
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const generateMockMaterial = (inventory: StoredMaterial[]) => {
    return inventory.map((inventory) => ({
      id: inventory.materialId,
      material: inventory.material.name,
      quantity: inventory.quantity,
      status:
        inventory.quantity <= 0
          ? "Hết Hàng"
          : inventory.quantity < 30
          ? "Sắp Hết Hàng"
          : "Còn Hàng",
      supplier: inventory.material.supplierName,
      costPerUnit: new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(inventory.material.pricePerUnit * 1000),
      totalValue: new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(inventory.cost),
      creatAt: new Date(inventory.lastBuyDate).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    }));
  };
  type MaterialRow = ReturnType<typeof generateMockMaterial>[number];
  const material_columns: GridColDef<MaterialRow>[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "material",
      headerName: "Chất Liệu",
      width: 110,
      flex: 1,
    },
    {
      field: "quantity",
      headerName: "Số Lượng (m)",
      width: 110,
      flex: 1,
    },
    {
      field: "status",
      headerName: "Trạng Thái",
      width: 110,
      renderCell: (params) => {
        let color:
          | "default"
          | "warning"
          | "secondary"
          | "error"
          | "info"
          | "success"
          | "primary" = "default";
        switch (params.value) {
          case "Còn Hàng":
            color = "success";
            break;
          case "Sắp Hết Hàng":
            color = "warning";
            break;
          case "Hết Hàng":
            color = "error";
            break;
          default:
            color = "primary";
        }

        return <Chip label={params.value} color={color} size="small" />;
      },
      flex: 1,
    },
    {
      field: "supplier",
      headerName: "Nhà Cung Cấp",
      width: 110,
      flex: 1,
    },
    {
      field: "costPerUnit",
      headerName: "Giá 1 Mét Vải",
      width: 110,
      flex: 1,
    },
    {
      field: "totalValue",
      headerName: "Tổng Tiền Chi",
      width: 110,
      flex: 1,
    },
    {
      field: "creatAt",
      headerName: "Ngày Cập Nhật",
      width: 150,
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Hành Động",
      width: 120,
      sortable: false,
      filterable: false,
      headerAlign: "right",
      disableColumnMenu: true,
      renderCell: (params) => {
        const handleEdit = () => {
          // Replace with your edit logic
          console.log("Edit item:", params.row);
        };

        const handleDelete = () => {
          // Replace with your delete logic
          console.log("Delete item:", params.row);
        };

        return (
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
          >
            <Stack direction="row" spacing={1}>
              <IconButton size="small" onClick={handleEdit} color="primary">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={handleDelete} color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>
        );
      },
      flex: 1,
    },
  ];

  const [open, setOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  const handleClickOpen = (image: string) => {
    setOpen(true);
    setSelectedImage(image);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));
  const generateMockProducts = (designs: Design[]) => {
    return designs.map((design) => ({
      id: design.designId,
      title: design.name,
      image: design.designImageUrls[0] || "", // hoặc ảnh mặc địn
      price: new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(design.salePrice),
      recycledPercentage: design.recycledPercentage,
      material: design.materials?.map((mat) => mat.materialName) || [],
      typeName: design.itemTypeName,
    }));
  };

  const getCategoryColor = (category?: string): string => {
    if (!category) return "#9e9e9e"; // default grey
    const colors: Record<string, string> = {
      Áo: "#2196f3",
      Quần: "#ff9800",
      Đầm: "#4caf50",
      Váy: "#9c27b0",
    };
    return colors[category.normalize("NFC")] || "#9e9e9e";
  };

  const getCategoryIcon = (category?: string) => {
    if (!category) return null;
    const icons: Record<string, React.ReactNode> = {
      Áo: <ShirtIcon />,
      Quần: <TrouserIcon />,
      Đầm: <DressIcon />,
      Váy: <SkirtIcon />,
    };
    return icons[category.normalize("NFC")] || null;
  };

  type FashionRow = ReturnType<typeof generateMockProducts>[number];

  const fashion_columns: GridColDef<FashionRow>[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "image",
      headerName: "Sản Phẩm",
      width: 110,
      flex: 1,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: "flex",
              height: "100%",
              width: "100%",
            }}
            onClick={() => handleClickOpen(params.row.image)}
          >
            <img
              src={params.row.image}
              alt="Sản Phẩm"
              style={{
                width: 50,
                height: 50,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
          </Box>
        );
      },
    },
    {
      field: "title",
      headerName: "Tên Sản Phảm",
      width: 110,
      flex: 1,
    },
    {
      field: "price",
      headerName: "Giá",
      width: 110,
      flex: 1,
    },
    {
      field: "recycledPercentage",
      headerName: "Điểm Bền Vững",
      width: 110,
      flex: 1,
      renderCell: (params) => {
        return (
          <Chip
            icon={<EcoIcon />}
            label={`${params.row.recycledPercentage}% Bền Vững`}
            size="small"
            sx={{
              backgroundColor: "rgba(200, 248, 217, 1)",
              color: "rgba(22, 103, 86, 1)",
              fontSize: "15px",
            }}
          />
        );
      },
    },
    {
      field: "typeName",
      headerName: "Loại Thời Trang",
      width: 110,
      flex: 1,
      renderCell: (params) => {
        return (
          <Chip
            // label={product.category.toUpperCase()}
            icon={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                {getCategoryIcon(params.row.typeName)}
              </Box>
            }
            label={params.row.typeName}
            size="small"
            sx={{
              bgcolor: getCategoryColor(params.row.typeName),
              color: "white",
              fontWeight: "bold",
              fontSize: "1rem",
              paddingTop: 2,
              paddingBottom: 2,
            }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Hành Động",
      width: 120,
      sortable: false,
      filterable: false,
      headerAlign: "right",
      disableColumnMenu: true,
      renderCell: (params) => {
        const handleEdit = () => {
          // Replace with your edit logic
          console.log("Edit item:", params.row);
        };

        const handleDelete = () => {
          // Replace with your delete logic
          console.log("Delete item:", params.row);
        };

        return (
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
          >
            <Stack direction="row" spacing={1}>
              <IconButton size="small" onClick={handleEdit} color="primary">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={handleDelete} color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>
        );
      },
      flex: 1,
    },
  ];

  const totalMaterials = storedMaterial.length;
  const totalCost = storedMaterial.reduce(
    (sum, m) => sum + m.material.pricePerUnit * 1000 * m.quantity,
    0
  );
  const lowStockCount = storedMaterial.filter(
    (m) => m.quantity > 0 && m.quantity < 30
  ).length;
  const totalMeters = storedMaterial.reduce((sum, m) => sum + m.quantity, 0);

  const material_stats = [
    {
      title: "Tổng Vật Liệu",
      value: totalMaterials,
      subtitle: "Tổng Tất Cả Các Loại Chất Liệu",
      icon: <LocalMallOutlinedIcon />,
      color: "success.main",
    },
    {
      title: "Tổng Tiền Vật Liệu",
      value: totalCost.toLocaleString("vi-VN") + "đ",
      subtitle: "Tổng Số Tiền Đã Chi",
      icon: <TrendingUpIcon />,
      color: "info.main",
    },
    {
      title: "Vật Liệu Sắp Hết",
      value: lowStockCount,
      subtitle: "Loại Cần Đặt",
      icon: <StarIcon />,
      color: "warning.main",
    },
    {
      title: "Tổng Mét Vải Hiện Có",
      value: totalMeters.toLocaleString("vi-VN"),
      subtitle: "Mét Vải Hiện Có Trong Kho",
      icon: <GroupIcon />,
      color: "warning.main",
    },
  ];

  return (
    <Box sx={{ width: "95%", margin: "auto" }}>
      {/* Top Part */}
      <Box sx={{ width: "100%", display: "flex" }}>
        {/* Title */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            paddingTop: 3,
            paddingBottom: 3,
          }}
        >
          <Typography sx={{ fontWeight: "bold", fontSize: "30px" }}>
            Designer Dashboard
          </Typography>
          <Typography>Chào mừng trở lại, {user?.fullName}</Typography>
        </Box>
        {/* Button */}
        <Box sx={{ display: "flex", marginLeft: "auto", gap: 2, padding: 2 }}>
          <Button
            variant="outlined"
            sx={{
              borderColor: "black",
              marginRight: "20px",
              height: "60%",
              margin: "auto",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                color: "black",
              }}
            >
              Tìm Kiếm Vật Liệu
            </Typography>
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "rgba(22, 163, 74)",
              "&:hover": { bgcolor: "white", color: "rgba(22, 163, 74)" },
              px: 4,
              py: 1.5,
              height: "60%",
              margin: "auto",
            }}
            href="/designer/dashboard/add"
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
              }}
            >
              <AddIcon />
              <Typography
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  "&:hover": {
                    color: "rgba(22, 163, 74, 0.55)",
                  },
                }}
              >
                Thêm Sản Phẩm
              </Typography>
            </Box>
          </Button>
        </Box>
      </Box>
      {/* Tab Part */}
      <Box
        sx={{
          width: "30%",
          background: "rgba(241, 245, 249, 1)",
          display: "flex",
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          sx={{
            width: "100%",
            margin: "auto",
          }}
          TabIndicatorProps={{
            sx: {
              backgroundColor: "rgba(22, 163, 74)",
              borderRadius: "2px",
            },
          }}
        >
          <Tab
            label="Trang chủ"
            sx={{
              flex: 1,
              "&.Mui-selected": {
                color: "rgba(22, 163, 74)", // Màu khi được chọn
                fontWeight: "bold", // Tuỳ chọn: in đậm
              },
            }}
          />
          <Tab
            label="Sản Phẩm"
            sx={{
              flex: 1,
              "&.Mui-selected": {
                color: "rgba(22, 163, 74)", // Màu khi được chọn
                fontWeight: "bold", // Tuỳ chọn: in đậm
              },
            }}
          />
          <Tab
            label="Thời Trang"
            sx={{
              flex: 1,
              "&.Mui-selected": {
                color: "rgba(22, 163, 74)", // Màu khi được chọn
                fontWeight: "bold", // Tuỳ chọn: in đậm
              },
            }}
          />
          <Tab
            label="Kho Vật Liệu"
            sx={{
              flex: 1,
              "&.Mui-selected": {
                color: "rgba(22, 163, 74)", // Màu khi được chọn
                fontWeight: "bold", // Tuỳ chọn: in đậm
              },
            }}
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {/* Tab Trang Chủ */}
      {tabIndex === 0 && (
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              gap: 3,
            }}
          >
            {stats.map((item, index) => (
              <Grid key={index} sx={{ flex: 1, margin: "20px 0" }}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="subtitle2" color="text.secondary">
                        {item.title}
                      </Typography>
                      <Avatar
                        sx={{ bgcolor: item.color, width: 35, height: 35 }}
                      >
                        {item.icon}
                      </Avatar>
                    </Stack>
                    <Typography variant="h5" fontWeight="bold" mt={1}>
                      {item.value}
                    </Typography>
                    <Typography variant="body2" color="success.main" mt={0.5}>
                      ↗ {item.subtitle}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Box>
          {/* Graph & Popular Product*/}
          <Box width={"100%"} sx={{ display: "flex", gap: 3 }}>
            <Stack direction="row" sx={{ width: "100%" }} spacing={3}>
              {/* Graph */}
              <Card sx={{ width: "60%", flex: 1 }}>
                <Box
                  sx={{ border: "1px solid rgba(0, 0, 0, 0.1)", padding: 3 }}
                >
                  <Box width={"100%"} sx={{ display: "flex" }}>
                    <Box
                      width={"100%"}
                      sx={{ display: "flex", flexDirection: "column" }}
                    >
                      <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
                        Tổng Quan Doanh Thu
                      </Typography>
                      <Typography sx={{ opacity: "50%" }}>
                        Doanh số sản phẩm của bạn trong{" "}
                        {`${
                          range === "week"
                            ? "1 tuần"
                            : range === "month"
                            ? "1 tháng"
                            : "1 năm"
                        }`}{" "}
                        qua
                      </Typography>{" "}
                    </Box>
                    <Select
                      defaultValue="week"
                      sx={{
                        border: "none",
                        fontSize: 14,
                        minWidth: 100,
                      }}
                    >
                      <MenuItem value="week" onClick={() => setRange("week")}>
                        1 Tuần
                      </MenuItem>
                      <MenuItem value="month" onClick={() => setRange("month")}>
                        1 Tháng
                      </MenuItem>
                      <MenuItem value="year" onClick={() => setRange("year")}>
                        1 Năm
                      </MenuItem>
                    </Select>
                  </Box>
                  <Line
                    data={{
                      labels: chartData.map((d) => d.label),
                      datasets: [
                        {
                          label: "Doanh Thu",
                          data: chartData.map((d) => d.revenue),
                          backgroundColor: "#064FF0",
                          borderColor: "#064FF0",
                        },
                        {
                          label: "Chi Phí",
                          data: chartData.map((d) => d.cost),
                          backgroundColor: "#FF3030",
                          borderColor: "#FF3030",
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      elements: {
                        line: {
                          tension: 0.4,
                        },
                      },
                      plugins: {
                        legend: { position: "top" },
                        title: {
                          display: true,
                        },
                      },
                    }}
                  />
                </Box>
              </Card>
              {/* Popular Product */}
              <Card sx={{ width: "60%", flex: 1 }}>
                <Box
                  sx={{ border: "1px solid rgba(0, 0, 0, 0.1)", padding: 3 }}
                >
                  {/* Title */}
                  <Box
                    width="100%"
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
                        Sản Phẩm Hàng Đầu
                      </Typography>
                      <Typography sx={{ opacity: "50%" }}>
                        Sản phẩm bán chạy nhất của bạn
                      </Typography>
                    </Box>
                  </Box>

                  <Stack
                    spacing={2}
                    sx={{
                      mt: 2,
                      maxHeight: 300, // set max height for scroll area
                      overflowY: "auto",
                      pr: 1,
                      scrollbarWidth: "thin",
                      "&::-webkit-scrollbar": {
                        width: 6,
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "rgba(0,0,0,0.2)",
                        borderRadius: 4,
                      },
                    }}
                  >
                    {designs.map((item) => (
                      <Button
                        key={item.designId}
                        variant="outlined"
                        sx={{
                          borderColor: "rgba(0,0,0,0.1)",
                          textTransform: "none",
                          width: "100%",
                          padding: 2,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        {/* Left side */}
                        <Box sx={{ textAlign: "left" }}>
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              color: "black",
                              mb: 1,
                            }}
                          >
                            {item.name}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Chip
                              icon={<EcoIcon />}
                              label={`${item.recycledPercentage}% Bền Vững`}
                              size="small"
                              sx={{
                                backgroundColor: "rgba(200, 248, 217, 1)",
                                color: "rgba(22, 103, 86, 1)",
                                marginRight: 1,
                                fontWeight: "bold",
                              }}
                            />
                            <Typography
                              sx={{
                                color: "black",
                                opacity: 0.4,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              Bán Được 15 Sản Phẩm
                            </Typography>
                          </Box>
                        </Box>

                        {/* Right side */}
                        <Typography
                          sx={{ color: "black", whiteSpace: "nowrap", ml: 2 }}
                        >
                          Chi Tiết
                        </Typography>
                      </Button>
                    ))}
                  </Stack>
                </Box>
              </Card>
            </Stack>
          </Box>
        </Box>
      )}

      {/* Tab Sản Phẩm */}
      {tabIndex === 1 && (
        <Box sx={{ width: "100%" }}>
          {/* Material Stat */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              gap: 3,
            }}
          >
            {fashion_stats.map((item, index) => (
              <Grid key={index} sx={{ flex: 1, margin: "20px 0" }}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="subtitle2" color="text.secondary">
                        {item.title}
                      </Typography>
                      <Avatar
                        sx={{ bgcolor: item.color, width: 35, height: 35 }}
                      >
                        {item.icon}
                      </Avatar>
                    </Stack>
                    <Box>
                      <Typography variant="h5" fontWeight="bold" mt={1}>
                        {item.value}
                      </Typography>
                      <Typography variant="body2" color="success.main" mt={0.5}>
                        {item.subtitle}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Box>
          {/* Table */}
          <DataGrid
            rows={generateMockProducts(designs)}
            columns={fashion_columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
            sx={{
              width: "100%", // or set a fixed px width like "800px"
            }}
          />
          <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
          >
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={(theme) => ({
                position: "absolute",
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              })}
            >
              <CloseIcon />
            </IconButton>

            <img
              src={selectedImage || ""}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                borderRadius: 10,
              }}
            />
          </BootstrapDialog>
        </Box>
      )}

      {/* Tab Thời Trang  */}
      {tabIndex === 2 && (
        <Box sx={{ width: "100%" }}>
          {/* Table */}
          <DataGrid
            rows={generateMockProducts(designs)}
            columns={fashion_columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
            sx={{
              width: "100%", // or set a fixed px width like "800px"
            }}
          />
          <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
          >
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={(theme) => ({
                position: "absolute",
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
              })}
            >
              <CloseIcon />
            </IconButton>

            <img
              src={selectedImage || ""}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                borderRadius: 10,
              }}
            />
          </BootstrapDialog>
        </Box>
      )}

      {/* Tab Vật Liệu*/}
      {tabIndex === 3 && (
        <Box sx={{ width: "100%" }}>
          {/* Material Stat */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              gap: 3,
            }}
          >
            {material_stats.map((item, index) => (
              <Grid key={index} sx={{ flex: 1, margin: "20px 0" }}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="subtitle2" color="text.secondary">
                        {item.title}
                      </Typography>
                      <Avatar
                        sx={{ bgcolor: item.color, width: 35, height: 35 }}
                      >
                        {item.icon}
                      </Avatar>
                    </Stack>
                    <Typography variant="h5" fontWeight="bold" mt={1}>
                      {item.value}
                    </Typography>
                    <Typography variant="body2" color="success.main" mt={0.5}>
                      {item.subtitle}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Box>
          {/* Table */}
          <DataGrid
            rows={generateMockMaterial(storedMaterial)}
            columns={material_columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
            sx={{
              width: "100%", // or set a fixed px width like "800px"
            }}
          />
        </Box>
      )}

      {/* Bottom Part */}
      <Box sx={{ width: "100%", display: "flex", gap: 3, margin: "30px 0" }}>
        {/* Card Công Cụ Thiết Kế */}
        <Card
          sx={{
            textAlign: "center",
            p: 2,
            flex: 1,
            border: "1px solid rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box sx={{ display: "flex", margin: "10px 0", gap: 1 }}>
            <PaletteOutlinedIcon color="success" sx={{ margin: "auto 0" }} />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Thiết Kế
            </Typography>
          </Box>
          <Stack spacing={2} marginBottom={3}>
            {/* Thiết Kế Rập */}
            <Button
              variant="outlined"
              sx={{
                borderColor: "rgba(0,0,0,0.1)",
                textTransform: "none",
              }}
              href="/designer/dashboard/create"
            >
              <DesignServicesOutlinedIcon color="success" />
              <Box
                sx={{
                  textAlign: "left",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  marginRight: "auto",
                }}
              >
                <Typography
                  sx={{
                    width: "100%",
                    marginRight: "auto",
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  Thiết Kế Rập
                </Typography>
                <Typography
                  sx={{
                    color: "black",
                    opacity: "40%",
                  }}
                >
                  Tạo ra các mẫu rập bền vững
                </Typography>
              </Box>
            </Button>
          </Stack>

          {/* <Button variant="contained" color="success">
            Khám phá Hết
          </Button> */}
        </Card>

        {/* Card Liên Lạc */}
        <Card
          sx={{
            width: 300,
            textAlign: "center",
            p: 2,
            flex: 1,
            border: "1px solid rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box sx={{ display: "flex", margin: "10px 0", gap: 1 }}>
            <ChatBubbleOutlineIcon color="success" sx={{ margin: "auto 0" }} />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Liên Lạc
            </Typography>
          </Box>
          <Stack spacing={2} marginBottom={3}>
            {messages.map((item, index) => (
              <Button
                key={index}
                variant="outlined"
                sx={{
                  borderColor: "rgba(0,0,0,0.1)",
                  textTransform: "none",
                }}
              >
                <Box sx={{ width: "100%", display: "flex" }}>
                  <Box
                    sx={{
                      textAlign: "left",
                      padding: "10px",
                      display: "flex",
                      flexDirection: "column",
                      marginRight: "auto",
                    }}
                  >
                    <Typography
                      sx={{
                        width: "100%",
                        marginRight: "auto",
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      {item.sender}
                    </Typography>
                    <Typography
                      sx={{
                        width: "100%",
                        color: "black",
                        opacity: "40%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.content}
                    </Typography>
                  </Box>
                  <Typography color="black">{item.timeSend}</Typography>
                </Box>
              </Button>
            ))}
          </Stack>

          <Button variant="contained" color="success">
            Xem toàn bộ tin nhắn
          </Button>
        </Card>

        {/* Card Quản Lí Giao Hàng */}
        <Card
          sx={{
            width: 300,
            textAlign: "center",
            p: 2,
            flex: 1,
            border: "1px solid rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box sx={{ display: "flex", margin: "10px 0", gap: 1 }}>
            <LocalShippingOutlinedIcon
              color="success"
              sx={{ margin: "auto 0" }}
            />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Quản Lý Đơn Hàng
            </Typography>
          </Box>
          <Stack spacing={2} marginBottom={3}>
            {orders.map((item, index) => (
              <Button
                key={index}
                variant="outlined"
                sx={{
                  borderColor: "rgba(0,0,0,0.1)",
                  textTransform: "none",
                }}
              >
                <Box sx={{ width: "100%", display: "flex" }}>
                  <Box
                    sx={{
                      textAlign: "left",
                      padding: "10px",
                      display: "flex",
                      flexDirection: "column",
                      marginRight: "auto",
                    }}
                  >
                    <Typography
                      sx={{
                        width: "100%",
                        marginRight: "auto",
                        fontWeight: "bold",
                        color: "black",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.product}
                    </Typography>
                    <Typography
                      sx={{
                        color: "black",
                        opacity: "40%",
                      }}
                    >
                      {item.orderId}
                    </Typography>
                  </Box>
                  {/* Conditional Chip */}
                  {item.status === 1 ? (
                    <Chip
                      label="Đang vận chuyển"
                      sx={{
                        backgroundColor: "rgba(219, 234, 254, 1)",
                        color: "rgba(62, 92, 188, 1)",
                      }}
                    />
                  ) : item.status === 2 ? (
                    <Chip
                      label="Chưa Xử Lý"
                      sx={{
                        backgroundColor: "rgba(220, 252, 231, 1)",
                        color: "rgba(59, 129, 86, 1)",
                      }}
                    />
                  ) : item.status === 3 ? (
                    <Chip
                      label="Đã hoàn thành"
                      sx={{
                        backgroundColor: "rgba(254, 249, 195, 1)",
                        color: "rgba(139, 86, 23, 1)",
                      }}
                    />
                  ) : (
                    <Chip label="Không Xác Định" color="error" />
                  )}
                </Box>
              </Button>
            ))}
          </Stack>

          <Button variant="contained" color="success">
            Xem toàn bộ đơn hàng
          </Button>
        </Card>
      </Box>
    </Box>
  );
}
