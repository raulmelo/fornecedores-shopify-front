import './LayoutDashboard.scss'
import { Frame  } from "@shopify/polaris";
import AsideLayout from '../AsideLayout/AsideLayout';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'src/app/hooks/authProvider';
import HeaderLayoutComponent from "../headerLayout/index";
import ImageLogo from "src/assets/img/logo-lorem.svg";
export interface propsModel {
  title?: string,
  children?: any
}

const LayoutDashboard = (props: propsModel) => {
  const { isAuthenticated } = useAuth();
   

  const logo = {
    width: 86,
    topBarSource: ImageLogo,
    contextualSaveBarSource: ImageLogo,
    accessibilityLabel: "my_project",
  };

  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" />;
  }

return (
  <>
    <Frame 
      logo={logo} 
      navigation={<AsideLayout />}
      topBar={<HeaderLayoutComponent />}
    >
      {props.children}
    </Frame>
  </>
);
}

export default LayoutDashboard
