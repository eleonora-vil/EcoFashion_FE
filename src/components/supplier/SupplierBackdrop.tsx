import React from 'react';
import { useSupplierSidebar } from '../../services/supplier/SupplierSidebarContext';

const SupplierBackdrop: React.FC = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSupplierSidebar();

  if (!isMobileOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
      onClick={toggleMobileSidebar}
      aria-label="Close sidebar"
    />
  );
};

export default SupplierBackdrop; 