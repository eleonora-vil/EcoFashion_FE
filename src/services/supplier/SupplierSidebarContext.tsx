import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SupplierSidebarContextType {
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  setIsHovered: (hovered: boolean) => void;
}

const SupplierSidebarContext = createContext<SupplierSidebarContextType | undefined>(undefined);

export const useSupplierSidebar = () => {
  const context = useContext(SupplierSidebarContext);
  if (!context) {
    throw new Error('useSupplierSidebar must be used within SupplierSidebarProvider');
  }
  return context;
};

interface SupplierSidebarProviderProps {
  children: ReactNode;
}

export const SupplierSidebarProvider: React.FC<SupplierSidebarProviderProps> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const value: SupplierSidebarContextType = {
    isExpanded,
    isHovered,
    isMobileOpen,
    toggleSidebar,
    toggleMobileSidebar,
    setIsHovered,
  };

  return (
    <SupplierSidebarContext.Provider value={value}>
      {children}
    </SupplierSidebarContext.Provider>
  );
}; 