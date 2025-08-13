import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSupplierSidebar } from '../../services/supplier/SupplierSidebarContext';
import { 
  GridIcon, 
  BoxCubeIcon, 
  ListIcon, 
  BoxIcon, 
  PieChartIcon, 
  UserCircleIcon, 
  PlugInIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  HorizontaLDots,
  PlusIcon
} from '../../assets/icons/index.tsx';
import logo2 from '../../assets/pictures/homepage/logo2.png';

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Bảng Điều Khiển",
    path: "/supplier/dashboard",
  },
  {
    icon: <BoxCubeIcon />,
    name: "Vật Liệu",
    subItems: [
      { name: "Tất Cả Vật Liệu", path: "/supplier/dashboard/materials", pro: false },
      { name: "Thêm Vật Liệu", path: "/supplier/dashboard/materials/add", pro: false, new: true },
      { name: "Quản Lý Kho", path: "/supplier/dashboard/materials/inventory", pro: false },
    ],
  },
  {
    icon: <ListIcon />,
    name: "Đơn Hàng",
    subItems: [
      { name: "Tất Cả Đơn Hàng", path: "/supplier/dashboard/orders", pro: false },
      { name: "Đơn Hàng Chờ", path: "/supplier/dashboard/orders/pending", pro: false },
      { name: "Đơn Hàng Hoàn Thành", path: "/supplier/dashboard/orders/completed", pro: false },
    ],
  },
  {
    icon: <PieChartIcon />,
    name: "Phân Tích",
    subItems: [
      { name: "Phân Tích Bán Hàng", path: "/supplier/dashboard/analytics", pro: false },
      { name: "Báo Cáo Hiệu Suất", path: "/supplier/dashboard/analytics/performance", pro: false },
      { name: "Biểu Đồ Doanh Thu", path: "/supplier/dashboard/analytics/revenue", pro: false },
    ],
  },
];

const otherItems: NavItem[] = [
  {
    icon: <UserCircleIcon />,
    name: "Hồ Sơ",
    path: "/supplier/dashboard/profile",
  },
  {
    icon: <PlugInIcon />,
    name: "Cài Đặt",
    path: "/supplier/dashboard/settings",
  },
];

const SupplierSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSupplierSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : otherItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        } else if (nav.path && isActive(nav.path)) {
          submenuMatched = true;
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location.pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    const currentOpen = openSubmenu?.type === menuType && openSubmenu?.index === index;
    if (currentOpen) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu({ type: menuType, index });
    }
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="space-y-1">
      {items.map((nav, index) => {
        const hasSubItems = nav.subItems && nav.subItems.length > 0;
        const isSubmenuOpen = openSubmenu?.type === menuType && openSubmenu?.index === index;
        const isActiveItem = nav.path ? isActive(nav.path) : false;
        const hasActiveSubItem = hasSubItems && nav.subItems?.some(subItem => isActive(subItem.path));

        return (
          <li key={nav.name}>
            {hasSubItems ? (
              <div>
                <button
                  onClick={() => handleSubmenuToggle(index, menuType)}
                  className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isSubmenuOpen || hasActiveSubItem
                      ? "text-brand-500 bg-brand-50 dark:bg-brand-900/20 dark:text-brand-400"
                      : "text-gray-700 hover:text-brand-500 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-brand-400 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0">{nav.icon}</span>
                    <span className="truncate">{nav.name}</span>
                  </div>
                  {isSubmenuOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </button>
                <div
                  ref={(el) => {
                    subMenuRefs.current[`${menuType}-${index}`] = el;
                  }}
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: isSubmenuOpen ? `${subMenuHeight[`${menuType}-${index}`] || 0}px` : "0px",
                  }}
                >
                  <ul className="pl-9 mt-1 space-y-1">
                    {nav.subItems?.map((subItem) => (
                      <li key={subItem.path}>
                        <Link
                          to={subItem.path}
                          className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                            isActive(subItem.path)
                              ? "text-brand-500 bg-brand-50 dark:bg-brand-900/20 dark:text-brand-400"
                              : "text-gray-600 hover:text-brand-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-brand-400 dark:hover:bg-gray-800"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="truncate">{subItem.name}</span>
                            {subItem.new && (
                              <PlusIcon className="w-3 h-3 text-green-600" />
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {subItem.pro && (
                              <span className="px-1.5 py-0.5 text-xs font-medium text-brand-600 bg-brand-100 rounded dark:bg-brand-900/20 dark:text-brand-400">
                                PRO
                              </span>
                            )}
                            {subItem.new && (
                              <span className="px-1.5 py-0.5 text-xs font-medium text-green-600 bg-green-100 rounded dark:bg-green-900/20 dark:text-green-400">
                                NEW
                              </span>
                            )}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link
                to={nav.path || "#"}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActiveItem
                    ? "text-brand-500 bg-brand-50 dark:bg-brand-900/20 dark:text-brand-400"
                    : "text-gray-700 hover:text-brand-500 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-brand-400 dark:hover:bg-gray-800"
                }`}
              >
                <span className="flex-shrink-0">{nav.icon}</span>
                <span className="truncate">{nav.name}</span>
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <aside
        className={`fixed left-0 top-0 z-40 h-screen transition-transform ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${
          isExpanded || isHovered ? "w-[290px]" : "w-[90px]"
        } bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-800`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
            <Link to="/supplier/dashboard" className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <img
                  src={logo2}
                  alt="EcoFashion"
                  className="h-8 w-auto"
                />
              </div>
              {(isExpanded || isHovered) && (
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  EcoFashion
                </span>
              )}
            </Link>
            {(isExpanded || isHovered) && (
              <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <HorizontaLDots />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-6 px-4 py-6">
            {/* Main Navigation */}
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {(isExpanded || isHovered) && "Menu Chính"}
              </h3>
              {renderMenuItems(navItems, "main")}
            </div>

            {/* Other Navigation */}
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {(isExpanded || isHovered) && "Khác"}
              </h3>
              {renderMenuItems(otherItems, "others")}
            </div>
          </nav>

          {/* Footer */}
          {(isExpanded || isHovered) && (
            <div className="border-t border-gray-200 p-4 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-brand-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">S</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    Tên Nhà Cung Cấp
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    supplier@ecofashion.com
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default SupplierSidebar; 