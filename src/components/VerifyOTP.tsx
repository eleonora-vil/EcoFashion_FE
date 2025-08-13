import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthService } from "../services/api";
import { toast } from "react-toastify";

// Validation schema
const validationSchema = yup.object({
  otpCode: yup
    .string()
    .matches(/^\d{6}$/, "Mã OTP phải có 6 chữ số")
    .required("Mã OTP là bắt buộc"),
});

interface LocationState {
  email: string;
  message?: string;
}

const VerifyOTP: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Redirect if no email is provided
  useEffect(() => {
    if (!state?.email) {
      navigate("/signup");
      return;
    }
  }, [state, navigate]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const formik = useFormik({
    initialValues: {
      otpCode: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError("");

      try {
        await AuthService.verifyOTP(state.email, values.otpCode);

        toast.success("Xác thực tài khoản thành công!");

        // Redirect to login page
        navigate("/login", {
          state: {
            message:
              "Tài khoản đã được xác thực thành công. Vui lòng đăng nhập.",
            email: state.email,
          },
        });
      } catch (err: any) {
        console.error("OTP verification error:", err);
        setError(err.message || "Xác thực OTP thất bại");
        toast.error(err.message || "Xác thực OTP thất bại");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError("");

    try {
      await AuthService.resendOTP(state.email);
      toast.success("Mã OTP đã được gửi lại!");
      setCountdown(60);
      setCanResend(false);
    } catch (err: any) {
      console.error("Resend OTP error:", err);
      setError(err.message || "Không thể gửi lại mã OTP");
      toast.error(err.message || "Không thể gửi lại mã OTP");
    } finally {
      setResendLoading(false);
    }
  };

  if (!state?.email) {
    return null; // Will redirect in useEffect
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
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
              Xác Thực Tài Khoản
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              Chúng tôi đã gửi mã OTP đến email:
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", color: "#2e7d32" }}
            >
              {state.email}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Vui lòng nhập mã 6 chữ số để xác thực tài khoản
            </Typography>
          </Box>

          {state.message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {state.message}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <Stack spacing={3}>
              <TextField
                fullWidth
                id="otpCode"
                name="otpCode"
                label="Mã OTP"
                placeholder="Nhập 6 chữ số"
                value={formik.values.otpCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.otpCode && Boolean(formik.errors.otpCode)}
                helperText={formik.touched.otpCode && formik.errors.otpCode}
                inputProps={{
                  maxLength: 6,
                  style: {
                    textAlign: "center",
                    fontSize: "1.2rem",
                    letterSpacing: "0.5rem",
                  },
                }}
                sx={{
                  "& input": {
                    fontFamily: "monospace",
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
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
                  "Xác Thực"
                )}
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Không nhận được mã?
                </Typography>
                {canResend ? (
                  <Button
                    variant="text"
                    onClick={handleResendOTP}
                    disabled={resendLoading}
                    sx={{
                      color: "#2e7d32",
                      "&:hover": {
                        backgroundColor: "rgba(46, 125, 50, 0.04)",
                      },
                    }}
                  >
                    {resendLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      "Gửi lại mã OTP"
                    )}
                  </Button>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Gửi lại sau {countdown}s
                  </Typography>
                )}
              </Box>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2">
                  <Link
                    component="button"
                    variant="body2"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/signup");
                    }}
                    sx={{
                      color: "#2e7d32",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    ← Quay lại đăng ký
                  </Link>
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default VerifyOTP;
