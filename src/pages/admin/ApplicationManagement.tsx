import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../../store/authStore";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PaletteIcon from "@mui/icons-material/Palette";
import BusinessIcon from "@mui/icons-material/Business";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { ApplicationModelResponse } from "../../schemas/applyApplicationSchema";
import { applicationService } from "../../services/api/applicationService";

interface FilterOptions {
  status: string;
  targetRoleId: string;
  createdFrom: string;
  createdTo: string;
  keyword: string;
}

export default function ApplicationManagement() {
  const { user } = useAuthStore();
  const [applications, setApplications] = useState<ApplicationModelResponse[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationModelResponse | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    status: "",
    targetRoleId: "",
    createdFrom: "",
    createdTo: "",
    keyword: "",
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      let data: ApplicationModelResponse[];

      if (
        filters.status ||
        filters.targetRoleId ||
        filters.createdFrom ||
        filters.createdTo
      ) {
        data = await applicationService.filterApplications({
          status: filters.status || undefined,
          targetRoleId: filters.targetRoleId
            ? parseInt(filters.targetRoleId)
            : undefined,
          createdFrom: filters.createdFrom || undefined,
          createdTo: filters.createdTo || undefined,
        });
      } else if (filters.keyword) {
        data = await applicationService.searchApplications(filters.keyword);
      } else {
        data = await applicationService.getAllApplications();
      }
      
      setApplications(data);
    } catch (error: any) {
      console.error("Error fetching applications:", error);

      // Check if it's an authorization error
      if (
        error.message.includes("401") ||
        error.message.includes("unauthorized")
      ) {
        toast.error(
          "Bạn không có quyền truy cập chức năng này. Vui lòng đăng nhập với tài khoản admin.",
          {
            position: "bottom-center",
          }
        );
      } else {
        toast.error(error.message || "Lỗi khi tải danh sách đơn đăng ký", {
          position: "bottom-center",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId: number, targetRoleId: number) => {
    try {
      setActionLoading(applicationId);

      if (targetRoleId === 2) {
        await applicationService.approveDesignerApplication(applicationId);
        toast.success("Đã phê duyệt đơn đăng ký Designer!", {
          position: "top-center",
        });
      } else if (targetRoleId === 3) {
        await applicationService.approveSupplierApplication(applicationId);
        toast.success("Đã phê duyệt đơn đăng ký Supplier!", {
          position: "top-center",
        });
      }

      await fetchApplications();
    } catch (error: any) {
      console.error("Error approving application:", error);
      toast.error(error.message || "Lỗi khi phê duyệt đơn đăng ký", {
        position: "bottom-center",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!selectedApplication || !rejectionReason.trim()) return;

    try {
      setActionLoading(selectedApplication.applicationId);

      await applicationService.rejectApplication(
        selectedApplication.applicationId,
        rejectionReason
      );

      toast.success("Đã từ chối đơn đăng ký!", {
        position: "top-center",
      });

      setRejectDialogOpen(false);
      setRejectionReason("");
      setSelectedApplication(null);
      await fetchApplications();
    } catch (error: any) {
      console.error("Error rejecting application:", error);
      toast.error(error.message || "Lỗi khi từ chối đơn đăng ký", {
        position: "bottom-center",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectDialog = (application: ApplicationModelResponse) => {
    setSelectedApplication(application);
    setRejectDialogOpen(true);
  };

  const getStatusChip = (status: string) => {
    const config = {
      pending: { label: "Chờ xét duyệt", color: "warning" as const },
      approved: { label: "Đã phê duyệt", color: "success" as const },
      rejected: { label: "Đã từ chối", color: "error" as const },
    };

    const { label, color } = config[status as keyof typeof config] || {
      label: "Không xác định",
      color: "default" as const,
    };

    return <Chip label={label} color={color} size="small" />;
  };

  const getRoleChip = (targetRoleId: number) => {
    if (targetRoleId === 2) {
      return (
        <Chip
          icon={<PaletteIcon />}
          label="Designer"
          color="secondary"
          variant="outlined"
          size="small"
        />
      );
    } else if (targetRoleId === 3) {
      return (
        <Chip
          icon={<BusinessIcon />}
          label="Supplier"
          color="primary"
          variant="outlined"
          size="small"
        />
      );
    }
    return <Chip label="Unknown" size="small" />;
  };

  const getStats = () => {
    const total = applications.length;
    const pending = applications.filter(
      (app) => app.status === "pending"
    ).length;
    const approved = applications.filter(
      (app) => app.status === "approved"
    ).length;
    const rejected = applications.filter(
      (app) => app.status === "rejected"
    ).length;

    return { total, pending, approved, rejected };
  };

  const stats = getStats();

  if (!user || user.role?.toLowerCase() !== "admin") {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          Bạn không có quyền truy cập trang này. Chỉ admin mới có thể quản lý
          đơn đăng ký. Role hiện tại: {user?.role || "Không có"}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          <AssignmentIcon sx={{ mr: 2, verticalAlign: "middle" }} />
          Quản Lý Đơn Đăng Ký
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Xét duyệt đơn đăng ký nâng cấp tài khoản thành Designer hoặc Supplier
        </Typography>
      </Box>

      {/* Statistics */}
      <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap" }}>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h4" color="primary">
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tổng đơn đăng ký
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h4" color="warning.main">
              {stats.pending}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Chờ xét duyệt
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h4" color="success.main">
              {stats.approved}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đã phê duyệt
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent sx={{ textAlign: "center" }}>
            <Typography variant="h4" color="error.main">
              {stats.rejected}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đã từ chối
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Controls */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <TextField
            label="Tìm kiếm"
            variant="outlined"
            size="small"
            value={filters.keyword}
            onChange={(e) =>
              setFilters({ ...filters, keyword: e.target.value })
            }
            placeholder="Tìm theo tên, email, CMND..."
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
            sx={{ minWidth: 200 }}
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={filters.status}
              label="Trạng thái"
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="pending">Chờ xét duyệt</MenuItem>
              <MenuItem value="approved">Đã phê duyệt</MenuItem>
              <MenuItem value="rejected">Đã từ chối</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Loại</InputLabel>
            <Select
              value={filters.targetRoleId}
              label="Loại"
              onChange={(e) =>
                setFilters({ ...filters, targetRoleId: e.target.value })
              }
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="2">Designer</MenuItem>
              <MenuItem value="3">Supplier</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={fetchApplications}
            startIcon={
              loading ? <CircularProgress size={16} /> : <SearchIcon />
            }
            disabled={loading}
          >
            Tìm kiếm
          </Button>

          <Button
            variant="outlined"
            onClick={() => {
              setFilters({
                status: "",
                targetRoleId: "",
                createdFrom: "",
                createdTo: "",
                keyword: "",
              });
              fetchApplications();
            }}
            startIcon={<RefreshIcon />}
          >
            Đặt lại
          </Button>
        </Stack>
      </Paper>

      {/* Applications Table */}
      {loading ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <CircularProgress size={40} />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Đang tải danh sách đơn đăng ký...
          </Typography>
        </Box>
      ) : applications.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <AssignmentIcon sx={{ fontSize: 64, color: "#bdbdbd", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Không có đơn đăng ký nào
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hiện tại không có đơn đăng ký nào phù hợp với bộ lọc.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Người đăng ký</strong>
                </TableCell>
                <TableCell>
                  <strong>Loại</strong>
                </TableCell>
                <TableCell>
                  <strong>Ngày gửi</strong>
                </TableCell>
                <TableCell>
                  <strong>Trạng thái</strong>
                </TableCell>
                <TableCell>
                  <strong>Hành động</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.applicationId} hover>
                  <TableCell>{application.applicationId}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {application.user?.fullName ||
                          `User ID: ${application.userId}`}
                      </Typography>
                      {application.user?.email && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          {application.user.email}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{getRoleChip(application.targetRoleId)}</TableCell>
                  <TableCell>
                    {new Date(application.createdAt).toLocaleDateString(
                      "vi-VN"
                    )}
                  </TableCell>
                  <TableCell>{getStatusChip(application.status)}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedApplication(application);
                            setDetailDialogOpen(true);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>

                      {application.status === "pending" && (
                        <>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() =>
                              handleApprove(
                                application.applicationId,
                                application.targetRoleId
                              )
                            }
                            disabled={
                              actionLoading === application.applicationId
                            }
                            startIcon={
                              actionLoading === application.applicationId ? (
                                <CircularProgress size={16} />
                              ) : (
                                <CheckCircleIcon />
                              )
                            }
                          >
                            Duyệt
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            onClick={() => openRejectDialog(application)}
                            disabled={
                              actionLoading === application.applicationId
                            }
                            startIcon={<CancelIcon />}
                          >
                            Từ chối
                          </Button>
                        </>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Simplified Detail Dialog - Complex fields commented out for now */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Chi tiết đơn đăng ký #{selectedApplication?.applicationId}
        </DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Box sx={{ pt: 1 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                  <Box sx={{ minWidth: 200 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Họ tên:</strong>
                    </Typography>
                    <Typography variant="body1">
                      {selectedApplication.user?.fullName ||
                        `User ID: ${selectedApplication.userId}`}
                    </Typography>
                  </Box>
                  <Box sx={{ minWidth: 200 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Email:</strong>
                    </Typography>
                    <Typography variant="body1">
                      {selectedApplication.user?.email || "-"}
                    </Typography>
                  </Box>
                  <Box sx={{ minWidth: 200 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Loại đăng ký:</strong>
                    </Typography>
                    <Typography variant="body1">
                      {selectedApplication.targetRoleId === 2
                        ? "Designer"
                        : "Supplier"}
                    </Typography>
                  </Box>
                  <Box sx={{ minWidth: 200 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Trạng thái:</strong>
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      {getStatusChip(selectedApplication.status)}
                    </Box>
                  </Box>
                  <Box sx={{ minWidth: 200 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Ngày gửi:</strong>
                    </Typography>
                    <Typography variant="body1">
                      {new Date(selectedApplication.createdAt).toLocaleString(
                        "vi-VN"
                      )}
                    </Typography>
                  </Box>
                  {selectedApplication.processedAt && (
                    <Box sx={{ minWidth: 200 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Ngày xử lý:</strong>
                      </Typography>
                      <Typography variant="body1">
                        {new Date(
                          selectedApplication.processedAt
                        ).toLocaleString("vi-VN")}
                      </Typography>
                    </Box>
                  )}
                  {selectedApplication.identificationNumber && (
                    <Box sx={{ minWidth: 200 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Số CMND/CCCD:</strong>
                      </Typography>
                      <Typography variant="body1">
                        {selectedApplication.identificationNumber}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Avatar & Banner */}
                {selectedApplication.avatarUrl && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Avatar:</strong>
                    </Typography>
                    <img
                      src={selectedApplication.avatarUrl}
                      alt="Avatar"
                      width={60}
                      style={{ borderRadius: 8 }}
                    />
                  </Box>
                )}
                {selectedApplication.bannerUrl && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Banner:</strong>
                    </Typography>
                    <img
                      src={selectedApplication.bannerUrl}
                      alt="Banner"
                      width={120}
                      style={{ borderRadius: 8 }}
                    />
                  </Box>
                )}
                {/* Portfolio URL & Files */}
                {selectedApplication.portfolioUrl && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Portfolio URL:</strong>
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
                        window.open(selectedApplication.portfolioUrl, "_blank")
                      }
                    >
                      {selectedApplication.portfolioUrl}
                    </Typography>
                  </Box>
                )}
                {selectedApplication.portfolioFiles && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Ảnh Portfolio:</strong>
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {(() => {
                        try {
                          const files = JSON.parse(
                            selectedApplication.portfolioFiles
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
                {/* Social Links */}
                {selectedApplication.socialLinks && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Mạng xã hội:</strong>
                    </Typography>
                    {(() => {
                      try {
                        const links = JSON.parse(
                          selectedApplication.socialLinks
                        );
                        return Object.entries(links).map(([platform, url]) => (
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
                        ));
                      } catch {
                        return (
                          <Typography variant="body2">
                            {selectedApplication.socialLinks}
                          </Typography>
                        );
                      }
                    })()}
                  </Box>
                )}
                {/* Thông tin liên hệ, thuế, chứng chỉ, bio */}
                {selectedApplication.phoneNumber && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Số điện thoại:</strong>
                    </Typography>
                    <Typography variant="body1">
                      {selectedApplication.phoneNumber}
                    </Typography>
                  </Box>
                )}
                {selectedApplication.address && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Địa chỉ:</strong>
                    </Typography>
                    <Typography variant="body1">
                      {selectedApplication.address}
                    </Typography>
                  </Box>
                )}
                {selectedApplication.taxNumber && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Mã số thuế:</strong>
                    </Typography>
                    <Typography variant="body1">
                      {selectedApplication.taxNumber}
                    </Typography>
                  </Box>
                )}
                {selectedApplication.certificates && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Chứng chỉ:</strong>
                    </Typography>
                    <Typography variant="body1">
                      {selectedApplication.certificates}
                    </Typography>
                  </Box>
                )}
                {selectedApplication.bio && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Giới thiệu:</strong>
                    </Typography>
                    <Typography variant="body1">
                      {selectedApplication.bio}
                    </Typography>
                  </Box>
                )}
                {/* Xác minh định danh */}
                {typeof selectedApplication.isIdentificationVerified ===
                  "boolean" && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Xác minh định danh:</strong>
                    </Typography>
                    <Typography
                      variant="body1"
                      color={
                        selectedApplication.isIdentificationVerified
                          ? "success.main"
                          : "warning.main"
                      }
                    >
                      {selectedApplication.isIdentificationVerified
                        ? "Đã xác minh"
                        : "Chưa xác minh"}
                    </Typography>
                  </Box>
                )}
                {/* Ảnh định danh */}
                {selectedApplication.identificationPictureFront && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Ảnh mặt trước CCCD/CMND:</strong>
                    </Typography>
                    <img
                      src={selectedApplication.identificationPictureFront}
                      alt="ID Front"
                      width={60}
                      style={{ borderRadius: 4 }}
                    />
                  </Box>
                )}
                {selectedApplication.identificationPictureBack && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Ảnh mặt sau CCCD/CMND:</strong>
                    </Typography>
                    <img
                      src={selectedApplication.identificationPictureBack}
                      alt="ID Back"
                      width={60}
                      style={{ borderRadius: 4 }}
                    />
                  </Box>
                )}
                {/* Ghi chú, lý do từ chối */}
                {selectedApplication.note && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Ghi chú:</strong>
                    </Typography>
                    <Typography variant="body1">
                      {selectedApplication.note}
                    </Typography>
                  </Box>
                )}
                {selectedApplication.status === "rejected" &&
                  selectedApplication.rejectionReason && (
                    <Box>
                      <Alert severity="error">
                        <Typography variant="body2">
                          <strong>Lý do từ chối:</strong>
                        </Typography>
                        <Typography variant="body1">
                          {selectedApplication.rejectionReason}
                        </Typography>
                      </Alert>
                    </Box>
                  )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Từ chối đơn đăng ký</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Vui lòng nhập lý do từ chối đơn đăng ký này:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Lý do từ chối"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Ví dụ: Thông tin không đầy đủ, portfolio không phù hợp..."
            helperText="Lý do này sẽ được gửi cho người đăng ký"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={handleReject}
            color="error"
            variant="contained"
            disabled={!rejectionReason.trim() || actionLoading !== null}
            startIcon={
              actionLoading !== null ? (
                <CircularProgress size={16} />
              ) : (
                <CancelIcon />
              )
            }
          >
            Từ chối
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
