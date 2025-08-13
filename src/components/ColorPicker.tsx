import React, { useState } from "react";
import { Box, Grid, Typography, Paper } from "@mui/material";

const swatchColors = [
  "#ffffff",
  "#5f2cdd",
  "#752c53",
  "#3b8456",
  "#a0563d",
  "#5f5850",
  "#c3c3c6",
  "#edf1ff",
  "#da3855",
  "#eda541",
  "#f5ea5a",
  "#75b85b",
  "#66a5d7",
  "#817799",
  "#e17ea5",
  "#f4cdaf",
];

const ColorSwatchPicker = () => {
  const [selectedColor, setSelectedColor] = useState("#ffffff");

  const handleSwatchClick = (color) => {
    setSelectedColor(color);
  };

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      gap={4}
      p={4}
    >
      {/* Color Preview */}
      <Box flex={1}>
        <Typography variant="h5" gutterBottom>
          Selected Color
        </Typography>
        <Paper
          elevation={3}
          sx={{
            backgroundColor: selectedColor,
            width: "100%",
            height: 200,
            borderRadius: 2,
            border: "1px solid #ccc",
          }}
        />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Hex: <strong>{selectedColor}</strong>
        </Typography>
      </Box>

      {/* Swatch Grid */}
      <Box flex={1}>
        <Typography variant="h6" gutterBottom>
          Choose a Color:
        </Typography>
        <Grid container spacing={2}>
          {swatchColors.map((color) => (
            <Grid key={color}>
              <Box
                onClick={() => handleSwatchClick(color)}
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: color,
                  cursor: "pointer",
                  border:
                    selectedColor === color
                      ? "2px solid black"
                      : "2px solid transparent",
                  borderRadius: 1,
                  transition: "border 0.2s",
                }}
              />
            </Grid>
          ))}
        </Grid>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => handleSwatchClick(e.target.value)}
          style={{ marginTop: 16 }}
        />
      </Box>
    </Box>
  );
};

export default ColorSwatchPicker;
