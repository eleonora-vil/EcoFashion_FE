import type { Product } from "../components/products/ProductCard";

// Sample product data
export const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Đầm Cổ Tròn",
    price: "1.800.000đ",
    originalPrice: "2.200.000đ",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop",
    badge: "NEW",
    sale: true,
  },
  {
    id: 2,
    name: "Áo Thun Tái Chế",
    price: "1.500.000đ",
    originalPrice: "1.800.000đ",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop",
    badge: "ECO",
    sale: true,
  },
  {
    id: 3,
    name: "Chân Váy Maxi",
    price: "1.600.000đ",
    originalPrice: "2.000.000đ",
    rating: 4.2,
    image:
      "https://images.unsplash.com/photo-1583496661160-fb5886a13d14?w=300&h=400&fit=crop",
    badge: "SALE",
    sale: true,
  },
];

export const bestSellerProducts: Product[] = [
  {
    id: 4,
    name: "Đầm Cổ Tròn",
    price: "1.800.000đ",
    originalPrice: "2.200.000đ",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop",
    badge: "BEST",
  },
  {
    id: 5,
    name: "Áo Thun Tái Chế",
    price: "1.500.000đ",
    originalPrice: "1.800.000đ",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1544441893-675973e31985?w=300&h=400&fit=crop",
    badge: "HOT",
  },
  {
    id: 6,
    name: "Chân Váy Maxi",
    price: "1.600.000đ",
    originalPrice: "2.000.000đ",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&h=400&fit=crop",
    badge: "NEW",
  },
];

export const stats = [
  { value: "500+", label: "Nhà Thiết Kế" },
  { value: "400+", label: "Vật Liệu Tái Chế" },
  { value: "5000+", label: "Sản Phẩm" },
  { value: "120t", label: "Vật Liệu Được Tái Chế" },
];

// Welcome message configuration
export interface WelcomeMessage {
  greeting: string;
  subtitle: string;
  actions: Array<{
    text: string;
    variant: "contained" | "outlined";
    link?: string;
  }>;
}

export const getWelcomeMessageByRole = (
  role: string,
  userName: string
): WelcomeMessage => {
  switch (role.toLowerCase()) {
    case "designer":
      return {
        greeting: `Chào mừng trở lại, ${userName}! 🎨`,
        subtitle:
          "Bạn đã sẵn sàng tạo ra những thiết kế bền vững tuyệt vời chưa?",
        actions: [
          {
            text: "Quản Lý Thiết Kế",
            variant: "contained",
            link: "/designer/profile",
          },
          { text: "Tạo Sản Phẩm Mới", variant: "outlined" },
        ],
      };
    case "admin":
      return {
        greeting: `Chào mừng Admin ${userName}! ⚡`,
        subtitle: "Quản lý hệ thống EcoFashion một cách hiệu quả",
        actions: [
          {
            text: "Bảng Điều Khiển",
            variant: "contained",
            link: "/admin/dashboard",
          },
          { text: "Quản Lý Users", variant: "outlined" },
        ],
      };
    case "supplier":
      return {
        greeting: `Chào mừng ${userName}! 📦`,
        subtitle: "Cung cấp nguyên liệu bền vững cho cộng đồng thời trang",
        actions: [
          {
            text: "Hồ Sơ Nhà Cung Cấp",
            variant: "contained",
            link: "/supplier/profile",
          },
          { text: "Quản Lý Kho", variant: "outlined" },
        ],
      };
    default:
      return {
        greeting: `Chào mừng trở lại, ${userName}! 👋`,
        subtitle:
          "Khám phá thời trang bền vững và tìm những sản phẩm yêu thích",
        actions: [
          { text: "Bắt Đầu Mua Sắm", variant: "contained" },
          { text: "Khám Phá Sản Phẩm", variant: "outlined" },
        ],
      };
  }
};
