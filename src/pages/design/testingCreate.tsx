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
import { useEffect, useState } from "react";
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
//Example
import ao_linen from "../../assets/pictures/example/ao-linen.webp";
import chan_vay_dap from "../../assets/pictures/example/chan-vay-dap.webp";
import dam_con_trung from "../../assets/pictures/example/dam-con-trung.webp";
import { EcoIcon } from "../../assets/icons/icon";
import DesignService, {
  Material,
  StoredMaterial,
} from "../../services/api/designService";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import FileUpload from "../../components/FileUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import { applyApplicationSchema } from "../../schemas/applyApplicationSchema";
//Drag and Drop
import {
  DndContext,
  useDraggable,
  useDroppable,
  closestCenter,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { GridCloseIcon } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { createDesignSchema } from "../../schemas/createDesignSchema";
import ColorPicker from "../../components/ColorPicker";

const Collection = [
  { collection_Id: 1, collection_name: "Áo Linen", image: ao_linen },
  { collection_Id: 2, collection_name: "Chân Váy Mây", image: chan_vay_dap },
  { collection_Id: 3, collection_name: "Đầm Côn Trùng", image: dam_con_trung },
];

export default function testingCreate() {
  //Loading
  const [loading, setLoading] = useState(true);
  //Error
  const [error, setError] = useState<string | null>(null);
  //Design Data
  const [storedMaterial, setStoredMaterial] = useState<StoredMaterial[]>([]);
  //Navigate
  const navigate = useNavigate();

  //Get Material Data
  useEffect(() => {
    loadStoredMaterial();
  }, []);
  const loadStoredMaterial = async () => {
    try {
      setLoading(true);
      setError(null);
    } catch (error: any) {
      const errorMessage =
        error.message || "Không thể tải danh sách nhà thiết kế";
      setError(errorMessage);
      toast.error(errorMessage, { position: "bottom-center" });
    } finally {
      setLoading(false);
    }
  };
  //Tabs
  //Change Tabs
  const [tabIndex, setTabIndex] = useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const [selectedCollection, setSelectedCollection] = useState("");

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

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createDesignSchema),
    defaultValues: {
      name: "",
      description: "",
      careInstructions: "",
      price: 0,
      productScore: 0,
      status: "",
      designTypeId: 1,
      feature: {
        reduceWaste: false,
        lowImpactDyes: false,
        durable: false,
        ethicallyManufactured: false,
      },
      materialsJson: "[]",
      imageFiles: [],
    },
  });

  const [selectedMaterials, setSelectedMaterials] = useState<any[]>([]);

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
    const combined = `${mat.name} ${mat.materialId}`;
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
          <Typography variant="body2" color="text.secondary">
            {mat.materialId}
          </Typography>
          <Chip
            size="small"
            icon={<EcoIcon />}
            label={`${mat.recycledPercentage}% Tái Chế`}
            sx={{
              bgcolor: "#E6F4EA",
              color: "#388E3C",
              fontSize: "0.9rem",
              ml: 1,
            }}
          />
        </Box>
        <Button variant="outlined" size="small">
          Thêm
        </Button>
      </Card>
    );
  };

  const [usageById, setUsageById] = useState<Record<string, string>>({});

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

  const DropArea = ({
    selectedMaterials,
    removeMaterial,
    usageById,
    onUsageChange,
  }: DropAreaProps) => {
    const { setNodeRef } = useDroppable({ id: "drop-area" });
    const totalUsed = Object.values(usageById).reduce(
      (sum: number, val: string) => sum + (parseFloat(val) || 0),
      0
    );

    const recycledPercent = selectedMaterials.reduce((sum, mat) => {
      const used = parseFloat(usageById[mat.materialId]) || 0;
      return sum + used * (mat.recycledPercentage || 0);
    }, 0);

    const weightedRecycledPercentage =
      totalUsed > 0 ? Math.round(recycledPercent / totalUsed) : 0;

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
                ? `${weightedRecycledPercentage}% Tái Chế`
                : "... % Tái Chế"
            }
            sx={{
              bgcolor: "#E6F4EA",
              color: "#388E3C",
              fontSize: "0.9rem",
              ml: 1,
            }}
          />
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
          selectedMaterials.map((mat) => {
            const usedValue = parseFloat(usageById[mat.materialId] || "") || 0;
            const percent =
              totalUsed > 0 ? Math.ceil((usedValue / totalUsed) * 100) : 0;

            return (
              <Card
                key={mat.materialId}
                variant="outlined"
                sx={{
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  m: 2,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Box flexGrow={1}>
                  <Typography fontWeight="bold">{mat.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {mat.materialId}
                  </Typography>
                  <Chip
                    size="small"
                    icon={<EcoIcon />}
                    label={`${mat.recycledPercentage}% Tái Chế`}
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
                    key={mat.materialId}
                    label="Mét Vải Dùng"
                    variant="outlined"
                    size="small"
                    type="number"
                    value={usedValue}
                    onChange={(e) =>
                      onUsageChange(mat.materialId, e.target.value)
                    }
                    sx={{ width: 130 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">m</InputAdornment>
                      ),
                    }}
                  />
                  <IconButton
                    onClick={() => removeMaterial(mat.materialId)}
                    color="error"
                  >
                    <GridCloseIcon />
                  </IconButton>
                </Box>
              </Card>
            );
          })
        )}
      </Box>
    );
  };

  const [features, setFeatures] = useState({
    ReduceWaste: false,
    LowImpactDyes: false,
    Durable: false,
    EthicallyManufactured: false,
  });

  const handleFeatureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFeatures((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };

  //On Submit
  // const onSubmit = async (data) => {
  //   const materials = selectedMaterials.map((mat) => ({
  //     materialId: mat.materialId,
  //     persentageUsed: parseFloat(usageById[mat.materialId]) || 0,
  //     meterUsed: parseFloat(usageById[mat.materialId]) || 0,
  //   }));

  //   const payload = { ...data, materialsJson: JSON.stringify(materials) };

  //   try {
  //     console.log(features);
  //     setLoading(true);
  //     toast.info("Đang xử lý đơn đăng ký...");
  //     const result = await DesignService.createDesign(payload);
  //     console.log(result);
  //     toast.success("Thêm sản phẩm thành công!");
  //     // navigate("/my-applications");
  //   } catch (err) {
  //     console.error("❌ Error submitting application:", err);
  //     toast.error("Có lỗi xảy ra khi gửi đơn.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const onSubmit = async (formData: any) => {
    const materials = selectedMaterials.map((mat) => ({
      materialId: mat.materialId,
      persentageUsed: parseFloat(usageById[mat.materialId]) || 0,
      meterUsed: parseFloat(usageById[mat.materialId]) || 0,
    }));

    const payload = {
      ...formData,
      materialsJson: JSON.stringify(materials),
    };

    try {
      setLoading(true);
      const result = await DesignService.createDesign(payload);
      toast.success("Gửi đơn thành công!");
    } catch (err) {
      toast.error("Có lỗi xảy ra khi gửi đơn.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", margin: "auto" }}>
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
      <Box id="addProduct" sx={{ width: "95%", margin: "auto" }}>
        {/* Top Part */}
        <Box sx={{ width: "100%", display: "flex" }}>
          {/* Title */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              paddingTop: 2,
              paddingBottom: 2,
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
        {/* Tabs */}
        {/* Tab Part */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              width: "50%",
              background: "rgba(241, 245, 249, 1)",
              display: "flex",
              flexDirection: "column",
            }}
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
          {/* Tab Chi Tiết */}
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
                  <TextField
                    fullWidth
                    label="Tên sản phẩm"
                    placeholder="Nhập vào"
                    {...register("name")}
                    error={!!errors.name}
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
                    <TextField
                      select
                      fullWidth
                      label="Ngành hàng"
                      defaultValue={1}
                      {...register("designTypeId")}
                    >
                      <MenuItem disabled value={null}>
                        Chọn
                      </MenuItem>
                      <MenuItem value={1}>Áo</MenuItem>
                      <MenuItem value={2}>Quần</MenuItem>
                      <MenuItem value={3}>Đầm</MenuItem>
                      <MenuItem value={4}>Váy</MenuItem>
                    </TextField>
                  </Grid>
                  {/* Giá */}
                  <Grid sx={{ width: "100%" }}>
                    <TextField
                      fullWidth
                      label="Giá"
                      placeholder="Nhập vào"
                      {...register("price")}
                    />
                  </Grid>
                </Box>
                {/* Mô tả sản phẩm & Đặc điểm */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
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
                      />
                    </Grid>
                  </Box>
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
                          // <Checkbox
                          // // checked={features.ReduceWaste}
                          // // onChange={handleFeatureChange}
                          // // name="ReduceWaste"
                          // />
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
                          // <Checkbox
                          //   checked={features.LowImpactDyes}
                          //   onChange={handleFeatureChange}
                          //   name="LowImpactDyes"
                          // />
                        }
                        label={
                          <Box display="flex" alignItems="center" gap={1}>
                            <ScienceIcon fontSize="small" />
                            <Typography>
                              Thuốc nhuộm và quy trình ít tác động đến môi
                              trường
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
                          // <Checkbox
                          //   checked={features.Durable}
                          //   onChange={handleFeatureChange}
                          //   name="Durable"
                          // />
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
                          // <Checkbox
                          //   checked={features.EthicallyManufactured}
                          //   onChange={handleFeatureChange}
                          //   name="EthicallyManufactured"
                          // />
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
                      onClick={(e) => {
                        handleChangeTab(e, tabIndex + 1);
                        handleScroll("addProduct");
                      }}
                    >
                      Chọn Chất Liệu
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
          {/* Tab Vật Liệu  */}
          {tabIndex === 1 && (
            <Box
              p={3}
              borderRadius={2}
              border="1px solid #eee"
              margin={"10px 0"}
            >
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
                    <Box
                      p={3}
                      borderRadius={2}
                      border="1px solid #eee"
                      flex={1}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                          flexDirection: "column",
                        }}
                      >
                        {/* In-Stock Materials */}
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          mb={1}
                        >
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
                            <SearchIcon
                              sx={{ color: "black", margin: "auto" }}
                            />
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
                            <DraggableCard key={index} mat={mat} />
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
                  onClick={(e) => {
                    handleChangeTab(e, tabIndex + 1);
                    handleScroll("addProduct");
                  }}
                >
                  Đăng Ảnh
                </Button>
              </Box>
            </Box>
          )}
          {/* Tab Ảnh*/}
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
                render={({ field }) => (
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
                  >
                    Lưu
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
          {tabIndex === 3 && <div>Hoàn THành</div>}
        </Box>
      </Box>
      <Divider />
      <ColorPicker />
    </Box>
  );
}
