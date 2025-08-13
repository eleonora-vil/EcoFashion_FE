import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Box,
  Breadcrumbs,
  Button,
  CardMedia,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  Drawer,
  FormControlLabel,
  FormGroup,
  Link,
  MenuItem,
  Pagination,
  Select,
  Typography,
} from "@mui/material";
import DesignsSection from "../../components/design/DesignsSection";
import React, { useEffect, useState } from "react";
//image
import fashion_banner from "../../assets/pictures/fashion/Fashion.png";
//example
import ao_linen from "../../assets/pictures/example/ao-linen.webp";
import chan_vay_dap from "../../assets/pictures/example/chan-vay-dap.webp";
import dam_con_trung from "../../assets/pictures/example/dam-con-trung.webp";
import brand_banner from "../../assets/pictures/example/brand-banner.jpg";
import linen from "../../assets/pictures/example/linen.webp";
import nylon from "../../assets/pictures/example/nylon.webp";
import denim from "../../assets/pictures/example/denim.jpg";
import cotton from "../../assets/pictures/example/cotton.webp";
import polyester from "../../assets/pictures/example/Polyester.jpg";
import { Fashion } from "../../types/Fashion";
import { GridExpandMoreIcon } from "@mui/x-data-grid";
import { Design, DesignService } from "../../services/api/designService";
import { toast } from "react-toastify";

export default function DesignsList() {
  //Design Data
  const [designs, setDesigns] = useState<Design[]>([]);
  //Loading
  const [loading, setLoading] = useState(true);
  //Error
  const [error, setError] = useState<string | null>(null);
  //Count type
  const [typeCounts, setTypeCounts] = useState<Record<string, number>>({});
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState<number>();
  const pageSize = 12;
  const [page, setPage] = useState(currentPage);

  useEffect(() => {
    loadDesigners();
    window.scrollTo(0, 0);
  }, [currentPage]);

  const loadDesigners = async () => {
    try {
      setLoading(true);
      setError(null);
      const total = await DesignService.getAllDesign();
      setTotalPage(Math.ceil(total.length / pageSize));
      const data = await DesignService.getAllDesignPagination(
        currentPage,
        pageSize
      );
      // Count design types
      const counts: Record<string, number> = {};
      total.forEach((design: any) => {
        const typeName = design.itemTypeName || "Khác"; // fallback if null/undefined
        counts[typeName] = (counts[typeName] || 0) + 1;
      });

      setTypeCounts(counts);
      setDesigns(data);
    } catch (error: any) {
      const errorMessage =
        error.message || "Không thể tải danh sách nhà thiết kế";
      setError(errorMessage);
      toast.error(errorMessage, { position: "bottom-center" });
    } finally {
      setLoading(false);
    }
  };

  //Pagination
  const handlePageScrollChange = (id: string, value: number) => {
    setPage(value);
    setCurrentPage(value);
    const element = document.getElementById(id);
    const navbarHeight =
      document.querySelector(".MuiAppBar-root")?.clientHeight || 0;

    if (element) {
      const y =
        element.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  //filter color
  const colorCounts: Record<string, number> = {};

  const dynamicColorFilterOptions = Object.entries(colorCounts).map(
    ([label, count]) => ({
      label,
      count,
    })
  );

  const colorToHex = (colorName: string): string => {
    const colors: Record<string, string> = {
      Đen: "#000000",
      Trắng: "#ffffff",
      "Xanh lá": "#2ecc40",
      Nâu: "#8B4513",
      "Xanh Navy": "#001f3f",
      "Xanh Rêu": "#556b2f",
      Xám: "#808080",
      Be: "#f5f5dc",
      Tím: "#800080",
      Hồng: "#ff69b4",
      "Hồng Nhạt": "#ffe4e1",
      Kem: "#fdf5e6",
      "Xanh Nhạt": "#add8e6",
      "Xanh Dương": "#0074D9",
      "Xanh Đậm": "#003366",
    };
    return colors[colorName] || "#ccc"; // fallback
  };

  // filter type
  const dynamicTypeFilterOptions = Object.entries(typeCounts).map(
    ([label, count]) => ({
      label,
      count,
    })
  );
  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  //filter by color
  const [showSorted, setShowSorted] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [activeColors, setActiveColors] = useState<string[]>([]);
  const [activeTypes, setActiveTypes] = useState<string[]>([]);
  const handleColorChange = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };
  const filteredProducts = designs.filter((product: any) => {
    const colorMatch =
      activeColors.length === 0 ||
      product.colors.some((color: string) => activeColors.includes(color));

    const typeMatch =
      activeTypes.length === 0 ||
      activeTypes.includes(product.itemTypeName || "Khác");

    return colorMatch && typeMatch;
  });
  const previewFilteredProducts = designs.filter((product: any) => {
    const colorMatch =
      selectedColors.length === 0 ||
      product.colors.some((color: string) => selectedColors.includes(color));

    const typeMatch =
      selectedTypes.length === 0 ||
      selectedTypes.includes(product.itemTypeName || "Khác");

    return colorMatch && typeMatch;
  });

  //Sort product
  const [sortType, setSortType] = useState<
    "all" | "recent" | "lowest" | "highest"
  >("all");
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!showSorted) return 0; // don't sort until button is clicked

    switch (sortType) {
      case "lowest":
        return a.salePrice - b.salePrice;
      case "highest":
        return b.salePrice - a.salePrice;
      case "recent":
        return b.designId - a.designId;
      default:
        return 0;
    }
  });
  //Scroll To Anchor
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    const navbarHeight =
      document.querySelector(".MuiAppBar-root")?.clientHeight || 0;

    if (element) {
      const y =
        element.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };
  //Xóa filter
  const handleClearAll = () => {
    setSelectedColors([]); // Reset color selections
    setShowSorted(false); // Hide filtered result
    setActiveColors([]); // Clear applied filter if you use one
    setSelectedTypes([]);
    setActiveTypes([]);
    handleScroll("items");
    toggleDrawer("left", false);
  };
  //Drawer
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  type Anchor = "top" | "left" | "bottom" | "right";
  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };
  return (
    <Box
      sx={{
        mx: "auto",
        width: "100%",
      }}
    >
      <img
        src={fashion_banner}
        alt="EcoFashion Banner"
        style={{ width: "100%", height: "100vh", objectFit: "cover" }}
      />
      <Box id="items">
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: "white",
            borderBottom: "1px solid black",
            display: "flex",
            flexDirection: "row",
            // top: { xs: 56, sm: 64 },
            // zIndex: (theme) => theme.zIndex.appBar,
            justifyContent: "space-between",
            paddingRight: 1,
            paddingLeft: 1,
          }}
        >
          {/* Navigation bar */}
          <Breadcrumbs
            separator="›"
            aria-label="breadcrumb"
            sx={{ padding: 1, display: "flex" }}
          >
            <Link underline="hover" color="inherit" href="/">
              Trang chủ
            </Link>
            <Typography color="text.primary">Thời Trang</Typography>
          </Breadcrumbs>
          {/* Sort & Filter */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: 48,
                bgcolor: "transparent",
                borderRadius: "999px",
                marginLeft: "auto",
                float: "left",
              }}
            >
              {/* Filter */}
              <React.Fragment key={"left"}>
                <Button
                  variant="text"
                  onClick={toggleDrawer("left", true)}
                  sx={{ color: "black", marginRight: 2, fontWeight: "bold" }}
                >
                  Phân Loại
                </Button>
                <Drawer
                  anchor={"left"}
                  open={state["left"]}
                  onClose={toggleDrawer("left", false)}
                >
                  <Box flex={1} sx={{ textAlign: "left" }}>
                    <Box sx={{ width: 300, padding: 3 }}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        marginBottom={"30px"}
                      >
                        <Typography variant="h6" fontWeight="bold">
                          Phân Loại
                        </Typography>
                        <Link
                          onClick={() => {
                            handleClearAll();
                          }}
                          underline="hover"
                          sx={{ cursor: "pointer", fontSize: 14 }}
                        >
                          Xóa lựa chọn
                        </Link>
                      </Box>

                      {/* Filter Sections */}
                      {/* Filter By Color */}
                      <Accordion
                        disableGutters
                        elevation={0}
                        sx={{ boxShadow: "none" }}
                      >
                        <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
                          <Typography fontSize={16}>Màu Sắc</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box
                            sx={{
                              maxHeight: 200,
                              overflowY: "auto",
                              pr: 1,
                            }}
                          >
                            <FormGroup>
                              {dynamicColorFilterOptions.map((item, index) => (
                                <FormControlLabel
                                  key={index}
                                  control={
                                    <Checkbox
                                      checked={selectedColors.includes(
                                        item.label
                                      )}
                                      onChange={() =>
                                        handleColorChange(item.label)
                                      }
                                    />
                                  }
                                  label={
                                    <Box display="flex" alignItems="center">
                                      <Box
                                        sx={{
                                          width: 14,
                                          height: 14,
                                          borderRadius: "50%",
                                          backgroundColor: colorToHex(
                                            item.label
                                          ),
                                          border: "1px solid #ccc",
                                          mr: 1,
                                        }}
                                      />
                                      {`${item.label} (${item.count})`}
                                    </Box>
                                  }
                                  sx={{ mb: 0.5, alignItems: "center" }}
                                />
                              ))}
                            </FormGroup>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                      <Divider />
                      {/* Filter By Type */}
                      <Accordion
                        disableGutters
                        elevation={0}
                        sx={{ boxShadow: "none" }}
                      >
                        <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
                          <Typography fontSize={16}>Loại Sản Phẩm</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box
                            sx={{ maxHeight: 200, overflowY: "auto", pr: 1 }}
                          >
                            <FormGroup>
                              {dynamicTypeFilterOptions.map((item, index) => (
                                <FormControlLabel
                                  key={index}
                                  control={
                                    <Checkbox
                                      checked={selectedTypes.includes(
                                        item.label
                                      )}
                                      onChange={() =>
                                        handleTypeChange(item.label)
                                      }
                                    />
                                  }
                                  label={`${item.label} (${item.count})`}
                                  sx={{ mb: 0.5 }}
                                />
                              ))}
                            </FormGroup>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                      {/* {Object.entries(filterOptions).map(([title, options]) => (
                        <React.Fragment key={title}>
                          <Accordion
                            disableGutters
                            elevation={0}
                            sx={{ boxShadow: "none" }}
                          >
                            <AccordionSummary
                              expandIcon={<GridExpandMoreIcon />}
                            >
                              <Typography fontSize={16}>{title}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <FormGroup>
                                {options.map((item, index) => (
                                  <FormControlLabel
                                    key={index}
                                    control={<Checkbox />}
                                    label={`${item.label} (${item.count})`}
                                    sx={{ mb: 0.5, alignItems: "center" }}
                                  />
                                ))}
                              </FormGroup>
                            </AccordionDetails>
                          </Accordion>
                          <Divider />
                        </React.Fragment>
                      ))} */}
                      {/* Bottom Button */}
                      <Box mt={6}>
                        <Button
                          variant="outlined"
                          color="inherit"
                          fullWidth
                          sx={{
                            color: "black",
                            fontWeight: "bold",
                            "&:hover": {
                              bgcolor: "#333",
                              color: "white",
                            },
                          }}
                          onClick={() => {
                            setActiveColors(selectedColors); // apply filter
                            setActiveTypes(selectedTypes);
                            setShowSorted(true);
                            handleScroll("items");
                          }}
                        >
                          {selectedTypes.length > 0
                            ? `Xem ${previewFilteredProducts.length} sản phẩm`
                            : "Xem Tất Cả Sản Phẩm"}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Drawer>
              </React.Fragment>
              <Divider orientation="vertical" sx={{ height: "90%" }} />
              {/* Sort */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "black",
                    marginLeft: 2,
                    textAlign: "center",
                  }}
                >
                  Sắp xếp theo:
                </Typography>
                <Select
                  value={sortType}
                  sx={{
                    border: "none",
                    fontSize: 14,
                    minWidth: 100,
                    "& fieldset": { border: "none" },
                    fontWeight: "bold",
                  }}
                  MenuProps={{
                    disableScrollLock: true,
                  }}
                  onChange={(e) => {
                    setSortType(e.target.value);
                    setShowSorted(true);
                  }}
                >
                  <MenuItem value="all" sx={{ width: "100%" }}>
                    Tất cả
                  </MenuItem>
                  <MenuItem value="recent">Mới Đây</MenuItem>
                  <MenuItem value="lowest">Giá Thấp Tới Cao</MenuItem>
                  <MenuItem value="highest">Giá Cao Tới Thấp</MenuItem>
                </Select>
              </Box>
            </Box>
          </Box>
        </AppBar>
        <Box
          sx={{
            width: "100%",
            margin: "10px auto",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/*Danh sách Sản Phẩm */}
          <Box sx={{ minHeight: "100vh", p: 3, py: 0 }}>
            {/* Sản Phẩm */}
            <Box
              flex={5}
              sx={{ width: "100%", margin: "auto", padding: 3, paddingTop: 0 }}
            >
              <DesignsSection
                products={sortedProducts}
                id={"items"}
                pageSize={pageSize}
                currentPage={currentPage}
                totalPages={totalPage}
              />
            </Box>
          </Box>
          <Divider />
        </Box>
        <Box
          mt={4}
          sx={{
            width: "100%",
            display: "flex", // ✅ Added
            justifyContent: "center", // ✅ Added
            alignItems: "center", // Optional
            margin: "20px 0",
          }}
        >
          <Pagination
            count={totalPage}
            page={page}
            variant="outlined"
            shape="rounded"
            onChange={(e, value) => {
              handlePageScrollChange("items", value);
            }}
            color="primary"
            size="large"
          />
        </Box>
      </Box>
    </Box>
  );
}
