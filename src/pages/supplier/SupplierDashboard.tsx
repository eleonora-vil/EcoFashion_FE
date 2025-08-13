import React from 'react';
import { Outlet } from 'react-router-dom';
import SupplierHeader from '../../components/supplier/SupplierHeader';
import SupplierSidebar from '../../components/supplier/SupplierSidebar';
import SupplierBackdrop from '../../components/supplier/SupplierBackdrop';
import { SupplierSidebarProvider, useSupplierSidebar } from '../../services/supplier/SupplierSidebarContext';
import '../../assets/css/dashboard.css';
import ErrorBoundary from '../../components/common/ErrorBoundary';

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSupplierSidebar();

  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center text-gray-600 dark:text-gray-300">
            <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-transparent rounded-full mx-auto mb-3" />
            Đang tải dashboard...
          </div>
        </div>
      }
    >
      <div className="dashboard-layout bg-gray-50 dark:bg-gray-900">
        <div className="dashboard-content-wrapper">
          <SupplierSidebar />
          <SupplierBackdrop />
          <div
            className={`dashboard-main transition-all duration-300 ease-in-out ${
              isExpanded || isHovered ? "expanded" : ""
            } ${isMobileOpen ? "ml-0" : ""}`}
          >
            <SupplierHeader />
            <div className="dashboard-container">
              <div className="dashboard-content">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

const SupplierDashboard: React.FC = () => {
  return (
    <SupplierSidebarProvider>
      <LayoutContent />
    </SupplierSidebarProvider>
  );
};

export default SupplierDashboard; 