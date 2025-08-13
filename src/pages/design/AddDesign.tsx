import React, { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
  InputLabel,
  Link,
  List,
  ListItem,
  ListItemIcon,
  MenuItem,
  Paper,
  Rating,
  Select,
  Stack,
  styled,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { number, string, z, ZodError } from "zod";
//Icon
import DriveFileRenameOutlineSharpIcon from "@mui/icons-material/DriveFileRenameOutlineSharp";
import RecyclingIcon from "@mui/icons-material/Recycling";
import ScienceIcon from "@mui/icons-material/Science";
import BuildIcon from "@mui/icons-material/Build";
import FactoryIcon from "@mui/icons-material/Factory";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import SearchIcon from "@mui/icons-material/Search";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { DesignerService, DesignService } from "../../services/api";
import { StoredMaterial } from "../../services/api/designService";
import { toast } from "react-toastify";
import { EcoIcon } from "../../assets/icons/icon";
import { GridCloseIcon } from "@mui/x-data-grid";
import {
  CreateDesignFormValues,
  createDesignSchema,
} from "../../schemas/createDesignSchema";
import FileUpload from "../../components/FileUpload";
//Example
import ao_linen from "../../assets/pictures/example/ao-linen.webp";
import chan_vay_dap from "../../assets/pictures/example/chan-vay-dap.webp";
import dam_con_trung from "../../assets/pictures/example/dam-con-trung.webp";
import { useAuthStore } from "../../store/authStore";

const Collection = [
  { collection_Id: 1, collection_name: "Áo Linen", image: ao_linen },
  { collection_Id: 2, collection_name: "Chân Váy Mây", image: chan_vay_dap },
  { collection_Id: 3, collection_name: "Đầm Côn Trùng", image: dam_con_trung },
];
const AddDesign = () => {
  const [loading, setLoading] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  //Design Data
  const [storedMaterial, setStoredMaterial] = useState<StoredMaterial[]>([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  // Zustand stores
  const { getDesignerId } = useAuthStore();

  //Get Material Data
  useEffect(() => {
    loadStoredMaterial();
  }, []);

  const loadStoredMaterial = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await DesignService.getStoredMaterial(getDesignerId());
      setStoredMaterial(data);
    } catch (error: any) {
      const errorMessage =
        error.message || "Không thể tải danh sách nhà thiết kế";
      setError(errorMessage);
      toast.error(errorMessage, { position: "bottom-center" });
    } finally {
      setLoading(false);
    }
  };
  //Search
  const [searchTerm, setSearchTerm] = useState("");

  const removeVietnameseTones = (str: string) => {
    return str
      .normalize("NFD") // Normalize to decomposed form
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/đ/g, "d") // Replace đ
      .replace(/Đ/g, "D"); // Replace Đ
  };
  const filteredMaterials = storedMaterial.filter((mat) => {
    const combined = `${mat.material.materialName} ${mat.materialId}`;
    const matchesSearch = removeVietnameseTones(
      combined.toLowerCase()
    ).includes(removeVietnameseTones(searchTerm.toLowerCase()));

    // Exclude materials that have been added to selectedMaterials
    const isAlreadySelected = selectedMaterials.some(
      (m) => m.materialId === mat.materialId
    );

    return matchesSearch && !isAlreadySelected;
  });

  //Drag and Drop
  const [activeDragItem, setActiveDragItem] = useState<any | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveDragItem(null); // clear active drag item

    if (over?.id === "drop-area") {
      const dragged = filteredMaterials.find((m) => m.materialId === active.id);
      if (
        dragged &&
        !selectedMaterials.some((m) => m.materialId === dragged.materialId)
      ) {
        setSelectedMaterials([...selectedMaterials, dragged]);
      }
    }
  };

  const DraggableCard = ({ mat }: { mat: any }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
      id: mat.materialId,
    });

    useEffect(() => {
      if (isDragging) {
        setActiveDragItem(mat);
      }
    }, [isDragging]);
    return (
      <Card
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        variant="outlined"
        sx={{
          mb: 1,
          display: "flex",
          alignItems: "center",
          p: 1,
          m: 2,
          cursor: "grab",
          opacity: isDragging ? 0 : 1,
        }}
      >
        <Box flexGrow={1}>
          <Typography fontWeight="bold">{mat.name}</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {mat.supplierName}
            </Typography>
            <Chip
              size="small"
              icon={<EcoIcon />}
              label={`${mat.sustainabilityScore}% Bền Vững`}
              sx={{
                bgcolor: "#E6F4EA",
                color: "#388E3C",
                fontSize: "0.9rem",
                ml: 1,
              }}
            />
          </Box>
        </Box>
        <Button variant="outlined" size="small">
          Thêm
        </Button>
      </Card>
    );
  };

  const [usageById, setUsageById] = useState<Record<string, string>>({});
  const [
    weightedSustainabilityPercentage,
    setWeightedSustainabilityPercentage,
  ] = useState<number>(0);
  const [totalUsed, setTotalUsed] = useState<number>(0);

  const handleUsageChange = (materialId: string, value: string) => {
    setUsageById((prev) => ({
      ...prev,
      [materialId]: value, // keep it as string for smoother input
    }));
  };

  const removeMaterial = (materialId) => {
    setSelectedMaterials((prev) =>
      prev.filter((mat) => mat.materialId !== materialId)
    );
    setUsageById((prev) => {
      const newUsage = { ...prev };
      delete newUsage[materialId];
      return newUsage;
    });
  };

  type DropAreaProps = {
    selectedMaterials: any[];
    removeMaterial: (materialId: string) => void;
    usageById: Record<string, string>;
    onUsageChange: (materialId: string, value: string) => void;
  };

  const [criterionResults, setCriterionResults] = useState({
    carbonFootprint: { value: 0, unit: "" },
    waterUsage: { value: 0, unit: "" },
    wasteDiverted: { value: 0, unit: "" },
  });
  useEffect(() => {
    const weightedSums = {
      carbonFootprint: { value: 0, unit: "" },
      waterUsage: { value: 0, unit: "" },
      wasteDiverted: { value: 0, unit: "" },
    };

    selectedMaterials.forEach((mat) => {
      const usedValue =
        parseFloat(usageById[mat.material.materialId] || "") || 0;
      const percent = totalUsed > 0 ? (usedValue / totalUsed) * 100 : 0;

      const weightedCarbonFootprintValue =
        (mat.material.carbonFootprint * percent * usedValue) / 100;
      const weightedCarbonFootprintUnit = "Kg";
      weightedSums.carbonFootprint.value += weightedCarbonFootprintValue;
      weightedSums.carbonFootprint.unit = weightedCarbonFootprintUnit;

      const weightedWaterUsageValue =
        (mat.material.waterUsage * percent * usedValue) / 100;
      const weightedWaterUsageUnit = "L";
      weightedSums.waterUsage.value += weightedWaterUsageValue;
      weightedSums.waterUsage.unit = weightedWaterUsageUnit;

      const weightedWasteDivertedValue =
        (mat.material.wasteDiverted * percent) / 100;
      const weightedWasteDivertedUnit = "%";
      weightedSums.wasteDiverted.value += weightedWasteDivertedValue;
      weightedSums.wasteDiverted.unit = weightedWasteDivertedUnit;
    });

    setCriterionResults(weightedSums);
  }, [selectedMaterials, usageById, totalUsed]);

  const DropArea = ({
    selectedMaterials,
    removeMaterial,
    usageById,
    onUsageChange,
  }: DropAreaProps) => {
    const { setNodeRef } = useDroppable({ id: "drop-area" });
    console.log(selectedMaterials);
    const totalUsed = Object.values(usageById).reduce(
      (sum: number, val: string) => sum + (parseFloat(val) || 0),
      0
    );
    setTotalUsed(totalUsed);
    const sustainabilityPercent = selectedMaterials.reduce((sum, mat) => {
      const used = parseFloat(usageById[mat.material.materialId]) || 0;
      return sum + used * (mat.material.sustainabilityScore || 0);
    }, 0);
    const weightedSustainabilityPercentage =
      totalUsed > 0 ? Math.round(sustainabilityPercent / totalUsed) : 0;

    setWeightedSustainabilityPercentage(weightedSustainabilityPercentage);

    return (
      <Box
        ref={setNodeRef}
        margin={"10px 0"}
        borderRadius={2}
        border="1px solid #eee"
        flex={1}
      >
        <Box
          sx={{ display: "flex", justifyContent: "space-between", padding: 2 }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Vật Liệu Đã Thêm
          </Typography>
          <Chip
            size="small"
            icon={<EcoIcon />}
            label={
              totalUsed > 0
                ? `${weightedSustainabilityPercentage}% Bền Vững`
                : "... % Bền Vững"
            }
            sx={{
              bgcolor: "#E6F4EA",
              color: "#388E3C",
              fontSize: "0.9rem",
              ml: 1,
            }}
          />
        </Box>
        <Box sx={{ width: "100%", marginTop: "auto" }}>
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
                display: "flex",
                width: "100%",
                margin: "auto",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  margin: "auto",
                  display: "flex",
                  padding: "30px",
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
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Tiết kiệm nước
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="primary">
                    {criterionResults.waterUsage.value.toFixed(1)}{" "}
                    {criterionResults.waterUsage.unit}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    So với quy trình sản xuất thông thường
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
                    height: "100%",
                    margin: "0 10px",
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
                    {criterionResults.carbonFootprint.value.toFixed(1)}{" "}
                    {criterionResults.carbonFootprint.unit}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Dấu chân carbon thấp hơn so với phương pháp sản xuất thông
                    thường.
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
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Giảm Rác Thải
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="success.main"
                  >
                    {criterionResults.wasteDiverted.value.toFixed(1)}{" "}
                    {criterionResults.wasteDiverted.unit}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rác thải dệt may đã tránh được khỏi bãi rác
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Divider />
        {selectedMaterials.length === 0 ? (
          <Box textAlign="center" py={6}>
            <Typography variant="subtitle1" fontWeight="medium">
              Chưa Thêm Vật Liệu
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tìm Và Thêm Vật Liệu
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              maxHeight: 300,
              overflowY: "auto",
            }}
          >
            {selectedMaterials.map((mat) => {
              const usedValue =
                parseFloat(usageById[mat.material.materialId] || "") || 0;
              // Tính Phần Trăm
              const percent = totalUsed > 0 ? (usedValue / totalUsed) * 100 : 0;

              return (
                <Card
                  key={mat.material.materialId}
                  variant="outlined"
                  sx={{
                    width: "100%",
                    display: "inline-flex",
                    alignItems: "center",
                    p: 2,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Box flexGrow={1}>
                    <Typography fontWeight="bold">
                      {mat.material.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {mat.material.supplierName}
                    </Typography>
                    <Chip
                      size="small"
                      icon={<EcoIcon />}
                      label={`${mat.material.sustainabilityScore}% Bền Vững`}
                      sx={{
                        bgcolor: "#E6F4EA",
                        color: "#388E3C",
                        fontSize: "0.9rem",
                        ml: 1,
                      }}
                    />
                    <Chip
                      size="small"
                      label={`${percent}% sử dụng`}
                      sx={{
                        bgcolor: "#E3F2FD",
                        color: "#1976D2",
                        fontSize: "0.8rem",
                        ml: 1,
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      minWidth: 130,
                      gap: 1,
                    }}
                  >
                    <TextField
                      label="Mét Vải Dùng"
                      variant="outlined"
                      size="small"
                      type="number"
                      value={usedValue}
                      onChange={(e) =>
                        onUsageChange(mat.material.materialId, e.target.value)
                      }
                      sx={{ width: 130 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">m</InputAdornment>
                        ),
                      }}
                    />
                    <IconButton
                      onClick={() => removeMaterial(mat.material.materialId)}
                      color="error"
                    >
                      <GridCloseIcon />
                    </IconButton>
                  </Box>
                </Card>
              );
            })}
          </Box>
        )}
      </Box>
    );
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createDesignSchema),
    defaultValues: {
      recycledPercentage: 0,
      productScore: 0,
      feature: {
        reduceWaste: false,
        lowImpactDyes: false,
        durable: false,
        ethicallyManufactured: false,
      },
      designTypeId: 1,
      materialsJson: "[]",
      imageFiles: [],
      status: "in stock",
    },
  });

  const onSubmit = async (formData: any) => {
    const materials = selectedMaterials.map((mat) => {
      const used = parseFloat(usageById[mat.material.materialId]) || 0;
      const percentageUsed = (totalUsed > 0 ? used / totalUsed : 0) * 100;

      return {
        materialId: mat.material.materialId,
        persentageUsed: percentageUsed, // <- tính đúng theo yêu cầu
        meterUsed: used,
      };
    });

    const payload = {
      ...formData,
      materialsJson: materials,
      recycledPercentage: weightedSustainabilityPercentage,
    };

    try {
      setLoading(true);
      console.log("Submitted:", payload);

      const result = await DesignService.createDesign(payload);
      toast.success("Gửi đơn thành công!");
    } catch (err) {
      console.error("❌ Error submitting application:", err);
      console.error("❌ Error message:", err.message);
      toast.error("Có lỗi xảy ra khi gửi đơn.");
    } finally {
      setLoading(false);
    }
  };

  //Change Tabs
  const [tabIndex, setTabIndex] = useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  //Scroll TO Anchor
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    const navbarHeight = 150;
    // document.querySelector(".MuiAppBar-root")?.clientHeight || 0;

    if (element) {
      const y =
        element.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Check Lỗi Tabs
  const hasErrorInTab = (tabIndexToCheck: number): boolean => {
    if (tabIndexToCheck === 0) {
      // Chi tiết sản phẩm
      return (
        !!errors.name ||
        !!errors.salePrice ||
        !!errors.description ||
        !!errors.careInstructions
      );
    }
    if (tabIndexToCheck === 2) {
      // Ảnh
      return !!errors.imageFiles;
    }
    return false;
  };

  return (
    <Box id="addProduct" sx={{ width: "100%", margin: "auto" }}>
      {/* Thanh Navigation */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "white",
          borderBottom: "1px solid black",
          borderTop: "1px solid black",
          paddingLeft: 2,
        }}
      >
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/designer/dashboard">
            Dashboard
          </Link>
          <Typography color="text.primary">Thêm Sản Phẩm</Typography>
        </Breadcrumbs>
      </AppBar>
      {/* Top Part */}
      <Box sx={{ width: "100%", display: "flex", padding: 2 }}>
        {/* Title */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            margin: "0 10px",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography sx={{ fontWeight: "bold", fontSize: "30px" }}>
              Thêm Sản Phẩm
            </Typography>
            <Typography>Thêm Sản Phẩm Mới Vào Cửa Hàng Của Mình</Typography>
          </Box>
          <Button variant="outlined" disableRipple>
            <Select
              value={selectedCollection}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "__clear__") {
                  setSelectedCollection("");
                } else {
                  setSelectedCollection(value);
                }
              }}
              displayEmpty
              sx={{
                border: "none",
                "& fieldset": { border: "none" },
                fontWeight: "bold",
              }}
              MenuProps={{
                disableScrollLock: true,
              }}
            >
              {/* Placeholder shown when no selection */}
              <MenuItem value="" disabled>
                <Typography>Chọn Mẫu Có Sẵn</Typography>
              </MenuItem>

              {/* Optional clear selection option */}
              {selectedCollection && (
                <MenuItem value="__clear__">
                  <Typography>Hủy chọn</Typography>
                </MenuItem>
              )}

              {Collection.map((item) => (
                <MenuItem key={item.collection_Id} value={item.collection_Id}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.collection_name}
                      sx={{
                        width: 28,
                        height: 28,
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                    <Typography fontSize={14}>
                      {item.collection_name}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </Button>
        </Box>
      </Box>
      {/* Tabs Part */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            width: "50%",
            background: "rgba(241, 245, 249, 1)",
            display: "flex",
            flexDirection: "column",
          }}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Tabs
            value={tabIndex}
            onChange={handleChangeTab}
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
              label="Chi Tiết"
              sx={{
                flex: 1,
                "&.Mui-selected": {
                  color: "rgba(22, 163, 74)", // Màu khi được chọn
                  fontWeight: "bold", // Tuỳ chọn: in đậm
                },
              }}
            />

            <Tab
              label="Vật Liệu"
              sx={{
                flex: 1,
                "&.Mui-selected": {
                  color: "rgba(22, 163, 74)", // Màu khi được chọn
                  fontWeight: "bold", // Tuỳ chọn: in đậm
                },
              }}
            />
            <Tab
              label="Ảnh"
              sx={{
                flex: 1,
                "&.Mui-selected": {
                  color: "rgba(22, 163, 74)", // Màu khi được chọn
                  fontWeight: "bold", // Tuỳ chọn: in đậm
                },
              }}
            />
            <Tab
              label="Hoàn Thành"
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
        {/* Chi Tiết */}
        {tabIndex === 0 && (
          <Box
            p={3}
            borderRadius={2}
            border="1px solid #eee"
            sx={{
              display: "flex",
              flexDirection: "column",
              margin: "10px 0",
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Chi Tiết Sản Phẩm
            </Typography>
            <Grid
              container
              spacing={3}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              {/* Tên sản phẩm */}
              <Grid sx={{ xs: 12 }}>
                {/* Tên Sản Phẩm */}
                <TextField
                  fullWidth
                  label="Tên sản phẩm"
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  margin="normal"
                />
              </Grid>

              {/* Ngành hàng & Giá */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                {/* Ngành hàng */}
                <Grid sx={{ width: "100%" }}>
                  {/* Ngành Hàng */}
                  <TextField
                    fullWidth
                    label="Ngành hàng"
                    select
                    {...register("designTypeId", { valueAsNumber: true })}
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  >
                    <MenuItem value={1}>Áo</MenuItem>
                    <MenuItem value={2}>Quần</MenuItem>
                    <MenuItem value={3}>Đầm</MenuItem>
                    <MenuItem value={4}>Váy</MenuItem>
                  </TextField>
                </Grid>
                {/* Giá */}
                <Grid sx={{ width: "100%" }}>
                  {/* Giá */}
                  <TextField
                    fullWidth
                    label="Giá"
                    type="number"
                    {...register("salePrice", { valueAsNumber: true })}
                    error={!!errors.salePrice}
                    helperText={errors.salePrice?.message}
                    margin="normal"
                  />
                </Grid>
              </Box>
              {/* Mô tả sản phẩm & Đặc điểm */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  gap: 2,
                }}
              >
                {/* Mô tả sản phẩm & Đặc điểm */}
                <Grid flex={1}>
                  <TextField
                    name="description"
                    label="Mô tả sản phẩm"
                    multiline
                    rows={5}
                    placeholder="Nhập vào"
                    sx={{ width: "100%", height: "100%" }}
                    {...register("description")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </Grid>
                <Grid>
                  <TextField
                    name="careInstructions"
                    label="Hướng dẫn bảo quản"
                    multiline
                    rows={5}
                    placeholder="Nhập vào"
                    sx={{ width: "100%" }}
                    {...register("careInstructions")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </Grid>
              </Box>
              {/* Feature */}
              <Box mt={2}>
                <Typography variant="subtitle1">Tính năng bền vững</Typography>
                <Grid flex={1}>
                  <Typography fontWeight="bold" mb={1}>
                    Đặc Điểm
                  </Typography>
                  <FormGroup
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        fontSize: 16,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      },
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Controller
                          name="feature.reduceWaste"
                          control={control}
                          render={({ field }) => (
                            <Checkbox {...field} checked={field.value} />
                          )}
                        />
                      }
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                          <RecyclingIcon fontSize="small" />
                          <Typography>Giảm Thiểu Rác Thải</Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Controller
                          name="feature.lowImpactDyes"
                          control={control}
                          render={({ field }) => (
                            <Checkbox {...field} checked={field.value} />
                          )}
                        />
                      }
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                          <ScienceIcon fontSize="small" />
                          <Typography>
                            Thuốc nhuộm và quy trình ít tác động đến môi trường
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Controller
                          name="feature.durable"
                          control={control}
                          render={({ field }) => (
                            <Checkbox {...field} checked={field.value} />
                          )}
                        />
                      }
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                          <BuildIcon fontSize="small" />
                          <Typography>
                            Kết cấu bền chắc sử dụng lâu dài
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Controller
                          name="feature.ethicallyManufactured"
                          control={control}
                          render={({ field }) => (
                            <Checkbox {...field} checked={field.value} />
                          )}
                        />
                      }
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                          <FactoryIcon fontSize="small" />
                          <Typography>
                            Quy trình sản xuất có trách nhiệm
                          </Typography>
                        </Box>
                      }
                    />
                  </FormGroup>
                </Grid>
              </Box>
              {/* Giá & Hướng dẫn bảo quản */}

              {/* Chọn Chất Liệu */}
              <Grid>
                <Box textAlign="right">
                  <Button
                    variant="contained"
                    color="success"
                    onClick={async () => {
                      const isValid = await trigger([
                        "name",
                        "salePrice",
                        "description",
                        "careInstructions",
                        "designTypeId",
                      ]);

                      if (isValid) {
                        handleChangeTab(null, tabIndex + 1);
                        handleScroll("addProduct");
                      }
                    }}
                  >
                    Chọn Chất Liệu
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
        {/* Chọn Chất Liệu */}
        {tabIndex === 1 && (
          <Box p={3} borderRadius={2} border="1px solid #eee" margin={"10px 0"}>
            {/* Title */}
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Vật Liệu
            </Typography>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                gap: 2,
              }}
            >
              {/* Stored Material */}
              {/* Thông tin material */}
              <DndContext onDragEnd={handleDragEnd}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    gap: 2,
                  }}
                >
                  <Box p={3} borderRadius={2} border="1px solid #eee" flex={1}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                        flexDirection: "column",
                      }}
                    >
                      {/* In-Stock Materials */}
                      <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                        Vật Liệu Trong Kho
                      </Typography>
                      {/* Search */}
                      <Box
                        sx={{
                          display: "flex",
                          bgcolor: "white",
                          p: 0.5,
                          width: "100%",
                          border: "1px solid black",
                          borderRadius: "5px",
                          margin: "20px 0",
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <TextField
                            placeholder="Tìm kiếm..."
                            variant="standard"
                            fullWidth
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{ disableUnderline: true }}
                            sx={{ ml: 1 }}
                          />
                          <SearchIcon sx={{ color: "black", margin: "auto" }} />
                        </Box>
                      </Box>
                    </Box>
                    {/* Thông tin material */}
                    {filteredMaterials.length === 0 ? (
                      <Box
                        sx={{
                          height: "auto",
                          display: "flex",
                          gap: 2,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ReportGmailerrorredIcon sx={{ color: "red" }} />
                        <Typography
                          variant="h5"
                          textAlign="center"
                          color="text.secondary"
                        >
                          Không tìm thấy vật liệu phù hợp
                        </Typography>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          maxHeight: 400,
                          overflowY:
                            filteredMaterials.length > 3 ? "auto" : "visible", // Example condition
                        }}
                      >
                        {filteredMaterials.map((mat, index) => (
                          <>
                            <DraggableCard key={index} mat={mat.material} />
                          </>
                        ))}
                      </Box>
                    )}
                  </Box>
                  <DropArea
                    selectedMaterials={selectedMaterials}
                    removeMaterial={removeMaterial}
                    usageById={usageById}
                    onUsageChange={handleUsageChange}
                  />
                  <DragOverlay>
                    {activeDragItem ? (
                      <Card
                        variant="outlined"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          px: 2,
                          m: 2,
                          cursor: "grabbing",
                          backgroundColor: "white",
                          boxShadow: 3,
                        }}
                      >
                        <Box flexGrow={1}>
                          <Typography fontWeight="bold">
                            {activeDragItem.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {activeDragItem.materialId}
                          </Typography>
                          <Chip
                            size="small"
                            icon={<EcoIcon />}
                            label={`${activeDragItem.recycledPercentage}% Tái Chế`}
                            sx={{
                              bgcolor: "#E6F4EA",
                              color: "#388E3C",
                              fontSize: "0.9rem",
                              ml: 1,
                            }}
                          />
                        </Box>
                      </Card>
                    ) : null}
                  </DragOverlay>
                </Box>
              </DndContext>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 4 }}>
              <Button
                color="inherit"
                onClick={(e) => {
                  handleChangeTab(e, tabIndex - 1);
                  handleScroll("addProduct");
                }}
                sx={{ mr: 1 }}
              >
                Quay lại
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />

              <Button
                variant="contained"
                onClick={() => {
                  if (selectedMaterials.length === 0) {
                    // You can show an error or toast
                    toast.error(
                      "Vui lòng chọn ít nhất một chất liệu trước khi tiếp tục."
                    );
                    return;
                  }

                  handleChangeTab(null, tabIndex + 1); // go to next tab
                  handleScroll("addProduct");
                }}
              >
                Đăng Ảnh
              </Button>
            </Box>
          </Box>
        )}
        {/* Ảnh */}
        {tabIndex === 2 && (
          <Box
            p={3}
            borderRadius={2}
            border="1px solid #eee"
            sx={{
              display: "flex",
              flexDirection: "column",
              margin: "10px 0",
            }}
          >
            <Typography variant="h5" fontWeight={"bold"} sx={{ mb: 2 }}>
              Ảnh Sản Phẩm
            </Typography>
            <Controller
              name="imageFiles"
              control={control}
              rules={{ required: "Cần thêm hình ảnh" }}
              render={({ field, fieldState }) => (
                <FileUpload
                  label=""
                  multiple
                  files={
                    field.value
                      ? Array.isArray(field.value)
                        ? field.value
                        : [field.value]
                      : []
                  }
                  onFilesChange={(files) => field.onChange(files)}
                  accept="image/*"
                  maxSize={5}
                  required={!!fieldState.error} // shows red border or error state
                  helperText={fieldState.error?.message} // show the message
                />
              )}
            />
            <Typography variant="caption" sx={{ mt: 2 }}>
              Thêm tối thiểu 3 hình ảnh bổ sung hiển thị các góc hoặc chi tiết
              khác nhau{" "}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 4 }}>
              <Button
                color="inherit"
                onClick={(e) => {
                  handleChangeTab(e, tabIndex - 1);
                  handleScroll("addProduct");
                }}
                sx={{ mr: 1 }}
              >
                Quay lại
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />

              <Box mt={3}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  startIcon={loading && <CircularProgress size={20} />}
                  disabled={loading}
                  onClick={(e) => {
                    if (loading) {
                      handleChangeTab(e, tabIndex + 1);
                      handleScroll("addProduct");
                    }
                  }}
                >
                  Gửi đơn
                </Button>
              </Box>
            </Box>
          </Box>
        )}
        {tabIndex === 3 && <div>Hoàn THành</div>}
      </Box>
    </Box>
  );
};

export default AddDesign;
