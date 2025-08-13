import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface UIState {
  // Theme
  theme: Theme;
  toggleTheme: () => void;
  
  // Sidebar states
  supplierSidebar: {
    isExpanded: boolean;
    isHovered: boolean;
    isMobileOpen: boolean;
  };
  
  adminSidebar: {
    isExpanded: boolean;
    isHovered: boolean;
    isMobileOpen: boolean;
  };
  
  // Sidebar actions
  toggleSupplierSidebar: () => void;
  setSupplierSidebarHover: (hovered: boolean) => void;
  toggleSupplierMobileSidebar: () => void;
  
  toggleAdminSidebar: () => void;
  setAdminSidebarHover: (hovered: boolean) => void;
  toggleAdminMobileSidebar: () => void;
  
  // Notifications
  notifications: {
    isOpen: boolean;
    toggle: () => void;
  };
  
  // User menu
  userMenu: {
    isOpen: boolean;
    toggle: () => void;
  };
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'light',
      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        
        // Apply theme to document
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      
      // Sidebar states
      supplierSidebar: {
        isExpanded: true,
        isHovered: false,
        isMobileOpen: false,
      },
      
      adminSidebar: {
        isExpanded: true,
        isHovered: false,
        isMobileOpen: false,
      },
      
      // Supplier sidebar actions
      toggleSupplierSidebar: () => {
        const { supplierSidebar } = get();
        set({
          supplierSidebar: {
            ...supplierSidebar,
            isExpanded: !supplierSidebar.isExpanded,
          },
        });
      },
      
      setSupplierSidebarHover: (hovered: boolean) => {
        const { supplierSidebar } = get();
        set({
          supplierSidebar: {
            ...supplierSidebar,
            isHovered: hovered,
          },
        });
      },
      
      toggleSupplierMobileSidebar: () => {
        const { supplierSidebar } = get();
        set({
          supplierSidebar: {
            ...supplierSidebar,
            isMobileOpen: !supplierSidebar.isMobileOpen,
          },
        });
      },
      
      // Admin sidebar actions
      toggleAdminSidebar: () => {
        const { adminSidebar } = get();
        set({
          adminSidebar: {
            ...adminSidebar,
            isExpanded: !adminSidebar.isExpanded,
          },
        });
      },
      
      setAdminSidebarHover: (hovered: boolean) => {
        const { adminSidebar } = get();
        set({
          adminSidebar: {
            ...adminSidebar,
            isHovered: hovered,
          },
        });
      },
      
      toggleAdminMobileSidebar: () => {
        const { adminSidebar } = get();
        set({
          adminSidebar: {
            ...adminSidebar,
            isMobileOpen: !adminSidebar.isMobileOpen,
          },
        });
      },
      
      // Notifications
      notifications: {
        isOpen: false,
        toggle: () => {
          const { notifications } = get();
          set({
            notifications: {
              ...notifications,
              isOpen: !notifications.isOpen,
            },
          });
        },
      },
      
      // User menu
      userMenu: {
        isOpen: false,
        toggle: () => {
          const { userMenu } = get();
          set({
            userMenu: {
              ...userMenu,
              isOpen: !userMenu.isOpen,
            },
          });
        },
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        // Only persist theme and sidebar preferences
        theme: state.theme,
        supplierSidebar: {
          isExpanded: state.supplierSidebar.isExpanded,
        },
        adminSidebar: {
          isExpanded: state.adminSidebar.isExpanded,
        },
      }),
      onRehydrateStorage: () => (state) => {
        // Apply theme on hydration
        if (state?.theme) {
          if (state.theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },
    }
  )
); 