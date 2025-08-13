import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AdminSidebarContextType {
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  setIsHovered: (hovered: boolean) => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextType | undefined>(undefined);

export const useAdminSidebar = () => {
  const context = useContext(AdminSidebarContext);
  if (!context) {
    throw new Error('useAdminSidebar must be used within AdminSidebarProvider');
  }
  return context;
};

interface AdminSidebarProviderProps {
  children: ReactNode;
}

export const AdminSidebarProvider: React.FC<AdminSidebarProviderProps> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const value: AdminSidebarContextType = {
    isExpanded,
    isHovered,
    isMobileOpen,
    toggleSidebar,
    toggleMobileSidebar,
    setIsHovered,
  };

  return (
    <AdminSidebarContext.Provider value={value}>
      {children}
    </AdminSidebarContext.Provider>
  );
}; 