import React from "react";
import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  allowedRoles,
}) => {
  const { user, isAuthenticated } = useAuthStore();

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (requiredRole) {
    if (user.role.toLowerCase() !== requiredRole.toLowerCase()) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Access Denied
              </h2>
              <p className="text-gray-600 mb-6">
                You don't have permission to access this page. Required role:{" "}
                <span className="font-semibold">{requiredRole}</span>
              </p>
              <p className="text-sm text-gray-500">
                Your current role:{" "}
                <span className="font-semibold">{user.role}</span>
              </p>
              <button
                onClick={() => window.history.back()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasAllowedRole = allowedRoles.some(
      (role) => user.role.toLowerCase() === role.toLowerCase()
    );
    if (!hasAllowedRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Access Denied
              </h2>
              <p className="text-gray-600 mb-6">
                You don't have permission to access this page. Allowed roles:{" "}
                <span className="font-semibold">
                  {allowedRoles.join(", ")}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Your current role:{" "}
                <span className="font-semibold">{user.role}</span>
              </p>
              <button
                onClick={() => window.history.back()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
