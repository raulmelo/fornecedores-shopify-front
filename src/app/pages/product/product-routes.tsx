import { Navigate, RouteObject } from "react-router-dom";
import { ProtectedRoute } from "src/app/hooks/ProtectedRoute";
import ProductListPage from "./productList";
import ProductFormPage from "./productForm";

export const ROUTER_PRODUCTS: RouteObject[] = [
  {
    path: "produtos/:userId",
    element: <ProtectedRoute typeLayout="layoutDashboard" />,
    children: [
      {
        path: "list",
        Component: ProductListPage,
      },
      {
        path: "create",
        Component: ProductFormPage,
      },
      {
        path: "edit/:productId",
        Component: ProductFormPage,
      },
      {
        path: "*",
        element: <Navigate to="/empresas/list" />,
      },
    ],
  },
];
