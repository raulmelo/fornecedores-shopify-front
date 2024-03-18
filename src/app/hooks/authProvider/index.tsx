import React, { useEffect, useState } from "react";
import { UserCommonTypes, UserTypes } from "src/app/types/User.types";

import Cookie from "src/app/utilities/Cookie";
import { AuthContext, AuthState } from "./authProvider.types";
import { NAMES } from "src/app/constants/baseUrl";
import { AuthServices } from "src/app/api/Auth";
import { ROLES_TYPES } from "src/app/constants/roles";

const authContext = React.createContext({} as AuthContext);

export const AuthProvider: any= ({
  children,
}: any) => {
  const token = Cookie.getCookie(NAMES.TOKEN_NAME);
  const userInfo = Cookie.getCookie(NAMES.TOKEN_USER);

  const [loading, setLoading] = useState<boolean>(true);
  const [authState, setAuthState] = useState<AuthState>({
    token,
    userInfo: userInfo ? JSON.parse(userInfo) : {},
  });

  const myUser: UserCommonTypes | null = authState.userInfo;

  useEffect(() => {
    initial()
  }, []);

  const initial = async () => {
    if (token && userInfo) {
      setAuthState({ token, userInfo: JSON.parse(userInfo) });
      const userMe: any = await AuthServices.getUserMe();

      const getRole = userMe?.user?.role ?  userMe?.user : { ...userMe?.user, role: "USER"}

      setAuthState({
          token,
          userInfo: { ...authState.userInfo, ...getRole},
        });
    }
    setLoading(false);
  };

  

  const isAuthenticated = (): boolean => {
    if (!authState.token) return false;
    const hasToken = Cookie.getCookie(NAMES.TOKEN_NAME) ? true : false
    return hasToken;
  };

  const roleUser = (): ROLES_TYPES | null => {
    return authState.userInfo?.role;
  };



  const login = (token: string, user: UserTypes): any => {
    const userString = JSON.stringify(user);
    Cookie.setCookie(NAMES.TOKEN_NAME, token, 1);
    Cookie.setCookie(NAMES.TOKEN_USER, userString, 1);
    window.location.reload();
  };

  const logout = (): void => {
    Cookie.eraseCookie(NAMES.TOKEN_NAME);
    Cookie.eraseCookie(NAMES.TOKEN_USER);
    setAuthState({ token: null, userInfo: {} as UserCommonTypes });
    window.location.reload();
  };

  if (loading) {
    return <div></div>;
  }


  return (
    <authContext.Provider
      value={{
        authState,
        isAuthenticated,
        roleUser,
        myUser,
        login: (token: string, user: UserTypes) => login(token, user),
        logout,
      }}
    >
      {children}
    </authContext.Provider>
  );
};


export const useAuth = () => React.useContext(authContext);