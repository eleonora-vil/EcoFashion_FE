import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminBackdrop from '../../components/admin/AdminBackdrop';
import { AdminSidebarProvider, useAdminSidebar } from '../../services/admin/AdminSidebarContext';
import '../../assets/css/dashboard.css'; // Changed import

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useAdminSidebar();

  return (
    <div className="dashboard-layout bg-gray-50 dark:bg-gray-900">
      <div className="dashboard-content-wrapper">
        <AdminSidebar />
        <AdminBackdrop />
        <div
          className={`dashboard-main transition-all duration-300 ease-in-out ${
            isExpanded || isHovered ? "expanded" : ""
          } ${isMobileOpen ? "ml-0" : ""}`}
        >
          <AdminHeader />
          <div className="dashboard-container">
            <div className="dashboard-content">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  return (
    <AdminSidebarProvider>
      <LayoutContent />
    </AdminSidebarProvider>
  );
};

export default AdminDashboard;
