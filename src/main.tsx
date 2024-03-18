import React from 'react'
import ReactDOM from 'react-dom/client'
import './app/styles/tailwind.css';
import './app/styles/global.scss';
import "@shopify/polaris/build/esm/styles.css";
import { RouterProvider } from 'react-router-dom';
import { ROUTES } from './app/pages/Routes.tsx';
import { AuthProvider } from './app/hooks/authProvider';
import PTBrTranslations from "@shopify/polaris/locales/pt-BR.json";
import { AppProvider } from "@shopify/polaris";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider i18n={PTBrTranslations}>
      <AuthProvider>
        <RouterProvider router={ROUTES} />
      </AuthProvider>
    </AppProvider>
  </React.StrictMode>
);
