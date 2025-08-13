import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdminSidebar } from '../../services/admin/AdminSidebarContext';
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
} from '../../assets/icons/index.tsx'; // Updated import path and icons
import logo2 from '../../assets/pictures/homepage/logo2.png';

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon className="w-6 h-6" />,
    name: "Bảng Điều Khiển",
    path: "/admin/dashboard",
  },
  {
    icon: <ListIcon className="w-6 h-6" />,
    name: "Đơn Đăng Ký",
    path: "/admin/dashboard/applications",
  },
  {
    icon: <UserCircleIcon className="w-6 h-6" />,
    name: "Người Dùng",
    subItems: [
      { name: "Tất Cả Người Dùng", path: "/admin/dashboard/users", pro: false },
      { name: "Nhà Thiết Kế", path: "/admin/dashboard/designers", pro: false },
      { name: "Nhà Cung Cấp", path: "/admin/dashboard/suppliers", pro: false },
      { name: "Khách Hàng", path: "/admin/dashboard/customers", pro: false },
    ],
  },
  {
    icon: <BoxIcon className="w-6 h-6" />,
    name: "Thiết Kế",
    subItems: [
      { name: "Tất Cả Thiết Kế", path: "/admin/dashboard/designs", pro: false },
      { name: "Chờ Phê Duyệt", path: "/admin/dashboard/designs/pending", pro: false },
      { name: "Đã Phê Duyệt", path: "/admin/dashboard/designs/approved", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon className="w-6 h-6" />,
    name: "Vật Liệu",
    subItems: [
      { name: "Tất Cả Loại Vật Liệu", path: "/admin/dashboard/material-types", pro: false },
      { name: "Tất Cả Vật Liệu", path: "/admin/dashboard/materials", pro: false },
      { name: "Chờ Phê Duyệt", path: "/admin/dashboard/materials/pending", pro: false },
      { name: "Đã Phê Duyệt", path: "/admin/dashboard/materials/approved", pro: false },
    ],
  },
];

const otherItems: NavItem[] = [
  {
    icon: <PieChartIcon className="w-6 h-6" />,
    name: "Phân Tích",
    subItems: [
      { name: "Báo Cáo Bán Hàng", path: "/admin/dashboard/analytics/sales", pro: false },
      { name: "Báo Cáo Kho Hàng", path: "/admin/dashboard/analytics/inventory", pro: false },
    ],
  },
  {
    icon: <PlugInIcon className="w-6 h-6" />,
    name: "Cài Đặt",
    subItems: [
      { name: "Cài Đặt Chung", path: "/admin/dashboard/settings/general", pro: false },
      { name: "Bảo Mật", path: "/admin/dashboard/settings/security", pro: false },
      { name: "Thông Báo", path: "/admin/dashboard/settings/notifications", pro: false },
    ],
  },
];

const AdminSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useAdminSidebar();
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
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

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
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`relative flex items-center w-full gap-3 px-3 py-2 font-medium rounded-lg text-theme-sm cursor-pointer min-w-0 ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="text-sm font-medium truncate">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-arrow flex-shrink-0 ${
                  openSubmenu?.type === menuType &&
                  openSubmenu?.index === index
                    ? "menu-item-arrow-active"
                    : "menu-item-arrow-inactive"
                }`}>
                  <ChevronDownIcon className="w-5 h-5 transition-transform duration-200" />
                </span>
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item min-w-0 ${
                  isActive(nav.path) 
                    ? "menu-item-active" 
                    : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="text-sm font-medium truncate">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{subItem.name}</span>
                        {subItem.new && (
                          <PlusIcon className="w-3 h-3 text-green-600" />
                        )}
                      </div>
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`menu-dropdown-badge ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            }`}
                          >
                            NEW
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`menu-dropdown-badge ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            }`}
                          >
                            PRO
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex h-16 items-center justify-between px-0 border-b border-gray-200 dark:border-gray-800">
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <img src={logo2} alt="EcoFashion" className="h-8 w-auto" />
          </div>
          {(isExpanded || isHovered || isMobileOpen) && (
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              EcoFashion
            </span>
          )}
        </Link>
        {(isExpanded || isHovered || isMobileOpen) && (
          <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <HorizontaLDots />
          </button>
        )}
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu Chính"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Khác"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(otherItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar; 