import React from 'react';
import { useAdminSidebar } from '../../services/admin/AdminSidebarContext';

const AdminBackdrop: React.FC = () => {
  const { isMobileOpen, toggleMobileSidebar } = useAdminSidebar();

  if (!isMobileOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
      onClick={toggleMobileSidebar}
      aria-label="Close sidebar"
    />
  );
};

export default AdminBackdrop; 