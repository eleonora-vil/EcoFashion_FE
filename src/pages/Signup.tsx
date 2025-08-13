import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Link,
  CircularProgress,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Phone,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/api";
import { toast } from "react-toastify";
//Image
import RegisterBanner from "../assets/pictures/register/register.jpg";
// Validation schema
const validationSchema = yup.object({
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  password: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Mật khẩu là bắt buộc"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Mật khẩu xác nhận không khớp")
    .required("Xác nhận mật khẩu là bắt buộc"),
  fullname: yup
    .string()
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .required("Họ tên là bắt buộc"),
  username: yup
    .string()
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
    .required("Tên đăng nhập là bắt buộc"),
  phone: yup
    .string()
    .matches(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ")
    .optional(),
});

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullname: "",
      username: "",
      phone: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError("");

      try {
        const response = await AuthService.signup(
          values.email,
          values.password,
          values.fullname,
          values.username,
          values.phone || undefined
        );

        toast.success(
          "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
        );

        // Chuyển đến trang verify OTP với email
        navigate("/verify-otp", {
          state: {
            email: values.email,
            message: response.message,
          },
        });
      } catch (err: any) {
        console.error("Signup error:", err);
        setError(err.message || "Đăng ký thất bại");
        toast.error(err.message || "Đăng ký thất bại");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${RegisterBanner})`,
        height: "100vh", // Full viewport
        display: "flex", // Center content
        alignItems: "center",
        justifyContent: "center",
        overflow: "auto", // Prevent clipping on small screens
        px: 2,
      }}
    >
      <Container sx={{ width: "40%", margin: "auto" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={6}
            sx={{
              padding: 3,
              width: "100%",
              borderRadius: 2,
            }}
          >
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography
                component="h1"
                variant="h4"
                sx={{ fontWeight: "bold", color: "#2e7d32" }}
              >
                Đăng Ký Tài Khoản
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Tham gia EcoFashion để khám phá thời trang bền vững
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={formik.handleSubmit} noValidate>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  id="fullname"
                  name="fullname"
                  label="Họ và tên"
                  value={formik.values.fullname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.fullname && Boolean(formik.errors.fullname)
                  }
                  helperText={formik.touched.fullname && formik.errors.fullname}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  label="Tên đăng nhập"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.username && Boolean(formik.errors.username)
                  }
                  helperText={formik.touched.username && formik.errors.username}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  id="phone"
                  name="phone"
                  label="Số điện thoại (tùy chọn)"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
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
                  id="password"
                  name="password"
                  label="Mật khẩu"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Xác nhận mật khẩu"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  bgcolor: "#2e7d32",
                  "&:hover": {
                    bgcolor: "#1b5e20",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Đăng Ký"
                )}
              </Button>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2">
                  Đã có tài khoản?{" "}
                  <Link
                    component="button"
                    variant="body2"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/login");
                    }}
                    sx={{
                      color: "#2e7d32",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Đăng nhập ngay
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Signup;
