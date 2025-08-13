import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Paper,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../../store/authStore";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PendingIcon from "@mui/icons-material/Pending";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PaletteIcon from "@mui/icons-material/Palette";
import BusinessIcon from "@mui/icons-material/Business";
import { ApplicationModelResponse } from "../../schemas/applyApplicationSchema";
import { applicationService } from "../../services/api/applicationService";

export default function MyApplications() {
  const { user, refreshUserFromServer } = useAuthStore();
  const [applications, setApplications] = useState<ApplicationModelResponse[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // Nếu user đã là designer hoặc supplier thì chỉ hiển thị thông báo
  if (
    user?.role?.toLowerCase() === "designer" ||
    user?.role?.toLowerCase() === "supplier"
  ) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">
          Bạn đã là {user.role?.toLowerCase() === "designer" ? "Designer" : "Supplier"}.<br />
          Không còn đơn đăng ký nào cần theo dõi.
        </Alert>
      </Container>
    );
  }

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await applicationService.getMyApplications();
        setApplications(data);

        // Check if any application was recently approved and refresh user info
        const recentlyApproved = data.find(
          (app) =>
            app.status === "approved" &&
            app.processedAt &&
            new Date(app.processedAt).getTime() >
              Date.now() - 24 * 60 * 60 * 1000 // Last 24 hours
        );

        if (recentlyApproved) {
          console.log(
            "🎉 Found recently approved application, refreshing user info"
          );
          try {
            await refreshUserFromServer();
          } catch (error) {
            console.warn("Failed to refresh user after approval:", error);
          }
        }
      } catch (error: any) {
        console.error("Error fetching applications:", error);
        toast.error(error.message || "Lỗi khi tải danh sách đơn đăng ký", {
          position: "bottom-center",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user, refreshUserFromServer]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <PendingIcon sx={{ color: "#ff9800" }} />;
      case "approved":
        return <CheckCircleIcon sx={{ color: "#4caf50" }} />;
      case "rejected":
        return <CancelIcon sx={{ color: "#f44336" }} />;
      default:
        return <PendingIcon sx={{ color: "#ff9800" }} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Đang chờ xét duyệt";
      case "approved":
        return "Đã phê duyệt";
      case "rejected":
        return "Đã từ chối";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const getRoleIcon = (targetRoleId: number) => {
    if (targetRoleId === 2) return <PaletteIcon sx={{ color: "#9c27b0" }} />;
    if (targetRoleId === 3) return <BusinessIcon sx={{ color: "#2196f3" }} />;
    // fallback icon
    return <BusinessIcon sx={{ color: "#757575" }} />;
  };

  const getRoleName = (targetRoleId: number) => {
    if (targetRoleId === 2) return "Designer";
    if (targetRoleId === 3) return "Supplier";
    return `Role ${targetRoleId}`;
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">Bạn cần đăng nhập để xem đơn đăng ký.</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Đang tải danh sách đơn đăng ký...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <AssignmentIcon sx={{ fontSize: 48, color: "#1976d2", mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Đơn Đăng Ký Của Tôi
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Theo dõi trạng thái các đơn đăng ký nâng cấp tài khoản
        </Typography>
      </Box>

      {/* Applications List */}
      {applications.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <AssignmentIcon sx={{ fontSize: 64, color: "#bdbdbd", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Chưa có đơn đăng ký nào
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Bạn chưa gửi đơn đăng ký nâng cấp tài khoản nào.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {applications.map((application) => (
            <Card
              key={application.applicationId}
              sx={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {getRoleIcon(application.targetRoleId)}
                    <Typography variant="h6" fontWeight="bold">
                      Đăng ký làm {getRoleName(application.targetRoleId)}
                    </Typography>
                  </Box>
                  <Chip
                    icon={getStatusIcon(application.status)}
                    label={getStatusText(application.status)}
                    color={getStatusColor(application.status) as any}
                    variant="outlined"
                  />
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Content */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                    {/* Ngày gửi, ngày xử lý, portfolioUrl giữ nguyên */}
                    <Box sx={{ minWidth: 200 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Ngày gửi:</strong>
                      </Typography>
                      <Typography variant="body1">
                        {new Date(application.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </Typography>
                    </Box>
                    {application.processedAt && (
                      <Box sx={{ minWidth: 200 }}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Ngày xử lý:</strong>
                        </Typography>
                        <Typography variant="body1">
                          {new Date(application.processedAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </Typography>
                      </Box>
                    )}
                    {application.portfolioUrl && (
                      <Box sx={{ minWidth: 200 }}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Portfolio:</strong>
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#1976d2",
                            textDecoration: "underline",
                            cursor: "pointer",
                            wordBreak: "break-all",
                          }}
                          onClick={() =>
                            window.open(application.portfolioUrl, "_blank")
                          }
                        >
                          {application.portfolioUrl}
                        </Typography>
                      </Box>
                    )}
                    {/* Bổ sung các trường còn thiếu */}
                    {application.avatarUrl && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Logo:</strong>
                        </Typography>
                        <img
                          src={application.avatarUrl}
                          alt="Logo"
                          width={60}
                          style={{ borderRadius: 8 }}
                        />
                      </Box>
                    )}
                    {application.bannerUrl && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Banner:</strong>
                        </Typography>
                        <img
                          src={application.bannerUrl}
                          alt="Banner"
                          width={120}
                          style={{ borderRadius: 8 }}
                        />
                      </Box>
                    )}
                    {application.portfolioFiles && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Ảnh Portfolio:</strong>
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          {(() => {
                            try {
                              const files = JSON.parse(
                                application.portfolioFiles
                              );
                              if (Array.isArray(files)) {
                                return files.map((url: string, idx: number) => (
                                  <img
                                    key={idx}
                                    src={url}
                                    alt={`Portfolio ${idx + 1}`}
                                    width={50}
                                    style={{ borderRadius: 4 }}
                                  />
                                ));
                              }
                            } catch {}
                            return null;
                          })()}
                        </Box>
                      </Box>
                    )}
                    {application.specializationUrl && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Chuyên môn:</strong>
                        </Typography>
                        <Typography variant="body1">
                          {application.specializationUrl}
                        </Typography>
                      </Box>
                    )}
                    {application.bio && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Giới thiệu:</strong>
                        </Typography>
                        <Typography variant="body1">
                          {application.bio}
                        </Typography>
                      </Box>
                    )}
                    {application.certificates && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Chứng chỉ:</strong>
                        </Typography>
                        <Typography variant="body1">
                          {application.certificates}
                        </Typography>
                      </Box>
                    )}
                    {application.taxNumber && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Mã số thuế:</strong>
                        </Typography>
                        <Typography variant="body1">
                          {application.taxNumber}
                        </Typography>
                      </Box>
                    )}
                    {application.address && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Địa chỉ:</strong>
                        </Typography>
                        <Typography variant="body1">
                          {application.address}
                        </Typography>
                      </Box>
                    )}
                    {application.phoneNumber && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Số điện thoại:</strong>
                        </Typography>
                        <Typography variant="body1">
                          {application.phoneNumber}
                        </Typography>
                      </Box>
                    )}
                    {application.socialLinks && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Mạng xã hội:</strong>
                        </Typography>
                        {(() => {
                          try {
                            const links = JSON.parse(application.socialLinks);
                            return Object.entries(links).map(
                              ([platform, url]) => (
                                <Typography key={platform} variant="body2">
                                  <strong>{platform}:</strong>{" "}
                                  <a
                                    href={String(url)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {String(url)}
                                  </a>
                                </Typography>
                              )
                            );
                          } catch {
                            return (
                              <Typography variant="body2">
                                {application.socialLinks}
                              </Typography>
                            );
                          }
                        })()}
                      </Box>
                    )}
                    {application.identificationNumber && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Số CCCD/CMND:</strong>
                        </Typography>
                        <Typography variant="body1">
                          {application.identificationNumber}
                        </Typography>
                      </Box>
                    )}
                    {application.identificationPictureFront && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Ảnh mặt trước CCCD/CMND:</strong>
                        </Typography>
                        <img
                          src={application.identificationPictureFront}
                          alt="ID Front"
                          width={60}
                          style={{ borderRadius: 4 }}
                        />
                      </Box>
                    )}
                    {application.identificationPictureBack && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Ảnh mặt sau CCCD/CMND:</strong>
                        </Typography>
                        <img
                          src={application.identificationPictureBack}
                          alt="ID Back"
                          width={60}
                          style={{ borderRadius: 4 }}
                        />
                      </Box>
                    )}
                    {application.note && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Ghi chú:</strong>
                        </Typography>
                        <Typography variant="body1">
                          {application.note}
                        </Typography>
                      </Box>
                    )}
                    {application.rejectionReason && (
                      <Box>
                        <Typography variant="body2" color="error">
                          <strong>Lý do từ chối:</strong>
                        </Typography>
                        <Typography variant="body1" color="error">
                          {application.rejectionReason}
                        </Typography>
                      </Box>
                    )}
                    {typeof application.isIdentificationVerified ===
                      "boolean" && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Xác minh định danh:</strong>
                        </Typography>
                        <Typography
                          variant="body1"
                          color={
                            application.isIdentificationVerified
                              ? "success.main"
                              : "warning.main"
                          }
                        >
                          {application.isIdentificationVerified
                            ? "Đã xác minh"
                            : "Chưa xác minh"}
                        </Typography>
                      </Box>
                    )}
                    {application.user && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Người nộp đơn:</strong>
                        </Typography>
                        <Typography variant="body1">
                          {application.user.fullName || ""}{" "}
                          {application.user.email
                            ? `(${application.user.email})`
                            : ""}
                        </Typography>
                      </Box>
                    )}
                    {application.role && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Vai trò đăng ký:</strong>
                        </Typography>
                        <Typography variant="body1">
                          {application.role.roleName}
                        </Typography>
                      </Box>
                    )}
                    {application.processedByUser && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Người xử lý:</strong>
                        </Typography>
                        <Typography variant="body1">
                          {application.processedByUser.fullName || ""}{" "}
                          {application.processedByUser.email
                            ? `(${application.processedByUser.email})`
                            : ""}
                        </Typography>
                      </Box>
                    )}
                    {application.processedBy &&
                      !application.processedByUser && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            <strong>ID người xử lý:</strong>
                          </Typography>
                          <Typography variant="body1">
                            {application.processedBy}
                          </Typography>
                        </Box>
                      )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}
