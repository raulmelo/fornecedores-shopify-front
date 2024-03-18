import { TopBar, Text } from "@shopify/polaris";
import { ExitIcon } from "@shopify/polaris-icons";
import { useState, useCallback } from "react";
import { useAuth } from "src/app/hooks/authProvider";

export default function HeaderLayoutComponent() {
    const { authState, roleUser, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleIsUserMenuOpen = useCallback(
    () => setIsUserMenuOpen((isUserMenuOpen) => !isUserMenuOpen),
    []
  );


  const handleNavigationToggle = useCallback(() => {
    console.log("toggle navigation visibility");
  }, []);


  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={[
        {
          items: [{ 
            content: "Sair",
            icon: ExitIcon,
            onAction: () => {
              logout();
            }
          }
          ],
        }
      ]}
      name={authState.userInfo.name}
      detail={roleUser() ? (roleUser() as any) : "Visualizar"}
      initials={authState.userInfo.name[0]}
      open={isUserMenuOpen}
      onToggle={toggleIsUserMenuOpen}
    />
  );

 
  return (<TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
      logoSuffix={<Text variant="bodyMd" as="p" tone="subdued">Fornecedores</Text>}
      onNavigationToggle={handleNavigationToggle}
    />)
}
