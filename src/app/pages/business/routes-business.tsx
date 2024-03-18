import { Navigate, RouteObject } from "react-router-dom";
import { ProtectedRoute } from "src/app/hooks/ProtectedRoute";
import BusinessCreatePage from "./businessCreate";


export const ROUTER_BUSINESS: RouteObject[] = [
  {
    path: "empresas",
    element: <ProtectedRoute typeLayout="layoutDashboard" />,
    children: [
      {
        path: "list",
        Component: BusinessCreatePage,
      },
      {
        path: "*",
        element: <Navigate to="/empresas/list" />,
      },
    ],
  },
];
