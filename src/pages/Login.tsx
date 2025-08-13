import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import LoginBanner from "../assets/pictures/login/login1.jpg";
import Logo from "../assets/pictures/homepage/logo.png";

const schema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(3, "Mật khẩu phải có ít nhất 3 ký tự"),
});

export default function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success("Đăng nhập thành công!");
      navigate(returnUrl);
    } catch (error) {
      toast.error(error.message || "Đăng nhập thất bại!");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="max-w-md w-full">
          <div className="flex flex-col items-center mb-6">
            <img
              src={Logo}
              alt="Logo"
              className="h-24 mb-2 cursor-pointer"
              onClick={() => navigate("/")}
            />
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Đăng nhập</h1>
            <p className="text-gray-500">Chào mừng bạn quay trở lại!</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <input
                type="password"
                placeholder="Mật khẩu"
                {...register("password")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>
          <div className="mt-4 text-center">
            <span className="text-gray-500">Chưa có tài khoản? </span>
            <Link to="/signup" className="text-green-600 font-bold hover:underline">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
      {/* Image Section */}
      <div className="hidden md:block md:w-1/2 h-screen overflow-hidden">
        <img
          src={LoginBanner}
          alt="Login Banner"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
