import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Card,
  CardMedia,
  Alert,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from "@mui/icons-material";

interface FileUploadProps {
  label: string;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  files: File[];
  onFilesChange: (files: File[]) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export default function FileUpload({
  label,
  multiple = false,
  accept = "image/*",
  maxSize = 5, // 5MB default
  files,
  onFilesChange,
  error,
  helperText,
  required = false,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles);
    const validFiles: File[] = [];
    const errors: string[] = [];

    newFiles.forEach((file) => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        errors.push(`${file.name} quá lớn (tối đa ${maxSize}MB)`);
        return;
      }

      // Check file type
      if (accept && !file.type.match(accept.replace("*", ".*"))) {
        errors.push(`${file.name} không đúng định dạng`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    if (multiple) {
      onFilesChange([...files, ...validFiles]);
    } else {
      onFilesChange(validFiles.slice(0, 1));
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const getFilePreview = (file: File) => {
    return URL.createObjectURL(file);
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </Typography>

      {/* Upload Area */}
      <Box
        sx={{
          border: `2px dashed ${error ? "red" : dragOver ? "#4caf50" : "#ddd"}`,
          borderRadius: 2,
          p: 3,
          textAlign: "center",
          cursor: "pointer",
          bgcolor: dragOver ? "rgba(76, 175, 80, 0.1)" : "transparent",
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: "#4caf50",
            bgcolor: "rgba(76, 175, 80, 0.05)",
          },
        }}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          style={{ display: "none" }}
          onChange={(e) => handleFileSelect(e.target.files)}
        />

        <CloudUploadIcon sx={{ fontSize: 48, color: "#4caf50", mb: 2 }} />
        <Typography variant="body1" sx={{ mb: 1 }}>
          {dragOver
            ? "Thả file vào đây"
            : "Kéo thả file vào đây hoặc click để chọn"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {accept.includes("image") && `Chỉ chấp nhận ảnh, tối đa ${maxSize}MB`}
          {multiple && ", có thể chọn nhiều file"}
        </Typography>
      </Box>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}

      {/* Helper Text */}
      {helperText && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1, display: "block" }}
        >
          {helperText}
        </Typography>
      )}

      {/* File Previews */}
      {files.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            File đã chọn ({files.length}):
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {files.map((file, index) => (
              <Card key={index} sx={{ position: "relative", width: 120 }}>
                {file.type.startsWith("image/") ? (
                  <CardMedia
                    component="img"
                    height="80"
                    image={getFilePreview(file)}
                    alt={file.name}
                    sx={{ objectFit: "cover" }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 80,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "#f5f5f5",
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 40, color: "#999" }} />
                  </Box>
                )}
                <IconButton
                  size="small"
                  onClick={() => removeFile(index)}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    bgcolor: "rgba(255, 255, 255, 0.8)",
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <Typography
                  variant="caption"
                  sx={{
                    p: 0.5,
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {file.name}
                </Typography>
              </Card>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
