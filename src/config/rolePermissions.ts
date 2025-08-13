// Role-based Access Control Configuration
// This file defines the permissions and access rules for different user roles

export interface RolePermission {
  role: string;
  displayName: string;
  description: string;
  allowedRoutes: string[];
  dashboardPath: string;
  profilePath: string;
}

export interface RoutePermission {
  path: string;
  requiredRole: string;
  allowedRoles?: string[];
  description: string;
}

// Role definitions with their permissions
export const ROLE_PERMISSIONS: RolePermission[] = [
  {
    role: 'admin',
    displayName: 'Administrator',
    description: 'Full system access with administrative privileges',
    allowedRoutes: [
      '/admin/dashboard',
      '/admin/dashboard/applications',
      '/admin/dashboard/users',
      '/admin/dashboard/designers',
      '/admin/dashboard/suppliers',
      '/admin/dashboard/customers',
      '/admin/dashboard/designs',
      '/admin/dashboard/designs/pending',
      '/admin/dashboard/designs/approved',
      '/admin/dashboard/materials',
      '/admin/dashboard/materials/pending',
      '/admin/dashboard/materials/approved',
      '/admin/dashboard/analytics/sales',
      '/admin/dashboard/analytics/users',
      '/admin/dashboard/analytics/designs',
      '/admin/dashboard/settings/general',
      '/admin/dashboard/settings/security',
      '/admin/dashboard/settings/notifications',
      '/admin/dashboard/profile',
      '/admin/profile'
    ],
    dashboardPath: '/admin/dashboard',
    profilePath: '/admin/profile'
  },
  {
    role: 'supplier',
    displayName: 'Supplier',
    description: 'Access to supplier dashboard and material management',
    allowedRoutes: [
      '/supplier/dashboard',
      '/supplier/dashboard/materials',
      '/supplier/dashboard/orders',
      '/supplier/dashboard/inventory',
      '/supplier/dashboard/analytics',
      '/supplier/dashboard/profile',
      '/supplier/dashboard/settings',
      '/supplier/profile'
    ],
    dashboardPath: '/supplier/dashboard',
    profilePath: '/supplier/profile'
  },
  {
    role: 'designer',
    displayName: 'Designer',
    description: 'Access to designer dashboard and design management',
    allowedRoutes: [
      '/designer/dashboard',
      '/designer/dashboard/add',
      '/designer/profile'
    ],
    dashboardPath: '/designer/dashboard',
    profilePath: '/designer/profile'
  },
  {
    role: 'customer',
    displayName: 'Customer',
    description: 'Access to customer profile and general features',
    allowedRoutes: [
      '/profile',
      '/fashion',
      '/detail/:id',
      '/brand/:id',
      '/material/:id',
      '/explore',
      '/explore/designers',
      '/explore/designers/:id',
      '/explore/suppliers',
      '/explore/suppliers/:id'
    ],
    dashboardPath: '/profile',
    profilePath: '/profile'
  },
  {
    role: 'user',
    displayName: 'User',
    description: 'Basic user access with limited features',
    allowedRoutes: [
      '/profile',
      '/fashion',
      '/detail/:id',
      '/brand/:id',
      '/material/:id',
      '/explore',
      '/explore/designers',
      '/explore/designers/:id',
      '/explore/suppliers',
      '/explore/suppliers/:id'
    ],
    dashboardPath: '/profile',
    profilePath: '/profile'
  }
];

// Route-specific permissions
export const ROUTE_PERMISSIONS: RoutePermission[] = [
  // Admin Routes
  {
    path: '/admin/dashboard',
    requiredRole: 'admin',
    description: 'Admin dashboard access'
  },
  {
    path: '/admin/profile',
    requiredRole: 'admin',
    description: 'Admin profile access'
  },
  
  // Supplier Routes
  {
    path: '/supplier/dashboard',
    requiredRole: 'supplier',
    description: 'Supplier dashboard access'
  },
  {
    path: '/supplier/profile',
    requiredRole: 'supplier',
    description: 'Supplier profile access'
  },
  
  // Designer Routes
  {
    path: '/designer/dashboard',
    requiredRole: 'designer',
    description: 'Designer dashboard access'
  },
  {
    path: '/designer/profile',
    requiredRole: 'designer',
    description: 'Designer profile access'
  },
  
  // Customer/User Routes
  {
    path: '/profile',
    requiredRole: 'customer',
    allowedRoles: ['customer', 'user'],
    description: 'Customer/User profile access'
  }
];

// Helper functions for role-based access control
export const getRolePermission = (role: string): RolePermission | undefined => {
  return ROLE_PERMISSIONS.find(r => r.role.toLowerCase() === role.toLowerCase());
};

export const hasRoutePermission = (userRole: string, routePath: string): boolean => {
  const rolePermission = getRolePermission(userRole);
  if (!rolePermission) return false;
  
  // Check if the route is in the allowed routes
  return rolePermission.allowedRoutes.some(allowedRoute => {
    // Handle dynamic routes with parameters
    const routePattern = allowedRoute.replace(/:\w+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(routePath);
  });
};

export const getDashboardPath = (role: string): string => {
  const rolePermission = getRolePermission(role);
  return rolePermission?.dashboardPath || '/';
};

export const getProfilePath = (role: string): string => {
  const rolePermission = getRolePermission(role);
  return rolePermission?.profilePath || '/profile';
};

export const getRoleDisplayName = (role: string): string => {
  const rolePermission = getRolePermission(role);
  return rolePermission?.displayName || role;
};

// Validation functions
export const isValidRole = (role: string): boolean => {
  return ROLE_PERMISSIONS.some(r => r.role.toLowerCase() === role.toLowerCase());
};

export const getAvailableRoles = (): string[] => {
  return ROLE_PERMISSIONS.map(r => r.role);
};

// Access control utilities
export const checkAccess = (userRole: string, targetRole: string): boolean => {
  return userRole.toLowerCase() === targetRole.toLowerCase();
};

export const getAccessDeniedMessage = (userRole: string, requiredRole: string): string => {
  const userDisplayName = getRoleDisplayName(userRole);
  const requiredDisplayName = getRoleDisplayName(requiredRole);
  
  return `Access denied. You are logged in as ${userDisplayName}, but this page requires ${requiredDisplayName} privileges.`;
}; 