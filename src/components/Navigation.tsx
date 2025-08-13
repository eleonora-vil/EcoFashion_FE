import React, { useState, useEffect } from "react";
import CartWithPopup from "./cart/CartWithPopup";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/authStore";
import { useUIStore } from "../store/uiStore";
import { useCartStore } from "../store/cartStore";
// ...existing code...
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import Avatar from "./common/Avatar";

// Icons
const MenuIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    className="w-4 h-4 group-hover:text-ecofashion-dark transition-colors duration-200"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

// HeartIcon => Heroicons outline

const ChevronDownIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const DashboardIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

const DesingerApplyIcon = () => (
  <svg
    enable-background="new 0 0 48 48"
    height="25px"
    width="25px"
    version="1.1"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Expanded">
      <g>
        <g>
          <path d="M43,48H29c-0.553,0-1-0.448-1-1V1c0-0.552,0.447-1,1-1h14c0.553,0,1,0.448,1,1v46C44,47.552,43.553,48,43,48z M30,46h12     V2H30V46z" />
        </g>
        <g>
          <rect height="2" width="5" x="29" y="8" />
        </g>
        <g>
          <rect height="2" width="5" x="29" y="14" />
        </g>
        <g>
          <rect height="2" width="5" x="29" y="20" />
        </g>
        <g>
          <rect height="2" width="5" x="29" y="26" />
        </g>
        <g>
          <rect height="2" width="5" x="29" y="32" />
        </g>
        <g>
          <rect height="2" width="5" x="29" y="38" />
        </g>
        <g>
          <path d="M15,46h-4c-2.757,0-5-2.243-5-5V12c0-0.197,0.059-0.391,0.168-0.555l6-9c0.371-0.557,1.293-0.557,1.664,0l6,9     C19.941,11.609,20,11.803,20,12v29C20,43.757,17.757,46,15,46z M8,12.303V41c0,1.654,1.346,3,3,3h4c1.654,0,3-1.346,3-3V12.303     l-5-7.5L8,12.303z" />
        </g>
        <g>
          <path d="M19,40H7c-0.553,0-1-0.448-1-1s0.447-1,1-1h12c0.553,0,1,0.448,1,1S19.553,40,19,40z" />
        </g>
        <g>
          <path d="M19,36H7c-0.553,0-1-0.448-1-1s0.447-1,1-1h12c0.553,0,1,0.448,1,1S19.553,36,19,36z" />
        </g>
        <g>
          <path d="M11,36c-0.553,0-1-0.448-1-1V16c0-0.552,0.447-1,1-1s1,0.448,1,1v19C12,35.552,11.553,36,11,36z" />
        </g>
        <g>
          <path d="M15,36c-0.553,0-1-0.448-1-1V16c0-0.552,0.447-1,1-1s1,0.448,1,1v19C16,35.552,15.553,36,15,36z" />
        </g>
        <g>
          <rect height="2" width="6" x="10" y="7" />
        </g>
        <g>
          <path d="M10,17c-2.206,0-4-1.794-4-4c0-0.552,0.447-1,1-1s1,0.448,1,1c0,1.103,0.897,2,2,2s2-0.897,2-2c0-0.552,0.447-1,1-1     s1,0.448,1,1C14,15.206,12.206,17,10,17z" />
        </g>
        <g>
          <path d="M16,17c-2.206,0-4-1.794-4-4c0-0.552,0.447-1,1-1s1,0.448,1,1c0,1.103,0.897,2,2,2s2-0.897,2-2c0-0.552,0.447-1,1-1     s1,0.448,1,1C20,15.206,18.206,17,16,17z" />
        </g>
      </g>
    </g>
  </svg>
);

const SupplierApplyIcon = () => (
  <svg
    height="8.4666mm"
    width="8.4666mm"
    viewBox="0 0 846.66 846.66"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      shapeRendering: "geometricPrecision",
      textRendering: "geometricPrecision",
      fillRule: "evenodd",
      clipRule: "evenodd",
    }}
  >
    <path
      fill="black"
      fillRule="nonzero"
      d="M30.34 499.57h172.27l167.76-72c3.17-1.35 6.49-1.84 9.7-1.59 65.51 5.21 84.41 48.67 68.57 108-0.98 3.65-2.87 6.8-5.35 9.28l-46.74 50.63 108.8 3.7 217.03-118.17c3.82-2.08 8.01-2.82 12.03-2.39 156.65 16.82 106.56 120.42 29.76 200.16-1.75 1.82-3.75 3.24-5.89 4.28L552.89 799.2c-3.4 1.68-7.05 2.33-10.58 2.08l-304.18-16.14H61.73c-11.42 0-20.68-9.26-20.68-20.68V520.26c0-11.43 9.26-20.69 20.68-20.69zm126.27 41.37v202.72h51.18l300.26 15.93 228.86-113.66c48.78-51.17 104.58-113.78-0.62-127.23L520.3 656.83c-3.22 1.87-6.98 2.88-10.96 2.76l-158.39-5.38c-5.13 0.1-10.29-1.7-14.36-5.45-8.38-7.71-8.93-20.77-1.21-29.16l74.28-80.46c6.97-29.52 4.47-46.88-28.29-50.89l-165.42 71c-2.84 1.47-6.06 2.3-9.48 2.3h-50.13zm-41.37 202.72V540.94H51.03v202.72h64.21zm511.47-683.8l36.28 112.4h118.31c20.04 0 28.05 25.69 12.09 37.29l-95.79 69.37 36.77 112.43c6.45 19.83-17.34 35.42-33.02 22.1l-94.32-68.81-95.58 69.73c-16.2 11.79-37.78-4.25-31.7-23.01l36.71-112.44-95.82-69.33c-16.85-12.22-6.89-38.78 13.6-37.33h116.83l36.33-112.54c6.17-19.22 33.35-18.82 39.31 0.14zm1.64 139.34l-21.32-66.05-21.32 66.05c-2.68 8.29-10.45 14.3-19.63 14.3H461.3l56.26 40.7c7.05 5.12 10.35 14.37 7.51 23.11l-21.6 66.05 55.77-40.69c7.05-5.36 17.05-5.72 24.58-0.24l56.11 40.93-21.36-65.33c-3.1-8.46-0.38-18.28 7.28-23.83l56.25-40.7h-68.48c-9.08 0.43-17.69-5.23-20.6-14.3z"
    />
  </svg>
);

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  // Zustand stores
  const {
    user,
    logout,
    getAvatarUrl,
    getInitials,
    getDisplayName,
    isAdmin,
    isSupplier,
    isCustomer,
    isDesigner,
  } = useAuthStore();

  const { userMenu, notifications } = useUIStore();

  // Subscribe to items so Navigation re-renders on cart change
  const [cartOpen, setCartOpen] = useState(false);
  // Cart logic moved to PopupCart

  // Local state
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [shopDropdownVisible, setShopDropdownVisible] = useState(false);
  const shopDropdownTimer = React.useRef<NodeJS.Timeout | null>(null);
  const [exploreMenuOpen, setExploreMenuOpen] = useState(false);
  const [exploreDropdownVisible, setExploreDropdownVisible] = useState(false);
  const exploreDropdownTimer = React.useRef<NodeJS.Timeout | null>(null);

  // Scroll effect
  useEffect(() => {
    if (!isHome) return;
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      toast.success("Đăng xuất thành công!", { position: "top-center" });
    } catch (error: any) {
      toast.error("Lỗi khi đăng xuất", { position: "bottom-center" });
    }
  };

  // Navigation handlers
  const handleAuth = (type: string) => {
    const userRole = user?.role?.toLowerCase();
    switch (type) {
      case "signup":
        navigate("/signup");
        break;
      case "login":
        navigate("/login");
        break;
      case "applydesigner":
        navigate("/apply/designer");
        break;
      case "applysupplier":
        navigate("/apply/supplier");
        break;
      case "user-profile":
        if (userRole === "designer") navigate("/designer/profile");
        else if (userRole === "supplier") navigate("/supplier/profile");
        else if (userRole === "admin") navigate("/admin/dashboard");
        else navigate("/profile");
        break;
      case "designer-dashboard":
        navigate("/designer/dashboard");
        break;
      case "admin-dashboard":
        navigate("/admin/dashboard");
        break;
      case "admin-applications":
        navigate("/admin/applications");
        break;
      case "supplier-dashboard":
        navigate("/supplier/dashboard");
        break;
      case "supplier-profile":
        navigate("/supplier/profile");
        break;
      case "my-applications":
        navigate("/my-applications");
        break;
      case "explore-designers":
        navigate("/explore/designers");
        break;
      case "explore-suppliers":
        navigate("/explore/suppliers");
        break;
      case "fashion":
        navigate("/fashion");
        break;
    }
  };

  // Get menu items by role
  const getMenuItems = () => {
    if (!user) return [];
    const role = user.role?.toLowerCase();
    const menuItems = [];

    switch (role) {
      case "designer":
        menuItems.push(
          {
            label: "Hồ Sơ Designer",
            path: "/designer/profile",
            icon: <UserIcon />,
          },
          {
            label: "Sản Phẩm Cá Nhân",
            path: "/designer/products",
            icon: <DashboardIcon />,
          },
          {
            label: "Bảng Điều Khiển",
            path: "/designer/dashboard",
            icon: <DashboardIcon />,
          }
        );
        break;
      case "admin":
        menuItems.push(
          {
            label: "Bảng Điều Khiển",
            path: "/admin/dashboard",
            icon: <DashboardIcon />,
          },
          {
            label: "Quản Lý Đơn Đăng Ký",
            path: "/admin/applications",
            icon: <DashboardIcon />,
          },
          { label: "Quản Lý Users", path: "/admin/users", icon: <UserIcon /> }
        );
        break;
      case "supplier":
        menuItems.push(
          {
            label: "Hồ Sơ Nhà Cung Cấp",
            path: "/supplier/profile",
            icon: <UserIcon />,
          },
          {
            label: "Bảng Điều Khiển",
            path: "/supplier/dashboard",
            icon: <DashboardIcon />,
          }
        );
        break;
      case "customer":
      case "user":
      default:
        menuItems.push(
          { label: "Hồ Sơ Cá Nhân", path: "/profile", icon: <UserIcon /> },
          { label: "Đơn Hàng", path: "/orders", icon: <DashboardIcon /> }
        );
        break;
    }

    if (role !== "admin") {
      menuItems.push({
        label: "Xem đơn đăng ký",
        path: "/my-applications",
        icon: <DashboardIcon />,
      });
    }

    if (role !== "designer" && role !== "admin" && role !== "supplier") {
      menuItems.push({
        label: "Đăng ký làm Nhà Thiết Kế",
        path: "/apply/designer",
        icon: <DesingerApplyIcon />,
      });
    }

    if (role !== "supplier" && role !== "admin" && role !== "designer") {
      menuItems.push({
        label: "Đăng ký làm Nhà Cung Cấp",
        path: "/apply/supplier",
        icon: <SupplierApplyIcon />,
      });
    }

    return menuItems;
  };

  const mainMenuItems = [
    { label: "TRANG CHỦ", path: "/" },
    { label: "CỬA HÀNG", path: "/fashion" },
    { label: "KHÁM PHÁ", path: "/explore" },
    { label: "THÔNG TIN KINH DOANH", path: "/businessinfor" },
    { label: "VỀ CHÚNG TÔI", path: "/about" },
    { label: "LIÊN LẠC", path: "/contact" },
  ];

  return (
    <nav
      className={`relative top-0 left-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? "bg-white shadow-lg text-gray-900"
          : "bg-white/5 text-white"
      }`}
    >
      <div className="w-full px-4 sm:px-8 lg:px-16">
        <div className="w-full flex justify-between items-center h-16 gap-2">
          {/* Logo */}
          <div className="flex items-center mr-2">
            <Link to="/" className="flex items-center space-x-1">
              <img
                src="/src/assets/pictures/homepage/logo2.png"
                alt="EcoFashion Logo"
                className="h-16 w-auto transition-transform duration-300 hover:scale-105"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center flex-nowrap w-auto space-x-6 p-0 m-0 justify-center">
            {/* Main Navigation */}
            <div className="flex items-center flex-nowrap w-auto space-x-5 p-0 m-0 justify-center">
              <Link
                to="/"
                className={`navbar-link uppercase tracking-wide px-2 py-1 transition-all duration-300 ${
                  scrolled || !isHome ? "text-gray-900" : "text-white"
                }`}
              >
                TRANG CHỦ
              </Link>

              {/* Shop Menu */}
              <div className="relative">
                <button
                  onMouseEnter={() => {
                    if (shopDropdownTimer.current)
                      clearTimeout(shopDropdownTimer.current);
                    setShopMenuOpen(true);
                    setShopDropdownVisible(true);
                  }}
                  onMouseLeave={() => {
                    shopDropdownTimer.current = setTimeout(() => {
                      setShopDropdownVisible(false);
                      setShopMenuOpen(false);
                    }, 500);
                  }}
                  onClick={() => {
                    setShopMenuOpen(!shopMenuOpen);
                    setShopDropdownVisible(!shopMenuOpen);
                  }}
                  className={`navbar-link flex items-center space-x-1 uppercase tracking-wide px-2 py-1 transition-all duration-300 ${
                    scrolled || !isHome ? "text-gray-900" : "text-white"
                  }`}
                >
                  <span>CỬA HÀNG</span>
                  <ChevronDownIcon />
                </button>
                <div
                  className={`absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-50 transition-opacity duration-500 ${
                    shopDropdownVisible && shopMenuOpen
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  }`}
                  onMouseEnter={() => {
                    if (shopDropdownTimer.current)
                      clearTimeout(shopDropdownTimer.current);
                    setShopDropdownVisible(true);
                  }}
                  onMouseLeave={() => {
                    shopDropdownTimer.current = setTimeout(() => {
                      setShopDropdownVisible(false);
                      setShopMenuOpen(false);
                    }, 500);
                  }}
                >
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShopMenuOpen(false);
                        setShopDropdownVisible(false);
                        handleAuth("fashion");
                      }}
                      className="dropdown-item block w-full text-left px-4 py-2 text-base text-gray-700 transition-all duration-200 rounded-lg"
                    >
                      Thời Trang
                    </button>
                    <button
                      onClick={() => {
                        setShopMenuOpen(false);
                        setShopDropdownVisible(false);
                        handleAuth("material");
                      }}
                      className="dropdown-item block w-full text-left px-4 py-2 text-base text-gray-700 transition-all duration-200 rounded-lg"
                    >
                      Vật Liệu
                    </button>
                  </div>
                </div>
              </div>

              {/* Explore Menu */}
              <div className="relative">
                <button
                  onMouseEnter={() => {
                    if (exploreDropdownTimer.current)
                      clearTimeout(exploreDropdownTimer.current);
                    setExploreMenuOpen(true);
                    setExploreDropdownVisible(true);
                  }}
                  onMouseLeave={() => {
                    exploreDropdownTimer.current = setTimeout(() => {
                      setExploreDropdownVisible(false);
                      setExploreMenuOpen(false);
                    }, 500);
                  }}
                  onClick={() => {
                    setExploreMenuOpen(!exploreMenuOpen);
                    setExploreDropdownVisible(!exploreMenuOpen);
                  }}
                  className={`navbar-link flex items-center space-x-1 uppercase tracking-wide px-2 py-1 transition-all duration-300 ${
                    scrolled || !isHome ? "text-gray-900" : "text-white"
                  }`}
                >
                  <span>KHÁM PHÁ</span>
                  <ChevronDownIcon />
                </button>
                <div
                  className={`absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-50 transition-opacity duration-500 ${
                    exploreDropdownVisible && exploreMenuOpen
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  }`}
                  onMouseEnter={() => {
                    if (exploreDropdownTimer.current)
                      clearTimeout(exploreDropdownTimer.current);
                    setExploreDropdownVisible(true);
                  }}
                  onMouseLeave={() => {
                    exploreDropdownTimer.current = setTimeout(() => {
                      setExploreDropdownVisible(false);
                      setExploreMenuOpen(false);
                    }, 500);
                  }}
                >
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setExploreMenuOpen(false);
                        setExploreDropdownVisible(false);
                        handleAuth("explore-designers");
                      }}
                      className="dropdown-item block w-full text-left px-4 py-2 text-base text-gray-700 transition-all duration-200 rounded-lg"
                    >
                      Nhà Thiết Kế
                    </button>
                    <button
                      onClick={() => {
                        setExploreMenuOpen(false);
                        setExploreDropdownVisible(false);
                        handleAuth("explore-suppliers");
                      }}
                      className="dropdown-item block w-full text-left px-4 py-2 text-base text-gray-700 transition-all duration-200 rounded-lg"
                    >
                      Nhà Cung Cấp
                    </button>
                  </div>
                </div>
              </div>

              <Link
                to="/businessinfor"
                className={`navbar-link uppercase tracking-wide px-2 py-1 transition-all duration-300 ${
                  scrolled || !isHome ? "text-gray-900" : "text-white"
                }`}
              >
                THÔNG TIN KINH DOANH
              </Link>

              <Link
                to="/about"
                className={`navbar-link uppercase tracking-wide px-2 py-1 transition-all duration-300 ${
                  scrolled || !isHome ? "text-gray-900" : "text-white"
                }`}
              >
                VỀ CHÚNG TÔI
              </Link>

              <Link
                to="/contact"
                className={`navbar-link uppercase tracking-wide px-2 py-1 transition-all duration-300 ${
                  scrolled || !isHome ? "text-gray-900" : "text-white"
                }`}
                style={{ whiteSpace: "nowrap" }}
              >
                LIÊN LẠC
              </Link>
            </div>
          </div>

          {/* Right side - Icons and User */}
          <div className="flex items-center space-x-2 ml-2">
            {/* Icons */}
            <CartWithPopup />
            <button
              className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                scrolled || !isHome ? "text-gray-700" : "text-white"
              }`}
            >
              <HeartOutlineIcon className="w-6 h-6 text-inherit hover:text-pink-500 transition duration-200" />
            </button>

            {/* User Section */}
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Avatar
                    src={getAvatarUrl()}
                    alt={getDisplayName()}
                    fallbackText={getInitials()}
                    size="md"
                  />
                  <div className="hidden md:block text-left">
                    <p
                      className={`text-sm font-medium ${
                        scrolled || !isHome ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {getDisplayName()}
                    </p>
                    <p
                      className={`text-xs ${
                        scrolled || !isHome ? "text-gray-600" : "text-gray-200"
                      }`}
                    >
                      {user.role}
                    </p>
                  </div>
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={userMenu.toggle}
                    className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                      scrolled || !isHome ? "text-gray-700" : "text-white"
                    }`}
                  >
                    <ChevronDownIcon />
                  </button>

                  {userMenu.isOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="py-2 ">
                        {/* Profile Link */}
                        <button
                          onClick={() => {
                            userMenu.toggle();
                            handleAuth("user-profile");
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <UserIcon />
                          <span className="ml-3">Trang Cá Nhân</span>
                        </button>

                        {/* Role-specific Menu Items */}
                        {isAdmin() && (
                          <>
                            <button
                              onClick={() => {
                                userMenu.toggle();
                                handleAuth("admin-dashboard");
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <DashboardIcon />
                              <span className="ml-3">Quản Trị Hệ Thống</span>
                            </button>
                            <button
                              onClick={() => {
                                userMenu.toggle();
                                handleAuth("admin-applications");
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <DashboardIcon />
                              <span className="ml-3">Quản Lý Đơn Đăng Ký</span>
                            </button>
                          </>
                        )}

                        {isDesigner() && (
                          <button
                            onClick={() => {
                              userMenu.toggle();
                              handleAuth("designer-dashboard");
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <DashboardIcon />
                            <span className="ml-3">Bảng Điều Khiển</span>
                          </button>
                        )}

                        {isSupplier() && (
                          <button
                            onClick={() => {
                              userMenu.toggle();
                              handleAuth("supplier-dashboard");
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <DashboardIcon />
                            <span className="ml-3">Bảng Điều Khiển</span>
                          </button>
                        )}

                        {/* Show application menus for customers/users */}
                        {(isCustomer() || user.role === "user") && (
                          <>
                            <button
                              onClick={() => {
                                userMenu.toggle();
                                handleAuth("applydesigner");
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <DesingerApplyIcon />
                              <span className="ml-3">
                                Đăng Ký Làm Nhà Thiết Kế
                              </span>
                            </button>
                            <button
                              onClick={() => {
                                userMenu.toggle();
                                handleAuth("applysupplier");
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <SupplierApplyIcon />
                              <span className="ml-3">
                                Đăng Ký Làm Nhà Cung Cấp
                              </span>
                            </button>
                          </>
                        )}

                        {/* My Applications */}
                        {user.role !== "admin" && user.role !== "designer" && (
                          <button
                            onClick={() => {
                              userMenu.toggle();
                              handleAuth("my-applications");
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <DashboardIcon />
                            <span className="ml-3">Đơn Đăng Ký Của Tôi</span>
                          </button>
                        )}

                        <hr className="my-2 border-gray-200" />

                        {/* Settings and Logout */}
                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <SettingsIcon />
                          <span className="ml-3">Cài Đặt</span>
                        </button>

                        <button
                          onClick={() => {
                            userMenu.toggle();
                            handleLogout();
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <LogoutIcon />
                          <span className="ml-3">Đăng Xuất</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`px-4 py-2 border border-current rounded-lg hover:bg-white hover:text-gray-900 transition-colors ${
                    scrolled || !isHome
                      ? "text-gray-900 border-gray-900"
                      : "text-white border-white"
                  }`}
                >
                  Đăng Nhập
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-6 space-y-4">
            {/* Main menu items */}
            {mainMenuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="block text-gray-700 hover:text-brand-500 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* User menu items */}
            {user &&
              getMenuItems().map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="w-full flex items-center space-x-3 text-gray-700 hover:text-brand-500 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
