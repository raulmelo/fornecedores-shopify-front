import { Navigate, RouteObject } from "react-router-dom";
import { ProtectedRoute } from "src/app/hooks/ProtectedRoute";
import FornecedorListPage from "./fornecedorList";
import FornecedorCreatePage from "./fornecedorCreate";

export const ROUTER_FORNECEDORES: RouteObject[] = [
  {
    path: "fornecedores",
    element: <ProtectedRoute typeLayout="layoutDashboard" />,
    children: [
      {
        path: "list",
        Component: FornecedorListPage,
      },
      {
        path: "create",
        Component: FornecedorCreatePage,
      },
      {
        path: "*",
        element: <Navigate to="/fornecedores/list" />,
      },
    ],
  },
];
