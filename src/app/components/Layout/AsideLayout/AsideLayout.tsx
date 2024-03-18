import { Navigation } from "@shopify/polaris";
import { AdjustIcon, ProfileIcon } from "@shopify/polaris-icons";
import { ItemProps, SubNavigationItem } from "@shopify/polaris/build/ts/src/components/Navigation/types";
import { useLocation } from "react-router-dom";
import { useAuth } from "src/app/hooks/authProvider";


export interface subLinks extends SubNavigationItem {
  role: boolean;
}

export interface NavigationItem extends ItemProps {
  role: boolean;
  subNavigationItems: subLinks[];
}

function AsideLayout() {
  const { roleUser } = useAuth();
  const pathname = useLocation().pathname;

  const roleuser = roleUser() || "";

  const listMenu: NavigationItem[] = [
    {
      url: "#",
      excludePaths: ["#"],
      label: "Usuários",
      icon: ProfileIcon,
      role: ["MASTER"].includes(roleuser),
      expanded: true,
      selected: true,
      subNavigationItems: [
        {
          url: "/fornecedores/list",
          disabled: false,
          label: "Usuários cadastrados",
          excludePaths: ["#"],
          matches: pathname === "/fornecedores/list",
          role: ["MASTER"].includes(roleuser),
        },
        {
          url: "/fornecedores/create",
          excludePaths: ["#"],
          disabled: false,
          label: "Novo usuário",
          matches: pathname === "/fornecedores/create",
          role: ["MASTER"].includes(roleuser),
        },
      ],
    },
    {
      url: "/empresas",
      excludePaths: ["#"],
      label: "Empresas",
      icon: AdjustIcon,
      role: ["MASTER"].includes(roleuser),
      selected: pathname.includes("empresas"),
      expanded: true,
      subNavigationItems: [
        {
          url: "/empresas/list",
          disabled: false,
          label: "Todas as empresas",
          excludePaths: ["#"],
          matches: pathname === "/empresas/list",
          role: ["MASTER"].includes(roleuser),
        },
      ],
    },
  ];

  const listMenuFiltered = listMenu.filter((item) => item.role);

  return (
      <Navigation location="/">
        <Navigation.Section items={listMenuFiltered} />
      </Navigation>
  );
}

export default AsideLayout;