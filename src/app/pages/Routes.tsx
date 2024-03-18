import { Navigate, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "../hooks/ProtectedRoute";
import LoginPage from "./auth/login";
import ResetPasswordPageToken from "./auth/resetPassordToken";
import ResetPasswordPage from "./auth/resetPassword";
import { ROUTER_FORNECEDORES } from "./fornecedores/routes-fornecedores";
import { ROUTER_BUSINESS } from "./business/routes-business";
import { ROUTER_PRODUCTS } from "./product/product-routes";

export const ROUTES = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Navigate to="/empresas/list" />,
      },
    ]
  },
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
  {
    path: "/auth/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/auth/reset-password/:id",
    element: <ResetPasswordPageToken />,
  },
  ...ROUTER_FORNECEDORES,
  ...ROUTER_BUSINESS,
  ...ROUTER_PRODUCTS,
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);


