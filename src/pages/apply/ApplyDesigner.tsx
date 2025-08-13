import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  FormControl,
  FormGroup,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  Container,
  Card,
  CardContent,
  Divider,
} from "@mui/material";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-toastify";
import FileUpload from "../../components/FileUpload";
import {
  Instagram,
  Facebook,
  Language,
  Phone,
  LocationOn,
  BusinessCenter,
} from "@mui/icons-material";
import PaletteIcon from "@mui/icons-material/Palette";
import { applicationService } from "../../services/api/applicationService";
import { applyApplicationSchema } from "../../schemas/applyApplicationSchema";

const steps = [
  "Thông tin cơ bản",
  "Thông tin nghề nghiệp",
  "Portfolio & Media",
  "Thông tin định danh",
  "Xác nhận & Hoàn tất",
];

export default function ApplyDesigner() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    socialLinks: "",
    agreedToTerms: false,
    avatarFile: null,
    bannerFile: null,
    portfolioFiles: [],
    identificationPictureFront: null,
    identificationPictureBack: null,
    phoneNumber: "0123456789",
    address: "123 Ecofashion Lane, Green City, Country Vietnam",
    bio: "",
    certificates: "https://ecofashion.com/certificates",
    specializationUrl: "https://ecofashion.com/specialization",
    taxNumber: "0123456789",
    portfolioUrl: "https://ecofashion.com/portfolio",
    note: "",
    identificationNumber: "",
  };
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: zodResolver(applyApplicationSchema),
    defaultValues,
  });

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeStep]);

  const watchAll = watch();

  const handleNext = async () => {
    // Validate only the current step fields
    const currentStepFields = getStepFields(activeStep);
    const valid = await trigger(currentStepFields as any);
    if (valid) setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Helper function to get fields for each step
  const getStepFields = (step: number): string[] => {
    switch (step) {
      case 0: // Basic Info
        return ["phoneNumber", "address"];
      case 1: // Professional Info
        return ["bio", "certificates", "specializationUrl", "taxNumber"];
      case 2: // Portfolio & Media
        return [
          "avatarFile",
          "bannerFile",
          "portfolioUrl",
          "portfolioFiles",
          "socialLinks",
        ];
      case 3: // Identity Verification
        return [
          "identificationNumber",
          "identificationPictureFront",
          "identificationPictureBack",
        ];
      case 4: // Agreement
        return ["note", "agreedToTerms"];
      default:
        return [];
    }
  };

  const onSubmit = async (data) => {
    // // Chuyển đổi data sang FormData để gửi file
    // const formData = new FormData();

    // // Các trường file đơn
    // if (data.avatarFile && data.avatarFile.length > 0) {
    //   formData.append("avatarFile", data.avatarFile[0]);
    // }
    // if (data.bannerFile && data.bannerFile.length > 0) {
    //   formData.append("bannerFile", data.bannerFile[0]);
    // }
    // if (
    //   data.identificationPictureFront &&
    //   data.identificationPictureFront.length > 0
    // ) {
    //   formData.append(
    //     "identificationPictureFront",
    //     data.identificationPictureFront[0]
    //   );
    // }
    // if (
    //   data.identificationPictureBack &&
    //   data.identificationPictureBack.length > 0
    // ) {
    //   formData.append(
    //     "identificationPictureBack",
    //     data.identificationPictureBack[0]
    //   );
    // }

    // // Portfolio files (nhiều file)
    // if (data.portfolioFiles && data.portfolioFiles.length > 0) {
    //   data.portfolioFiles.forEach((file, idx) => {
    //     formData.append("portfolioFiles", file);
    //   });
    // }

    // // Các trường text
    // const textFields = [
    //   "portfolioUrl",
    //   "specializationUrl",
    //   "bio",
    //   "socialLinks",
    //   "identificationNumber",
    //   "note",
    //   "phoneNumber",
    //   "address",
    //   "taxNumber",
    //   "certificates",
    // ];
    // textFields.forEach((field) => {
    //   if (data[field] !== undefined && data[field] !== null) {
    //     formData.append(field, data[field]);
    //   }
    // });

    // // Checkbox
    // if (data.agreedToTerms !== undefined) {
    //   formData.append("agreedToTerms", data.agreedToTerms ? "true" : "false");
    // }
    // Đảm bảo các trường file đơn là File, không phải mảng hoặc undefined
    const fixedData = {
      ...data,
      avatarFile:
        Array.isArray(data.avatarFile) && data.avatarFile.length > 0
          ? data.avatarFile[0]
          : !Array.isArray(data.avatarFile) && data.avatarFile
          ? data.avatarFile
          : undefined,
      bannerFile:
        Array.isArray(data.bannerFile) && data.bannerFile.length > 0
          ? data.bannerFile[0]
          : !Array.isArray(data.bannerFile) && data.bannerFile
          ? data.bannerFile
          : undefined,
      identificationPictureFront:
        Array.isArray(data.identificationPictureFront) &&
        data.identificationPictureFront.length > 0
          ? data.identificationPictureFront[0]
          : !Array.isArray(data.identificationPictureFront) &&
            data.identificationPictureFront
          ? data.identificationPictureFront
          : undefined,
      identificationPictureBack:
        Array.isArray(data.identificationPictureBack) &&
        data.identificationPictureBack.length > 0
          ? data.identificationPictureBack[0]
          : !Array.isArray(data.identificationPictureBack) &&
            data.identificationPictureBack
          ? data.identificationPictureBack
          : undefined,
      // portfolioFiles giữ nguyên là mảng
    };

    try {
      setLoading(true);
      toast.info("Đang xử lý đơn đăng ký...");
      const result = await applicationService.applyAsDesigner(fixedData);
      //const result = await applicationService.applyAsDesigner(formData);

      toast.success("Gửi đơn thành công!");
      navigate("/my-applications");
    } catch (err) {
      console.error("❌ Error submitting application:", err);
      toast.error("Có lỗi xảy ra khi gửi đơn.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: // Basic Info
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
              Thông tin cơ bản
            </Typography>

            {/* Display user info from claims */}
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Email:</strong> {user?.email}
              </Typography>
              <Typography variant="body2">
                <strong>Họ và tên:</strong> {user?.fullName}
              </Typography>
            </Alert>

            <TextField
              fullWidth
              label="Số điện thoại *"
              autoComplete="off"
              name="phoneNumber"
              defaultValue={defaultValues.phoneNumber}
              placeholder="Nhập số điện thoại"
              {...register("phoneNumber")}
              error={Boolean(errors.phoneNumber)}
              helperText={
                typeof errors.phoneNumber?.message === "string"
                  ? errors.phoneNumber?.message
                  : ""
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Địa chỉ *"
              autoComplete="off"
              name="address"
              defaultValue={defaultValues.address}
              placeholder="Nhập địa chỉ"
              {...register("address")}
              error={Boolean(errors.address)}
              helperText={
                typeof errors.address?.message === "string"
                  ? errors.address?.message
                  : ""
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        );

      case 1: // Professional Info
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
              Thông tin nghề nghiệp
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Mô tả về bản thân"
              autoComplete="off"
              name="bio"
              defaultValue={defaultValues.bio}
              placeholder="Nhập mô tả về bản thân"
              {...register("bio")}
              error={Boolean(errors.bio)}
              helperText={
                typeof errors.bio?.message === "string"
                  ? errors.bio?.message
                  : ""
              }
            />

            <TextField
              fullWidth
              label="Chứng chỉ/Giải thưởng"
              name="certificates"
              autoComplete="off"
              defaultValue={defaultValues.certificates}
              placeholder="Nhập links chứng chỉ hoặc giải thưởng"
              {...register("certificates")}
              error={Boolean(errors.certificates)}
              helperText={
                typeof errors.certificates?.message === "string"
                  ? errors.certificates?.message
                  : ""
              }
            />

            <TextField
              fullWidth
              label="URL chuyên môn"
              name="specializationUrl"
              autoComplete="off"
              defaultValue={defaultValues.specializationUrl}
              placeholder="https://ecofashion.com/specialization"
              {...register("specializationUrl")}
              error={Boolean(errors.specializationUrl)}
              helperText={
                typeof errors.specializationUrl?.message === "string"
                  ? errors.specializationUrl?.message
                  : ""
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Language color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Mã số thuế"
              autoComplete="off"
              name="taxNumber"
              defaultValue={defaultValues.taxNumber}
              placeholder="Nhập mã số thuế"
              {...register("taxNumber")}
              error={Boolean(errors.taxNumber)}
              helperText={
                typeof errors.taxNumber?.message === "string"
                  ? errors.taxNumber?.message
                  : ""
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessCenter color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        );

      case 2: // Portfolio & Media
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
              Portfolio & Hình ảnh
            </Typography>

            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Ảnh đại diện
              </Typography>
              <Controller
                name="avatarFile"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    label="Chọn ảnh đại diện"
                    files={
                      Array.isArray(field.value)
                        ? field.value
                        : field.value
                        ? [field.value]
                        : []
                    }
                    onFilesChange={(files) => field.onChange(files)}
                    accept="image/*"
                    maxSize={5}
                    error={errors.avatarFile?.message as string}
                  />
                )}
              />
            </Paper>

            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Ảnh banner
              </Typography>
              <Controller
                name="bannerFile"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    label="Chọn ảnh banner"
                    //Nếu field.value là một mảng (Array), thì truyền nguyên mảng đó cho prop files.
                    //Nếu field.value không phải mảng nhưng có giá trị (ví dụ là 1 file), thì bọc nó thành mảng 1 phần tử
                    //Nếu field.value là undefined/null, thì truyền mảng rỗng.
                    //Mục đích: Đảm bảo prop files luôn là một mảng (File[]), tránh lỗi runtime khi FileUpload chỉ nhận mảng.
                    //bảo vệ component custom FileUpload khỏi lỗi khi nhận kiểu dữ liệu không đúng (do react-hook-form có thể trả về undefined, 1 file, hoặc mảng file tùy cách dùng).
                    files={
                      Array.isArray(field.value)
                        ? field.value
                        : field.value
                        ? [field.value]
                        : []
                    }
                    onFilesChange={(files) => field.onChange(files)}
                    accept="image/*"
                    maxSize={10}
                  />
                )}
              />
            </Paper>

            <TextField
              fullWidth
              label="Portfolio URL"
              autoComplete="off"
              name="portfolioUrl"
              defaultValue={defaultValues.portfolioUrl}
              placeholder="https://..."
              {...register("portfolioUrl")}
              error={Boolean(errors.portfolioUrl)}
              helperText={
                typeof errors.portfolioUrl?.message === "string"
                  ? errors.portfolioUrl?.message
                  : ""
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Language color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Portfolio Files
              </Typography>
              <Controller
                name="portfolioFiles"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    label="Chọn ảnh portfolio"
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
            </Paper>

            <TextField
              fullWidth
              label="Liên kết mạng xã hội (JSON)"
              autoComplete="off"
              name="socialLinks"
              defaultValue={defaultValues.socialLinks}
              placeholder='{"facebook": "https://facebook.com/...", "instagram": "https://instagram.com/..."}'
              {...register("socialLinks")}
              error={Boolean(errors.socialLinks)}
              helperText={
                typeof errors.socialLinks?.message === "string"
                  ? errors.socialLinks?.message
                  : ""
              }
            />
          </Box>
        );

      case 3: // Identity Verification
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
              Thông tin định danh
            </Typography>

            <TextField
              fullWidth
              label="Số CCCD/CMND *"
              autoComplete="off"
              name="identificationNumber"
              defaultValue={defaultValues.identificationNumber}
              placeholder="Nhập số CCCD/CMND"
              {...register("identificationNumber")}
              error={Boolean(errors.identificationNumber)}
              helperText={
                typeof errors.identificationNumber?.message === "string"
                  ? errors.identificationNumber?.message
                  : ""
              }
            />

            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Ảnh CCCD mặt trước
              </Typography>
              <Controller
                name="identificationPictureFront"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    label="Chọn ảnh mặt trước"
                    files={
                      Array.isArray(field.value)
                        ? field.value
                        : field.value
                        ? [field.value]
                        : []
                    }
                    onFilesChange={(files) => field.onChange(files)}
                    accept="image/*"
                    maxSize={5}
                    error={errors.identificationPictureFront?.message as string}
                  />
                )}
              />
            </Paper>

            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Ảnh CCCD mặt sau
              </Typography>
              <Controller
                name="identificationPictureBack"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    label="Chọn ảnh mặt sau"
                    files={
                      Array.isArray(field.value)
                        ? field.value
                        : field.value
                        ? [field.value]
                        : []
                    }
                    onFilesChange={(files) => field.onChange(files)}
                    accept="image/*"
                    maxSize={5}
                    error={errors.identificationPictureBack?.message as string}
                  />
                )}
              />
            </Paper>
          </Box>
        );

      case 4: // Agreement & Completion
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Alert severity="success">
              Bạn đã hoàn thành các bước đăng ký! Vui lòng xem lại thông tin và
              xác nhận.
            </Alert>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Ghi chú"
              autoComplete="off"
              name={`note-step${activeStep}`}
              defaultValue={defaultValues.note}
              placeholder="Nhập ghi chú (nếu có)"
              {...register("note")}
              error={Boolean(errors.note)}
              helperText={
                typeof errors.note?.message === "string"
                  ? errors.note?.message
                  : ""
              }
            />

            <FormControl error={Boolean(errors.agreedToTerms)}>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox {...register("agreedToTerms")} />}
                  label="Tôi đồng ý với các điều khoản và điều kiện"
                />
                {errors.agreedToTerms && (
                  <Typography variant="caption" color="error">
                    {errors.agreedToTerms?.message}
                  </Typography>
                )}
              </FormGroup>
            </FormControl>
          </Box>
        );

      default:
        return "Unknown step";
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <PaletteIcon sx={{ fontSize: 48, color: "#4caf50" }} />
            <Typography variant="h4" fontWeight="bold">
              Đăng ký làm Nhà Thiết Kế
            </Typography>
            <Typography color="text.secondary">
              Tham gia cộng đồng những nhà thiết kế thời trang bền vững
            </Typography>
            <Divider sx={{ mt: 2 }} />
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(activeStep)}

          <Box sx={{ display: "flex", flexDirection: "row", pt: 4 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Quay lại
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                Gửi đơn đăng ký
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                Tiếp theo
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
