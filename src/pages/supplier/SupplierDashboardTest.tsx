// import {
//   Avatar,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   CardMedia,
//   Chip,
//   Dialog,
//   Grid,
//   IconButton,
//   Link,
//   MenuItem,
//   Rating,
//   Select,
//   Stack,
//   styled,
//   Tab,
//   Tabs,
//   Typography,
// } from "@mui/material";
// import { DataGrid, type GridColDef } from "@mui/x-data-grid";
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import StarIcon from "@mui/icons-material/Star";
// import GroupIcon from "@mui/icons-material/Group";
// import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
// import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
// import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
// import DesignServicesOutlinedIcon from "@mui/icons-material/DesignServicesOutlined";
// import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
// import DrawOutlinedIcon from "@mui/icons-material/DrawOutlined";
// import { EcoIcon } from "../../assets/icons/icon";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import WaterDropIcon from "@mui/icons-material/WaterDrop";
// import AirIcon from "@mui/icons-material/Air";
// import CompostIcon from "@mui/icons-material/Compost";
// import CloseIcon from "@mui/icons-material/Close";
// import InventoryIcon from "@mui/icons-material/Inventory";
// import BusinessIcon from "@mui/icons-material/Business";
// import AssessmentIcon from "@mui/icons-material/Assessment";
// import AddIcon from "@mui/icons-material/Add";
// //Example
// import ao_linen from "../../assets/pictures/example/ao-linen.webp";
// import chan_vay_dap from "../../assets/pictures/example/chan-vay-dap.webp";
// import dam_con_trung from "../../assets/pictures/example/dam-con-trung.webp";

// //Chart
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   LineElement,
//   PointElement,
//   LinearScale,
//   Title,
//   CategoryScale,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { toast } from "react-toastify";
// import { useAuthStore } from "../../store/authStore";

// // Register chart components
// ChartJS.register(
//   LineElement,
//   PointElement,
//   LinearScale,
//   Title,
//   CategoryScale,
//   Tooltip,
//   Legend
// );

// export default function SupplierDashBoard() {
//   window.scrollTo(0, 0);
//   const stats = [
//     {
//       title: "Tổng Vật Liệu",
//       value: "156",
//       subtitle: "12 loại vật liệu mới tháng này",
//       icon: <InventoryIcon />,
//       color: "success.main",
//     },
//     {
//       title: "Tổng Doanh Thu",
//       value: "15.800.000đ",
//       subtitle: "Tăng 25%",
//       icon: <TrendingUpIcon />,
//       color: "info.main",
//     },
//     {
//       title: "Đánh Giá Trung Bình",
//       value: "4.8",
//       subtitle: "Từ 156 đánh giá",
//       icon: <StarIcon />,
//       color: "warning.main",
//     },
//     {
//       title: "Khách Hàng",
//       value: "89",
//       subtitle: "23 khách hàng mới",
//       icon: <GroupIcon />,
//       color: "secondary.main",
//     },
//   ];
//   const material_stats = [
//     {
//       title: "Tổng Vật Liệu",
//       value: "156",
//       subtitle: "Tất cả các loại chất liệu",
//       icon: <InventoryIcon />,
//       color: "success.main",
//     },
//     {
//       title: "Tổng Tiền Thu",
//       value: "15.800.000đ",
//       subtitle: "Tổng số tiền đã thu",
//       icon: <TrendingUpIcon />,
//       color: "info.main",
//     },
//     {
//       title: "Vật Liệu Sắp Hết",
//       value: "8",
//       subtitle: "Loại cần nhập thêm",
//       icon: <StarIcon />,
//       color: "warning.main",
//     },
//     {
//       title: "Tổng Mét Vải Hiện Có",
//       value: "2.450",
//       subtitle: "Mét vải hiện có trong kho",
//       icon: <GroupIcon />,
//       color: "warning.main",
//     },
//   ];

//   const messages = [
//     {
//       sender: "EcoDesign Studio",
//       timeSend: "2 giờ trước",
//       content: "Đặt hàng vải cotton tái chế",
//     },
//     {
//       sender: "Green Fashion Co.",
//       timeSend: "5 giờ trước",
//       content: "Yêu cầu báo giá denim organic",
//     },
//     {
//       sender: "Sustainable Textiles",
//       timeSend: "6 giờ trước",
//       content: "Xác nhận đơn hàng #ST-7842",
//     },
//   ];

//   const orders = [
//     {
//       orderId: "ORD-01",
//       product: "Vải Cotton Tái Chế (500m)",
//       status: 1, //1: Đang Vận Chuyển, 2: Chưa Xử Lý, 3: Đã Giao Hàng
//     },
//     {
//       orderId: "ORD-02",
//       product: "Vải Denim Organic (200m)",
//       status: 2, //1: Đang Vận Chuyển, 2: Chưa Xử Lý, 3: Đã Giao Hàng
//     },
//     {
//       orderId: "ORD-03",
//       product: "Vải Linen Hữu Cơ (300m)",
//       status: 3, //1: Đang Vận Chuyển, 2: Chưa Xử Lý, 3: Đã Giao Hàng
//     },
//   ];

//   const materials = [
//     {
//       id: 1,
//       material: "Cotton Tái Chế",
//       quantity: "500m",
//       status: "Còn Hàng",
//       price: "45.000đ/m",
//       totalValue: "22.500.000đ",
//       lastUpdated: "2025-07-01",
//     },
//     {
//       id: 2,
//       material: "Denim Organic",
//       quantity: "200m",
//       status: "Còn Ít Hàng",
//       price: "85.000đ/m",
//       totalValue: "17.000.000đ",
//       lastUpdated: "2025-06-30",
//     },
//     {
//       id: 3,
//       material: "Linen Hữu Cơ",
//       quantity: "300m",
//       status: "Còn Hàng",
//       price: "120.000đ/m",
//       totalValue: "36.000.000đ",
//       lastUpdated: "2025-07-02",
//     },
//     {
//       id: 4,
//       material: "Vải Sợi Tái Chế",
//       quantity: "400m",
//       status: "Còn Hàng",
//       price: "65.000đ/m",
//       totalValue: "26.000.000đ",
//       lastUpdated: "2025-07-02",
//     },
//     {
//       id: 5,
//       material: "Vải Bamboo",
//       quantity: "150m",
//       status: "Hết Hàng",
//       price: "95.000đ/m",
//       totalValue: "14.250.000đ",
//       lastUpdated: "2025-06-28",
//     },
//     {
//       id: 6,
//       material: "Vải Hemp",
//       quantity: "250m",
//       status: "Còn Hàng",
//       price: "110.000đ/m",
//       totalValue: "27.500.000đ",
//       lastUpdated: "2025-07-01",
//     },
//     {
//       id: 7,
//       material: "Vải Tencel",
//       quantity: "180m",
//       status: "Còn Hàng",
//       price: "130.000đ/m",
//       totalValue: "23.400.000đ",
//       lastUpdated: "2025-07-02",
//     },
//     {
//       id: 8,
//       material: "Vải Modal",
//       quantity: "220m",
//       status: "Còn Ít Hàng",
//       price: "100.000đ/m",
//       totalValue: "22.000.000đ",
//       lastUpdated: "2025-06-29",
//     },
//   ];

//   const columns: GridColDef<(typeof materials)[number]>[] = [
//     { field: "id", headerName: "ID", width: 90 },
//     {
//       field: "material",
//       headerName: "Chất Liệu",
//       width: 110,
//       flex: 1,
//     },
//     {
//       field: "quantity",
//       headerName: "Số Lượng",
//       width: 110,
//       flex: 1,
//     },
//     {
//       field: "status",
//       headerName: "Trạng Thái",
//       width: 110,
//       renderCell: (params) => {
//         let color:
//           | "default"
//           | "primary"
//           | "secondary"
//           | "error"
//           | "info"
//           | "success"
//           | "warning" = "default";
//         switch (params.value) {
//           case "Còn Hàng":
//             color = "success";
//             break;
//           case "Còn Ít Hàng":
//             color = "warning";
//             break;
//           case "Hết Hàng":
//             color = "error";
//             break;
//           default:
//             color = "default";
//         }

//         return <Chip label={params.value} color={color} size="small" />;
//       },
//       flex: 1,
//     },
//     {
//       field: "price",
//       headerName: "Giá 1 Mét Vải",
//       width: 110,
//       flex: 1,
//     },
//     {
//       field: "totalValue",
//       headerName: "Tổng Giá Trị",
//       width: 110,
//       flex: 1,
//     },
//     {
//       field: "lastUpdated",
//       headerName: "Ngày Cập Nhật",
//       width: 150,
//       flex: 1,
//     },
//     {
//       field: "actions",
//       headerName: "Hành Động",
//       width: 120,
//       sortable: false,
//       filterable: false,
//       headerAlign: "right",
//       disableColumnMenu: true,
//       renderCell: (params) => {
//         const handleEdit = () => {
//           // Replace with your edit logic
//           console.log("Edit item:", params.row);
//         };

//         const handleDelete = () => {
//           // Replace with your delete logic
//           console.log("Delete item:", params.row);
//         };

//         return (
//           <Box
//             sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
//           >
//             <Stack direction="row" spacing={1}>
//               <IconButton size="small" onClick={handleEdit} color="primary">
//                 <EditIcon fontSize="small" />
//               </IconButton>
//               <IconButton size="small" onClick={handleDelete} color="error">
//                 <DeleteIcon fontSize="small" />
//               </IconButton>
//             </Stack>
//           </Box>
//         );
//       },
//       flex: 1,
//     },
//   ];

//   const yearData = [
//     { label: "Jan", revenue: 125000, cost: 85000 },
//     { label: "Feb", revenue: 145000, cost: 95000 },
//     { label: "Mar", revenue: 180000, cost: 110000 },
//     { label: "Apr", revenue: 165000, cost: 105000 },
//     { label: "May", revenue: 195000, cost: 125000 },
//     { label: "Jun", revenue: 220000, cost: 140000 },
//     { label: "Jul", revenue: 185000, cost: 115000 },
//     { label: "Aug", revenue: 210000, cost: 130000 },
//     { label: "Sep", revenue: 175000, cost: 110000 },
//     { label: "Oct", revenue: 200000, cost: 125000 },
//     { label: "Nov", revenue: 160000, cost: 100000 },
//     { label: "Dec", revenue: 230000, cost: 145000 },
//   ];

//   const weekData = [
//     { label: "Mon", revenue: 25000, cost: 15000 },
//     { label: "Tue", revenue: 30000, cost: 18000 },
//     { label: "Wed", revenue: 35000, cost: 20000 },
//     { label: "Thu", revenue: 28000, cost: 17000 },
//     { label: "Fri", revenue: 40000, cost: 25000 },
//     { label: "Sat", revenue: 45000, cost: 28000 },
//     { label: "Sun", revenue: 22000, cost: 14000 },
//   ];

//   const monthData = [
//     { label: "Week 1", revenue: 120000, cost: 75000 },
//     { label: "Week 2", revenue: 140000, cost: 85000 },
//     { label: "Week 3", revenue: 160000, cost: 95000 },
//     { label: "Week 4", revenue: 180000, cost: 110000 },
//   ];

//   const [range, setRange] = useState("year");

//   const getCurrentData = () => {
//     if (range === "week") return weekData;
//     if (range === "month") return monthData;
//     return yearData;
//   };
//   const chartData = getCurrentData();

//   const { user } = useAuthStore();
//   //Change Tabs
//   const [tabIndex, setTabIndex] = useState(0);

//   const handleChange = (event: React.SyntheticEvent, newValue: number) => {
//     setTabIndex(newValue);
//   };

//   const [open, setOpen] = React.useState(false);
//   const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

//   const handleClickOpen = (image: string) => {
//     setOpen(true);
//     setSelectedImage(image);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setSelectedImage(null);
//   };

//   const BootstrapDialog = styled(Dialog)(({ theme }) => ({
//     "& .MuiDialogContent-root": {
//       padding: theme.spacing(2),
//     },
//     "& .MuiDialogActions-root": {
//       padding: theme.spacing(1),
//     },
//   }));

//   return (
//     <Box sx={{ width: "95%", margin: "auto" }}>
//       {/* Top Part */}
//       <Box sx={{ width: "100%", display: "flex" }}>
//         {/* Title */}
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             paddingTop: 3,
//             paddingBottom: 3,
//           }}
//         >
//           <Typography sx={{ fontWeight: "bold", fontSize: "30px" }}>
//             Supplier Dashboard
//           </Typography>
//           <Typography>Chào mừng trở lại, {user?.fullName}</Typography>
//         </Box>
//         {/* Button */}
//         <Box sx={{ display: "flex", marginLeft: "auto", gap: 2 }}>
//           <Button
//             variant="outlined"
//             sx={{
//               borderColor: "black",
//               marginRight: "20px",
//               height: "60%",
//               margin: "auto",
//             }}
//           >
//             <Typography
//               sx={{
//                 fontWeight: "bold",
//                 color: "black",
//               }}
//             >
//               Quản Lý Đơn Hàng
//             </Typography>
//           </Button>
//           <Button
//             variant="contained"
//             size="small"
//             sx={{
//               backgroundColor: "rgba(22, 163, 74)",
//               "&:hover": { bgcolor: "white", color: "rgba(22, 163, 74)" },
//               px: 4,
//               py: 1.5,
//               height: "60%",
//               margin: "auto",
//             }}
//             href="/supplier/dashboard/add"
//           >
//             <Box
//               sx={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 gap: 1,
//               }}
//             >
//               <AddIcon />
//               <Typography
//                 sx={{
//                   fontWeight: "bold",
//                   color: "white",
//                   "&:hover": {
//                     color: "rgba(22, 163, 74, 0.55)",
//                   },
//                 }}
//               >
//                 Thêm Vật Liệu
//               </Typography>
//             </Box>
//           </Button>
//         </Box>
//       </Box>
//       {/* Tab Part */}
//       <Box
//         sx={{
//           width: "30%",
//           background: "rgba(241, 245, 249, 1)",
//           display: "flex",
//         }}
//       >
//         <Tabs
//           value={tabIndex}
//           onChange={handleChange}
//           sx={{
//             width: "100%",
//             margin: "auto",
//           }}
//           TabIndicatorProps={{
//             sx: {
//               backgroundColor: "rgba(22, 163, 74)",
//               borderRadius: "2px",
//             },
//           }}
//         >
//           <Tab
//             label="Trang chủ"
//             sx={{
//               flex: 1,
//               "&.Mui-selected": {
//                 color: "rgba(22, 163, 74)", // Màu khi được chọn
//                 fontWeight: "bold", // Tuỳ chọn: in đậm
//               },
//             }}
//           />
//           <Tab
//             label="Kho Vật Liệu"
//             sx={{
//               flex: 1,
//               "&.Mui-selected": {
//                 color: "rgba(22, 163, 74)", // Màu khi được chọn
//                 fontWeight: "bold", // Tuỳ chọn: in đậm
//               },
//             }}
//           />
//         </Tabs>
//       </Box>

//       {/* Tab Content */}
//       {/* Tab Trang Chủ */}
//       {tabIndex === 0 && (
//         <Box sx={{ width: "100%" }}>
//           <Box
//             sx={{
//               width: "100%",
//               display: "flex",
//               gap: 3,
//             }}
//           >
//             {stats.map((item, index) => (
//               <Grid key={index} sx={{ flex: 1, margin: "20px 0" }}>
//                 <Card variant="outlined" sx={{ borderRadius: 2 }}>
//                   <CardContent>
//                     <Stack
//                       direction="row"
//                       justifyContent="space-between"
//                       alignItems="center"
//                     >
//                       <Typography variant="subtitle2" color="text.secondary">
//                         {item.title}
//                       </Typography>
//                       <Avatar
//                         sx={{ bgcolor: item.color, width: 35, height: 35 }}
//                       >
//                         {item.icon}
//                       </Avatar>
//                     </Stack>
//                     <Typography variant="h5" fontWeight="bold" mt={1}>
//                       {item.value}
//                     </Typography>
//                     <Typography variant="body2" color="success.main" mt={0.5}>
//                       ↗ {item.subtitle}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Box>
//           {/* Graph & Popular Product*/}
//           <Box width={"100%"} sx={{ display: "flex", gap: 3 }}>
//             <Stack direction="row" sx={{ width: "100%" }} spacing={3}>
//               {/* Graph */}
//               <Card sx={{ width: "60%", flex: 1 }}>
//                 <Box
//                   sx={{ border: "1px solid rgba(0, 0, 0, 0.1)", padding: 3 }}
//                 >
//                   <Box width={"100%"} sx={{ display: "flex" }}>
//                     <Box
//                       width={"100%"}
//                       sx={{ display: "flex", flexDirection: "column" }}
//                     >
//                       <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
//                         Tổng Quan Doanh Thu
//                       </Typography>
//                       <Typography sx={{ opacity: "50%" }}>
//                         Doanh số vật liệu của bạn trong{" "}
//                         {`${
//                           range === "week"
//                             ? "1 tuần"
//                             : range === "month"
//                             ? "1 tháng"
//                             : "1 năm"
//                         }`}{" "}
//                         qua
//                       </Typography>{" "}
//                     </Box>
//                     <Select
//                       defaultValue="week"
//                       sx={{
//                         border: "none",
//                         fontSize: 14,
//                         minWidth: 100,
//                       }}
//                     >
//                       <MenuItem value="week" onClick={() => setRange("week")}>
//                         1 Tuần
//                       </MenuItem>
//                       <MenuItem value="month" onClick={() => setRange("month")}>
//                         1 Tháng
//                       </MenuItem>
//                       <MenuItem value="year" onClick={() => setRange("year")}>
//                         1 Năm
//                       </MenuItem>
//                     </Select>
//                   </Box>
//                   <Line
//                     data={{
//                       labels: chartData.map((d) => d.label),
//                       datasets: [
//                         {
//                           label: "Doanh Thu",
//                           data: chartData.map((d) => d.revenue),
//                           backgroundColor: "#064FF0",
//                           borderColor: "#064FF0",
//                         },
//                         {
//                           label: "Chi Phí",
//                           data: chartData.map((d) => d.cost),
//                           backgroundColor: "#FF3030",
//                           borderColor: "#FF3030",
//                         },
//                       ],
//                     }}
//                     options={{
//                       responsive: true,
//                       elements: {
//                         line: {
//                           tension: 0.4,
//                         },
//                       },
//                       plugins: {
//                         legend: { position: "top" },
//                         title: {
//                           display: true,
//                         },
//                       },
//                     }}
//                   />
//                 </Box>
//               </Card>
//               {/* Popular Materials */}
//               <Card sx={{ width: "60%", flex: 1 }}>
//                 <Box
//                   sx={{ border: "1px solid rgba(0, 0, 0, 0.1)", padding: 3 }}
//                 >
//                   {/* Title */}
//                   <Box
//                     width="100%"
//                     sx={{ display: "flex", justifyContent: "space-between" }}
//                   >
//                     <Box>
//                       <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
//                         Vật Liệu Bán Chạy
//                       </Typography>
//                       <Typography sx={{ opacity: "50%" }}>
//                         Vật liệu được đặt hàng nhiều nhất
//                       </Typography>
//                     </Box>
//                   </Box>

//                   <Stack
//                     spacing={2}
//                     sx={{
//                       mt: 2,
//                       maxHeight: 300, // set max height for scroll area
//                       overflowY: "auto",
//                       pr: 1,
//                       scrollbarWidth: "thin",
//                       "&::-webkit-scrollbar": {
//                         width: 6,
//                       },
//                       "&::-webkit-scrollbar-thumb": {
//                         backgroundColor: "rgba(0,0,0,0.2)",
//                         borderRadius: 4,
//                       },
//                     }}
//                   >
//                     {materials.slice(0, 5).map((item) => (
//                       <Button
//                         key={item.id}
//                         variant="outlined"
//                         sx={{
//                           borderColor: "rgba(0,0,0,0.1)",
//                           textTransform: "none",
//                           width: "100%",
//                           padding: 2,
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                         }}
//                       >
//                         {/* Left side */}
//                         <Box sx={{ textAlign: "left" }}>
//                           <Typography
//                             sx={{
//                               fontWeight: "bold",
//                               color: "black",
//                               mb: 1,
//                             }}
//                           >
//                             {item.material}
//                           </Typography>
//                           <Box sx={{ display: "flex", alignItems: "center" }}>
//                             <Chip
//                               icon={<EcoIcon />}
//                               label={`${item.quantity} còn lại`}
//                               size="small"
//                               sx={{
//                                 backgroundColor: "rgba(200, 248, 217, 1)",
//                                 color: "rgba(22, 103, 86, 1)",
//                                 marginRight: 1,
//                                 fontWeight: "bold",
//                               }}
//                             />
//                             <Typography
//                               sx={{
//                                 color: "black",
//                                 opacity: 0.4,
//                                 whiteSpace: "nowrap",
//                                 overflow: "hidden",
//                                 textOverflow: "ellipsis",
//                               }}
//                             >
//                               Giá: {item.price}
//                             </Typography>
//                           </Box>
//                         </Box>

//                         {/* Right side */}
//                         <Typography
//                           sx={{ color: "black", whiteSpace: "nowrap", ml: 2 }}
//                         >
//                           Chi Tiết
//                         </Typography>
//                       </Button>
//                     ))}
//                   </Stack>
//                 </Box>
//               </Card>
//             </Stack>
//           </Box>
//         </Box>
//       )}
//       {/* Tab Vật Liệu*/}
//       {tabIndex === 1 && (
//         <Box sx={{ width: "100%" }}>
//           {/* Material Stat */}
//           <Box
//             sx={{
//               width: "100%",
//               display: "flex",
//               gap: 3,
//             }}
//           >
//             {material_stats.map((item, index) => (
//               <Grid key={index} sx={{ flex: 1, margin: "20px 0" }}>
//                 <Card variant="outlined" sx={{ borderRadius: 2 }}>
//                   <CardContent>
//                     <Stack
//                       direction="row"
//                       justifyContent="space-between"
//                       alignItems="center"
//                     >
//                       <Typography variant="subtitle2" color="text.secondary">
//                         {item.title}
//                       </Typography>
//                       <Avatar
//                         sx={{ bgcolor: item.color, width: 35, height: 35 }}
//                       >
//                         {item.icon}
//                       </Avatar>
//                     </Stack>
//                     <Typography variant="h5" fontWeight="bold" mt={1}>
//                       {item.value}
//                     </Typography>
//                     <Typography variant="body2" color="success.main" mt={0.5}>
//                       {item.subtitle}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Box>
//           {/* Table */}
//           <DataGrid
//             rows={materials}
//             columns={columns}
//             initialState={{
//               pagination: {
//                 paginationModel: {
//                   pageSize: 5,
//                 },
//               },
//             }}
//             pageSizeOptions={[5]}
//             disableRowSelectionOnClick
//             sx={{
//               width: "100%", // or set a fixed px width like "800px"
//             }}
//           />
//         </Box>
//       )}

//       {/* Bottom Part */}
//       <Box sx={{ width: "100%", display: "flex", gap: 3, margin: "30px 0" }}>
//         {/* Card Quản Lý Kinh Doanh */}
//         <Card
//           sx={{
//             textAlign: "center",
//             p: 2,
//             flex: 1,
//             border: "1px solid rgba(0, 0, 0, 0.1)",
//           }}
//         >
//           <Box sx={{ display: "flex", margin: "10px 0", gap: 1 }}>
//             <BusinessIcon color="success" sx={{ margin: "auto 0" }} />
//             <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//               Quản Lý Kinh Doanh
//             </Typography>
//           </Box>
//           <Stack spacing={2} marginBottom={3}>
//             {/* Quản Lý Vật Liệu */}
//             <Button
//               variant="outlined"
//               sx={{
//                 borderColor: "rgba(0,0,0,0.1)",
//                 textTransform: "none",
//               }}
//             >
//               <InventoryIcon color="success" />
//               <Box
//                 sx={{
//                   textAlign: "left",
//                   padding: "10px",
//                   display: "flex",
//                   flexDirection: "column",
//                   marginRight: "auto",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     width: "100%",
//                     marginRight: "auto",
//                     fontWeight: "bold",
//                     color: "black",
//                   }}
//                 >
//                   Quản Lý Vật Liệu
//                 </Typography>
//                 <Typography
//                   sx={{
//                     color: "black",
//                     opacity: "40%",
//                   }}
//                 >
//                   Thêm, sửa, xóa vật liệu
//                 </Typography>
//               </Box>
//             </Button>
//             {/* Báo Cáo Doanh Thu */}
//             <Button
//               variant="outlined"
//               sx={{
//                 borderColor: "rgba(0,0,0,0.1)",
//                 textTransform: "none",
//               }}
//             >
//               <AssessmentIcon color="success" />
//               <Box
//                 sx={{
//                   textAlign: "left",
//                   padding: "10px",
//                   display: "flex",
//                   flexDirection: "column",
//                   marginRight: "auto",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     width: "100%",
//                     marginRight: "auto",
//                     fontWeight: "bold",
//                     color: "black",
//                   }}
//                 >
//                   Báo Cáo Doanh Thu
//                 </Typography>
//                 <Typography
//                   sx={{
//                     color: "black",
//                     opacity: "40%",
//                   }}
//                 >
//                   Xem thống kê chi tiết
//                 </Typography>
//               </Box>
//             </Button>
//             {/* Quản Lý Đơn Hàng */}
//             <Button
//               variant="outlined"
//               sx={{
//                 borderColor: "rgba(0,0,0,0.1)",
//                 textTransform: "none",
//               }}
//             >
//               <LocalShippingOutlinedIcon color="success" />
//               <Box
//                 sx={{
//                   textAlign: "left",
//                   padding: "10px",
//                   display: "flex",
//                   flexDirection: "column",
//                   marginRight: "auto",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     width: "100%",
//                     marginRight: "auto",
//                     fontWeight: "bold",
//                     color: "black",
//                   }}
//                 >
//                   Quản Lý Đơn Hàng
//                 </Typography>
//                 <Typography
//                   sx={{
//                     color: "black",
//                     opacity: "40%",
//                   }}
//                 >
//                   Theo dõi đơn hàng khách
//                 </Typography>
//               </Box>
//             </Button>
//           </Stack>

//           <Button variant="contained" color="success">
//             Khám phá Hết
//           </Button>
//         </Card>

//         {/* Card Liên Lạc */}
//         <Card
//           sx={{
//             width: 300,
//             textAlign: "center",
//             p: 2,
//             flex: 1,
//             border: "1px solid rgba(0, 0, 0, 0.1)",
//           }}
//         >
//           <Box sx={{ display: "flex", margin: "10px 0", gap: 1 }}>
//             <ChatBubbleOutlineIcon color="success" sx={{ margin: "auto 0" }} />
//             <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//               Liên Lạc
//             </Typography>
//           </Box>
//           <Stack spacing={2} marginBottom={3}>
//             {messages.map((item, index) => (
//               <Button
//                 key={index}
//                 variant="outlined"
//                 sx={{
//                   borderColor: "rgba(0,0,0,0.1)",
//                   textTransform: "none",
//                 }}
//               >
//                 <Box sx={{ width: "100%", display: "flex" }}>
//                   <Box
//                     sx={{
//                       textAlign: "left",
//                       padding: "10px",
//                       display: "flex",
//                       flexDirection: "column",
//                       marginRight: "auto",
//                     }}
//                   >
//                     <Typography
//                       sx={{
//                         width: "100%",
//                         marginRight: "auto",
//                         fontWeight: "bold",
//                         color: "black",
//                       }}
//                     >
//                       {item.sender}
//                     </Typography>
//                     <Typography
//                       sx={{
//                         width: "100%",
//                         color: "black",
//                         opacity: "40%",
//                         whiteSpace: "nowrap",
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                       }}
//                     >
//                       {item.content}
//                     </Typography>
//                   </Box>
//                   <Typography color="black">{item.timeSend}</Typography>
//                 </Box>
//               </Button>
//             ))}
//           </Stack>

//           <Button variant="contained" color="success">
//             Xem toàn bộ tin nhắn
//           </Button>
//         </Card>

//         {/* Card Quản Lý Giao Hàng */}
//         <Card
//           sx={{
//             width: 300,
//             textAlign: "center",
//             p: 2,
//             flex: 1,
//             border: "1px solid rgba(0, 0, 0, 0.1)",
//           }}
//         >
//           <Box sx={{ display: "flex", margin: "10px 0", gap: 1 }}>
//             <LocalShippingOutlinedIcon
//               color="success"
//               sx={{ margin: "auto 0" }}
//             />
//             <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//               Quản Lý Đơn Hàng
//             </Typography>
//           </Box>
//           <Stack spacing={2} marginBottom={3}>
//             {orders.map((item, index) => (
//               <Button
//                 key={index}
//                 variant="outlined"
//                 sx={{
//                   borderColor: "rgba(0,0,0,0.1)",
//                   textTransform: "none",
//                 }}
//               >
//                 <Box sx={{ width: "100%", display: "flex" }}>
//                   <Box
//                     sx={{
//                       textAlign: "left",
//                       padding: "10px",
//                       display: "flex",
//                       flexDirection: "column",
//                       marginRight: "auto",
//                     }}
//                   >
//                     <Typography
//                       sx={{
//                         width: "100%",
//                         marginRight: "auto",
//                         fontWeight: "bold",
//                         color: "black",
//                         whiteSpace: "nowrap",
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                       }}
//                     >
//                       {item.product}
//                     </Typography>
//                     <Typography
//                       sx={{
//                         color: "black",
//                         opacity: "40%",
//                       }}
//                     >
//                       {item.orderId}
//                     </Typography>
//                   </Box>
//                   {/* Conditional Chip */}
//                   {item.status === 1 ? (
//                     <Chip
//                       label="Đang vận chuyển"
//                       sx={{
//                         backgroundColor: "rgba(219, 234, 254, 1)",
//                         color: "rgba(62, 92, 188, 1)",
//                       }}
//                     />
//                   ) : item.status === 2 ? (
//                     <Chip
//                       label="Chưa Xử Lý"
//                       sx={{
//                         backgroundColor: "rgba(220, 252, 231, 1)",
//                         color: "rgba(59, 129, 86, 1)",
//                       }}
//                     />
//                   ) : item.status === 3 ? (
//                     <Chip
//                       label="Đã hoàn thành"
//                       sx={{
//                         backgroundColor: "rgba(254, 249, 195, 1)",
//                         color: "rgba(139, 86, 23, 1)",
//                       }}
//                     />
//                   ) : (
//                     <Chip label="Không Xác Định" color="error" />
//                   )}
//                 </Box>
//               </Button>
//             ))}
//           </Stack>

//           <Button variant="contained" color="success">
//             Xem toàn bộ đơn hàng
//           </Button>
//         </Card>
//       </Box>
//     </Box>
//   );
// } 