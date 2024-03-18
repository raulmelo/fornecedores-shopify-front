import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./authProvider";
import LayoutDashboard from "../components/Layout/LayoutDashboard/LayoutDashboard";

export interface ProtectedRouteProps {
  typeLayout?: 'layoutDashboard' | 'layoutAuth' | 'layoutEmpty';
}


export const ProtectedRoute = (props: ProtectedRouteProps) => {

  const { isAuthenticated } = useAuth();
  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" />;
  }

  if (props.typeLayout === 'layoutDashboard') {
    return (
      <LayoutDashboard>
        <Outlet />
      </LayoutDashboard>
    );
  }

  return <Outlet />;
};
