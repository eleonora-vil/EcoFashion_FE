import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../../store/authStore";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Container,
  Paper,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  if (!user || user.role?.toLowerCase() !== "admin") {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h6" color="error">
          Bạn không có quyền truy cập trang này.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Quản Trị Hệ Thống
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Chào mừng bạn đến với bảng điều khiển quản trị EcoFashion
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap" }}>
        <Card
          sx={{ flex: 1, minWidth: 250, cursor: "pointer" }}
          onClick={() => navigate("/admin/applications")}
        >
          <CardContent sx={{ textAlign: "center", p: 3 }}>
            <AssignmentIcon sx={{ fontSize: 48, color: "#1976d2", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Quản Lý Đơn Đăng Ký
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Xét duyệt đơn đăng ký Designer và Supplier
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={(e) => {
                e.stopPropagation();
                navigate("/admin/applications");
              }}
            >
              Xem Đơn Đăng Ký
            </Button>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 250 }}>
          <CardContent sx={{ textAlign: "center", p: 3 }}>
            <PeopleIcon sx={{ fontSize: 48, color: "#4caf50", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Quản Lý Người Dùng
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quản lý tài khoản và phân quyền người dùng
            </Typography>
            <Button variant="outlined" sx={{ mt: 2 }} disabled>
              Đang Phát Triển
            </Button>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 250 }}>
          <CardContent sx={{ textAlign: "center", p: 3 }}>
            <BusinessIcon sx={{ fontSize: 48, color: "#ff9800", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Quản Lý Sản Phẩm
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Kiểm duyệt và quản lý sản phẩm trên hệ thống
            </Typography>
            <Button variant="outlined" sx={{ mt: 2 }} disabled>
              Đang Phát Triển
            </Button>
          </CardContent>
        </Card>
      </Box>

      {/* Recent Activity */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Hoạt Động Gần Đây
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tính năng này sẽ hiển thị các hoạt động gần đây trên hệ thống.
        </Typography>
      </Paper>
    </Container>
  );
}
