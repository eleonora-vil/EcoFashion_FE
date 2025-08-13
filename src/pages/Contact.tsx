import {
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import SendIcon from "@mui/icons-material/Send";

const faqs = [
  {
    question: "Làm cách nào để tôi theo dõi đơn hàng của mình?",
    answer:
      "Khi đơn hàng được gửi đi, bạn sẽ nhận được email xác nhận kèm thông tin theo dõi. Bạn cũng có thể đăng nhập vào tài khoản và xem trạng thái đơn hàng trong lịch sử đơn hàng của mình.",
  },
  {
    question: "Chính sách đổi trả của bạn là gì?",
    answer:
      "Chúng tôi chấp nhận đổi trả trong vòng 30 ngày kể từ khi giao hàng. Sản phẩm phải chưa qua sử dụng, chưa giặt và còn nguyên trạng thái ban đầu với nhãn mác đính kèm. Khách hàng sẽ chịu chi phí vận chuyển khi trả hàng.",
  },
  {
    question: "Làm thế nào để bạn xác minh các tuyên bố về tính bền vững?",
    answer:
      "Chúng tôi hợp tác với các tổ chức chứng nhận bên thứ ba để xác minh tất cả các tuyên bố về tính bền vững từ các nhà thiết kế và nhà cung cấp. Mỗi sản phẩm đều có thông tin chi tiết về chất liệu và tác động đến môi trường.",
  },
  {
    question:
      "Tôi có thể trở thành nhà thiết kế hoặc nhà cung cấp trên EcoFashion như thế nào?",
    answer:
      "Chúng tôi luôn chào đón các nhà thiết kế và nhà cung cấp vật liệu bền vững tham gia nền tảng của mình. Vui lòng truy cập trang “Thông Tin Kinh Doanh”  để tìm hiểu thêm về quy trình đăng ký.",
  },
];

export default function Contact() {
  return (
    <Box width={"100%"} sx={{ height: "100vh" }}>
      <Box
        sx={{
          backgroundColor: "#15a34a",
          color: "white",
          textAlign: "center",
          padding: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Liên Lạc Với Chúng Tôi
        </Typography>
        <Typography variant="h6" maxWidth="md" mx="auto">
          Bạn có thắc mắc về thời trang bền vững hoặc cần hỗ trợ đơn hàng? Chúng
          tôi luôn sẵn sàng hỗ trợ bạn!
        </Typography>
      </Box>
      <Box sx={{ p: 4 }}>
        <Box sx={{ display: "flex" }}>
          {/* Left Section */}
          <Grid width={"50%"}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Liên Lạc
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              Điền Đầy Đủ Thông Tin Và Chúng Tôi Sẽ Liên Lạc Với Bạn Trong Vòng
              24h. Chúng TÔi!
            </Typography>

            <Box sx={{ mt: 4 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <EmailIcon
                  sx={{
                    bgcolor: "#d1fae5",
                    color: "green",
                    p: 1,
                    borderRadius: "50%",
                    mr: 2,
                  }}
                />
                <Box>
                  <Typography fontWeight="bold">Email</Typography>
                  <Typography>info@ecofashion.com</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Liên Lạc Trong Vòng 24h
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" mb={3}>
                <PhoneIcon
                  sx={{
                    bgcolor: "#d1fae5",
                    color: "green",
                    p: 1,
                    borderRadius: "50%",
                    mr: 2,
                  }}
                />
                <Box>
                  <Typography fontWeight="bold">Số Điện Thoại</Typography>
                  <Typography>+1 (123) 456-7890</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Thứ Hai - Thứ Sáu, 9am–5pm
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" mb={3}>
                <LocationOnIcon
                  sx={{
                    bgcolor: "#d1fae5",
                    color: "green",
                    p: 1,
                    borderRadius: "50%",
                    mr: 2,
                  }}
                />
                <Box>
                  <Typography fontWeight="bold">Địa Chỉ</Typography>
                  <Typography>123 Green Street</Typography>
                  <Typography>Eco City, EC 12345</Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={2} mt={4}>
                <FacebookIcon />
                <InstagramIcon />
                <TwitterIcon />
                <LinkedInIcon />
              </Box>
            </Box>
          </Grid>

          {/* Right Section */}
          <Grid width={"50%"}>
            <Box sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Gửi cho chúng tôi một tin nhắn
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                Chúng tôi rất mong nhận được phản hồi từ bạn. Vui lòng điền vào
                biểu mẫu dưới đây và chúng tôi sẽ liên hệ lại với bạn sớm nhất
                có thể.
              </Typography>

              <Box component="form" mt={3}>
                <TextField
                  fullWidth
                  label="Họ Và Tên"
                  variant="outlined"
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  margin="normal"
                />

                <TextField fullWidth select label="Chọn chủ đề">
                  <MenuItem value="general">Yêu cầu chung</MenuItem>
                  <MenuItem value="support">Hỗ trợ</MenuItem>
                  <MenuItem value="product_question">
                    Liên Quan Tới Sản Phẩm
                  </MenuItem>
                  <MenuItem value="other">Khác</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  placeholder="Chúng tôi có thể giúp gì cho bạn?"
                  variant="outlined"
                  margin="normal"
                />

                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  fullWidth
                  startIcon={<SendIcon />}
                  sx={{ mt: 2 }}
                >
                  Gửi Tin
                </Button>
              </Box>
            </Box>
          </Grid>
        </Box>
      </Box>
      <Box sx={{ px: 2, py: 6, maxWidth: 800, mx: "auto" }}>
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
          FAQ
        </Typography>

        <Stack spacing={3} mt={4}>
          {faqs.map((faq, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: "#f9fafb",
                border: "1px solid #f0f0f0",
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {faq.question}
              </Typography>
              <Typography color="text.secondary">{faq.answer}</Typography>
            </Paper>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
